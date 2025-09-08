import mongoose from 'mongoose';

const bedSchema = new mongoose.Schema({
  bedId: String,
  ward: String,
  floor: String,
  room: String,
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available'
  },
  patient: {
    name: String,
    id: String
  },
  doctor: String,
  condition: String,
  admitDate: Date,
  dischargeDate: Date
});

const Bed = mongoose.model('Bed', bedSchema);
export default Bed;
