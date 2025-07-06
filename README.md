
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

## Key Features

### For Customers
- Browse restaurants and services
- Search and filter locations
- Request courier services
- Multi-language support (EN/ES/DE)
- User authentication and profiles

### For Partners (Restaurants/Businesses)
- Partner application system with approval workflow
- Restaurant dashboard and management
- Menu and product management
- Order processing
- Settings and configuration

### For Administrators
- Complete admin dashboard with real-time analytics
- Partner application review and approval
- User management with role-based access control
- System-wide settings and monitoring
- Real-time statistics and reporting
- Optimized authentication with session caching

## Database Schema

### Core Tables
- **restaurants** - Restaurant/business information with status tracking
- **partner_applications** - Partner registration applications with approval workflow
- **restaurant_users** - Restaurant staff and ownership relationships
- **restaurant_settings** - Restaurant-specific configuration and settings
- **menu_categories** - Menu organization and categorization
- **menu_items** - Products and services with pricing and availability
- **profiles** - User profile information with preferences and settings (using JSONB roles field)
- **user_roles** - Legacy role-based access control table (being migrated to profiles.roles)
- **orders** - Order management and tracking with status updates
- **order_items** - Individual items within orders
- **payments** - Payment processing and history
- **drivers** - Delivery driver information and availability
- **reviews** - Rating and review system for businesses and drivers

### Security Features
- Row Level Security (RLS) policies on all tables
- Role-based access control using JSONB roles in profiles table
- Restaurant-specific data isolation
- Secure authentication with Supabase Auth
- Admin policies for complete system oversight
- Optimized role checking with session storage caching

## Partner Registration Process

### How It Works

1. **Application Submission**
   - Partners visit `/partner-register` (requires login)
   - Fill out comprehensive business information form
   - Submit application with business details, contact info, and description

2. **Application Review**
   - Applications stored in `partner_applications` table with "pending" status
   - Admin reviews through Product Owner Dashboard at `/admin/dashboard`
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

## Authentication System

### Current Implementation ✅
- **Optimized Loading States**: Cascaded authentication checks prevent UI flicker
- **Session Storage Caching**: User roles cached in session storage to reduce database calls
- **Role-Based Access Control**: Uses JSONB roles field in profiles table
- **Protected Routes**: Comprehensive route protection for admin and partner areas
- **Developer Login**: Available for initial setup at `/developer-login`

### Authentication Flow
1. **AuthContext** manages user session and authentication state
2. **useUserRole** hook handles role determination with caching
3. **ProtectedRoute** component ensures proper access control
4. **Admin Setup** component allows initial admin role assignment

### Access Levels
- **Public**: Home page, location browsing, authentication pages
- **Authenticated**: User profile, partner registration, courier requests
- **Admin**: Complete dashboard access, user management, partner approvals
- **Partner**: Restaurant dashboard and management tools

## Admin System

### Features ✅
- **Real-time Dashboard**: Live statistics for orders, revenue, locations, drivers, users
- **User Management**: Complete CRUD operations with role assignment and search
- **Partner Applications**: Review, approve, and reject partner applications with reasons
- **Location Management**: Restaurant and business oversight
- **Driver Management**: Delivery driver administration
- **Commission Management**: Financial oversight and settings
- **Admin Setup**: Self-service admin role assignment for initial configuration

### Access Control
- Role-based permissions with optimized RLS policies
- Session storage caching for improved performance
- Secure admin operations with audit trails
- Admin setup component for granting initial admin privileges

### Dashboard Statistics
- Total orders with real-time updates
- Total revenue from completed orders
- Active locations count
- Active drivers count
- Total users registered

## Current System Status

### Recently Implemented ✅
- **Optimized Authentication Flow**: Eliminated UI flicker with cascaded loading states
- **Session Storage Caching**: Reduced database calls for role checking
- **Enhanced Admin Dashboard**: Real-time statistics and improved user management
- **Role-Based Security**: Comprehensive RLS policies with performance optimization
- **Multi-language Support**: Full translation system for EN/ES/DE
- **Developer Authentication**: Secure initial setup system

### Core Features ✅
- User authentication and authorization with optimized performance
- Multi-language support (EN/ES/DE)
- Partner registration system with approval workflow
- Real-time admin dashboard with live statistics
- Partner dashboard with restaurant management
- Responsive design for mobile and desktop
- Location browsing and search functionality
- Courier request system
- Protected routes with smooth loading states

### Database Functions ✅
- `create_superuser()` - Grant admin privileges using JSONB roles
- `handle_new_user()` - Auto-create profiles with default roles on signup
- `handle_new_restaurant()` - Auto-create restaurant settings
- `has_role()` - Optimized role checking for RLS policies
- `create_restaurant_from_application()` - Convert approved applications to restaurants
- `add_user_role()` - Add roles to user profiles
- `remove_user_role()` - Remove roles with user fallback

## Known Areas for Improvement

### Code Organization
- Several large files that could benefit from refactoring:
  - `src/pages/PartnerDashboard.tsx` (354+ lines)
  - `src/components/PartnerApplications.tsx` (334+ lines)
  - `src/pages/PartnerRegister.tsx` (250+ lines)
  - `src/pages/Index.tsx` (210+ lines)

### Missing Features
- Advanced menu item management for partners
- Real-time order tracking system
- Payment integration completion
- Push notifications system
- Advanced review and rating system
- File storage/upload functionality

## Next Development Steps

### High Priority
1. **Menu Management Enhancement**
   - Complete menu item CRUD operations
   - Image upload for menu items
   - Category management improvements
   - Bulk operations for menu management

2. **Order System Completion**
   - Real-time order status updates
   - Order assignment to drivers
   - Customer order tracking interface
   - Restaurant order management dashboard

3. **Code Refactoring**
   - Break down large page components
   - Create focused, reusable components
   - Implement proper error boundaries

### Medium Priority
1. **Payment Integration**
   - Complete Stripe integration
   - Payment method management
   - Refund processing
   - Financial reporting

2. **File Storage & Upload**
   - Supabase Storage integration
   - Image upload for restaurants and menu items
   - Profile picture uploads
   - Document management

3. **Driver Management System**
   - Driver registration and onboarding
   - Vehicle and license verification
   - Route optimization
   - Real-time location tracking

## Development Setup

### Prerequisites
- Node.js & npm
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
- **Project ID**: c2a3f942-179e-4365-9b6b-198efba40e49
- **Database**: PostgreSQL with comprehensive RLS policies
- **Authentication**: Email/password with role-based access and session caching
- **Secrets**: Stripe integration configured

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

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Implement proper error handling with optimized loading states
- Keep components small and focused (under 200 lines)
- Use Tailwind CSS for styling
- Follow shadcn/ui component patterns

### Database Changes
- All changes through SQL migrations
- Use Row Level Security (RLS) for data protection
- Test policies thoroughly before deployment
- Document schema changes in this README

### Performance Guidelines
- Implement session storage caching for frequently accessed data
- Use cascaded loading states to prevent UI flicker
- Optimize database queries and RLS policies
- Follow React best practices for state management

## Support & Documentation

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Project Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

## License

This project is built with Lovable and follows standard web development practices.
