import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

// Dummy data for hotels
const hotelsData = [
  { name: 'Grand Plaza Hotel', location: 'Downtown', rating: 4.5, image: '/images/venues/2.png' },
  { name: 'Sunrise Suites', location: 'City Center', rating: 4.2, image: '/images/venues/2.png' },
  { name: 'Royal Orchid', location: 'Near Airport', rating: 4.7, image: '/images/venues/2.png' },
  { name: 'Ocean View Resort', location: 'Seaside', rating: 4.6, image: '/images/venues/2.png' },
  { name: 'Mountain Retreat', location: 'Uptown', rating: 4.3, image: '/images/venues/2.png' },
  { name: 'City Lights Inn', location: 'Central Park', rating: 4.1, image: '/images/venues/2.png' },
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
// User info will be handled by UserProfile component

const HotelsListPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  // Filtering and sorting logic
  let filteredHotels = hotelsData.filter(hotel =>
    hotel.name.toLowerCase().includes(search.toLowerCase()) ||
    hotel.location.toLowerCase().includes(search.toLowerCase())
  );
  
  if (sort === 'name') {
    filteredHotels = filteredHotels.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filteredHotels = filteredHotels.sort((a, b) => b.rating - a.rating);
  }

  // Get unique locations for filter
  const locations = Array.from(new Set(hotelsData.map(h => h.location)));

  return (
    <div className={styles['app-container']}>
      {/* Top Navigation Bar */}
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
            <button
              key={item.name}
              className={styles['nav-btn']}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className={styles['nav-section']}>
          {rightNavItems.map(item => (
            <button
              key={item.name}
              className={styles['nav-btn']}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </button>
          ))}
          <UserProfile showName={false} />
        </div>
      </nav>

      {/* Toolbar: Search, Filter, Sort */}
      <div className={styles['hotels-toolbar']}>
        <input
          className={styles['search-input']}
          type="text"
          placeholder="Search hotels..."
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

      {/* Hotels Grid */}
      <div className={styles['hotels-grid']}>
        {filteredHotels.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>No hotels found.</div>
        ) : (
          filteredHotels.map((hotel, idx) => (
            <div
              key={idx}
              className={styles['hotel-card']}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img
                src={process.env.PUBLIC_URL + hotel.image}
                alt={hotel.name}
                className={styles['hotel-image']}
              />
              <h2 className={styles['hotel-name']}>{hotel.name}</h2>
              <div className={styles['hotel-location']}>{hotel.location}</div>
              <div className={styles['hotel-rating']}>Rating: {hotel.rating} ⭐</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HotelsListPage;
