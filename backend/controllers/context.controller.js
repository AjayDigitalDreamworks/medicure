import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';

// Get list of unique cities
export const getCities = async (req, res) => {
  const cities = await Hospital.distinct('city');
  res.json({ cities });
};

// Get hospitals in a given city
export const getHospitalsByCity = async (req, res) => {
  const { city } = req.params;
  const hospitals = await Hospital.find({ city });
  res.json({ hospitals });
};

// Patient selects a hospital after login
export const selectHospital = async (req, res) => {
  const userId = req.user._id;
  const { hospitalId, city } = req.body;

  await User.findByIdAndUpdate(userId, {
    selectedHospital: hospitalId,
    city
  });

  res.json({ message: 'Hospital selected successfully' });
};


export const selectHospitalRegister = async (req, res) => {
const hospitals = await Hospital.find({}, '_id name'); // sirf _id aur name uthao
  res.json(hospitals);

  // res.json({ message: 'Hospital selected successfully' });
};
