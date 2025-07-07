// This file is auto-generated from db_arch.txt for Supabase type safety
// All types should be imported from this file

// Export the canonical Database type (full Supabase schema)
export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          business_id: string | null;
          customer_id: string | null;
          order_number: string;
          status: string;
          total_amount: number;
          subtotal: number;
          tax_amount?: number;
          delivery_fee?: number;
          service_fee?: number;
          payment_status?: string;
          payment_method?: string;
          delivery_address?: any;
          delivery_instructions?: string;
          estimated_delivery_time?: string;
          actual_delivery_time?: string;
          driver_id?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
          is_demo?: boolean;
        };
      };
      drivers: {
        Row: {
          id: string;
          user_id?: string | null;
          vehicle_type: string;
          vehicle_info?: any;
          license_number?: string;
          is_active?: boolean;
          is_available?: boolean;
          current_location?: any;
          rating?: number;
          total_deliveries?: number;
          created_at?: string;
          updated_at?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          license_expiry_date?: string;
          insurance_expiry_date?: string;
          background_check_status?: string;
          registration_status?: string;
          approved_at?: string;
          approved_by?: string;
          is_demo?: boolean;
        };
      };
      driver_availability: {
        Row: {
          id: string;
          driver_id: string | null;
          day_of_week: number;
          start_time: string;
          end_time: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          avatar_url?: string;
          date_of_birth?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          country?: string;
          preferred_language?: string;
          phone_verified?: boolean;
          email_notifications?: boolean;
          sms_notifications?: boolean;
          marketing_emails?: boolean;
          dietary_preferences?: string[];
          allergies?: string[];
          delivery_instructions?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          roles: string[];
          is_demo?: boolean;
        };
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          description?: string;
          cuisine_type?: string;
          email: string;
          phone?: string;
          address: string;
          city: string;
          postal_code?: string;
          country?: string;
          latitude?: number;
          longitude?: number;
          status?: string;
          commission_rate?: number;
          minimum_order_amount?: number;
          delivery_fee?: number;
          delivery_time_min?: number;
          delivery_time_max?: number;
          is_delivery_available?: boolean;
          is_pickup_available?: boolean;
          operating_hours?: any;
          image_url?: string;
          banner_url?: string;
          created_at?: string;
          updated_at?: string;
          application_id?: string;
          is_demo?: boolean;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id?: string;
          name: string;
          description?: string;
          price: number;
          image_url?: string;
          status?: string;
          is_featured?: boolean;
          preparation_time?: number;
          calories?: number;
          allergens?: string[];
          dietary_info?: string[];
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          is_demo?: boolean;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions?: string;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          order_id?: string;
          driver_id?: string;
          business_id?: string;
          customer_id?: string;
          rating: number;
          comment?: string;
          review_type: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id?: string;
          amount: number;
          currency?: string;
          payment_method?: string;
          status: string;
          stripe_payment_intent_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          order_id?: string;
          title: string;
          message: string;
          type: string;
          delivery_method: string[];
          is_read: boolean;
          sent_at: string;
        };
      };
      driver_documents: {
        Row: {
          id: string;
          driver_id: string;
          document_name: string;
          document_type: string;
          document_url: string;
          file_size?: number;
          status?: string;
          uploaded_at?: string;
          verified_at?: string;
          verified_by?: string;
        };
      };
      driver_performance: {
        Row: {
          id: string;
          driver_id: string;
          metric_date: string;
          total_deliveries?: number;
          successful_deliveries?: number;
          cancelled_deliveries?: number;
          on_time_percentage?: number;
          customer_rating_average?: number;
          total_earnings?: number;
          total_reviews?: number;
          average_delivery_time?: any;
          created_at?: string;
        };
      };
      partner_applications: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          business_type: string;
          address: string;
          city: string;
          email: string;
          phone?: string;
          postal_code?: string;
          description?: string;
          status: string;
          rejection_reason?: string;
          reviewed_at?: string;
          reviewed_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      subscribers: {
        Row: {
          id: string;
          user_id?: string;
          email: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string;
          subscription_plan_id?: string;
          subscribed: boolean;
          subscription_status?: string;
          cancel_at_period_end?: boolean;
          current_period_start?: string;
          current_period_end?: string;
          trial_end?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
      };
      restaurant_users: {
        Row: {
          id: string;
          restaurant_id: string;
          user_id: string;
          role?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      restaurant_settings: {
        Row: {
          id: string;
          restaurant_id: string;
          payment_methods?: string[];
          service_charge?: number;
          tax_rate?: number;
          advance_order_hours?: number;
          auto_accept_orders?: boolean;
          max_orders_per_hour?: number;
          special_instructions?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_item_variants: {
        Row: {
          id: string;
          menu_item_id?: string;
          name: string;
          price_modifier?: number;
          is_default?: boolean;
          created_at?: string;
        };
      };
      business_metrics_history: {
        Row: {
          id: string;
          metric_date: string;
          total_orders: number;
          total_revenue: number;
          total_users: number;
          active_drivers: number;
          active_partners: number;
          created_at: string;
        };
      };
      usage_tracking: {
        Row: {
          id: string;
          subscriber_id?: string;
          metric_type: string;
          count?: number;
          period_start: string;
          period_end: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscription_events: {
        Row: {
          id: string;
          subscriber_id?: string;
          event_type: string;
          event_data?: any;
          stripe_event_id?: string;
          processed_at?: string;
        };
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          description?: string;
          features?: any;
          price_monthly: number;
          max_drivers?: number;
          max_restaurants?: number;
          max_orders_per_month?: number;
          is_active?: boolean;
          stripe_price_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      driver_earnings: {
        Row: {
          id: string;
          driver_id?: string | null;
          order_id?: string | null;
          amount: number;
          payout_requested?: boolean;
          payout_approved?: boolean;
          created_at?: string;
        };
      };
    };
  };
};

// Table row type aliases for convenience
export type Orders = Database["public"]["Tables"]["orders"]["Row"];
export type Drivers = Database["public"]["Tables"]["drivers"]["Row"];
export type DriverAvailability = Database["public"]["Tables"]["driver_availability"]["Row"];
export type Profiles = Database["public"]["Tables"]["profiles"]["Row"];
export type Restaurants = Database["public"]["Tables"]["restaurants"]["Row"];
export type MenuItems = Database["public"]["Tables"]["menu_items"]["Row"];
export type MenuCategories = Database["public"]["Tables"]["menu_categories"]["Row"];
export type OrderItems = Database["public"]["Tables"]["order_items"]["Row"];
export type Reviews = Database["public"]["Tables"]["reviews"]["Row"];
export type Payments = Database["public"]["Tables"]["payments"]["Row"];
export type Notifications = Database["public"]["Tables"]["notifications"]["Row"];
export type DriverDocuments = Database["public"]["Tables"]["driver_documents"]["Row"];
export type DriverPerformance = Database["public"]["Tables"]["driver_performance"]["Row"];
export type PartnerApplications = Database["public"]["Tables"]["partner_applications"]["Row"];
export type Subscribers = Database["public"]["Tables"]["subscribers"]["Row"];
export type UserRoles = Database["public"]["Tables"]["user_roles"]["Row"];
export type RestaurantUsers = Database["public"]["Tables"]["restaurant_users"]["Row"];
export type RestaurantSettings = Database["public"]["Tables"]["restaurant_settings"]["Row"];
export type MenuItemVariants = Database["public"]["Tables"]["menu_item_variants"]["Row"];
export type BusinessMetricsHistory = Database["public"]["Tables"]["business_metrics_history"]["Row"];
export type UsageTracking = Database["public"]["Tables"]["usage_tracking"]["Row"];
export type SubscriptionEvents = Database["public"]["Tables"]["subscription_events"]["Row"];
export type SubscriptionPlans = Database["public"]["Tables"]["subscription_plans"]["Row"];
export type DriverEarnings = Database["public"]["Tables"]["driver_earnings"]["Row"];
// Add more as needed for your tables

