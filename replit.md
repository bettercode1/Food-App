# TechPark Food Ordering System

## Overview

This is a modern web application designed for food ordering within Bangalore Tech Parks, specifically targeting Manyata Tech Park. The system provides a dual-interface platform where employees can order food from various restaurants/messes within their tech park, while restaurant managers can manage their menus and orders. Built with React, Express, and PostgreSQL, the application features real-time updates, Google Maps integration, and a clean, user-friendly interface without shadows or hover effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **UI Components**: Shadcn/UI components built on Radix primitives for accessibility
- **Styling**: Tailwind CSS with custom design system avoiding shadows and hover effects
- **State Management**: TanStack Query for server state and local React state for UI
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API structure with clear separation between user and manager endpoints
- **Session Management**: In-memory storage with plans for PostgreSQL session store using connect-pg-simple
- **Development**: Hot module replacement and runtime error handling via Vite plugins

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon for scalability and reliability
- **ORM**: Drizzle ORM with automatic migrations and type generation
- **Schema Design**: Separate tables for users, managers, tech parks, restaurants, menu categories, menu items, orders, and order items
- **Data Validation**: Zod schemas for runtime validation matching database constraints

### Authentication and Authorization
- **Dual Login System**: Separate authentication flows for employees and restaurant managers
- **User Authentication**: Username/password with mobile number as unique identifier
- **Manager Authentication**: Email/password authentication with restaurant association
- **Session Storage**: Client-side session management with localStorage persistence
- **Context Providers**: React Context for auth state management across components

### Frontend Component Architecture
- **Layout System**: Centralized layout component with theme toggle and user management
- **Multi-Step Flows**: State-driven user journey from login through order completion
- **Real-time Updates**: Prepared for Firebase integration for live order tracking
- **Responsive Design**: Mobile-first approach with adaptive components
- **Form Handling**: React Hook Form with Zod validation for robust form management

### External Dependencies

- **UI Framework**: Radix UI primitives for accessible, unstyled components
- **Maps Integration**: Google Maps API for location services, distance calculation, and real-time tracking
- **Real-time Database**: Firebase Firestore for live order updates and real-time synchronization
- **Database Hosting**: Neon PostgreSQL for production database hosting
- **CSS Framework**: Tailwind CSS for utility-first styling
- **Development Tools**: 
  - Replit-specific Vite plugins for development environment
  - ESBuild for server-side bundling
  - TypeScript for static type checking
- **Date Handling**: date-fns for date manipulation and formatting
- **State Management**: TanStack Query for server state caching and synchronization