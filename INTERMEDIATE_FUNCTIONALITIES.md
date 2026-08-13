# Intermediate-Level Functionalities Implementation

## 6.7 Overview of Intermediate-Level Functionalities

Building upon the basic functionalities, Smart Flight implements intermediate-level features that provide users with enhanced control and deeper insights into flight information. This section describes advanced features including detailed itinerary analysis, price alert notifications, multi-city trip planning, connection risk assessment, itinerary comparison, and email sharing capabilities. These functionalities leverage the reliability scoring system and real-time data synchronization to deliver sophisticated travel planning tools while maintaining an intuitive user experience.

---

## 6.7.1 Detailed Itinerary View

When users select a flight from search results, a detailed view modal displays comprehensive information about the itinerary including flight legs, connection times, reliability breakdown, and actionable options.

### Itinerary Detail Modal

The detail view presents complete flight information in an organized, easy-to-read format.

```typescript
function ItineraryDetailView({ 
  itinerary, 
  onClose, 
  onSave,
  onSetPriceAlert 
}: ItineraryDetailProps) {
  const firstLeg = itinerary.legs[0];
  const lastLeg = itinerary.legs[itinerary.legs.length - 1];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="header">
          <h2>Flight Details</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="route-summary">
          <RouteHeader 
            origin={firstLeg.departure.airport}
            destination={lastLeg.arrival.airport}
            date={format(parseISO(firstLeg.departure.scheduled), 'PPP')}
          />
        </div>

        <div className="reliability-section">
          <ReliabilityScore score={itinerary.reliabilityScore} />
          <ConnectionRiskIndicator 
            risk={itinerary.connectionRisk}
            value={itinerary.connectionRiskValue}
          />
          <StatusBadge status={itinerary.status} />
        </div>

        <div className="flight-legs">
          {itinerary.legs.map((leg, index) => (
            <FlightLegDetail 
              key={leg.id}
              leg={leg}
              showConnection={index < itinerary.legs.length - 1}
            />
          ))}
        </div>

        <div className="price-section">
          <div className="total-price">RM{itinerary.price}</div>
          <button onClick={() => onSave(itinerary)}>Save</button>
          <button onClick={() => onSetPriceAlert(itinerary)}>Set Alert</button>
        </div>
      </div>
    </div>
  );
}
```
*Figure 6.67: Detailed Itinerary View Modal Structure*

Therefore, the detailed view modal displays route summary with origin, destination, and departure date, presents reliability metrics including score, connection risk, and status, shows individual flight legs with complete departure and arrival information, calculates and displays layover times between connecting flights, and provides action buttons for saving and setting price alerts. This comprehensive presentation enables users to make informed booking decisions with full visibility into flight details.

### Flight Leg Breakdown

Each flight segment is displayed with granular details including airline, flight number, and terminal information.

```typescript
function FlightLegDetail({ leg, showConnection }: FlightLegDetailProps) {
  const departureTime = format(parseISO(leg.departure.scheduled), 'HH:mm');
  const arrivalTime = format(parseISO(leg.arrival.scheduled), 'HH:mm');
  const flightDuration = calculateDuration(
    leg.departure.scheduled, 
    leg.arrival.scheduled
  );

  return (
    <div className="flight-leg">
      <div className="airline-info">
        <div className="flight-number">{leg.flightNumber}</div>
        <div className="airline-name">{leg.airline}</div>
      </div>

      <div className="departure-info">
        <div className="time">{departureTime}</div>
        <div className="airport">{leg.departure.airport}</div>
        <div className="city">{leg.departure.city}</div>
      </div>

      <div className="flight-path">
        <div className="duration">{flightDuration}</div>
        <div className="path-line" />
      </div>

      <div className="arrival-info">
        <div className="time">{arrivalTime}</div>
        <div className="airport">{leg.arrival.airport}</div>
        <div className="city">{leg.arrival.city}</div>
      </div>

      <div className="disruption-indicator">
        <DisruptionProbability 
          probability={leg.disruptionProbability} 
        />
      </div>

      {showConnection && (
        <ConnectionTimeIndicator 
          currentArrival={leg.arrival.scheduled}
          nextDeparture={nextLeg.departure.scheduled}
        />
      )}
    </div>
  );
}
```
*Figure 6.68: Individual Flight Leg Detail Display*

For example, Figure 6.68 demonstrates flight leg presentation that shows flight number and airline branding for each segment, displays departure and arrival times in 24-hour format for clarity, presents airport codes and city names for geographic context, visualizes flight path with duration between departure and arrival, indicates disruption probability for each individual leg, and calculates layover times when multiple legs exist. This detailed breakdown helps users understand the complete journey structure.

### Reliability Score Breakdown

The reliability score is explained with contributing factors to help users understand the calculation.

```typescript
function ReliabilityBreakdown({ itinerary }: ReliabilityBreakdownProps) {
  const factors = [
    {
      name: 'Disruption Risk',
      impact: calculateDisruptionImpact(itinerary.legs),
      description: 'Based on historical on-time performance'
    },
    {
      name: 'Connection Risk',
      impact: calculateConnectionImpact(itinerary.connectionRisk),
      description: 'Layover time adequacy assessment'
    },
    {
      name: 'Route Complexity',
      impact: calculateComplexityImpact(itinerary.legs.length),
      description: 'Number of connections required'
    }
  ];

  return (
    <div className="reliability-breakdown">
      <h3>Reliability Score: {itinerary.reliabilityScore.toFixed(1)}/10</h3>
      <div className="factors">
        {factors.map(factor => (
          <div key={factor.name} className="factor">
            <div className="factor-name">{factor.name}</div>
            <div className="factor-impact">-{factor.impact} points</div>
            <div className="factor-description">{factor.description}</div>
          </div>
        ))}
      </div>
      <div className="explanation">
        A score of {itinerary.reliabilityScore.toFixed(1)} indicates 
        this itinerary is {getReliabilityLabel(itinerary.reliabilityScore)}.
      </div>
    </div>
  );
}
```
*Figure 6.69: Reliability Score Factor Breakdown*

Therefore, reliability breakdown shows individual factors affecting the overall score, quantifies the point deduction for each risk factor (disruption, connection, complexity), provides explanatory text for each factor to educate users, and translates numerical scores into qualitative labels (excellent, good, fair, poor). This transparency builds user trust in the reliability assessment system by showing exactly how scores are calculated.

---

## 6.7.2 Price Alert Management

Price alerts enable users to monitor flight prices and receive notifications when prices drop below their target thresholds. This feature helps users secure the best deals without constantly checking prices manually.

### Setting Price Alerts

Users can set target prices for specific itineraries through the detail view modal.

```typescript
async function handleSetPriceAlert(
  itinerary: Itinerary, 
  targetPrice: number
) {
  if (!user) {
    setError("Login required to set price alerts");
    return;
  }

  if (!user.emailVerified) {
    setError("Email verification required");
    return;
  }

  if (targetPrice >= itinerary.price) {
    setError("Target price must be lower than current price");
    return;
  }

  const docId = `${user.uid}_${itinerary.id}_${Date.now()}`;

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
      createdAt: serverTimestamp()
    });

    setSuccessMessage(
      `Alert set! You'll be notified when price drops to RM${targetPrice}`
    );
  } catch (error) {
    setError("Failed to create price alert");
  }
}
```
*Figure 6.70: Price Alert Creation Implementation*

For example, Figure 6.70 shows alert creation that validates user authentication and email verification before allowing alerts, ensures target price is lower than current price for logical consistency, stores alert parameters including route, current price, and target price, timestamps alert creation for tracking and expiration purposes, and provides confirmation feedback with target price displayed. This validation ensures alerts are meaningful and users understand what they are monitoring.

### Price Alert Input Modal

A dedicated modal interface guides users through setting target prices with validation.

```typescript
function PriceAlertModal({ 
  itinerary, 
  onConfirm, 
  onCancel 
}: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const price = parseFloat(targetPrice);

    if (!price || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (price >= itinerary.price) {
      setError("Target price must be lower than current price");
      return;
    }

    onConfirm(itinerary, price);
  };

  return (
    <div className="modal">
      <h3>Set Price Alert</h3>
      <div className="current-price">
        Current Price: RM{itinerary.price}
      </div>
      <input 
        type="number"
        placeholder="Enter target price"
        value={targetPrice}
        onChange={(e) => setTargetPrice(e.target.value)}
        min="1"
        max={itinerary.price - 1}
      />
      {error && <div className="error">{error}</div>}
      <div className="actions">
        <button onClick={handleSubmit}>Set Alert</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
```
*Figure 6.71: Price Alert Input Modal Interface*

Therefore, the alert modal displays current price prominently for reference, provides number input with validation for target price entry, enforces minimum and maximum price constraints through HTML5 validation, shows inline error messages for invalid inputs, and offers clear confirm and cancel actions. This guided interface prevents user errors and ensures alerts are configured correctly.

### Viewing Active Price Alerts

Users can view all their active price alerts in the profile section with current status.

```typescript
useEffect(() => {
  if (!user) {
    setPriceAlerts([]);
    return;
  }

  const q = query(
    collection(db, 'price_alerts'),
    where('uid', '==', user.uid),
    where('status', '==', 'active')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPriceAlerts(alerts);
  });

  return () => unsubscribe();
}, [user]);

function PriceAlertsList({ alerts, onDelete }: PriceAlertsListProps) {
  return (
    <div className="price-alerts">
      <h3>Active Price Alerts</h3>
      {alerts.map(alert => (
        <div key={alert.id} className="alert-card">
          <div className="route">
            {alert.origin} → {alert.destination}
          </div>
          <div className="prices">
            <div>Current: RM{alert.currentPrice}</div>
            <div>Target: RM{alert.targetPrice}</div>
          </div>
          <div className="savings">
            Save RM{alert.currentPrice - alert.targetPrice}
          </div>
          <button onClick={() => onDelete(alert.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```
*Figure 6.72: Price Alerts List Display*

For example, Figure 6.72 demonstrates alert display that shows route information for each monitored itinerary, displays both current and target prices for comparison, calculates potential savings if target price is reached, updates in real-time through Firestore listeners when prices change, and provides delete functionality to remove unwanted alerts. This interface gives users complete visibility into their price monitoring activities.

---

## 6.7.3 Multi-City Trip Planning

Multi-city trip planning enables users to search for complex itineraries with multiple destinations, accommodating travel patterns that involve visiting several cities in sequence.

### Multi-City Leg Management

Users can add, remove, and configure multiple flight legs for comprehensive trip planning.

```typescript
function MultiCityPlanner({ 
  legs, 
  onLegsChange 
}: MultiCityPlannerProps) {
  const addLeg = () => {
    const newLeg = {
      id: Date.now().toString(),
      origin: '',
      destination: '',
      date: format(addDays(new Date(), legs.length), 'yyyy-MM-dd')
    };
    onLegsChange([...legs, newLeg]);
  };

  const removeLeg = (legId: string) => {
    if (legs.length <= 2) {
      setError("Multi-city trips require at least 2 legs");
      return;
    }
    onLegsChange(legs.filter(leg => leg.id !== legId));
  };

  const updateLeg = (legId: string, field: string, value: string) => {
    const updatedLegs = legs.map(leg => 
      leg.id === legId ? { ...leg, [field]: value } : leg
    );
    onLegsChange(updatedLegs);
  };

  return (
    <div className="multi-city-planner">
      {legs.map((leg, index) => (
        <div key={leg.id} className="leg-input">
          <div className="leg-number">Leg {index + 1}</div>
          <AirportSelector 
            label="From"
            value={leg.origin}
            onChange={(value) => updateLeg(leg.id, 'origin', value)}
          />
          <AirportSelector 
            label="To"
            value={leg.destination}
            onChange={(value) => updateLeg(leg.id, 'destination', value)}
          />
          <CalendarSelector 
            label="Date"
            value={leg.date}
            onChange={(value) => updateLeg(leg.id, 'date', value)}
          />
          {legs.length > 2 && (
            <button onClick={() => removeLeg(leg.id)}>Remove</button>
          )}
        </div>
      ))}
      <button onClick={addLeg}>Add Another City</button>
    </div>
  );
}
```
*Figure 6.73: Multi-City Trip Planner Interface*

Therefore, multi-city planning supports adding unlimited destination legs dynamically, maintains minimum requirement of 2 legs for valid multi-city trips, allows independent configuration of origin, destination, and date for each leg, automatically suggests next departure date based on previous arrival, and enables removal of legs except for the minimum required. This flexibility accommodates complex itineraries like business trips with multiple meeting locations or vacation tours visiting several cities.

### Multi-City Search Execution

The search process handles multiple legs sequentially and aggregates results.

```typescript
async function handleMultiCitySearch() {
  if (multiCityLegs.some(leg => !leg.origin || !leg.destination || !leg.date)) {
    setError("Please complete all fields for each leg");
    return;
  }

  setLoading(true);
  const allResults: Itinerary[] = [];

  try {
    for (const leg of multiCityLegs) {
      const query = `${leg.origin} to ${leg.destination} on ${leg.date}`;
      const results = await searchFlight(query, isDemoMode, leg.date);
      allResults.push(...results);
    }

    setItineraries(allResults);

    // Save search history for overall trip
    await handleSaveSearchHistory(
      multiCityLegs[0].origin,
      multiCityLegs[multiCityLegs.length - 1].destination,
      multiCityLegs[0].date,
      allResults.length
    );
  } catch (error) {
    setError("Failed to search multi-city flights");
  } finally {
    setLoading(false);
  }
}
```
*Figure 6.74: Multi-City Search Execution Logic*

For example, Figure 6.74 shows multi-city search that validates all legs have complete origin, destination, and date information, executes searches sequentially for each leg to find available flights, aggregates results from all legs into a unified result set, records search history using first origin and last destination, and handles errors gracefully with rollback on partial failures. This sequential processing ensures users receive comprehensive flight options for their entire multi-city journey.

---

## 6.7.4 Connection Risk Assessment

Connection risk assessment analyzes layover times at connecting airports to determine whether passengers have sufficient time to make their connections, accounting for airport size and complexity.

### Connection Time Calculation

The system calculates layover duration between consecutive flight legs.

```typescript
function calculateConnectionTime(
  arrivalTime: string,
  departureTime: string
): number {
  const arrival = parseISO(arrivalTime);
  const departure = parseISO(departureTime);
  const diffMs = departure.getTime() - arrival.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  return diffMinutes;
}

function ConnectionTimeDisplay({ 
  arrival, 
  departure 
}: ConnectionTimeDisplayProps) {
  const layoverMinutes = calculateConnectionTime(arrival, departure);
  const hours = Math.floor(layoverMinutes / 60);
  const minutes = layoverMinutes % 60;

  return (
    <div className="connection-time">
      <div className="icon">⏱️</div>
      <div className="duration">
        Layover: {hours}h {minutes}m
      </div>
      <RiskIndicator minutes={layoverMinutes} />
    </div>
  );
}
```
*Figure 6.75: Connection Time Calculation and Display*

Therefore, connection time calculation computes millisecond difference between arrival and departure times, converts milliseconds to minutes for user-friendly display, formats layover as hours and minutes (e.g., "2h 30m"), and displays risk indicators based on layover adequacy. This calculation helps users understand whether they have comfortable, tight, or insufficient connection times.

### Risk Level Determination

Connection risk is categorized based on layover duration and airport complexity factors.

```typescript
function analyzeConnectionRisk(
  layoverMinutes: number,
  airportCode: string
): { risk: 'LOW' | 'MEDIUM' | 'HIGH'; value: number } {
  const complexAirports = ['JFK', 'LAX', 'LHR', 'CDG', 'DXB', 'HKG'];
  const isComplex = complexAirports.includes(airportCode);
  
  const minimumSafe = isComplex ? 90 : 60; // minutes
  const minimumRequired = isComplex ? 60 : 45; // minutes

  if (layoverMinutes >= minimumSafe) {
    return { 
      risk: 'LOW', 
      value: Math.min((layoverMinutes / minimumSafe) * 10, 10)
    };
  } else if (layoverMinutes >= minimumRequired) {
    return { 
      risk: 'MEDIUM', 
      value: 50 + ((layoverMinutes - minimumRequired) / (minimumSafe - minimumRequired)) * 40
    };
  } else {
    return { 
      risk: 'HIGH', 
      value: Math.max((layoverMinutes / minimumRequired) * 50, 0)
    };
  }
}
```
*Figure 6.76: Connection Risk Assessment Algorithm*

For example, Figure 6.76 demonstrates risk assessment that identifies complex airports requiring longer connection times (JFK, LHR, etc.), sets minimum safe connection times (90 minutes for complex, 60 minutes for standard), categorizes connections as LOW risk when layover exceeds safe minimum, MEDIUM risk when layover is adequate but tight, and HIGH risk when layover is below minimum required time. This intelligent assessment accounts for real-world airport navigation challenges.

### Connection Risk Visualization

Risk levels are displayed with color-coded indicators and explanatory text.

```typescript
function ConnectionRiskIndicator({ 
  risk, 
  value 
}: ConnectionRiskIndicatorProps) {
  const riskConfig = {
    LOW: {
      color: 'green',
      label: 'Low Risk',
      description: 'Comfortable connection time'
    },
    MEDIUM: {
      color: 'yellow',
      label: 'Medium Risk',
      description: 'Tight connection, move quickly'
    },
    HIGH: {
      color: 'red',
      label: 'High Risk',
      description: 'Insufficient time, high miss risk'
    }
  };

  const config = riskConfig[risk];

  return (
    <div className="risk-indicator">
      <div className={`badge ${config.color}`}>
        {config.label}
      </div>
      <div className="risk-value">{value.toFixed(0)}% confidence</div>
      <div className="description">{config.description}</div>
    </div>
  );
}
```
*Figure 6.77: Connection Risk Visual Indicator*

Therefore, risk visualization uses color coding (green, yellow, red) for immediate recognition, displays risk label (Low, Medium, High) in text, shows confidence percentage indicating connection reliability, and provides explanatory description advising user actions. This multi-layered presentation ensures users of all experience levels understand connection risk implications.

---

## 6.7.5 Itinerary Comparison

Itinerary comparison enables users to view multiple flight options side-by-side, facilitating informed decision-making by highlighting differences in price, reliability, duration, and connections.

### Comparison Selection

Users can select multiple itineraries from search results for comparison.

```typescript
function ItineraryCard({ 
  itinerary, 
  onSelect, 
  onCompare, 
  isSelected 
}: ItineraryCardProps) {
  return (
    <div className="itinerary-card">
      <input 
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onCompare(itinerary, e.target.checked)}
        className="compare-checkbox"
      />
      {/* Itinerary details */}
      <button onClick={() => onSelect(itinerary)}>
        View Details
      </button>
    </div>
  );
}

function SearchResults({ itineraries }: SearchResultsProps) {
  const [compareList, setCompareList] = useState<Itinerary[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleCompare = (itinerary: Itinerary, selected: boolean) => {
    if (selected) {
      if (compareList.length >= 3) {
        setError("Maximum 3 itineraries for comparison");
        return;
      }
      setCompareList([...compareList, itinerary]);
    } else {
      setCompareList(compareList.filter(it => it.id !== itinerary.id));
    }
  };

  return (
    <div>
      {/* Itinerary cards with compare checkboxes */}
      {compareList.length >= 2 && (
        <button onClick={() => setShowComparison(true)}>
          Compare Selected ({compareList.length})
        </button>
      )}
      {showComparison && (
        <ComparisonModal 
          itineraries={compareList}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
```
*Figure 6.78: Itinerary Comparison Selection Interface*

For example, Figure 6.78 shows comparison selection that adds checkboxes to each itinerary card for selection, limits comparison to maximum of 3 itineraries for manageable display, enables comparison button once at least 2 itineraries are selected, maintains selected itineraries in state for comparison view, and opens dedicated comparison modal when user clicks compare. This selection mechanism allows flexible comparison while preventing overwhelming displays.

### Side-by-Side Comparison View

The comparison modal displays selected itineraries in columns for easy contrast.

```typescript
function ComparisonModal({ 
  itineraries, 
  onClose 
}: ComparisonModalProps) {
  return (
    <div className="comparison-modal">
      <h2>Compare Itineraries</h2>
      <div className="comparison-grid">
        {/* Header row */}
        <div className="comparison-row header">
          <div className="label"></div>
          {itineraries.map(it => (
            <div key={it.id} className="itinerary-header">
              Option {itineraries.indexOf(it) + 1}
            </div>
          ))}
        </div>

        {/* Price row */}
        <ComparisonRow 
          label="Price"
          values={itineraries.map(it => `RM${it.price}`)}
          highlight={getBestPriceIndex(itineraries)}
        />

        {/* Reliability row */}
        <ComparisonRow 
          label="Reliability"
          values={itineraries.map(it => `${it.reliabilityScore.toFixed(1)}/10`)}
          highlight={getBestReliabilityIndex(itineraries)}
        />

        {/* Duration row */}
        <ComparisonRow 
          label="Duration"
          values={itineraries.map(it => it.totalDuration)}
          highlight={getShortestDurationIndex(itineraries)}
        />

        {/* Connections row */}
        <ComparisonRow 
          label="Connections"
          values={itineraries.map(it => `${it.legs.length - 1} stops`)}
          highlight={getFewestStopsIndex(itineraries)}
        />

        {/* Connection Risk row */}
        <ComparisonRow 
          label="Connection Risk"
          values={itineraries.map(it => it.connectionRisk)}
        />
      </div>
      <button onClick={onClose}>Close Comparison</button>
    </div>
  );
}
```
*Figure 6.79: Side-by-Side Itinerary Comparison View*

Therefore, comparison view organizes itineraries in columns for easy scanning, displays key metrics in rows (price, reliability, duration, connections, risk), highlights the best value in each category to guide decision-making, maintains consistent formatting for direct comparison, and enables easy modal dismissal to return to search results. This structured presentation facilitates quick identification of the optimal flight option based on user priorities.

---

## 6.7.6 Email Sharing

Email sharing functionality allows users to send flight itinerary details to themselves or others for reference, collaboration, or booking assistance.

### Share via Email

Users can generate pre-formatted emails containing complete flight information.

```typescript
function handleShareEmail(itinerary: Itinerary) {
  const firstLeg = itinerary.legs[0];
  const lastLeg = itinerary.legs[itinerary.legs.length - 1];

  const subject = encodeURIComponent(
    `Flight Itinerary: ${firstLeg.departure.airport} to ${lastLeg.arrival.airport}`
  );

  let bodyText = `I found this flight on Smart Flight:\n\n`;
  bodyText += `Route: ${firstLeg.departure.airport} to ${lastLeg.arrival.airport}\n`;
  bodyText += `Date: ${format(parseISO(firstLeg.departure.scheduled), 'PPP')}\n`;
  bodyText += `Reliability Score: ${itinerary.reliabilityScore.toFixed(1)}/10\n`;
  bodyText += `Status: ${itinerary.status}\n`;
  bodyText += `Price: RM${itinerary.price}\n\n`;
  
  bodyText += `Flight Details:\n`;
  itinerary.legs.forEach((leg, index) => {
    bodyText += `\n${index + 1}. ${leg.airline} ${leg.flightNumber}\n`;
    bodyText += `   Departs: ${leg.departure.airport} at ${format(parseISO(leg.departure.scheduled), 'HH:mm')}\n`;
    bodyText += `   Arrives: ${leg.arrival.airport} at ${format(parseISO(leg.arrival.scheduled), 'HH:mm')}\n`;
  });

  bodyText += `\n\nView more details on Smart Flight.`;

  const mailtoLink = `mailto:?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  window.location.href = mailtoLink;
}
```
*Figure 6.80: Email Sharing Implementation*

For example, Figure 6.80 demonstrates email sharing that constructs descriptive subject line with route information, formats comprehensive flight details including all legs and times, includes reliability metrics and pricing information, encodes content properly for mailto: protocol, and opens default email client with pre-populated message. This functionality enables easy sharing with travel companions, family members, or travel agents for booking assistance.

---

## Summary

The intermediate-level functionalities of Smart Flight enhance the basic features with sophisticated analysis and management tools. Detailed itinerary views provide comprehensive flight information including leg breakdowns, reliability factor analysis, and connection time visualization. Price alert management enables automated price monitoring with user-defined thresholds and real-time Firestore synchronization. Multi-city trip planning supports complex itineraries with multiple destinations and independent leg configuration. Connection risk assessment analyzes layover adequacy accounting for airport complexity, categorizing connections as low, medium, or high risk. Itinerary comparison facilitates side-by-side evaluation of multiple flight options with highlighted best values in each category. Email sharing enables easy distribution of flight details through pre-formatted messages.

These intermediate features build upon the basic functionality to provide power users with advanced tools for comprehensive flight analysis and decision-making. The implementation maintains ease of use while delivering sophisticated insights, ensuring that users can leverage these features without technical expertise. Real-time data synchronization through Firebase ensures consistency across devices and sessions, while intelligent algorithms provide actionable insights for optimal flight selection.
