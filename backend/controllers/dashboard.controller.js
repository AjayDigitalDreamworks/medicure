import { User } from "../models/User.js";
import { Hospital } from "../models/Hospital.js";
import Appointment from "../models/Appointment.js";
import { authenticateJWT } from "../middleware/auth.js";
// -------------------------------------------
// 👤 Patient Dashboard
// -------------------------------------------
export const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    console.log("Fetching patient with ID:", userId);
    const user = await User.findById(userId).select("-passwordHash -phoneEnc");
    console.log("user fetched:", user);

    if (!user) {
      return res.status(404).json({ error: "Patient not found" }); // <== likely hitting here
    }

    // if (!user) return res.status(404).json({ error: 'Patient not found' });

    // Define today range
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const todayEnd = new Date(today.setHours(23, 59, 59, 999));

    // console.log("Fetching appointments for user ID:", req.user.id);

const appointments = await Appointment.find({
  user: req.user.id
}).populate("patient", "name email"); // populate if needed

// console.log("Appointments fetched raw:", appointments);

const appointmentList = appointments.map((appt) => ({
  id: appt._id,
  date: appt.date,
  time: appt.time,
  reason: appt.reason,
  status: appt.status,
  doctor: appt.doctor,
}));

console.log("Appointments mapped:", user.name);


    res.json({
      role: "patient",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // any other field needed
      },
      appointments: appointmentList,
    });
  } catch (err) {
    console.error("Patient Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load patient dashboard" });
  }
};

// -------------------------------------------
// 🩺 Doctor Dashboard
// -------------------------------------------

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id || req.user.id;

    // 1. Get doctor info
    const doctor = await User.findById(doctorId).select("name email");

    // 2. Get today's appointments
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId: doctorId,
    }).populate("patient", "name");

    const stats = {
      // appointmentsToday: appointments.length,
      consultedToday: appointments.filter(
        (a) => a.status.toLowerCase() === "confirmed"
      ).length,
      consultedToday: appointments.filter(
        (a) => a.status.toLowerCase() === "completed"
      ).length,
      pendingPatients: appointments.filter(
        (a) => a.status.toLowerCase() === "pending"
      ).length,
    };

    const patients = appointments
  .filter((appt) => appt.status?.toLowerCase() === "confirmed")
  .map((appt) => ({
    name: appt.name || "N/A",
    time: appt.time,
    reason: appt.reason || "No reason specified",
  }));


    res.json({
      doctor,
      stats,
      patients,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};

// -------------------------------------------
// 🧑‍💼 Admin Dashboard
// -------------------------------------------
export const getAdminDashboard = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id)
      .select("-passwordHash -phoneEnc")
      .populate("hospital");

    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const hospital = await Hospital.findById(admin.hospital._id);

    // Optional: Count users in the same hospital
    const doctorCount = await User.countDocuments({
      role: "doctor",
      hospital: hospital._id,
    });
    const patientCount = await User.countDocuments({
      role: "patient",
      selectedHospital: hospital._id,
    });

    res.json({
      role: "admin",
      message: `Welcome Admin ${admin.name}`,
      hospital: hospital.name,
      stats: {
        totalDoctors: doctorCount,
        totalPatients: patientCount,
      },
      hospitalDetails: hospital,
    });
  } catch (err) {
    console.error("Admin Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load admin dashboard" });
  }
};
