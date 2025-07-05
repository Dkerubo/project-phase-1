import { supabase } from './supabase'
import { Database } from './supabase'
import { v4 as uuidv4 } from 'uuid'

type User = Database['public']['Tables']['users']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']
type UserDevice = Database['public']['Tables']['user_devices']['Row']
type UserSession = Database['public']['Tables']['user_sessions']['Row']

export interface AuthUser extends User {
  subscription?: Subscription
  payment_methods?: PaymentMethod[]
  devices?: UserDevice[]
  active_sessions?: UserSession[]
}

export class AuthService {
  private static instance: AuthService
  private currentUser: AuthUser | null = null
  private deviceId: string
  private maxDevicesPerUser = 4

  private constructor() {
    this.deviceId = this.getOrCreateDeviceId()
    this.initializeAuth()
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  private getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return uuidv4()
    
    let deviceId = localStorage.getItem('francilia_device_id')
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('francilia_device_id', deviceId)
    }
    return deviceId
  }

  private async initializeAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await this.loadUserData(session.user.id)
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await this.loadUserData(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null
        await this.deactivateCurrentSession()
      }
    })
  }

  private async loadUserData(userId: string) {
    try {
      // Load user with related data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          subscriptions(*),
          payment_methods(*),
          user_devices(*),
          user_sessions(*)
        `)
        .eq('id', userId)
        .single()

      if (userError) throw userError

      this.currentUser = user as AuthUser
      await this.updateLastLogin()
      await this.registerCurrentDevice()
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  private async updateLastLogin() {
    if (!this.currentUser) return

    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.currentUser.id)
  }

  private async registerCurrentDevice() {
    if (!this.currentUser) return

    const deviceInfo = this.getDeviceInfo()
    
    // Check if device already exists
    const { data: existingDevice } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .eq('device_id', this.deviceId)
      .single()

    if (existingDevice) {
      // Update existing device
      await supabase
        .from('user_devices')
        .update({
          last_used: new Date().toISOString(),
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingDevice.id)
    } else {
      // Check device limit
      const { data: userDevices } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', this.currentUser.id)
        .eq('is_active', true)

      if (userDevices && userDevices.length >= this.maxDevicesPerUser) {
        throw new Error(`Maximum ${this.maxDevicesPerUser} devices allowed per account`)
      }

      // Register new device
      await supabase
        .from('user_devices')
        .insert({
          user_id: this.currentUser.id,
          device_id: this.deviceId,
          device_name: deviceInfo.name,
          device_type: deviceInfo.type,
          user_agent: deviceInfo.userAgent,
          ip_address: deviceInfo.ipAddress,
          location: deviceInfo.location,
          is_active: true,
          last_used: new Date().toISOString()
        })
    }

    await this.createSession()
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') {
      return {
        name: 'Server',
        type: 'other' as const,
        userAgent: 'Server',
        ipAddress: '0.0.0.0',
        location: null
      }
    }

    const userAgent = navigator.userAgent
    let deviceType: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'other' = 'desktop'
    let deviceName = 'Unknown Device'

    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      if (/iPad/.test(userAgent)) {
        deviceType = 'tablet'
        deviceName = 'iPad'
      } else if (/iPhone/.test(userAgent)) {
        deviceType = 'mobile'
        deviceName = 'iPhone'
      } else if (/Android/.test(userAgent)) {
        deviceType = /Mobile/.test(userAgent) ? 'mobile' : 'tablet'
        deviceName = 'Android Device'
      }
    } else if (/Smart TV|TV/.test(userAgent)) {
      deviceType = 'tv'
      deviceName = 'Smart TV'
    } else {
      deviceName = 'Desktop Computer'
    }

    return {
      name: deviceName,
      type: deviceType,
      userAgent,
      ipAddress: '0.0.0.0', // Would be set by server
      location: null // Would be determined by IP geolocation
    }
  }

  private async createSession() {
    if (!this.currentUser) return

    const sessionToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

    await supabase
      .from('user_sessions')
      .insert({
        user_id: this.currentUser.id,
        device_id: this.deviceId,
        session_token: sessionToken,
        ip_address: '0.0.0.0', // Would be set by server
        user_agent: navigator.userAgent,
        location: null,
        is_active: true,
        expires_at: expiresAt.toISOString()
      })

    localStorage.setItem('francilia_session_token', sessionToken)
  }

  private async deactivateCurrentSession() {
    const sessionToken = localStorage.getItem('francilia_session_token')
    if (sessionToken) {
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken)
      
      localStorage.removeItem('francilia_session_token')
    }
  }

  async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: email === 'damariskerry@gmail.com' ? 'admin' : 'user'
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            role: email === 'damariskerry@gmail.com' ? 'admin' : 'user',
            language: 'en',
            preferences: {
              notifications: true,
              autoplay: true,
              quality: 'auto',
              subtitle_language: 'en',
              audio_language: 'en'
            }
          })
      }

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      if (error.message.includes('Maximum')) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'Invalid email or password' }
    }
  }

  async signOut() {
    await this.deactivateCurrentSession()
    await supabase.auth.signOut()
    this.currentUser = null
  }

  async updateProfile(updates: Partial<User>) {
    if (!this.currentUser) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.currentUser.id)

    if (error) throw error

    // Update local user data
    this.currentUser = { ...this.currentUser, ...updates }
  }

  async createSubscription(planData: {
    plan: 'premium' | 'standard'
    price: number
    billing_cycle: 'monthly' | 'yearly'
    payment_method_id?: string
  }) {
    if (!this.currentUser) throw new Error('Not authenticated')

    const trialEndDate = new Date()
    trialEndDate.setMonth(trialEndDate.getMonth() + 1)

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: this.currentUser.id,
        plan: planData.plan,
        price: planData.price,
        billing_cycle: planData.billing_cycle,
        status: 'trial',
        is_free_trial: true,
        trial_end_date: trialEndDate.toISOString(),
        auto_renew: true,
        payment_method_id: planData.payment_method_id
      })
      .select()
      .single()

    if (error) throw error

    return data
  }

  async getUserDevices() {
    if (!this.currentUser) return []

    const { data, error } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .eq('is_active', true)
      .order('last_used', { ascending: false })

    if (error) throw error
    return data || []
  }

  async removeDevice(deviceId: string) {
    if (!this.currentUser) throw new Error('Not authenticated')

    // Deactivate device
    await supabase
      .from('user_devices')
      .update({ is_active: false })
      .eq('user_id', this.currentUser.id)
      .eq('device_id', deviceId)

    // Deactivate all sessions for this device
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', this.currentUser.id)
      .eq('device_id', deviceId)
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin'
  }

  hasActiveSubscription(): boolean {
    return this.currentUser?.subscription?.status === 'active' || 
           this.currentUser?.subscription?.status === 'trial'
  }

  getDeviceId(): string {
    return this.deviceId
  }
}

export const authService = AuthService.getInstance()