import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAdminId } from '../hooks/useAdminId';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';

const Events = () => {
  const { adminId, loading } = useAdminId();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Events');
  
  // State to hold all created events
  const [eventsList, setEventsList] = useState([]);

  const location = useLocation();
  // Always reload events when navigating to this page
  useEffect(() => {
    const fetchEvents = async () => {
      if (!adminId) return;
      try {
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('admin_id', adminId);
        if (error) {
          console.error('Failed to fetch events:', error);
          // fallback to localStorage for offline/legacy
          const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
          setEventsList(storedEvents);
          return;
        }
        setEventsList(events);
      } catch (err) {
        console.error('Error fetching events:', err);
        // fallback to localStorage for offline/legacy
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEventsList(storedEvents);
      }
    };
    fetchEvents();
    // Optionally, listen to storage for offline changes
    const updateEvents = () => {
      const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
      setEventsList(storedEvents);
    };
    window.addEventListener('storage', updateEvents);
    return () => window.removeEventListener('storage', updateEvents);
  }, [adminId, supabase]); // Add supabase to dependency array

  // Navigation data
  // User info will be handled by UserProfile component

  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];
  
  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];  

  const handleCreateEventClick = () => {
    navigate('/CreateEventPage'); // Navigate to the Create Event page
  };

  const handleEventClick = (eventId) => {
    // Navigate to the management page for that event
    navigate(`/EventsManagementPage/${eventId}`);
  };

  const handleNavButtonClick = (path) => {
    navigate(path);  // Handle navigation on button click
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
                handleNavButtonClick(item.path); // Navigate on click
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
                if (item.path) handleNavButtonClick(item.path);
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
            <div className="welcome-section">
              <h1 className="welcome-text">Welcome,</h1>
              <UserProfile showName={true} />
            </div>
            <div className="action-btns">
              <button className="primary-btn" onClick={handleCreateEventClick}>Create Event</button>
            </div>
          </div>
        </header>

        {/* Display the created events */}
        {eventsList.length === 0 ? (
          <section className="events-display" style={{textAlign: 'center', marginTop: '48px'}}>
            <h2 className="section-title">My Progress</h2>
            <div style={{color: '#441752', fontSize: '20px', marginTop: '32px', background: '#fff', padding: '32px', borderRadius: '10px', display: 'inline-block'}}>
              No events found. Create your first event!
            </div>
          </section>
        ) : (
          <section className="events-display">
            <h2 className="section-title">My Progress</h2>
            <div className="event-cards-container">
              {eventsList.filter(ev => ev && ev.id && ev.admin_id === adminId).map((eventItem, index) => (
                <div
                  className="event-card"
                  key={eventItem.id}
                  onClick={() => handleEventClick(eventItem.id)}
                  style={{ background: '#441752', borderRadius: '10px', boxShadow: '0 2px 8px rgba(68,23,82,0.06)', padding: '18px 24px', color: '#A888B5', width: '100%' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div className="event-title" style={{ fontWeight: 700, fontSize: '20px', color: '#A888B5' }}>{eventItem.name}</div>
                    <span style={{ fontSize: '13px', color: eventItem.visibility === 'private' ? '#e57373' : '#388e3c', fontWeight: 600, border: '1px solid #A888B5', borderRadius: '6px', padding: '2px 8px', background: '#f7f7fa' }}>
                      {eventItem.visibility === 'private' ? 'Private' : 'Public'}
                    </span>
                  </div>
                  <div style={{ color: '#A888B5', fontSize: '15px', marginBottom: '14px' }}>
                    <span style={{ marginRight: '10px' }}><b>Type:</b> {eventItem.type}{eventItem.subType ? ` - ${eventItem.subType}` : ''}</span>
                  </div>
                  <div style={{ color: '#A888B5', fontSize: '14px', marginBottom: '14px' }}>
                    <b>Budget:</b> {eventItem.budget} &nbsp; <b>Total Spent:</b> {(() => {
                      if (Array.isArray(eventItem.tasks)) {
                        const sum = eventItem.tasks.reduce((acc, t) => acc + (parseFloat(t.budget) || 0), 0);
                        return sum > 0 ? sum : '-';
                      }
                      return '-';
                    })()}
                  </div>
                  <div style={{ color: '#A888B5', fontSize: '14px', marginBottom: '14px' }}>
                    <b>Location:</b> {eventItem.location}
                  </div>
                  <div style={{ color: '#A888B5', fontSize: '14px', marginBottom: '14px' }}>
                    <b>Start:</b> {eventItem.startDate} &nbsp; <b>End:</b> {eventItem.endDate}
                  </div>
                  <div style={{ color: '#A888B5', fontSize: '14px' }}>
                    {(() => {
                      let done = 0, remaining = 0, doneAmount = 0, remainingAmount = 0;
                      if (Array.isArray(eventItem.tasks)) {
                        eventItem.tasks.forEach(t => {
                          const amt = parseFloat(t.budget) || 0;
                          if (t.status && t.status.toLowerCase() === 'completed') {
                            done++;
                            doneAmount += amt;
                          } else {
                            remaining++;
                            remainingAmount += amt;
                          }
                        });
                      }
                      return (
                        <span>
                          <b>Tasks:</b> {done} done / {remaining} remaining<br/>
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        :root {
          --primary-blue: #441752;
          --hover-blue: #441752;
          --light-bg: #A888B5;
          --text-dark: #1A1F36;
          --text-light: #441752;
          --border-color: #441752;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--light-bg);
          font-family: 'Inter', sans-serif;
        }

        /* Top Navigation Styles */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          height: 64px;
          background: #441752;
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
          color: #A888B5;
          background: #441752;
        }

        /* User avatar styles now handled by UserProfile component */

        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .header-left {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .welcome-section {
          margin-bottom: 16px;
        }

        .welcome-text {
          font-size: 32px;
          color: #441752;
          margin: 0;
        }

        /* User name styles now handled by UserProfile component */

        .action-btns {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .primary-btn {
          padding: 10px 24px;
          background: var(--primary-blue);
          color: #A888B5;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn:hover {
          background: var(--hover-blue);
          transform: translateY(-1px);
        }

        /* Events Display */
        .events-display {
          margin-top: 32px;
        }

        .section-title {
          font-size: 24px;
          color: #441752;
          margin-bottom: 16px;
        }

        .event-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          overflow-x: auto;
        }

        /* Responsive Styles */
        @media (max-width: 900px) {
          .content-area {
            padding: 24px 10px;
          }
          .event-cards-container {
            gap: 16px;
          }
          .content-header {
            flex-direction: column;
            gap: 16px;
          }
          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
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
          .event-cards-container {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .event-card {
            padding: 10px;
          }
          .welcome-text {
            font-size: 22px;
          }
          .section-title {
            font-size: 17px;
          }
          .primary-btn {
            padding: 8px 14px;
            font-size: 12px;
          }
        }

        .event-card {
          background: #441752;
          border-radius: 8px;
          padding: 16px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .event-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .event-title {
          font-weight: 600;
          font-size: 18px;
          color: #A888B5;
          margin-bottom: 8px;
        }

        .event-card p {
          text-align: left;
          color: #A888B5;
        }
      `}</style>
    </div>
  );
};

export default Events;
