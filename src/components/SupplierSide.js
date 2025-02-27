import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const events = [
  {
    name: "Event 1",
    date: "10/05/2025 - 12/11/2025",
    description: "Simply dummy text of the printing and typesetting industry...",
    type: "Social Event",
    subType: "Concert",
    location: "USA",
  },
  {
    name: "Event 2",
    date: "15/06/2025 - 20/12/2025",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    type: "Corporate Event",
    subType: "Conference",
    location: "Canada",
  }
];

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="card-header">
        <h2>{event.name}</h2>
        <button className="message-btn" onClick={() => navigate('/MessagesPage')}>Message</button>
      </div>
      <p className="date">{event.date}</p>
      <p className="description">{event.description}</p>
      <div className="cost-buttons">
        <button>Cost</button>
        <button>Type: {event.type}</button>
        <button>Sub-type: {event.subType}</button>
        <button>Location: {event.location}</button>
      </div>
    </div>
  );
};

const SupplierSide = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');

  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Messages', path: '/MessagesPage'}
  ];
  
  const userNavItems = [
    { name: 'My Work', path: '/AssignedTask' },
    { name: 'My Team'}
  ];
  
  return (
    <div className="app-container">
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
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          <div className="user-profile">A</div>
        </div>
      </nav>

      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <div className="welcome-section">
              <h1 className="welcome-text">Welcome,</h1>
              <div className="username">Alex</div>
            </div>
            <div className="action-btns">
              <button onClick={() => navigate('/EditProfile')} className="primary-btn">Edit Profile</button>
            </div>
          </div>
        </header>
      </main>

      <h2 className="section-title">Browse Events</h2>
      <div className="container">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>

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

        .section-title {
          font-size: 24px;
          color: #441752;
          margin-left: 40px;
        }
        
        .container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }

        .card {
          background: #441752;
          color: #A888B5;
          padding: 20px;
          border-radius: 10px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
        }
        
        .cost-buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .message-btn, .cost-buttons button {
          background: #A888B5;
          color: #441752;
          border: none;
          padding: 10px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default SupplierSide;
