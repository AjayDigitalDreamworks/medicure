// emergency.js
const express = require("express");
const router = express.Router();

// ===== Static Data =====
let dashboard = {
  activeEmergencies: 12,
  ambulancesEnRoute: 8,
  emergencyBedsAvailable: 3,
  responseTimeAvg: "4.2m"
};

let activities = [
  { id: 1, type: "Cardiac Arrest", location: "Emergency Room 1", patient: "John Doe", status: "critical", time: "00:15:23" },
  { id: 2, type: "Traffic Accident", location: "Highway 101 • En Route", status: "urgent", time: "00:08:45" },
  { id: 3, type: "Respirator Failure", location: "ICU Bed 3", patient: "Patient Wing B", status: "monitoring", time: "00:23:12" }
];

// ===== API Routes =====
router.get("/dashboard", (req, res) => {
  res.json(dashboard);
});

router.get("/activity", (req, res) => {
  res.json(activities);
});

router.post("/patient", (req, res) => {
  const { patientName, emergencyType, priority, location } = req.body;
  const newActivity = {
    id: Date.now(),
    type: emergencyType,
    location,
    patient: patientName,
    status: priority,
    time: new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 8)
  };
  activities.unshift(newActivity);
  dashboard.activeEmergencies++;
  res.json(newActivity);
});

module.exports = router;
