import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Events');

  // We'll store a unique ID on each new event
  const generateId = () => Date.now().toString();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    subType: '',
    addadmin: '',
    location: '',
    startDate: '',
    endDate: ''
  });
  
  // Updated main navigation items with names and paths
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Suppliers', path: '/SuppliersProfile' }
  ];

  // Updated user navigation items as objects
  const userNavItems = [
    { name: 'My Work' },
    { name: 'My Team' }
  ];

  const typeOptions = [
    'Corporate Event',
    'Social Event',
    'Professional Networking Event',
    'Educational Event',
    'Trade Shows & Expos',
    'Charity and Fundraising Events',
    'Cultural and Community Events',
    'Sport Events',
    'Art and Entertainment Events',
    'Health and Wellness Events',
    'Technology and Innovation Events',
    'Government Events'
  ];

  const subTypeOptions = {
    'Corporate Event': [
      'Conferences', 'Seminars', 'Workshops', 'Training Sessions', 'Product Launches', 'Team Building Activities', 'Corporate Retreats'
    ],
    'Social Event': [
      'Weddings', 'Birthday Parties', 'Baby Showers', 'Graduation', 'Reunions', 'Holiday Celebrations'
    ],
    'Professional Networking Event': [
      'Business Events', 'Industry Meetups', 'Networking Breakfast/Brunch/Lunch/Dinner', 'Career Fairs', 'Alumni Events'
    ],
    'Educational Event': [
      'Webinars', 'Panel Discussions', 'Academic Conferences', 'Training Workshops'
    ],
    'Trade Shows & Expos': [
      'Industry Expo', 'Trade Fairs', 'Product Exhibitions', 'Job Fairs'
    ],
    'Charity and Fundraising Events': [
      'Charity Galas', 'Fundraising Dinners', 'Auctions', 'Charity Runs/Walks', 'Benefit Concerts'
    ],
    'Cultural and Community Events': [
      'Cultural Celebrations', 'Food and Drink Festivals', 'Parades', 'Street Fairs'
    ],
    'Sport Events': [
      'Tournaments', 'Races (5k, 10k, Marathons)', 'Charity Sports Events', 'Matches and Games'
    ],
    'Art and Entertainment Events': [
      'Art Exhibitions', 'Concerts', 'Festivals', 'Theater Performances', 'Film Premieres and Screenings', 'Comedy Acts/Shows'
    ],
    'Health and Wellness Events': [
      'Health Fairs', 'Wellness Retreats', 'Yoga or Other Workshops', 'Fitness Classes', 'Retreats'
    ],
    'Technology and Innovation Events': [
      'Hackathons', 'Tech Conferences', 'Startup Pitch Conferences', 'Innovation Summits'
    ],
    'Government Events': [
      'Town/County Hall Meetings', 'Government Conferences', 'Civic Engagement Events', 'Public Forums'
    ]
  };

  const adminOptions = ['Jerry', 'Sam', 'Cole', 'Bryan'];

  // Handle creating a new event
  const handleCreateEvent = () => {
    // 1) Get existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events')) || [];

    // 2) Create a new event object with unique ID
    const newEvent = {
      id: generateId(),
      ...formData
    };

    // 3) Push it into the array
    existingEvents.push(newEvent);

    // 4) Save updated array back to localStorage
    localStorage.setItem('events', JSON.stringify(existingEvents));

    // 5) Navigate to the /Events page
    navigate('/Events');
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-section left">
          <img 
            src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} 
            alt="CITADA Logo" 
            className="nav-logo"
          />
          {mainNavItems.map(item => (
            <button
              key={item.name}
              className={`nav-btn ${activeNav === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="nav-section right">
          {userNavItems.map(item => (
            <button
              key={item.name}
              className="nav-btn"
              onClick={() => setActiveNav(item.name)}
            >
              {item.name}
            </button>
          ))}
          <div className="user-profile">A</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">Create Event</h1>
            <div className="welcome-message">
              <span>Welcome,</span>
              <span className="username">Alex</span>
            </div>
          </div>
          <button onClick={() => navigate('/AddSupplier')} className="primary-btn outline">Add Suppliers</button>
        </header>

        {/* Event Creation Form */}
        <div className="form-container">
          <div className="form-section">
            <div className="form-grid">
              {/* Left Form Column */}
              <div className="form-column">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="input-group">
                  <label>Add Planner</label>
                  <select
                    value={formData.addadmin}
                    onChange={(e) => setFormData({...formData, addadmin: e.target.value})}
                  >
                    <option value="">Select Planner</option>
                    {adminOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              {/* Right Form Column */}
              <div className="form-column">
                <div className="input-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value, subType: ''})}
                  >
                    <option value="">Select Type</option>
                    {typeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Sub-type</label>
                  <select
                    value={formData.subType}
                    onChange={(e) => setFormData({...formData, subType: e.target.value})}
                    disabled={!formData.type}
                  >
                    <option value="">Select Sub-type</option>
                    {subTypeOptions[formData.type]?.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="date-group">
                  <div className="input-group">
                    <label>Start Date (DD/MM/YYYY)</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>

                  <div className="input-group">
                    <label>End Date (DD/MM/YYYY)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="form-actions">
              <button onClick={handleCreateEvent} className="primary-btn create-btn">
                Create
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style jsx>{`
        :root {
          --primary-blue: #441752;
          --hover-blue: #441752;
          --light-bg: #A888B5;
          --text-dark: #441752;
          --text-light: #441752;
          --border-color: #A888B5;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--light-bg);
          font-family: 'Inter', sans-serif;
        }

        /* Navigation Styles */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          height: 64px;
          background: var(--primary-blue);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-logo {
          height: 28px;
          margin-right: 16px;
        }

        .nav-btn {
          padding: 8px 16px;
          border: none;
          background: none;
          color: #A888B5;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: #A888B5;
          color: #441752;
        }

        .nav-btn.active {
          color:#A888B5;
          background: #441752;
        }

        .user-profile {
          width: 32px;
          height: 32px;
          background: var(--light-bg);
          color: var(--primary-blue);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* Main Content */
        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 24px;
          color: var(--text-dark);
          margin: 0;
        }

        .welcome-message {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 32px;
          color: var(--text-light);
          margin-top: 8px;
        }

        .username {
          font-weight: 600;
          color: var(--text-dark);
        }

        /* Form */
        .form-container {
          background:  #441752;
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          color: #A888B5;
          font-weight: 500;
        }

        input,
        select {
          padding: 12px 10px;
          border: 1px solid #A888B5;
          border-radius: 6px;
          font-size: 14px;
          width: 100%;
        }

        select:focus,
        input:focus {
          outline: none;
          border-color: #A888B5;
          box-shadow: 0 0 0 2px rgba(44, 125, 250, 0.1);
        }

        .date-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          border-top: 1px solid #A888B5;
          padding-top: 24px;
        }

        .primary-btn {
          padding: 12px 24px;
          background: #A888B5;
          color: #441752;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn.outline {
          background: #441752;
          border: 1px solid #A888B5;
          color: #A888B5;
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 125, 250, 0.2);
        }

        .create-btn {
          padding: 12px 32px;
        }
      `}</style>
    </div>
  );
};

export default CreateEventPage;
