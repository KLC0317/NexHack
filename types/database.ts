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
      transactions: {
        Row: {
          id: string
          created_at: string
          sender_name: string
          sender_phone: string
          sender_account: string
          recipient_name: string
          recipient_bank: string
          recipient_account: string
          amount: number
          device_id: string
          ip_address: string
          location: string
          status: string
          risk_score: number
          is_anomaly: boolean
          scenario_trigger: string | null
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'> & { id?: string, created_at?: string }
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      agent_logs: {
        Row: {
          id: string
          transaction_id: string
          created_at: string
          agent_name: string
          status: string
          action_taken: string
          confidence_score: number | null
          raw_payload: Json | null
        }
        Insert: Omit<Database['public']['Tables']['agent_logs']['Row'], 'id' | 'created_at'> & { id?: string, created_at?: string }
        Update: Partial<Database['public']['Tables']['agent_logs']['Insert']>
      }
      compliance_reports: {
        Row: {
          id: string
          transaction_id: string
          created_at: string
          pdf_url: string | null
          report_markdown: string
          fi_duties_checked: Json
          is_defensible: boolean
        }
        Insert: Omit<Database['public']['Tables']['compliance_reports']['Row'], 'id' | 'created_at'> & { id?: string, created_at?: string }
        Update: Partial<Database['public']['Tables']['compliance_reports']['Insert']>
      }
    }
  }
}
