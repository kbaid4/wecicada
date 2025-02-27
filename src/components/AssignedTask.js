import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SupplierSide = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');

  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Messages', path: '/Message' }
  ];

  const userNavItems = [
    { name: 'My Work', path: '/AssignedTask' },
    { name: 'My Team'}
  ];

  const tasks = [
    { title: 'Task 2', event: 'Event 1', progress: '20% Completed', cost: '$1000' },
    { title: 'Task 1', event: 'Event 3', progress: '20% Completed', cost: '$1000' }
  ];

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-section left">
          <img 
            src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} 
            alt="CITADA Logo" 
            className="nav-logo"
          />
          {mainNavItems.map(item => (
            <button
              key={item.name}
              className={`nav-btn ${activeNav === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="nav-section right">
          {userNavItems.map(item => (
            <button
              key={item.name}
              className="nav-btn"
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          <div className="user-profile">A</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="content-area">
      <header className="content-header">
  <div className="welcome-section">
    <h1 className="welcome-text">Welcome,</h1>
    <div className="username">Alex</div>
  </div>
  <div className="action-btns">
    <button onClick={() => navigate('/EditProfile')} className="primary-btn">Edit Profile</button>
  </div>
</header>

      </main>

      {/* Tasks Section */}
      <h2 className="section-title">My Tasks</h2>
      <div className="container">
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <button className="jump-btn" onClick={() => navigate('/EventsManagementPage')}>Jump to Event</button>
            </div>
            <p className="task-subtitle">{task.event}</p>
            <div className="task-info">
              <div className="progress-bar">{task.progress}</div>
              <div className="cost-info">Total Spent: {task.cost}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Styles */}
      <style jsx>{`
        :root {
          --primary-blue: #441752;
          --hover-blue: #441752;
          --light-bg: #A888B5;
          --text-dark: #1A1F36;
          --text-light: #441752;
          --border-color: #441752;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--light-bg);
          font-family: 'Inter', sans-serif;
        }

        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          height: 64px;
          background: var(--primary-blue);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-logo {
          height: 28px;
          margin-right: 16px;
        }

        .nav-btn {
          padding: 8px 16px;
          border: none;
          background: none;
          color: var(--light-bg);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: var(--light-bg);
          color: var(--primary-blue);
        }

        .nav-btn.active {
          background: var(--light-bg);
          color: var(--primary-blue);
        }

        .user-profile {
          width: 32px;
          height: 32px;
          background: var(--light-bg);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* This ensures vertical centering */
  margin-bottom: 32px;
  padding: 0 40px; /* Adding padding to match overall content padding */
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.welcome-text {
  font-size: 32px;
  color: var(--primary-blue);
  margin: 0;
}

.username {
  font-size: 24px;
  color: var(--primary-blue);
  font-weight: 500;
}

.action-btns {
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  padding: 10px 24px;
  background: var(--primary-blue);
  color: var(--light-bg);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
}


        .section-title {
          font-size: 24px;
          color: var(--primary-blue);
          margin-left: 40px;
        }

        .container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
        }

        .task-card {
          background: var(--primary-blue);
          color: var(--light-bg);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-title {
          font-size: 20px;
          font-weight: bold;
        }

        .task-subtitle {
          font-size: 16px;
          color: var(--light-bg);
        }

        .task-info {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .progress-bar, .cost-info {
          background: var(--light-bg);
          color: var(--primary-blue);
          padding: 8px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
        }

        .jump-btn {
          background: var(--light-bg);
          color: var(--primary-blue);
          padding: 8px 16px;
          border: none;
          border-radius: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
      `}</style>
    </div>
  );
};

export default SupplierSide;
