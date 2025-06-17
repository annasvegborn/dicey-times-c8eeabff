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
      character_features: {
        Row: {
          character_id: string
          created_at: string
          feature_description: string | null
          feature_name: string
          id: string
        }
        Insert: {
          character_id: string
          created_at?: string
          feature_description?: string | null
          feature_name: string
          id?: string
        }
        Update: {
          character_id?: string
          created_at?: string
          feature_description?: string | null
          feature_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_features_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_stats: {
        Row: {
          character_id: string
          charisma_progress: number
          charisma_value: number
          constitution_progress: number
          constitution_value: number
          created_at: string
          dexterity_progress: number
          dexterity_value: number
          id: string
          intelligence_progress: number
          intelligence_value: number
          strength_progress: number
          strength_value: number
          updated_at: string
          wisdom_progress: number
          wisdom_value: number
        }
        Insert: {
          character_id: string
          charisma_progress?: number
          charisma_value?: number
          constitution_progress?: number
          constitution_value?: number
          created_at?: string
          dexterity_progress?: number
          dexterity_value?: number
          id?: string
          intelligence_progress?: number
          intelligence_value?: number
          strength_progress?: number
          strength_value?: number
          updated_at?: string
          wisdom_progress?: number
          wisdom_value?: number
        }
        Update: {
          character_id?: string
          charisma_progress?: number
          charisma_value?: number
          constitution_progress?: number
          constitution_value?: number
          created_at?: string
          dexterity_progress?: number
          dexterity_value?: number
          id?: string
          intelligence_progress?: number
          intelligence_value?: number
          strength_progress?: number
          strength_value?: number
          updated_at?: string
          wisdom_progress?: number
          wisdom_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "character_stats_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_traits: {
        Row: {
          character_id: string
          created_at: string
          id: string
          trait_name: string
        }
        Insert: {
          character_id: string
          created_at?: string
          id?: string
          trait_name: string
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          trait_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_traits_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          avatar_body_shape: string
          avatar_hair_style: string
          avatar_race: string
          avatar_skin_tone: string | null
          class: string
          created_at: string
          fitness_level: string
          id: string
          level: number
          name: string
          progression_mode: string
          race: string
          updated_at: string
          user_id: string
          xp: number
          xp_to_next_level: number
        }
        Insert: {
          avatar_body_shape?: string
          avatar_hair_style?: string
          avatar_race?: string
          avatar_skin_tone?: string | null
          class?: string
          created_at?: string
          fitness_level?: string
          id?: string
          level?: number
          name?: string
          progression_mode?: string
          race?: string
          updated_at?: string
          user_id: string
          xp?: number
          xp_to_next_level?: number
        }
        Update: {
          avatar_body_shape?: string
          avatar_hair_style?: string
          avatar_race?: string
          avatar_skin_tone?: string | null
          class?: string
          created_at?: string
          fitness_level?: string
          id?: string
          level?: number
          name?: string
          progression_mode?: string
          race?: string
          updated_at?: string
          user_id?: string
          xp?: number
          xp_to_next_level?: number
        }
        Relationships: []
      }
      exercise_entries: {
        Row: {
          created_at: string
          exercise_distance_meters: number | null
          exercise_speed_kmh: number | null
          exercise_time_seconds: number | null
          exercise_type: string
          exercise_unit: string | null
          exercise_value: number | null
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          exercise_distance_meters?: number | null
          exercise_speed_kmh?: number | null
          exercise_time_seconds?: number | null
          exercise_type: string
          exercise_unit?: string | null
          exercise_value?: number | null
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          exercise_distance_meters?: number | null
          exercise_speed_kmh?: number | null
          exercise_time_seconds?: number | null
          exercise_type?: string
          exercise_unit?: string | null
          exercise_value?: number | null
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "exercise_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sessions: {
        Row: {
          created_at: string
          id: string
          session_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_date?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_objective_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          objective_id: string
          progress: number | null
          quest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          objective_id: string
          progress?: number | null
          quest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          objective_id?: string
          progress?: number | null
          quest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_quest_progress: {
        Row: {
          created_at: string
          id: string
          progress: number
          quest_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          progress?: number
          quest_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          progress?: number
          quest_id?: string
          status?: string
          updated_at?: string
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
