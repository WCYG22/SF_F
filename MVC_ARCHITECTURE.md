# MVC Architecture and Directory Structure

## 6.3 Overview of MVC and Route Directories

As Smart Flight is built using React, it follows a component-based architecture that can be mapped to the Model-View-Controller (MVC) pattern. This section explains how the directory structure aligns with MVC principles, where Models represent data structures and business logic, Views handle the user interface presentation, Controllers manage the application flow and user interactions, and Routes define the API endpoints and navigation structure.

---

## 6.3.1 Model Directory

The Model layer in Smart Flight is responsible for defining data structures, managing business logic, and handling data operations. In the React-based architecture, models are represented through TypeScript interfaces, Firebase database interactions, and service layer functions.

### Type Definitions (src/types/global.d.ts)

Type definitions serve as the data model contracts, ensuring type safety and consistent data structures throughout the application.

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
```
*Figure 6.15: Data Model Definitions in 'global.d.ts'*

Therefore, these type definitions act as the Model layer by defining the structure of flight data, itinerary information, and ensuring type safety across all components. The FlightLeg interface represents individual flight segments, while the Itinerary interface encapsulates complete flight routes with reliability metrics.

### Service Layer (src/services/flightService.ts)

The service layer implements business logic and data fetching operations, serving as the bridge between the application and external APIs.

```typescript
export async function searchFlight(
  query: string,
  useDemo: boolean = false,
  departureDate?: string
): Promise<Itinerary[]> {
  if (useDemo) return DEMO_ITINERARIES;

  try {
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, departureDate }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch flight data");
    }

    const data = await res.json();
    return data.sort((a: Itinerary, b: Itinerary) => 
      b.reliabilityScore - a.reliabilityScore
    );
  } catch (error) {
    console.error("Failed to fetch flight data", error);
    return [];
  }
}
```
*Figure 6.16: Service Layer Implementation in 'flightService.ts'*

For example, Figure 6.16 shows the searchFlight function that encapsulates the business logic for flight searches. It handles API communication, error management, and data transformation, sorting results by reliability score before returning to the View layer. This separation ensures that data fetching logic is decoupled from UI components.

### Firebase Data Models (src/firebase.ts)

Firebase configuration and database models handle persistent data storage and real-time synchronization.

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
*Figure 6.17: Firebase Model Configuration*

Therefore, Firebase serves as the backend data model, providing authentication state management and Firestore database access for storing user data, saved itineraries, price alerts, and search history.

---

## 6.3.2 Route Directory

The Route layer defines the API endpoints and navigation structure of the application. In Smart Flight, routes are implemented through Express.js API endpoints on the backend and React Router for frontend navigation.

### API Routes (api/search.js)

API routes handle backend endpoints for flight search and tracking functionality.

```javascript
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, departureDate } = req.body;
    
    // Process flight search
    const results = await searchFlights(query, departureDate);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to search flights' 
    });
  }
});

export default router;
```
*Figure 6.18: API Route Definition in 'api/search.js'*

For example, Figure 6.18 demonstrates the POST endpoint at '/api/search' that receives search queries from the frontend, processes them through the search logic, and returns JSON responses with flight data. Error handling ensures proper HTTP status codes are returned for failed requests.

### Server Route Configuration (server.ts)

The server configuration mounts API routes and handles SPA routing for the React frontend.

```typescript
import express from 'express';

const app = express();

// Mount API routes
app.use('/api/search', searchRouter);
app.use('/api/tracking', trackingRouter);

// SPA fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
*Figure 6.19: Server Route Configuration in 'server.ts'*

Therefore, the server configuration defines two main route categories: API routes for backend functionality (/api/search and /api/tracking) and a catch-all route that serves the React application for client-side routing. This enables proper handling of both API requests and frontend navigation.

---

## 6.3.3 Controller Directory

The Controller layer manages application logic, handles user interactions, and coordinates between Models and Views. In React applications, controllers are implemented through component logic and state management.

### Main Application Controller (src/App.tsx)

The App component serves as the main controller, managing application state, user authentication, and orchestrating data flow between services and components.

```typescript
function App() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleSearch = async (query: string, date: string) => {
    setLoading(true);
    try {
      const results = await searchFlight(query, false, date);
      setItineraries(results);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async (itinerary: Itinerary) => {
    if (!user) {
      setError("Login required");
      return;
    }
    
    await setDoc(doc(db, 'saved_itineraries', itinerary.id), {
      uid: user.uid,
      ...itinerary,
      savedAt: serverTimestamp()
    });
  };

  return (
    // JSX rendering
  );
}
```
*Figure 6.20: Controller Logic in 'App.tsx'*

For example, Figure 6.20 shows key controller functions that manage user actions. The handleSearch function coordinates the flight search process by calling the service layer and updating the UI state, while handleSaveItinerary manages the save operation with authentication checks and database writes. These functions act as intermediaries between user interactions and data operations.

### Authentication Controller Logic

Authentication flow control manages user login, registration, and session management.

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
    if (user && !user.emailVerified) {
      setError("Please verify your email");
    }
  });
  return () => unsubscribe();
}, []);

const handleLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    setUser(userCredential.user);
  } catch (error) {
    setError("Login failed");
  }
};
```
*Figure 6.21: Authentication Controller in 'App.tsx'*

Therefore, authentication logic is centralized in the main App controller using Firebase Auth listeners and handler functions. The useEffect hook establishes a real-time authentication state observer, while handleLogin manages the login process with proper error handling.

---

## 6.3.4 View Directory

The View layer is responsible for rendering the user interface and presenting data to users. In Smart Flight, views are implemented through React components that receive data via props and display it with appropriate styling.

### Component Views (src/components/)

React components serve as the View layer, each responsible for rendering specific UI sections.

```typescript
// AirportSelector.tsx
interface AirportSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function AirportSelector({ 
  value, 
  onChange, 
  placeholder 
}: AirportSelectorProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/5"
      />
      {/* Airport suggestions dropdown */}
    </div>
  );
}
```
*Figure 6.22: View Component in 'AirportSelector.tsx'*

For example, Figure 6.22 demonstrates a reusable view component that renders an airport selection input field. The component receives data through props (value, onChange, placeholder) and focuses solely on presentation logic without containing business logic. This separation ensures components are reusable and maintainable.

### Live Flight Tracking View (src/components/LiveFlightView.tsx)

Specialized view components handle complex UI sections like real-time flight tracking display.

```typescript
interface LiveFlightViewProps {
  flightData: LiveFlightData | null;
  loading: boolean;
}

export function LiveFlightView({ 
  flightData, 
  loading 
}: LiveFlightViewProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!flightData) {
    return <EmptyState message="No flight data" />;
  }

  return (
    <div className="space-y-6">
      <FlightProgress progress={flightData.progress} />
      <AircraftInfo aircraft={flightData.aircraft} />
      <FlightStatus status={flightData.status} />
    </div>
  );
}
```
*Figure 6.23: Live Flight View Component*

Therefore, view components handle conditional rendering based on data state (loading, empty, or populated), compose smaller sub-components for complex layouts, and maintain presentation logic separate from business logic. This modular approach enables easy updates to the UI without affecting underlying functionality.

### UI Component Library (src/components/UI.tsx)

Reusable UI primitives provide consistent styling across the application.

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6",
      className
    )}>
      {children}
    </div>
  );
}

interface BadgeProps {
  variant: 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
  const variants = {
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400'
  };
  
  return (
    <span className={cn(
      "px-2 py-1 rounded-lg text-xs font-bold uppercase",
      variants[variant]
    )}>
      {children}
    </span>
  );
}
```
*Figure 6.24: Reusable UI Components in 'UI.tsx'*

For example, Figure 6.24 shows reusable UI primitives like Card and Badge components that provide consistent styling patterns. These components accept children and styling variants, enabling flexible composition while maintaining design consistency throughout the application.

---

## Summary

The Smart Flight application follows a component-based architecture that maps to MVC principles:

**Model Layer** consists of TypeScript type definitions for data contracts, service layer functions for business logic, and Firebase integration for data persistence.

**Route Layer** includes Express.js API endpoints for backend services and React Router configuration for frontend navigation.

**Controller Layer** is implemented through React component logic, managing application state, user interactions, and coordinating between services and views.

**View Layer** comprises React components that handle UI rendering, receive data via props, and focus on presentation without business logic.

This architecture ensures separation of concerns, maintainability, and scalability by clearly defining responsibilities for each layer. The component-based approach provides flexibility while adhering to MVC principles adapted for modern React applications.
