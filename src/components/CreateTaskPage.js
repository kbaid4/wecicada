import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CreateTaskPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Add an activeNav state similar to the Events component
  const [activeNav, setActiveNav] = useState('Events');

  // Navigation items based on the Events component
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Suppliers', path: '/SuppliersProfile' }
  ];

  const userNavItems = [
    { name: 'My Work', path: '/MyWork' },
    { name: 'My Team', path: '/MyTeam' }
  ];

  const [taskData, setTaskData] = useState({
    name: '',
    supplier: '',
    status: '',
    date: '',
    day: ''
  });

  const statusOptions = ['Stopped', 'In Progress', 'Negotiation'];

  useEffect(() => {
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {}; 
    console.log("Loaded tasks for event:", eventId, allTasksObj[eventId] || []);
  }, [eventId]);
  
  const handleCreateTask = () => {
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    if (!allTasksObj[eventId]) {
      allTasksObj[eventId] = [];
    }
    allTasksObj[eventId].push(taskData);
    localStorage.setItem('tasks', JSON.stringify(allTasksObj));
    // Navigate without eventId in the path
    navigate(`/EventsManagementPage`);
  };
  

  return (
    <div className="app-container">
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
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </button>
          ))}
          <div className="user-profile">A</div>
        </div>
      </nav>

      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">Create Task</h1>
            <div className="welcome-message">
              <span>Welcome,</span>
              <span className="username">Alex</span>
            </div>
          </div>
        </header>
        
        <div className="form-container">
          <div className="form-section">
            <div className="form-grid">
              <div className="form-column">
                <div className="input-group">
                  <label>Task Name</label>
                  <input
                    type="text"
                    value={taskData.name}
                    onChange={(e) => setTaskData({...taskData, name: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Admin</label>
                  <input
                    type="text"
                    value={taskData.supplier}
                    onChange={(e) => setTaskData({...taskData, supplier: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="input-group">
                  <label>Status</label>
                  <select
                    value={taskData.status}
                    onChange={(e) => setTaskData({...taskData, status: e.target.value})}
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="date-group">
                  <div className="input-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={taskData.date}
                      onChange={(e) => setTaskData({...taskData, date: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>Day</label>
                    <input
                      type="text"
                      placeholder="e.g. Present, Event Day, etc."
                      value={taskData.day}
                      onChange={(e) => setTaskData({...taskData, day: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button onClick={handleCreateTask} className="primary-btn create-btn">
                Create
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        :root {
          --primary-blue: #441752;
          --hover-blue: #441752;
          --light-bg: #A888B5;
          --text-dark: #441752;
          --text-light: #441752;
          --border-color: #A888B5;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--light-bg);
          font-family: 'Inter', sans-serif;
        }

        /* Navigation Styles */
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
          color: #A888B5;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: #A888B5;
          color: #441752;
        }

        .nav-btn.active {
          color: #A888B5;
          background: #441752;
        }

        .user-profile {
          width: 32px;
          height: 32px;
          background: var(--light-bg);
          color: var(--primary-blue);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* Main Content */
        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: 24px;
          color: var(--text-dark);
          margin: 0;
        }

        .welcome-message {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 32px;
          color: var(--text-light);
          margin-top: 8px;
        }

        .username {
          font-weight: 600;
          color: var(--text-dark);
        }

        /* Form Styles */
        .form-container {
          background: #441752;
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          color: #A888B5;
          font-weight: 500;
        }

        input,
        select {
          padding: 12px 10px;
          border: 1px solid #A888B5;
          border-radius: 6px;
          font-size: 14px;
          width: 100%;
        }

        .date-group {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          border-top: 1px solid #A888B5;
          padding-top: 24px;
        }

        .primary-btn {
          padding: 12px 24px;
          background: #A888B5;
          color: #441752;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 125, 250, 0.2);
        }

        .create-btn {
          padding: 12px 32px;
        }
      `}</style>
    </div>
  );
};

export default CreateTaskPage;
