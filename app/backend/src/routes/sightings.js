import express from 'express';
import { 
  getSightings, 
  getSightingById, 
  createSighting, 
  updateSighting, 
  deleteSighting 
} from '../controllers/sightingsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all sightings routes
router.use(protect);

router.route('/')
  .get(getSightings)
  .post(createSighting);

router.route('/:id')
  .get(getSightingById)
  .put(updateSighting)
  .delete(deleteSighting);

export default router;
