
# WeGo - Multi-Platform Delivery & Service Application

## Project Overview

WeGo is a comprehensive delivery and service platform built with React, TypeScript, and Supabase. The platform connects customers, restaurant partners, and delivery drivers in a seamless ecosystem for food delivery and courier services.

**Live URL**: https://wego24.es

## System Architecture

### Frontend Technologies
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **React Router DOM** - Client-side routing
- **React Query (@tanstack/react-query)** - Server state management
- **Lucide React** - Icon library
- **Recharts** - Charts and data visualization
- **Sonner** - Toast notifications

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication & authorization
  - Edge functions for custom logic
  - File storage capabilities

### Key Features

#### For Customers
- Browse restaurants and services
- Search and filter locations
- Request courier services
- Multi-language support (EN/ES/DE)
- User authentication and profiles

#### For Partners (Restaurants/Businesses)
- Partner application system
- Restaurant dashboard and management
- Menu and product management
- Order processing
- Settings and configuration

#### For Administrators
- Complete admin dashboard with analytics
- Partner application review and approval
- User management with role-based access control
- System-wide settings and monitoring
- Real-time statistics and reporting

## Database Schema

### Core Tables
- **restaurants** - Restaurant/business information with status tracking
- **partner_applications** - Partner registration applications with approval workflow
- **restaurant_users** - Restaurant staff and ownership relationships
- **restaurant_settings** - Restaurant-specific configuration and settings
- **menu_categories** - Menu organization and categorization
- **menu_items** - Products and services with pricing and availability
- **profiles** - User profile information with preferences and settings
- **user_roles** - Role-based access control (admin, user)
- **orders** - Order management and tracking with status updates
- **order_items** - Individual items within orders
- **payments** - Payment processing and history
- **drivers** - Delivery driver information and availability
- **reviews** - Rating and review system for businesses and drivers

### Security Features
- Row Level Security (RLS) policies on all tables
- Role-based access control (admin, user)
- Restaurant-specific data isolation
- Secure authentication with Supabase Auth
- Admin policies for complete system oversight
- Developer authentication system for initial access

## Partner Registration Process

### How It Works

1. **Application Submission**
   - Partners visit `/partner-register` (requires login)
   - Fill out comprehensive business information form
   - Submit application with business details, contact info, and description

2. **Application Review**
   - Applications stored in `partner_applications` table with "pending" status
   - Admin reviews through Product Owner Dashboard
   - Admin can approve or reject with reason

3. **Approval Process**
   - Upon approval, system automatically:
     - Creates restaurant record in `restaurants` table
     - Links restaurant to partner user via `restaurant_users` table
     - Sets up default restaurant settings via `restaurant_settings`
     - Updates application status to "approved"

4. **Partner Dashboard Access**
   - Approved partners get access to `/partner/dashboard`
   - Can manage restaurant information
   - Access to menu management with categories and items
   - Order processing capabilities

### Application Requirements
- Business name and type
- Contact email and phone
- Complete business address
- Business description (optional)
- Valid user account (must be logged in)

## Admin System

### Features ✅
- **User Management**: Complete CRUD operations for user profiles with role assignment
- **Role Management**: Admin/user role assignment and management
- **Partner Applications**: Review, approve, and reject partner applications
- **Analytics Dashboard**: Real-time statistics and performance metrics
- **System Monitoring**: Comprehensive oversight of platform operations
- **Admin Setup**: Self-service admin role assignment for initial setup

### Access Control
- Developer authentication system for initial access
- Role-based permissions with RLS policies
- Secure admin operations with audit trails
- Admin setup component for granting initial admin privileges

### Admin Dashboard Features
- Real-time statistics display (orders, revenue, locations, drivers, users)
- User management with search and filtering
- Partner application processing
- Driver management interface
- Commission management
- SuperUser creation tools

## Current System Status

### Recently Implemented ✅
- Complete admin dashboard with real-time statistics
- Enhanced user management with role assignment
- Improved RLS policies for admin access
- Multi-language translation system improvements
- Developer authentication system
- Analytics and reporting features
- Admin setup for initial role assignment
- Real-time dashboard statistics from database

### Core Features ✅
- User authentication and authorization
- Multi-language support (EN/ES/DE)
- Partner registration system with approval workflow
- Admin dashboard for application review
- Partner dashboard with restaurant management
- Responsive design for mobile and desktop
- Location browsing and search
- Courier request system
- User management with role assignment
- Real-time order and revenue tracking

### Authentication & Authorization ✅
- Supabase Auth integration
- Role-based access control (admin/user)
- Row Level Security (RLS) policies
- Protected routes for admin and partner areas
- Developer login for initial setup
- Admin setup component for role assignment

### Database Functions ✅
- `create_superuser()` - Grant admin privileges to users
- `handle_new_user()` - Auto-create profiles on user signup
- `handle_new_restaurant()` - Auto-create restaurant settings
- `has_role()` - Check user roles for RLS policies
- `create_restaurant_from_application()` - Convert approved applications to restaurants

### Known Issues & Limitations ⚠️

1. **File Management**
   - Several files are getting large and should be refactored:
     - `src/pages/Index.tsx` (210+ lines)
     - `src/pages/PartnerRegister.tsx` (250+ lines)
     - `src/pages/PartnerDashboard.tsx` (354+ lines)
     - `src/components/PartnerApplications.tsx` (334+ lines)

2. **Missing Features**
   - Advanced menu item management for partners
   - Real-time order tracking system
   - Payment integration completion
   - Driver/courier management interface
   - Push notifications
   - Advanced review and rating system
   - File storage/upload functionality

### Immediate Next Steps 🚀

#### High Priority
1. **Code Refactoring**
   - Break down large page components into focused modules
   - Create reusable admin components
   - Implement proper error boundaries

2. **Menu Management Enhancement**
   - Complete menu item CRUD operations
   - Image upload for menu items
   - Category management improvements
   - Bulk operations for menu management

3. **Order System Completion**
   - Real-time order status updates
   - Order assignment to drivers
   - Customer order tracking
   - Restaurant order management interface

#### Medium Priority
1. **Driver Management System**
   - Driver registration and onboarding
   - Vehicle and license verification
   - Route optimization
   - Real-time location tracking

2. **Payment Integration**
   - Complete Stripe integration
   - Payment method management
   - Refund processing
   - Financial reporting

3. **File Storage & Upload**
   - Supabase Storage integration
   - Image upload for restaurants and menu items
   - Profile picture uploads
   - Document management for applications

4. **Notification System**
   - Email notifications for order updates
   - SMS notifications for critical events
   - In-app notifications
   - Admin alert system

#### Long Term Goals
1. **Advanced Analytics**
   - Revenue analytics and forecasting
   - User behavior analytics
   - Performance optimization insights
   - Business intelligence dashboard

2. **Scalability Improvements**
   - Database optimization and indexing
   - Caching strategies implementation
   - CDN integration for media files
   - Performance monitoring and alerting

3. **Mobile Application**
   - React Native mobile apps
   - Driver mobile application
   - Customer mobile experience
   - Real-time synchronization

## Development Setup

### Prerequisites
- Node.js & npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Supabase Configuration
The project is connected to Supabase with the following configuration:
- **Project ID**: c2a3f942-179e-4365-9b6b-198efba40e49
- **Database**: PostgreSQL with comprehensive RLS policies
- **Authentication**: Email/password with role-based access
- **Edge Functions**: Custom server-side logic
- **Secrets**: Stripe integration configured

### Environment Variables
The project uses Supabase secrets for sensitive configuration:
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_DB_URL` - Database connection string

## Deployment

### Quick Deploy
1. Open [Lovable](https://lovable.dev/projects/c2a3f942-179e-4365-9b6b-198efba40e49)
2. Click Share → Publish
3. Your app will be live on a Lovable subdomain

### Custom Domain
1. Navigate to Project > Settings > Domains
2. Click "Connect Domain"
3. Follow the setup instructions
4. Requires paid Lovable plan

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Implement proper error handling
- Add appropriate loading states
- Use Tailwind CSS for styling
- Follow shadcn/ui component patterns
- Keep components small and focused (under 200 lines)

### Database Changes
- All database changes must go through SQL migrations
- Use Row Level Security (RLS) for data protection
- Test policies thoroughly before deployment
- Document schema changes in this README

### Admin Development
- Test admin features with proper role assignments
- Use developer authentication for initial access
- Implement proper error handling for admin operations
- Follow security best practices for sensitive operations

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── user-management/ # User management components
│   └── ...
├── contexts/            # React contexts (Auth, Translation)
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                 # Utility functions
├── pages/               # Route components
└── utils/               # Helper utilities
```

## Support & Documentation

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Project Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- [Troubleshooting Guide](https://docs.lovable.dev/tips-tricks/troubleshooting)

## License

This project is built with Lovable and follows standard web development practices. Refer to individual package licenses for third-party dependencies.
