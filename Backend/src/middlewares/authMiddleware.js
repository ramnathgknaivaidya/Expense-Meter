import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header
  if ( 
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If no token, reject the request
  if (!token) {
    return res.status(401).json({
      error: 'Not authorized, no token provided',
    });
  }

  try {
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user from the decoded ID (exclude the password field)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        error: 'Not authorized, user not found',
      });
    }

    // 5. Attach the user object to the request
    req.user = user;

    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    return res.status(401).json({
      error: 'Not authorized, invalid token',
    });
  }
};