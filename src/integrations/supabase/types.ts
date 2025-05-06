export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: number
          invited_by: number | null
          last_name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          invited_by?: number | null
          last_name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          invited_by?: number | null
          last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_attempts: {
        Row: {
          challenge_id: string
          completed_at: string | null
          id: string
          score: number | null
          started_at: string
          status: string
          submission_content: Json | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          id?: string
          score?: number | null
          started_at?: string
          status: string
          submission_content?: Json | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          id?: string
          score?: number | null
          started_at?: string
          status?: string
          submission_content?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          id: string
          is_active: boolean
          project_id: number | null
          tags: string[]
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: string
          id?: string
          is_active?: boolean
          project_id?: number | null
          tags: string[]
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          project_id?: number | null
          tags?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "code_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      code_projects: {
        Row: {
          created_at: string
          description: string | null
          files_json: Json | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          files_json?: Json | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          files_json?: Json | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      contest_participants: {
        Row: {
          contest_id: string
          id: string
          joined_at: string
          rank: number | null
          score: number | null
          submission_content: Json | null
          user_id: string
        }
        Insert: {
          contest_id: string
          id?: string
          joined_at?: string
          rank?: number | null
          score?: number | null
          submission_content?: Json | null
          user_id: string
        }
        Update: {
          contest_id?: string
          id?: string
          joined_at?: string
          rank?: number | null
          score?: number | null
          submission_content?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_participants_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          prize: string | null
          project_id: number | null
          skills: string[]
          sponsor_logo: string | null
          sponsor_name: string | null
          start_date: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          prize?: string | null
          project_id?: number | null
          skills: string[]
          sponsor_logo?: string | null
          sponsor_name?: string | null
          start_date: string
          status: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          prize?: string | null
          project_id?: number | null
          skills?: string[]
          sponsor_logo?: string | null
          sponsor_name?: string | null
          start_date?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "contests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "code_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          rarity: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          rarity: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: string
        }
        Relationships: []
      }
      developer_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          github_url: string | null
          id: string
          join_date: string
          level: number
          linkedin_url: string | null
          next_level_xp: number
          updated_at: string
          username: string
          xp_points: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          github_url?: string | null
          id: string
          join_date?: string
          level?: number
          linkedin_url?: string | null
          next_level_xp?: number
          updated_at?: string
          username: string
          xp_points?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          github_url?: string | null
          id?: string
          join_date?: string
          level?: number
          linkedin_url?: string | null
          next_level_xp?: number
          updated_at?: string
          username?: string
          xp_points?: number
        }
        Relationships: []
      }
      feedback: {
        Row: {
          assignment_id: number | null
          created_at: string
          id: number
          notes: string | null
          reviewer: string | null
          score: number | null
        }
        Insert: {
          assignment_id?: number | null
          created_at?: string
          id?: number
          notes?: string | null
          reviewer?: string | null
          score?: number | null
        }
        Update: {
          assignment_id?: number | null
          created_at?: string
          id?: number
          notes?: string | null
          reviewer?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "test_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_id: number
          created_at: string
          email: string
          hiring_count: number
          id: string
          notes: string | null
          role: string
          status: string
        }
        Insert: {
          company_id: number
          created_at?: string
          email: string
          hiring_count: number
          id?: string
          notes?: string | null
          role: string
          status?: string
        }
        Update: {
          company_id?: number
          created_at?: string
          email?: string
          hiring_count?: number
          id?: string
          notes?: string | null
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: number | null
          created_at: string
          first_name: string | null
          id: number
          last_name: string | null
          role: string
        }
        Insert: {
          company_id?: number | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          role: string
        }
        Update: {
          company_id?: number | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiter: {
        Row: {
          created_at: string
          id: number
          lead_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          lead_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: number | null
          content: string | null
          created_at: string
          file_path: string | null
          id: number
          saved_at: string | null
        }
        Insert: {
          assignment_id?: number | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          id?: number
          saved_at?: string | null
        }
        Update: {
          assignment_id?: number | null
          content?: string | null
          created_at?: string
          file_path?: string | null
          id?: number
          saved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "test_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      test_assignments: {
        Row: {
          access_link: string | null
          candidate_id: number | null
          completed_at: string | null
          created_at: string
          id: number
          started_at: string | null
          status: string | null
          test_id: number | null
        }
        Insert: {
          access_link?: string | null
          candidate_id?: number | null
          completed_at?: string | null
          created_at?: string
          id?: number
          started_at?: string | null
          status?: string | null
          test_id?: number | null
        }
        Update: {
          access_link?: string | null
          candidate_id?: number | null
          completed_at?: string | null
          created_at?: string
          id?: number
          started_at?: string | null
          status?: string | null
          test_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_assignments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_assignments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          id: number
          instructions: string | null
          primary_language: string | null
          project_id: number
          test_title: string
          time_limit: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          instructions?: string | null
          primary_language?: string | null
          project_id: number
          test_title: string
          time_limit: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          instructions?: string | null
          primary_language?: string | null
          project_id?: number
          test_title?: string
          time_limit?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "code_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          details: Json | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "developer_badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          id: string
          level: number
          skill: string
          user_id: string
        }
        Insert: {
          id?: string
          level?: number
          skill: string
          user_id: string
        }
        Update: {
          id?: string
          level?: number
          skill?: string
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
