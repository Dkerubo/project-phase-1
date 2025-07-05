import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - using fallback configuration')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
          avatar_url: string | null
          phone: string | null
          date_of_birth: string | null
          country: string | null
          language: string
          preferences: {
            notifications: boolean
            autoplay: boolean
            quality: 'auto' | 'high' | 'medium' | 'low'
            subtitle_language: string
            audio_language: string
          }
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          country?: string | null
          language?: string
          preferences?: {
            notifications: boolean
            autoplay: boolean
            quality: 'auto' | 'high' | 'medium' | 'low'
            subtitle_language: string
            audio_language: string
          }
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          country?: string | null
          language?: string
          preferences?: {
            notifications: boolean
            autoplay: boolean
            quality: 'auto' | 'high' | 'medium' | 'low'
            subtitle_language: string
            audio_language: string
          }
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'premium' | 'standard'
          status: 'active' | 'trial' | 'cancelled' | 'expired' | 'suspended'
          price: number
          currency: string
          billing_cycle: 'monthly' | 'yearly'
          start_date: string
          end_date: string | null
          trial_end_date: string | null
          is_free_trial: boolean
          auto_renew: boolean
          payment_method_id: string | null
          created_at: string
          updated_at: string
          cancelled_at: string | null
          suspended_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'premium' | 'standard'
          status?: 'active' | 'trial' | 'cancelled' | 'expired' | 'suspended'
          price: number
          currency?: string
          billing_cycle?: 'monthly' | 'yearly'
          start_date?: string
          end_date?: string | null
          trial_end_date?: string | null
          is_free_trial?: boolean
          auto_renew?: boolean
          payment_method_id?: string | null
          created_at?: string
          updated_at?: string
          cancelled_at?: string | null
          suspended_at?: string | null
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'premium' | 'standard'
          status?: 'active' | 'trial' | 'cancelled' | 'expired' | 'suspended'
          price?: number
          currency?: string
          billing_cycle?: 'monthly' | 'yearly'
          start_date?: string
          end_date?: string | null
          trial_end_date?: string | null
          is_free_trial?: boolean
          auto_renew?: boolean
          payment_method_id?: string | null
          created_at?: string
          updated_at?: string
          cancelled_at?: string | null
          suspended_at?: string | null
          metadata?: Record<string, any> | null
        }
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          type: 'card' | 'paypal' | 'bank_transfer'
          provider: string
          last_four: string
          brand: string | null
          exp_month: number | null
          exp_year: number | null
          is_default: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'card' | 'paypal' | 'bank_transfer'
          provider: string
          last_four: string
          brand?: string | null
          exp_month?: number | null
          exp_year?: number | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'card' | 'paypal' | 'bank_transfer'
          provider?: string
          last_four?: string
          brand?: string | null
          exp_month?: number | null
          exp_year?: number | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
          metadata?: Record<string, any> | null
        }
      }
      user_devices: {
        Row: {
          id: string
          user_id: string
          device_name: string
          device_type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'other'
          device_id: string
          user_agent: string
          ip_address: string
          location: string | null
          is_active: boolean
          last_used: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_name: string
          device_type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'other'
          device_id: string
          user_agent: string
          ip_address: string
          location?: string | null
          is_active?: boolean
          last_used?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_name?: string
          device_type?: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'other'
          device_id?: string
          user_agent?: string
          ip_address?: string
          location?: string | null
          is_active?: boolean
          last_used?: string
          created_at?: string
          updated_at?: string
        }
      }
      watch_history: {
        Row: {
          id: string
          user_id: string
          content_id: string
          content_type: 'movie' | 'series' | 'episode'
          watch_time: number
          total_duration: number
          progress_percentage: number
          completed: boolean
          device_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          content_type: 'movie' | 'series' | 'episode'
          watch_time?: number
          total_duration: number
          progress_percentage?: number
          completed?: boolean
          device_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          content_type?: 'movie' | 'series' | 'episode'
          watch_time?: number
          total_duration?: number
          progress_percentage?: number
          completed?: boolean
          device_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      content_library: {
        Row: {
          id: string
          title: string
          description: string
          type: 'movie' | 'series'
          genre: string[]
          year: number
          rating: number
          duration: number | null
          thumbnail_url: string
          backdrop_url: string
          trailer_url: string | null
          video_url: string | null
          cast: string[]
          director: string | null
          language: string
          country: string
          imdb_id: string | null
          tmdb_id: string | null
          muvi_id: string | null
          is_premium: boolean
          is_featured: boolean
          is_trending: boolean
          view_count: number
          like_count: number
          created_at: string
          updated_at: string
          published_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'movie' | 'series'
          genre: string[]
          year: number
          rating?: number
          duration?: number | null
          thumbnail_url: string
          backdrop_url: string
          trailer_url?: string | null
          video_url?: string | null
          cast?: string[]
          director?: string | null
          language?: string
          country?: string
          imdb_id?: string | null
          tmdb_id?: string | null
          muvi_id?: string | null
          is_premium?: boolean
          is_featured?: boolean
          is_trending?: boolean
          view_count?: number
          like_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'movie' | 'series'
          genre?: string[]
          year?: number
          rating?: number
          duration?: number | null
          thumbnail_url?: string
          backdrop_url?: string
          trailer_url?: string | null
          video_url?: string | null
          cast?: string[]
          director?: string | null
          language?: string
          country?: string
          imdb_id?: string | null
          tmdb_id?: string | null
          muvi_id?: string | null
          is_premium?: boolean
          is_featured?: boolean
          is_trending?: boolean
          view_count?: number
          like_count?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          metadata?: Record<string, any> | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          device_id: string
          session_token: string
          ip_address: string
          user_agent: string
          location: string | null
          is_active: boolean
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id: string
          session_token: string
          ip_address: string
          user_agent: string
          location?: string | null
          is_active?: boolean
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string
          session_token?: string
          ip_address?: string
          user_agent?: string
          location?: string | null
          is_active?: boolean
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}