
# WeGo - Multi-Platform Delivery & Service Application

## Project Overview

WeGo is a comprehensive delivery and service platform built with React, TypeScript, and Supabase. The platform connects customers, restaurant partners, and delivery drivers in a seamless ecosystem for food delivery and courier services.

**Live URL**: https://wego24.es

## Business Plan Scope

### Executive Summary
WeGo is a next-generation delivery platform tailored for under-served communities in Andalusia, Spain, starting with Frigiliana and Torrox. Unlike major competitors (Glovo, UberEats, Deliveroo) that focus on urban centers, WeGo is purpose-built to reach campo areas (rural countryside zones) where delivery infrastructure is nonexistent.

### Dual Revenue Model
1. **Food Delivery Service** - On-demand food ordering with €2.50 base fee + €0.99/km
2. **Parcel Subscription Service** - Monthly plans (€15-€55) for regular parcel delivery to campo areas

### Key Business Metrics (Phase 1: 150 active clients)
- **Target**: 50 orders/day × 30 days = 1,500 monthly orders
- **Average Order Value**: €9.50
- **Revenue per Order**: ~€7 (delivery fee + restaurant markup)
- **Monthly Net Profit**: €6,900 (combined streams)
- **Annual Projection**: €82,800

### Market Positioning
- **First-mover advantage** in campo delivery zones
- **Underserved market**: Elderly residents, expats, remote workers
- **Unique value proposition**: "You don't need to go. WeGo."
- **Competition-free zones** in rural Andalusia

### Growth Timeline
- **Q3 2025**: Launch in Frigiliana + Torrox
- **Q4 2025**: Expand to Nerja, Maro, Cómpeta
- **2026**: Transition to Sociedad Limitada (SL) + scale driver network
- **2027-2028**: 500+ subscribers, expand across Andalusia
- **2029-2030**: Franchise model or acquisition opportunity

## Technical Implementation Gaps & Required Features

### Critical Missing Features

#### 1. **Real-Time Order Management System**
- **Status**: ❌ Not Implemented
- **Required**: Live order status updates (pending → confirmed → preparing → out for delivery → delivered)
- **Components Needed**: 
  - Real-time order tracking dashboard
  - Driver assignment system
  - Customer notification system
  - Restaurant order management interface

#### 2. **Advanced Payment Integration**
- **Status**: ⚠️ Partially Implemented
- **Required**: 
  - Stripe payment processing with Spanish banking support
  - Subscription billing automation for parcel services
  - Refund and chargeback handling
  - Multi-currency support (EUR primary)
- **Missing**: Payment method management, recurring billing

#### 3. **Geolocation & Route Optimization**
- **Status**: ❌ Not Implemented
- **Required**:
  - GPS tracking for drivers in campo areas
  - Route optimization for rural delivery zones
  - Distance calculation for dynamic pricing (€0.99/km)
  - Offline map support for poor connectivity areas

#### 4. **Driver Management System**
- **Status**: ⚠️ Basic Implementation
- **Required**:
  - Driver onboarding and verification
  - Commission tracking and payout system
  - Performance analytics and ratings
  - Vehicle registration and insurance tracking
  - Real-time availability management

#### 5. **Subscription Management Platform**
- **Status**: ❌ Not Implemented
- **Required**:
  - Parcel subscription tiers (Basic €15, Standard €22, Extended €35, Unlimited €55)
  - Automated billing cycles
  - Delivery quota tracking
  - Subscription pause/resume functionality
  - Customer self-service portal

#### 6. **Multi-Language Support Enhancement**
- **Status**: ✅ Basic Implementation
- **Required Enhancement**:
  - Spanish/English/Romanian support for diverse customer base
  - Dynamic language switching
  - Localized content management
  - Cultural adaptation for rural Spanish communities

#### 7. **Rural-Specific Features**
- **Status**: ❌ Not Implemented
- **Required**:
  - Campo address validation and mapping
  - Custom delivery instructions for rural properties
  - Offline-first mobile app for poor connectivity
  - SMS notifications as backup to app notifications
  - Paper-based order confirmation system

#### 8. **Business Intelligence & Analytics**
- **Status**: ⚠️ Basic Implementation
- **Required**:
  - Revenue tracking by service type
  - Customer lifetime value analysis
  - Route efficiency analytics
  - Seasonal demand forecasting
  - Expansion opportunity identification

#### 9. **Restaurant Partner Management**
- **Status**: ⚠️ Basic Implementation
- **Required Enhancement**:
  - 20% markup system integration
  - Restaurant dashboard for order management
  - Menu synchronization tools
  - Commission-free onboarding process
  - Performance analytics for partners

#### 10. **Legal & Compliance System**
- **Status**: ❌ Not Implemented
- **Required**:
  - GDPR compliance for Spanish market
  - Spanish tax system integration (IVA/VAT)
  - Autónomo to SL transition support
  - Driver contract management
  - Insurance and liability tracking

### Technical Architecture Requirements

#### Database Enhancements Needed
```sql
-- Additional tables required for business plan implementation
- subscription_plans (pricing tiers, features)
- delivery_routes (campo-specific routing)
- payment_subscriptions (recurring billing)
- driver_commissions (payout tracking)
- business_metrics (KPI tracking)
- rural_addresses (campo address validation)
```

#### API Integrations Required
- **Spanish Payment Providers** (Redsys, BBVA, Santander)
- **Mapping Services** (Google Maps with rural Spain focus)
- **SMS Gateway** (for rural connectivity backup)
- **Spanish Tax System** (AEAT integration for invoicing)
- **Weather Services** (for delivery planning in rural areas)

#### Performance Considerations
- **Offline Capability** for areas with poor internet
- **Mobile-First Design** for campo residents
- **Low-Bandwidth Optimization** for rural connections
- **Multi-Device Sync** for shared family accounts

### Deployment & Infrastructure

#### Production Requirements
- **CDN Setup** for Spanish market
- **Spanish Data Residency** compliance
- **Backup Systems** for rural service reliability
- **Monitoring & Alerting** for campo delivery zones
- **Scalability Planning** for Andalusia expansion

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
  - **File storage capabilities with multiple buckets**

## Key Features

### For Customers
- Browse restaurants and services
- Search and filter locations
- Request courier services
- Multi-language support (EN/ES/DE)
- User authentication and profiles
- **Profile picture uploads and document management**

### For Partners (Restaurants/Businesses)
- Partner application system with approval workflow
- Restaurant dashboard and management
- **Complete menu and product management with image uploads**
- **Enhanced menu item CRUD operations with bulk management**
- **Restaurant image gallery and banner management**
- Order processing
- **Document storage and management**
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
- **restaurants** - Restaurant/business information with status tracking and image URLs
- **partner_applications** - Partner registration applications with approval workflow
- **restaurant_users** - Restaurant staff and ownership relationships
- **restaurant_settings** - Restaurant-specific configuration and settings
- **menu_categories** - Menu organization and categorization with sort ordering
- **menu_items** - Products and services with pricing, availability, and image support
- **menu_item_variants** - Item variations (sizes, options) with price modifiers
- **profiles** - User profile information with preferences, settings, and avatar URLs (using JSONB roles field)
- **user_roles** - Legacy role-based access control table (being migrated to profiles.roles)
- **orders** - Order management and tracking with status updates
- **order_items** - Individual items within orders
- **payments** - Payment processing and history
- **drivers** - Delivery driver information and availability
- **reviews** - Rating and review system for businesses and drivers

### **File Storage System**
- **Multiple Storage Buckets**:
  - `menu-images` - Menu item images with 5MB limit
  - `restaurant-images` - Restaurant photos, banners, and galleries
  - `avatars` - User profile pictures with 2MB limit
  - `documents` - Business documents and user files with 10MB limit

### Security Features
- Row Level Security (RLS) policies on all tables and storage buckets
- Role-based access control using JSONB roles in profiles table
- Restaurant-specific data isolation
- Secure authentication with Supabase Auth
- Admin policies for complete system oversight
- **Secure file upload policies with size and type restrictions**
- Optimized role checking with session storage caching

## Partner Registration Process

### How It Works

1. **Application Submission**
   - Partners visit `/partner-register` (requires login)
   - Fill out comprehensive business information form
   - **Upload business documents and images**
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
   - Can manage restaurant information and upload images
   - **Complete menu management with image uploads and bulk operations**
   - **Category management with drag-and-drop ordering**
   - **Menu item variants support (sizes, options)**
   - Order processing capabilities
   - **Document management for business files**

### Application Requirements
- Business name and type
- Contact email and phone
- Complete business address
- Business description (optional)
- **Business documentation upload capability**
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
- **Authenticated**: User profile, partner registration, courier requests, file uploads
- **Admin**: Complete dashboard access, user management, partner approvals
- **Partner**: Restaurant dashboard and management tools, menu management, file uploads

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

## **File Storage & Upload System ✅**

### **Complete Implementation**
- **Multi-bucket Storage Architecture**: Separate buckets for different file types
- **Universal File Upload Component**: Reusable FileUpload component with validation
- **Image Management**: Restaurant images, menu item photos, user avatars
- **Document Management**: Business documents, user files with preview and download
- **Gallery System**: Multi-image galleries for restaurants and menu items
- **Progress Tracking**: Upload progress indicators and status feedback

### **Storage Buckets**
- **menu-images**: Menu item photos (5MB limit, image formats)
- **restaurant-images**: Restaurant photos, banners, galleries (10MB limit)
- **avatars**: User profile pictures (2MB limit, optimized for profiles)
- **documents**: Business and user documents (10MB limit, multiple formats)

### **Upload Features**
- **File Validation**: Size limits, type restrictions, format validation
- **Progress Indicators**: Real-time upload progress tracking
- **Image Previews**: Immediate preview for image uploads
- **Document Management**: Organized document storage with metadata
- **Bulk Upload Support**: Multiple file uploads with progress tracking
- **Secure Deletion**: Automatic cleanup of replaced files

### **Integration Points**
- **Menu Management**: Image uploads for menu items and categories
- **Restaurant Profiles**: Main images, banners, and photo galleries
- **User Profiles**: Avatar uploads with automatic resizing
- **Document Storage**: Business documents and user file management
- **Admin Dashboard**: File management and storage analytics

## Current System Status

### Recently Implemented ✅
- **Complete File Storage System**: Multi-bucket architecture with secure upload/download
- **Enhanced Menu Management**: Full CRUD operations with image uploads and bulk operations
- **Category Management**: Drag-and-drop ordering and bulk category operations
- **Menu Item Variants**: Support for sizes, options, and price modifiers
- **Image Gallery System**: Multi-image support for restaurants and menu items
- **Document Management**: Business document storage with preview and download
- **Profile Picture System**: Avatar uploads with automatic optimization
- **Universal Upload Components**: Reusable file upload components across the system

### Previously Implemented ✅
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
- **Complete menu management with image uploads and bulk operations**
- **File storage and upload system with multiple bucket support**
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

## Next Development Steps

### High Priority - Business Plan Critical Features
1. **Real-Time Order Management System**
   - Live order status tracking (pending → confirmed → preparing → delivered)
   - Driver assignment and dispatch system
   - Customer notification system (SMS + Push)
   - Restaurant order processing dashboard

2. **Subscription Billing System**
   - Parcel delivery subscription tiers (€15-€55/month)
   - Automated recurring billing with Stripe
   - Usage tracking and quota management
   - Customer self-service subscription portal

3. **Campo-Specific Features**
   - Rural address validation and mapping
   - Offline-capable mobile app for poor connectivity
   - Distance-based pricing calculation (€0.99/km)
   - Custom delivery instructions for rural properties

4. **Driver Commission System**
   - Commission tracking (€1.00 + €0.30/km)
   - Automated payout calculations
   - Performance analytics and ratings
   - Real-time availability management

### Medium Priority
1. **Payment Integration Enhancement**
   - Spanish payment providers (Redsys, Spanish banks)
   - Multi-currency support with EUR focus
   - Refund and chargeback processing
   - Spanish tax system integration (IVA)

2. **Advanced Analytics Dashboard**
   - Business KPI tracking (€6,900/month target)
   - Route efficiency optimization
   - Customer lifetime value analysis
   - Expansion opportunity identification

3. **Spanish Market Compliance**
   - GDPR compliance for Spanish operations
   - Autónomo to SL business transition support
   - Spanish invoicing and tax integration
   - Legal document management system

## Business Model Integration

### Revenue Streams Implementation Status
1. **Food Delivery** (€3,450/month target)
   - ✅ Basic order system
   - ❌ Dynamic pricing (€2.50 + €0.99/km)
   - ❌ Restaurant 20% markup system
   - ❌ Driver commission tracking

2. **Parcel Subscriptions** (€3,450/month target)
   - ❌ Subscription tier management
   - ❌ Automated billing system
   - ❌ Delivery quota tracking
   - ❌ Campo route optimization

### Target Market Features
- **Rural Delivery**: Campo-specific routing and addressing
- **Multi-Language**: Spanish/English for expat community
- **Elderly-Friendly**: Simple interface, SMS backup notifications
- **Tourist Support**: Temporary subscriptions, holiday rental integration

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
- **Storage**: Multiple buckets with secure upload policies
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
│   ├── upload/          # File upload components
│   ├── menu/            # Menu management components
│   ├── user-management/ # User management components
│   └── ...
├── contexts/            # React contexts (Auth, Translation)
├── hooks/               # Custom React hooks (including file upload)
├── integrations/        # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                 # Utility functions
├── pages/               # Route components
└── utils/               # Helper utilities
```

## File Upload Architecture

```
src/components/upload/
├── FileUpload.tsx           # Universal file upload component
├── ProfilePictureUpload.tsx # Avatar upload specialization
├── RestaurantImageUpload.tsx # Restaurant image management
├── DocumentUpload.tsx       # Document management system
└── ImageGallery.tsx         # Multi-image gallery component

src/hooks/
└── useFileUpload.tsx        # File upload hook with validation
```

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Implement proper error handling with optimized loading states
- Keep components small and focused (under 200 lines)
- Use Tailwind CSS for styling
- Follow shadcn/ui component patterns
- **Create focused upload components for specific use cases**
- **Implement proper file validation and error handling**

### Database Changes
- All changes through SQL migrations
- Use Row Level Security (RLS) for data protection
- **Include storage bucket policies for file access**
- Test policies thoroughly before deployment
- Document schema changes in this README

### Performance Guidelines
- Implement session storage caching for frequently accessed data
- Use cascaded loading states to prevent UI flicker
- Optimize database queries and RLS policies
- **Implement file compression and optimization**
- **Use appropriate image formats and sizes**
- Follow React best practices for state management

## Support & Documentation

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Project Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

## License

This project is built with Lovable and follows standard web development practices.
