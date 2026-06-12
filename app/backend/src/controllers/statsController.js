import { query } from '../config/db.js';

// @desc    Get dashboard analytics counts
// @route   GET /api/v1/analytics
// @access  Private
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch counts summary
    const countsQuery = `
      SELECT 
        COUNT(*)::integer as total,
        COUNT(DISTINCT registration)::integer as aircraft,
        COUNT(DISTINCT airline)::integer as airlines,
        COUNT(DISTINCT airport)::integer as airports
      FROM sightings 
      WHERE user_id = $1
    `;
    const countsRes = await query(countsQuery, [userId]);
    const { total, aircraft, airlines, airports } = countsRes.rows[0];

    // Fetch most frequent airline
    const airlineQuery = `
      SELECT airline, COUNT(*)::integer as count 
      FROM sightings 
      WHERE user_id = $1 
      GROUP BY airline 
      ORDER BY count DESC, airline ASC 
      LIMIT 1
    `;
    const airlineRes = await query(airlineQuery, [userId]);
    const mostFrequentAirline = airlineRes.rows.length > 0 ? airlineRes.rows[0].airline : 'None';

    // Fetch most frequent aircraft type
    const typeQuery = `
      SELECT aircraft_type, COUNT(*)::integer as count 
      FROM sightings 
      WHERE user_id = $1 
      GROUP BY aircraft_type 
      ORDER BY count DESC, aircraft_type ASC 
      LIMIT 1
    `;
    const typeRes = await query(typeQuery, [userId]);
    const mostFrequentType = typeRes.rows.length > 0 ? typeRes.rows[0].aircraft_type : 'None';

    res.json({
      success: true,
      analytics: {
        totalSightings: total,
        uniqueAircraft: aircraft,
        uniqueAirlines: airlines,
        airportsVisited: airports,
        mostFrequentAirline,
        mostFrequentType
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aircraft stats aggregated from sightings
// @route   GET /api/v1/aircraft
// @access  Private
export const getAircraftStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const statsQuery = `
      SELECT 
        aircraft_type as name, 
        COUNT(*)::integer as count,
        MAX(sighting_date) as last_seen
      FROM sightings 
      WHERE user_id = $1 
      GROUP BY aircraft_type 
      ORDER BY count DESC, aircraft_type ASC
    `;
    const result = await query(statsQuery, [userId]);
    res.json({
      success: true,
      aircraft: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get airline stats aggregated from sightings
// @route   GET /api/v1/airlines
// @access  Private
export const getAirlineStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const statsQuery = `
      SELECT 
        airline as name, 
        COUNT(*)::integer as count,
        MAX(sighting_date) as last_seen
      FROM sightings 
      WHERE user_id = $1 
      GROUP BY airline 
      ORDER BY count DESC, airline ASC
    `;
    const result = await query(statsQuery, [userId]);
    res.json({
      success: true,
      airlines: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get airport stats aggregated from sightings
// @route   GET /api/v1/airports
// @access  Private
export const getAirportStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const statsQuery = `
      SELECT 
        airport as name, 
        COUNT(*)::integer as count,
        MAX(sighting_date) as last_seen
      FROM sightings 
      WHERE user_id = $1 
      GROUP BY airport 
      ORDER BY count DESC, airport ASC
    `;
    const result = await query(statsQuery, [userId]);
    res.json({
      success: true,
      airports: result.rows
    });
  } catch (error) {
    next(error);
  }
};
