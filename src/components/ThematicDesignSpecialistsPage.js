import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

// Dummy data for Thematic Design Specialists
const thematicDesignersData = [
  { 
    name: 'Theme Masters', 
    location: 'Downtown', 
    rating: 4.9, 
    image: '/images/venues/10.png'
  },
  { 
    name: 'Immersive Designs', 
    location: 'Arts District', 
    rating: 4.8, 
    image: '/images/venues/10.png'
  },
  { 
    name: 'Concept Creators', 
    location: 'City Center', 
    rating: 4.7, 
    image: '/images/venues/10.png'
  },
  { 
    name: 'Themed Events Co.', 
    location: 'Uptown', 
    rating: 4.8, 
    image: '/images/venues/10.png'
  },
  { 
    name: 'Design Alchemy', 
    location: 'West End', 
    rating: 4.6, 
    image: '/images/venues/10.png'
  },
  { 
    name: 'Atmosphere Design', 
    location: 'Theater District', 
    rating: 4.9, 
    image: '/images/venues/10.png'
  },
];

const mainNavItems = [
  { name: 'Home', path: '/SuppliersPage' },
  { name: 'Events', path: '/Events' },
  { name: 'Messages', path: '/MessagesPage' },
];

const rightNavItems = [
  { name: 'My Work', path: '/my-work' },
  { name: 'My Team', path: '/my-team' },
];

const ThematicDesignSpecialistsPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  // Filtering and sorting logic
  let filteredDesigners = thematicDesignersData.filter(designer =>
    designer.name.toLowerCase().includes(search.toLowerCase()) ||
    designer.location.toLowerCase().includes(search.toLowerCase())
  );
  
  if (sort === 'name') {
    filteredDesigners = filteredDesigners.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filteredDesigners = filteredDesigners.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className={styles['app-container']}>
      <nav className={styles['top-nav']}>
        <div className={styles['nav-section']}>
          <img 
            src={process.env.PUBLIC_URL + '/images/landingpage/logo.png'} 
            alt="CITADA Logo" 
            className={styles['nav-logo']} 
            onClick={() => navigate('/')} 
            style={{ cursor: 'pointer' }} 
          />
          {mainNavItems.map(item => (
            <button key={item.name} className={styles['nav-btn']} onClick={() => navigate(item.path)}>
              {item.name}
            </button>
          ))}
        </div>
        <div className={styles['nav-section']}>
          {rightNavItems.map(item => (
            <button key={item.name} className={styles['nav-btn']} onClick={() => navigate(item.path)}>
              {item.name}
            </button>
          ))}
          <UserProfile showName={false} />
        </div>
      </nav>

      <div className={styles['hotels-toolbar']}>
        <input
          className={styles['search-input']}
          type="text"
          placeholder="Search thematic design specialists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles['filter-sort-group']}>
          <select 
            className={styles['sort-select']} 
            value={sort} 
            onChange={e => setSort(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      <div className={styles['hotels-grid']}>
        {filteredDesigners.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>
            No thematic design specialists found.
          </div>
        ) : (
          filteredDesigners.map((designer, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img 
                src={process.env.PUBLIC_URL + designer.image} 
                alt={designer.name} 
                className={styles['hotel-image']} 
              />
              <h2 className={styles['hotel-name']}>{designer.name}</h2>
              <div className={styles['hotel-location']}>{designer.location}</div>
              <div className={styles['hotel-rating']}>Rating: {designer.rating} ⭐</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ThematicDesignSpecialistsPage;
