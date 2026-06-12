// Mock Data for FlightWatch

export const MOCK_USERS = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Talha Mirza",
    email: "talha@example.com",
    avatar: null,
    joinedAt: "2026-01-15T08:00:00Z"
  }
];

export const INITIAL_SIGHTINGS = [
  {
    id: "e74f0eb5-fb16-4f72-9e98-111111111111",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "A6-EQB",
    airline: "Emirates",
    aircraft_type: "Boeing 777-300ER",
    airport: "DXB",
    notes: "Observed during climb out. Beautiful clear skies.",
    sighting_date: "2026-06-11T14:30:00Z"
  },
  {
    id: "e74f0eb5-fb16-4f72-9e98-222222222222",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "N789UA",
    airline: "United Airlines",
    aircraft_type: "Boeing 787-9 Dreamliner",
    airport: "JFK",
    notes: "Spotted touching down on Runway 22L. Heavy smoke on main gear contact.",
    sighting_date: "2026-06-10T10:15:00Z"
  },
  {
    id: "e74f0eb5-fb16-4f72-9e98-333333333333",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "G-XWBA",
    airline: "British Airways",
    aircraft_type: "Airbus A355-1000",
    airport: "LHR",
    notes: "Parked at Terminal 5 gates during transit.",
    sighting_date: "2026-06-08T18:45:00Z"
  },
  {
    id: "e74f0eb5-fb16-4f72-9e98-444444444444",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "VH-VOW",
    airline: "Jetstar",
    aircraft_type: "Airbus A320-200",
    airport: "SYD",
    notes: "Domestic flight arrival, taxiing to Terminal 2.",
    sighting_date: "2026-06-05T06:20:00Z"
  },
  {
    id: "e74f0eb5-fb16-4f72-9e98-555555555555",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "9V-SMC",
    airline: "Singapore Airlines",
    aircraft_type: "Airbus A350-900",
    airport: "SIN",
    notes: "Evening departure heading towards Europe.",
    sighting_date: "2026-06-03T21:10:00Z"
  },
  {
    id: "e74f0eb5-fb16-4f72-9e98-666666666666",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "D-AIMA",
    airline: "Lufthansa",
    aircraft_type: "Airbus A380-800",
    airport: "FRA",
    notes: "Spotted this giant flying overhead at cruising altitude.",
    sighting_date: "2026-05-30T13:40:00Z"
  },
  {
    id: "e74f0eb5-fb16-4f72-9e98-777777777777",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "JA824A",
    airline: "All Nippon Airways",
    aircraft_type: "Boeing 787-8",
    airport: "HND",
    notes: "Parked on the ramp at Haneda. Pristine livery.",
    sighting_date: "2026-05-28T04:55:00Z"
  },
  {
    id: "e74f0eb5-fb16-4f72-9e98-888888888888",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    registration: "A7-BOC",
    airline: "Qatar Airways",
    aircraft_type: "Boeing 777-300ER",
    airport: "DOH",
    notes: "Spotted during golden hour landing.",
    sighting_date: "2026-05-25T17:15:00Z"
  }
];

export const SUGGESTED_AIRLINES = [
  "Emirates",
  "United Airlines",
  "British Airways",
  "Jetstar",
  "Singapore Airlines",
  "Lufthansa",
  "All Nippon Airways",
  "Qatar Airways",
  "Delta Air Lines",
  "Air France",
  "Cathay Pacific",
  "Qantas"
];

export const SUGGESTED_AIRCRAFT = [
  "Airbus A320-200",
  "Airbus A321neo",
  "Airbus A330-300",
  "Airbus A350-900",
  "Airbus A350-1000",
  "Airbus A380-800",
  "Boeing 737-800",
  "Boeing 737 MAX 8",
  "Boeing 777-300ER",
  "Boeing 787-9 Dreamliner",
  "Boeing 787-10 Dreamliner",
  "Boeing 747-8 Intercontinental"
];

export const SUGGESTED_AIRPORTS = [
  "DXB", "JFK", "LHR", "SYD", "SIN", "FRA", "HND", "DOH", "LAX", "CDG", "AMS", "ORD"
];
