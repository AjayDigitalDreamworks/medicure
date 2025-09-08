// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import { Hospital } from './models/Hospital.js';
// import { City } from './models/City.js'; // Your updated City model

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-app';

// const seed = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('✅ Connected to MongoDB');

//     // Clear existing data
//     await Hospital.deleteMany({});
//     await City.deleteMany({});

//     // Step 1: Insert Cities
//     const cities = await City.insertMany([
//       { name: 'Delhi', state: 'Delhi', country: 'India' },
//       { name: 'Mumbai', state: 'Maharashtra', country: 'India' },
//       { name: 'Bangalore', state: 'Karnataka', country: 'India' }
//     ]);
//     console.log('✅ Cities seeded');

//     // Helper to get city ObjectId
//     const getCityId = (cityName) =>
//       cities.find((c) => c.name === cityName)._id;

//     // Step 2: Insert Hospitals
//     const hospitals = [
//       {
//         name: 'Apollo Hospital',
//         address: 'Sarita Vihar, Delhi',
//         city: getCityId('Delhi'),
//         contactNo: '011-26925858',
//         registrationNo: 'DEL-AP-001'
//       },
//       {
//         name: 'Fortis Hospital',
//         address: 'Shalimar Bagh, Delhi',
//         city: getCityId('Delhi'),
//         contactNo: '011-45674567',
//         registrationNo: 'DEL-FO-002'
//       },
//       {
//         name: 'Lilavati Hospital',
//         address: 'Bandra, Mumbai',
//         city: getCityId('Mumbai'),
//         contactNo: '022-26568555',
//         registrationNo: 'MUM-LI-003'
//       },
//       {
//         name: 'Kokilaben Hospital',
//         address: 'Andheri West, Mumbai',
//         city: getCityId('Mumbai'),
//         contactNo: '022-30696969',
//         registrationNo: 'MUM-KO-004'
//       },
//       {
//         name: 'Manipal Hospital',
//         address: 'Old Airport Road, Bangalore',
//         city: getCityId('Bangalore'),
//         contactNo: '080-25021234',
//         registrationNo: 'BLR-MA-005'
//       }
//     ];

//     await Hospital.insertMany(hospitals);
//     console.log('✅ Hospitals seeded');
//   } catch (err) {
//     console.error('❌ Seed error:', err);
//   } finally {
//     await mongoose.disconnect();
//     console.log('🔌 MongoDB disconnected');
//   }
// };

// seed();




// import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import Appointment from "./models/Appointment.js";
// import {User} from "./models/User.js"; // Adjust path as needed

// Replace with your MongoDB connection string
// const MONGO_URI = "mongodb://localhost:27017/your-db-name";
dotenv.config();
const MONGO_URI=process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-app';

import mongoose from 'mongoose';
import { DoctorAvailability } from './models/DoctorAvailability.js'; // Adjust path
import {User} from './models/User.js'; // Adjust path

// const MONGO_URI = 'mongodb://localhost:27017/your-db-name'; // Replace your DB

const seedDoctorAvailability = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch doctors (adjust filter if you have a role field)
    const doctors = await User.find().limit(2);
    if (doctors.length === 0) {
      console.error('❌ No doctors found in User collection.');
      return;
    }

    // Clear existing availability data
    await DoctorAvailability.deleteMany({});
    console.log('🧹 Cleared existing doctor availability');

    // Sample availability slots
    const availability = [
      {
        doctor: doctors[0]._id,
        day: 'Monday',
        startTime: '09:00',
        endTime: '13:00',
        slotDuration: 30
      },
      {
        doctor: doctors[0]._id,
        day: 'Wednesday',
        startTime: '10:00',
        endTime: '15:00',
        slotDuration: 20
      },
      {
        doctor: doctors[1]?._id,
        day: 'Tuesday',
        startTime: '08:30',
        endTime: '12:30',
        slotDuration: 30
      },
      {
        doctor: doctors[1]?._id,
        day: 'Friday',
        startTime: '11:00',
        endTime: '16:00',
        slotDuration: 15
      }
    ].filter(a => a.doctor); // Remove if doctor missing

    await DoctorAvailability.insertMany(availability);
    console.log('🌱 Doctor availability seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding doctor availability:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seedDoctorAvailability();
