export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          message: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string | null
          file_url: string
          id: string
          issued_on: string | null
          team_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          file_url: string
          id?: string
          issued_on?: string | null
          team_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          file_url?: string
          id?: string
          issued_on?: string | null
          team_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          album: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string | null
          type: string
          url: string
        }
        Insert: {
          album?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          type: string
          url: string
        }
        Update: {
          album?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: []
      }
      house_points: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          house_id: string | null
          id: string
          points: number
          reason: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          house_id?: string | null
          id?: string
          points: number
          reason: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          house_id?: string | null
          id?: string
          points?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_points_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_points_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          color: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          description: string | null
          house_id: string | null
          id: string
          name: string
          sport: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          house_id?: string | null
          id?: string
          name: string
          sport: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          house_id?: string | null
          id?: string
          name?: string
          sport?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      thoughts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          message: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
        }
        Relationships: []
      }
    }
    Views: {
      house_leaderboard: {
        Row: {
          color: string | null
          id: string | null
          name: string | null
          total_entries: number | null
          total_points: number | null
        }
        Relationships: []
      }
      recent_house_points: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          house_color: string | null
          house_name: string | null
          id: string | null
          points: number | null
          reason: string | null
        }
        Relationships: []
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
