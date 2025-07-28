# TailorConnect - Tailoring Service Platform

## Overview

TailorConnect is a full-stack web application that connects customers with local tailors for doorstep tailoring services. The platform allows customers to browse verified tailors, book services, track orders, and manage their tailoring needs while providing tailors with a dashboard to manage their business and orders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JWT authentication
- **Session Management**: JWT tokens for stateless authentication
- **Password Security**: bcrypt for password hashing

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon serverless driver with WebSocket support

## Key Components

### Authentication System
- JWT-based authentication with role-based access (customer/tailor)
- User registration with email verification flow
- Secure password hashing using bcrypt
- Protected routes with middleware authentication

### User Management
- **Customer Features**: Order management, tailor browsing, booking system
- **Tailor Features**: Business profile management, order processing, service management
- Dual-role system allowing users to be either customers or tailors

### Service Booking System
- Multi-step booking process with service selection
- Pickup and delivery scheduling
- Measurement management (existing or new measurements)
- Real-time order tracking with status updates

### Order Management
- Comprehensive order lifecycle tracking
- Status progression: pending → confirmed → pickup_scheduled → in_progress → ready → out_for_delivery → delivered
- Customer and tailor dashboards for order monitoring

### Search and Discovery
- Location-based tailor search
- Service type filtering (custom stitching, alterations, repairs, uniforms)
- Rating and review system for quality assurance

## Data Flow

1. **User Registration/Login**: Users register as customers or tailors, receive JWT tokens
2. **Service Discovery**: Customers search for tailors by location and service type
3. **Booking Process**: Customers select services, provide measurements, schedule pickup
4. **Order Processing**: Tailors receive orders, update status throughout the process
5. **Tracking**: Real-time status updates visible to both customers and tailors
6. **Completion**: Order delivery and optional review/rating system

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive component library for accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography

### State Management and HTTP
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the full stack
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- Vite development server with HMR (Hot Module Replacement)
- Concurrent client and server development
- Environment-specific configuration management

### Production Build
- **Frontend**: Vite builds React app to static assets
- **Backend**: ESBuild bundles Node.js server for production
- **Database**: Drizzle migrations for schema deployment
- **Environment**: Configured for Replit deployment with runtime error overlays

### Configuration Management
- Environment variables for database connections and JWT secrets
- Separate development and production configurations
- Database URL validation and error handling

The application is structured as a modern full-stack TypeScript application with clear separation of concerns, type safety throughout, and a focus on user experience for both customers and tailors in the tailoring service industry.