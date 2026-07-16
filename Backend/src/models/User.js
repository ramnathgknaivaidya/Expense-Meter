import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Prevents password from being returned in queries by default
    },
    currency: {
      type: String,
      required: [true, 'Preferred currency is required'],
      enum: {
        values: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
        message: '{VALUE} is not a supported currency',
      },
      default: 'INR',
      uppercase: true,
    },
    profileImage: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true; // null/empty is allowed
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i.test(v);
        },
        message: 'Please provide a valid image URL',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Remove the password field from JSON responses by default
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Optional: Add an index for faster email lookups (already indexed due to unique: true)
// userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;