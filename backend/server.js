const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const Doctor = require("./models/Doctors");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const router = express.Router();
const session = require("express-session");
const flash = require('connect-flash');
const User = require("./models/User");
const { ensureAuthenticated , checkRoles } = require("./config/auth");
dotenv.config();
const app = express();
const Patient = require('./models/Patient');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
require("./config/passport")(passport);

// const session = require("express-session");
app.set('trust proxy', 1); // ✅ Required for secure cookies to work behind proxy

app.use(session({
  secret: process.env.SESSION_SECRET || "fallbackSecretKey123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // ✅ ensures HTTPS in prod
    httpOnly: false,
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // ✅ cross-domain safe
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));



// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));
app.use(express.static(path.join(__dirname,"../frontend/public")));


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Sample route

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});


app.get("/", (req, res) => {

  res.render("index", { isAuthenticated: req.isAuthenticated(), user: req.user , title: "Welcome to Admin Panel"});

});


const adminRouter = require('./routes/admin');
const patientRouter = require('./routes/patient');
app.use('/admin', adminRouter);
app.use('/patient', patientRouter);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const doctor = require("./routes/doctor");
app.use("/api/doctor", doctor);
const emergencyRoutes = require("./routes/emergency");
app.use("/api/emergency", emergencyRoutes);

app.get("/api/patient/:id", async (req, res) => {
  try {
    const patient = await User.findOne({ _Id: req.params.id });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.use('', require('./routes/userRoutes'));
app.get('/api/user/profile', async (req, res) => {
  try {
    // Find user by ID (from the authenticated user)
    const user = await User.findById(req.user.id); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back user data (exclude sensitive fields like password)
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      qualification: user.qualification,
      specialization: user.specialization,
      experience: user.experience,
      bio: user.bio,
      availableDays: user.availableDays,
      availableTimeSlots: user.availableTimeSlots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// doctors
const doctorAPIRoutes = require('./routes/patientroute'); // adjust path if needed
app.use(doctorAPIRoutes);




const methodOverride = require('method-override');
// const { ensureAuthenticated } = require("./config/auth");
app.use(methodOverride('_method'));

app.use(flash()); 

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
