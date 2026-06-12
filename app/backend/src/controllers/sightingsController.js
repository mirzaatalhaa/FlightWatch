import { query } from '../config/db.js';

// @desc    Get all sightings for current operator
// @route   GET /api/v1/sightings
// @access  Private
export const getSightings = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM sightings WHERE user_id = $1 ORDER BY sighting_date DESC, created_at DESC',
      [req.user.id]
    );
    res.json({
      success: true,
      count: result.rows.length,
      sightings: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sighting report
// @route   GET /api/v1/sightings/:id
// @access  Private
export const getSightingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM sightings WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sighting record not found or access denied'
      });
    }

    res.json({
      success: true,
      sighting: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a new aircraft sighting
// @route   POST /api/v1/sightings
// @access  Private
export const createSighting = async (req, res, next) => {
  try {
    const { registration, airline, aircraft_type, airport, notes, sighting_date } = req.body;

    if (!registration || !airline || !aircraft_type || !airport) {
      return res.status(400).json({
        success: false,
        message: 'Please provide registration, airline, aircraft_type, and airport'
      });
    }

    const date = sighting_date || new Date().toISOString();

    const result = await query(
      `INSERT INTO sightings (user_id, registration, airline, aircraft_type, airport, notes, sighting_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.id,
        registration.trim().toUpperCase(),
        airline.trim(),
        aircraft_type.trim(),
        airport.trim().toUpperCase(),
        notes ? notes.trim() : '',
        date
      ]
    );

    res.status(201).json({
      success: true,
      sighting: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a sighting report
// @route   PUT /api/v1/sightings/:id
// @access  Private
export const updateSighting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { registration, airline, aircraft_type, airport, notes, sighting_date } = req.body;

    if (!registration || !airline || !aircraft_type || !airport) {
      return res.status(400).json({
        success: false,
        message: 'Please provide registration, airline, aircraft_type, and airport'
      });
    }

    // Verify existence and ownership
    const checkResult = await query(
      'SELECT id FROM sightings WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sighting record not found or access denied'
      });
    }

    const date = sighting_date || new Date().toISOString();

    const result = await query(
      `UPDATE sightings
       SET registration = $1, airline = $2, aircraft_type = $3, airport = $4, notes = $5, sighting_date = $6
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        registration.trim().toUpperCase(),
        airline.trim(),
        aircraft_type.trim(),
        airport.trim().toUpperCase(),
        notes ? notes.trim() : '',
        date,
        id,
        req.user.id
      ]
    );

    res.json({
      success: true,
      sighting: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a sighting report
// @route   DELETE /api/v1/sightings/:id
// @access  Private
export const deleteSighting = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify existence and ownership
    const checkResult = await query(
      'SELECT id FROM sightings WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sighting record not found or access denied'
      });
    }

    await query('DELETE FROM sightings WHERE id = $1 AND user_id = $2', [id, req.user.id]);

    res.json({
      success: true,
      message: 'Sighting record deleted successfully',
      id
    });
  } catch (error) {
    next(error);
  }
};
