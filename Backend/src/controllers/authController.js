import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Please provide name, email, and password',
      });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        error: 'User already exists with this email',
      });
    }

    // 3. Create the user (password will be hashed by the pre-save hook in your User model)
    // If you don't have the pre-save hook, hash it here using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      // Currency will default to 'USD' as defined in the schema
    });

    // 4. Return success response (EXACTLY as requested)
    res.status(201).json({
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password',
      });
    }

    // 2. Find user and explicitly select the password field (since it's hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // 3. Compare the entered password with the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Return response (EXACTLY as requested)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};