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
      drivers: {
        Row: {
          created_at: string | null
          current_location: Json | null
          id: string
          is_active: boolean | null
          is_available: boolean | null
          license_number: string | null
          rating: number | null
          total_deliveries: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_info: Json | null
          vehicle_type: string
        }
        Insert: {
          created_at?: string | null
          current_location?: Json | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          license_number?: string | null
          rating?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_info?: Json | null
          vehicle_type: string
        }
        Update: {
          created_at?: string | null
          current_location?: Json | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          license_number?: string | null
          rating?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_info?: Json | null
          vehicle_type?: string
        }
        Relationships: []
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
          created_at: string | null
          customer_id: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          delivery_instructions: string | null
          driver_id: string | null
          estimated_delivery_time: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
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
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
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
          created_at?: string | null
          customer_id?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          driver_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
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
          last_name: string | null
          marketing_emails: boolean | null
          phone: string | null
          phone_verified: boolean | null
          postal_code: string | null
          preferred_language: string | null
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
          last_name?: string | null
          marketing_emails?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?: string | null
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
          last_name?: string | null
          marketing_emails?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?: string | null
          roles?: Json
          sms_notifications?: boolean | null
          updated_at?: string
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
      create_restaurant_from_application: {
        Args: { application_id: string }
        Returns: string
      }
      create_superuser: {
        Args: { user_email: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      remove_user_role: {
        Args: { _user_id: string; _role: string }
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
    Enums: {
      app_role: ["admin", "user"],
      menu_item_status: ["available", "unavailable", "out_of_stock"],
      restaurant_role: ["owner", "manager", "staff"],
      restaurant_status: ["pending", "active", "inactive", "suspended"],
    },
  },
} as const
