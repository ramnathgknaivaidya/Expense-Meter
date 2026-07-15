const User = require('../models/User');

const protect = async (req, res, next) => {
  const demoUser = await User.findOne({ email: 'demo@expense.com' });
  if (demoUser) {
    req.user = demoUser;
  }
  next();
};

module.exports = { protect };
