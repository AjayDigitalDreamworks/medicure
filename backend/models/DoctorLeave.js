import mongoose from 'mongoose';

const DoctorLeaveSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  reason: { type: String }
});

export const DoctorLeave = mongoose.model('DoctorLeave', DoctorLeaveSchema);
