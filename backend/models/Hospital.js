import mongoose from 'mongoose';


const HospitalSchema = new mongoose.Schema({
name: { type: String, required: true, index: true },
address: String,
city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true, index: true },
contactNo: String,
registrationNo: { type: String, index: true },
}, { timestamps: true });


export const Hospital = mongoose.model('Hospital', HospitalSchema);