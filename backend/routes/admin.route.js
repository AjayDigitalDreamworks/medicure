import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Bed from '../models/Bed.js';
import {User} from '../models/User.js';
import {Department, Queue} from '../models/Opd.js';
import Inventory from '../models/Inventory.js';

const router = express.Router();

// Dashboard metrics
router.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    // Fetch user from DB using ID from token
    const adminUser = await User.findById(req.user.id).select("name role");
    // const queueData = await Queue.find();

    if (!adminUser) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const patientsInQueue = await Queue.countDocuments({ status: 'waiting' });
    const availableDoctors = await User.countDocuments({ role: 'doctor' });
    const upcomingAppointments = await Appointment.countDocuments({ date: { $gte: new Date() } });
    
    const avgWait = await Appointment.aggregate([
      { $match: { status: 'waiting' } },
      { $group: { _id: null, avg: { $avg: '$waitTimeMinutes' } } }
    ]);

    // console.log("name :", queueData);

    const adminDetails = {
      name: adminUser.name,
      specialization: adminUser.specialization || "N/A",
      role: adminUser.role
    };

    res.json({
      adminDetails,
      patientsInQueue,
      availableDoctors,
      upcomingAppointments,
      averageWaitTime: avgWait[0]?.avg || 0
    });
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});


// Appointment requests
router.get('/appointments', authenticateJWT, async (req, res) => {
  try {
    const appts = await Appointment.find().sort({ createdAt: -1 }).limit(20);
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: 'Failed fetching appointments' });
  }
});

// OPD queue status
router.get('/queue', authenticateJWT, async (req, res) => {
  try {
    const queue = await Appointment.find()
      .sort({ createdAt: 1 });
    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: 'Failed fetching queue' });
  }
});

router.get('/doctors', authenticateJWT, async (req, res) => {
  try {
   const doctorsb = await User.find({ role: 'doctor' })
  .select('name doctorProfile');  // Select name and doctorProfile

// Format the result to include the specific fields
// const doctors = doctorsb.map(doctor => {
//   const profiles = Array.isArray(doctor.doctorProfile)
//     ? doctor.doctorProfile.map(profile => ({
//         department: profile.Department,       // Assuming field is 'Department'
//         specialization: profile.Specialization, // Assuming field is 'Specialization'
//         availability: profile.Availability    // Assuming field is 'Availability'
//       }))
//     : [{
//         department: doctor.doctorProfile?.Department,       // If it's a single object
//         specialization: doctor.doctorProfile?.Specialization,
//         availability: doctor.doctorProfile?.Availability
//       }];

//   return {
//     name: doctor.name,
//     profiles: profiles
//   };
// });

console.log(doctorsb);
res.json(doctorsb);



  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed fetching doctors' });
  }
});

router.get('/doctors/kpis', authenticateJWT, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    const kpis = {
      onDuty: doctors.filter(d => ['active','on-duty','in-consultation'].includes(d.status)).length,
      available: doctors.filter(d => d.status === 'active').length,
      surgery: doctors.filter(d => d.status === 'active').length,
      leave: doctors.filter(d => d.status === 'on-leave').length,
    };
    res.json(kpis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed fetching KPIs' });
  }
});





// Get all inventory items
router.get('/inventory', async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add new item
router.post('/inventory', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create item' });
  }
});

// Update stock/status
router.put('/inventory/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, last_updated: Date.now() },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update item' });
  }
});



// controllers/bedController.js

// Get all beds
export const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find().sort({ createdAt: -1 });
    res.json(beds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch beds' });
  }
};

// Add new bed
export const createBed = async (req, res) => {
  try {
    const newBed = new Bed(req.body);
    const saved = await newBed.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create bed' });
  }
};

// Update bed
export const updateBed = async (req, res) => {
  try {
    const updated = await Bed.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Bed not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update bed' });
  }
};

// Delete bed
export const deleteBed = async (req, res) => {
  try {
    const deleted = await Bed.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Bed not found' });
    res.json({ message: 'Bed deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete bed' });
  }
};

// Discharge patient
export const dischargeBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return res.status(404).json({ error: 'Bed not found' });

    bed.status = 'available';
    bed.dischargeDate = new Date();
    bed.patient = null; // Clear patient info properly
    await bed.save();

    res.json(bed);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Discharge failed' });
  }
};

// Register routes on router
router.get('/beds', getBeds);
router.post('/beds', createBed);
router.put('/beds/:id', updateBed);
router.delete('/beds/:id', deleteBed);
router.put('/beds/:id/discharge', dischargeBed);



export default router;



// Approve doctor by admin (sets user.approved = true and doctorIdVerified)
router.post('/doctor/:id/approve', authenticateJWT, async (req, res) => {
  try {
    if(!req.user || req.user.role !== 'admin') return res.status(403).json({error:'Admin only'});
    const { id } = req.params;
    const userModel = (await import('../models/User.js')).User;
    const doc = await userModel.findById(id);
    if(!doc) return res.status(404).json({error:'Doctor not found'});
    doc.approved = true;
    doc.doctorIdVerified = true;
    await doc.save();
    res.json({message:'Doctor approved', doctor: {id: doc._id, email: doc.email, approved: doc.approved}});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});

// Schedule delayed notification email (admin)
// body: { to, subject, html, delayMs }
router.post('/schedule-email', authenticateJWT, async (req, res) => {
  try {
    if(!req.user || req.user.role !== 'admin') return res.status(403).json({error:'Admin only'});
    const { to, subject, html, delayMs } = req.body;
    if(!to || !subject || !html || !delayMs) return res.status(400).json({error:'Missing fields'});
    const sendEmail = (await import('../utils/sendEmail.js')).default;
    // schedule with setTimeout (not persistent across restarts)
    setTimeout(() => {
      sendEmail(to, subject, html);
    }, parseInt(delayMs));
    res.json({message:'Email scheduled'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
});
