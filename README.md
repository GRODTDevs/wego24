# WeGo - Multi-Service Delivery Platform

WeGo is a next-generation delivery and logistics platform designed for rural and semi-urban communities in Andalusia, Spain. WeGo uniquely combines on-demand food delivery and a subscription-based parcel service, reaching areas ignored by major apps.

## 🚀 Features & Progress

### ✅ Core MVP Features
- **User Authentication System** (Supabase integration)
- **Developer Login & Route Protection** (all routes protected by developer authentication until launch)
- **Courier Request Service** (real-time pricing, Stripe payments)
- **Restaurant & Partner Management** (onboarding, approval, menu management; PartnerApplications present; admin dashboard supports approve/reject/create flows)
- **Driver Registration & Dashboard** (multi-step registration, document upload, approval workflow, analytics, earnings tracking)
- **Payment Processing** (Stripe integration)
- **Multi-language Support** (EN, ES, FR)
- **Mobile-First Design** (responsive, PWA-ready)
- **Global Error Handling** (All major async and sync errors are now routed through a global error handler and visible in the frontend error viewer)

### ✅ Food Delivery Service
- Real-time distance-based pricing
- Geocoding with OpenStreetMap
- Multi-step booking process
- Secure Stripe payments
- Mobile-optimized design
- Updated pricing: €8.50 base, €0.75/km
- Error handling, validation, translation

### ✅ Parcel Subscription Service
- Monthly subscription plans (Basic, Standard, Extended, Unlimited)
- Bulk delivery route for rural/campo areas
- Admin dashboard for managing subscribers
- Automated billing (Stripe)
- Delivery scheduling and tracking (in progress)

### ✅ Partner Management (Complete)
- **PartnerApplications**: Admin dashboard for reviewing, approving, or rejecting partner applications. Approved partners are automatically provisioned with a restaurant account and dashboard access via the `create_restaurant_from_application` function.
- **MenuManagement**: Partners can manage their menu and categories (add/edit/delete items, bulk operations, category management UI).
- **OrderManagement/RealTimeOrderDashboard**: Live order tracking, status updates, and driver assignment for partners and admins. Includes order timeline/history, status change actions, and driver assignment dialog.
- **CommissionManagement**: Flexible commission rules, real-time calculation, and reporting. Admin UI for managing commission rates, categories, and status. Commission rules are editable and toggleable in the UI.
- **Partner dashboard**: Business metrics, revenue, and commission analytics. Tabs for overview, products, orders, and settings.
- **Order Automation**: Auto-assign drivers to new orders, admin override for manual assignment, and fallback handling for unassigned orders are implemented and working.

### ✅ Analytics & Business Metrics (Complete)
- **BusinessMetrics**: Real-time business metrics (orders, revenue, users, partners, drivers) with growth percentages vs previous period.
- **RevenueProgress**: Revenue and commission tracking, progress to monthly/annual targets, and revenue breakdown (subscriptions vs orders).
- **Historical metrics tracking**: `business_metrics_history` table, daily snapshot, and growth calculations. Includes a function to capture daily metrics for reporting and analytics.

### ✅ Commission Tracking (Complete)
- **Flexible commission rules** for drivers and restaurants (CommissionManagement UI)
- **Admin UI** for managing commission rates, categories, and status
- **Real-time commission calculation and reporting**
- **Commission rules editable and toggleable in UI**

### ✅ Order Processing (Complete)
- **RealTimeOrderDashboard/OrderManagement**: Real-time order dashboard for partners and admins. Status tracking, driver assignment (auto/manual), and notifications. Order timeline and status history (OrderTimelineView). Admin and partner views for order management.
- **Order timeline and status history**: Visual timeline of order progress, including all status changes and timestamps.
- **Driver assignment**: Manual and automatic driver assignment, with notifications to drivers and customers. Admin override and fallback handling for unassigned orders are implemented.
- **Notifications**: In-app notifications for order status changes, driver assignment, and payment events.

---

## 📈 Business Projections & Technical KPIs

- **Break-even for Subscription Service:** 54 clients at €15/month covers all fixed costs; client #55+ is profit.
- **Food Delivery Break-even:** 60 paid orders/month covers costs; every order after is profit.
- **LTV:CAC Ratio:** 17–18:1 (exceptional; industry target is 3:1+).
- **Growth Targets:**
  - Year 1: 700+ subscription clients, €10.5k/month sub revenue, €13k/month food revenue, €7k+ net profit/month.
  - Year 3: 1,600+ subscribers, €24k/month sub revenue, €26k/month food revenue, €20k+ net profit/month.

---
