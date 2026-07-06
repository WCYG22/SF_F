# Configuration and Utility Files Implementation

## 6.2 Overview of Configuration and Utility Files Implementation

This section provides a detailed overview of all configuration and utility files used in the Smart Flight application, including their purpose, implementation, and integration within the system architecture.

---

## 6.2.1 Application Configuration

As Smart Flight is a modern web-based application built with React and TypeScript, proper configuration files are essential to ensure smooth development workflow, type safety, and optimized production builds. These configuration files define the build process, compiler settings, and project dependencies.

### Vite Configuration (vite.config.ts)

The Vite configuration file defines the build tool settings for both development and production environments. Vite is chosen for its fast Hot Module Replacement (HMR) and optimized build process.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```
*Figure 6.1: Overview of 'vite.config.ts'*

The configuration includes the React plugin for JSX transformation and Fast Refresh, Tailwind CSS plugin for utility-first styling, development server running on port 5173, and production builds output to the 'dist/' directory with source maps enabled for debugging.

### TypeScript Configuration (tsconfig.json)

TypeScript configuration ensures type safety and proper compilation throughout the application. The strict type checking helps catch errors during development rather than runtime.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
```
*Figure 6.2: Overview of 'tsconfig.json'*

Therefore, TypeScript is configured with strict mode enabled to catch potential errors, ES2020 target for modern JavaScript features, and React JSX transformation. This ensures type safety across all components and prevents common runtime errors.

### Package Dependencies (package.json)

The package.json file defines all project dependencies, development dependencies, and npm scripts for various operations.

```json
{
  "name": "smart-flight",
  "version": "2.0.0",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "firebase": "^12.11.0",
    "express": "^4.21.2",
    "motion": "^12.23.24"
  }
}
```
*Figure 6.3: Code Snippet in 'package.json'*

For example, Figure 6.3 shows the key scripts and dependencies. The 'dev' script starts the development server, 'build' creates production bundles, and 'start' runs the production server. Major dependencies include React 19 for UI components, Firebase for authentication and database, and Express for the backend server.

---

## 6.2.2 Database Configuration

As Smart Flight requires secure user authentication and real-time data synchronization, Firebase is implemented as the Backend-as-a-Service (BaaS) solution. This configuration ensures proper initialization of Firebase services and enforces data security through Firestore rules.

### Firebase Initialization (firebase.ts)

The Firebase configuration file initializes the Firebase app and exports authentication and Firestore database instances for use throughout the application.

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
*Figure 6.4: Overview of 'firebase.ts'*

Therefore, this configuration is being used throughout the application to access authentication services and Firestore database. All Firebase credentials are stored in environment variables to ensure security and prevent exposure of sensitive information.

### Firestore Security Rules (firestore.rules)

Firestore security rules are implemented to protect user data and ensure only authorized access to database collections. These rules validate data structure and enforce user ownership.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    match /users/{uid} {
      allow read: if isOwner(uid);
      allow create: if isOwner(uid);
    }
    
    match /saved_itineraries/{itineraryId} {
      allow read: if isAuthenticated() && 
                     resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && 
                       request.resource.data.uid == request.auth.uid;
      allow delete: if isAuthenticated() && 
                       resource.data.uid == request.auth.uid;
    }
  }
}
```
*Figure 6.5: Code Snippet in 'firestore.rules'*

For example, Figure 6.5 shows helper functions and security rules for the saved_itineraries collection. The isAuthenticated() function checks if a user is logged in, while isOwner() verifies ownership. These rules ensure that users can only read, create, and delete their own itineraries, preventing unauthorized access to other users' data.

---

## 6.2.3 API Service Configuration

As Smart Flight requires backend services for flight search and tracking, an Express server is implemented to handle API requests. This server configuration provides endpoints for AI-powered flight search and real-time flight tracking functionality.

### Express Server Setup (server.ts)

The Express server serves as the backend API layer and also serves the React frontend in production. It handles routing, middleware, and API endpoint mounting.

```typescript
import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/search', searchRouter);
app.use('/api/tracking', trackingRouter);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
*Figure 6.6: Overview of 'server.ts'*

Therefore, this server configuration is being used to handle all API requests and serve the frontend application. The server includes JSON parsing middleware, static file serving from the 'dist' directory, and SPA fallback routing to support client-side navigation.

### Flight Search API (api/search.js)

The flight search API endpoint integrates with Google Gemini AI to provide intelligent flight search results with reliability scoring.

```javascript
import { GoogleGenerativeAI } from '@google/generai';
import express from 'express';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { query, departureDate } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Search flights: ${query} on ${departureDate}`;
    
    const result = await model.generateContent(prompt);
    const flights = JSON.parse(result.response.text());
    
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
```
*Figure 6.7: Code Snippet in 'api/search.js'*

For example, Figure 6.7 shows the search endpoint implementation. It receives search parameters from the client, constructs an AI prompt for Gemini, processes the AI response, and returns structured flight data with reliability scores. Error handling ensures proper responses even when the AI service fails.

### Client-Side Service Layer (flightService.ts)

The flight service provides a client-side abstraction layer for making API calls with caching and error handling.

```typescript
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export async function searchFlight(
  query: string, 
  departureDate?: string
): Promise<Itinerary[]> {
  const cacheKey = `search_${query}_${departureDate}`;
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, departureDate }),
  });

  const data = await res.json();
  setToCache(cacheKey, data);
  return data.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}
```
*Figure 6.8: Overview of 'flightService.ts'*

Therefore, this service layer implements session storage caching with a 30-minute TTL to reduce unnecessary API calls, handles network errors gracefully, and sorts results by reliability score before returning to components.

---

## 6.2.4 Machine Learning Utility Files

As Smart Flight prioritizes flight reliability, machine learning algorithms are implemented to calculate reliability scores and analyze connection risks. These algorithms process multiple factors to provide users with informed flight recommendations.

### Reliability Score Calculation Algorithm

The reliability score algorithm evaluates flight quality based on disruption probability, connection risk, and route complexity.

```typescript
function calculateReliabilityScore(itinerary: Itinerary): number {
  let score = 10.0;
  
  // Factor 1: Individual leg disruption probability
  itinerary.legs.forEach(leg => {
    score -= leg.disruptionProbability * 5;
  });
  
  // Factor 2: Connection risk penalty
  const riskPenalty = {
    'LOW': 0,
    'MEDIUM': 1.5,
    'HIGH': 3.0
  };
  score -= riskPenalty[itinerary.connectionRisk];
  
  // Factor 3: Number of connections
  if (itinerary.legs.length > 1) {
    score -= (itinerary.legs.length - 1) * 0.5;
  }
  
  return Math.max(0, Math.min(10, score));
}
```
*Figure 6.9: Reliability Score Calculation Algorithm*

For example, Figure 6.9 shows the multi-factor reliability calculation. The algorithm starts with a perfect score of 10, deducts points based on disruption probability of each flight leg, applies penalties for connection risk levels, and reduces score for multiple connections. The final score is clamped between 0 and 10.

### Connection Risk Analysis

Connection risk analysis determines whether layover time is sufficient for passengers to make their connecting flights.

```typescript
function analyzeConnectionRisk(
  arrivalTime: string, 
  departureTime: string, 
  airport: string
): 'LOW' | 'MEDIUM' | 'HIGH' {
  const layoverMinutes = calculateLayoverTime(arrivalTime, departureTime);
  const airportFactor = getAirportComplexityFactor(airport);
  const minimumConnectionTime = 60 + airportFactor;
  
  if (layoverMinutes >= minimumConnectionTime + 60) {
    return 'LOW';
  } else if (layoverMinutes >= minimumConnectionTime) {
    return 'MEDIUM';
  } else {
    return 'HIGH';
  }
}

function getAirportComplexityFactor(airport: string): number {
  const complexAirports = ['JFK', 'LAX', 'LHR', 'CDG', 'DXB'];
  return complexAirports.includes(airport) ? 30 : 15;
}
```
*Figure 6.10: Connection Risk Analysis Algorithm*

Therefore, this algorithm considers both layover duration and airport complexity. Major international airports like JFK and LHR require an additional 30 minutes due to their size and complexity, while smaller airports require 15 minutes. Risk levels are determined by comparing actual layover time against minimum requirements.

---

## 6.2.5 Frontend Utility Scripts

As the frontend requires consistent styling, date formatting, and type safety, utility scripts are implemented to provide reusable helper functions. These utilities ensure code consistency and reduce duplication across components.

### Class Name Utility (utils.ts)

The class name utility combines conditional class names and handles Tailwind CSS class conflicts automatically.

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
*Figure 6.11: Overview of 'utils.ts'*

```typescript
// Usage in components
<button className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50"
)} />
```
*Figure 6.12: Code Snippet showing 'cn()' usage*

For example, Figure 6.12 demonstrates the cn() function usage in React components. It combines base classes with conditional classes based on component state, and automatically resolves Tailwind CSS class conflicts ensuring the last class takes precedence.

### Date Formatting Utilities

Date formatting utilities provide consistent date and time display across the application using the date-fns library.

```typescript
import { format, parseISO, addDays, addMonths } from 'date-fns';

// Format ISO date to readable string
const displayDate = format(parseISO(isoString), 'dd MMM yyyy');
// Output: "15 Jan 2025"

// Format time
const displayTime = format(parseISO(isoString), 'HH:mm');
// Output: "14:30"

// Date arithmetic
const futureDate = addDays(new Date(), 7);
const nextMonth = addMonths(new Date(), 1);
```
*Figure 6.13: Date Formatting Utility Functions*

Therefore, these utilities ensure consistent date formatting throughout the application. Dates are displayed in a user-friendly format (15 Jan 2025), times use 24-hour format (14:30), and date calculations are performed reliably for features like multi-city search and calendar selection.

### TypeScript Type Definitions (global.d.ts)

Type definitions provide type safety for all data structures used in the application, preventing runtime errors and improving developer experience.

```typescript
interface FlightLeg {
  id: string;
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    city: string;
    scheduled: string;
  };
  arrival: {
    airport: string;
    city: string;
    scheduled: string;
  };
  disruptionProbability: number;
}

interface Itinerary {
  id: string;
  legs: FlightLeg[];
  totalDuration: string;
  reliabilityScore: number;
  connectionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'RELIABLE' | 'CAUTION' | 'HIGH RISK';
  price: number;
}
```
*Figure 6.14: TypeScript Type Definitions*

For example, Figure 6.14 shows the core type definitions for flight data. These interfaces ensure that all flight-related data follows a consistent structure, TypeScript compiler catches type mismatches during development, and autocomplete suggestions improve development efficiency.

---

## Summary

The configuration and utility files form the foundation of the Smart Flight application architecture. Application configuration files manage the build process and type safety, database configuration ensures secure data access and user authentication, API service configuration provides backend functionality and client-side integration, machine learning utilities implement intelligent flight analysis, and frontend utilities offer reusable helper functions for consistent UI behavior. This modular approach ensures maintainability, scalability, and code quality throughout the application.
