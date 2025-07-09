# WeGo - Multi-Service Delivery Platform

WeGo is a next-generation delivery and logistics platform for rural and semi-urban communities in Andalusia, Spain. WeGo unifies on-demand courier, food, and parcel delivery, supporting both one-off and subscription-based services for individuals, partners, and restaurants.

URL: [https://wego24.es](https://wego24.es)

## 🚀 Features & Progress

### ✅ Core MVP Features

- **User Authentication System** (Supabase integration)
- **Developer Login & Route Protection** (all routes protected by developer authentication until launch)
- **Unified Delivery Request System** (courier, partner, restaurant, and parcel orders)
- **Driver Management & Assignment** (drivers are centrally managed and can be auto-assigned or claim jobs for any delivery type)
- **Admin Dashboard** (manage users, drivers, partners, orders, and subscriptions)
- **Payment Processing** (Stripe integration)
- **Multi-language Support** (EN, ES)
- **Mobile-First Design** (responsive, PWA-ready)
- **Global Error Handling** (all major async and sync errors are routed through a global error handler and visible in the frontend error viewer)

### ✅ Delivery Services (Complete)

- Real-time distance-based pricing (courier, partner, and restaurant orders) — settings-driven
- Geocoding with OpenStreetMap
- Multi-step booking process for all delivery types
- Secure Stripe payments
- Mobile-optimized design
- Pricing, error handling, validation, translation — all settings-driven
- Unified driver assignment and notification workflow for all deliveries

### ✅ Parcel Subscription Service (Complete)

- Monthly subscription plans (Basic, Standard, Extended, Unlimited) — settings-driven
- Bulk delivery route for rural/campo areas
- Admin dashboard for managing subscribers
- Automated billing (Stripe)
- Delivery scheduling and tracking (Complete)

### ✅ Partner & Restaurant Management (Complete)

- **PartnerApplications**: Admin dashboard for reviewing, approving, or rejecting partner applications. Approved partners are automatically provisioned with a restaurant account and dashboard access.
- **MenuManagement**: Partners can manage their menu and categories (add/edit/delete items, bulk operations, category management UI).
- **OrderManagement/RealTimeOrderDashboard**: Live
 order tracking, status updates, and driver assignment for partners and admins. Includes order timeline/history, status change actions, and driver assignment dialog.
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

### ✅ System Settings (Complete)

- Admins can control platform features, pricing, assignment logic, notifications, and more from a central dashboard.
- Feature toggles for auto-assign, claim jobs, maintenance mode, and more.
- All business logic and workflows are settings-driven for maximum flexibility.

### ✅ Driver Mobile App (Complete)

- Mobile-first PWA/webview for drivers (optimized for phones)
- Job list: see assigned, available, and completed jobs
- Job details: pickup/dropoff, customer info, navigation link
- Live tracking: update driver location for active jobs
- In-app notifications for new jobs, chat, and status changes
- Support chat integration
- Mobile nav bar for Jobs, Chat, Profile
- PWA installable and webview-ready for app stores
- All driver flows are touch-friendly and responsive
- System settings control feature toggles (chat, live tracking, etc.)

---

## ⚙️ System Settings & Future Milestones

System Settings allow admins to control platform features, pricing, assignment logic, notifications, and more from a central dashboard. All business logic and workflows are settings-driven for maximum flexibility.

**Key Settings Examples:**

- Delivery pricing (base fee, per-km fee, rush hour surcharge)
- Parcel subscription plan prices
- Commission rates (driver, partner, restaurant)
- Driver assignment logic (auto-assign, claim jobs, max radius)
- Payroll, marketing, and operational cost controls
- Feature toggles (maintenance mode, notifications, support chat, live tracking, customer dashboard, advanced analytics, API for partners, automated issue resolution)
- KPIs and targets (break-even, LTV, CAC, order/subscriber targets)
- Sustainability, compliance, and expansion controls

## 📦 Live Package Tracking (Complete)

- Real-time map tracking of driver/package location for active deliveries
- Customers see live driver location in their dashboard
- Drivers update their location via the app
- Admins/partners can monitor all active deliveries
- Secure, privacy-respecting (only authorized users see location)
- Feature toggle in system settings

## 💬 Support Chat (Complete)

- Real-time chat between customer and driver/support
- Accessible from web and mobile app
- Integrated with user authentication
- In-app notifications for new messages
- Admin/support can join any chat for escalation
- Chat history stored securely (GDPR compliant)
- Feature toggles and settings-driven (enable/disable, escalation, etc.)

## 🛠️ Customer Dashboard (Complete)

- Order history: View all past orders (food, parcel, partner)
- Active orders: Track current deliveries and their status
- Subscription management: View, upgrade, or cancel parcel subscription plans
- Payment methods: Manage saved cards, add/remove payment options (via Stripe)
- Accessible from web and mobile app
- Fully integrated with system settings and user authentication

## 📊 Advanced Analytics (Complete)

- Churn and retention metrics (cohort analysis, returning users)
- Delivery time stats (average, median, by driver/region)
- Geographic heatmaps of order density
- Visualized with charts and interactive maps
- Real-time or near real-time updates
- Accessible in the operations/admin panel at /admin/analytics
- All analytics are settings-driven and filterable

## 🌍 Multi-region Support (Complete)

- Operate in multiple cities/regions, each with its own settings
- Admins can add/manage regions and assign users, drivers, partners, and orders to a region
- Region-specific settings respected throughout the app (pricing, toggles, etc.)
- Customers and drivers only see data relevant to their region
- Admin UI for managing regions at /admin/regions
- All queries and dashboards are region-aware

## 🔌 Partner API (Complete)

- Secure REST API for partners to create and manage orders
- API key authentication (per partner)
- Endpoints for creating orders, checking status, and retrieving order history
- Admin UI for generating and revoking API keys
- All business logic and region settings respected
- OpenAPI/Swagger documentation provided
- Rate limiting and logging for security

## 🤖 Automated Issue Resolution (Complete)

- Detects and logs order issues (late, failed, complaints)
- Automated actions: refunds, driver reassignments, escalation to support
- Configurable rules and thresholds in system settings
- All actions logged and visible in admin dashboard at /admin/issues
- Admins can override or escalate any issue
- Customers and partners notified of automated actions

## 🆓 Guest Checkout (New)

- Users can place orders as guests (no account required)
- Guest orders store contact info (email/phone) in guest_contact field
- No login prompt for guest users during order flow
- Registered users require authentication and have full account/order history
- RLS policies updated: guests can create/view their own orders, only admins can update/delete guest orders
- All payment and delivery flows supported for guests

---

## 📈 Business Projections & Technical KPIs

- **Break-even for Subscription Service:** 54 clients at €15/month covers all fixed costs; client #55+ is profit.
- **Food Delivery Break-even:** 60 paid orders/month covers costs; every order after is profit.
- **LTV:CAC Ratio:** 17–18:1 (exceptional; industry target is 3:1+).
- **Growth Targets:**
  - Year 1: 700+ subscription clients, €10.5k/month sub revenue, €13k/month delivery revenue, €7k+ net profit/month.
  - Year 3: 1,600+ subscribers, €24k/month sub revenue, €26k/month delivery revenue, €20k+ net profit/month.

---

**Next Steps:**

- Operations CMS/Blog - Create pages and posts, add media, categories etc
- Full Frontend design evaluation - Modern & Appealing Branding.

## Developer Authentication

### Flow

1. Navigate to `/dev-login`.

2. Enter the developer password (configured via environment variables `VITE_DEV_LOGIN_PASSWORD` or `REACT_APP_DEV_PASSWORD`)

3. Upon successful authentication, a session is stored in `sessionStorage` with the following structure:

   ```json
   {
     "token": "randomUUID",
     "expires": "timestamp",
     "authenticated": true
   }
   ```

4. The session is validated on each protected route.

### Notes

- Sessions expire after 2 hours.

- If the session is invalid or expired, the user is redirected to `/dev-login`.

- The header is hidden on the `/dev-login` page to prevent unauthorized access to navigation.

- **Production Note**: Developer authentication should be disabled in production by removing the `VITE_DEV_LOGIN_PASSWORD` or `REACT_APP_DEV_PASSWORD` environment variables.

## 📝 Changelog

### Recent Updates

- **Developer Authentication**: Simplified logic to ensure robust session handling and consistent use of `sessionStorage`. Updated `/dev-login` to hide the header and redirect unauthenticated users.
- **Translation Fixes**: Restored and refactored translation keys for homepage, partner register, and courier request sections.
- **Partner Registration**: Populated business types dropdown via translation context.
- **Error Handling**: Fixed repeated redirects and 404s in developer authentication flow.
- **PartnerApplications**: Enhanced error handling in the approval process to provide more descriptive error messages and log errors for debugging.
- **create_restaurant_from_application**: Added validation for required fields and logging for restaurant creation to ensure data integrity and traceability.

## Maintenance Mode

The platform supports a global maintenance mode, which can be toggled by an admin from the Operations Dashboard.

- **When enabled:**
  - Only authenticated admin users can access any part of the app.
  - All other users (including public and unauthenticated users) see a maintenance/lockdown page, regardless of the route.
  - The /auth route remains accessible so users can log in, but only admins can proceed past authentication.
- **When disabled:**
  - The app operates normally, with public and protected routes accessible as per user roles.

**How to use:**
- Go to the Operations Dashboard as an admin.
- Toggle the maintenance mode switch.
- The change takes effect immediately for all users.
