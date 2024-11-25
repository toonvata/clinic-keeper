export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: number
          hn: string
          registration_date: string
          first_name: string
          last_name: string
          birth_date: string
          age: number
          id_number: string
          occupation: string | null
          address: string
          phone_number: string
          underlying_diseases: string | null
          drug_allergies: string | null
          created_at: string
        }
        Insert: {
          hn: string
          registration_date?: string
          first_name: string
          last_name: string
          birth_date: string
          age: number
          id_number: string
          occupation?: string | null
          address: string
          phone_number: string
          underlying_diseases?: string | null
          drug_allergies?: string | null
          created_at?: string
        }
        Update: {
          hn?: string
          registration_date?: string
          first_name?: string
          last_name?: string
          birth_date?: string
          age?: number
          id_number?: string
          occupation?: string | null
          address?: string
          phone_number?: string
          underlying_diseases?: string | null
          drug_allergies?: string | null
          created_at?: string
        }
        Relationships: []
      }
      treatments: {
        Row: {
          id: number
          patient_hn: string | null
          treatment_date: string
          blood_pressure: string | null
          heart_rate: number | null
          temperature: number | null
          respiratory_rate: number | null
          symptoms: string
          diagnosis: string
          treatment: string
          medications: string
          next_appointment: string | null
          created_at: string
        }
        Insert: {
          patient_hn?: string | null
          treatment_date?: string
          blood_pressure?: string | null
          heart_rate?: number | null
          temperature?: number | null
          respiratory_rate?: number | null
          symptoms: string
          diagnosis: string
          treatment: string
          medications: string
          next_appointment?: string | null
          created_at?: string
        }
        Update: {
          patient_hn?: string | null
          treatment_date?: string
          blood_pressure?: string | null
          heart_rate?: number | null
          temperature?: number | null
          respiratory_rate?: number | null
          symptoms?: string
          diagnosis?: string
          treatment?: string
          medications?: string
          next_appointment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatments_patient_hn_fkey"
            columns: ["patient_hn"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["hn"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]