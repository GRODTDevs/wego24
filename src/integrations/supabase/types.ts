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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          id: string
          message: string
          timestamp: string | null
        }
        Insert: {
          id?: string
          message: string
          timestamp?: string | null
        }
        Update: {
          id?: string
          message?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      business_metrics_history: {
        Row: {
          active_drivers: number
          active_partners: number
          created_at: string
          id: string
          metric_date: string
          total_orders: number
          total_revenue: number
          total_users: number
        }
        Insert: {
          active_drivers?: number
          active_partners?: number
          created_at?: string
          id?: string
          metric_date: string
          total_orders?: number
          total_revenue?: number
          total_users?: number
        }
        Update: {
          active_drivers?: number
          active_partners?: number
          created_at?: string
          id?: string
          metric_date?: string
          total_orders?: number
          total_revenue?: number
          total_users?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          attachments: Json | null
          chat_id: string | null
          created_at: string | null
          id: string
          message: string
          read_by: Json | null
          sender_id: string | null
        }
        Insert: {
          attachments?: Json | null
          chat_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read_by?: Json | null
          sender_id?: string | null
        }
        Update: {
          attachments?: Json | null
          chat_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read_by?: Json | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          participants: Json
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          participants: Json
          status?: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          participants?: Json
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          driver_id: string | null
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          driver_id?: string | null
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          driver_id?: string | null
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_availability_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_documents: {
        Row: {
          document_name: string
          document_type: string
          document_url: string
          driver_id: string
          file_size: number | null
          id: string
          status: string | null
          uploaded_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          document_url: string
          driver_id: string
          file_size?: number | null
          id?: string
          status?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          document_url?: string
          driver_id?: string
          file_size?: number | null
          id?: string
          status?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_earnings: {
        Row: {
          amount: number
          created_at: string | null
          driver_id: string | null
          id: string
          order_id: string | null
          payout_approved: boolean | null
          payout_requested: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          driver_id?: string | null
          id?: string
          order_id?: string | null
          payout_approved?: boolean | null
          payout_requested?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          driver_id?: string | null
          id?: string
          order_id?: string | null
          payout_approved?: boolean | null
          payout_requested?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_earnings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          order_id: string | null
          rating: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          order_id?: string | null
          rating?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          order_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_feedback_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_feedback_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          accuracy: number | null
          created_at: string | null
          driver_id: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string | null
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          driver_id: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          timestamp?: string | null
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          driver_id?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_performance: {
        Row: {
          average_delivery_time: unknown | null
          cancelled_deliveries: number | null
          created_at: string | null
          customer_rating_average: number | null
          driver_id: string
          id: string
          metric_date: string
          on_time_percentage: number | null
          successful_deliveries: number | null
          total_deliveries: number | null
          total_earnings: number | null
          total_reviews: number | null
        }
        Insert: {
          average_delivery_time?: unknown | null
          cancelled_deliveries?: number | null
          created_at?: string | null
          customer_rating_average?: number | null
          driver_id: string
          id?: string
          metric_date: string
          on_time_percentage?: number | null
          successful_deliveries?: number | null
          total_deliveries?: number | null
          total_earnings?: number | null
          total_reviews?: number | null
        }
        Update: {
          average_delivery_time?: unknown | null
          cancelled_deliveries?: number | null
          created_at?: string | null
          customer_rating_average?: number | null
          driver_id?: string
          id?: string
          metric_date?: string
          on_time_percentage?: number | null
          successful_deliveries?: number | null
          total_deliveries?: number | null
          total_earnings?: number | null
          total_reviews?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_performance_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          approved_at: string | null
          approved_by: string | null
          background_check_status: string | null
          city: string | null
          created_at: string | null
          current_location: Json | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          insurance_expiry_date: string | null
          is_active: boolean | null
          is_available: boolean | null
          is_demo: boolean | null
          last_name: string | null
          license_expiry_date: string | null
          license_number: string | null
          phone: string | null
          postal_code: string | null
          rating: number | null
          region_id: string | null
          registration_status: string | null
          total_deliveries: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_info: Json | null
          vehicle_type: string
        }
        Insert: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          background_check_status?: string | null
          city?: string | null
          created_at?: string | null
          current_location?: Json | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          insurance_expiry_date?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_demo?: boolean | null
          last_name?: string | null
          license_expiry_date?: string | null
          license_number?: string | null
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          region_id?: string | null
          registration_status?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_info?: Json | null
          vehicle_type: string
        }
        Update: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          background_check_status?: string | null
          city?: string | null
          created_at?: string | null
          current_location?: Json | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          insurance_expiry_date?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_demo?: boolean | null
          last_name?: string | null
          license_expiry_date?: string | null
          license_number?: string | null
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          region_id?: string | null
          registration_status?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_info?: Json | null
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_resolution_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          issue_id: string | null
          performed_at: string | null
          performed_by: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          issue_id?: string | null
          performed_at?: string | null
          performed_by?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          issue_id?: string | null
          performed_at?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_resolution_logs_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "order_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_resolution_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          restaurant_id: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          restaurant_id: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          restaurant_id?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_item_variants: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          menu_item_id: string | null
          name: string
          price_modifier: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          menu_item_id?: string | null
          name: string
          price_modifier?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          menu_item_id?: string | null
          name?: string
          price_modifier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_variants_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          calories: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          dietary_info: string[] | null
          display_order: number | null
          id: string
          image_url: string | null
          is_demo: boolean | null
          is_featured: boolean | null
          name: string
          preparation_time: number | null
          price: number
          restaurant_id: string
          status: Database["public"]["Enums"]["menu_item_status"] | null
          updated_at: string | null
        }
        Insert: {
          allergens?: string[] | null
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_info?: string[] | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_demo?: boolean | null
          is_featured?: boolean | null
          name: string
          preparation_time?: number | null
          price: number
          restaurant_id: string
          status?: Database["public"]["Enums"]["menu_item_status"] | null
          updated_at?: string | null
        }
        Update: {
          allergens?: string[] | null
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_info?: string[] | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_demo?: boolean | null
          is_featured?: boolean | null
          name?: string
          preparation_time?: number | null
          price?: number
          restaurant_id?: string
          status?: Database["public"]["Enums"]["menu_item_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          delivery_method: string[]
          id: string
          is_read: boolean
          message: string
          order_id: string | null
          sent_at: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          delivery_method?: string[]
          id?: string
          is_read?: boolean
          message: string
          order_id?: string | null
          sent_at?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          delivery_method?: string[]
          id?: string
          is_read?: boolean
          message?: string
          order_id?: string | null
          sent_at?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_issues: {
        Row: {
          detected_at: string | null
          escalated: boolean | null
          id: string
          notes: string | null
          order_id: string | null
          resolution: string | null
          resolved_at: string | null
          status: string
          type: string
        }
        Insert: {
          detected_at?: string | null
          escalated?: boolean | null
          id?: string
          notes?: string | null
          order_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          type: string
        }
        Update: {
          detected_at?: string | null
          escalated?: boolean | null
          id?: string
          notes?: string | null
          order_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_issues_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          menu_item_id: string | null
          order_id: string | null
          quantity: number
          special_instructions: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          menu_item_id?: string | null
          order_id?: string | null
          quantity?: number
          special_instructions?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_time: string | null
          business_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          delivery_instructions: string | null
          driver_id: string | null
          estimated_delivery_time: string | null
          guest_contact: Json | null
          guest_user: boolean | null
          id: string
          is_demo: boolean | null
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          region_id: string | null
          service_fee: number | null
          status: string
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          business_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          guest_contact?: Json | null
          guest_user?: boolean | null
          id?: string
          is_demo?: boolean | null
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          region_id?: string | null
          service_fee?: number | null
          status?: string
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          business_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          guest_contact?: Json | null
          guest_user?: boolean | null
          id?: string
          is_demo?: boolean | null
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          region_id?: string | null
          service_fee?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_api_keys: {
        Row: {
          active: boolean | null
          api_key: string
          created_at: string | null
          id: string
          partner_id: string | null
        }
        Insert: {
          active?: boolean | null
          api_key: string
          created_at?: string | null
          id?: string
          partner_id?: string | null
        }
        Update: {
          active?: boolean | null
          api_key?: string
          created_at?: string | null
          id?: string
          partner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_api_keys_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_applications: {
        Row: {
          address: string
          business_name: string
          business_type: string
          city: string
          created_at: string
          description: string | null
          email: string
          id: string
          is_demo: boolean
          phone: string | null
          postal_code: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          business_name: string
          business_type: string
          city: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          is_demo?: boolean
          phone?: string | null
          postal_code?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          business_name?: string
          business_type?: string
          city?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          is_demo?: boolean
          phone?: string | null
          postal_code?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_demo: boolean
          name: string
          order_count: number | null
          region_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_demo?: boolean
          name: string
          order_count?: number | null
          region_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          order_count?: number | null
          region_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partners_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          order_id: string | null
          payment_method: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          order_id?: string | null
          payment_method?: string | null
          status: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          order_id?: string | null
          payment_method?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          allergies: string[] | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          delivery_instructions: string | null
          dietary_preferences: string[] | null
          email: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_demo: boolean | null
          last_name: string | null
          marketing_emails: boolean | null
          phone: string | null
          phone_verified: boolean | null
          postal_code: string | null
          preferred_language: string | null
          region_id: string | null
          roles: Json
          sms_notifications: boolean | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string[] | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          delivery_instructions?: string | null
          dietary_preferences?: string[] | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          is_demo?: boolean | null
          last_name?: string | null
          marketing_emails?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?: string | null
          region_id?: string | null
          roles?: Json
          sms_notifications?: boolean | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string[] | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          delivery_instructions?: string | null
          dietary_preferences?: string[] | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_demo?: boolean | null
          last_name?: string | null
          marketing_emails?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?: string | null
          region_id?: string | null
          roles?: Json
          sms_notifications?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          settings: Json | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          settings?: Json | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          settings?: Json | null
        }
        Relationships: []
      }
      restaurant_settings: {
        Row: {
          advance_order_hours: number | null
          auto_accept_orders: boolean | null
          created_at: string | null
          id: string
          max_orders_per_hour: number | null
          payment_methods: string[] | null
          restaurant_id: string
          service_charge: number | null
          special_instructions: string | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          advance_order_hours?: number | null
          auto_accept_orders?: boolean | null
          created_at?: string | null
          id?: string
          max_orders_per_hour?: number | null
          payment_methods?: string[] | null
          restaurant_id: string
          service_charge?: number | null
          special_instructions?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          advance_order_hours?: number | null
          auto_accept_orders?: boolean | null
          created_at?: string | null
          id?: string
          max_orders_per_hour?: number | null
          payment_methods?: string[] | null
          restaurant_id?: string
          service_charge?: number | null
          special_instructions?: string | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_settings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_users: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          restaurant_id: string
          role: Database["public"]["Enums"]["restaurant_role"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          restaurant_id: string
          role?: Database["public"]["Enums"]["restaurant_role"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          restaurant_id?: string
          role?: Database["public"]["Enums"]["restaurant_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_users_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string
          application_id: string | null
          banner_url: string | null
          city: string
          commission_rate: number | null
          country: string | null
          created_at: string | null
          cuisine_type: string | null
          delivery_fee: number | null
          delivery_time_max: number | null
          delivery_time_min: number | null
          description: string | null
          email: string
          id: string
          image_url: string | null
          is_delivery_available: boolean | null
          is_demo: boolean | null
          is_pickup_available: boolean | null
          latitude: number | null
          longitude: number | null
          minimum_order_amount: number | null
          name: string
          operating_hours: Json | null
          phone: string | null
          postal_code: string | null
          status: Database["public"]["Enums"]["restaurant_status"] | null
          updated_at: string | null
        }
        Insert: {
          address: string
          application_id?: string | null
          banner_url?: string | null
          city: string
          commission_rate?: number | null
          country?: string | null
          created_at?: string | null
          cuisine_type?: string | null
          delivery_fee?: number | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          email: string
          id?: string
          image_url?: string | null
          is_delivery_available?: boolean | null
          is_demo?: boolean | null
          is_pickup_available?: boolean | null
          latitude?: number | null
          longitude?: number | null
          minimum_order_amount?: number | null
          name: string
          operating_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          status?: Database["public"]["Enums"]["restaurant_status"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          application_id?: string | null
          banner_url?: string | null
          city?: string
          commission_rate?: number | null
          country?: string | null
          created_at?: string | null
          cuisine_type?: string | null
          delivery_fee?: number | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          email?: string
          id?: string
          image_url?: string | null
          is_delivery_available?: boolean | null
          is_demo?: boolean | null
          is_pickup_available?: boolean | null
          latitude?: number | null
          longitude?: number | null
          minimum_order_amount?: number | null
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          status?: Database["public"]["Enums"]["restaurant_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "partner_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string | null
          driver_id: string | null
          id: string
          is_verified: boolean | null
          order_id: string | null
          rating: number
          review_type: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          driver_id?: string | null
          id?: string
          is_verified?: boolean | null
          order_id?: string | null
          rating: number
          review_type: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          driver_id?: string | null
          id?: string
          is_verified?: boolean | null
          order_id?: string | null
          rating?: number
          review_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_plan_id: string | null
          subscription_status: string | null
          trial_end: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_plan_id?: string | null
          subscription_status?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_plan_id?: string | null
          subscription_status?: string | null
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_events: {
        Row: {
          event_data: Json | null
          event_type: string
          id: string
          processed_at: string | null
          stripe_event_id: string | null
          subscriber_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          subscriber_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: string
          processed_at?: string | null
          stripe_event_id?: string | null
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_drivers: number | null
          max_orders_per_month: number | null
          max_restaurants: number | null
          name: string
          price_monthly: number
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_drivers?: number | null
          max_orders_per_month?: number | null
          max_restaurants?: number | null
          name: string
          price_monthly: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_drivers?: number | null
          max_orders_per_month?: number | null
          max_restaurants?: number | null
          name?: string
          price_monthly?: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          count: number | null
          created_at: string | null
          id: string
          metric_type: string
          period_end: string
          period_start: string
          subscriber_id: string | null
          updated_at: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          id?: string
          metric_type: string
          period_end: string
          period_start: string
          subscriber_id?: string | null
          updated_at?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          id?: string
          metric_type?: string
          period_end?: string
          period_start?: string
          subscriber_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_tracking_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      add_user_role: {
        Args: { _user_id: string; _role: string }
        Returns: undefined
      }
      capture_daily_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_restaurant_from_application: {
        Args: { application_id: string }
        Returns: string
      }
      create_superuser: {
        Args: { user_email: string }
        Returns: undefined
      }
      get_subscription_status: {
        Args: { user_id: string }
        Returns: {
          subscribed: boolean
          plan_name: string
          status: string
          current_period_end: string
          cancel_at_period_end: boolean
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
      remove_user_role: {
        Args: { _user_id: string; _role: string }
        Returns: undefined
      }
      track_usage: {
        Args: { p_user_id: string; p_metric_type: string; p_increment?: number }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      menu_item_status: "available" | "unavailable" | "out_of_stock"
      restaurant_role: "owner" | "manager" | "staff"
      restaurant_status: "pending" | "active" | "inactive" | "suspended"
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
      app_role: ["admin", "user"],
      menu_item_status: ["available", "unavailable", "out_of_stock"],
      restaurant_role: ["owner", "manager", "staff"],
      restaurant_status: ["pending", "active", "inactive", "suspended"],
    },
  },
} as const
