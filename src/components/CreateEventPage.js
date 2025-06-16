import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import { logEventChange } from '../utils/auditLogger';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

import { useAdminId } from '../hooks/useAdminId';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Events');

  // We'll store a unique ID on each new event
  const generateId = () => uuidv4();

  const { adminId } = useAdminId();

  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    type: '',
    subType: '',
    addadmin: '',
    location: '',
    startDate: '',
    endDate: '',
    visibility: 'public', // default to public
    file: null
  });
  
  // Updated main navigation items with names and paths
  // User info will be handled by UserProfile component

  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];

  // Updated user navigation items as objects
  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
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

  // Fetch planners from Supabase (added via MyTeam page)
  const [planners, setPlanners] = useState([]);
  const [plannersLoading, setPlannersLoading] = useState(false);

  useEffect(() => {
    async function fetchPlanners() {
      if (!adminId) return;
      setPlannersLoading(true);
      try {
        const { data, error } = await supabase
          .from('planners')
          .select('*')
          .eq('user_id', adminId)
          .order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          setPlanners(data);
        } else {
          setPlanners([]);
        }
      } catch {
        setPlanners([]);
      }
      setPlannersLoading(false);
    }
    fetchPlanners();
  }, [adminId]);

  const adminOptions = planners;

  // Handle creating a new event
  const handleCreateEvent = async () => {
    if (!adminId) {
      alert('User not loaded. Please wait and try again.');
      return;
    }
    try {
      // Prepare event data for Supabase
      const eventData = {
        id: generateId(),
        name: formData.name,
        budget: formData.budget === '' ? null : Number(formData.budget),
        type: formData.type,
        sub_type: formData.subType,
        planner_email: formData.addadmin,
        location: formData.location,
        start_date: formData.startDate === '' ? null : formData.startDate,
        end_date: formData.endDate === '' ? null : formData.endDate,
        visibility: formData.visibility,
        admin_id: adminId,
        created_at: new Date().toISOString(),
      };
      // Insert into 'events' table
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select();
      if (error) {
        alert('Failed to create event: ' + error.message);
        return;
      }
      const createdEvent = data && data[0];
      if (!createdEvent) {
        alert('Event creation failed: No event returned');
        return;
      }
      // Store in localStorage for offline use (optional)
      const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
      existingEvents.push(createdEvent);
      localStorage.setItem('events', JSON.stringify(existingEvents));
      // Navigate directly to the event management page
      navigate(`/EventsManagementPage/${createdEvent.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An unexpected error occurred while creating the event.');
    }
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
              onClick={() => {
                setActiveNav(item.name);
                if (item.path) navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          <UserProfile showName={false} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">Create Event</h1>
            <div className="welcome-message">
              <span>Welcome,</span>
              <UserProfile showName={true} />
            </div>
          </div>

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
    disabled={plannersLoading}
  >
    <option value="">Select Planner</option>
    {plannersLoading ? (
      <option value="" disabled>Loading planners...</option>
    ) : (
      adminOptions.length === 0 ? (
        <option value="" disabled>No planners available</option>
      ) : (
        adminOptions.map(option => {
          if (option && typeof option === 'object' && option.name && option.email) {
            return (
              <option key={option.email} value={option.email}>
                {option.name} ({option.email})
              </option>
            );
          }
          return null;
        })
      )
    )}
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

                <div className="input-group">
                  <label>Budget</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
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

                {/* File Upload */}
                <div className="input-group">
                  <label>Upload File</label>
                  <input
                    type="file"
                    style={{ color: '#A888B5' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setFormData({
                          ...formData,
                          file: {
                            name: file.name,
                            url: URL.createObjectURL(file)
                          }
                        });
                      }
                    }}
                  />
                </div>

                {/* Public/Private Option (Dropdown) */}
                <div className="input-group">
                  <label>Event Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={e => setFormData({ ...formData, visibility: e.target.value })}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #A888B5',
                      fontSize: '13px',
                      background: '#fff',
                      color: '#441752',
                      outline: 'none',
                      minWidth: '120px',
                      marginTop: '6px'
                    }}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
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

        /* Responsive Styles */
        @media (max-width: 900px) {
          .content-area {
            padding: 24px 10px;
          }
          .form-container {
            padding: 18px;
          }
          .form-grid {
            gap: 18px;
          }
        }
        @media (max-width: 600px) {
          .top-nav {
            flex-direction: column;
            height: auto;
            padding: 8px 6px;
            gap: 8px;
          }
          .nav-section {
            gap: 8px;
          }
          .content-area {
            padding: 12px 2vw;
            margin-top: 0;
          }
          .form-container {
            padding: 8px;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 18px;
          }
          .form-column {
            gap: 12px;
          }
          .date-group {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .form-actions {
            flex-direction: column;
            gap: 10px;
            padding-top: 10px;
          }
          .primary-btn, .create-btn {
            padding: 8px 14px;
            font-size: 12px;
          }
          .page-title {
            font-size: 18px;
          }
          .welcome-message {
            font-size: 18px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          label {
            font-size: 13px;
          }
          input, select {
            font-size: 13px;
            padding: 8px 6px;
          }
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

