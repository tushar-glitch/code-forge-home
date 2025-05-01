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
          created_at: string
          email: string
          hiring_count: number
          id: string
          notes: string | null
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          hiring_count: number
          id?: string
          notes?: string | null
          role: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          hiring_count?: number
          id?: string
          notes?: string | null
          role?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: number | null
          created_at: string
          first_name: string | null
          id: number
          last_name: string | null
          role: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          role?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          role?: string | null
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
          company_id: number | null
          created_at: string
          id: number
          instructions: string | null
          primary_language: string | null
          project_id: number | null
          test_title: string | null
          time_limit: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string
          id?: number
          instructions?: string | null
          primary_language?: string | null
          project_id?: number | null
          test_title?: string | null
          time_limit?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string
          id?: number
          instructions?: string | null
          primary_language?: string | null
          project_id?: number | null
          test_title?: string | null
          time_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "code_projects"
            referencedColumns: ["id"]
          },
        ]
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
