// routes/patient.js
import express from 'express';
import multer from 'multer';
import { Department } from '../models/Opd.js';
import Patient from '../models/Patient.js';
import { User } from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Get departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await Department.find();

// const departments = departmentNames.map((name) => ({ name }));

console.log(departments);


    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// Get doctors by department
router.get("/doctors", async (req, res) => {
  const { department } = req.query;
  if (!department) return res.status(400).json({ error: "Missing department" });
   console.log(department);
  try {
    const doctors = await User.find({
  role: "doctor",
  "doctorProfile.department": department,
}).select("name doctorProfile");
     console.log(doctors);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Get available time slots
router.get("/slots", async (req, res) => {
  const { doctor, date } = req.query;
  if (!doctor || !date) return res.status(400).json({ error: "Missing doctor or date" });

  const defaultSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "10:00 AM",
    "11:30 AM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "04:30 PM"
  ];

  try {
    const booked = await Appointment.find({ doctor, date }).select("time");
    const bookedSlots = booked.map((b) => b.time);
    const availableSlots = defaultSlots.filter(s => !bookedSlots.includes(s));
    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});

// Book appointment
router.post("/appointments", authenticateJWT, upload.single("id_proof"), async (req, res) => {

  // console.log("Booking appointment for user:", req.user.id);
    
  const {
    department,
    doctor,
    doctorId,
    date,
    slot,
    name,
    address,
    contact,
    purpose
  } = req.body;

  try {
   const appointment = new Appointment({
  doctor,
  doctorId,
  department,
  date,
  name,
  time: slot,
  address,
  contact,
  reason: purpose,
  idProof: req.file?.path,
  patient: req.user?._id || req.user.id, // fallback
  user: req.user?._id || req.user.id,
});


    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});



router.post('/admitpatient', async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      contact,
      street,
      district,
      state,
      country,
      allergies,
      hospital,
      // You can expand this depending on your form
    } = req.body;

    const patient = new Patient({
      fullName,
      fatherName,
      contactNumber: contact,
      address: {
        street,
        district,
        state,
        country,
      },
      allergies,
      hospital,
    });

    await patient.save();

    res.status(201).json({ message: "Patient admitted successfully", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error admitting patient" });
  }
});




router.put('/appointments/:id/cancel', authenticateJWT, async (req, res) => {
  try {
    console.log("cancel :", req.params.id);
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    console.log("Before update:", appointment);

    appointment.status = "cancelled";
    
    const saved = await appointment.save();

    console.log("After update:", saved);

    res.json({ message: "Appointment cancelled", data: saved });
  } catch (err) {
    console.error("Error in cancel route:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});



export default router;
