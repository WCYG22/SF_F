# Basic-Level Functionalities

## 6.6 Overview of Basic-Level Functionalities

As Smart Flight aims to provide an accessible and intuitive flight search experience, the basic-level functionalities form the core user interactions that enable flight discovery, tracking, and management. This section describes the fundamental features that users interact with daily, including flight search, result filtering, live tracking, itinerary management, and user authentication. These functionalities are designed to be simple yet powerful, allowing users to quickly find reliable flights without requiring technical expertise.

---

## 6.6.1 Flight Search Functionality

The flight search feature is the primary entry point for users, allowing them to query flight options between airports with specified travel dates. The search functionality supports multiple trip types and provides intelligent results based on user preferences.

### Search Query Processing

The search function accepts natural language queries and structured inputs to find relevant flight itineraries.

```typescript
async function handleSearch(e: React.FormEvent) {
  e.preventDefault();
  
  if (!origin || !destination || !date) {
    setError("Please select departure, destination, and travel date");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const query = `${origin} to ${destination} on ${date}`;
    const results = await searchFlight(query, isDemoMode, date);
    setItineraries(results);
    
    await handleSaveSearchHistory(origin, destination, date, results.length);
  } catch (error) {
    setError("An error occurred while searching for flights");
  } finally {
    setLoading(false);
  }
}
```
*Figure 6.48: Flight Search Handler Implementation*

Therefore, the search handler validates that all required fields (origin, destination, date) are filled before proceeding, constructs a natural language query string from user inputs, calls the backend API through the searchFlight service function, stores search history in Firestore for user reference, and implements proper error handling with user-friendly messages. This process ensures users receive accurate flight information while the system maintains a record of their search activity for future reference.

### Trip Type Selection

Users can choose between one-way, return, and multi-city trips to accommodate different travel patterns.

```typescript
function TripTypeSelector({ tripType, onChange }: TripTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onChange('oneway')}
        className={tripType === 'oneway' ? 'active' : 'inactive'}
      >
        One-Way
      </button>
      <button 
        onClick={() => onChange('return')}
        className={tripType === 'return' ? 'active' : 'inactive'}
      >
        Return
      </button>
      <button 
        onClick={() => onChange('multicity')}
        className={tripType === 'multicity' ? 'active' : 'inactive'}
      >
        Multi-City
      </button>
    </div>
  );
}

// For return trips, search both directions
if (tripType === 'return') {
  const outboundResults = await searchFlight(
    `${origin} to ${destination} on ${date}`
  );
  const returnResults = await searchFlight(
    `${destination} to ${origin} on ${returnDate}`
  );
  setItineraries(outboundResults);
  setReturnItineraries(returnResults);
}
```
*Figure 6.49: Trip Type Selection Implementation*

For example, Figure 6.49 shows the trip type selection that allows one-way trips requiring only departure date, return trips requiring both departure and return dates with separate searches for each direction, and multi-city trips supporting multiple legs with independent origin, destination, and date selections. This flexibility accommodates various travel scenarios from simple point-to-point journeys to complex multi-destination trips.

### Search Results Caching

To improve performance and reduce API calls, search results are cached in session storage with a time-to-live mechanism.

```typescript
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getFromCache(key: string) {
  const cached = sessionStorage.getItem(CACHE_PREFIX + key);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_TTL) {
    sessionStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
  return data;
}

function setToCache(key: string, data: any) {
  sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}

// Usage in search function
const cacheKey = `search_${query}_${date}`;
const cachedData = getFromCache(cacheKey);
if (cachedData) return cachedData;

const freshData = await fetchFromAPI(query);
setToCache(cacheKey, freshData);
return freshData;
```
*Figure 6.50: Search Results Caching Mechanism*

  Therefore, caching implementation stores search results for 30 minutes to avoid redundant API calls, uses session storage to maintain cache only during active browser session, generates unique cache keys based on search parameters (origin, destination, date), and automatically invalidates expired cache entries to ensure data freshness. This optimization significantly improves response times for repeated searches while reducing server load.

---

## 6.6.2 Results Filtering and Sorting

After receiving search results, users can refine the displayed itineraries using filtering and sorting controls. These features help users quickly identify flights that match their specific preferences.

### Sorting Options

Users can sort flight results by either reliability score or price to prioritize different aspects of their travel.

```typescript
function handleSortChange(sortBy: 'reliability' | 'price') {
  setSortBy(sortBy);
}

const sortedItineraries = [...itineraries].sort((a, b) => {
  if (sortBy === 'reliability') {
    return b.reliabilityScore - a.reliabilityScore;
  }
  return a.price - b.price;
});
```
*Figure 6.51: Sorting Implementation for Search Results*

For example, Figure 6.51 demonstrates sorting that allows reliability sorting displaying highest-scored flights first (descending order from 10 to 0), and price sorting displaying cheapest flights first (ascending order). The sorting applies immediately without requiring page reload, providing instant visual feedback as users switch between sort criteria. This dual-sorting approach acknowledges that some users prioritize reliability while others prioritize cost savings.

### Airline Filtering

Users can filter results to show only flights from specific airlines.

```typescript
const uniqueAirlines = Array.from(new Set(
  itineraries.flatMap(it => it.legs.map(leg => leg.airline))
));

function handleAirlineFilter(airline: string) {
  setFilterAirline(airline);
}

const filteredByAirline = itineraries.filter(itinerary => {
  if (!filterAirline) return true;
  return itinerary.legs.some(leg => leg.airline === filterAirline);
});
```
*Figure 6.52: Airline Filtering Implementation*

Therefore, airline filtering extracts unique airline names from search results dynamically, allows users to select specific airlines from a dropdown menu, filters itineraries to show only those operated by the selected airline (including connecting flights), and displays all airlines when no filter is selected. This feature is particularly useful for users with airline loyalty programs or preferences for specific carriers.

### Connection Stops Filtering

Users can filter flights based on the number of connections required.

```typescript
function handleStopsFilter(stops: number | null) {
  setFilterStops(stops);
}

const filteredByStops = itineraries.filter(itinerary => {
  if (filterStops === null) return true;
  return (itinerary.legs.length - 1) === filterStops;
});

// Filter options
// 0 stops = Direct flights only (1 leg)
// 1 stop = One connection (2 legs)
// 2+ stops = Multiple connections (3+ legs)
```
*Figure 6.53: Connection Stops Filtering Logic*

For example, Figure 6.53 shows stops filtering where direct flights contain only one leg with no connections, one-stop flights have exactly two legs with one connection point, and multi-stop flights have three or more legs with multiple connections. Users preferring convenience can select direct flights only, while budget-conscious travelers might accept connections for lower prices. The filter calculates stops by counting flight legs minus one.

### Time of Day Filtering

Users can filter flights by departure time to match their schedule preferences.

```typescript
function handleTimeFilter(timeOfDay: 'morning' | 'afternoon' | 'evening' | null) {
  setFilterTimeOfDay(timeOfDay);
}

const filteredByTime = itineraries.filter(itinerary => {
  if (!filterTimeOfDay) return true;
  
  const firstLeg = itinerary.legs[0];
  const depHour = parseISO(firstLeg.departure.scheduled).getHours();
  
  if (filterTimeOfDay === 'morning' && (depHour >= 6 && depHour < 12)) return true;
  if (filterTimeOfDay === 'afternoon' && (depHour >= 12 && depHour < 18)) return true;
  if (filterTimeOfDay === 'evening' && (depHour >= 18 && depHour < 24)) return true;
  
  return false;
});
```
*Figure 6.54: Time of Day Filtering Implementation*

Therefore, time filtering categorizes flights into morning (6:00 AM - 11:59 AM), afternoon (12:00 PM - 5:59 PM), and evening (6:00 PM - 11:59 PM) based on departure time. This categorization helps users find flights that align with their daily schedule, whether they prefer early morning departures to maximize destination time or evening flights after work commitments.

---

## 6.6.3 Live Flight Tracking

The live flight tracking feature allows users to monitor real-time status of specific flights by entering flight numbers. This functionality provides comprehensive information about aircraft position, altitude, speed, and estimated arrival time.

### Flight Number Input and Tracking

Users enter a flight number to initiate tracking and receive live updates about the flight's status.

```typescript
async function handleTrack(e: React.FormEvent) {
  e.preventDefault();
  
  if (!flightNumber) {
    setError("Please enter a flight number");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const trackingData = await trackFlight(flightNumber, isDemoMode);
    
    if (trackingData) {
      setTrackingFlight(trackingData);
    } else {
      setError("Could not find flight data. Please check the flight number.");
    }
  } catch (error) {
    setError("An error occurred while tracking the flight");
  } finally {
    setLoading(false);
  }
}
```
*Figure 6.55: Live Flight Tracking Handler*

For example, Figure 6.55 demonstrates the tracking handler that validates flight number input before making API calls, calls the backend tracking API with the provided flight number, processes the response to extract live flight data including position and status, displays tracking visualization or error message based on response, and implements loading states during API communication. This process enables users to monitor flights in real-time by simply entering the flight number.

### Flight Status Display

The tracking interface displays comprehensive flight information including origin, destination, current status, and progress.

```typescript
interface LiveFlightData {
  flightNumber: string;
  airline: string;
  origin: {
    airport: string;
    city: string;
    time: string;
    terminal: string;
    gate: string;
  };
  destination: {
    airport: string;
    city: string;
    time: string;
    terminal: string;
    gate: string;
  };
  status: 'IN AIR' | 'SCHEDULED' | 'LANDED' | 'DELAYED';
  progress: number; // 0-100%
  altitude: number; // feet
  speed: number; // kph
  estimatedArrival: string;
}

function FlightStatusDisplay({ data }: { data: LiveFlightData }) {
  return (
    <div>
      <FlightHeader 
        flightNumber={data.flightNumber}
        airline={data.airline}
        status={data.status}
      />
      <AirportInfo 
        origin={data.origin}
        destination={data.destination}
      />
      <FlightMetrics 
        altitude={data.altitude}
        speed={data.speed}
        progress={data.progress}
        eta={data.estimatedArrival}
      />
    </div>
  );
}
```
*Figure 6.56: Flight Status Data Structure and Display*

Therefore, the flight status display shows origin and destination airport codes, cities, and terminal information, displays current flight status (in air, scheduled, landed, delayed) with color coding, presents real-time metrics including altitude in feet, ground speed in kilometers per hour, shows progress percentage indicating completion of route, and displays estimated arrival time. This comprehensive view provides users with complete situational awareness of their monitored flight.

---

## 6.6.4 Itinerary Management

Registered users can save flight itineraries for future reference, enabling easy comparison and booking at a later time. The itinerary management system provides persistent storage through Firebase Firestore.

### Saving Itineraries

Users can save search results to their profile for future access.

```typescript
async function handleSaveItinerary(itinerary: Itinerary) {
  if (!user) {
    setError("Login required to save itineraries");
    return;
  }

  if (!user.emailVerified) {
    setError("Email verification required");
    return;
  }

  const docId = `${user.uid}_${itinerary.id}`;

  try {
    await setDoc(doc(db, 'saved_itineraries', docId), {
      uid: user.uid,
      itineraryId: itinerary.id,
      origin: itinerary.legs[0].departure.airport,
      destination: itinerary.legs[itinerary.legs.length - 1].arrival.airport,
      reliabilityScore: itinerary.reliabilityScore,
      price: itinerary.price,
      legs: itinerary.legs,
      status: itinerary.status,
      connectionRisk: itinerary.connectionRisk,
      savedAt: serverTimestamp()
    });
  } catch (error) {
    setError("Failed to save itinerary");
  }
}
```
*Figure 6.57: Save Itinerary Implementation*

For example, Figure 6.57 shows the save operation that validates user authentication and email verification before allowing saves, generates unique document ID combining user ID and itinerary ID, stores complete itinerary data including flight legs, prices, and reliability scores, timestamps the save operation for sorting and history tracking, and implements error handling with user feedback. This functionality enables users to build a collection of preferred flights for comparison and future booking.

### Viewing Saved Itineraries

Users can access their saved itineraries through the profile section with real-time synchronization.

```typescript
useEffect(() => {
  if (!user) {
    setSavedItineraries([]);
    return;
  }

  const q = query(
    collection(db, 'saved_itineraries'),
    where('uid', '==', user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const saved = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setSavedItineraries(saved);
  });

  return () => unsubscribe();
}, [user]);
```
*Figure 6.58: Real-Time Saved Itineraries Synchronization*

Therefore, the saved itineraries view uses Firestore real-time listeners for automatic updates across devices, filters itineraries by user ID to show only user-owned data, updates the UI immediately when data changes without page refresh, and automatically cleans up listeners when component unmounts to prevent memory leaks. This implementation ensures users always see their current saved itineraries across all sessions and devices.

### Deleting Saved Itineraries

Users can remove itineraries from their saved collection when they are no longer needed.

```typescript
async function handleDeleteSaved(savedId: string) {
  try {
    await deleteDoc(doc(db, 'saved_itineraries', savedId));
  } catch (error) {
    setError("Failed to delete itinerary");
  }
}

// Bulk delete for multiple selections
async function handleDeleteSelected() {
  for (const id of selectedItems) {
    await handleDeleteSaved(id);
  }
  setSelectedItems(new Set());
}
```
*Figure 6.59: Delete Saved Itinerary Implementation*

For example, Figure 6.59 demonstrates deletion functionality that removes documents from Firestore using document ID, supports bulk deletion for removing multiple itineraries at once through checkbox selection, updates UI automatically through Firestore listeners after deletion, and implements error handling with user feedback. This feature helps users maintain a clean and relevant collection of saved flights.

---

## 6.6.5 User Authentication

User authentication provides secure access to personalized features including saved itineraries, price alerts, and search history. The authentication system uses Firebase Auth with email verification requirements.

### User Registration

New users can create accounts using email and password with automatic email verification.

```typescript
async function handleRegister(email: string, password: string) {
  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  setLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    await sendEmailVerification(userCredential.user);
    
    setSuccess("Registration successful! Please check your email for verification link.");
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      setError("This email is already registered");
    } else if (error.code === 'auth/invalid-email') {
      setError("Invalid email format");
    } else {
      setError("Registration failed");
    }
  } finally {
    setLoading(false);
  }
}
```
*Figure 6.60: User Registration Implementation*

Therefore, user registration validates password length (minimum 6 characters) before submission, creates Firebase Auth account with email and password credentials, automatically sends email verification link to the provided address, provides specific error messages for common failure scenarios (duplicate email, invalid format), and implements loading states during asynchronous operations. This process ensures secure account creation while guiding users through email verification.

### User Login

Registered users can authenticate using their email and password to access personalized features.

```typescript
async function handleLogin(email: string, password: string) {
  setLoading(true);
  setError(null);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    setUser(userCredential.user);
    
    if (!userCredential.user.emailVerified) {
      setWarning("Please verify your email to access all features");
    }
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential' || 
        error.code === 'auth/wrong-password') {
      setError("Invalid email or password");
    } else {
      setError("Login failed");
    }
  } finally {
    setLoading(false);
  }
}
```
*Figure 6.61: User Login Implementation*

For example, Figure 6.61 shows the login process that authenticates credentials through Firebase Auth, updates application state with authenticated user information, checks email verification status and displays warnings if unverified, provides user-friendly error messages for authentication failures, and maintains login session across page refreshes through Firebase persistence. This authentication flow balances security with user experience.

### Email Verification Status Check

The application verifies email verification status before allowing access to protected features.

```typescript
function ProtectedFeature() {
  if (!user) {
    return <div>Please login to access this feature</div>;
  }

  if (!user.emailVerified) {
    return (
      <div>
        <p>Email verification required</p>
        <button onClick={handleResendVerification}>
          Resend Verification Email
        </button>
      </div>
    );
  }

  return <FeatureContent />;
}

async function handleResendVerification() {
  if (!auth.currentUser) return;
  
  try {
    await sendEmailVerification(auth.currentUser);
    setSuccess("Verification email sent!");
  } catch (error) {
    setError("Failed to send verification email");
  }
}
```
*Figure 6.62: Email Verification Check Implementation*

Therefore, email verification checks block access to protected features until email is verified, provide clear messaging about verification requirements, offer resend verification email functionality for users who didn't receive initial email, and update verification status when users click verification links. This security measure prevents unauthorized account creation while ensuring legitimate users can easily complete verification.

### Password Reset

Users can reset forgotten passwords through email-based recovery.

```typescript
async function handlePasswordReset(email: string) {
  if (!email) {
    setError("Email address required");
    return;
  }

  setLoading(true);

  try {
    await sendPasswordResetEmail(auth, email);
    setSuccess("Password reset email sent! Check your inbox.");
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      setError("No account found with this email");
    } else if (error.code === 'auth/invalid-email') {
      setError("Invalid email format");
    } else {
      setError("Failed to send reset email");
    }
  } finally {
    setLoading(false);
  }
}
```
*Figure 6.63: Password Reset Implementation*

For example, Figure 6.63 demonstrates password recovery that validates email input before sending reset request, sends password reset link to the provided email address, provides specific error messages for invalid emails or non-existent accounts, and guides users to check their inbox for reset instructions. This functionality ensures users can recover access to their accounts securely without administrator intervention.

---

## 6.6.6 Search History Tracking

The application maintains a history of user searches to enable quick re-searching of previous routes and to provide insights into travel patterns.

### Recording Search History

Each search is automatically recorded in Firestore with relevant metadata.

```typescript
async function handleSaveSearchHistory(
  origin: string,
  destination: string,
  searchDate: string,
  resultCount: number
) {
  if (!user) return;

  const docId = `${user.uid}_${Date.now()}`;

  try {
    await setDoc(doc(db, 'search_history', docId), {
      uid: user.uid,
      origin: origin,
      destination: destination,
      searchDate: searchDate,
      resultCount: resultCount,
      status: 'Viewed',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to save search history:', error);
  }
}

// Called after successful search
const results = await searchFlight(query, date);
await handleSaveSearchHistory(origin, destination, date, results.length);
```
*Figure 6.64: Search History Recording Implementation*

Therefore, search history recording captures origin and destination airports for each search, stores the search date and number of results found, timestamps each search for chronological ordering, links history to user account for personalized tracking, and executes silently without blocking the main search flow. This automatic tracking builds a comprehensive history of user travel research without requiring explicit action.

### Displaying Search History

Users can view their search history ordered by recency to quickly revisit previous searches.

```typescript
useEffect(() => {
  if (!user) {
    setSearchHistory([]);
    return;
  }

  const q = query(
    collection(db, 'search_history'),
    where('uid', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const history = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        from: data.origin,
        to: data.destination,
        date: data.searchDate,
        resultCount: data.resultCount,
        status: data.status
      };
    });
    setSearchHistory(history);
  });

  return () => unsubscribe();
}, [user]);
```
*Figure 6.65: Search History Display Implementation*

For example, Figure 6.65 shows search history retrieval that queries Firestore for user-specific search records, orders results by creation time (newest first), displays origin, destination, search date, and result count, and updates in real-time through Firestore listeners. Users can click on historical searches to quickly repeat those queries, saving time on frequently searched routes.

### Clearing Search History

Users can delete individual search records or clear all history at once.

```typescript
async function handleDeleteSearchHistory(historyId: string) {
  try {
    await deleteDoc(doc(db, 'search_history', historyId));
  } catch (error) {
    setError("Failed to delete search history");
  }
}

async function handleClearAllHistory() {
  for (const item of searchHistory) {
    await handleDeleteSearchHistory(item.id);
  }
}
```
*Figure 6.66: Search History Deletion Implementation*

Therefore, history deletion allows removal of individual search records through delete buttons, supports clearing all history through a bulk delete operation, updates the UI immediately through Firestore listeners, and implements error handling with user feedback. This functionality helps users maintain privacy and manage their search history according to their preferences.

---

## Summary

The basic-level functionalities of Smart Flight provide users with essential tools for discovering and managing flight information. Flight search functionality accepts natural language queries and structured inputs, supporting one-way, return, and multi-city trips with intelligent caching. Results filtering and sorting enable users to refine displayed itineraries by reliability, price, airline, number of stops, and departure time. Live flight tracking provides real-time status updates including position, altitude, speed, and estimated arrival time. Itinerary management allows authenticated users to save, view, and delete flight options through Firebase Firestore with real-time synchronization. User authentication implements secure email/password registration with email verification requirements and password recovery. Search history tracking automatically records all searches for quick re-access and pattern analysis.

These fundamental features work together to create an intuitive and efficient flight search experience that prioritizes reliability information while maintaining ease of use. The implementation emphasizes responsiveness through real-time updates, accessibility through clear interfaces, and security through Firebase authentication and Firestore security rules.
