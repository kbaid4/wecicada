import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

// Dummy data for Food Trucks
const foodTrucksData = [
  { 
    name: 'Taco Fiesta Truck', 
    location: 'Downtown Food Park', 
    rating: 4.6, 
    image: '/images/venues/6.png',
  },
  { 
    name: 'Burger Beast', 
    location: 'City Center', 
    rating: 4.5, 
    image: '/images/venues/6.png',
  },
  { 
    name: 'Curry on Wheels', 
    location: 'Riverside Market', 
    rating: 4.7, 
    image: '/images/venues/6.png',
  },
  { 
    name: 'Pizza Mobile', 
    location: 'Central Square', 
    rating: 4.4, 
    image: '/images/venues/6.png',
  },
  { 
    name: 'Sushi Rollin', 
    location: 'Business District', 
    rating: 4.8, 
    image: '/images/venues/6.png',
  },
  { 
    name: 'BBQ Pit Stop', 
    location: 'Park Avenue', 
    rating: 4.6, 
    image: '/images/venues/6.png',
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

const FoodTrucksPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  // Filtering and sorting logic
  let filteredTrucks = foodTrucksData.filter(truck =>
    truck.name.toLowerCase().includes(search.toLowerCase()) ||
    truck.location.toLowerCase().includes(search.toLowerCase())
  );
  
  if (sort === 'name') {
    filteredTrucks = filteredTrucks.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'rating') {
    filteredTrucks = filteredTrucks.sort((a, b) => b.rating - a.rating);
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
          placeholder="Search food trucks by name, location..."
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
        {filteredTrucks.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>
            No food trucks found.
          </div>
        ) : (
          filteredTrucks.map((truck, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img 
                src={process.env.PUBLIC_URL + truck.image} 
                alt={truck.name} 
                className={styles['hotel-image']} 
              />
              <h2 className={styles['hotel-name']}>{truck.name}</h2>
              <div className={styles['hotel-location']}>{truck.location}</div>
              <div className={styles['hotel-rating']}>Rating: {truck.rating} ⭐</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodTrucksPage;
