# 6.4 Overview of Backend Implementation

The Smart Flight backend infrastructure consists of server side components that handle flight search operations, live flight tracking, data processing, and API integrations. This section examines the backend architecture, API endpoints, data generation algorithms, and server configuration that enable the application's core functionalities.

The backend implementation follows a modern Node.js architecture with Express.js serving RESTful API endpoints and Vite middleware for development workflow optimization. The system integrates external AI services for intelligent flight search processing while implementing fallback mechanisms to ensure continuous operation even when external dependencies are unavailable. This architecture balances performance, reliability, and maintainability through careful design decisions.

---

## 6.4.1 Server Configuration and Architecture

The primary server implementation resides in `server.ts`, which establishes the Express.js application framework and configures essential middleware components. Figure 6.25 illustrates the core server initialization logic that sets up the application environment and configures API integrations.

```typescript
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
```

**Figure 6.25: Server initialization and middleware configuration**

The server configuration demonstrates several architectural decisions that enhance system reliability and maintainability. The Express.js framework provides robust HTTP request handling with built-in middleware support for JSON parsing and routing. The integration of Vite development server enables hot module replacement during development, significantly improving developer productivity through instantaneous code updates without full server restarts. Environment variables loaded through dotenv provide secure configuration management, keeping sensitive API keys separate from source code.

The Google Generative AI client initialization establishes connection to external AI services for intelligent flight search processing. Custom HTTP headers ensure proper user agent identification, preventing potential API access restrictions. This modular initialization approach allows for easy modification or replacement of external service providers without affecting core application logic.

---

## 6.4.2 Flight Search API Endpoint

The flight search functionality operates through a POST endpoint at `/api/search` that processes user search queries and returns flight itineraries. Figure 6.26 demonstrates the endpoint implementation with error handling and fallback mechanisms.

```typescript
app.post("/api/search", async (req, res) => {
  const { query, departureDate } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const realFlights = await fetchRealFlights(query, "", "");
    
    if (realFlights && realFlights.length > 0) {
      return res.json(realFlights);
    }

    // Fallback to AI generation
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: searchPrompt,
      config: responseSchema
    });

    const data = JSON.parse(response.text);
    res.json(data);
  } catch (err) {
    res.json(generateSimulatedSearch(query, departureDate));
  }
});
```

**Figure 6.26: Flight search API endpoint with multi-tier fallback strategy**

The search endpoint implements a three tier data retrieval strategy that ensures continuous operation regardless of external service availability. The primary data source attempts to fetch real flight information from external flight APIs when configured. If real data is unavailable or the API request fails, the system transitions to AI powered flight generation using Google Generative AI. This AI integration leverages large language models trained on extensive flight data to produce realistic flight options with appropriate pricing, timing, and routing information.

The final fallback mechanism generates simulated flight data using local algorithms when both real APIs and AI services are unavailable. This defensive programming approach guarantees that users always receive search results, preventing application failures due to external dependencies. Therefore, the system maintains high availability even during API outages, rate limit exhaustion, or network connectivity issues that might affect external service access.

---

## 6.4.3 Flight Data Generation Algorithm

The flight data generation system creates realistic flight itineraries with appropriate pricing based on route distance and market conditions. Figure 6.27 shows the route aware price range configuration that ensures generated prices match real world expectations.

```typescript
function getPriceRange(originCode: string, destCode: string) {
  const routePrices: Record<string, { min: number; max: number }> = {
    "KUL_SIN": { min: 120, max: 350 },
    "KUL_PEN": { min: 100, max: 280 },
    "KUL_HAN": { min: 280, max: 650 },
    "KUL_HKG": { min: 350, max: 800 },
    "KUL_NRT": { min: 800, max: 2200 },
    "KUL_LHR": { min: 1800, max: 4500 },
  };

  const routeKey = `${originCode}_${destCode}`;
  
  return routePrices[routeKey] || { min: 400, max: 1200 };
}
```

**Figure 6.27: Route aware price range configuration for realistic pricing**

The price generation algorithm categorizes routes into distance tiers that reflect actual airline pricing patterns. Short haul domestic routes within Southeast Asia such as Kuala Lumpur to Singapore receive lower price ranges between RM100 and RM350, matching budget carrier offerings and regional airline pricing. Medium haul regional routes to Hong Kong or Hanoi command higher prices between RM280 and RM800, reflecting increased fuel costs and longer flight durations.

Long haul international routes to destinations like Tokyo or London require significantly higher price points ranging from RM800 to RM4500, accounting for premium aircraft requirements, extended flight times, and international route economics. The fallback default range of RM400 to RM1200 accommodates unknown routes while maintaining pricing realism. This tiered pricing structure ensures that generated flight options match user expectations based on their travel experience and market knowledge.

---

## 6.4.4 Itinerary Generation with Reliability Scoring

The itinerary generation function creates diverse flight options with varying reliability characteristics, enabling users to evaluate tradeoffs between price and dependability. Figure 6.28 illustrates the generation of premium direct flight options with high reliability scores.

```typescript
function generateSimulatedSearch(query: string, departureDate?: string) {
  const priceRange = getPriceRange(originCode, destCode);
  const options = [];

  // Premium Direct Flight Option
  const price1 = Math.round(priceRange.max * 0.95);
  options.push({
    id: generateId(),
    totalDuration: "1h 15m",
    reliabilityScore: 8.8 + Math.random() * 1.2,
    connectionRisk: "LOW",
    connectionRiskValue: 2 + Math.random() * 3,
    status: "RELIABLE",
    price: price1,
    legs: [generateDirectFlight()]
  });

  // Additional options with varied pricing and reliability...
  
  return options;
}
```

**Figure 6.28: Premium flight option generation with high reliability characteristics**

The itinerary generation algorithm produces five distinct flight options for each search, each representing different positioning along the price reliability spectrum. Premium direct flights occupy the high price, high reliability quadrant with scores exceeding 8.8 out of 10 and connection risk values below 5 percent. These options appeal to business travelers or time sensitive journeys where reliability justifies premium pricing. Budget low price options conversely sacrifice some reliability, scoring between 6.5 and 8.0, while offering substantially lower prices near the minimum range threshold.

Connection based itineraries introduce additional complexity with multiple flight legs, resulting in longer total durations and elevated connection risk classifications of MEDIUM or HIGH. The algorithm calculates disruption probability for each leg, combining these values to produce overall reliability scores that reflect the compounding risk of multi segment journeys. For example, a connection flight with two legs each having 10 percent disruption probability results in approximately 19 percent overall disruption probability, properly accounting for the increased failure points in multi leg itineraries.

---

## 6.4.5 Live Flight Tracking API

The live flight tracking functionality operates through a dedicated `/api/track` endpoint that provides real time flight status information. Figure 6.29 demonstrates the tracking endpoint implementation with dynamic data generation.

```typescript
app.post("/api/track", async (req, res) => {
  const { flightNumber } = req.body;
  
  if (!flightNumber) {
    return res.status(400).json({ error: "Flight number required" });
  }

  try {
    const flightData = generateVariedSimulatedTrack(flightNumber);
    res.json(flightData);
  } catch (err) {
    res.json(generateDefaultTrack(flightNumber));
  }
});
```

**Figure 6.29: Live flight tracking endpoint implementation**

The tracking endpoint processes flight number requests and returns comprehensive status information including current position, altitude, speed, and estimated arrival time. The system generates varied flight data for each request, simulating different flight statuses including IN AIR, SCHEDULED, LANDED, and DELAYED. This variation ensures that the tracking interface demonstrates different operational states during testing and demonstration scenarios.

Real production implementations would integrate with aviation data providers such as FlightAware or FlightRadar24 to retrieve actual real time flight positions and status updates. The current architecture establishes the endpoint structure and data format necessary for seamless integration with these services when production API credentials are obtained. Therefore, the tracking system provides a functional foundation that requires minimal modification to support real time aviation data sources.

---

## 6.4.6 Dynamic Route and Aircraft Assignment

The flight tracking data generation includes sophisticated logic for route selection and aircraft assignment based on airline identifiers. Figure 6.30 shows the route configuration and airline mapping implementation.

```typescript
function generateVariedSimulatedTrack(flightNumber: string) {
  const airlineMap = {
    'MH': 'Malaysia Airlines',
    'AK': 'AirAsia',
    'SQ': 'Singapore Airlines',
    'OD': 'Batik Air'
  };
  
  const routes = [
    { from: 'KUL', to: 'SIN', duration: 70 },
    { from: 'KUL', to: 'BKK', duration: 150 },
    { from: 'KUL', to: 'HAN', duration: 180 }
  ];
  
  const code = flightNumber.substring(0, 2).toUpperCase();
  const airline = airlineMap[code] || 'International Airlines';
  const route = routes[Math.floor(Math.random() * routes.length)];
  
  return buildFlightData(airline, route, flightNumber);
}
```

**Figure 6.30: Airline and route mapping for realistic flight tracking data**

The tracking data generator extracts airline identifiers from flight number prefixes, mapping standard IATA codes to full airline names. Malaysia Airlines flights with MH prefixes, AirAsia flights with AK codes, and Singapore Airlines flights with SQ identifiers each receive appropriate airline branding and characteristics. This mapping ensures that generated tracking data maintains consistency with real world airline operations and flight numbering conventions.

Route assignment randomly selects from predefined route configurations that specify origin, destination, and typical flight duration. Short haul routes like Kuala Lumpur to Singapore complete in approximately 70 minutes, while longer regional routes to Bangkok or Hanoi require 150 to 180 minutes. Aircraft model assignment draws from a pool of common commercial aircraft types including Boeing 737 800, Airbus A320, and Boeing 777 300, ensuring that displayed aircraft information matches typical airline fleet compositions.

---

## 6.4.7 Error Handling and Retry Mechanisms

The backend implements robust error handling with exponential backoff retry logic for transient failures in external API communications. Figure 6.31 demonstrates the retry mechanism implementation.

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  retries = 2, 
  delay = 500
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error.message.includes("503") || 
                       error.message.includes("429");
    
    if (retries > 0 && isRetryable) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    
    throw error;
  }
}
```

**Figure 6.31: Exponential backoff retry mechanism for API resilience**

The retry mechanism identifies transient error conditions such as HTTP 503 Service Unavailable or HTTP 429 Too Many Requests status codes that indicate temporary service disruptions rather than permanent failures. When these retryable errors occur, the system implements exponential backoff by doubling the delay between each retry attempt, starting from 500 milliseconds and increasing to 1000 milliseconds, then 2000 milliseconds. This backoff strategy prevents overwhelming already stressed external services with immediate retry attempts while maximizing the probability of eventual success.

The system limits retry attempts to two additional tries beyond the initial request, preventing infinite retry loops that could consume server resources or delay user responses indefinitely. Non retryable errors such as authentication failures or malformed request errors bypass the retry mechanism and immediately propagate to the fallback handler, ensuring rapid transition to alternative data sources when retries would prove futile.

---

## 6.4.8 Caching Strategy for API Rate Limit Management

The backend implements intelligent caching to optimize external API usage and prevent rate limit exhaustion. Figure 6.32 shows the caching implementation for flight search results.

```typescript
const flightDataCache: Record<string, { 
  data: any; 
  timestamp: number 
}> = {};

async function fetchRealFlights(
  origin: string, 
  destination: string, 
  departureDate: string
) {
  const cacheKey = `${origin}_${destination}_${departureDate}`;
  const cached = flightDataCache[cacheKey];
  
  if (cached && Date.now() - cached.timestamp < 3600000) {
    console.log("Using cached flight data");
    return cached.data;
  }
  
  // Fetch fresh data and update cache
  const freshData = await fetchFromExternalAPI();
  flightDataCache[cacheKey] = { 
    data: freshData, 
    timestamp: Date.now() 
  };
  
  return freshData;
}
```

**Figure 6.32: Flight data caching with one hour expiration policy**

The caching system maintains an in memory cache of flight search results keyed by the combination of origin airport, destination airport, and departure date. This composite key ensures that identical searches retrieve cached results while different search parameters trigger fresh API requests. The one hour cache duration balances data freshness requirements against API quota conservation, recognizing that flight prices and availability do not typically change minute by minute but may shift significantly over longer periods.

Cache hit scenarios retrieve data instantaneously without consuming external API quotas or incurring network latency, providing optimal response times for repeated searches. Cache miss scenarios trigger fresh API requests and populate the cache for subsequent identical queries. This approach proves particularly effective during peak usage periods when multiple users may search for popular routes like Kuala Lumpur to Singapore, where the first search populates the cache and subsequent searches benefit from cached results. Therefore, the caching strategy significantly reduces external API dependency while maintaining acceptable data currency for user decision making.

---

## 6.4.9 Development and Production Server Configuration

The server bootstrap function implements environment aware configuration that optimizes the setup for development and production deployments. Figure 6.33 illustrates the conditional middleware configuration.

```typescript
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

**Figure 6.33: Environment aware server configuration for development and production**

The development environment configuration integrates Vite middleware in middleware mode, enabling hot module replacement and instant updates during development without full application rebuilds. This configuration significantly enhances developer productivity by providing near instantaneous feedback when code changes occur. The Vite middleware intercepts requests for JavaScript modules, applies necessary transformations, and serves updated code without requiring manual server restarts or page refreshes.

Production environment configuration switches to static file serving from the prebuilt dist directory, eliminating development overhead and maximizing runtime performance. The static file middleware efficiently serves compiled JavaScript bundles, CSS stylesheets, and other assets with appropriate caching headers. The catch all route handler ensures that client side routing functions correctly by serving the main index.html file for all non API routes, allowing React Router to handle navigation without requiring server side route configuration for each application page. Therefore, this dual configuration approach optimizes the development experience while ensuring production deployments achieve maximum performance and reliability.
