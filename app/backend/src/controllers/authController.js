import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { config } from '../config/env.js';

// Generate JWT Helper
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, config.jwtSecret, {
    expiresIn: '30d'
  });
};

// @desc    Register a new operator
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields (name, email, password)' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const checkUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email address is already registered' });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save operator
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), normalizedEmail, passwordHash]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser.id, newUser.email);

    res.status(214 || 201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        joinedAt: newUser.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate operator & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find operator
    const result = await query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);

    console.log('Login attempt:', normalizedEmail);

    if (result.rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    console.log('User found:', user.email);
    console.log('Stored hash:', user.password_hash);
    console.log('Password received:', password);

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinedAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get authenticated operator profile
// @route   GET /api/v1/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Operator profile not found' });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinedAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update operator profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a name' });
    }

    const result = await query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, created_at',
      [name.trim(), req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Operator profile not found' });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinedAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};
