import React, { useState } from 'react';
import { useNavigate, Navigate, Link  } from 'react-router-dom';
import axios from 'axios';
import jwt_Decode from 'jwt-decode'; // ← make sure you're using this
// import jwtJsDecode from "jwt-js-decode";

function Login({ setIsAuthenticated, setUserRole }) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await axios.post(
      'https://medicure-57ts.onrender.com/api/auth/login',
      form,
      { withCredentials: true }
    );

    console.log("response", res);

    const decoded = jwt_Decode(res.data.token); // ✅ now this works
    console.log("decoded", decoded);

    // Save token in localStorage
    localStorage.setItem("token", res.data.token);

    setIsAuthenticated(true);
    setUserRole(decoded.role);

    navigate("/");
  } catch (err) {
    setError('Login failed. ' + err.message);
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
          style={{ minWidth: '320px', maxWidth: '350px', zIndex: 2 }}
          onSubmit={handleSubmit}
        >
          <div className="text-success fs-3 mb-3">&#10038;</div>
          <h2 className="fw-bold mb-1">SmartHosp</h2>
          <p className="text-secondary mb-4">Welcome back! Please login to your account.</p>

          {error && <p className="text-danger small">{error}</p>}

          <div className="mb-3 text-start">
            <label htmlFor="email" className="form-label fw-semibold">Email or Username</label>
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="Enter your email or username"
              value={form.email}
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
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-end">
            <Link to="#" className="text-success text-decoration-none hover-underline">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold hover-scale">Login</button>

          <p className="mt-3 text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-success fw-semibold text-decoration-none hover-underline">Sign Up</Link>
          </p>
        </form>
      </main>

      <footer className="border-top py-3 d-flex justify-content-between align-items-center px-3">
        <div>
          <a href="#" className="text-dark me-3 text-decoration-none hover-underline">Company</a>
          <a href="#" className="text-dark me-3 text-decoration-none hover-underline">Support</a>
          <a href="#" className="text-dark text-decoration-none hover-underline">Legal</a>
        </div>
        <div>
          <a href="#" aria-label="Facebook" className="text-dark mx-2 social-icon-hover">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" aria-label="Twitter" className="text-dark mx-2 social-icon-hover">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="#" aria-label="LinkedIn" className="text-dark mx-2 social-icon-hover">
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
