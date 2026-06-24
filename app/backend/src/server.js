import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Validate environment variables and database config first
import { config } from './config/env.js';
import { verifyDatabaseSetup } from './config/db.js';

// Import routers
import authRoutes from './routes/auth.js';
import sightingsRoutes from './routes/sightings.js';
import statsRoutes from './routes/stats.js';
import healthRoutes from './routes/health.js';

// Import middlewares
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Enable HTTP headers security via Helmet
app.use(helmet());

// Enable CORS
app.use(cors());

// Enable request logging via Morgan
app.use(morgan('dev'));

// Enable rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.'
  }
});
app.use(limiter);

// Express JSON body parser
app.use(express.json());

// Routes mounting
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sightings', sightingsRoutes);
app.use('/api/v1', statsRoutes);

// Wildcard 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Requested route not found'
  });
});

// Centralized error interceptor
app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  try {
    await verifyDatabaseSetup();
    app.listen(PORT, () => {
      console.log(`✓ Server Running On Port ${PORT}`);
      console.log(`===========================================================`);
    });
  } catch (err) {
    // Database errors are logged directly in verifyDatabaseSetup
    process.exit(1);
  }
};

startServer();
