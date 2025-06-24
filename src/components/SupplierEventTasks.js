import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserProfile from './UserProfile';
import NotificationBell from './NotificationBell';
import { supabase } from '../supabaseClient';

const SupplierEventTasks = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('My Events');

  // Navigation items
  const mainNavItems = [
    { name: 'Home', path: '/SupplierHomepage' },
    { name: 'My Events', path: '/SupplierEvents' },
    { name: 'Messages', path: '/SupplierMessagesPage' }
  ];

  const userNavItems = [
    { name: 'My Work', path: '/SupplierWork' },
    { name: 'My Team', path: '/SupplierTeam' }
  ];

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        setCurrentUserEmail(user.email);
        console.log('Current user:', { id: user.id, email: user.email });
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (error) {
          console.error('Error fetching event details:', error);
        } else if (data) {
          setEventDetails(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [eventId]);

  return (
    <div className="supplier-event-tasks">
      <nav className="top-nav" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '32px',
        paddingRight: '32px',
        height: '64px',
        background: 'rgb(68, 23, 82)',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 8px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="nav-section left" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <img 
            src="/images/landingpage/logo.png" 
            alt="CITADA Logo" 
            className="nav-logo" 
            style={{
              height: '28px',
              marginRight: '16px'
            }}
          />
          {mainNavItems.map(item => (
            <button
              key={item.name}
              className={`nav-btn ${activeNav === item.name ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeNav === item.name ? 'rgb(68, 23, 82)' : 'none',
                color: 'rgb(168, 136, 181)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: '0.2s'
              }}
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="nav-section right" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {userNavItems.map(item => (
            <button
              key={item.name}
              className="nav-btn"
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'none',
                color: 'rgb(168, 136, 181)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: '0.2s'
              }}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </button>
          ))}
          <UserProfile showName={false} />
        </div>
      </nav>

      <main className="content">
        <header className="content-header">
          <h1>{eventDetails?.name || 'Event Tasks'}</h1>
        </header>

        {/* Event tasks content will go here */}
        <div className="tasks-container">
          {isLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <p>Tasks will be displayed here</p>
          )}
        </div>
      </main>

      <style jsx="true">{`
        .supplier-event-tasks {
          min-height: 100vh;
          background-color: #A888B5;
          font-family: 'Inter', sans-serif;
        }
        .content {
          padding: 24px 32px;
          background-color: #A888B5;
        }
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .content-header h1 {
          color: #441752;
        }
        .tasks-container {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .nav-btn:hover {
          background: rgba(168, 136, 181, 0.1) !important;
          color: white !important;
        }
        .nav-btn.active {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default SupplierEventTasks;
