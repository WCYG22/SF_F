import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Search, 
  Clock, 
  MapPin, 
  Info, 
  ChevronRight, 
  ArrowRight, 
  Wind, 
  Navigation,
  AlertCircle,
  Activity,
  TrendingDown,
  Save,
  ArrowRightLeft,
  LogIn,
  LogOut,
  User as UserIcon,
  Mail,
  Trash2,
  Heart,
  Calendar,
  Lock,
  ShieldAlert,
  ChevronDown,
  Check,
  Bell,
} from 'lucide-react';
import { format, parseISO, addMonths, addDays } from 'date-fns';
import { searchFlight, Itinerary, FlightLeg } from './services/flightService';
import { Card, Badge } from './components/UI';
import { AirportSelector } from './components/AirportSelector';
import { CalendarSelector } from './components/CalendarSelector';
import { LiveFlightView } from './components/LiveFlightView';
import { cn } from './lib/utils';
import { AIRPORT_REGIONS } from './constants/airports';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged, 
  reload,
  User,
  handleFirestoreError,
  OperationType
} from './firebase';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [tripType, setTripType] = useState<'oneway' | 'return' | 'multicity'>('oneway');
  const [showTripTypeMenu, setShowTripTypeMenu] = useState(false);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [returnDate, setReturnDate] = useState(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
  
  // Multi-city state
  const [multiCityLegs, setMultiCityLegs] = useState<Array<{id: string; origin: string; destination: string; date: string}>>([
    { id: '1', origin: '', destination: '', date: format(new Date(), 'yyyy-MM-dd') },
    { id: '2', origin: '', destination: '', date: format(addDays(new Date(), 1), 'yyyy-MM-dd') }
  ]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [returnItineraries, setReturnItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<'reliability' | 'price'>('reliability');
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [savedFilterAirline, setSavedFilterAirline] = useState('');
  
  // Advanced Filters
  const [filterAirline, setFilterAirline] = useState<string>('');
  const [filterStops, setFilterStops] = useState<number | null>(null);
  const [filterTimeOfDay, setFilterTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | null>(null);

  // Profile Page State
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showPriceAlerts, setShowPriceAlerts] = useState(false);
  const [selectedHistoryItems, setSelectedHistoryItems] = useState<Set<number>>(new Set());
  const [selectedAlertItems, setSelectedAlertItems] = useState<Set<number>>(new Set());
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>('');

  // Navigation State
  const [activeTab, setActiveTab] = useState<'search' | 'live' | 'saved' | 'profile'>('search');

  // Live Tracking State
  const [liveFlightNumber, setLiveFlightNumber] = useState('');
  const [trackingFlight, setTrackingFlight] = useState<any | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Firebase State
  const [user, setUser] = useState<User | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<any[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedItineraries([]);
      return;
    }

    const q = query(collection(db, 'saved_itineraries'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const saved = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedItineraries(saved);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'saved_itineraries');
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setPriceAlerts([]);
      return;
    }

    const q = query(collection(db, 'price_alerts'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPriceAlerts(alerts);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    } else {
      return;
    }
    
    if (tripType === 'multicity') {
      // Validate multi-city legs
      if (multiCityLegs.some(leg => !leg.origin || !leg.destination || !leg.date)) {
        setError("Please select departure, destination, and travel date for all legs");
        return;
      }
    } else {
      // Validate regular trips
      if (!origin.trim() || !destination.trim() || !date) {
        setError("Please select departure, destination, and travel date");
        return;
      }

      if (tripType === 'return' && !returnDate) {
        setError("Please select return date");
        return;
      }
    }
    
    setLoading(true);
    setIsSearching(true);
    setError(null);
    try {
      if (tripType === 'multicity') {
        // Search for multi-city flights
        const allResults: Itinerary[] = [];
        for (const leg of multiCityLegs) {
          const results = await searchFlight(`${leg.origin} to ${leg.destination} on ${leg.date}`, isDemoMode, leg.date);
          allResults.push(...results);
        }
        setItineraries(allResults);
        setReturnItineraries([]);
      } else {
        // Search outbound flight
        const outboundResults = await searchFlight(`${origin} to ${destination} on ${date}`, isDemoMode, date);
        setItineraries(outboundResults);

        // If return trip, also search return flight
        if (tripType === 'return') {
          const returnResults = await searchFlight(`${destination} to ${origin} on ${returnDate}`, isDemoMode, returnDate);
          setReturnItineraries(returnResults);
        } else {
          setReturnItineraries([]);
        }
      }
    } catch (err: any) {
      if (err.message === "RATE_LIMIT_EXCEEDED") {
        setError("RATE_LIMIT");
      } else {
        setError("An error occurred while searching for flights.");
      }
    } finally {
      setLoading(false);
    }
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setError(null);
    // Manually trigger search without needing form event
    const doSearch = async () => {
      if (!origin.trim() || !destination.trim()) return;
      setLoading(true);
      setIsSearching(true);
      try {
        const results = await searchFlight(`${origin} to ${destination} on ${date}`, true, date);
        setItineraries(results);
      } catch (err: any) {
        if (err.message === "RATE_LIMIT_EXCEEDED") {
          setError("RATE_LIMIT");
        } else {
          setError("An error occurred while searching for flights.");
        }
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  };

  useEffect(() => {
    // Don't auto-search on mount - wait for user to click search button
    // const init = async () => {
    //   setLoading(true);
    //   setError(null);
    //   try {
    //     const results = await searchFlight("Popular routes from KUL");
    //     setItineraries(results);
    //   } catch (err: any) {
    //     console.warn("Initial search failed", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // init();
  }, []);

  const filteredItineraries = itineraries.filter(itinerary => {
    if (!itinerary || !itinerary.legs || !Array.isArray(itinerary.legs) || itinerary.legs.length === 0) return false;
    const firstLeg = itinerary.legs[0];
    if (!firstLeg || !firstLeg.departure || !firstLeg.departure.scheduled) return false;
    const depHour = parseISO(firstLeg.departure.scheduled).getHours();
    
    // Airline filter
    if (filterAirline && !itinerary.legs.some(leg => leg && leg.airline === filterAirline)) return false;
    
    // Stops filter
    if (filterStops !== null && (itinerary.legs.length - 1) !== filterStops) return false;
    
    // Time of day filter
    if (filterTimeOfDay === 'morning' && (depHour < 6 || depHour >= 12)) return false;
    if (filterTimeOfDay === 'afternoon' && (depHour < 12 || depHour >= 18)) return false;
    if (filterTimeOfDay === 'evening' && (depHour < 18 || depHour >= 24)) return false; // Evening: 6 PM to midnight

    return true;
  });

  const sortedItineraries = [...filteredItineraries].sort((a, b) => {
    if (sortBy === 'reliability') return b.reliabilityScore - a.reliabilityScore;
    return a.price - b.price;
  });

  // Apply same filtering to return itineraries
  const filteredReturnItineraries = returnItineraries.filter(itinerary => {
    if (!itinerary || !itinerary.legs || !Array.isArray(itinerary.legs) || itinerary.legs.length === 0) return false;
    const firstLeg = itinerary.legs[0];
    if (!firstLeg || !firstLeg.departure || !firstLeg.departure.scheduled) return false;
    const depHour = parseISO(firstLeg.departure.scheduled).getHours();
    
    // Airline filter
    if (filterAirline && !itinerary.legs.some(leg => leg && leg.airline === filterAirline)) return false;
    
    // Stops filter
    if (filterStops !== null && (itinerary.legs.length - 1) !== filterStops) return false;
    
    // Time of day filter
    if (filterTimeOfDay === 'morning' && (depHour < 6 || depHour >= 12)) return false;
    if (filterTimeOfDay === 'afternoon' && (depHour < 12 || depHour >= 18)) return false;
    if (filterTimeOfDay === 'evening' && (depHour < 18 || depHour >= 24)) return false;

    return true;
  });

  const sortedReturnItineraries = [...filteredReturnItineraries].sort((a, b) => {
    if (sortBy === 'reliability') return b.reliabilityScore - a.reliabilityScore;
    return a.price - b.price;
  });

  const uniqueAirlines = Array.from(new Set(itineraries.flatMap(it => 
    (it && it.legs && Array.isArray(it.legs)) ? it.legs.map(l => l?.airline).filter(Boolean) : []
  )));

  const handleSelectApiKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      setError(null);
    }
  };

  // Traditional Credentials Authentication States and Helpers
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthNotAllowedError, setIsAuthNotAllowedError] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authActionLoading, setAuthActionLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthNotAllowedError(false);

    if (!authEmail.trim()) {
      setAuthError("Email is required for password recovery.");
      return;
    }

    setAuthActionLoading(true);
    try {
      await sendPasswordResetEmail(auth, authEmail.trim());
      setAuthSuccess("Password reset email sent! Check your inbox (and spam/junk folders) for a reset link.");
    } catch (err: any) {
      const expectedCodes = ['auth/invalid-email', 'auth/user-not-found'];
      if (err && expectedCodes.includes(err.code)) {
        console.warn(`Password reset warning [${err.code}]: ${err.message}`);
      } else {
        console.error("Password reset failed:", err);
      }
      let message = err.message;
      if (err.code === 'auth/user-not-found') {
        message = "No account found with this email address.";
      } else if (err.code === 'auth/invalid-email') {
        message = "The email address has an invalid format.";
      } else if (err.code === 'auth/operation-not-allowed') {
        message = "Password reset operation is not enabled or allowed.";
        setIsAuthNotAllowedError(true);
      }
      setAuthError(message);
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthNotAllowedError(false);
    setAuthActionLoading(true);

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Email and password are required.");
      setAuthActionLoading(false);
      return;
    }

    if (authMode === 'register' && authPassword !== authConfirmPassword) {
      setAuthError("Passwords do not match.");
      setAuthActionLoading(false);
      return;
    }

    try {
      if (authMode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword.trim());
        setAuthSuccess("Successfully logged in!");
        // Force refresh user auth in state
        setUser({ ...userCredential.user });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword.trim());
        const createdUser = userCredential.user;
        setUser({ ...createdUser });
        
        // Send email verification
        try {
          await sendEmailVerification(createdUser);
          setAuthSuccess("Registration successful! A verification link has been sent to your email address.");
        } catch (verifErr: any) {
          console.error("Verification email sending failed:", verifErr);
          setAuthSuccess("Registration successful! (Email verification service limit exceeded).");
        }
      }
    } catch (err: any) {
      const expectedCodes = ['auth/invalid-credential', 'auth/email-already-in-use', 'auth/user-not-found', 'auth/wrong-password', 'auth/weak-password', 'auth/invalid-email'];
      if (err && expectedCodes.includes(err.code)) {
        console.warn(`User authentication feedback [${err.code}]: ${err.message}`);
      } else {
        console.error("Authentication action failed:", err);
      }
      let message = err.message;
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = "Invalid email or password credentials.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This email address is already registered.";
      } else if (err.code === 'auth/weak-password') {
        message = "Password must be at least 6 characters long.";
      } else if (err.code === 'auth/invalid-email') {
        message = "The email address has an invalid format.";
      } else if (err.code === 'auth/operation-not-allowed') {
        message = "Email/Password Authentication is not enabled for this project.";
        setIsAuthNotAllowedError(true);
      }
      setAuthError(message);
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleSendEmailVerification = async () => {
    if (!auth.currentUser) return;
    setAuthActionLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      await sendEmailVerification(auth.currentUser);
      setAuthSuccess("Verification email resent! Please check your inbox.");
    } catch (err: any) {
      console.error("Resending verification email failed:", err);
      setAuthError(err.message || "Failed to resend verification link.");
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleRefreshVerificationStatus = async () => {
    if (!auth.currentUser) return;
    setAuthActionLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      await reload(auth.currentUser);
      const updatedUser = auth.currentUser;
      setUser(updatedUser ? { ...updatedUser } : null);
      if (updatedUser?.emailVerified) {
        setAuthSuccess("Your email has been successfully verified!");
      } else {
        setAuthError("Email is still not verified. Please click the link in the verification email and try again.");
      }
    } catch (err: any) {
      console.error("Refreshing verification status failed:", err);
      setAuthError("Failed to refresh status. Please click standard login or try again later.");
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleSandboxBypassVerification = async () => {
    if (!user) return;
    setAuthActionLoading(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      // Since currentUser properties are read-only locally, we simulate the state
      // by setting a patched local user state that marks verified true.
      // This is perfect for sandbox environments.
      const simulatedUser = {
        ...user,
        emailVerified: true
      } as any;
      setUser(simulatedUser);
      setAuthSuccess("Sandbox Verification Bypass Active! Email marked as verified.");
    } catch (err: any) {
      setAuthError("Failed to simulate verification.");
    } finally {
      setAuthActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSelectedItinerary(null);
      setShowSavedOnly(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
      setAuthError(null);
      setAuthSuccess(null);
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  const handleSaveItinerary = async (itinerary: Itinerary) => {
    if (!user) {
      setActiveTab('profile');
      setError("User login and authentication are required to save itineraries.");
      return;
    }

    if (!user.emailVerified) {
      setActiveTab('profile');
      setError("Valid email verification is required to access account-based functions.");
      return;
    }

    const docId = `${user.uid}_${itinerary.id}`;
    const path = `saved_itineraries/${docId}`;
    
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
        connectionRiskValue: itinerary.connectionRiskValue,
        savedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleDeleteSaved = async (savedId: string) => {
    const path = `saved_itineraries/${savedId}`;
    try {
      await deleteDoc(doc(db, 'saved_itineraries', savedId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleSetPriceAlert = async (itinerary: Itinerary, targetPrice: number) => {
    if (!user) {
      setActiveTab('profile');
      setError("User login and authentication are required to set price alerts.");
      return;
    }

    if (!user.emailVerified) {
      setActiveTab('profile');
      setError("Valid email verification is required to access account-based functions.");
      return;
    }

    const docId = `${user.uid}_${itinerary.id}_${Date.now()}`;
    const path = `price_alerts/${docId}`;
    
    try {
      await setDoc(doc(db, 'price_alerts', docId), {
        uid: user.uid,
        itineraryId: itinerary.id,
        origin: itinerary.legs[0].departure.airport,
        destination: itinerary.legs[itinerary.legs.length - 1].arrival.airport,
        currentPrice: itinerary.price,
        targetPrice: targetPrice,
        reliabilityScore: itinerary.reliabilityScore,
        status: 'active',
        createdAt: serverTimestamp(),
      });
      setError(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const handleDeletePriceAlert = async (alertId: string) => {
    const path = `price_alerts/${alertId}`;
    try {
      await deleteDoc(doc(db, 'price_alerts', alertId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleShareEmail = (itinerary: Itinerary) => {
    const firstLeg = itinerary.legs[0];
    const lastLeg = itinerary.legs[itinerary.legs.length - 1];
    const subject = encodeURIComponent(`Flight Itinerary: ${firstLeg.departure.airport} to ${lastLeg.arrival.airport}`);
    
    let bodyText = `Check out this flight itinerary I found on Smart Flight!\n\n`;
    bodyText += `Route: ${firstLeg.departure.airport} to ${lastLeg.arrival.airport}\n`;
    bodyText += `Reliability Score: ${itinerary.reliabilityScore}/10\n`;
    bodyText += `Price: RM${itinerary.price}\n`;
    bodyText += `Status: ${itinerary.status}\n\n`;
    bodyText += `Flight Details:\n`;
    
    itinerary.legs.forEach((leg, i) => {
      bodyText += `${i + 1}. ${leg.airline} ${leg.flightNumber}\n`;
      bodyText += `   Dep: ${leg.departure.airport} at ${format(parseISO(leg.departure.scheduled), 'HH:mm')}\n`;
      bodyText += `   Arr: ${leg.arrival.airport} at ${format(parseISO(leg.arrival.scheduled), 'HH:mm')}\n\n`;
    });
    
    bodyText += `View more details on Smart Flight.`;
    
    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white overflow-x-hidden">
      {/* Loading Modal */}
      <AnimatePresence>
        {loading && (
          <>
            {/* Blurred Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[101] flex items-center justify-center"
            >
              <div className="bg-background border border-white/10 rounded-2xl p-8 shadow-2xl max-w-md w-[90%]">
                <div className="flex flex-col items-center gap-6">
                  {/* Wireframe Globe with Plane */}
                  <div className="relative w-48 h-48">
                    {/* Wireframe Globe - Rotating circles */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/40" />
                        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/30" />
                        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/20" />
                      </svg>
                    </motion.div>

                    {/* Plane traveling in circular orbit around earth */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="absolute w-32 h-32">
                        <motion.div
                          className="absolute top-0 left-1/2 -translate-x-1/2"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {/* Wireframe Plane SVG */}
                          <svg viewBox="0 0 30 30" className="w-8 h-8 text-accent/80">
                            {/* Fuselage */}
                            <line x1="15" y1="5" x2="15" y2="25" stroke="currentColor" strokeWidth="1" />
                            {/* Cockpit */}
                            <circle cx="15" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="0.8" />
                            {/* Main Wings */}
                            <line x1="5" y1="15" x2="25" y2="15" stroke="currentColor" strokeWidth="1" />
                            {/* Tail Wings */}
                            <line x1="10" y1="23" x2="20" y2="23" stroke="currentColor" strokeWidth="0.8" />
                            {/* Wing tips */}
                            <circle cx="5" cy="15" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
                            <circle cx="25" cy="15" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Center wireframe sphere */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 60 60" className="w-14 h-14">
                        <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-accent/70" />
                        <line x1="12" y1="30" x2="48" y2="30" stroke="currentColor" strokeWidth="0.6" className="text-accent/50" />
                        <line x1="30" y1="12" x2="30" y2="48" stroke="currentColor" strokeWidth="0.6" className="text-accent/50" />
                      </svg>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">Searching Flights</h3>
                    <p className="text-xs text-white/60">Finding the best options for you...</p>
                  </div>

                  {/* Simple loading bar */}
                  <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center"
          >
            {/* Background Glow on Splash */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Logo */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/30"
              >
                <Plane className="w-12 h-12 text-white -rotate-45" />
              </motion.div>
              
              <div className="text-center">
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Smart Flight</h1>
                <p className="text-accent text-sm font-bold uppercase tracking-widest">Initializing Decision Support...</p>
              </div>

              {/* Loading Bar */}
              <motion.div
                className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-6"
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-accent to-blue-500 rounded-full"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => { setActiveTab('search'); setSelectedItinerary(null); }}
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex flex-col items-center justify-center shadow-lg shadow-accent/20 leading-none">
              <Plane className="text-white w-5 h-5 -rotate-45 mb-0.5" />
              <span className="text-[8px] font-black text-white tracking-tighter">SF</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight leading-none">Smart Flight</h1>
            </div>
          </div>

          <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => { setActiveTab('search'); setSelectedItinerary(null); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === 'search' ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-white hover:text-white hover:bg-white/5"
              )}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-sm font-bold uppercase tracking-widest">Search</span>
            </button>

            <button 
              onClick={() => { setActiveTab('live'); setSelectedItinerary(null); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === 'live' ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-white hover:text-white hover:bg-white/5"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="text-sm font-bold uppercase tracking-widest">Live</span>
            </button>
            
            <button 
              onClick={() => { setActiveTab('saved'); setSelectedItinerary(null); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === 'saved' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-white hover:text-white hover:bg-white/5"
              )}
            >
              <Heart className={cn("w-3.5 h-3.5", activeTab === 'saved' && "fill-current")} />
              <span className="text-sm font-bold uppercase tracking-widest">Saved</span>
            </button>
            
            <button 
              onClick={() => { setActiveTab('profile'); setSelectedItinerary(null); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
                activeTab === 'profile' ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-white hover:text-white hover:bg-white/5"
              )}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="text-sm font-bold uppercase tracking-widest">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {selectedItinerary ? (
            <ItineraryDetailView 
              itinerary={selectedItinerary} 
              allItineraries={itineraries}
              onBack={() => setSelectedItinerary(null)} 
              onSave={() => handleSaveItinerary(selectedItinerary)}
              onShare={() => handleShareEmail(selectedItinerary)}
              onSelectAlternative={(alt) => setSelectedItinerary(alt)}
              isSaved={savedItineraries.some(s => s.itineraryId === selectedItinerary.id)}
              searchDate={date}
            />
          ) : activeTab === 'search' ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-black text-white mb-3 tracking-tight"
                >
                  Find Your Perfect Flight
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-white/70"
                >
                  Intelligent flight search with reliability insights
                </motion.p>
              </div>

              {/* Trip Type Dropdown */}
              <div className="relative w-fit">
                <motion.button
                  onClick={() => setShowTripTypeMenu(!showTripTypeMenu)}
                  className="px-6 py-3 rounded-2xl font-bold uppercase tracking-widest transition-all border-2 border-white/20 text-white hover:border-accent bg-white/5 hover:bg-white/10 flex items-center gap-3"
                >
                  {tripType === 'oneway' ? 'One Way' : tripType === 'return' ? 'Return' : 'Multi-city'}
                  <ChevronDown className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showTripTypeMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setTripType('oneway');
                          setShowTripTypeMenu(false);
                          setItineraries([]);
                          setReturnItineraries([]);
                          setIsSearching(false);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-slate-100 transition-colors flex items-center gap-4 text-slate-800"
                      >
                        <ArrowRight className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="font-bold text-lg">One way</div>
                          <div className="text-sm text-slate-600">Single flight</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setTripType('return');
                          setShowTripTypeMenu(false);
                          setItineraries([]);
                          setReturnItineraries([]);
                          setIsSearching(false);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-slate-100 transition-colors flex items-center gap-4 text-slate-800 border-t border-slate-200"
                      >
                        <ArrowRightLeft className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="font-bold text-lg">Return</div>
                          <div className="text-sm text-slate-600">Round trip</div>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          setTripType('multicity');
                          setShowTripTypeMenu(false);
                          setItineraries([]);
                          setReturnItineraries([]);
                          setIsSearching(false);
                        }}
                        className="w-full px-6 py-4 text-left hover:bg-slate-100 transition-colors flex items-center gap-4 text-slate-800 border-t border-slate-200"
                      >
                        <Navigation className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="font-bold text-lg">Multi-city</div>
                          <div className="text-sm text-slate-600">Multiple stops</div>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <header>
                <form 
                  onSubmit={(e) => {
                    // Only allow submission from the search button click
                    if (e.nativeEvent.submitter?.type !== 'submit') {
                      e.preventDefault();
                      return;
                    }
                    e.preventDefault();
                    handleSearch(e);
                  }}
                  onKeyPress={(e) => {
                    // Prevent Enter key from submitting form
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                    {tripType !== 'multicity' ? (
                      <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                          <AirportSelector 
                            label="From"
                            value={origin}
                            onChange={setOrigin}
                            icon={<MapPin className="w-4 h-4" />}
                            placeholder="Departure"
                          />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <AirportSelector 
                            label="To"
                            value={destination}
                            onChange={setDestination}
                            icon={<Navigation className="w-4 h-4" />}
                            placeholder="Arrival"
                          />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <CalendarSelector 
                            label="Depart"
                            value={date}
                            onChange={setDate}
                            originCode={origin}
                            destCode={destination}
                            searchResults={itineraries}
                          />
                        </div>
                        {tripType === 'return' && (
                          <div className="flex-1 min-w-[200px]">
                            <CalendarSelector 
                              label="Return"
                              value={returnDate}
                              onChange={setReturnDate}
                              originCode={destination}
                              destCode={origin}
                              searchResults={itineraries}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {multiCityLegs.map((leg, index) => (
                          <div key={leg.id} className="flex flex-wrap gap-3 items-end">
                            <div className="flex-1 min-w-[180px]">
                              <AirportSelector 
                                label={index === 0 ? "From" : "From"}
                                value={leg.origin}
                                onChange={(value) => {
                                  const newLegs = [...multiCityLegs];
                                  newLegs[index].origin = value;
                                  setMultiCityLegs(newLegs);
                                }}
                                icon={<MapPin className="w-4 h-4" />}
                                placeholder="City or airport"
                              />
                            </div>
                            <div className="flex-1 min-w-[180px]">
                              <AirportSelector 
                                label="To"
                                value={leg.destination}
                                onChange={(value) => {
                                  const newLegs = [...multiCityLegs];
                                  newLegs[index].destination = value;
                                  setMultiCityLegs(newLegs);
                                }}
                                icon={<Navigation className="w-4 h-4" />}
                                placeholder="City or airport"
                              />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                              <CalendarSelector 
                                label="Depart"
                                value={leg.date}
                                onChange={(value) => {
                                  const newLegs = [...multiCityLegs];
                                  newLegs[index].date = value;
                                  setMultiCityLegs(newLegs);
                                }}
                                originCode={leg.origin}
                                destCode={leg.destination}
                                searchResults={[]}
                              />
                            </div>
                            {multiCityLegs.length > 2 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMultiCityLegs(multiCityLegs.filter((_, i) => i !== index));
                                }}
                                className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all text-sm font-bold border border-red-500/30"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const lastLeg = multiCityLegs[multiCityLegs.length - 1];
                            setMultiCityLegs([
                              ...multiCityLegs,
                              {
                                id: Date.now().toString(),
                                origin: lastLeg.destination,
                                destination: '',
                                date: format(addDays(parseISO(lastLeg.date), 1), 'yyyy-MM-dd')
                              }
                            ]);
                          }}
                          className="px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-all text-sm font-bold uppercase tracking-widest"
                        >
                          + Add Stop
                        </button>
                      </div>
                    )}
                    
                    <button 
                      type="submit"
                      disabled={loading || (tripType === 'multicity' ? multiCityLegs.some(leg => !leg.origin || !leg.destination || !leg.date) : !origin || !destination || !date || (tripType === 'return' && !returnDate))}
                      className="w-full bg-accent hover:bg-accent/80 disabled:bg-accent/50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest px-8 py-3 rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5"
                        >
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        </motion.div>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {error === "RATE_LIMIT" && (
                  <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-accent text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>API Service Unavailable</p>
                    </div>
                    <p className="text-[10px] text-muted leading-relaxed">
                      The AI model is currently experiencing high demand or the shared quota is exceeded. You can fix this by adding your own key, or try the app with demo data.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSelectApiKey}
                        className="flex-1 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent/80 transition-all"
                      >
                        Fix with My Key
                      </button>
                      <button 
                        onClick={enableDemoMode}
                        className="flex-1 py-2 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10"
                      >
                        Use Demo Data
                      </button>
                    </div>
                  </div>
                )}

                {error && error !== "RATE_LIMIT" && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {isDemoMode && !error && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Demo Mode Active
                    </div>
                    <button 
                      onClick={() => setIsDemoMode(false)}
                      className="text-[8px] font-black text-muted hover:text-white uppercase tracking-widest"
                    >
                      Disable
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setSortBy('reliability')}
                      className={cn("px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all border", 
                        sortBy === 'reliability' ? "bg-accent text-white border-accent" : "bg-white/5 text-white/70 hover:bg-white/10 hover:border-accent/30 border-white/10")}
                    >
                      Reliability First
                    </button>
                    <span className="text-xs text-white/60 ml-2">Prioritizes historical on-time performance</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setSortBy('price')}
                      className={cn("px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all border", 
                        sortBy === 'price' ? "bg-accent text-white border-accent" : "bg-white/5 text-white/70 hover:bg-white/10 hover:border-accent/30 border-white/10")}
                    >
                      Lowest Price
                    </button>
                    <span className="text-xs text-white/60 ml-2">Sorts by the most affordable fares</span>
                  </div>
                </div>

                {/* Advanced Filters UI */}
                {itineraries.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-black text-white uppercase tracking-widest">Airline</span>
                      <select 
                        value={filterAirline}
                        onChange={(e) => setFilterAirline(e.target.value)}
                        className="bg-background border-2 border-white/20 rounded-xl px-4 py-3 text-base font-semibold text-white focus:border-accent outline-none transition-all hover:border-white/40"
                        style={{
                          colorScheme: 'dark',
                          backgroundColor: '#0f172a',
                        }}
                      >
                        <option value="">All Airlines</option>
                        {uniqueAirlines.map(airline => (
                          <option key={airline} value={airline}>{airline}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-black text-white uppercase tracking-widest">Stops</span>
                      <select 
                        value={filterStops === null ? "" : filterStops}
                        onChange={(e) => setFilterStops(e.target.value === "" ? null : parseInt(e.target.value))}
                        className="bg-background border-2 border-white/20 rounded-xl px-4 py-3 text-base font-semibold text-white focus:border-accent outline-none transition-all hover:border-white/40"
                        style={{
                          colorScheme: 'dark',
                          backgroundColor: '#0f172a',
                        }}
                      >
                        <option value="">Any Stops</option>
                        <option value="0">Non-stop</option>
                        <option value="1">1 Stop</option>
                        <option value="2">2+ Stops</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-black text-white uppercase tracking-widest">Time</span>
                      <select 
                        value={filterTimeOfDay || ""}
                        onChange={(e) => setFilterTimeOfDay(e.target.value as any || null)}
                        className="bg-background border-2 border-white/20 rounded-xl px-4 py-3 text-base font-semibold text-white focus:border-accent outline-none transition-all hover:border-white/40"
                        style={{
                          colorScheme: 'dark',
                          backgroundColor: '#0f172a',
                        }}
                      >
                        <option value="">Any Time</option>
                        <option value="morning">Morning (6am-12pm)</option>
                        <option value="afternoon">Afternoon (12pm-6pm)</option>
                        <option value="evening">Evening (6pm-6am)</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => {
                        setFilterAirline('');
                        setFilterStops(null);
                        setFilterTimeOfDay(null);
                      }}
                      className="text-sm font-black text-accent hover:text-white uppercase tracking-widest py-3 px-4 border-2 border-accent rounded-xl hover:bg-accent/20 transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </header>

              <div className="space-y-4">
                {tripType === 'return' && !loading && sortedItineraries.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between px-2 mb-4">
                      <div className="flex flex-col">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                          Round Trip Combinations
                        </h2>
                        {isSearching && (
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-accent" />
                            <span className="text-sm font-bold text-white uppercase tracking-widest">
                              {format(parseISO(date), 'EEE, dd MMM')} - {format(parseISO(returnDate), 'EEE, dd MMM')}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm mono text-white">{sortedItineraries.length * sortedReturnItineraries.length} COMBOS AVAILABLE</span>
                    </div>

                    <div className="space-y-6">
                      {sortedItineraries.map((outboundItinerary, outboundIndex) => (
                        <div key={`combo-${outboundItinerary.id}`} className="space-y-2">
                          {/* Outbound Flight Header */}
                          <div className="flex items-center px-2 py-2 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex-1">
                              <p className="text-xs font-bold text-accent uppercase tracking-widest">OUTBOUND: {origin} → {destination}</p>
                              <p className="text-[10px] text-white/60">{format(parseISO(date), 'EEE, dd MMM yyyy')}</p>
                            </div>
                          </div>

                          {/* Outbound Flight Card */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: outboundIndex * 0.05 }}
                            whileHover={{ y: -2 }}
                            className="ml-4"
                          >
                            <ItineraryCard 
                              itinerary={outboundItinerary} 
                              onClick={() => setSelectedItinerary(outboundItinerary)} 
                              onSave={(e) => { e.stopPropagation(); handleSaveItinerary(outboundItinerary); }}
                              isSaved={savedItineraries.some(s => s.itineraryId === outboundItinerary.id)}
                              searchDate={date}
                            />
                          </motion.div>

                          {/* Return Flights for this Outbound */}
                          {sortedReturnItineraries.length > 0 && (
                            <div className="space-y-2 mt-3">
                              <div className="flex items-center px-2 py-2 bg-white/5 rounded-lg border border-white/10">
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-accent uppercase tracking-widest">RETURN: {destination} → {origin}</p>
                                  <p className="text-[10px] text-white/60">{format(parseISO(returnDate), 'EEE, dd MMM yyyy')}</p>
                                </div>
                              </div>

                              <div className="space-y-2 ml-4">
                                {sortedReturnItineraries.map((returnItinerary, returnIndex) => (
                                  <motion.div
                                    key={`return-${outboundItinerary.id}-${returnItinerary.id}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (outboundIndex + returnIndex) * 0.05 }}
                                    whileHover={{ y: -2 }}
                                  >
                                    <ItineraryCard 
                                      itinerary={returnItinerary} 
                                      onClick={() => setSelectedItinerary(returnItinerary)} 
                                      onSave={(e) => { e.stopPropagation(); handleSaveItinerary(returnItinerary); }}
                                      isSaved={savedItineraries.some(s => s.itineraryId === returnItinerary.id)}
                                      searchDate={returnDate}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Separator between combos */}
                          {outboundIndex < sortedItineraries.length - 1 && (
                            <div className="my-4 border-t border-white/5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-2">
                      <div className="flex flex-col">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                          {tripType === 'return' ? `Outbound: ${origin} → ${destination}` : isSearching ? 'Recommended Itineraries' : 'Popular Routes'}
                        </h2>
                        {isSearching && (
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-accent" />
                            <span className="text-sm font-bold text-white uppercase tracking-widest">
                              {format(parseISO(date), 'EEE, dd MMM yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm mono text-white">{sortedItineraries.length} OPTIONS FOUND</span>
                    </div>
                    
                    {sortedItineraries.map((itinerary, index) => (
                      <motion.div
                        key={itinerary.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(242, 125, 38, 0.2)" }}
                      >
                        <ItineraryCard 
                          itinerary={itinerary} 
                          onClick={() => setSelectedItinerary(itinerary)} 
                          onSave={(e) => { e.stopPropagation(); handleSaveItinerary(itinerary); }}
                          isSaved={savedItineraries.some(s => s.itineraryId === itinerary.id)}
                          searchDate={date}
                        />
                      </motion.div>
                    ))}
                  </>
                )}

                {sortedItineraries.length === 0 && !loading && (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Plane className="w-16 h-16 text-white/20 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">No flights found</h3>
                    <p className="text-white/60 mb-6">Try adjusting your filters or search dates</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => {
                          setFilterAirline('');
                          setFilterStops(null);
                          setFilterTimeOfDay(null);
                        }}
                        className="px-6 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all font-semibold"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/3 border border-white/5 rounded-2xl p-6 h-32"
                      >
                        <div className="space-y-3">
                          <motion.div
                            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-4 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded w-1/3"
                            style={{ backgroundSize: '200% 100%' }}
                          />
                          <motion.div
                            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                            className="h-4 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded w-1/2"
                            style={{ backgroundSize: '200% 100%' }}
                          />
                          <motion.div
                            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                            className="h-4 bg-gradient-to-r from-white/5 via-white/20 to-white/5 rounded w-1/4"
                            style={{ backgroundSize: '200% 100%' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {!loading && sortedItineraries.length > 0 && (
                  <div></div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'live' ? (
            <motion.div 
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LiveFlightView isDemoMode={isDemoMode} onEnableDemo={enableDemoMode} />
            </motion.div>
          ) : activeTab === 'saved' ? (
            <motion.div 
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col gap-2 px-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
                    <Heart className="w-8 h-8 text-red-500 fill-current" />
                    Saved Trips
                  </h2>
                  <span className="text-sm mono text-white/60 font-bold">{savedItineraries.length} SAVED</span>
                </div>
                <p className="text-xs text-white/70">Manage and track your favorite flight itineraries and price alerts.</p>
              </div>

              {user && savedItineraries.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input 
                      type="text"
                      placeholder="Search saved trips..."
                      value={savedSearchQuery}
                      onChange={(e) => setSavedSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-accent outline-none transition-all"
                    />
                  </div>
                  <select 
                    value={savedFilterAirline}
                    onChange={(e) => setSavedFilterAirline(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent outline-none transition-all"
                    style={{
                      colorScheme: 'dark',
                      backgroundColor: '#0f172a',
                    }}
                  >
                    <option value="">All Airlines</option>
                    {Array.from(new Set(savedItineraries.flatMap(s => s.legs.map(l => l.airline)))).map(airline => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>
              )}

              {!user ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <LogIn className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/60 mb-6">User login and authentication are required to view and manage saved trips.</p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="bg-accent text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-accent/80 transition-all text-xs"
                  >
                    Go to Login & Registration
                  </button>
                </div>
              ) : !user.emailVerified ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <ShieldAlert className="w-12 h-12 text-amber-500/70 mx-auto mb-4" />
                  <p className="text-white hover:text-white mb-2 font-bold">Email Verification Required</p>
                  <p className="text-white/60 mb-6 max-w-md mx-auto text-xs px-4">
                    Valid user credentials and email verification are required for access to account-based functions.
                  </p>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="bg-accent text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-accent/80 transition-all text-xs"
                  >
                    Complete Email Verification
                  </button>
                </div>
              ) : savedItineraries.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Heart className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/60">You haven't saved any itineraries yet.</p>
                  <button 
                    onClick={() => setActiveTab('search')}
                    className="mt-6 text-accent font-bold uppercase tracking-widest text-xs hover:underline"
                  >
                    Start Searching
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const filteredSaved = savedItineraries.filter(saved => {
                      if (!saved.legs) return false;
                      const matchesSearch = saved.legs.some(l => 
                        l.origin?.city?.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
                        l.destination?.city?.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
                        l.airline?.toLowerCase().includes(savedSearchQuery.toLowerCase())
                      );
                      const matchesAirline = !savedFilterAirline || saved.legs.some(l => l.airline === savedFilterAirline);
                      return matchesSearch && matchesAirline;
                    });

                    if (filteredSaved.length === 0) {
                      return (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                          <Search className="w-12 h-12 text-muted/20 mx-auto mb-4" />
                          <p className="text-muted">No saved trips match your search or filter criteria.</p>
                          <button 
                            onClick={() => { setSavedSearchQuery(''); setSavedFilterAirline(''); }}
                            className="mt-4 text-accent font-bold uppercase tracking-widest text-[10px] hover:underline"
                          >
                            Clear Search & Filters
                          </button>
                        </div>
                      );
                    }

                    return filteredSaved.map((saved) => (
                      <div key={saved.id}>
                        <ItineraryCard 
                          itinerary={{
                            id: saved.itineraryId,
                            legs: saved.legs,
                            reliabilityScore: saved.reliabilityScore,
                            price: saved.price,
                            status: saved.status,
                            connectionRisk: saved.connectionRisk,
                            connectionRiskValue: saved.connectionRiskValue,
                            totalDuration: '',
                          }} 
                          onRemove={(e) => { e.stopPropagation(); handleDeleteSaved(saved.id); }}
                          onClick={() => setSelectedItinerary({
                            id: saved.itineraryId,
                            legs: saved.legs,
                            reliabilityScore: saved.reliabilityScore,
                            price: saved.price,
                            status: saved.status,
                            connectionRisk: saved.connectionRisk,
                            connectionRiskValue: saved.connectionRiskValue,
                            totalDuration: '',
                          })} 
                        />
                      </div>
                    ));
                  })()}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
                  <UserIcon className="w-6 h-6 text-accent" />
                  Account Settings
                </h2>
                <p className="text-xs text-muted">Manage your profile, preferences, and account details.</p>
              </div>

              <Card className="border-white/10">
                {isAuthLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Activity className="w-8 h-8 text-accent animate-spin" />
                  </div>
                ) : user ? (
                  <div className="space-y-6">
                    {/* User Profile Card */}
                    <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-accent/10 to-background border border-accent/20 rounded-2xl">
                      <div className="w-24 h-24 bg-accent/20 rounded-2xl flex items-center justify-center border-2 border-accent/30 overflow-hidden shrink-0">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Smart Flight User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <UserIcon className="w-12 h-12 text-accent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-1">{user.email?.split('@')[0] || 'SmartFlight User'}</h3>
                        <p className="text-white/60 mono text-sm mb-3">{user.email}</p>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full animate-pulse", user.emailVerified ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]")} />
                          <span className={cn("text-xs font-black uppercase tracking-widest", user.emailVerified ? "text-green-500" : "text-amber-500")}>
                            {user.emailVerified ? "✓ Verified Account" : "⚠ Verification Required"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!user.emailVerified && (
                      <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-4">
                        <div className="flex items-start gap-3">
                          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Email Verification Required</h4>
                            <p className="text-[11px] text-white/70 leading-relaxed mt-1">
                              Valid user credentials and email verification are required for access to account-based functions (e.g. saving and exporting itineraries). We've sent a link to <span className="text-white font-medium">{user.email}</span>. Click it to verify your account.
                            </p>
                          </div>
                        </div>

                        {authSuccess && (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs flex items-start gap-2">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{authSuccess}</span>
                          </div>
                        )}
                        {authError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>{authError}</span>
                            </div>
                            {isAuthNotAllowedError && (
                              <div className="mt-1 pl-6 text-[11px] text-white/70 space-y-2">
                                <p>To enable Email/Password Authentication for this project, follow these simple steps:</p>
                                <ol className="list-decimal list-inside space-y-1 text-white/80">
                                  <li>Open the <a href="https://console.firebase.google.com/project/gen-lang-client-0507391171/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 font-bold">Firebase Authentication Console</a> in a new tab.</li>
                                  <li>Click on <strong>Add new provider</strong> (or <strong>Get Started</strong> if Authentication isn't initialized yet).</li>
                                  <li>Select <strong>Email/Password</strong>.</li>
                                  <li>Enable the toggle for <strong>Email/Password</strong> and click <strong>Save</strong>.</li>
                                  <li>Once saved, return here and try again!</li>
                                </ol>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            onClick={handleRefreshVerificationStatus}
                            disabled={authActionLoading}
                            className="bg-accent text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50"
                          >
                            {authActionLoading ? "Loading State..." : "I've Verified My Email"}
                          </button>
                          <button
                            onClick={handleSendEmailVerification}
                            disabled={authActionLoading}
                            className="bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 border border-white/10"
                          >
                            Resend Email Verification
                          </button>
                        </div>

                        <div className="pt-2.5 border-t border-white/5 flex flex-col items-center">
                          <p className="text-[8px] text-white/45 text-center mb-1.5 uppercase tracking-widest font-bold">Preview Environment Controls</p>
                          <button
                            onClick={handleSandboxBypassVerification}
                            className="text-accent hover:text-accent/80 transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-1"
                          >
                            <span>Sandbox Verification Bypass</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    </div>

                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-400 py-4 rounded-2xl font-black uppercase tracking-widest hover:from-red-500/30 hover:to-red-500/20 hover:text-red-300 transition-all border border-red-500/30 text-sm mt-6"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out of Smart Flight
                    </button>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto py-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-accent/15 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="text-2xl font-black mb-2">
                        {authMode === 'forgot' ? "Reset Your Password" : "Authentication Portal"}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {authMode === 'forgot' 
                          ? "Enter your email address and we'll send you a link to reset your password."
                          : "Valid user credentials required for access to account-based functions"
                        }
                      </p>
                    </div>

                    {/* Tabs */}
                    {authMode !== 'forgot' && (
                      <div className="flex p-1.5 bg-white/5 rounded-xl mb-8 border border-white/5 gap-1">
                        <button
                          type="button"
                          onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); setIsAuthNotAllowedError(false); }}
                          className={cn("flex-1 py-3 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all", authMode === 'login' ? "bg-accent text-white" : "text-white/60 hover:text-white")}
                        >
                          User Login
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccess(null); setIsAuthNotAllowedError(false); }}
                          className={cn("flex-1 py-3 text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all", authMode === 'register' ? "bg-accent text-white" : "text-white/60 hover:text-white")}
                        >
                          Create Account
                        </button>
                      </div>
                    )}

                    {authMode === 'forgot' ? (
                      <form onSubmit={handlePasswordReset} className="space-y-6">
                        {authError && (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                              <span>{authError}</span>
                            </div>
                            {isAuthNotAllowedError && (
                              <div className="mt-1 pl-6 text-xs text-white/70 space-y-2">
                                <p>To enable Email/Password Authentication for this project, follow these simple steps:</p>
                                <ol className="list-decimal list-inside space-y-1 text-white/80">
                                  <li>Open the <a href="https://console.firebase.google.com/project/gen-lang-client-0507391171/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 font-bold">Firebase Authentication Console</a> in a new tab.</li>
                                  <li>Click on <strong>Add new provider</strong> (or <strong>Get Started</strong> if Authentication isn't initialized yet).</li>
                                  <li>Select <strong>Email/Password</strong>.</li>
                                  <li>Enable the toggle for <strong>Email/Password</strong> and click <strong>Save</strong>.</li>
                                  <li>Once saved, return here and try again!</li>
                                </ol>
                              </div>
                            )}
                          </div>
                        )}

                        {authSuccess && (
                          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-xs flex items-start gap-2">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{authSuccess}</span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-xs font-black text-white/50 uppercase tracking-widest pl-1">Email address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                              type="email"
                              required
                              placeholder="user@smartflight.com"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-accent outline-none transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={authActionLoading}
                          className="w-full bg-accent text-white py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50 text-sm mt-4"
                        >
                          {authActionLoading ? (
                            <Activity className="w-5 h-5 animate-spin mx-auto" />
                          ) : (
                            "Send Reset Email"
                          )}
                        </button>

                        <div className="text-center pt-3">
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); setIsAuthNotAllowedError(false); }}
                            className="text-xs font-bold text-accent hover:underline uppercase tracking-widest inline-flex items-center gap-1"
                          >
                            ← Back to Login
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleCredentialsAuth} className="space-y-6">
                        {authError && (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs flex flex-col gap-2">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                              <span>{authError}</span>
                            </div>
                            {isAuthNotAllowedError && (
                              <div className="mt-1 pl-6 text-xs text-white/70 space-y-2">
                                <p>To enable Email/Password Authentication for this project, follow these simple steps:</p>
                                <ol className="list-decimal list-inside space-y-1 text-white/80">
                                  <li>Open the <a href="https://console.firebase.google.com/project/gen-lang-client-0507391171/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 font-bold">Firebase Authentication Console</a> in a new tab.</li>
                                  <li>Click on <strong>Add new provider</strong> (or <strong>Get Started</strong> if Authentication isn't initialized yet).</li>
                                  <li>Select <strong>Email/Password</strong>.</li>
                                  <li>Enable the toggle for <strong>Email/Password</strong> and click <strong>Save</strong>.</li>
                                  <li>Once saved, return here and try again!</li>
                                </ol>
                              </div>
                            )}
                          </div>
                        )}

                        {authSuccess && (
                          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-xs flex items-start gap-2">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <span>{authSuccess}</span>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-xs font-black text-white/50 uppercase tracking-widest pl-1">Email address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                              type="email"
                              required
                              placeholder="user@smartflight.com"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-accent outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center pl-1">
                            <label className="text-xs font-black text-white/50 uppercase tracking-widest">Password</label>
                            {authMode === 'login' && (
                              <button
                                type="button"
                                onClick={() => { setAuthMode('forgot'); setAuthError(null); setAuthSuccess(null); setIsAuthNotAllowedError(false); }}
                                className="text-xs font-bold text-accent hover:underline uppercase tracking-widest"
                              >
                                Forgot Password?
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input 
                              type="password"
                              required
                              placeholder="••••••••"
                              value={authPassword}
                              onChange={(e) => setAuthPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-accent outline-none transition-all"
                            />
                          </div>
                        </div>

                        {authMode === 'register' && (
                          <div className="space-y-2">
                            <label className="text-xs font-black text-white/50 uppercase tracking-widest pl-1">Confirm Password</label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                              <input 
                                type="password"
                                required
                                placeholder="••••••••"
                                value={authConfirmPassword}
                                onChange={(e) => setAuthConfirmPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-14 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:border-accent outline-none transition-all"
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={authActionLoading}
                          className="w-full bg-accent text-white py-3.5 rounded-xl font-bold uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50 text-sm mt-4"
                        >
                          {authActionLoading ? (
                            <Activity className="w-5 h-5 animate-spin mx-auto" />
                          ) : authMode === 'login' ? (
                            "User Login & Authentication"
                          ) : (
                            "Create New Account"
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search History Card - Only visible when logged in */}
                {user && (
                  <Card className="border-white/10 bg-gradient-to-br from-accent/10 via-background to-background hover:border-accent/40 transition-all group">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30 group-hover:bg-accent/30 transition-all">
                            <Activity className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black uppercase tracking-widest">Search History</h4>
                            <p className="text-xs text-white/50 font-bold">Recent searches</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Track your recent flight searches and view saved itineraries. Keep your travel history organized in one place for quick access.
                      </p>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                          <div className="text-xs text-white/50 font-bold uppercase mb-1">Recent Searches</div>
                          <div className="text-2xl font-black mono text-accent">12</div>
                        </div>
                        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                          <div className="text-xs text-white/50 font-bold uppercase mb-1">This Month</div>
                          <div className="text-2xl font-black mono text-accent">8</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-accent/20">
                        <button onClick={() => setShowSearchHistory(true)} className="w-full py-3 px-4 bg-accent/20 hover:bg-accent/30 text-accent hover:text-accent font-bold uppercase tracking-widest rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                          <span>View Full History</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Price Alerts Card - Only visible when logged in */}
                {user && (
                  <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 via-background to-background hover:border-blue-500/40 transition-all group">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-500/30 transition-all">
                            <TrendingDown className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black uppercase tracking-widest">Price Alerts</h4>
                            <p className="text-xs text-white/50 font-bold">Smart notifications</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Get real-time price drop alerts for your favorite routes. We'll notify you when fares decrease significantly.
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="text-xs text-white/50 font-bold uppercase mb-1">Active Alerts</div>
                          <div className="text-2xl font-black mono text-blue-400">5</div>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="text-xs text-white/50 font-bold uppercase mb-1">Savings Found</div>
                          <div className="text-2xl font-black mono text-blue-400">RM380</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-blue-500/20">
                        <button onClick={() => setShowPriceAlerts(true)} className="w-full py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                          <span>Manage Alerts</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Search History Modal */}
      <AnimatePresence>
        {showSearchHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchHistory(false)}
              className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="bg-background border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background border-b border-white/10 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-widest">Search History</h3>
                      <p className="text-xs text-white/50">Your recent flight searches</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedHistoryItems.size > 0 && (
                      <button
                        onClick={() => {
                          setSelectedHistoryItems(new Set());
                        }}
                        className="px-3 py-1.5 text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all"
                      >
                        Clear Selected ({selectedHistoryItems.size})
                      </button>
                    )}
                    <button
                      onClick={() => setShowSearchHistory(false)}
                      className="text-white/60 hover:text-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6 rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {[
                    { from: 'KUL', to: 'SIN', date: 'Dec 15, 2024', price: 'RM 185', status: 'Booked' },
                    { from: 'KUL', to: 'BKK', date: 'Dec 10, 2024', price: 'RM 420', status: 'Viewed' },
                    { from: 'SIN', to: 'HKG', date: 'Dec 8, 2024', price: 'RM 680', status: 'Saved' },
                    { from: 'KUL', to: 'HAN', date: 'Dec 5, 2024', price: 'RM 320', status: 'Viewed' },
                    { from: 'BKK', to: 'KUL', date: 'Dec 1, 2024', price: 'RM 450', status: 'Viewed' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        const newSelected = new Set(selectedHistoryItems);
                        if (newSelected.has(idx)) {
                          newSelected.delete(idx);
                        } else {
                          newSelected.add(idx);
                        }
                        setSelectedHistoryItems(newSelected);
                      }}
                      className={`p-4 border rounded-xl transition-all cursor-pointer group ${
                        selectedHistoryItems.has(idx)
                          ? 'bg-accent/20 border-accent/50'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedHistoryItems.has(idx)
                              ? 'bg-accent border-accent'
                              : 'border-white/30 hover:border-accent'
                          }`}>
                            {selectedHistoryItems.has(idx) && (
                              <Check className="w-3 h-3 text-background" />
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-black mono text-white">{item.from}</div>
                            <div className="text-[10px] text-white/50">Departure</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/40" />
                          <div className="text-center">
                            <div className="text-sm font-black mono text-white">{item.to}</div>
                            <div className="text-[10px] text-white/50">Arrival</div>
                          </div>
                          <div className="ml-4 border-l border-white/20 pl-4">
                            <div className="text-xs text-white/70 font-bold">{item.date}</div>
                            <div className="text-sm font-black mono text-accent mt-1">{item.price}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="success" className="text-[10px]">{item.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Price Alerts Modal */}
      <AnimatePresence>
        {showPriceAlerts && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPriceAlerts(false)}
              className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="bg-background border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background border-b border-white/10 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-widest">Price Alerts</h3>
                      <p className="text-xs text-white/50">Manage your price drop notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedAlertItems.size > 0 && (
                      <button
                        onClick={() => {
                          setSelectedAlertItems(new Set());
                        }}
                        className="px-3 py-1.5 text-xs font-bold uppercase text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all"
                      >
                        Clear Selected ({selectedAlertItems.size})
                      </button>
                    )}
                    <button
                      onClick={() => setShowPriceAlerts(false)}
                      className="text-white/60 hover:text-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6 rotate-90" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {[
                    { from: 'KUL', to: 'SIN', currentPrice: 'RM 285', targetPrice: 'RM 250', savings: 'RM 35', status: 'Active' },
                    { from: 'KUL', to: 'BKK', currentPrice: 'RM 520', targetPrice: 'RM 450', savings: 'RM 70', status: 'Active' },
                    { from: 'SIN', to: 'HKG', currentPrice: 'RM 780', targetPrice: 'RM 700', savings: 'RM 80', status: 'Alert Triggered' },
                    { from: 'HAN', to: 'KUL', currentPrice: 'RM 380', targetPrice: 'RM 320', savings: 'RM 60', status: 'Active' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        const newSelected = new Set(selectedAlertItems);
                        if (newSelected.has(idx)) {
                          newSelected.delete(idx);
                        } else {
                          newSelected.add(idx);
                        }
                        setSelectedAlertItems(newSelected);
                      }}
                      className={`p-4 border rounded-xl transition-all cursor-pointer group ${
                        selectedAlertItems.has(idx)
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedAlertItems.has(idx)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-white/30 hover:border-blue-500'
                          }`}>
                            {selectedAlertItems.has(idx) && (
                              <Check className="w-3 h-3 text-background" />
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-black mono text-white">{item.from}</div>
                            <div className="text-[10px] text-white/50">From</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/40" />
                          <div className="text-center">
                            <div className="text-sm font-black mono text-white">{item.to}</div>
                            <div className="text-[10px] text-white/50">To</div>
                          </div>
                          <div className="ml-4 border-l border-white/20 pl-4 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/50">Current:</span>
                              <span className="text-sm font-black mono text-white">{item.currentPrice}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-white/50">Target:</span>
                              <span className="text-sm font-black mono text-blue-400">{item.targetPrice}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-right">
                            <div className="text-[10px] text-green-400 font-bold mb-1">Potential Savings</div>
                            <div className="text-lg font-black mono text-green-400">{item.savings}</div>
                          </div>
                          <Badge variant={item.status === 'Alert Triggered' ? 'error' : 'success'} className="text-[10px]">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const ItineraryCard: React.FC<{ 
  itinerary: Itinerary, 
  onClick: () => void,
  onSave?: (e: React.MouseEvent) => void,
  onRemove?: (e: React.MouseEvent) => void,
  isSaved?: boolean,
  searchDate?: string
}> = ({ itinerary, onClick, onSave, onRemove, isSaved, searchDate }) => {
  const statusColors = {
    'RELIABLE': 'success',
    'CAUTION': 'warning',
    'HIGH RISK': 'error',
  } as const;

  if (!itinerary || !itinerary.legs || !Array.isArray(itinerary.legs) || itinerary.legs.length === 0) {
    return null;
  }

  const firstLeg = itinerary.legs[0];
  const lastLeg = itinerary.legs[itinerary.legs.length - 1];
  const isConnecting = itinerary.legs.length > 1;

  const riskLabels = {
    'RELIABLE': 'Stable Route • High probability of on-time arrival',
    'CAUTION': 'Moderate Risk • Potential for minor delays',
    'HIGH RISK': 'Unstable Route • High probability of disruption',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="hover:bg-white/[0.07] hover:border-accent/40 transition-all group border border-white/10 relative overflow-hidden p-6">
        {/* Real-time Status Simulation */}
        <div className="absolute top-0 right-0 px-4 py-2 bg-accent/10 border-b border-l border-accent/20 rounded-bl-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-accent uppercase tracking-widest">Live: On Time</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className={cn(
              "relative flex items-center justify-center transition-all group-hover:scale-105",
              "w-20 h-20"
            )}>
              {/* Score Card */}
              <div className={cn(
                "relative rounded-lg flex flex-col items-center justify-center w-full h-full border-2",
                itinerary.reliabilityScore >= 9.5 
                  ? "bg-green-950/40 border-green-700/50" 
                  : itinerary.reliabilityScore >= 8.5 
                  ? "bg-blue-950/40 border-blue-700/50"
                  : itinerary.reliabilityScore >= 7
                  ? "bg-amber-950/40 border-amber-700/50"
                  : "bg-orange-950/40 border-orange-700/50"
              )}>
                <motion.div 
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <div className={cn(
                    "font-black mono leading-none",
                    itinerary.reliabilityScore >= 9.5 ? "text-3xl text-green-300" : itinerary.reliabilityScore >= 8.5 ? "text-3xl text-blue-300" : itinerary.reliabilityScore >= 7 ? "text-3xl text-amber-300" : "text-3xl text-orange-300"
                  )}>
                    {itinerary.reliabilityScore.toFixed(2)}
                  </div>
                  <div className={cn(
                    "text-[8px] font-black uppercase tracking-widest mt-1 leading-none",
                    itinerary.reliabilityScore >= 9.5 ? "text-green-300" : itinerary.reliabilityScore >= 8.5 ? "text-blue-300" : itinerary.reliabilityScore >= 7 ? "text-amber-300" : "text-orange-300"
                  )}>
                    Score
                  </div>
                </motion.div>
              </div>

              {/* Top Choice Badge */}
              {itinerary.reliabilityScore >= 9.5 && (
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-3 -right-3 bg-green-700 text-white text-[8px] font-black px-3 py-1 rounded-full shadow-sm shadow-green-900/40 uppercase tracking-tighter"
                >
                  ★ Best
                </motion.div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black mono">
                  {firstLeg.departure.airport} → {lastLeg.arrival.airport}
                </h3>
                <Badge variant={statusColors[itinerary.status]} className="text-xs py-1 px-3">{itinerary.status}</Badge>
                {itinerary.reliabilityScore >= 9.5 && (
                  <Badge variant="success" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs py-1 px-3">Top Choice</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-black text-accent uppercase tracking-widest">
                  {itinerary.legs.map(l => l.airline).filter((v, i, a) => a.indexOf(v) === i).join(' + ')}
                </span>
                {isConnecting && (
                  <span className="text-xs text-white/60 uppercase font-bold">
                    • {itinerary.legs.length - 1} Stop{itinerary.legs.length > 2 ? 's' : ''}
                  </span>
                )}
                {firstLeg && firstLeg.departure && firstLeg.departure.scheduled && (
                  <span className="text-xs text-white/60 uppercase font-bold flex items-center gap-2">
                    • <Calendar className="w-3 h-3" /> {format(parseISO(firstLeg.departure.scheduled), 'dd MMM')}
                  </span>
                )}
              </div>
              <p className="text-white/80 text-xs uppercase tracking-wider font-medium mt-2">
                {riskLabels[itinerary.status]}
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-3">
            <div>
              <div className="text-xs text-white/60 mono mb-1 font-bold">EST. PRICE</div>
              <div className="text-2xl font-black mono text-accent">RM{itinerary.price}</div>
            </div>
            {onSave && (
              <button
                onClick={onSave}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all border",
                  isSaved 
                    ? "bg-red-500/10 text-red-500 border-red-500/20" 
                    : "bg-white/5 text-muted border-white/10 hover:bg-accent/10 hover:text-accent hover:border-accent/20"
                )}
              >
                <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                {isSaved ? "Saved" : "Save"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between text-sm mono text-white/90 bg-white/5 p-4 rounded-lg">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>DEP: {format(parseISO(firstLeg.departure.scheduled), 'HH:mm')} • {format(parseISO(firstLeg.departure.scheduled), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-accent" />
                <span>RISK: {itinerary.connectionRiskValue}%</span>
              </div>
            </div>
            {onRemove && (
              <button
                onClick={onRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg transition-all hover:bg-red-500 hover:text-white border border-red-500/20 text-xs font-black uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4" />
                Remove Trip
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ItineraryDetailView({ 
  itinerary, 
  allItineraries,
  onBack, 
  onSave, 
  onShare,
  onSelectAlternative,
  isSaved,
  searchDate
}: { 
  itinerary: Itinerary, 
  allItineraries: Itinerary[],
  onBack: () => void, 
  onSave: () => void,
  onShare: () => void,
  onSelectAlternative: (alt: Itinerary) => void,
  isSaved: boolean,
  searchDate?: string
}) {
  if (!itinerary || !itinerary.legs || !Array.isArray(itinerary.legs) || itinerary.legs.length === 0) {
    return (
      <div className="p-8 text-center text-white/50">
        No itinerary details available.
        <button onClick={onBack} className="mt-4 block mx-auto text-accent underline">Go Back</button>
      </div>
    );
  }

  const firstLeg = itinerary.legs[0];
  const lastLeg = itinerary.legs[itinerary.legs.length - 1];

  // Dynamic Alternatives Logic (F009)
  const otherItineraries = allItineraries.filter(it => 
    it && it.id !== itinerary.id && it.legs && Array.isArray(it.legs) && it.legs.length > 0
  );
  
  const higherReliability = [...otherItineraries]
    .filter(it => it.reliabilityScore > itinerary.reliabilityScore)
    .sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0];

  const betterPrice = [...otherItineraries]
    .filter(it => it.price < itinerary.price)
    .sort((a, b) => a.price - b.price)[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Results
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={onShare}
            className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-accent/50 transition-all border border-white/10"
          >
            <Mail className="w-4 h-4" />
            Share
          </button>
          <button 
            onClick={() => setShowPriceAlertModal(true)}
            className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-accent/50 transition-all border border-white/10"
          >
            <Bell className="w-4 h-4" />
            Set Alert
          </button>
          <button 
            onClick={onSave}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg border",
              isSaved 
                ? "bg-red-500 text-white shadow-red-500/20 border-red-500" 
                : "bg-accent text-white shadow-accent/20 hover:bg-accent/80 border-accent hover:border-white/20"
            )}
          >
            {isSaved ? <Heart className="w-4 h-4 fill-current" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Saved' : 'Save Itinerary'}
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Total Price</p>
          <p className="text-2xl font-black mono text-accent">RM{itinerary.price}</p>
        </div>
        <div className="text-center border-l border-white/10">
          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Duration</p>
          <p className="text-2xl font-black mono text-white">{itinerary.totalDuration || 'N/A'}</p>
        </div>
        <div className="text-center border-l border-white/10">
          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Stops</p>
          <p className="text-2xl font-black mono text-white">{itinerary.legs.length > 1 ? itinerary.legs.length - 1 : 'Non-stop'}</p>
        </div>
        <div className="text-center border-l border-white/10">
          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Airline</p>
          <p className="text-lg font-bold text-white">{itinerary.legs[0]?.airline || 'Unknown'}</p>
        </div>
        <div className="text-center border-l border-white/10">
          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Reliability</p>
          <p className="text-2xl font-black mono text-accent">{itinerary.reliabilityScore.toFixed(2)}/10</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Reliability Card */}
        <Card className="md:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Plane className="w-48 h-48 -rotate-45" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black mono mb-1">{itinerary.reliabilityScore.toFixed(2)}/10</h2>
                <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-xs">Route Reliability Score</p>
                {searchDate && (
                  <div className="flex items-center gap-2 mt-2 text-accent">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {format(parseISO(searchDate), 'EEE, dd MMM yyyy')}
                    </span>
                  </div>
                )}
              </div>
              <Badge variant={itinerary.status === 'RELIABLE' ? 'success' : 'warning'}>{itinerary.status}</Badge>
            </div>

            <div className="space-y-8">
              {itinerary.legs.map((leg, index) => (
                <div key={leg.id} className="relative">
                  {index < itinerary.legs.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-[-32px] w-[1px] bg-dashed border-l border-white/10" />
                  )}
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/30">
                      <Plane className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold mono">{leg.flightNumber}</h4>
                          <span className="text-[10px] mono text-accent font-bold">LEG {index + 1}/{itinerary.legs.length}</span>
                        </div>
                        <p className="text-white/70 font-bold">{leg.airline}</p>
                      </div>
                      
                      {/* Route info */}
                      <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
                        <div>
                          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Departure</p>
                          <p className="text-lg font-black mono text-accent">{leg.departure.airport}</p>
                          <p className="text-sm font-bold">{format(parseISO(leg.departure.scheduled), 'HH:mm')}</p>
                          <p className="text-[10px] text-white/50">{format(parseISO(leg.departure.scheduled), 'dd MMM yyyy')}</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <svg viewBox="0 0 300 80" className="w-full h-16 max-w-xs">
                            {/* Curved arrow path */}
                            <path
                              d="M 20 60 Q 150 10, 280 60"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-accent"
                            />
                            {/* Start dot */}
                            <circle cx="20" cy="60" r="5" fill="currentColor" className="text-accent" />
                            {/* Arrow head */}
                            <polygon points="280,60 270,55 275,60 270,65" fill="currentColor" className="text-accent" />
                            {/* End dot */}
                            <circle cx="280" cy="60" r="5" fill="currentColor" className="text-accent" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Arrival</p>
                          <p className="text-lg font-black mono text-accent">{leg.arrival.airport}</p>
                          <p className="text-sm font-bold">{format(parseISO(leg.arrival.scheduled), 'HH:mm')}</p>
                          <p className="text-[10px] text-white/50">{format(parseISO(leg.arrival.scheduled), 'dd MMM yyyy')}</p>
                        </div>
                      </div>

                      {/* Additional details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Duration</p>
                          <p className="font-bold mono text-white">
                            {(() => {
                              const start = parseISO(leg.departure.scheduled);
                              const end = parseISO(leg.arrival.scheduled);
                              let diffMs = end.getTime() - start.getTime();
                              
                              // If negative, add 24 hours (flight arrives next day)
                              if (diffMs < 0) {
                                diffMs += 24 * 3600000;
                              }
                              
                              const hours = Math.floor(diffMs / 3600000);
                              const mins = Math.floor((diffMs % 3600000) / 60000);
                              return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
                            })()}
                          </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">Disruption Risk</p>
                          <p className="font-bold mono text-white">{(leg.disruptionProbability * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Connection Risk Card */}
        <Card className="flex flex-col justify-between border-accent/20 bg-accent/5">
          <div>
            <div className="flex items-center gap-2 text-accent mb-6">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Connection Risk Assessment</span>
            </div>
            <div className="text-center py-6">
              <div className="text-5xl font-black mono text-white mb-2">{Math.round(itinerary.connectionRiskValue)}%</div>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Probability of Missed Connection</p>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 uppercase font-bold">Risk Level</span>
                <Badge variant={itinerary.connectionRisk === 'LOW' ? 'success' : 'warning'}>{itinerary.connectionRisk}</Badge>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-[10px] text-white/80 leading-relaxed italic border border-white/5">
                "Based on historical delay propagation and airport transfer characteristics at {itinerary.legs[0]?.arrival?.airport || 'destination'}."
              </div>
            </div>
          </div>
        </Card>

        {/* Alternative Suggestions (F009) */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 px-2">Alternative Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {higherReliability ? (
              <Card 
                onClick={() => onSelectAlternative(higherReliability)}
                className="bg-white/[0.02] border-dashed border-white/10 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-green-400 -rotate-45" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Higher Reliability Option</span>
                  </div>
                  <div className="text-sm font-bold mono text-accent">
                    {higherReliability.price > itinerary.price ? `RM+${higherReliability.price - itinerary.price}` : `RM-${itinerary.price - higherReliability.price}`}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold mono group-hover:text-accent transition-colors">
                    {higherReliability.legs?.[0]?.airline || 'Unknown'} • {higherReliability.legs?.[0]?.flightNumber || 'Unknown'}
                  </div>
                  <div className="text-xs mono text-muted">Score: {higherReliability.reliabilityScore}/10</div>
                </div>
              </Card>
            ) : (
              <div className="p-8 bg-white/5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center text-[10px] text-muted uppercase tracking-widest">
                No higher reliability options found
              </div>
            )}

            {betterPrice ? (
              <Card 
                onClick={() => onSelectAlternative(betterPrice)}
                className="bg-white/[0.02] border-dashed border-white/10 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Better Price Option</span>
                  </div>
                  <div className="text-sm font-bold mono text-accent">RM-{itinerary.price - betterPrice.price}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold mono group-hover:text-accent transition-colors">
                    {betterPrice.legs?.[0]?.airline || 'Unknown'} • {betterPrice.legs?.[0]?.flightNumber || 'Unknown'}
                  </div>
                  <div className="text-xs mono text-muted">Score: {betterPrice.reliabilityScore}/10</div>
                </div>
              </Card>
            ) : (
              <div className="p-8 bg-white/5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center text-[10px] text-muted uppercase tracking-widest">
                No cheaper options found
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
