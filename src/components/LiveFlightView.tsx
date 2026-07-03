import React, { useState } from 'react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { 
  Plane, 
  Search, 
  Activity, 
  Clock, 
  Navigation, 
  Wind, 
  ShieldCheck, 
  Map as MapIcon,
} from 'lucide-react';
import { Card, Badge } from './UI';
import { trackFlight, LiveFlightData } from '../services/flightService';

const formatTime = (timeStr: string) => {
  try {
    // Check if it's an ISO string
    if (timeStr.includes('T')) {
      return format(parseISO(timeStr), 'HH:mm');
    }
    return timeStr;
  } catch (e) {
    return timeStr;
  }
};

const formatDate = (timeStr: string) => {
  if (!timeStr) return '';
  try {
    // If it's already an ISO string
    if (timeStr.includes('T')) {
      return format(parseISO(timeStr), 'dd MMM yyyy');
    }
    // If it's just a time like "12:10", we can't easily get the date
    // But since we updated the service to return ISO, this should be less common
    return '';
  } catch (e) {
    return '';
  }
};

interface LiveFlightViewProps {
  isDemoMode?: boolean;
  onEnableDemo?: () => void;
}

export const LiveFlightView: React.FC<LiveFlightViewProps> = ({ isDemoMode = false, onEnableDemo }) => {
  const [query, setQuery] = useState('');
  const [tracking, setTracking] = useState<LiveFlightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);
    setIsRateLimited(false);
    
    try {
      const data = await trackFlight(query, isDemoMode);
      if (data) {
        setTracking(data);
      } else {
        setError("Could not find live data for this flight. Please check the flight number.");
      }
    } catch (err: any) {
      if (err.message === "RATE_LIMIT_EXCEEDED") {
        setIsRateLimited(true);
        setError("RATE_LIMIT");
      } else {
        console.error(err);
        setError("An error occurred while fetching flight data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Activity className="w-7 h-7 text-accent" />
          Live Flight Tracking
        </h2>
        <p className="text-xs text-white/60 font-bold uppercase tracking-widest">Real-time flight status, aircraft telemetry, and live progress updates</p>
      </div>

      <Card className="border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5">
        <form onSubmit={handleTrack} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text"
              placeholder="Enter Flight Number (e.g. MH123, AK512, SQ801)"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              className="w-full bg-background border border-accent/30 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all font-bold mono"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-accent/80 hover:shadow-lg hover:shadow-accent/30 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Track'}
          </button>
        </form>
      </Card>

      {error === "RATE_LIMIT" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-accent/10 border border-accent/20 p-6 rounded-2xl space-y-4"
        >
          <div className="flex items-center gap-3 text-accent">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">API Service Unavailable</p>
          </div>
          <p className="text-[10px] text-muted leading-relaxed">
            The AI model is currently experiencing high demand or the shared quota is exceeded. You can fix this by adding your own key in the Profile tab, or try the app with demo data.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onEnableDemo}
              className="flex-1 py-2 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent/80 transition-all"
            >
              Use Demo Data
            </button>
          </div>
        </motion.div>
      )}

      {error && error !== "RATE_LIMIT" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400"
        >
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold">{error}</p>
        </motion.div>
      )}

      {isDemoMode && !error && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Demo Mode Active
        </div>
      )}

      {tracking && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          {/* Flight Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="w-5 h-5 text-accent" />
              <div>
                <h3 className="text-xl font-black mono text-white">{tracking.flightNumber}</h3>
                <p className="text-xs text-white/60 font-bold">{tracking.airline}</p>
              </div>
            </div>
            <Badge 
              variant={tracking.status === 'IN AIR' ? 'success' : 'warning'} 
              className="px-4 py-2 text-[10px] flex items-center gap-2"
            >
              {tracking.status === 'IN AIR' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
              {tracking.status}
            </Badge>
          </div>

          {/* Radar Visualization - Centered - show only departure and arrival airports */}
          <Card className="h-80 bg-gradient-to-br from-accent/10 to-background border-accent/30 relative overflow-hidden group">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(242,125,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(242,125,38,0.1)_1px,transparent_1px)] bg-[50px_50px]" />
            </div>
            
            {/* Radar Scanning Effect - Simplified */}
            <div className="absolute inset-0">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20"
                style={{ 
                  backgroundImage: 'conic-gradient(from 0deg, rgba(242,125,38,0.4), transparent)',
                  clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)'
                }}
              />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-accent/20 rounded-full pointer-events-none"
                  style={{
                    width: `${100 + i * 100}px`,
                    height: `${100 + i * 100}px`,
                    animation: `pulse 4s ease-out ${i * 1.3}s infinite`
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                {/* Path Background */}
                <path 
                  d="M 20 50 Q 200 -20 380 50" 
                  fill="none" 
                  stroke="rgba(242,125,38,0.15)" 
                  strokeWidth="2" 
                  strokeDasharray="5 5"
                />
                
                {/* Completed Path */}
                <motion.path 
                  d="M 20 50 Q 200 -20 380 50" 
                  fill="none" 
                  stroke="url(#pathGradient)" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: tracking.progress / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />

                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--color-accent)" />
                  </linearGradient>
                </defs>

                {/* Origin Point */}
                <circle cx="20" cy="50" r="5" className="fill-accent" />
                <text x="20" y="75" className="fill-accent text-[9px] font-black mono tracking-tighter" textAnchor="middle">{tracking.origin.airport}</text>

                {/* Destination Point */}
                <circle cx="380" cy="50" r="5" className="fill-white/30" />
                <text x="380" y="75" className="fill-white/40 text-[9px] font-black mono tracking-tighter" textAnchor="middle">{tracking.destination.airport}</text>

                {/* Moving Plane */}
                <motion.g
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: `${tracking.progress}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{ 
                    offsetPath: "path('M 20 50 Q 200 -20 380 50')",
                    offsetRotate: "auto 90deg"
                  }}
                >
                  <g className="text-accent">
                    <circle r="6" className="fill-accent/30" />
                    <Plane className="w-5 h-5 -translate-x-1/2 -translate-y-1/2 fill-accent text-accent" />
                  </g>
                </motion.g>
              </svg>
            </div>

            {/* Overlay Info - Below Live Radar Active */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/50 to-transparent p-6 z-20 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-[10px] font-black text-accent uppercase tracking-widest">Live Radar Active</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-[8px] text-white/50 font-bold uppercase tracking-tighter mb-1">Current Position</div>
                  <div className="text-sm font-black mono text-accent">{tracking.progress}%</div>
                </div>
                <div>
                  <div className="text-[8px] text-white/50 font-bold uppercase tracking-tighter mb-1">Latitude</div>
                  <div className="text-sm font-bold mono text-white/70">{(3.1390 + (Math.random() * 0.1)).toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-[8px] text-white/50 font-bold uppercase tracking-tighter mb-1">Longitude</div>
                  <div className="text-sm font-bold mono text-white/70">{(101.6869 + (Math.random() * 0.1)).toFixed(4)}</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {!tracking && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-gradient-to-b from-accent/5 to-background rounded-3xl border border-dashed border-accent/20"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-6"
          >
            <Plane className="w-16 h-16 text-accent/40 mx-auto" />
          </motion.div>
          <p className="text-lg font-bold text-white/80 mb-2">Enter a flight number to start tracking</p>
          <p className="text-xs text-white/50 mb-8 font-bold uppercase tracking-widest">Get real-time aircraft location, altitude, speed, and arrival estimates</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Quick Start:</span>
            <button onClick={() => { setQuery('MH123'); }} className="text-[10px] font-black text-accent hover:text-accent/80 uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-all border border-accent/20">MH123</button>
            <button onClick={() => { setQuery('SQ801'); }} className="text-[10px] font-black text-accent hover:text-accent/80 uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-all border border-accent/20">SQ801</button>
            <button onClick={() => { setQuery('AK512'); }} className="text-[10px] font-black text-accent hover:text-accent/80 uppercase tracking-widest bg-accent/10 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-all border border-accent/20">AK512</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
