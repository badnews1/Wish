/**
 * Типы базы данных Supabase
 * Генерируется через: supabase gen types typescript
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted'
          requested_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted'
          requested_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted'
          requested_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      friend_actions: {
        Row: {
          id: string
          user_id: string
          target_user_id: string
          action: 'send' | 'cancel' | 'accept' | 'reject' | 'delete'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_user_id: string
          action: 'send' | 'cancel' | 'accept' | 'reject' | 'delete'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_user_id?: string
          action?: 'send' | 'cancel' | 'accept' | 'reject' | 'delete'
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          friends_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          friends_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          friends_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cover_image: string | null
          icon: string | null
          privacy: 'public' | 'private' | 'link'
          event_date: string | null
          booking_visibility: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          cover_image?: string | null
          icon?: string | null
          privacy?: 'public' | 'private' | 'link'
          event_date?: string | null
          booking_visibility?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          cover_image?: string | null
          icon?: string | null
          privacy?: 'public' | 'private' | 'link'
          event_date?: string | null
          booking_visibility?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          wishlist_id: string
          title: string
          description: string | null
          image_url: string | null
          product_url: string | null
          price: number | null
          currency: string | null
          priority: number
          is_purchased: boolean
          tags: string[] | null
          categories: string[] | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wishlist_id: string
          title: string
          description?: string | null
          image_url?: string | null
          product_url?: string | null
          price?: number | null
          currency?: string | null
          priority?: number
          is_purchased?: boolean
          tags?: string[] | null
          categories?: string[] | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wishlist_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          product_url?: string | null
          price?: number | null
          currency?: string | null
          priority?: number
          is_purchased?: boolean
          tags?: string[] | null
          categories?: string[] | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      get_friendship_statuses: {
        Args: {
          p_current_user: string
          p_target_users: string[]
        }
        Returns: {
          target_user_id: string
          status: 'pending' | 'accepted'
          requested_by: string
        }[]
      }
    }
    Enums: {
      friendship_status: 'pending' | 'accepted'
    }
  }
}