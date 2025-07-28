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
          content: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_type: string
          certificate_url: string | null
          description: string | null
          event_id: string | null
          id: string
          issued_at: string
          issued_by: string
          recipient_id: string
          sport_id: string | null
          template_data: Json | null
          title: string
        }
        Insert: {
          certificate_type: string
          certificate_url?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          issued_at?: string
          issued_by: string
          recipient_id: string
          sport_id?: string | null
          template_data?: Json | null
          title: string
        }
        Update: {
          certificate_type?: string
          certificate_url?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          issued_at?: string
          issued_by?: string
          recipient_id?: string
          sport_id?: string | null
          template_data?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          id: string
          name: string
          points_for_runner_up: number | null
          points_for_third: number | null
          points_for_winner: number | null
          sport_id: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"] | null
          updated_at: string
          winner_house_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          points_for_runner_up?: number | null
          points_for_third?: number | null
          points_for_winner?: number | null
          sport_id: string
          start_date: string
          status?: Database["public"]["Enums"]["event_status"] | null
          updated_at?: string
          winner_house_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          points_for_runner_up?: number | null
          points_for_third?: number | null
          points_for_winner?: number | null
          sport_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          updated_at?: string
          winner_house_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitions_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_winner_house_id_fkey"
            columns: ["winner_house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          is_public: boolean | null
          location: string | null
          max_participants: number | null
          registration_deadline: string | null
          sport_id: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          is_public?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_deadline?: string | null
          sport_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          is_public?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_deadline?: string | null
          sport_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          description: string | null
          event_id: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          sport_id: string | null
          title: string
          upload_date: string
          uploaded_by: string
        }
        Insert: {
          description?: string | null
          event_id?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          sport_id?: string | null
          title: string
          upload_date?: string
          uploaded_by: string
        }
        Update: {
          description?: string | null
          event_id?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          sport_id?: string | null
          title?: string
          upload_date?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      house_points: {
        Row: {
          awarded_at: string
          awarded_by: string
          awarded_to_user: string | null
          category: Database["public"]["Enums"]["point_category"]
          event_id: string | null
          house_id: string
          id: string
          match_id: string | null
          points: number
          reason: string
        }
        Insert: {
          awarded_at?: string
          awarded_by: string
          awarded_to_user?: string | null
          category: Database["public"]["Enums"]["point_category"]
          event_id?: string | null
          house_id: string
          id?: string
          match_id?: string | null
          points: number
          reason: string
        }
        Update: {
          awarded_at?: string
          awarded_by?: string
          awarded_to_user?: string | null
          category?: Database["public"]["Enums"]["point_category"]
          event_id?: string | null
          house_id?: string
          id?: string
          match_id?: string | null
          points?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_points_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_points_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_points_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      houses: {
        Row: {
          captain_id: string | null
          color: Database["public"]["Enums"]["house_color"]
          created_at: string
          description: string | null
          id: string
          motto: string | null
          name: string
          total_points: number | null
          updated_at: string
          vice_captain_id: string | null
        }
        Insert: {
          captain_id?: string | null
          color: Database["public"]["Enums"]["house_color"]
          created_at?: string
          description?: string | null
          id?: string
          motto?: string | null
          name: string
          total_points?: number | null
          updated_at?: string
          vice_captain_id?: string | null
        }
        Update: {
          captain_id?: string | null
          color?: Database["public"]["Enums"]["house_color"]
          created_at?: string
          description?: string | null
          id?: string
          motto?: string | null
          name?: string
          total_points?: number | null
          updated_at?: string
          vice_captain_id?: string | null
        }
        Relationships: []
      }
      leaderboard_snapshots: {
        Row: {
          created_at: string
          house_id: string
          id: string
          rank: number
          snapshot_date: string
          total_points: number
        }
        Insert: {
          created_at?: string
          house_id: string
          id?: string
          rank: number
          snapshot_date?: string
          total_points: number
        }
        Update: {
          created_at?: string
          house_id?: string
          id?: string
          rank?: number
          snapshot_date?: string
          total_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_snapshots_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      match_results: {
        Row: {
          additional_data: Json | null
          id: string
          match_id: string
          recorded_at: string
          recorded_by: string
          team1_score: number | null
          team2_score: number | null
        }
        Insert: {
          additional_data?: Json | null
          id?: string
          match_id: string
          recorded_at?: string
          recorded_by: string
          team1_score?: number | null
          team2_score?: number | null
        }
        Update: {
          additional_data?: Json | null
          id?: string
          match_id?: string
          recorded_at?: string
          recorded_by?: string
          team1_score?: number | null
          team2_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_results_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          competition_id: string | null
          created_at: string
          event_id: string | null
          id: string
          location: string | null
          match_date: string
          match_time: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          team1_id: string
          team2_id: string
          updated_at: string
          winner_team_id: string | null
        }
        Insert: {
          competition_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          location?: string | null
          match_date: string
          match_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          team1_id: string
          team2_id: string
          updated_at?: string
          winner_team_id?: string | null
        }
        Update: {
          competition_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          location?: string | null
          match_date?: string
          match_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          team1_id?: string
          team2_id?: string
          updated_at?: string
          winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team1_id_fkey"
            columns: ["team1_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team2_id_fkey"
            columns: ["team2_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string
          grade_level: number | null
          id: string
          is_active: boolean | null
          last_name: string
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          first_name: string
          grade_level?: number | null
          id?: string
          is_active?: boolean | null
          last_name: string
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string
          grade_level?: number | null
          id?: string
          is_active?: boolean | null
          last_name?: string
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          max_players: number | null
          min_players: number | null
          name: string
          rules: string | null
          season_end: string | null
          season_start: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_players?: number | null
          min_players?: number | null
          name: string
          rules?: string | null
          season_end?: string | null
          season_start?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_players?: number | null
          min_players?: number | null
          name?: string
          rules?: string | null
          season_end?: string | null
          season_start?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          is_active: boolean | null
          jersey_number: number | null
          joined_at: string
          position: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          jersey_number?: number | null
          joined_at?: string
          position?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          jersey_number?: number | null
          joined_at?: string
          position?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          captain_id: string | null
          coach_id: string | null
          created_at: string
          draws: number | null
          house_id: string
          id: string
          is_active: boolean | null
          losses: number | null
          name: string
          sport_id: string
          team_logo_url: string | null
          updated_at: string
          vice_captain_id: string | null
          wins: number | null
        }
        Insert: {
          captain_id?: string | null
          coach_id?: string | null
          created_at?: string
          draws?: number | null
          house_id: string
          id?: string
          is_active?: boolean | null
          losses?: number | null
          name: string
          sport_id: string
          team_logo_url?: string | null
          updated_at?: string
          vice_captain_id?: string | null
          wins?: number | null
        }
        Update: {
          captain_id?: string | null
          coach_id?: string | null
          created_at?: string
          draws?: number | null
          house_id?: string
          id?: string
          is_active?: boolean | null
          losses?: number | null
          name?: string
          sport_id?: string
          team_logo_url?: string | null
          updated_at?: string
          vice_captain_id?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      thoughts: {
        Row: {
          author: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          thought: string
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          thought: string
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          thought?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_houses: {
        Row: {
          house_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          house_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          house_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_houses_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_house: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_teacher_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
      event_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      house_color: "Red" | "Blue" | "Green" | "Yellow"
      point_category: "sports" | "academics" | "behavior" | "participation"
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
    Enums: {
      app_role: ["student", "teacher", "admin"],
      event_status: ["upcoming", "ongoing", "completed", "cancelled"],
      house_color: ["Red", "Blue", "Green", "Yellow"],
      point_category: ["sports", "academics", "behavior", "participation"],
    },
  },
} as const
