-- Seed Data for FlightWatch

-- Insert Demo User
-- Password: password123
-- Bcrypt Hash of password123: $2b$10$wEgh1sQW4jV0B26M/l5y/OnfV.VzK6B1Vp4hXjDqf.u4yK0h9GvPq
INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Demo User',
  'demo@flightwatch.db',
  '$2b$10$wEgh1sQW4jV0B26M/l5y/OnfV.VzK6B1Vp4hXjDqf.u4yK0h9GvPq',
  '2026-01-15T08:00:00Z',
  '2026-01-15T08:00:00Z'
) ON CONFLICT (email) DO NOTHING;

-- Insert Sightings for Demo User
INSERT INTO sightings (id, user_id, registration, airline, aircraft_type, airport, notes, sighting_date, created_at, updated_at)
VALUES 
(
  'e74f0eb5-fb16-4f72-9e98-111111111111',
  '550e8400-e29b-41d4-a716-446655440000',
  'A6-EVG',
  'Emirates',
  'Airbus A380-800',
  'DXB',
  'Spotted taking off from DXB during sunrise. Magnificent view.',
  '2026-06-12T06:00:00Z',
  '2026-06-12T06:00:00Z',
  '2026-06-12T06:00:00Z'
),
(
  'e74f0eb5-fb16-4f72-9e98-222222222222',
  '550e8400-e29b-41d4-a716-446655440000',
  'A7-BOC',
  'Qatar Airways',
  'Boeing 777-300ER',
  'DOH',
  'Spotted taxiing to the gate at Hamad International Airport.',
  '2026-06-11T14:30:00Z',
  '2026-06-11T14:30:00Z',
  '2026-06-11T14:30:00Z'
),
(
  'e74f0eb5-fb16-4f72-9e98-333333333333',
  '550e8400-e29b-41d4-a716-446655440000',
  'D-AIXP',
  'Lufthansa',
  'Airbus A350-900',
  'FRA',
  'Spotted landing on runway 25L at Frankfurt Airport.',
  '2026-06-10T10:15:00Z',
  '2026-06-10T10:15:00Z',
  '2026-06-10T10:15:00Z'
),
(
  'e74f0eb5-fb16-4f72-9e98-444444444444',
  '550e8400-e29b-41d4-a716-446655440000',
  '9V-SMC',
  'Singapore Airlines',
  'Airbus A350-900',
  'SIN',
  'Parked at Changi Terminal 3. Clean livery.',
  '2026-06-08T18:45:00Z',
  '2026-06-08T18:45:00Z',
  '2026-06-08T18:45:00Z'
),
(
  'e74f0eb5-fb16-4f72-9e98-555555555555',
  '550e8400-e29b-41d4-a716-446655440000',
  'JA824A',
  'All Nippon Airways',
  'Boeing 787-8',
  'HND',
  'Spotted taking off from Haneda airport in Tokyo.',
  '2026-06-05T06:20:00Z',
  '2026-06-05T06:20:00Z',
  '2026-06-05T06:20:00Z'
)
ON CONFLICT (id) DO NOTHING;
