import express from 'express';
import { 
  getAnalytics, 
  getAircraftStats, 
  getAirlineStats, 
  getAirportStats 
} from '../controllers/statsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all statistics routes
router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/aircraft', getAircraftStats);
router.get('/airlines', getAirlineStats);
router.get('/airports', getAirportStats);

export default router;
