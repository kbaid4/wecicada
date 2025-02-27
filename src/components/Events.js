import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Events');
  
  // State to hold all created events
  const [eventsList, setEventsList] = useState([]);

  // On mount, retrieve events from localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEventsList(storedEvents);
  }, []);

  // Navigation data
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Suppliers', path: '/SuppliersProfile' }
  ];
  
  const userNavItems = [
    { name: 'My Work'},
    { name: 'My Team'}
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

{mainNavItems.map(item => (
            <button
              key={item.budget}
              className={`nav-btn ${activeNav === item.budget ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.budget);
                handleNavButtonClick(item.path); // Navigate on click
              }}
            >
              {item.budget}
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
            <div className="welcome-section">
              <h1 className="welcome-text">Welcome,</h1>
              <div className="username">Alex</div>
            </div>
            <div className="action-btns">
              <button className="primary-btn" onClick={handleCreateEventClick}>Create Event</button>
              <button onClick={() => navigate('/AddSupplier')} className="primary-btn">Add Suppliers</button>
            </div>
          </div>
        </header>

        {/* Display the created events */}
        <section onClick={() => navigate('/EventsManagementPage')} className="events-display">
          <h2 className="section-title">My Progress</h2>
          <div className="event-cards-container">
            {eventsList.map((eventItem, index) => (
              <div
                className="event-card"
                key={eventItem.id}
                onClick={() => handleEventClick(eventItem.id)}
              >
                <div className="event-title">Event {index + 1}</div>
                {/* Optionally display details */}
                <p>Name: {eventItem.name}</p>
                <p>Budget: {eventItem.budget}</p>
                <p>Total Spent: {eventItem.totalspent}</p>
                <p>Type: {eventItem.type}</p>
                <p>Sub-type: {eventItem.subType}</p>
                <p>Start Date: {eventItem.startDate}</p>
                <p>End Date: {eventItem.endDate}</p>
                <p>Location: {eventItem.location}</p>
                <p>Tasks Done: {eventItem.tasksDone}</p>
                <p>Tasks Remaining: {eventItem.tasksRemaining}</p>

              </div>
            ))}
          </div>
        </section>
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

        /* Main Content Styles */
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

        .username {
          font-size: 24px;
          color: #441752;
          font-weight: 500;
          margin-top: 4px;
        }

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
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 24px;
        }

        .event-card {
          background: #441752;
          border-radius: 8px;
          padding: 16px;
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
