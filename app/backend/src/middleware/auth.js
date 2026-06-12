import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const protect = (req, res, next) => {
  let token;

  // Read header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: No token provided'
    });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Attach user information to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid token'
    });
  }
};
