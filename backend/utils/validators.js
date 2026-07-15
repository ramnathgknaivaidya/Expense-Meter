const validate = (schema) => (req, res, next) => {
  const errors = [];
  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    for (const rule of rules) {
      const error = rule(value, field);
      if (error) { errors.push(error); break; }
    }
  }
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }
  next();
};

const required = (value, field) => (!value && value !== 0) ? `${field} is required` : null;
const isNumber = (value, field) => (value !== undefined && isNaN(value)) ? `${field} must be a number` : null;
const min = (minVal) => (value, field) => (value !== undefined && Number(value) < minVal) ? `${field} must be at least ${minVal}` : null;
const isEmail = (value, field) => (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? `${field} must be a valid email` : null;
const minLength = (len) => (value, field) => (value && value.length < len) ? `${field} must be at least ${len} characters` : null;
const isIn = (options) => (value, field) => (value && !options.includes(value)) ? `${field} must be one of: ${options.join(', ')}` : null;

module.exports = { validate, required, isNumber, min, isEmail, minLength, isIn };
