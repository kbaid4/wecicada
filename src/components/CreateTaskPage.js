import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';
import { logTaskChange } from '../utils/auditLogger';
import { supabase } from '../supabaseClient';

import { useAdminId } from '../hooks/useAdminId';

const CreateTaskPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // User info will be handled by UserProfile component

  // Add an activeNav state similar to the Events component
  const [activeNav, setActiveNav] = useState('Events');

  // Navigation items based on the Events component
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];

  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];

  const { adminId } = useAdminId();

  const [taskData, setTaskData] = useState({
    name: '',
    budget: '',
    status: '',
    date: '',
    day: '',
    description: '',
    searchedSupplier: ''
  });

  const statusOptions = ['Stopped', 'In Progress', 'Negotiation'];

  // Fetch suppliers from Supabase and categorize them
  const [mySuppliers, setMySuppliers] = useState([]);
  const [signedUpSuppliers, setSignedUpSuppliers] = useState([]);
  useEffect(() => {
    async function fetchSuppliers() {
      // 1. Get all suppliers
      const { data: allSuppliers, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, company_name, created_at, user_type')
        .eq('user_type', 'supplier')
        .order('created_at', { ascending: false });
      if (profilesError || !Array.isArray(allSuppliers)) {
        setMySuppliers([]);
        setSignedUpSuppliers([]);
        return;
      }
      // 2. Get event-specific suppliers (invited by admin)
      let eventSupplierEmails = [];
      if (eventId) {
        const { data: eventSuppliers, error: eventSuppliersError } = await supabase
          .from('event_suppliers')
          .select('supplier_email')
          .eq('event_id', eventId);
        if (!eventSuppliersError && Array.isArray(eventSuppliers)) {
          eventSupplierEmails = eventSuppliers.map(es => es.supplier_email);
        }
      }
      // 3. Categorize
      const mySuppliersArr = allSuppliers.filter(s => eventSupplierEmails.includes(s.email));
      const signedUpSuppliersArr = allSuppliers.filter(s => !eventSupplierEmails.includes(s.email));
      setMySuppliers(mySuppliersArr);
      setSignedUpSuppliers(signedUpSuppliersArr);
    }
    fetchSuppliers();
  }, [eventId]);

  useEffect(() => {
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {}; 
    console.log("Loaded tasks for event:", eventId, allTasksObj[eventId] || []);
  }, [eventId]);
  
  const handleCreateTask = async () => {
    if (!adminId) {
      alert('User not loaded. Please wait and try again.');
      return;
    }
    try {
      const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
      if (!allTasksObj[eventId]) {
        allTasksObj[eventId] = [];
      }
      
      // Create task with a unique ID
      const taskWithId = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        admin_id: adminId
      };
      
      allTasksObj[eventId].push(taskWithId);

      localStorage.setItem('tasks', JSON.stringify(allTasksObj));
      
      // Also update the event's tasks array for budget calculation in Events page
      const eventsArr = JSON.parse(localStorage.getItem('events')) || [];
      const eventIdx = eventsArr.findIndex(ev => ev.id === eventId);
      if (eventIdx !== -1) {
        if (!Array.isArray(eventsArr[eventIdx].tasks)) eventsArr[eventIdx].tasks = [];
        eventsArr[eventIdx].tasks.push(taskWithId);
        localStorage.setItem('events', JSON.stringify(eventsArr));
      }
      
      // Log the task creation
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await logTaskChange('create', taskWithId, user.id);
      }
      
      // Navigate with eventId in the path
      navigate(`/EventsManagementPage/${eventId}`);
    } catch (error) {
      console.error('Error creating task:', error);
      // Optionally show an error message to the user
    }
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
          <UserProfile showName={false} />
        </div>
      </nav>

      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <h1 className="page-title">Create Task</h1>
            <div className="welcome-message">
              <span>Welcome,</span>
              <UserProfile showName={true} />
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
                  <label>Budget</label>
                  <input
                    type="text"
                    value={taskData.budget}
                    onChange={(e) => setTaskData({...taskData, budget: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Search Suppliers</label>
                  <select
                    value={taskData.searchedSupplier}
                    onChange={e => setTaskData({ ...taskData, searchedSupplier: e.target.value })}
                  >
                    <option value="">Select Supplier</option>
                    {mySuppliers.length > 0 && (
                      <optgroup label="My Suppliers">
                        {mySuppliers.map(supplier => {
                          const displayName = supplier.full_name || supplier.company_name || supplier.email || `Supplier ${supplier.id}`;
                          return (
                            <option key={supplier.id} value={supplier.id}>{displayName}</option>
                          );
                        })}
                      </optgroup>
                    )}
                    {signedUpSuppliers.length > 0 && (
                      <optgroup label="Signed Up Suppliers">
                        {(() => {
  const localSuppliers = JSON.parse(localStorage.getItem('signedUpSuppliers') || '[]');
  return localSuppliers.length > 0 ? localSuppliers.map(supplier => {
    const displayName = supplier.name || supplier.email || `Supplier ${supplier.id}`;
    const serviceType = supplier.serviceType;
    return (
      <option key={supplier.id} value={supplier.id}>
        {serviceType ? `${displayName} (${serviceType})` : `${displayName} (No Service Type)`}
      </option>
    );
  }) : <option disabled>No signed up suppliers found.</option>;
})()}
                      </optgroup>
                    )}
                    {mySuppliers.length === 0 && signedUpSuppliers.length === 0 && <option disabled>No suppliers found.</option>}
                  </select>
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
                    <label>Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Description of the task"
                      value={taskData.description}
                      onChange={(e) => setTaskData({...taskData, description: e.target.value})}
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

        /* Responsive Styles */
        @media (max-width: 900px) {
          .content-area {
            padding: 24px 10px;
          }
          .form-container {
            padding: 18px;
          }
          .form-grid {
            gap: 18px;
          }
        }
        @media (max-width: 600px) {
          .top-nav {
            flex-direction: column;
            height: auto;
            padding: 8px 6px;
            gap: 8px;
          }
          .nav-section {
            gap: 8px;
          }
          .content-area {
            padding: 12px 2vw;
            margin-top: 0;
          }
          .form-container {
            padding: 8px;
          }
          .form-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 18px;
          }
          .form-column {
            gap: 12px;
          }
          .date-group {
            gap: 10px;
          }
          .form-actions {
            flex-direction: column;
            gap: 10px;
            padding-top: 10px;
          }
          .primary-btn, .create-btn {
            padding: 8px 14px;
            font-size: 12px;
          }
          .page-title {
            font-size: 18px;
          }
          .welcome-message {
            font-size: 18px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          label {
            font-size: 13px;
          }
          input, select {
            font-size: 13px;
            padding: 8px 6px;
          }
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


