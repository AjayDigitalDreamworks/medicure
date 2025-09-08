import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',

    // Doctor fields
    department: '',
    specialization: '',
    qualifications: '',
    experience: '',
    consultationFee: '',
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch departments on mount
  useEffect(() => {
    axios.get('http://localhost:4000/api/patient/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError("Passwords don't match");
    }

    setLoading(true);

    const payload = {
      name: form.fullname,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role.toLowerCase(),
    };

    let endpoint = '';

    if (form.role === 'doctor') {
      endpoint = 'http://localhost:4000/api/auth/register-doctor';

      payload.doctorProfile = {
        department: form.department,
        specialization: form.specialization,
        qualifications: form.qualifications.split(',').map(q => q.trim()),
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
      };
    } else if (form.role === 'patient') {
      endpoint = 'http://localhost:4000/api/auth/register-patient';
      payload.patientProfile = {}; // Optional, you can add more fields later
    } else {
      return setError('Invalid role selected');
    }

    try {
      const res = await axios.post(endpoint, payload);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex flex-column">
      <header className="py-2 border-bottom d-flex align-items-center">
        <h1 className="text-success fw-bold ms-3 logo-hover" style={{ fontStyle: 'italic' }}>
          <span className="me-1">&#10038;</span> MEDICURE
        </h1>
      </header>

      <main className="flex-grow-1 d-flex justify-content-center align-items-center position-relative">
        <div className="background-illustration"></div>

        <form
          className="card p-4 shadow-sm rounded-3 position-absolute text-center"
          style={{ minWidth: '320px', maxWidth: '400px', zIndex: 2 }}
          onSubmit={handleSubmit}
        >
          <h2 className="fw-bold mb-1">Create an Account</h2>
          <p className="text-secondary mb-4">Enter your details below to get started.</p>

          {error && <p className="text-danger small">{error}</p>}

          <div className="mb-3 text-start">
            <label htmlFor="fullname" className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              id="fullname"
              className="form-control"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="phone" className="form-label fw-semibold">Phone</label>
            <input
              type="tel"
              id="phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label htmlFor="role" className="form-label fw-semibold">Role</label>
            <select
              id="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* Doctor-specific fields */}
          {form.role === 'doctor' && (
            <>
              <div className="mb-3 text-start">
                <label htmlFor="department" className="form-label fw-semibold">Department</label>
                <select
                  id="department"
                  className="form-select"
                  value={form.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="specialization" className="form-label fw-semibold">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  className="form-control"
                  placeholder="e.g. Interventional Cardiology"
                  value={form.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="qualifications" className="form-label fw-semibold">Qualifications (comma separated)</label>
                <input
                  type="text"
                  id="qualifications"
                  className="form-control"
                  placeholder="e.g. MBBS, MD"
                  value={form.qualifications}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="experience" className="form-label fw-semibold">Experience (years)</label>
                <input
                  type="number"
                  id="experience"
                  className="form-control"
                  value={form.experience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4 text-start">
                <label htmlFor="consultationFee" className="form-label fw-semibold">Consultation Fee (INR)</label>
                <input
                  type="number"
                  id="consultationFee"
                  className="form-control"
                  value={form.consultationFee}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold hover-scale"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="mt-3 text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-success fw-semibold text-decoration-none hover-underline">
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Signup;
