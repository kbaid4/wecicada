import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

// Dummy data for Event Photographers
const photographersData = [
  { 
    name: 'Moment Capture Studio', 
    location: 'Downtown', 
    rating: 4.8, 
    image: '/images/venues/8.png'
  },
  { 
    name: 'Prestige Event Photography', 
    location: 'Business District', 
    rating: 4.9, 
    image: '/images/venues/8.png'
  },
  { 
    name: 'Elegant Shots Co.', 
    location: 'Uptown', 
    rating: 4.7, 
    image: '/images/venues/8.png'
  },
  { 
    name: 'Flash & Focus', 
    location: 'West End', 
    rating: 4.6, 
    image: '/images/venues/8.png'
  },
  { 
    name: 'The Photo Collective', 
    location: 'East District', 
    rating: 4.8, 
    image: '/images/venues/8.png'
  },
  { 
    name: 'Perfect Frame Photography', 
    location: 'Theater District', 
    rating: 4.7, 
    image: '/images/venues/8.png'
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

const EventPhotographersPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  // Filtering and sorting logic
  let filteredPhotographers = photographersData.filter(photographer =>
    photographer.name.toLowerCase().includes(search.toLowerCase()) ||
    photographer.location.toLowerCase().includes(search.toLowerCase())
  );
  
  if (sort === 'name') {
    filteredPhotographers = filteredPhotographers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filteredPhotographers = filteredPhotographers.sort((a, b) => b.rating - a.rating);
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
          placeholder="Search event photographers..."
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
        {filteredPhotographers.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>
            No photographers found.
          </div>
        ) : (
          filteredPhotographers.map((photographer, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img 
                src={process.env.PUBLIC_URL + photographer.image} 
                alt={photographer.name} 
                className={styles['hotel-image']} 
              />
              <h2 className={styles['hotel-name']}>{photographer.name}</h2>
              <div className={styles['hotel-location']}>{photographer.location}</div>
              <div className={styles['hotel-rating']}>Rating: {photographer.rating} ⭐</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventPhotographersPage;
