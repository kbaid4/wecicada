import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

// Dummy data for Dancers/Choreographers
const dancersData = [
  { 
    name: 'Urban Motion Crew', 
    location: 'Downtown', 
    rating: 4.8, 
    image: '/images/venues/20.png',

  },
  { 
    name: 'Ballet Elegance', 
    location: 'City Center', 
    rating: 4.9, 
    image: '/images/venues/20.png',

  },
  { 
    name: 'Latin Rhythms', 
    location: 'Uptown', 
    rating: 4.7, 
    image: '/images/venues/20.png',

  },
  { 
    name: 'Bollywood Beats', 
    location: 'West End', 
    rating: 4.6, 
    image: '/images/venues/20.png',

  },
  { 
    name: 'Contemporary Flow', 
    location: 'East District', 
    rating: 4.8, 
    image: '/images/venues/20.png',

  },
  { 
    name: 'Street Kings', 
    location: 'Theater District', 
    rating: 4.7, 
    image: '/images/venues/20.png',

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

const DancersChoreographersPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  // Filtering and sorting logic
  let filteredDancers = dancersData.filter(dancer =>
    dancer.name.toLowerCase().includes(search.toLowerCase()) ||
    dancer.location.toLowerCase().includes(search.toLowerCase())
  );
  
  if (sort === 'name') {
    filteredDancers = filteredDancers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filteredDancers = filteredDancers.sort((a, b) => b.rating - a.rating);
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
          placeholder="Search dancers..."
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
        {filteredDancers.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>
            No dancers found.
          </div>
        ) : (
          filteredDancers.map((dancer, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img 
                src={process.env.PUBLIC_URL + dancer.image} 
                alt={dancer.name} 
                className={styles['hotel-image']} 
              />
              <h2 className={styles['hotel-name']}>{dancer.name}</h2>
              <div className={styles['hotel-location']}>{dancer.location}</div>
              <div className={styles['hotel-rating']}>Rating: {dancer.rating} ⭐</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DancersChoreographersPage;
