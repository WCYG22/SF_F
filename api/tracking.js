function generateVariedSimulatedTrack(flightNumber) {
  const cleanNum = (flightNumber || 'MH123').trim().toUpperCase();
  
  const airlineMap = {
    'MH': 'Malaysia Airlines',
    'AK': 'AirAsia',
    'SQ': 'Singapore Airlines',
    'OD': 'Batik Air',
    'FY': 'Firefly',
    'HO': 'Juneyao Airlines',
    'TG': 'Thai Airways',
    'VN': 'Vietnam Airlines',
  };
  
  const code = cleanNum.substring(0, 2).toUpperCase();
  const airline = airlineMap[code] || 'International Airlines';

  const routes = [
    { from: 'KUL', fromCity: 'Kuala Lumpur', to: 'SIN', toCity: 'Singapore', duration: 70 },
    { from: 'KUL', fromCity: 'Kuala Lumpur', to: 'BKK', toCity: 'Bangkok', duration: 150 },
    { from: 'KUL', fromCity: 'Kuala Lumpur', to: 'HAN', toCity: 'Hanoi', duration: 180 },
    { from: 'SIN', fromCity: 'Singapore', to: 'KUL', toCity: 'Kuala Lumpur', duration: 70 },
    { from: 'SIN', fromCity: 'Singapore', to: 'HKG', toCity: 'Hong Kong', duration: 210 },
    { from: 'BKK', fromCity: 'Bangkok', to: 'KUL', toCity: 'Kuala Lumpur', duration: 150 },
    { from: 'HAN', fromCity: 'Hanoi', to: 'KUL', toCity: 'Kuala Lumpur', duration: 180 },
    { from: 'HKG', fromCity: 'Hong Kong', to: 'SIN', toCity: 'Singapore', duration: 210 },
  ];
  
  const route = routes[Math.floor(Math.random() * routes.length)];
  
  const statuses = ['IN AIR', 'IN AIR', 'IN AIR', 'SCHEDULED', 'LANDED'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  let altitude, speed, progress;
  if (status === 'IN AIR') {
    altitude = 15000 + Math.floor(Math.random() * 28000);
    speed = 400 + Math.floor(Math.random() * 500);
    progress = 10 + Math.floor(Math.random() * 70);
  } else if (status === 'SCHEDULED') {
    altitude = 0;
    speed = 0;
    progress = 0;
  } else if (status === 'DELAYED') {
    altitude = 0;
    speed = 0;
    progress = 0;
  } else {
    altitude = 0;
    speed = 0;
    progress = 100;
  }

  const now = new Date();
  const departTime = new Date(now.getTime() - Math.random() * 180 * 60000);
  const arrivalTime = new Date(departTime.getTime() + route.duration * 60000);

  const aircraftModels = [
    'Boeing 737-800', 'Airbus A320', 'Boeing 777-300', 'Airbus A350', 
    'Embraer E190', 'Boeing 787-9', 'Airbus A380', 'ATR 72-600'
  ];
  
  const terminals = ['M', '1', '2', '3', 'A', 'B', 'C', '4'];
  const gates = ['C12', 'B5', 'A22', 'F40', 'D8', 'E15', 'G3', 'H18'];

  return {
    flightNumber: cleanNum,
    airline: airline,
    origin: {
      airport: route.from,
      city: route.fromCity,
      time: departTime.toISOString(),
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      gate: gates[Math.floor(Math.random() * gates.length)]
    },
    destination: {
      airport: route.to,
      city: route.toCity,
      time: arrivalTime.toISOString(),
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      gate: gates[Math.floor(Math.random() * gates.length)]
    },
    status: status,
    progress: progress,
    altitude: altitude,
    speed: speed,
    aircraft: {
      model: aircraftModels[Math.floor(Math.random() * aircraftModels.length)],
      age: (1 + Math.floor(Math.random() * 15)) + ' years',
      registration: cleanNum
    },
    estimatedArrival: arrivalTime.toISOString()
  };
}

export default (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { flightNumber } = req.body;

    if (!flightNumber) {
      return res.status(400).json({ error: 'Flight number is required' });
    }

    const trackingData = generateVariedSimulatedTrack(flightNumber);
    return res.status(200).json(trackingData);
  } catch (error) {
    console.error('Tracking error:', error);
    return res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
};
