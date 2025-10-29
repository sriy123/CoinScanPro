# CoinID - Coin Recognition & Currency Converter

## Overview

CoinID is a web application that uses AI-powered image recognition to identify coins from uploaded photos. Users can upload images of coins, and the system uses OpenAI's Vision API (GPT-5) to analyze and identify the coin's type, country of origin, denomination, year, material, and value. The application also features a built-in currency converter to show equivalent values in different currencies.

The application is built as a full-stack solution with a React frontend and Express backend, utilizing modern web technologies and AI capabilities for image analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query** (React Query) for server state management and API caching

**UI Framework:**
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for styling with custom design system
- **Material Design** principles with inspiration from Google Lens
- Inter font family for typography

**Design System:**
- Component library follows "New York" style variant of shadcn/ui
- Custom color scheme with CSS variables for theming
- Support for light/dark mode toggle
- Consistent spacing using Tailwind's 4-unit rhythm (0.5rem, 1rem, 1.5rem, 2rem)

**Key Features:**
- Drag-and-drop image upload interface
- Real-time coin analysis results display
- Multi-currency conversion with 10 supported currencies
- Responsive design for mobile and desktop
- Toast notifications for user feedback

### Backend Architecture

**Technology Stack:**
- **Express.js** server running on Node.js
- **TypeScript** for type safety across the entire stack
- **Multer** for handling multipart/form-data file uploads

**API Design:**
- RESTful endpoint structure
- Single main endpoint: `POST /api/analyze-coin`
- Image processing with 10MB file size limit
- Image format support: JPG, PNG, HEIC

**AI Integration:**
- OpenAI Vision API (GPT-5 model) for coin identification
- Base64 image encoding for API transmission
- Structured JSON response parsing with Zod schema validation

**Development Tools:**
- Vite middleware integration for HMR in development
- Custom logging middleware for API request tracking
- Runtime error overlay for debugging

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using Map-based implementation
- No persistent database currently active
- User schema defined but not actively used

**Database Configuration (Prepared but Not Active):**
- Drizzle ORM configured for PostgreSQL
- Neon Database serverless driver ready for integration
- Schema definitions in `shared/schema.ts`
- Migration setup configured via `drizzle.config.ts`

**Data Models:**
- User model with username/password fields (not currently in use)
- Coin analysis response schema with validation
- Shared types between frontend and backend via `@shared` namespace

### External Dependencies

**AI & Machine Learning:**
- **OpenAI API** - GPT-5 Vision model for coin image analysis
  - Identifies coin type, country, denomination, year, material
  - Returns confidence scores and estimated values
  - Requires OPENAI_API_KEY environment variable

**Database (Configured but Inactive):**
- **Neon Database** - Serverless PostgreSQL provider
  - Connection via DATABASE_URL environment variable
  - Drizzle ORM for type-safe database queries

**Currency Data:**
- Hardcoded exchange rates for 10 currencies (USD, EUR, GBP, INR, JPY, CNY, AUD, CAD, CHF, MXN)
- Client-side conversion calculations
- No external currency API currently integrated

**Font Services:**
- **Google Fonts** - Inter font family hosting

**Development Tools:**
- **Replit Vite Plugins** - Development banner, cartographer, and runtime error modal
- Only active in development environment when REPL_ID is present

**UI Component Libraries:**
- **Radix UI** - Unstyled accessible component primitives (20+ component packages)
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant styling
- **tailwind-merge** & **clsx** - Utility class management

**Form Handling:**
- **React Hook Form** with Zod resolvers for type-safe form validation

**Additional Libraries:**
- **date-fns** - Date manipulation utilities
- **nanoid** - Unique ID generation
- **cmdk** - Command palette functionality