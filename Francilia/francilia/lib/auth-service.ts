import { supabase } from './supabase'
import { Database } from './supabase'
import { v4 as uuidv4 } from 'uuid'

// Type definitions
type User = Database['public']['Tables']['users']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']
type UserDevice = Database['public']['Tables']['user_devices']['Row']
type UserSession = Database['public']['Tables']['user_sessions']['Row']

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'tv' | 'other'
type SubscriptionPlan = 'premium' | 'standard'
type BillingCycle = 'monthly' | 'yearly'

export interface AuthUser extends User {
  subscription?: Subscription
  payment_methods?: PaymentMethod[]
  devices?: UserDevice[]
  active_sessions?: UserSession[]
}

interface DeviceInfo {
  name: string
  type: DeviceType
  userAgent: string
  ipAddress: string
  location: string | null
}

interface AuthResponse {
  success: boolean
  data?: any
  error?: string
}

export class AuthService {
  private static instance: AuthService
  private currentUser: AuthUser | null = null
  private deviceId: string
  private readonly maxDevicesPerUser = 4

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

  // Core authentication methods
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: this.getUserRole(email) } }
      })

      if (error) throw error

      if (data.user) {
        await this.createUserProfile(data.user.id, email, name)
      }

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message.includes('Maximum') ? error.message : 'Invalid email or password' 
      }
    }
  }

  async signOut(): Promise<void> {
    await this.deactivateCurrentSession()
    await supabase.auth.signOut()
    this.currentUser = null
  }

  // User management
  async updateProfile(updates: Partial<User>): Promise<void> {
    if (!this.currentUser) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', this.currentUser.id)

    if (error) throw error
    this.currentUser = { ...this.currentUser, ...updates }
  }

  // Subscription management
  async createSubscription(planData: {
    plan: SubscriptionPlan
    price: number
    billing_cycle: BillingCycle
    payment_method_id?: string
  }): Promise<Subscription> {
    if (!this.currentUser) throw new Error('Not authenticated')

    const trialEndDate = new Date()
    trialEndDate.setMonth(trialEndDate.getMonth() + 1)

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: this.currentUser.id,
        ...planData,
        status: 'trial',
        is_free_trial: true,
        trial_end_date: trialEndDate.toISOString(),
        auto_renew: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Device management
  async getUserDevices(): Promise<UserDevice[]> {
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

  async removeDevice(deviceId: string): Promise<void> {
    if (!this.currentUser) throw new Error('Not authenticated')

    await Promise.all([
      supabase
        .from('user_devices')
        .update({ is_active: false })
        .eq('user_id', this.currentUser.id)
        .eq('device_id', deviceId),
      supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('user_id', this.currentUser.id)
        .eq('device_id', deviceId)
    ])
  }

  // Getters
  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin'
  }

  hasActiveSubscription(): boolean {
    const status = this.currentUser?.subscription?.status
    return status === 'active' || status === 'trial'
  }

  getDeviceId(): string {
    return this.deviceId
  }

  // Private helper methods
  private getUserRole(email: string): string {
    return email === 'damariskerry@gmail.com' ? 'admin' : 'user'
  }

  private async createUserProfile(userId: string, email: string, name: string): Promise<void> {
    await supabase.from('users').insert({
      id: userId,
      email,
      name,
      role: this.getUserRole(email),
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

  private getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return uuidv4()
    
    let deviceId = localStorage.getItem('francilia_device_id')
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('francilia_device_id', deviceId)
    }
    return deviceId
  }

  private async initializeAuth(): Promise<void> {
    try {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) await this.loadUserData(session.user.id)
      }
    } catch (error) {
      console.warn('Auth initialization failed:', error)
    }

    supabase?.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await this.loadUserData(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null
        await this.deactivateCurrentSession()
      }
    })
  }

  private async loadUserData(userId: string): Promise<void> {
    if (!supabase) {
      console.warn('Supabase not available')
      return
    }
    
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*, subscriptions(*), payment_methods(*), user_devices(*), user_sessions(*)')
        .eq('id', userId)
        .single()

      if (error) throw error

      this.currentUser = user as AuthUser
      await Promise.all([
        this.updateLastLogin(),
        this.registerCurrentDevice()
      ])
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  private async updateLastLogin(): Promise<void> {
    if (!this.currentUser) return

    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', this.currentUser.id)
  }

  private async registerCurrentDevice(): Promise<void> {
    if (!this.currentUser) return

    const deviceInfo = this.getDeviceInfo()
    const { data: existingDevice } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .eq('device_id', this.deviceId)
      .single()

    if (existingDevice) {
      await this.updateExistingDevice(existingDevice.id)
    } else {
      await this.registerNewDevice(deviceInfo)
    }

    await this.createSession()
  }

  private async updateExistingDevice(deviceId: string): Promise<void> {
    await supabase
      .from('user_devices')
      .update({
        last_used: new Date().toISOString(),
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', deviceId)
  }

  private async registerNewDevice(deviceInfo: DeviceInfo): Promise<void> {
    const { data: userDevices } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', this.currentUser!.id)
      .eq('is_active', true)

    if (userDevices && userDevices.length >= this.maxDevicesPerUser) {
      throw new Error(`Maximum ${this.maxDevicesPerUser} devices allowed per account`)
    }

    await supabase.from('user_devices').insert({
      user_id: this.currentUser!.id,
      device_id: this.deviceId,
      ...deviceInfo,
      is_active: true,
      last_used: new Date().toISOString()
    })
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        name: 'Server',
        type: 'other',
        userAgent: 'Server',
        ipAddress: '0.0.0.0',
        location: null
      }
    }

    const userAgent = navigator.userAgent
    let deviceType: DeviceType = 'desktop'
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
      ipAddress: '0.0.0.0',
      location: null
    }
  }

  private async createSession(): Promise<void> {
    if (!this.currentUser) return

    const sessionToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await supabase.from('user_sessions').insert({
      user_id: this.currentUser.id,
      device_id: this.deviceId,
      session_token: sessionToken,
      ip_address: '0.0.0.0',
      user_agent: navigator.userAgent,
      location: null,
      is_active: true,
      expires_at: expiresAt.toISOString()
    })

    localStorage.setItem('francilia_session_token', sessionToken)
  }

  private async deactivateCurrentSession(): Promise<void> {
    const sessionToken = localStorage.getItem('francilia_session_token')
    if (sessionToken) {
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('session_token', sessionToken)
      
      localStorage.removeItem('francilia_session_token')
    }
  }
}

export const authService = AuthService.getInstance()