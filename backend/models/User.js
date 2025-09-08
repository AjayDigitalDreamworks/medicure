// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import { encryptField, decryptField } from '../utils/crypto.js';

// export const ROLES = ['patient', 'doctor', 'admin'];

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     index: true
//   },

//   passwordHash: { type: String, required: true },

//   phoneEnc: { type: String }, // Encrypted phone number (AES-GCM)

//   role: {
//     type: String,
//     enum: ROLES,
//     default: 'patient',
//     index: true
//   },

//   // Used by patient (optional, reflects last selected city)
//   city: {
//     type: String,
//     required: false
//   },

//   status:{
//     type: String,
//   }

//   // Used by patient to store selected hospital after login

//   // For doctor/admin — fixed hospital assigned at creation time
// }, { timestamps: true });

// // Virtual phone getter/setter using encryption
// UserSchema.virtual('phone')
//   .get(function () {
//     return decryptField(this.phoneEnc);
//   })
//   .set(function (v) {
//     this.phoneEnc = encryptField(v, this._id);
//   });

// // Method to verify password
// UserSchema.methods.verifyPassword = async function (plain) {
//   return bcrypt.compare(plain, this.passwordHash);
// };

// // Static method to register a patient
// UserSchema.statics.registerPatient = async function ({ name, email, password, phone }) {
//   const hash = await bcrypt.hash(password, 12);
//   const user = new this({
//     name,
//     email,
//     passwordHash: hash,
//     role: 'patient'
//   });
//   if (phone) user.phone = phone;
//   return user.save();
// };

// // Pre-save hook: Enforce hospital for doctor/admin roles
// UserSchema.pre('save', function (next) {
//   // if ((this.role === 'doctor' || this.role === 'admin') && !this.hospital) {
//   //   return next(new Error('Hospital is required for role: ' + this.role));
//   // }
//   next();
// });

// export const User = mongoose.model('User', UserSchema);
// // export const {ROLES} = ROLES;



import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { encryptField, decryptField } from '../utils/crypto.js';

export const ROLES = ['patient', 'doctor', 'admin'];

//
// --- Doctor Profile ---
const DoctorProfileSchema = new mongoose.Schema({
  department: String,
  specialization: String,
  qualifications: [String],
  experience: Number,
  consultationFee: Number,
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String,
      slotDuration: { type: Number, default: 30 }
    }
  ],
  leaves: [
    {
      from: Date,
      to: Date,
      reason: String
    }
  ],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  bio: String,
  clinicAddress: String,
  isAvailableOnline: { type: Boolean, default: false }
}, { _id: false });


//
// --- Patient Profile ---
const PatientProfileSchema = new mongoose.Schema({
  age: Number,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  emergencyContact: String,
  bloodGroup: String,
  allergies: [String],
  chronicDiseases: [String],
  medicalHistory: String,
  preferredHospital: String,
}, { _id: false });


//
// --- Main User Schema ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  passwordHash: { type: String, required: true },

  phoneEnc: { type: String }, // Encrypted phone number (AES-GCM)

  role: {
    type: String,
    enum: ROLES,
    default: 'patient',
    index: true
  },

  status: {
    type: String,
    enum: ['active', 'pending'], // <––– FIX THIS
    default: 'pending'
  },

  city: { type: String },

  doctorProfile: {
    type: DoctorProfileSchema,
    required: function () {
      return this.role === 'doctor';
    }
  },

  patientProfile: {
    type: PatientProfileSchema,
    required: function () {
      return this.role === 'patient';
    }
  }

}, { timestamps: true });


//
// --- Virtual Phone Encryption ---
UserSchema.virtual('phone')
  .get(function () {
    return decryptField(this.phoneEnc);
  })
  .set(function (v) {
    this.phoneEnc = encryptField(v, this._id);
  });


//
// --- Password Verification ---
UserSchema.methods.verifyPassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};


//
// --- Register Patient Method ---
UserSchema.statics.registerPatient = async function ({ name, email, password, phone, patientProfile }) {
  const hash = await bcrypt.hash(password, 12);
  const user = new this({
    name,
    email,
    passwordHash: hash,
    role: 'patient',
    patientProfile
  });
  if (phone) user.phone = phone;
  return user.save();
};

//
// --- Register Doctor Method ---
UserSchema.statics.registerDoctor = async function ({ name, email, password, phone, doctorProfile }) {
  const hash = await bcrypt.hash(password, 12);
  const user = new this({
    name,
    email,
    passwordHash: hash,
    role: 'doctor',
    doctorProfile
  });
  if (phone) user.phone = phone;
  return user.save();
};

export const User = mongoose.model('User', UserSchema);
