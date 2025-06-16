import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

const outdoorVenuesData = [
  { name: 'Green Park', location: 'Northside', rating: 4.7, image: '/images/venues/4.png' },
  { name: 'Sunset Gardens', location: 'West End', rating: 4.5, image: '/images/venues/4.png' },
  { name: 'Riverfront Lawn', location: 'East Bank', rating: 4.4, image: '/images/venues/4.png' },
  { name: 'Mountain View Grounds', location: 'Outskirts', rating: 4.6, image: '/images/venues/4.png' }
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

const OutdoorVenuesPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  let filtered = outdoorVenuesData.filter(venue =>
    venue.name.toLowerCase().includes(search.toLowerCase()) ||
    venue.location.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === 'name') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filtered = filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className={styles['app-container']}>
      <nav className={styles['top-nav']}>
        <div className={styles['nav-section']}>
          <img src={process.env.PUBLIC_URL + '/images/landingpage/logo.png'} alt="CITADA Logo" className={styles['nav-logo']} onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
          {mainNavItems.map(item => (
            <button key={item.name} className={styles['nav-btn']} onClick={() => navigate(item.path)}>{item.name}</button>
          ))}
        </div>
        <div className={styles['nav-section']}>
          {rightNavItems.map(item => (
            <button key={item.name} className={styles['nav-btn']} onClick={() => navigate(item.path)}>{item.name}</button>
          ))}
          <UserProfile showName={false} />
        </div>
      </nav>
      <div className={styles['hotels-toolbar']}>
        <input className={styles['search-input']} type="text" placeholder="Search outdoor venues..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles['filter-sort-group']}>
          <select className={styles['sort-select']} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>
      <div className={styles['hotels-grid']}>
        {filtered.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>No outdoor venues found.</div>
        ) : (
          filtered.map((venue, idx) => (
            <div key={idx} className={styles['hotel-card']} style={{ cursor: 'pointer' }} onClick={() => navigate('/SuppliersProfile')}>
              <img src={process.env.PUBLIC_URL + venue.image} alt={venue.name} className={styles['hotel-image']} />
              <h2 className={styles['hotel-name']}>{venue.name}</h2>
              <div className={styles['hotel-location']}>{venue.location}</div>
              <div className={styles['hotel-rating']}>Rating: {venue.rating} ⭐</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OutdoorVenuesPage;
