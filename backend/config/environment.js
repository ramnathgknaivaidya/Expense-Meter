const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/expense-meter',
  jwtSecret: process.env.JWT_SECRET || 'expense-meter-jwt-secret-key-2026',
  jwtExpiry: process.env.JWT_EXPIRY || '30d',
  bcryptRounds: 12,
};
