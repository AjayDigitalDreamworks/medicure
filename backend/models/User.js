const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: "patient" },

  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // 👇 Only used if role === 'doctor'
  department: { type: String },
  qualification: { type: String },
  specialization: { type: String },
  experience: { type: String }, // You can also use Number (e.g., in years)
  bio: { type: String }, // Optional: short description
  availableDays: [String], // Optional: ["Mon", "Wed", "Fri"]
  availableTimeSlots: [String], // Optional: ["10:00 AM", "12:00 PM"]
});

module.exports = mongoose.model("User", UserSchema);
