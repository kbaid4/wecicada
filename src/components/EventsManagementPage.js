import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAdminId } from '../hooks/useAdminId';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

const EventsManagementPage = () => {
  const { adminId, loading } = useAdminId();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [activeNav, setActiveNav] = useState('Events');
  const [allEvents, setAllEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventSuppliers, setEventSuppliers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // User info will be handled by UserProfile component

  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];

  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      if (!adminId) return;
      try {
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('admin_id', adminId);
        if (error) {
          console.error('Failed to fetch events:', error);
          setAllEvents([]);
          setCurrentEvent(null);
          setTasks([]);
          return;
        }
        setAllEvents(events);
        const foundEvent = events.find(ev => ev.id === eventId);
        setCurrentEvent(foundEvent);
        // For now, keep using localStorage for tasks until migrated
        const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
        const filteredTasks = (allTasksObj[eventId] || []).filter(t => t.admin_id === adminId);
        setTasks(filteredTasks);

        // If we found the event, fetch its suppliers
        if (foundEvent) {
          fetchEventSuppliers(foundEvent.id);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setAllEvents([]);
        setCurrentEvent(null);
        setTasks([]);
        setEventSuppliers([]);
      }
    };

    const fetchEventSuppliers = async (evId) => {
      try {
        // First, fetch invites for this event
        const { data: invites, error: invitesError } = await supabase
          .from('invites')
          .select('*')
          .eq('event_id', evId);
        
        if (invitesError) {
          console.error('Failed to fetch invites:', invitesError);
          return;
        }

        // For each invite, try to get the supplier information
        const supplierDetails = [];
        for (const invite of invites) {
          // Check if this supplier already has an account
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', invite.supplier_email);
          
          if (!profilesError && profiles && profiles.length > 0) {
            // Use profile information if available
            supplierDetails.push({
              email: invite.supplier_email,
              name: profiles[0].full_name || profiles[0].companyname || invite.supplier_email,
              serviceType: profiles[0].serviceType || 'Accepted'
            });
          } else {
            // Otherwise just use the email
            supplierDetails.push({
              email: invite.supplier_email,
              name: invite.supplier_email,
              serviceType: 'Pending'
            });
          }
        }
        
        setEventSuppliers(supplierDetails);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setEventSuppliers([]);
      }
    };

    fetchEvents();
  }, [eventId, adminId]);

  const handleSelectEvent = (newEventId) => {
    navigate(`/EventsManagementPage/${newEventId}`);
  };

  const handleCreateTask = () => {
    navigate(`/CreateTaskPage/${eventId}`);
  };

  const handleStatusChange = (taskIndex, newStatus) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    allTasksObj[eventId] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasksObj));
  };

  const handleTaskCompletion = (taskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, status: task.status === 'Completed' ? 'In Progress' : 'Completed' } : task
    );
    setTasks(updatedTasks);
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    allTasksObj[eventId] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasksObj));
  };

  const calculateTaskCompletion = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    return ((completedTasks / tasks.length) * 100).toFixed(2);
  };

  // Handler to delete a task
  function handleDeleteTask(taskIndex) {
    const updatedTasks = tasks.filter((_, idx) => idx !== taskIndex);
    setTasks(updatedTasks);
    const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
    allTasksObj[eventId] = updatedTasks;
    localStorage.setItem('tasks', JSON.stringify(allTasksObj));
    // Sync with event's tasks array
    const eventsArr = JSON.parse(localStorage.getItem('events')) || [];
    const eventIdx = eventsArr.findIndex(ev => ev.id === eventId);
    if (eventIdx !== -1) {
      eventsArr[eventIdx].tasks = updatedTasks;
      localStorage.setItem('events', JSON.stringify(eventsArr));
    }
  }

  // Placeholder for editing a task
  function handleEditTask(taskIndex) {
    navigate(`/EditTaskPage/${eventId}/${taskIndex}`);
  }

  const statusOptions = ['Stopped', 'In Progress', 'Completed'];

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="nav-section left">
          <img src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} alt="CITADA Logo" className="nav-logo" />
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
              className={`nav-btn ${activeNav === item.name ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.name);
                if (item.path) navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          <UserProfile showName={false} />
        </div>
      </nav>

      <main className="content-area">
        <header className="content-header">
          <div style={{ marginBottom: '10px' }}>
            <button className="primary-btn" style={{ color: '#A888B5', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '18px', padding: 0, cursor: 'pointer' }} onClick={() => navigate('/Events')}>
              ← Back
            </button>
          </div>
          <div className="header-left" style={{ display: 'block', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 className="event-title">Event Management</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select className="primary-btn outline select-event" onChange={(e) => handleSelectEvent(e.target.value)} value={eventId}>
                  {allEvents.map((ev, idx) => (
                    <option key={ev.id} value={ev.id}>Event {idx + 1} - {ev.name}</option>
                  ))}
                </select>
                <button className="primary-btn" style={{ color: '#A888B5' }} onClick={() => navigate(`/AddSupplier/${eventId}`)}>Add Supplier</button>
              </div>
            </div>
            {currentEvent && (
              <div style={{ fontSize: '22px', fontWeight: '600', color: '#441752', marginTop: '14px', marginBottom: '2px', textAlign: 'left' }}>
                {currentEvent.name}
                {eventSuppliers.length > 0 ? (
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#441752', marginTop: '10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Suppliers:</div>
                    {eventSuppliers.map((supplier, index) => (
                      <div key={index} style={{ 
                        display: 'inline-block', 
                        background: '#f0e6f5', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        margin: '0 8px 8px 0', 
                        border: '1px solid #d9c2e5',
                        fontSize: '14px'
                      }}>
                        {supplier.name} 
                        {supplier.serviceType && (
                          <span style={{ color: '#666', fontSize: '12px', marginLeft: '5px' }}>({supplier.serviceType})</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#666', marginTop: '6px', fontStyle: 'italic' }}>
                    No suppliers added yet
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="action-btns" style={{marginTop: '0px', marginBottom: '18px', display: 'flex', gap: '14px', justifyContent: 'flex-start', alignItems: 'center'}}>
          <button className="primary-btn" style={{ color: '#A888B5' }} onClick={handleCreateTask}>Create Task</button>
          <button className="primary-btn" style={{ color: '#A888B5' }} onClick={() => navigate(`/EditEventPage/${eventId}`)}>Edit Event</button>
          <button className="primary-btn" style={{ color: '#A888B5' }} onClick={() => {
            if(window.confirm('Are you sure you want to delete this event?')) {
              const updatedEvents = allEvents.filter(ev => ev.id !== eventId);
              localStorage.setItem('events', JSON.stringify(updatedEvents));
              // Trigger storage event for same-tab updates
              window.dispatchEvent(new Event('storage'));
              // Optionally remove tasks
              const allTasksObj = JSON.parse(localStorage.getItem('tasks')) || {};
              delete allTasksObj[eventId];
              localStorage.setItem('tasks', JSON.stringify(allTasksObj));
              window.dispatchEvent(new Event('storage'));
              sessionStorage.setItem('reloadEvents', '1');
              navigate('/Events');
            }
          }}>Delete Event</button>
          {currentEvent && currentEvent.file && (
            <div style={{ marginLeft: '18px', background: '#fff', color: '#441752', borderRadius: '6px', padding: '8px 16px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 4px rgba(68,23,82,0.07)' }}>
              <span style={{ marginRight: '12px', fontWeight: 500 }}>
                <i className="fa fa-paperclip" style={{marginRight: '6px'}}></i>
                {currentEvent.file.name || 'Uploaded file'}
              </span>
              {currentEvent.file.url ? (
                <a href={currentEvent.file.url} download style={{ background: '#441752', color: '#A888B5', textDecoration: 'none', fontWeight: 600, padding: '6px 18px', borderRadius: '5px', marginLeft: '8px', display: 'inline-block' }}>
                  Download
                </a>
              ) : null}
            </div>
          )}
        </div>
        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Date</th>
                <th>Description</th>
                <th>Budget</th>
                <th>Searched Supplier</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: '#888' }}>No tasks yet for this event.</td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={index}>
                    <td>{task.name}</td>
                    <td>
                      <select value={task.status} onChange={(e) => handleStatusChange(index, e.target.value)}>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>{task.date}</td>
                    <td>{task.description}</td>
                    <td>{task.budget}</td>
                    <td>{(() => {
  if (!task.searchedSupplier) return '-';
  const localSuppliers = JSON.parse(localStorage.getItem('signedUpSuppliers') || '[]');
  const supplier = localSuppliers.find(s => s.id === task.searchedSupplier);
  if (!supplier) return task.searchedSupplier;
  const displayName = supplier.name || supplier.email || `Supplier ${supplier.id}`;
  const serviceType = supplier.serviceType;
  return serviceType ? `${displayName} (${serviceType})` : `${displayName} (No Service Type)`;
})()}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => handleTaskCompletion(index)}
                      />
                    </td>
                    <td>
                      <button className="primary-btn" style={{marginRight: '8px', padding: '4px 10px'}} onClick={() => handleEditTask(index)}>Edit</button>
                      <button className="primary-btn" style={{background: '#e57373', color: '#fff', padding: '4px 10px'}} onClick={() => handleDeleteTask(index)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
         :root {
          --primary-blue: #A888B5;
          --hover-blue: #A888B5;
          --light-bg: #A888B5;
          --text-dark: #441752;
          --text-light: #441752;
          --border-color: #441752;
          --stopped: #D50000;
          --in-progress: #00C853;
          --negotiation: #FFAB00;
        }

        .app-container {
          min-height: 100vh;
          background-color: var(--light-bg);
          font-family: 'Inter', sans-serif;
        }

        /* Top Navigation Styles */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          height: 64px;
          background: #441752;
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
          color: #441752;
          background: #A888B5;
        }

        .user-profile {
          width: 32px;
          height: 32px;
          background: #A888B5;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* Main Content Area */
        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
          margin-bottom: 32px;
        }

        .header-left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .event-title {
          font-size: 24px;
          color: var(--text-dark);
          margin: 0;
        }

        .action-btns {
          display: flex;
          gap: 16px;
        }

        .primary-btn {
          padding: 10px 24px;
          background: #441752;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn.outline {
          background: #441752;
          border: 2px solid var(--primary-blue);
          color: #441752;
          padding: 8px 16px;
          min-width: 140px;
        }

        .primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 125, 250, 0.2);
        }

        .primary-btn.create-task-btn {
          background: #441752;
          color: #A888B5;
        }

        .primary-btn.outline.select-event {
          background: #441752;
          border: 2px solid var(--border-color);
          color: #A888B5;
        }

        /* Tasks Table */
        .tasks-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .tasks-table {
          width: 100%;
          border-collapse: collapse;
        }

        .tasks-table th,
        .tasks-table td {
          padding: 16px 24px;
        }

        /* Responsive Styles */
        @media (max-width: 900px) {
          .content-area {
            padding: 18px 6px;
          }
          .tasks-table th,
          .tasks-table td {
            padding: 10px 10px;
          }
        }
        @media (max-width: 700px) {
          .content-area {
            padding: 8px 2vw;
            margin-top: 0;
          }
          .top-nav {
            flex-direction: column;
            height: auto;
            padding: 8px 6px;
            gap: 8px;
          }
          .nav-section {
            gap: 8px;
          }
          .event-title {
            font-size: 18px;
          }
          .header-left {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
          .action-btns {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }
          .tasks-table-container {
            border-radius: 0;
            box-shadow: none;
            overflow-x: auto;
          }
          .tasks-table th,
          .tasks-table td {
            padding: 7px 4px;
            font-size: 13px;
          }
          .primary-btn, .primary-btn.outline, .primary-btn.create-task-btn {
            font-size: 12px;
            padding: 8px 10px;
            min-width: unset;
          }
          select {
            font-size: 12px;
            padding: 6px 8px;
          }
        }
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .tasks-table th {
          background: var(--light-bg);
          color: var(--text-light);
          font-weight: 600;
        }

        .tasks-table select {
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background: white;
        }

        .tasks-table select:hover {
          background: var(--light-bg);
        }

        .primary-btn:hover, .add-btn:hover {
          transform: scale(1.1);
          background: #441752;
        }
      `}</style>
    </div>
  );
};

export default EventsManagementPage;
