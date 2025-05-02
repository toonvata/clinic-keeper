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
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          price: number
          total_sessions: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          price: number
          total_sessions: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          price?: number
          total_sessions?: number
        }
        Relationships: []
      }
      doctors: {
        Row: {
          created_at: string | null
          id: number
          name: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      medical_certificates: {
        Row: {
          certificate_number: string
          created_at: string | null
          diagnosis: string | null
          doctor_id: number | null
          end_date: string | null
          id: number
          patient_hn: string | null
          pdf_url: string | null
          rest_days: number | null
          start_date: string | null
          visit_date: string
        }
        Insert: {
          certificate_number: string
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: number | null
          end_date?: string | null
          id?: number
          patient_hn?: string | null
          pdf_url?: string | null
          rest_days?: number | null
          start_date?: string | null
          visit_date: string
        }
        Update: {
          certificate_number?: string
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: number | null
          end_date?: string | null
          id?: number
          patient_hn?: string | null
          pdf_url?: string | null
          rest_days?: number | null
          start_date?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_certificates_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_certificates_patient_hn_fkey"
            columns: ["patient_hn"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["hn"]
          },
        ]
      }
      membership_usage: {
        Row: {
          id: number
          membership_id: number | null
          treatment_id: number | null
          used_at: string | null
          visit_date: string | null
        }
        Insert: {
          id?: number
          membership_id?: number | null
          treatment_id?: number | null
          used_at?: string | null
          visit_date?: string | null
        }
        Update: {
          id?: number
          membership_id?: number | null
          treatment_id?: number | null
          used_at?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_usage_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_usage_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          course_id: number | null
          created_at: string | null
          expiry_date: string | null
          id: number
          patient_hn: string | null
          purchase_date: string | null
          remaining_sessions: number
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          patient_hn?: string | null
          purchase_date?: string | null
          remaining_sessions: number
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: number
          patient_hn?: string | null
          purchase_date?: string | null
          remaining_sessions?: number
        }
        Relationships: [
          {
            foreignKeyName: "memberships_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_patient_hn_fkey"
            columns: ["patient_hn"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["hn"]
          },
        ]
      }
      patients: {
        Row: {
          address: string
          age: number
          birth_date: string
          created_at: string
          drug_allergies: string | null
          first_name: string
          hn: string
          id: number
          id_number: string
          last_name: string
          occupation: string | null
          phone_number: string
          registration_date: string
          underlying_diseases: string | null
        }
        Insert: {
          address: string
          age: number
          birth_date: string
          created_at?: string
          drug_allergies?: string | null
          first_name: string
          hn: string
          id?: never
          id_number: string
          last_name: string
          occupation?: string | null
          phone_number: string
          registration_date?: string
          underlying_diseases?: string | null
        }
        Update: {
          address?: string
          age?: number
          birth_date?: string
          created_at?: string
          drug_allergies?: string | null
          first_name?: string
          hn?: string
          id?: never
          id_number?: string
          last_name?: string
          occupation?: string | null
          phone_number?: string
          registration_date?: string
          underlying_diseases?: string | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          created_at: string
          date: string
          id: number
          medical_service_amount: number | null
          medication_amount: number | null
          patient_hn: string | null
          procedure_amount: number | null
          receipt_number: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: never
          medical_service_amount?: number | null
          medication_amount?: number | null
          patient_hn?: string | null
          procedure_amount?: number | null
          receipt_number: string
          total_amount: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: never
          medical_service_amount?: number | null
          medication_amount?: number | null
          patient_hn?: string | null
          procedure_amount?: number | null
          receipt_number?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "receipts_patient_hn_fkey"
            columns: ["patient_hn"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["hn"]
          },
        ]
      }
      treatments: {
        Row: {
          blood_pressure: string | null
          body_chart: string | null
          created_at: string
          diagnosis: string
          doctor_id: number | null
          heart_rate: number | null
          id: number
          medications: string
          next_appointment: string | null
          patient_hn: string | null
          respiratory_rate: number | null
          symptoms: string
          temperature: number | null
          treatment: string
          treatment_date: string
        }
        Insert: {
          blood_pressure?: string | null
          body_chart?: string | null
          created_at?: string
          diagnosis: string
          doctor_id?: number | null
          heart_rate?: number | null
          id?: never
          medications: string
          next_appointment?: string | null
          patient_hn?: string | null
          respiratory_rate?: number | null
          symptoms: string
          temperature?: number | null
          treatment: string
          treatment_date?: string
        }
        Update: {
          blood_pressure?: string | null
          body_chart?: string | null
          created_at?: string
          diagnosis?: string
          doctor_id?: number | null
          heart_rate?: number | null
          id?: never
          medications?: string
          next_appointment?: string | null
          patient_hn?: string | null
          respiratory_rate?: number | null
          symptoms?: string
          temperature?: number | null
          treatment?: string
          treatment_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatments_patient_hn_fkey"
            columns: ["patient_hn"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["hn"]
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
