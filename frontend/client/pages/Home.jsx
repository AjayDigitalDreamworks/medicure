import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, Button, Row, Col, Card } from 'react-bootstrap';
import { Routes, Route, useNavigate , Link } from 'react-router-dom';
import { BsPeopleFill, BsHouseDoorFill, BsClockFill, BsBoxSeam, BsGrid, BsFileEarmarkText, BsCalendar4Event } from 'react-icons/bs';

// Sample profile icon URL (you can replace it)
const profilePic = 'https://randomuser.me/api/portraits/men/32.jpg';

// Data for Dashboard top cards
// const Dashboard = () => {


// Key features data
const keyFeatures = [
  {
    icon: <BsCalendar4Event className="icon-green" />,
    title: 'OPD Queue Management',
    desc: 'Streamline outpatient department workflows and reduce patient waiting times with intelligent queueing systems. Enhance patient satisfaction by providing real-time updates and efficient routing.'
  },
  {
    icon: <BsHouseDoorFill className="icon-green" />,
    title: 'Bed Availability Tracker',
    desc: 'Optimize hospital resource allocation with a real-time bed management system. Quickly identify available beds, assign patients, and manage occupancy to improve operational efficiency and patient flow.'
  },
  {
    icon: <BsFileEarmarkText className="icon-green" />,
    title: 'Admission Process Simplified',
    desc: 'Automate and digitize the patient admission process, reducing paperwork and administrative burden. Ensure quick and accurate data entry for a seamless patient onboarding experience from arrival to room assignment.'
  },
  {
    icon: <BsGrid className="icon-green" />,
    title: 'Doctor & Department Dashboard',
    desc: 'Provide healthcare professionals with personalized dashboards to monitor patient load, upcoming appointments, and departmental performance. Empower them with insights for better decision-making and improved patient care coordination.'
  }
];

// Testimonials data
const testimonials = [
  {
    quote: 'SmartHosp has revolutionized our patient management. The OPD queue system alone saved us hours daily and drastically improved patient satisfaction. It\'s truly next-generation.',
    name: 'Dr. Priya Sharma',
    role: 'Head of Operations, City Hospital',
    pic: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    quote: 'The real-time bed tracker is a game-changer for our emergency department. We can now allocate resources much more efficiently, reducing wait times significantly for critical patients.',
    name: 'Mr. Rajesh Kumar',
    role: 'Hospital Administrator, Apex Medical',
    pic: 'https://randomuser.me/api/portraits/men/58.jpg',
  },
  {
    quote: 'Implementing SmartHosp simplified our entire admission process. The digital forms and streamlined workflow have made patient onboarding faster and more accurate than ever before.',
    name: 'Ms. Anjali Singh',
    role: 'Admissions Manager, Global Health Clinic',
    pic: 'https://randomuser.me/api/portraits/women/65.jpg',
  }
];

const iconMap = {
  'BsPeopleFill': <BsPeopleFill className="icon-green" />,
  'BsHouseDoorFill': <BsHouseDoorFill className="icon-green" />,
  'BsClockFill': <BsClockFill className="icon-green" />,
  'BsBoxSeam': <BsBoxSeam className="icon-green" />,
};

export default function App({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

const [userRole, setUserRole] = React.useState(null);

const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
   axios.get('https://medicure-57ts.onrender.com/')
  .then(res => {
    const updatedData = res.data.map(item => ({
      ...item,
      icon: iconMap[item.icon] || null,
    }));
    setDashboardData(updatedData);
  })
  .catch(err => console.error('Error fetching data:', err));


  }, []);


  return (
    <>
      {/* Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-3">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center gap-2 text-success">
            <span className="logo-dot" />
            <span className="fw-bold fs-5">MEDICURE</span>
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center gap-4 fw-semibold">
  {isAuthenticated ? (
    <>
      <Nav.Link href="/dashboard" className="text-success">Dashboard</Nav.Link>
      <Button variant="outline-danger" size="sm" onClick={() => {
      //  const handleLogout = () => {
  localStorage.removeItem("token");
  setIsAuthenticated(false);
  setUserRole(null);
  navigate("/login");
// };

      }}>
        Logout
      </Button>
      <Nav.Link href="#" className="d-flex align-items-center">
        <img
          src={profilePic}
          alt="profile"
          className="rounded-circle"
          width={38}
          height={38}
          style={{ objectFit: 'cover' }}
        />
      </Nav.Link>
    </>
  ) : (
    <>
      {/* <Nav.Link href="#" className="text-secondary">OPD Queue</Nav.Link> */}
      <Nav.Link onClick={() => navigate('/login')} className="text-secondary">Login</Nav.Link>
      <Nav.Link  className="text-secondary">Register</Nav.Link>
      {/* <Nav.Link href="#" className="text-secondary">Bed Management</Nav.Link> */}
      {/* <Nav.Link href="#" className="text-secondary">Patient Admission</Nav.Link> */}
      {/* <Nav.Link href="#" className="text-secondary position-relative bell-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6c757d" className="bi bi-bell" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/>
          <path d="M8 1a5 5 0 0 0-5 5v3.086l-.895.447A.5.5 0 0 0 2 10.5v1a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.105-.293L13 9.086V6a5 5 0 0 0-5-5z"/>
        </svg>
      </Nav.Link> */}
    </>
  )}
</Nav>

        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section text-center p-5 bg-light">
        <Container>
          <div className="mb-2 text-uppercase text-success small text-opacity-50 fw-bold px-3 py-1 welcome-tag d-inline-block rounded-pill">Welcome to</div>
          <h1 className="mb-3 fw-bold" style={{ fontSize: '2.75rem' }}>
            Next-Generation <span className="text-success">Healthcare Management</span>
          </h1>
          <p className="text-muted mb-4" style={{ maxWidth: '710px', margin: '0 auto' }}>
            Revolutionizing hospital operations with AI-powered queue management, real-time bed allocation, and intelligent inventory systems for Delhi's healthcare infrastructure.
          </p>
          {!isAuthenticated && (
  <div>
    <Button
      variant="success"
      className="me-2 px-4 fw-bold d-inline-flex align-items-center gap-2"
      onClick={() => navigate('/login')}
    >
      {/* icon */}
      Patient
    </Button>
    <Button
      variant="outline-secondary"
      className="px-4 fw-bold d-inline-flex align-items-center gap-2"
      onClick={() => navigate('/login')}
    >
      {/* icon */}
      Admin
    </Button>
  </div>
)}

        </Container>
      </div>

      {/* Stats Cards */}
      <div className="py-5 bg-white">
        <Container>
          <Row className="g-4 justify-content-center">
            {dashboardData.map((item, idx) => (
              <Col md={3} xs={6} key={idx}>
                <Card className="stats-card p-3 h-100 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">{item.title}</small>
                    <h4 className="fw-bold my-1">{item.value}</h4>
                    <small className={`fw-semibold ${item.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                      {item.change}
                    </small>
                  </div>
                  <div className="fs-3 icon-bg rounded-circle d-flex justify-content-center align-items-center">
                    {item.icon}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Key Features Section */}
      <Container className="pb-5">
        <h3 className="text-center mb-4 fw-bold">Key Features</h3>
        <Row className="g-4">
          {keyFeatures.map(({ icon, title, desc }, idx) => (
            <Col md={6} key={idx}>
              <Card className="key-feature-card p-4 rounded-3 border border-1">
                <div className="mb-2 fs-4 icon-green">
                  {icon}
                </div>
                <Card.Title as="h6" className="fw-bold">{title}</Card.Title>
                <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>{desc}</Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Testimonials Section */}
      <div className="py-5 bg-light">
        <Container>
          <h3 className="text-center mb-5 fw-bold">What Our Users Say</h3>
          <Row className="g-4 justify-content-center">
            {testimonials.map(({ quote, name, role, pic }, idx) => (
              <Col md={4} key={idx}>
                <Card className="testimonial-card p-4 shadow-sm rounded-3 h-100 position-relative border-0">
                  <div className="text-success fs-3 testimonial-quote">&#8220;</div>
                  <blockquote className="fst-italic mb-4" style={{ fontSize: '0.95rem', minHeight: '120px' }}>{quote}</blockquote>
                  <div className="d-flex align-items-center">
                    <img
                      src={pic}
                      alt={name}
                      className="rounded-circle me-3"
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">{name}</h6>
                      <small className="text-muted">{role}</small>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="footer bg-white py-3 border-top text-muted">
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="small">
            <a href="#" className="text-muted me-3 text-decoration-none">Resources</a>
            <a href="#" className="text-muted me-3 text-decoration-none">Legal</a>
            <a href="#" className="text-muted text-decoration-none">Contact Us</a>
          </div>
          <div className="social-icons d-flex gap-3">
            <a href="#" className="text-muted social-link" aria-label="Facebook" title="Facebook">
              <i className="bi bi-facebook"></i>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                <path d="M8.94 7.019H7.76v-.792c0-.32.09-.555.58-.555h.578V4.666H8.486C7.714 4.666 7.187 5.044 7.187 5.831v.77H6.468v1.15h.719V11h1.25V7.018z"/>
              </svg>
            </a>
            <a href="#" className="text-muted social-link" aria-label="Twitter" title="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.143-.004-.284-.01-.425A6.68 6.68 0 0 0 16 3.542a6.494 6.494 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.819 6.573 6.573 0 0 1-2.084.797A3.286 3.286 0 0 0 7.875 7.03a9.325 9.325 0 0 1-6.766-3.429A3.289 3.289 0 0 0 2.18 8.03 3.203 3.203 0 0 1 .64 7.235v.045a3.283 3.283 0 0 0 2.633 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.615-.057 3.29 3.29 0 0 0 3.067 2.27 6.588 6.588 0 0 1-4.862 1.354 9.344 9.344 0 0 0 5.034 1.475"/>
              </svg>
            </a>
            <a href="#" className="text-muted social-link" aria-label="LinkedIn" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.475 0 16 .526 16 1.175v13.65c0 .662-.526 1.175-1.175 1.175H1.175C.513 16 0 15.474 0 14.825V1.146zM4.943 12.306V6.169H2.542v6.137h2.401zm-1.2-7.201c.837 0 1.356-.56 1.356-1.262-.015-.718-.52-1.263-1.34-1.263a1.337 1.337 0 0 0-1.356 1.263c0 .703.52 1.262 1.324 1.262h.016zm4.908 7.201V9.359c0-.188.013-.377.07-.511.15-.378.49-.77 1.06-.77.747 0 1.045.58 1.045 1.43v2.898H13.6v-3.1c0-1.682-.9-2.467-2.103-2.467-1.023 0-1.476.562-1.73.962h.023v-.825H8.22v6.137h2.45z"/>
              </svg>
            </a>
            <a href="#" className="text-muted social-link" aria-label="Instagram" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                <path d="M8 4.358a3.643 3.643 0 1 0 0 7.285 3.643 3.643 0 0 0 0-7.285Zm0 6.013a2.37 2.37 0 1 1 0-4.74 2.37 2.37 0 0 1 0 4.74Z"/>
                <path d="M12.635 2.694A2.33 2.33 0 0 1 14 4.03V12a2.34 2.34 0 0 1-2.33 2.3H4A2.34 2.34 0 0 1 1.67 12V4.03a2.34 2.34 0 0 1 2.33-2.3H12.635Zm-.33.814H4.024a1.54 1.54 0 0 0-1.54 1.556v7.388a1.54 1.54 0 0 0 1.54 1.555h8.281a1.54 1.54 0 0 0 1.54-1.555V5.064a1.54 1.54 0 0 0-1.54-1.556Z"/>
                <path d="M12.93 4.667a.545.545 0 1 1-1.09 0 .545.545 0 0 1 1.09 0Z"/>
              </svg>
            </a>
          </div>
        </Container>
      </footer>
    </>
  );
}
