import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// @desc    Perform a system health check and verify DB connectivity
// @route   GET /api/v1/health
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Run simple query to test DB pool connection
    await query('SELECT 1');
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;
