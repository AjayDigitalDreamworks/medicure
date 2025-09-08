import mongoose from 'mongoose';


const CitySchema = new mongoose.Schema({
name: { type: String, required: true, index: true },
state: String,
country: { type: String, default: 'India' },
}, { timestamps: true });


export const City = mongoose.model('City', CitySchema);