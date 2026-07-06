# Configuration and Utility Files Implementation

## 6.2 Overview of Configuration and Utility Files Implementation

This document provides an overview of all configuration and utility files used in the Smart Flight application.

---

## 6.2.1 Application Configuration

Application configuration files define the build process, TypeScript compilation settings, project dependencies, and environment variables.

### vite.config.ts
Configures Vite as the build tool and development server. It includes React plugin for JSX transformation, Tailwind CSS plugin for styling, and specifies the development server port (5173) and production build output directory (dist/).

### tsconfig.json
Defines TypeScript compiler options including strict type checking, ES2020 target for modern JavaScript features, React JSX transformation, and module resolution settings optimized for bundlers like Vite.

### package.json
Contains project metadata, dependencies (React, Firebase, Tailwind CSS, Framer Motion, etc.), and npm scripts for development (dev), production build (build), server start (start), and type checking (lint).

### .env
Stores sensitive environment variables including Firebase configuration (API key, auth domain, project ID) and Google Gemini API key. This file is excluded from version control for security.

---

## 6.2.2 Database Configuration

Database configuration encompasses Firebase initialization, authentication setup, and Firestore security rules.

### firebase.ts
Initializes Firebase app with configuration from environment variables and exports authentication service (auth) and Firestore database instance (db). Also exports authentication helper functions like signInWithEmailAndPassword, createUserWithEmailAndPassword, and sendEmailVerification.

### firestore.rules
Defines security rules for Firestore database collections including users, saved_itineraries, price_alerts, and search_history. Rules ensure users can only access their own data, validate data structure on write operations, and provide admin-level access for authorized users.

---

## 6.2.3 API Service Configuration

API service configuration includes the Express server setup and endpoints for flight search and tracking.

### server.ts
Express server that serves the React application in production and handles API routes. It serves static files from the dist/ directory, mounts API endpoints (/api/search and /api/tracking), and implements SPA fallback routing.

### api/search.js
POST endpoint that processes flight search requests using Google Gemini AI. It receives search query and departure date, generates AI-powered flight results with reliability scores, and returns JSON response with flight itineraries.

### api/tracking.js
POST endpoint for live flight tracking. It receives flight number, retrieves real-time flight data including status, altitude, speed, and progress, and returns comprehensive tracking information.

### src/services/flightService.ts
Client-side service layer for making API calls to search and tracking endpoints. Implements session storage caching with 30-minute TTL, handles rate limiting errors, sorts results by reliability score, and provides demo mode for testing.

---

## 6.2.4 Machine Learning Utility Files

Machine learning utilities implement algorithms for flight reliability scoring and connection risk analysis.

### Reliability Score Calculation
Algorithm that calculates flight reliability score (0-10) based on multiple factors including individual leg disruption probabilities, connection risk levels, and number of connections. Higher scores indicate more reliable flights.

### Connection Risk Analysis
Analyzes layover time between connecting flights and determines risk level (LOW/MEDIUM/HIGH). Considers minimum connection time based on airport complexity, with major international airports requiring longer connection times.

---

## 6.2.5 Frontend Utility Scripts

Frontend utilities provide reusable helper functions for the React application.

### src/lib/utils.ts
Exports the cn() function that combines clsx and tailwind-merge for conditional class name handling. Enables dynamic styling with proper Tailwind CSS class conflict resolution and type-safe class value merging.

### Date Formatting Utilities
Uses date-fns library for consistent date and time formatting across the application. Provides functions for parsing ISO strings, formatting dates (dd MMM yyyy), formatting times (HH:mm), and date arithmetic operations.

### Type Definitions (src/types/global.d.ts)
TypeScript interfaces for type safety including FlightLeg (individual flight segment), Itinerary (complete flight route), and LiveFlightData (real-time tracking information). Ensures type consistency across the application.

---

## Summary

The configuration and utility files work together to provide a well-structured application architecture:

- **Application Configuration**: Manages build process, dependencies, and environment variables
- **Database Configuration**: Handles Firebase services and data security
- **API Service Configuration**: Provides backend endpoints and client-side API integration
- **Machine Learning Utilities**: Implements intelligent flight analysis algorithms
- **Frontend Utilities**: Offers reusable helper functions and type safety

This modular approach ensures maintainability, scalability, and code reusability throughout the Smart Flight application.
