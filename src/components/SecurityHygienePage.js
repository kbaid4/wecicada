import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import styles from './HotelsListPage.module.css';

const securityHygieneData = [
  { name: 'Fire Drill Certificate', authority: 'Fire Dept.', validity: '2026-02-28', image: '/images/venues/21.png' },
  { name: 'Food Safety Audit', authority: 'Health Inspector', validity: '2025-08-20', image: '/images/venues/21.png' },
  { name: 'Security Staff Verification', authority: 'Police Dept.', validity: '2026-04-10', image: '/images/venues/21.png' },
  { name: 'Sanitation Certificate', authority: 'Sanitation Dept.', validity: '2025-12-01', image: '/images/venues/21.png' }
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

const SecurityHygienePage = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const navigate = useNavigate();

  let filtered = securityHygieneData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.authority.toLowerCase().includes(search.toLowerCase())
  );
  
  if (sort === 'name') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'validity') {
    filtered = filtered.sort((a, b) => new Date(b.validity) - new Date(a.validity));
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
        <input className={styles['search-input']} type="text" placeholder="Search security/hygiene..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles['filter-sort-group']}>
          <select className={styles['sort-select']} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="validity">Sort by Validity</option>
          </select>
        </div>
      </div>
      <div className={styles['hotels-grid']}>
        {filtered.length === 0 ? (
          <div style={{ color: '#441752', fontWeight: 500, fontSize: 18, marginTop: 40 }}>No security/hygiene records found.</div>
        ) : (
          filtered.map((item, idx) => (
            <div 
              key={idx} 
              className={styles['hotel-card']} 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/SuppliersProfile')}
            >
              <img src={process.env.PUBLIC_URL + item.image} alt={item.name} className={styles['hotel-image']} />
              <h2 className={styles['hotel-name']}>{item.name}</h2>
              <div className={styles['hotel-location']}>{item.authority}</div>
              <div className={styles['hotel-rating']}>Valid Until: {item.validity}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SecurityHygienePage;
