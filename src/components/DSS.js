import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DSS = () => {
  // Retrieve user's name from localStorage (set at sign up)
  const storedName = localStorage.getItem('signupName');
  const displayName = storedName ? storedName : 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [activeCategory, setActiveCategory] = useState('Decor & Styling');
  const [selectedVenue, setSelectedVenue] = useState('');

  // Navigation data
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];

  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];

  const categories = [
    { name: 'Venues & Facilities', path: '/SuppliersPage' },
    { name: 'Service Providers', path: '/ServiceProvider' },
    { name: 'Marketing', path: '/Marketing' },
    { name: 'Legal', path: '/Legal' },
    { name: 'Decor & Styling', path: '/dss' }
  ];

  // Venue data with corrected image paths and navigation
  const venueTypes = [
    { name: 'Florists', image: '8.png', path: '/florists' },
    { name: 'Event Decorators', image: '9.png', path: '/event-decorators' },
    { name: 'Thematic Design Specialists', image: '10.png', path: '/thematic-design-specialists' },
    { name: 'Balloon Artists', image: '11.png', path: '/balloon-artists' },
    { name: 'Table Setting Rental', image: '12.png', path: '/table-setting-rental' },
    { name: 'Banner Printing Services', image: '13.png', path: '/banner-printing-services' },
    { name: 'Event Furniture Rental', image: '14.png', path: '/event-furniture-rental' },
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
          <div className="user-profile">{displayInitial}</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <div className="welcome-section">
              <h1 className="welcome-text">Welcome, {displayName}</h1>
            </div>
            <div className="action-btns">
              <button className="primary-btn" onClick={handleCreateEventClick}>Create Event</button>
            </div>
          </div>
        </header>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0 16px 0', flexWrap: 'wrap' }}>
          <nav className="category-tabs" style={{ display: 'flex', gap: '8px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#441752', borderRadius: '8px', padding: '4px 8px', minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search"
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: 'none',
                fontSize: '13px',
                background: 'transparent',
                color: '#A888B5',
                outline: 'none',
                width: '100px',
                minWidth: '60px',
                marginRight: '4px',
                '::placeholder': { color: '#A888B5' }
              }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: 'none',
                fontSize: '13px',
                background: 'transparent',
                color: '#A888B5',
                outline: 'none',
                minWidth: '90px'
              }}
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="">Sort/Filter</option>
              <option value="priceLowHigh">Low to High Price</option>
              <option value="priceHighLow">High to Low Price</option>
              <option value="favourite">Favourite</option>
              <option value="popularityLowHigh">Low to High Popularity</option>
              <option value="popularityHighLow">High to Low Popularity</option>
            </select>
          </div>
        </div>

        {/* Decor & Styling Services Heading */}
        <h2 className="catering-heading">Decor & Styling Services</h2>

        {/* Venue Grid with Correct Image Paths */}
        <div className="venue-grid">
          {venueTypes.map(venue => (
            <div 
              key={venue.name}
              className={`venue-card ${selectedVenue === venue.name ? 'selected' : ''}`}
              onClick={() => navigate(venue.path)}
              style={{ cursor: 'pointer' }}
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
        
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          height: 64px;
          background-color: var(--primary-blue);
          color: white;
        }
        
        .nav-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .nav-logo {
          height: 40px;
          margin-right: 16px;
          cursor: pointer;
        }
        
        .nav-btn {
          background: none;
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .nav-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .nav-btn.active {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .user-profile {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #6d1b7b;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
        }
        
        .content-area {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .welcome-text {
          font-size: 24px;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0;
        }
        
        .primary-btn {
          background-color: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .primary-btn:hover {
          background-color: var(--hover-blue);
        }
        
        .category-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .tab-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: white;
          color: var(--text-light);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .tab-btn.active {
          background-color: var(--primary-blue);
          color: white;
          border-color: var(--primary-blue);
        }
        
        .catering-heading {
          font-size: 24px;
          color: var(--text-dark);
          margin: 24px 0 16px;
        }
        
        .venue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 16px;
        }
        
        .venue-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .venue-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .venue-card.selected {
          border: 2px solid var(--primary-blue);
        }
        
        .card-image {
          width: 100%;
          height: 140px;
          overflow: hidden;
        }
        
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .card-label {
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-dark);
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default DSS;
