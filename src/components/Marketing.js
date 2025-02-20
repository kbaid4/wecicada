import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Marketing = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [activeCategory, setActiveCategory] = useState('Marketing');
  const [selectedVenue, setSelectedVenue] = useState('');

  // Navigation data
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Suppliers', path: '/SuppliersProfile' }
  ];
  
  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];
  
  const categories = [
    { name: 'Venues & Facilities', path: '/SuppliersPage' },
    { name: 'Service Providers', path: '/ServiceProvider' },
    { name: 'Marketing', path: '/Marketing' },
    { name: 'Legal', path: '/Legal' }
  ];
  
  // Venue data with corrected image paths
  const venueTypes = [
    { name: 'Promo & Marketing Services', image: '17.png', path: '/PromoMarketing' },
    { name: 'Technology Providers', image: '18.png', path: '/Techpro' }
  ];

  const handleCreateEventClick = () => {
    navigate('/CreateEventPage'); // Navigate to the Create Event page
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
        navigate(item.path);
      }}
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

        {/* Category Tabs */}
        <nav className="category-tabs">
  {categories.map(category => (
    <button
      key={category.name}
      className={`tab-btn ${activeCategory === category.name ? 'active' : ''}`}
      onClick={() => {
        setActiveCategory(category.name);
        navigate(category.path);
      }}
    >
      {category.name}
    </button>
  ))}
</nav>


        {/* Venue Grid with Correct Image Paths */}
        <div className="venue-grid">
          {venueTypes.map(venue => (
            <div 
  key={venue.name}
  className={`venue-card ${selectedVenue === venue.name ? 'selected' : ''}`}
  onClick={() => {
    setSelectedVenue(venue.name);
    navigate(venue.path); // Navigate to the venue's path
  }}
>
              <div className="card-image">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/venues/${venue.image}`} 
                  alt={venue.name} 
                />
              </div>
              <div className="card-label">{venue.name}</div>
            </div>
          ))}
        </div>
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

        /* Category Tabs */
        .category-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--border-color);
        }

        .tab-btn {
          padding: 12px 24px;
          border: none;
          background: none;
          color: var(--text-light);
          font-size: 14px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .tab-btn.active {
          color: var(--primary-blue);
          font-weight: 600;
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--primary-blue);
        }

        /* Venue Grid with Images */
        .venue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .venue-card {
          background: #A888B5;
          border-radius: 8px;
          border: 2px solid var(--border-color);
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .card-image {
          height: 180px;
          overflow: hidden;
          position: relative;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-label {
          padding: 16px;
          font-weight: 500;
          text-align: center;
          color: #441752;
          background: #A888B5;
        }

        .venue-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.08);
          border-color: var(--primary-blue);
        }

        .venue-card:hover .card-image img {
          transform: scale(1.05);
        }

        .venue-card.selected {
          border: 2px solid var(--primary-blue);
          box-shadow: 0 4px 12px rgba(44, 125, 250, 0.15);
        }

        .venue-card.selected .card-label {
          background: rgba(44, 125, 250, 0.04);
        }
      `}</style>
    </div>
  );
};

export default Marketing;