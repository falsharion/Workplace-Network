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
      events: {
        Row: {
          id: string
          name: string
          description: string | null
          scripture_reference: string | null
          flyer_url: string | null
          start_at: string
          location: string | null
          is_virtual: boolean
          is_featured: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
        Relationships: []
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          first_name: string
          last_name: string
          email: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['registrations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['registrations']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'registrations_event_id_fkey'
            columns: ['event_id']
            referencedRelation: 'events'
            referencedColumns: ['id']
          }
        ]
      }
      mentors: {
        Row: {
          id: string
          name: string
          title: string | null
          photo_url: string | null
          profile_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['mentors']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['mentors']['Insert']>
        Relationships: []
      }
      member_stories: {
        Row: {
          id: string
          name: string
          role: string | null
          quote: string | null
          photo_url: string | null
          video_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['member_stories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['member_stories']['Insert']>
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          photo_url: string | null
          member_count: number | null
        }
        Insert: Omit<Database['public']['Tables']['groups']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['groups']['Insert']>
        Relationships: []
      }
      // Still used by the homepage CommunityGroups cards (display only)
      experience_groups: {
        Row: {
          id: string
          slug: 'under-5' | '5-9' | '10-plus'
          name: string
          description: string
          whatsapp_link: string
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['experience_groups']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['experience_groups']['Insert']>
        Relationships: []
      }
      // New: the interest form. Only email, name, phone, and years of
      // experience are required — everything else is optional.
      // Replaces group_registrations — drop that table (see migration notes).
      interest_form_submissions: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone_number: string
          age_range: 'under-18' | '18-24' | '25-34' | '35-44' | '45-plus' | null
          years_of_experience: 'under-5' | '5-9' | '10-plus'
          job_role: string | null
          industry: string | null
          motivation: string | null
          weekly_commitment: boolean | null
          preferred_mentor: string | null
          mentor_reason: string | null
          technical_skills: string[]
          soft_skills: string[]
          workforce_interest: boolean | null
          workforce_departments: string[]
          referral_source: 'social-media' | 'friend-colleague' | 'wpn-conference' | 'website' | 'other' | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['interest_form_submissions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['interest_form_submissions']['Insert']>
        Relationships: []
      }
      articles: {
        Row: {
          id: string
          title: string
          author: string | null
          author_avatar_url: string | null
          published_at: string | null
          slug: string | null
        }
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience type aliases
export type Event = Database['public']['Tables']['events']['Row']
export type Registration = Database['public']['Tables']['registrations']['Row']
export type Mentor = Database['public']['Tables']['mentors']['Row']
export type MemberStory = Database['public']['Tables']['member_stories']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type ExperienceGroupRow = Database['public']['Tables']['experience_groups']['Row']
export type InterestFormSubmissionRow = Database['public']['Tables']['interest_form_submissions']['Row']
export type Article = Database['public']['Tables']['articles']['Row']