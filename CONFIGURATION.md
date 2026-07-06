# Configuration and Utility Files Implementation

## 6.2 Overview of Configuration and Utility Files Implementation

This document provides a detailed overview of all configuration and utility files used in the Smart Flight application, including their purpose, structure, and implementation details.

---

## 6.2.1 Application Configuration

### vite.config.ts

**Purpose**: Configures the Vite build tool for development and production builds.

**Location**: `./vite.config.ts`

**Configuration Details**:

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

**Key Features**:
- React plugin for JSX transformation and Fast Refresh
- Tailwind CSS integration via Vite plugin
- Development server configuration on port 5173
- Production build outputs to `dist/` directory
- Source maps enabled for debugging

---

### tsconfig.json

**Purpose**: TypeScript compiler configuration for type checking and compilation.

**Location**: `./tsconfig.json`

**Configuration Details**:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**Key Features**:
- Strict type checking enabled
- React JSX transformation
- ES2020 target for modern JavaScript features
- Module resolution optimized for bundlers
- Unused variables and parameters flagged as errors

---

### package.json

**Purpose**: Defines project dependencies, scripts, and metadata.

**Location**: `./package.json`

**Key Sections**:

**Dependencies**:
```json
{
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "firebase": "^12.11.0",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^3.8.1",
    "tailwind-merge": "^3.5.0"
  }
}
```

**Scripts**:
```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  }
}
```

**Script Descriptions**:
- `dev`: Starts development server with TypeScript execution
- `build`: Builds frontend with Vite and bundles server with esbuild
- `start`: Runs production server from compiled output
- `lint`: Type checks without emitting files

---

### .env Configuration

**Purpose**: Stores environment variables for Firebase and API keys.

**Location**: `./.env` (not committed to version control)

**Required Variables**:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Keys
GEMINI_API_KEY=your_gemini_api_key

# Server Configuration
PORT=3000
NODE_ENV=production
```

**Security Notes**:
- All Firebase config variables prefixed with `VITE_` for client-side access
- `GEMINI_API_KEY` is server-side only
- Never commit `.env` to version control
- Use `.env.example` as template

---

## 6.2.2 Database Configuration

### firebase.ts

**Purpose**: Initializes and configures Firebase services (Authentication and Firestore).

**Location**: `./src/firebase.ts`

**Implementation**:

```typescript
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  reload,
  User
} from 'firebase/auth';
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

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  reload,
  User
};
```

**Key Features**:
- Firebase app initialization with environment variables
- Authentication service instance export
- Firestore database instance export
- Auth helper functions exported for convenience
- Type-safe User interface from Firebase

**Error Handling**:

```typescript
export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list'
}

export const handleFirestoreError = (
  error: any, 
  operation: OperationType, 
  path: string
) => {
  const errorCode = error?.code || 'unknown';
  const errorMessage = error?.message || 'An unknown error occurred';
  
  console.error(`Firestore ${operation} error on ${path}:`, {
    code: errorCode,
    message: errorMessage
  });
};
```

---

### firestore.rules

**Purpose**: Defines security rules for Firestore database access control.

**Location**: `./firestore.rules`

**Rule Structure**:

**Helper Functions**:
```javascript
function isAuthenticated() {
  return request.auth != null;
}

function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}

function isAdmin() {
  return isAuthenticated() &&
    (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
      (request.auth.token.email == "wongchengyong100@gmail.com" && 
       request.auth.token.email_verified == true));
}
```

**Collection Rules**:

**Users Collection**:
```javascript
match /users/{uid} {
  allow read: if isOwner(uid) || isAdmin();
  allow create: if isOwner(uid) && isValidUser(request.resource.data);
  allow update: if (isOwner(uid) && isValidUser(request.resource.data) && 
                    request.resource.data.role == resource.data.role) || isAdmin();
}
```

**Saved Itineraries Collection**:
```javascript
match /saved_itineraries/{itineraryId} {
  allow read: if isAuthenticated() && 
                 (resource.data.uid == request.auth.uid || isAdmin());
  allow create: if isAuthenticated() && isValidItinerary(request.resource.data);
  allow update: if isAuthenticated() && 
                   (resource.data.uid == request.auth.uid && 
                    isValidItinerary(request.resource.data)) || isAdmin();
  allow delete: if isAuthenticated() && 
                   (resource.data.uid == request.auth.uid || isAdmin());
}
```

**Price Alerts Collection**:
```javascript
match /price_alerts/{alertId} {
  allow read: if isAuthenticated() && 
                 (resource.data.uid == request.auth.uid || isAdmin());
  allow create: if isAuthenticated() && 
                   request.resource.data.uid == request.auth.uid &&
                   request.resource.data.targetPrice < request.resource.data.currentPrice;
  allow update: if isAuthenticated() && 
                   (resource.data.uid == request.auth.uid || isAdmin());
  allow delete: if isAuthenticated() && 
                   (resource.data.uid == request.auth.uid || isAdmin());
}
```

**Search History Collection**:
```javascript
match /search_history/{historyId} {
  allow read: if isAuthenticated() && 
                 (resource.data.uid == request.auth.uid || isAdmin());
  allow create: if isAuthenticated() && 
                   request.resource.data.uid == request.auth.uid;
  allow delete: if isAuthenticated() && 
                   (resource.data.uid == request.auth.uid || isAdmin());
}
```

---

## 6.2.3 API Service Configuration

### server.ts

**Purpose**: Express server for serving API endpoints and static files in production.

**Location**: `./server.ts`

**Implementation**:

```typescript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/search', (await import('./api/search.js')).default);
app.use('/api/tracking', (await import('./api/tracking.js')).default);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Key Features**:
- Express middleware for JSON parsing
- Static file serving from `dist/` directory
- API route mounting for search and tracking
- SPA fallback for client-side routing
- Environment-based port configuration

---

### api/search.js

**Purpose**: Flight search API endpoint powered by Google Gemini AI.

**Location**: `./api/search.js`

**Implementation**:

```javascript
import { GoogleGenerativeAI } from '@google/generai';
import express from 'express';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { query, departureDate } = req.body;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Search for flights: ${query} on ${departureDate}. 
                    Return JSON with flight details including reliability scores.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const flights = JSON.parse(response.text());
    
    res.json(flights);
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

export default router;
```

**Features**:
- POST endpoint for flight searches
- Google Gemini AI integration
- JSON response with flight data
- Error handling and logging
- Rate limiting consideration

---

### api/tracking.js

**Purpose**: Live flight tracking API endpoint.

**Location**: `./api/tracking.js`

**Implementation**:

```javascript
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { flightNumber } = req.body;
    
    // Flight tracking logic here
    const trackingData = {
      flightNumber,
      status: 'IN AIR',
      altitude: 36000,
      speed: 850,
      progress: 45,
      // Additional tracking data
    };
    
    res.json(trackingData);
  } catch (error) {
    console.error('Tracking API error:', error);
    res.status(500).json({ error: 'Failed to track flight' });
  }
});

export default router;
```

---

### src/services/flightService.ts

**Purpose**: Client-side service for making API calls to flight search and tracking endpoints.

**Location**: `./src/services/flightService.ts`

**Implementation**:

```typescript
const CACHE_PREFIX = 'smartflight_cache_';
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getFromCache(key: string) {
  try {
    const cached = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

function setToCache(key: string, data: any) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn("Cache storage failed", e);
  }
}

export async function searchFlight(
  query: string, 
  useDemo: boolean = false, 
  departureDate?: string
): Promise<Itinerary[]> {
  if (useDemo) return DEMO_ITINERARIES;
  
  const cacheKey = `search_${query.toLowerCase().replace(/\s+/g, '_')}_${departureDate || 'nodate'}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;

  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, departureDate }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      if (errorData.error === "RATE_LIMIT_EXCEEDED") {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      throw new Error(errorData.error || "Failed to fetch flight data");
    }

    const data = await res.json();
    const sortedData = data.sort((a: Itinerary, b: Itinerary) => 
      b.reliabilityScore - a.reliabilityScore
    );
    setToCache(cacheKey, sortedData);
    return sortedData;
  } catch (e: any) {
    if (e?.message?.includes('RATE_LIMIT_EXCEEDED')) {
      throw e;
    }
    console.error("Failed to fetch flight data", e);
    return [];
  }
}
```

**Key Features**:
- Session storage caching with 30-minute TTL
- Demo mode for testing without API calls
- Rate limit error handling
- Result sorting by reliability score
- Error recovery and logging

---

## 6.2.4 Machine Learning Utility Files

### Reliability Score Calculation

**Purpose**: Calculate flight reliability scores based on multiple factors.

**Implementation** (in App.tsx):

```typescript
function calculateReliabilityScore(itinerary: Itinerary): number {
  let score = 10.0;
  
  // Factor 1: Disruption probability of each leg
  itinerary.legs.forEach(leg => {
    score -= leg.disruptionProbability * 5;
  });
  
  // Factor 2: Connection risk
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
  
  // Clamp score between 0 and 10
  return Math.max(0, Math.min(10, score));
}
```

**Factors Considered**:
- Individual leg disruption probabilities
- Connection risk levels
- Number of connections/layovers
- Historical on-time performance

---

### Connection Risk Analysis

**Purpose**: Analyze connection risk based on layover time and airport factors.

**Implementation**:

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

**Risk Levels**:
- **LOW**: Layover time exceeds minimum by 60+ minutes
- **MEDIUM**: Layover time meets minimum requirements
- **HIGH**: Layover time below minimum connection time

---

## 6.2.5 Frontend Utility Scripts

### src/lib/utils.ts

**Purpose**: Utility functions for class name merging and manipulation.

**Location**: `./src/lib/utils.ts`

**Implementation**:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage**:
```typescript
// Conditional class names
<div className={cn(
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
)} />

// Merging Tailwind classes with override
<div className={cn(
  "px-4 py-2",
  large && "px-6 py-3"  // Overrides px-4 py-2
)} />
```

**Benefits**:
- Combines clsx for conditional classes
- Uses tailwind-merge to handle conflicts
- Ensures last class wins for Tailwind utilities
- Type-safe with ClassValue

---

### Date Formatting Utilities

**Purpose**: Format dates consistently across the application using date-fns.

**Location**: Used throughout components

**Common Patterns**:

```typescript
import { format, parseISO, addDays, addMonths } from 'date-fns';

// Format ISO date to readable string
const formattedDate = format(parseISO(isoString), 'dd MMM yyyy');
// Output: "15 Jan 2025"

// Format time
const formattedTime = format(parseISO(isoString), 'HH:mm');
// Output: "14:30"

// Add days to date
const futureDate = addDays(new Date(), 7);

// Add months to date
const nextMonth = addMonths(new Date(), 1);
```

**Date Formats Used**:
- `dd MMM yyyy` - Date display (15 Jan 2025)
- `HH:mm` - Time display (14:30)
- `yyyy-MM-dd` - Input values (2025-01-15)

---

### Type Definitions

**Purpose**: TypeScript type definitions for type safety.

**Location**: `./src/types/global.d.ts`

**Key Interfaces**:

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
  connectionRiskValue: number;
  status: 'RELIABLE' | 'CAUTION' | 'HIGH RISK';
  price: number;
  alternatives?: Itinerary[];
}

interface LiveFlightData {
  flightNumber: string;
  airline: string;
  origin: { airport: string; city: string; time: string; terminal: string; gate: string };
  destination: { airport: string; city: string; time: string; terminal: string; gate: string };
  status: 'IN AIR' | 'SCHEDULED' | 'LANDED' | 'DELAYED';
  progress: number;
  altitude: number;
  speed: number;
  aircraft: { model: string; age: string; registration: string };
  estimatedArrival: string;
}
```

---

## Summary

This document covers all major configuration and utility files used in the Smart Flight application:

1. **Application Configuration**: Build tools, TypeScript, and package management
2. **Database Configuration**: Firebase initialization and security rules
3. **API Service Configuration**: Server setup and API endpoints
4. **Machine Learning Utilities**: Reliability scoring and risk analysis
5. **Frontend Utilities**: Helper functions and type definitions

All files work together to provide a robust, type-safe, and well-structured application architecture.
