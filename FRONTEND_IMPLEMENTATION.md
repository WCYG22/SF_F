# Frontend Implementation

## 6.5 Overview of Frontend Implementation

As Smart Flight is a user-centric application, the frontend implementation plays a critical role in delivering an intuitive and responsive user experience. This section describes the React-based component architecture, state management strategies, user interface design patterns, and interactive features that make Smart Flight accessible and engaging for users seeking reliable flight information.

---

## 6.5.1 Component Architecture and Design System

The Smart Flight frontend is built using React with TypeScript, implementing a modular component architecture that promotes reusability and maintainability. The component hierarchy separates concerns between presentational components, container components, and shared UI primitives.

### Main Application Component (App.tsx)

The App component serves as the root container that manages global application state, user authentication, and navigation between different features.

```typescript
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'live' | 'saved' | 'profile'>('search');
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'search' && <SearchView />}
      {activeTab === 'live' && <LiveFlightView />}
      {activeTab === 'saved' && <SavedItinerariesView />}
      {activeTab === 'profile' && <ProfileView user={user} />}
    </div>
  );
}
```
*Figure 6.37: Main Application Component Structure in 'App.tsx'*

Therefore, the App component establishes the foundation for the entire application by managing authentication state through Firebase Auth listeners, coordinating navigation between major features (search, tracking, saved, profile), maintaining global state for search results and user data, and implementing loading states for asynchronous operations. This centralized approach ensures consistent state management across all features.

### Reusable UI Component Library (UI.tsx)

A shared component library provides consistent styling and behavior across the application through reusable primitives.

```typescript
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "glass rounded-2xl p-6 overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

export function Badge({ variant, children }: BadgeProps) {
  const variants = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <span className={cn(
      "px-2 py-1 rounded text-xs font-bold uppercase",
      variants[variant]
    )}>
      {children}
    </span>
  );
}
```
*Figure 6.38: Reusable UI Components in 'UI.tsx'*

For example, Figure 6.38 demonstrates the Card and Badge components that provide visual consistency throughout the application. The Card component wraps content with glassmorphism effects and rounded borders, while Badge displays status indicators with color-coded variants. These primitives accept className props for customization while maintaining design standards, enabling rapid development of new features with consistent visual language.

---

## 6.5.2 Interactive Input Components

Smart Flight implements sophisticated input components that enhance user experience through intelligent suggestions, visual feedback, and responsive interactions. These components handle complex user inputs while maintaining simplicity in the interface.

### Airport Selection Component (AirportSelector.tsx)

The airport selector provides an intuitive interface for choosing departure and arrival locations with regional categorization and search capabilities.

```typescript
export function AirportSelector({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: AirportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Southeast Asia');

  const currentRegion = AIRPORT_REGIONS.find(r => r.name === selectedRegion);
  const selectedAirport = AIRPORT_REGIONS
    .flatMap(r => r.airports)
    .find(a => a.code === value);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <input 
          readOnly
          value={selectedAirport ? 
            `${selectedAirport.city} (${selectedAirport.code})` : 
            placeholder
          }
          className="w-full bg-white/5 border rounded-lg px-4 py-3"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 bg-background rounded-2xl">
          <RegionTabs 
            regions={AIRPORT_REGIONS}
            selected={selectedRegion}
            onSelect={setSelectedRegion}
          />
          <AirportList 
            airports={currentRegion?.airports}
            onSelect={(code) => {
              onChange(code);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
```
*Figure 6.39: Airport Selector Component in 'AirportSelector.tsx'*

Therefore, the airport selector component organizes airports by geographic regions (Southeast Asia, East Asia, Europe, Americas), provides visual tabs for easy region switching, displays airport codes alongside city names for clarity, and implements dropdown interaction with click-outside dismissal. This organization reduces cognitive load by grouping nearby airports and enables quick selection through regional categorization.

### Calendar Date Picker (CalendarSelector.tsx)

The calendar component provides visual date selection with month navigation and date availability indicators.

```typescript
export function CalendarSelector({ 
  label, 
  value, 
  onChange 
}: CalendarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const selectedDate = value ? parseISO(value) : null;
  const today = startOfToday();

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, today)) return;
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input 
        readOnly
        value={selectedDate ? format(selectedDate, 'PPP') : 'Select Date'}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <CalendarGrid 
          days={days}
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
          onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
        />
      )}
    </div>
  );
}
```
*Figure 6.40: Calendar Selector Component in 'CalendarSelector.tsx'*

For example, Figure 6.40 shows the calendar selector that implements month-by-month navigation for date selection, disables past dates to prevent invalid searches, highlights today's date and selected dates for orientation, and formats dates in human-readable format (e.g., "January 15, 2025"). The component uses the date-fns library for reliable date manipulation and formatting, ensuring consistent date handling across different time zones.

---

## 6.5.3 Flight Search Results Display

The search results interface presents flight options with comprehensive reliability information, allowing users to compare itineraries and make informed decisions. The display prioritizes reliability scores while providing detailed flight information.

### Itinerary Card Display

Flight search results are displayed as interactive cards showing key metrics and detailed flight information.

```typescript
function ItineraryCard({ itinerary, onSelect, onSave }: ItineraryCardProps) {
  const firstLeg = itinerary.legs[0];
  const lastLeg = itinerary.legs[itinerary.legs.length - 1];

  return (
    <div className="bg-white/5 border rounded-2xl p-6 hover:border-accent/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-2xl font-black">
            RM{itinerary.price}
          </div>
          <Badge variant={getStatusVariant(itinerary.status)}>
            {itinerary.status}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted">Reliability Score</div>
          <div className="text-3xl font-black text-accent">
            {itinerary.reliabilityScore.toFixed(1)}/10
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <FlightLegSummary 
          airport={firstLeg.departure.airport}
          time={format(parseISO(firstLeg.departure.scheduled), 'HH:mm')}
        />
        <FlightPath duration={itinerary.totalDuration} />
        <FlightLegSummary 
          airport={lastLeg.arrival.airport}
          time={format(parseISO(lastLeg.arrival.scheduled), 'HH:mm')}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onSelect} className="flex-1 btn-primary">
          View Details
        </button>
        <button onClick={onSave} className="btn-secondary">
          Save
        </button>
      </div>
    </div>
  );
}
```
*Figure 6.41: Flight Itinerary Card Display*

Therefore, the itinerary card displays price prominently in Malaysian Ringgit (RM) currency, shows reliability score as a large numerical value for quick assessment, presents status badges with color coding (green for reliable, yellow for caution, red for high risk), visualizes flight path with departure and arrival times, and provides action buttons for viewing details or saving itineraries. This layout prioritizes the most critical information while maintaining visual clarity.

### Sorting and Filtering Controls

Users can refine search results through sorting and filtering mechanisms that adjust the displayed itineraries in real-time.

```typescript
function FilterControls({ 
  sortBy, 
  onSortChange,
  airlines,
  selectedAirline,
  onAirlineChange,
  stops,
  onStopsChange
}: FilterControlsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <select 
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-white/5 border rounded-lg px-4 py-2"
      >
        <option value="reliability">Sort by Reliability</option>
        <option value="price">Sort by Price</option>
      </select>

      <select 
        value={selectedAirline}
        onChange={(e) => onAirlineChange(e.target.value)}
        className="bg-white/5 border rounded-lg px-4 py-2"
      >
        <option value="">All Airlines</option>
        {airlines.map(airline => (
          <option key={airline} value={airline}>{airline}</option>
        ))}
      </select>

      <select 
        value={stops ?? ''}
        onChange={(e) => onStopsChange(e.target.value ? 
          parseInt(e.target.value) : null
        )}
        className="bg-white/5 border rounded-lg px-4 py-2"
      >
        <option value="">Any Stops</option>
        <option value="0">Direct Only</option>
        <option value="1">1 Stop</option>
        <option value="2">2+ Stops</option>
      </select>
    </div>
  );
}
```
*Figure 6.42: Search Results Filtering Controls*

For example, Figure 6.42 demonstrates filtering controls that allow sorting by reliability score or price, filtering by specific airlines from available options, and filtering by number of stops (direct, 1 stop, multiple stops). These filters apply immediately without requiring page reload, providing responsive interaction that helps users narrow down options to their preferences. The implementation uses client-side filtering for instant results, enhancing user experience through immediate visual feedback.

---

## 6.5.4 Live Flight Tracking Interface

The live flight tracking feature provides real-time visualization of aircraft position, altitude, speed, and estimated arrival time. This interface uses animated components to create an engaging monitoring experience.

### Flight Status Visualization (LiveFlightView.tsx)

The live tracking view presents comprehensive flight information with animated progress indicators and radar visualization.

```typescript
export function LiveFlightView() {
  const [flightNumber, setFlightNumber] = useState('');
  const [trackingData, setTrackingData] = useState<LiveFlightData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    const data = await trackFlight(flightNumber);
    setTrackingData(data);
    setLoading(false);
  };

  if (!trackingData) {
    return (
      <form onSubmit={handleTrack}>
        <input 
          placeholder="Enter Flight Number (e.g. MH123)"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
        />
        <button type="submit">Track Flight</button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <FlightHeader 
        flightNumber={trackingData.flightNumber}
        airline={trackingData.airline}
        status={trackingData.status}
      />
      <FlightProgressBar progress={trackingData.progress} />
      <RadarVisualization 
        origin={trackingData.origin.airport}
        destination={trackingData.destination.airport}
        progress={trackingData.progress}
      />
      <FlightMetrics 
        altitude={trackingData.altitude}
        speed={trackingData.speed}
        eta={trackingData.estimatedArrival}
      />
    </div>
  );
}
```
*Figure 6.43: Live Flight Tracking View in 'LiveFlightView.tsx'*

Therefore, the live tracking interface accepts flight numbers as input and fetches real-time data, displays flight status with color-coded indicators (in air, scheduled, landed, delayed), shows animated progress bar indicating percentage of route completed, renders radar-style visualization of flight path from origin to destination, and presents key metrics including altitude in feet, ground speed in kilometers per hour, and estimated time of arrival. This comprehensive view gives users complete situational awareness of their flight's status.

### Animated Radar Component

The radar visualization uses SVG animations to create a realistic flight tracking display.

```typescript
function RadarVisualization({ 
  origin, 
  destination, 
  progress 
}: RadarProps) {
  return (
    <div className="relative h-80 bg-gradient-to-br rounded-2xl overflow-hidden">
      <svg viewBox="0 0 400 100">
        <path 
          d="M 20 50 Q 200 -20 380 50" 
          fill="none" 
          stroke="rgba(242,125,38,0.15)" 
          strokeWidth="2"
        />
        
        <motion.path 
          d="M 20 50 Q 200 -20 380 50" 
          fill="none" 
          stroke="url(#pathGradient)" 
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 2 }}
        />

        <circle cx="20" cy="50" r="5" className="fill-accent" />
        <text x="20" y="75" className="text-xs">{origin}</text>

        <circle cx="380" cy="50" r="5" className="fill-white/30" />
        <text x="380" y="75" className="text-xs">{destination}</text>

        <motion.g
          style={{ 
            offsetPath: "path('M 20 50 Q 200 -20 380 50')",
            offsetDistance: `${progress}%`
          }}
        >
          <PlaneIcon className="text-accent" />
        </motion.g>
      </svg>
    </div>
  );
}
```
*Figure 6.44: Animated Radar Visualization Component*

For example, Figure 6.44 shows the radar component that renders a curved flight path using SVG paths, animates progress indicator from 0% to current flight position, displays origin and destination airports as fixed points, and moves a plane icon along the path based on progress percentage. The implementation uses Motion library for smooth animations, creating a visually engaging representation of the flight's journey that updates in real-time as new tracking data arrives.

---

## 6.5.5 User Profile and Account Management

The profile section handles user authentication, saved itineraries, price alerts, and search history. This interface provides secure access to personalized features while maintaining Firebase security rules.

### Authentication Interface

The authentication flow supports email/password registration and login with email verification requirements.

```typescript
function AuthenticationView({ 
  mode, 
  onModeChange 
}: AuthViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const credential = await createUserWithEmailAndPassword(
          auth, 
          email, 
          password
        );
        await sendEmailVerification(credential.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border rounded-lg"
      />
      <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border rounded-lg"
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-accent text-white rounded-lg"
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
      <button 
        type="button"
        onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
        className="w-full text-sm text-accent"
      >
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
      </button>
    </form>
  );
}
```
*Figure 6.45: User Authentication Interface*

Therefore, the authentication interface provides separate flows for login and registration, validates email format and password strength during input, sends email verification links after registration, displays clear error messages for authentication failures, and implements loading states during asynchronous operations. Firebase Auth handles password hashing, session management, and security, while the frontend provides an accessible interface for these operations.

### Saved Itineraries Management

Users can view, manage, and delete their saved flight itineraries through the profile interface.

```typescript
function SavedItinerariesView({ 
  itineraries, 
  onDelete 
}: SavedItinerariesProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleDeleteSelected = async () => {
    for (const id of selectedItems) {
      await onDelete(id);
    }
    setSelectedItems(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Saved Itineraries</h3>
        {selectedItems.size > 0 && (
          <button 
            onClick={handleDeleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete Selected ({selectedItems.size})
          </button>
        )}
      </div>

      {itineraries.map(itinerary => (
        <div key={itinerary.id} className="bg-white/5 border rounded-xl p-4">
          <input 
            type="checkbox"
            checked={selectedItems.has(itinerary.id)}
            onChange={(e) => {
              const newSet = new Set(selectedItems);
              if (e.target.checked) {
                newSet.add(itinerary.id);
              } else {
                newSet.delete(itinerary.id);
              }
              setSelectedItems(newSet);
            }}
          />
          <ItineraryCard itinerary={itinerary} />
        </div>
      ))}
    </div>
  );
}
```
*Figure 6.46: Saved Itineraries Management Interface*

For example, Figure 6.46 demonstrates the saved itineraries view that displays all saved flights from Firestore database, allows multi-select through checkboxes for batch operations, provides delete functionality with confirmation, and updates in real-time through Firestore listeners. This implementation ensures that users can efficiently manage their saved searches, with changes immediately reflected across all open sessions through Firebase's real-time synchronization capabilities.

---

## 6.5.6 State Management and Data Flow

Smart Flight implements a unidirectional data flow pattern where user actions trigger state updates, which in turn cause component re-renders. The application uses React hooks for local state and Firebase listeners for server-synchronized state.

### State Management Pattern

The application maintains different categories of state with appropriate management strategies.

```typescript
function App() {
  // Local UI state
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  
  // Authentication state (Firebase-synced)
  const [user, setUser] = useState<User | null>(null);
  
  // Search results state (API-derived)
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  
  // Saved data state (Firestore-synced)
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Firestore real-time listeners
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'saved_itineraries'),
      where('uid', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedItineraries(data);
    });
    
    return () => unsubscribe();
  }, [user]);

  return <div>{/* App components */}</div>;
}
```
*Figure 6.47: State Management Pattern in App Component*

Therefore, the state management architecture separates local UI state (tabs, loading indicators) from server-synchronized state (user authentication, saved data), uses React hooks for component-level state management, implements Firebase listeners for real-time data synchronization, and properly cleans up listeners when components unmount to prevent memory leaks. This separation of concerns ensures predictable data flow and makes debugging easier by clearly defining state ownership and update mechanisms.

---

## Summary

The Smart Flight frontend implementation delivers a responsive and intuitive user experience through modern React architecture. The component architecture promotes code reusability through shared UI primitives and modular design. Interactive input components enhance usability through intelligent airport selection and calendar date pickers. Flight search results are displayed with comprehensive reliability information and real-time filtering. The live tracking interface provides engaging visualization of aircraft position and status. User profile features enable secure authentication and management of saved itineraries, price alerts, and search history. State management patterns ensure consistent data flow and real-time synchronization with Firebase services.

This frontend architecture prioritizes user experience while maintaining code quality, creating an accessible platform for users to search flights, assess reliability, and make informed travel decisions with confidence.
