import mongoose from 'mongoose';

const DoctorAvailabilitySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  startTime: { type: String, required: true }, // e.g. "10:00"
  endTime: { type: String, required: true },   // e.g. "14:00"
  slotDuration: { type: Number, default: 30 }, // in minutes
});

export const DoctorAvailability = mongoose.model('DoctorAvailability', DoctorAvailabilitySchema);
