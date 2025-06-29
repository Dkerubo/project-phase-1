export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  subscription: {
    plan: 'premium' | 'standard'
    price: number
    startDate: string
    trialEndDate?: string
    status: 'active' | 'trial' | 'cancelled'
    paymentMethod?: {
      last4: string
      type: string
    }
    isFreeTrial: boolean
    freeTrialMonths?: number
  } | null
  loginTime: string
  preferences: {
    language: string
    notifications: boolean
    autoplay: boolean
    quality: 'auto' | 'high' | 'medium' | 'low'
  }
}

export class AuthService {
  private static instance: AuthService

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  isAdmin(email: string): boolean {
    return email === 'damariskerry@gmail.com'
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userData = localStorage.getItem('francilia_user')
    if (!userData) return null
    
    try {
      const user = JSON.parse(userData)
      return {
        ...user,
        role: this.isAdmin(user.email) ? 'admin' : 'user',
        preferences: user.preferences || {
          language: 'en',
          notifications: true,
          autoplay: true,
          quality: 'auto'
        }
      }
    } catch (error) {
      return null
    }
  }

  updateUser(updates: Partial<User>): void {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return

    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem('francilia_user', JSON.stringify(updatedUser))
  }

  updateSubscription(subscription: User['subscription']): void {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return

    this.updateUser({ subscription })
  }

  updatePreferences(preferences: Partial<User['preferences']>): void {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return

    this.updateUser({
      preferences: { ...currentUser.preferences, ...preferences }
    })
  }

  logout(): void {
    localStorage.removeItem('francilia_user')
  }
}

export const authService = AuthService.getInstance()