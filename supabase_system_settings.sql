-- Supabase SQL for system_settings table
create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default now(),
  updated_by uuid references profiles(id)
);


insert into public.system_settings (key, value, description)
values
  -- Delivery Pricing & Fees
  ('base_delivery_fee', '2.50', 'Base fee for all food deliveries'),
  ('per_km_fee', '0.99', 'Fee per kilometer for food delivery'),
  ('rush_hour_surcharge', '1.00', 'Extra fee during peak hours'),
  ('parcel_base_fee', '15', 'Base monthly fee for parcel subscription (Basic)'),
  ('parcel_standard_fee', '22', 'Standard monthly fee for parcel subscription'),
  ('parcel_extended_fee', '35', 'Extended monthly fee for parcel subscription'),
  ('parcel_unlimited_fee', '55', 'Unlimited monthly fee for parcel subscription'),
  ('payg_parcel_fee', '3.50', 'Pay-as-you-go parcel delivery fee'),

  -- Commission & Payouts
  ('commission_rate_driver', '0.7', 'Commission rate for drivers'),
  ('commission_rate_partner', '0.15', 'Commission rate for partners/restaurants'),
  ('restaurant_markup', '0.20', 'Markup on restaurant menu prices'),
  ('driver_fixed_per_delivery', '1.00', 'Fixed payout per delivery for drivers'),
  ('driver_per_km', '0.30', 'Payout per km for drivers'),
  ('driver_bonus_threshold', '80', 'Orders/week for driver bonus'),
  ('driver_bonus_amount', '50', 'Bonus amount for reaching threshold'),

  -- Subscription & Retention
  ('subscription_trial_days', '0', 'Trial period for new subscribers'),
  ('subscription_grace_period', '3', 'Days before subscription cancellation for non-payment'),
  ('auto_renewal_enabled', 'true', 'Enable auto-renewal for subscriptions'),

  -- Operational & Payroll
  ('fixed_driver_salary', '600', 'Monthly salary for fixed parcel driver'),
  ('fuel_cost_estimate', '150', 'Monthly fuel and logistics cost'),
  ('app_maintenance_cost', '300', 'Monthly app maintenance cost'),
  ('marketing_budget', '400', 'Monthly marketing budget'),
  ('gestor_accounting_cost', '150', 'Monthly accounting/gestor cost'),

  -- KPIs & Targets
  ('break_even_orders', '25', 'Daily food orders needed for break-even'),
  ('break_even_subscribers', '54', 'Monthly parcel subscribers needed for break-even'),
  ('target_orders_per_day', '50', 'Target daily food orders'),
  ('target_subscribers', '150', 'Target monthly parcel subscribers'),
  ('ltv_subscription', '180', 'Customer lifetime value for subscription clients'),
  ('ltv_food', '170.46', 'Customer lifetime value for food clients'),
  ('cac', '10', 'Customer acquisition cost'),

  -- Feature Toggles & Platform
  ('auto_assign_drivers', 'true', 'Automatically assign drivers to new orders'),
  ('max_driver_radius_km', '10', 'Maximum search radius for available drivers (km)'),
  ('allow_driver_claim', 'true', 'Allow drivers to claim jobs'),
  ('maintenance_mode', 'false', 'Put the platform in maintenance mode'),
  ('supported_languages', '["en","es","fr"]', 'Languages supported by the platform'),
  ('enable_parcel_service', 'true', 'Enable/disable parcel subscription service'),
  ('enable_notifications', 'true', 'Enable in-app notifications'),
  ('enable_support_chat', 'false', 'Enable support chat module'),
  ('enable_live_tracking', 'false', 'Enable live package tracking'),
  ('enable_customer_dashboard', 'false', 'Enable customer dashboard module'),
  ('enable_advanced_analytics', 'false', 'Enable advanced analytics module'),
  ('enable_api_for_partners', 'false', 'Enable API for partners'),
  ('enable_automated_issue_resolution', 'false', 'Enable automated refunds/reassignments'),

  -- Add more settings for advanced system control, tracking, and future features
  -- Business & Financial Controls
  ('monthly_fixed_costs', '1700', 'Total fixed costs per month (for break-even analysis)'),
  ('startup_investment', '5000', 'Initial investment by founders'),
  ('food_order_profit', '2.30', 'Net profit per food order (for projections)'),
  ('parcel_subscriber_profit', '23', 'Net profit per parcel subscriber (for projections)'),
  ('driver_salary_part_time', '600', 'Part-time driver salary for parcel delivery'),
  ('driver_salary_full_time', '1200', 'Full-time driver salary (future scaling)'),
  ('customer_support_salary', '900', 'Customer support agent salary (future scaling)'),
  ('regional_coordinator_salary', '1200', 'Regional coordinator salary (future scaling)'),
  ('warehouse_assistant_salary', '800', 'Warehouse assistant salary (future scaling)'),

  -- Marketing & Acquisition
  ('monthly_ad_spend', '400', 'Monthly ad spend for CAC calculation'),
  ('new_clients_per_month', '50', 'Expected new clients per month from marketing'),
  ('referral_discount', '5', 'Discount for referral program'),
  ('promo_first_delivery', '5', 'Promo for first delivery'),

  -- App & Tech
  ('app_platforms', '["android","ios","web"]', 'Supported app platforms'),
  ('app_support_cost', '300', 'Monthly tech support cost'),
  ('enable_multicity_support', 'true', 'Enable multi-city/region support'),
  ('enable_franchise_mode', 'false', 'Enable franchise/admin panel for new towns'),

  -- Sustainability & ESG
  ('enable_green_delivery', 'false', 'Enable green delivery options (EV, grouped routes)'),
  ('tree_planting_threshold', '500', 'Orders per tree planted (ESG initiative)'),
  ('eco_packaging_incentive', 'true', 'Incentivize eco-packaging for partners'),

  -- Risk & Compliance
  ('gdpr_compliance', 'true', 'GDPR compliance enabled'),
  ('data_retention_months', '24', 'Months to retain user data'),
  ('enable_terms_acceptance', 'true', 'Require users to accept terms and privacy'),

  -- Expansion & Scaling
  ('expansion_target_cities', '["Nerja","Cómpeta","Vélez-Málaga"]', 'Next cities for expansion'),
  ('franchise_ready', 'false', 'Is the platform ready for franchising?'),

  -- Advanced Metrics
  ('kpi_weekly_orders', '350', 'Weekly food order KPI'),
  ('kpi_weekly_subscribers', '40', 'Weekly new subscriber KPI'),
  ('kpi_driver_response_time', '5', 'Target driver response time (minutes)'),
  ('kpi_delivery_time', '30', 'Target average delivery time (minutes)'),
  ('kpi_customer_satisfaction', '4.7', 'Target customer satisfaction rating (out of 5)'),

  -- Miscellaneous
  ('whatsapp_support_enabled', 'true', 'Enable WhatsApp business support'),
  ('enable_loyalty_points', 'true', 'Enable loyalty points system'),
  ('birthday_discount', 'true', 'Enable birthday discounts for users'),
  ('feedback_survey_enabled', 'true', 'Enable feedback surveys with prizes'),
  ('enable_b2b_delivery', 'false', 'Enable B2B delivery integration'),
  ('enable_grocery_bulk_orders', 'false', 'Enable grocery bulk order feature');
