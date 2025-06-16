import React, { useState, useEffect } from 'react';
import { useAdminId } from '../hooks/useAdminId';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logEventChange } from '../utils/auditLogger';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('Events');

  // Nav bar items (reuse from MyTeam)
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];
  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];
  // User profile initial logic
  const isSupplier = localStorage.getItem('isSupplier') === 'true';
  const [userInitial, setUserInitial] = useState('U');
  useEffect(() => {
    const name = isSupplier
      ? localStorage.getItem('supplierName') || 'Supplier'
      : localStorage.getItem('signupName') || 'Admin';
    setUserInitial(name && name.length > 0 ? name.charAt(0).toUpperCase() : 'U');
  }, [isSupplier]);

  // Options (should match CreateEventPage)
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
const { adminId } = useAdminId();
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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
        if (error) {
          // fallback to localStorage for offline/legacy
          const eventsArr = JSON.parse(localStorage.getItem('events')) || [];
          const foundEvent = eventsArr.find(ev => ev.id === eventId);
          setFormData(foundEvent);
          setLoading(false);
          return;
        }
        setFormData(data);
        setLoading(false);
      } catch (err) {
        // fallback to localStorage for offline/legacy
        const eventsArr = JSON.parse(localStorage.getItem('events')) || [];
        const foundEvent = eventsArr.find(ev => ev.id === eventId);
        setFormData(foundEvent);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // First try to update in Supabase
      try {
        const { data, error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', eventId);
        if (error) {
          console.warn('Supabase update failed, falling back to localStorage:', error);
          throw error;
        }
      } catch (dbError) {
        console.warn('Database operation failed, using localStorage only:', dbError);
        // Continue with localStorage update
      }
      // Also update in localStorage for immediate UI update
      const events = JSON.parse(localStorage.getItem('events')) || [];
      const updatedEvents = events.map(ev =>
        ev.id === eventId ? { ...ev, ...formData } : ev
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      // Log the update
      if (userId) {
        try {
          await logEventChange('update', { ...formData, id: eventId }, userId);
        } catch (logError) {
          console.error('Error logging event update:', logError);
        }
      }
      
      navigate(`/EventsManagementPage/${eventId}`);
    } catch (error) {
      console.error('Error saving event:', error);
      // Fallback to localStorage if Supabase update fails
      const events = JSON.parse(localStorage.getItem('events')) || [];
      const updatedEvents = events.map(ev =>
        ev.id === eventId ? { ...ev, ...formData } : ev
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      navigate(`/EventsManagementPage/${eventId}`);
    }
  };

  if (loading) return <div style={{padding:'40px'}}>Loading...</div>;
  if (!formData) return <div style={{padding:'40px'}}>Event not found.</div>;

  return (
    <div className="app-container">
      <style jsx>{`
        :root {
          --primary-purple: #441752;
          --secondary-purple: #A888B5;
          --background-light: #A888B5;
          --background-dark: #441752;
          --input-bg: #fff;
          --input-border: #A888B5;
          --card-bg: #441752;
          --divider: #A888B5;
          --text-dark: #1A1F36;
          --text-light: #fff;
          --btn-primary: #A888B5;
          --btn-primary-text: #441752;
          --btn-secondary: #d1b3e0;
          --btn-secondary-text: #441752;
          --btn-danger: #e57373;
        }
        body, .edit-event-root {
          background: var(--background-light);
          min-height: 100vh;
        }
        .content-area {
          padding: 40px 0 0 0;
          background: var(--background-light);
          min-height: 100vh;
        }
        .edit-header {
          padding: 32px 0 12px 0;
          font-family: 'Inter', sans-serif;
          margin-left: 130px;
        }
        .edit-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-purple);
          margin-bottom: 0;
        }
        .edit-welcome {
          font-size: 1.7rem;
          color: var(--primary-purple);
          margin-top: 0;
          margin-bottom: 24px;
        }
        .form-container {
          background: var(--card-bg);
          border-radius: 10px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          max-width: 1100px;
          margin: 0 auto;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px 40px;
          margin-bottom: 24px;
        }
        .form-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        label {
          font-size: 15px;
          color: var(--secondary-purple);
          font-weight: 500;
        }
        input,
        select {
          padding: 12px 10px;
          border: 1px solid var(--input-border);
          border-radius: 6px;
          font-size: 15px;
          background: var(--input-bg);
          color: var(--primary-purple);
          width: 100%;
        }
        input[type="date"]::-webkit-input-placeholder { color: var(--secondary-purple); }
        .date-group {
          display: flex;
          flex-direction: row;
          gap: 24px;
        }
        .divider {
          border: none;
          border-top: 1px solid var(--divider);
          margin: 36px 0 24px 0;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }
        .primary-btn {
          padding: 12px 32px;
          background: var(--btn-primary);
          color: var(--btn-primary-text);
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .primary-btn:disabled {
          background: var(--btn-secondary);
          color: var(--btn-secondary-text);
          cursor: not-allowed;
        }
        .primary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 125, 250, 0.2);
        }
        .danger-btn {
          background: var(--btn-danger) !important;
          color: #fff !important;
        }
        .nav-section.left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-logo {
          height: 36px;
        }
        .nav-title {
          font-size: 20px;
          font-weight: bold;
          color: #A888B5;
          margin-left: 8px;
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
          color: #A888B5;
          background: #441752;
        }
        .user-profile {
          width: 32px;
          height: 32px;
          background: #A888B5;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }
        .form-container {
          background: #441752;
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
        .date-group {
          display: flex;
          flex-direction: column;
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
        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 125, 250, 0.2);
        }
        .create-btn {
          padding: 12px 32px;
        }
      `}</style>

      <main className="content-area edit-event-root">
        <div className="edit-header">
          <div className="edit-title">Edit Event</div>
        </div>
        <div className="form-container">
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="form-grid">
              <div className="form-column">
                <div className="input-group">
                  <label>Event Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Budget</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    {typeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Sub-Type</label>
                  <select name="subType" value={formData.subType} onChange={handleChange}>
                    <option value="">Select Sub-Type</option>
                    {(subTypeOptions[formData.type] || []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-column">
                <div className="input-group">
  <label>Add Planner</label>
  <select
    name="addadmin"
    value={formData.addadmin}
    onChange={handleChange}
    disabled={plannersLoading}
  >
    <option value="">Select Planner</option>
    {plannersLoading ? (
      <option value="" disabled>Loading planners...</option>
    ) : (
      adminOptions.length === 0 ? (
        <option value="" disabled>No planners available</option>
      ) : (
        adminOptions.map(admin => {
          if (admin && typeof admin === 'object' && admin.name && admin.email) {
            return (
              <option key={admin.email} value={admin.email}>
                {admin.name} ({admin.email})
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
                  <input type="text" name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div className="date-group">
                  <div className="input-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Visibility</label>
                  <select name="visibility" value={formData.visibility} onChange={handleChange}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn">Save Changes</button>
              <button type="button" className="primary-btn" style={{ background: '#e57373', color: '#fff'}} onClick={() => navigate(`/EventsManagementPage/${eventId}`)}>Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditEventPage;
