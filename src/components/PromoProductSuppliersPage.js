import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

const promoProductSuppliersData = [
  { 
    name: 'Premium Promo Co.', 
    location: 'Downtown', 
    rating: 4.8, 
    image: '/images/venues/13.png',
  },
  { 
    name: 'Elite Branding Solutions', 
    location: 'Business District', 
    rating: 4.6, 
    image: '/images/venues/13.png',
  },
  { 
    name: 'Promo Masters Inc.', 
    location: 'City Center', 
    rating: 4.7, 
    image: '/images/venues/13.png',
  },
  { 
    name: 'Brand Boost Promotions', 
    location: 'Uptown', 
    rating: 4.5, 
    image: '/images/venues/13.png',
  }
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

const PromoProductSuppliersPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  let filtered = promoProductSuppliersData.filter(supplier =>
    supplier.name.toLowerCase().includes(search.toLowerCase()) ||
    supplier.location.toLowerCase().includes(search.toLowerCase())
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

      <div className={styles['hotels-toolbar']}>
        <input 
          className={styles['search-input']} 
          type="text" 
          placeholder="Search promo product suppliers..." 
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
        {filtered.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>
            No promo product suppliers found.
          </div>
        ) : (
          filtered.map((supplier, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img 
                src={process.env.PUBLIC_URL + supplier.image} 
                alt={supplier.name} 
                className={styles['hotel-image']} 
              />
              <h2 className={styles['hotel-name']}>{supplier.name}</h2>
              <div className={styles['hotel-location']}>{supplier.location}</div>
              <div className={styles['hotel-rating']}>
                {Array(5).fill('').map((_, i) => (
                  <span key={i} style={{ color: i < Math.floor(supplier.rating) ? '#FFD700' : '#ccc' }}>★</span>
                ))}
                <span style={{ marginLeft: '5px' }}>{supplier.rating}</span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PromoProductSuppliersPage;
