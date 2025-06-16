import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

// Dummy data for Tent Rental Companies
const companiesData = [
  { 
    name: 'Premier Tent Rentals', 
    location: 'Downtown', 
    rating: 4.8, 
    image: '/images/venues/4.png'
  },
  { 
    name: 'Luxury Event Tents', 
    location: 'Business District', 
    rating: 4.9, 
    image: '/images/venues/4.png'
  },
  { 
    name: 'Elite Tent Solutions', 
    location: 'Uptown', 
    rating: 4.7, 
    image: '/images/venues/4.png'
  },
  { 
    name: 'Grand Marquee Rentals', 
    location: 'West End', 
    rating: 4.6, 
    image: '/images/venues/4.png'
  },
  { 
    name: 'Classic Canopy Rentals', 
    location: 'East District', 
    rating: 4.8, 
    image: '/images/venues/4.png'
  },
  { 
    name: 'Royal Pavilion Rentals', 
    location: 'Theater District', 
    rating: 4.7, 
    image: '/images/venues/4.png'
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

const TentRentalCompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  // Filtering and sorting logic
  let filteredCompanies = companiesData.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase()) ||
    company.location.toLowerCase().includes(search.toLowerCase())
  );
  
  if (sort === 'name') {
    filteredCompanies = filteredCompanies.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filteredCompanies = filteredCompanies.sort((a, b) => b.rating - a.rating);
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
          placeholder="Search tent rental companies..."
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
        {filteredCompanies.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>
            No companies found.
          </div>
        ) : (
          filteredCompanies.map((company, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img 
                src={process.env.PUBLIC_URL + company.image} 
                alt={company.name} 
                className={styles['hotel-image']} 
              />
              <h2 className={styles['hotel-name']}>{company.name}</h2>
              <div className={styles['hotel-location']}>{company.location}</div>
              <div className={styles['hotel-rating']}>Rating: {company.rating} ⭐</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TentRentalCompaniesPage;
