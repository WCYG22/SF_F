// Route-aware price ranges for realistic pricing
function getPriceRange(originCode, destCode) {
  const routePrices = {
    "KUL_SIN": { min: 120, max: 350 },
    "SIN_KUL": { min: 120, max: 350 },
    "KUL_PEN": { min: 100, max: 280 },
    "PEN_KUL": { min: 100, max: 280 },
    "KUL_BKK": { min: 400, max: 950 },
    "BKK_KUL": { min: 400, max: 950 },
    "KUL_HAN": { min: 280, max: 650 },
    "HAN_KUL": { min: 280, max: 650 },
    "KUL_HKG": { min: 350, max: 800 },
    "HKG_KUL": { min: 350, max: 800 },
  };

  const routeKey = `${originCode}_${destCode}`;
  const reverseKey = `${destCode}_${originCode}`;

  if (routePrices[routeKey]) {
    return routePrices[routeKey];
  } else if (routePrices[reverseKey]) {
    return routePrices[reverseKey];
  } else {
    return { min: 400, max: 1200 };
  }
}

function generateSimulatedSearch(query, departureDate) {
  let baseDateObj = new Date();
  if (departureDate) {
    baseDateObj = new Date(departureDate);
  } else {
    baseDateObj.setDate(baseDateObj.getDate() + 1);
  }
  
  let originCode = "KUL";
  let originCity = "Kuala Lumpur";
  let destCode = "SIN";
  let destCity = "Singapore";

  const match = query.match(/(.+?)\s+to\s+(.+?)(?:\s+on|\s*$)/i);
  if (match) {
    const rawOrigin = match[1].trim().toUpperCase();
    const rawDest = match[2].trim().toUpperCase();

    const airportMap = {
      "KUL": { code: "KUL", city: "Kuala Lumpur" },
      "KUALA LUMPUR": { code: "KUL", city: "Kuala Lumpur" },
      "SIN": { code: "SIN", city: "Singapore" },
      "SINGAPORE": { code: "SIN", city: "Singapore" },
      "PEN": { code: "PEN", city: "Penang" },
      "PENANG": { code: "PEN", city: "Penang" },
      "HAN": { code: "HAN", city: "Hanoi" },
      "HANOI": { code: "HAN", city: "Hanoi" },
      "BKK": { code: "BKK", city: "Bangkok" },
      "BANGKOK": { code: "BKK", city: "Bangkok" },
      "HKG": { code: "HKG", city: "Hong Kong" },
      "HONG KONG": { code: "HKG", city: "Hong Kong" },
    };

    if (airportMap[rawOrigin]) {
      originCode = airportMap[rawOrigin].code;
      originCity = airportMap[rawOrigin].city;
    } else if (rawOrigin.length <= 4) {
      originCode = rawOrigin;
      originCity = rawOrigin;
    } else {
      originCode = rawOrigin.substring(0, 3);
      originCity = rawOrigin;
    }

    if (airportMap[rawDest]) {
      destCode = airportMap[rawDest].code;
      destCity = airportMap[rawDest].city;
    } else if (rawDest.length <= 4) {
      destCode = rawDest;
      destCity = rawDest;
    } else {
      destCode = rawDest.substring(0, 3);
      destCity = rawDest;
    }
  }

  const airlines = [
    { name: "Malaysia Airlines", code: "MH" },
    { name: "AirAsia", code: "AK" },
    { name: "Singapore Airlines", code: "SQ" },
    { name: "Batik Air", code: "OD" },
  ];

  const now = baseDateObj;
  const randomOffset = Math.random();

  const priceRange = getPriceRange(originCode, destCode);

  const options = [];

  // Option 1: Premium Direct
  const price1 = Math.round(priceRange.max * 0.95 + Math.random() * (priceRange.max * 0.05));
  const airline1 = airlines[Math.floor(Math.random() * airlines.length)];
  options.push({
    id: `opt-${randomOffset}-1`,
    totalDuration: "1h 15m",
    reliabilityScore: 8.8 + Math.random() * 1.2,
    connectionRisk: "LOW",
    connectionRiskValue: 2 + Math.random() * 3,
    status: "RELIABLE",
    price: price1,
    legs: [{
      id: `leg-${randomOffset}-1a`,
      flightNumber: `${airline1.code}${Math.floor(100 + Math.random() * 800)}`,
      airline: airline1.name,
      departure: {
        airport: originCode,
        city: originCity,
        scheduled: new Date(now.getTime() + (7 + Math.floor(Math.random() * 8)) * 3600 * 1000).toISOString()
      },
      arrival: {
        airport: destCode,
        city: destCity,
        scheduled: new Date(now.getTime() + (8 + Math.floor(Math.random() * 8)) * 3600 * 1000 + 15 * 60 * 1000).toISOString()
      },
      disruptionProbability: 0.03 + Math.random() * 0.05
    }]
  });

  // Option 2: Budget Low Price
  const price2 = Math.round(priceRange.min + Math.random() * (priceRange.min * 0.3));
  const airline2 = airlines[Math.floor(Math.random() * airlines.length)];
  options.push({
    id: `opt-${randomOffset}-2`,
    totalDuration: "1h 05m",
    reliabilityScore: 6.5 + Math.random() * 1.5,
    connectionRisk: "LOW",
    connectionRiskValue: 4 + Math.random() * 6,
    status: "RELIABLE",
    price: price2,
    legs: [{
      id: `leg-${randomOffset}-2a`,
      flightNumber: `${airline2.code}${Math.floor(100 + Math.random() * 800)}`,
      airline: airline2.name,
      departure: {
        airport: originCode,
        city: originCity,
        scheduled: new Date(now.getTime() + (5 + Math.floor(Math.random() * 12)) * 3600 * 1000).toISOString()
      },
      arrival: {
        airport: destCode,
        city: destCity,
        scheduled: new Date(now.getTime() + (6 + Math.floor(Math.random() * 12)) * 3600 * 1000 + 5 * 60 * 1000).toISOString()
      },
      disruptionProbability: 0.08 + Math.random() * 0.12
    }]
  });

  // Option 3: Mid-tier with Connection
  const price3 = Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.5 + Math.random() * (priceRange.max - priceRange.min) * 0.2);
  const airline3a = airlines[Math.floor(Math.random() * airlines.length)];
  const airline3b = airlines[Math.floor(Math.random() * airlines.length)];
  const reliabilityScore3 = 5.5 + Math.random() * 3;
  options.push({
    id: `opt-${randomOffset}-3`,
    totalDuration: "3h 30m",
    reliabilityScore: reliabilityScore3,
    connectionRisk: "MEDIUM",
    connectionRiskValue: 35 + Math.random() * 30,
    status: reliabilityScore3 > 7 ? "RELIABLE" : reliabilityScore3 > 6 ? "CAUTION" : "HIGH RISK",
    price: price3,
    legs: [
      {
        id: `leg-${randomOffset}-3a`,
        flightNumber: `${airline3a.code}${Math.floor(100 + Math.random() * 800)}`,
        airline: airline3a.name,
        departure: {
          airport: originCode,
          city: originCity,
          scheduled: new Date(now.getTime() + (6 + Math.floor(Math.random() * 10)) * 3600 * 1000).toISOString()
        },
        arrival: {
          airport: "CONN_HUB",
          city: "Connection Hub",
          scheduled: new Date(now.getTime() + (7 + Math.floor(Math.random() * 10)) * 3600 * 1000).toISOString()
        },
        disruptionProbability: 0.1 + Math.random() * 0.15
      },
      {
        id: `leg-${randomOffset}-3b`,
        flightNumber: `${airline3b.code}${Math.floor(100 + Math.random() * 800)}`,
        airline: airline3b.name,
        departure: {
          airport: "CONN_HUB",
          city: "Connection Hub",
          scheduled: new Date(now.getTime() + (7 + Math.floor(Math.random() * 10)) * 3600 * 1000 + 45 * 60 * 1000).toISOString()
        },
        arrival: {
          airport: destCode,
          city: destCity,
          scheduled: new Date(now.getTime() + (8 + Math.floor(Math.random() * 10)) * 3600 * 1000 + 30 * 60 * 1000).toISOString()
        },
        disruptionProbability: 0.12 + Math.random() * 0.18
      }
    ]
  });

  // Option 4: Different timing option
  const price4 = Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.6 + Math.random() * (priceRange.max - priceRange.min) * 0.15);
  const airline4 = airlines[Math.floor(Math.random() * airlines.length)];
  const reliabilityScore4 = 6 + Math.random() * 3.5;
  options.push({
    id: `opt-${randomOffset}-4`,
    totalDuration: "1h 20m",
    reliabilityScore: reliabilityScore4,
    connectionRisk: "LOW",
    connectionRiskValue: 3 + Math.random() * 5,
    status: reliabilityScore4 > 7.5 ? "RELIABLE" : reliabilityScore4 > 6.5 ? "CAUTION" : "HIGH RISK",
    price: price4,
    legs: [{
      id: `leg-${randomOffset}-4a`,
      flightNumber: `${airline4.code}${Math.floor(100 + Math.random() * 800)}`,
      airline: airline4.name,
      departure: {
        airport: originCode,
        city: originCity,
        scheduled: new Date(now.getTime() + (14 + Math.floor(Math.random() * 8)) * 3600 * 1000).toISOString()
      },
      arrival: {
        airport: destCode,
        city: destCity,
        scheduled: new Date(now.getTime() + (15 + Math.floor(Math.random() * 8)) * 3600 * 1000 + 20 * 60 * 1000).toISOString()
      },
      disruptionProbability: 0.05 + Math.random() * 0.15
    }]
  });

  // Option 5: Express/Alternative
  const price5 = Math.round(priceRange.max * 0.8 + Math.random() * (priceRange.max * 0.2));
  const airline5 = airlines[Math.floor(Math.random() * airlines.length)];
  options.push({
    id: `opt-${randomOffset}-5`,
    totalDuration: "1h 00m",
    reliabilityScore: 9.0 + Math.random() * 1,
    connectionRisk: "LOW",
    connectionRiskValue: 1 + Math.random() * 2,
    status: "RELIABLE",
    price: price5,
    legs: [{
      id: `leg-${randomOffset}-5a`,
      flightNumber: `${airline5.code}${Math.floor(100 + Math.random() * 800)}`,
      airline: airline5.name,
      departure: {
        airport: originCode,
        city: originCity,
        scheduled: new Date(now.getTime() + (9 + Math.floor(Math.random() * 6)) * 3600 * 1000).toISOString()
      },
      arrival: {
        airport: destCode,
        city: destCity,
        scheduled: new Date(now.getTime() + (10 + Math.floor(Math.random() * 6)) * 3600 * 1000).toISOString()
      },
      disruptionProbability: 0.02 + Math.random() * 0.03
    }]
  });

  return options;
}

export default (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, departureDate } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = generateSimulatedSearch(query, departureDate);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to search flights' });
  }
};
