'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, type AuthUser } from '@/lib/auth-service'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>
  isAdmin: () => boolean
  hasActiveSubscription: () => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const currentUser = authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Wait a bit for the auth service to load user data
          setTimeout(() => {
            const currentUser = authService.getCurrentUser()
            setUser(currentUser)
            setLoading(false)
          }, 1000)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authService.signIn(email, password)
      if (result.success) {
        // User will be set via the auth state change listener
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: result.error }
      }
    } catch (error: any) {
      setLoading(false)
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const result = await authService.signUp(email, password, name)
      if (result.success) {
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: result.error }
      }
    } catch (error: any) {
      setLoading(false)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return
    
    try {
      await authService.updateProfile(updates)
      setUser({ ...user, ...updates })
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }

  const isAdmin = () => {
    return authService.isAdmin()
  }

  const hasActiveSubscription = () => {
    return authService.hasActiveSubscription()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    hasActiveSubscription,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}