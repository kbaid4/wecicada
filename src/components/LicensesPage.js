import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

const licensesData = [
  { name: 'Liquor License', authority: 'State Excise Dept.', validity: '2026-03-31', image: '/images/venues/20.png' },
  { name: 'Music License', authority: 'Music Rights Org.', validity: '2025-07-15', image: '/images/venues/20.png' },
  { name: 'Food Service License', authority: 'Health Dept.', validity: '2025-10-10', image: '/images/venues/20.png' },
  { name: 'Trade License', authority: 'Municipal Corp.', validity: '2026-01-01', image: '/images/venues/20.png' }
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


const LicensesPage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  let filtered = licensesData.filter(license =>
    license.name.toLowerCase().includes(search.toLowerCase()) ||
    license.issuer.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === 'name') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'validity') {
    filtered = filtered.sort((a, b) => a.validity.localeCompare(b.validity));
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
        <input className={styles['search-input']} type="text" placeholder="Search licenses..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles['filter-sort-group']}>
          <select className={styles['sort-select']} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="validity">Sort by Validity</option>
          </select>
        </div>
      </div>
      <div className={styles['hotels-grid']}>
        {filtered.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>No licenses found.</div>
        ) : (
          filtered.map((license, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img src={process.env.PUBLIC_URL + license.image} alt={license.name} className={styles['hotel-image']} />
              <h2 className={styles['hotel-name']}>{license.name}</h2>
              <div className={styles['hotel-location']}>{license.authority}</div>
              <div className={styles['hotel-rating']}>Valid Until: {license.validity}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LicensesPage;
