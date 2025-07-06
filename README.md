
# WeGo - Multi-Platform Delivery & Service Application

## Project Overview

WeGo is a comprehensive delivery and service platform built with React, TypeScript, and Supabase. The platform connects customers, restaurant partners, and delivery drivers in a seamless ecosystem for food delivery and courier services.

**Live URL**: https://lovable.dev/projects/c2a3f942-179e-4365-9b6b-198efba40e49

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
- Partner application review and approval
- User management
- System-wide settings
- Analytics and reporting

## Database Schema

### Core Tables
- **restaurants** - Restaurant/business information
- **partner_applications** - Partner registration applications
- **restaurant_users** - Restaurant staff and ownership relationships
- **menu_categories** - Menu organization
- **menu_items** - Products and services
- **profiles** - User profile information
- **user_roles** - Role-based access control

### Security Features
- Row Level Security (RLS) policies on all tables
- Role-based access control (admin, user)
- Restaurant-specific data isolation
- Secure authentication with Supabase Auth

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
     - Sets up default restaurant settings
     - Updates application status to "approved"

4. **Partner Dashboard Access**
   - Approved partners get access to `/partner/dashboard`
   - Can manage restaurant information
   - Access to menu management (future feature)
   - Order processing capabilities (future feature)

### Application Requirements
- Business name and type
- Contact email and phone
- Complete business address
- Business description (optional)
- Valid user account (must be logged in)

## Current System Status

### Implemented Features ✅
- User authentication and authorization
- Multi-language support (EN/ES/DE)
- Partner registration system
- Admin dashboard for application review
- Partner dashboard with basic restaurant management
- Responsive design for mobile and desktop
- Location browsing and search
- Courier request system

### Known Issues & Limitations ⚠️

1. **File Management**
   - Several files are getting large and should be refactored:
     - `src/pages/Index.tsx` (210+ lines)
     - `src/pages/PartnerRegister.tsx` (250+ lines)
     - `src/pages/PartnerDashboard.tsx` (354+ lines)
     - `src/components/PartnerApplications.tsx` (334+ lines)

2. **Missing Features**
   - Menu item management for partners
   - Order processing system
   - Payment integration
   - Driver/courier management
   - Real-time order tracking
   - Review and rating system

3. **Technical Debt**
   - Large components need breaking into smaller, focused components
   - Some duplicate code in translation contexts
   - Could benefit from custom hooks for data fetching

### Suggestions for Improvement 🚀

#### Immediate (High Priority)
1. **Code Refactoring**
   - Break down large components into smaller, focused ones
   - Create custom hooks for common data operations
   - Implement proper error boundaries

2. **Partner Features**
   - Complete menu management system
   - Restaurant settings and configuration
   - Operating hours management
   - Image upload for restaurants and menu items

3. **User Experience**
   - Add loading states throughout the application
   - Improve error handling and user feedback
   - Implement proper form validation

#### Medium Priority
1. **Order Management System**
   - Order creation and processing
   - Status tracking and updates
   - Payment integration (Stripe configured)
   - Receipt and invoice generation

2. **Driver/Courier System**
   - Driver registration and management
   - Route optimization
   - Real-time location tracking
   - Delivery confirmation system

#### Long Term
1. **Advanced Features**
   - Push notifications
   - Advanced analytics and reporting
   - Multi-tenant restaurant chains
   - API rate limiting and optimization

2. **Scalability**
   - Database optimization and indexing
   - Caching strategies
   - CDN integration for images
   - Performance monitoring

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
- **Database**: PostgreSQL with RLS enabled
- **Authentication**: Email/password with custom redirect URLs
- **Edge Functions**: Custom server-side logic
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

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Implement proper error handling
- Add appropriate loading states
- Use Tailwind CSS for styling
- Follow shadcn/ui component patterns

### Database Changes
- All database changes must go through SQL migrations
- Use Row Level Security (RLS) for data protection
- Test policies thoroughly before deployment
- Document schema changes in this README

## Support & Documentation

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Project Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- [Troubleshooting Guide](https://docs.lovable.dev/tips-tricks/troubleshooting)

## License

This project is built with Lovable and follows standard web development practices. Refer to individual package licenses for third-party dependencies.
