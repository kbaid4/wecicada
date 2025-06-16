import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { updateEventSuppliersWithUserId } from '../utils/updateSupplierEvents';

// UserAvatar component (same as in SupplierEvents)
const UserAvatar = () => {
  const [initial, setInitial] = useState('S');
  React.useEffect(() => {
    async function fetchInitial() {
      let name = localStorage.getItem('supplierName') || localStorage.getItem('signupName') || 'Supplier';
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          if (profile && profile.full_name) {
            name = profile.full_name;
          }
        }
      } catch {}
      setInitial(name.charAt(0).toUpperCase());
    }
    fetchInitial();
  }, []);
  return (
    <div
      className="user-avatar"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#A888B5',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        flexShrink: 0,
        cursor: 'pointer',
        marginRight: '4px'
      }}
      title={initial}
    >
      {initial}
    </div>
  );
};

const mainNavItems = [
  { name: 'Home', path: '/SupplierHomepage' },
  { name: 'My Events', path: '/SupplierEvents' },
  { name: 'Messages', path: '/SupplierMessagesPage' }
];
const userNavItems = [
  { name: 'My Work', path: '/SupplierWork' },
  { name: 'My Team', path: '/SupplierTeam' }
];

const SupplierEventDetail = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [activeNav, setActiveNav] = useState('My Events');
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // First, update event_suppliers table with user ID when component mounts
    async function ensureUserIdInEventSuppliers() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id && user?.email && eventId) {
          console.log(`Ensuring user ${user.id} is properly linked to event ${eventId}`);
          const result = await updateEventSuppliersWithUserId(user.id, user.email);
          console.log('Event suppliers update result:', result);

          // Also directly ensure this specific event is linked to the user
          const { error: linkError } = await supabase
            .from('event_suppliers')
            .upsert(
              {
                event_id: eventId,
                supplier_user_id: user.id,
                supplier_email: user.email
              },
              { onConflict: ['event_id', 'supplier_email'] }
            );

          if (linkError) {
            console.error('Error ensuring event-supplier link:', linkError);
          } else {
            console.log(`Successfully ensured link between supplier ${user.id} and event ${eventId}`);
          }
        }
      } catch (err) {
        console.error('Error updating event_suppliers table:', err);
        // Don't block event loading due to this error
      }
    }

    ensureUserIdInEventSuppliers();

    async function fetchEventDetails() {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);
        
        // First try to get event from localStorage if it exists there
        // This is useful for placeholder events that don't exist in the database
        const savedEvents = localStorage.getItem('supplierEvents');
        let parsedEvents = [];
        let foundInStorage = false;
        
        if (savedEvents) {
          try {
            parsedEvents = JSON.parse(savedEvents);
            const localEvent = parsedEvents.find(e => e.id === eventId);
            
            if (localEvent) {
              foundInStorage = true;
              console.log('Found event in local storage:', localEvent);
              
              // If it's a placeholder event from invites, use it directly
              if (localEvent.is_placeholder) {
                console.log('Using placeholder event from localStorage');
                setEventDetails({
                  ...localEvent,
                  adminName: 'Event Organizer'
                });
                setLoading(false);
                return;
              }
            }
          } catch (storageErr) {
            console.error('Error parsing localStorage events:', storageErr);
          }
        }

        // If not found in localStorage or not a placeholder, try fetching from database
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors

        if (eventError) {
          console.error('Database query error:', eventError);
          
          // If we already found it in storage but it wasn't a placeholder, use that
          if (foundInStorage) {
            const localEvent = parsedEvents.find(e => e.id === eventId);
            setEventDetails({
              ...localEvent,
              adminName: 'Event Organizer'
            });
            return;
          }
          
          // Otherwise, try to get invite information as fallback
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            const { data: invite } = await supabase
              .from('invites')
              .select('*')
              .eq('event_id', eventId)
              .eq('supplier_email', user.email)
              .maybeSingle();
              
            if (invite) {
              console.log('Created event details from invite:', invite);
              const placeholderEvent = {
                id: eventId,
                name: invite.event_name || 'Invited Event',
                description: invite.event_description || 'You were invited to this event',
                // Enhanced date handling to capture more field variants
                start_date: invite.event_date || invite.start_date || new Date().toISOString(),
                end_date: invite.event_end_date || invite.end_date || invite.event_date || new Date().toISOString(),
                location: invite.event_location || invite.location || 'TBD',
                image_url: invite.event_image_url || invite.image_url || null,
                admin_id: invite.admin_id,
                created_at: invite.created_at || new Date().toISOString(),
                // Remove pending status restriction - always show as Active
                status: 'Active', // Changed from 'invited' to ensure visibility
                // Capture all possible field variants for type, sub-type and budget
                type: invite.event_type || invite.type || null,
                sub_type: invite.event_sub_type || invite.sub_type || null,
                budget: invite.event_budget || invite.budget || null,
                is_placeholder: true,
                adminName: 'Event Organizer'
              };
              setEventDetails(placeholderEvent);
              return;
            }
          }
          
          throw eventError;
        }

        if (eventData) {
          // Get admin details
          let adminName = 'Event Organizer';
          if (eventData.admin_id) {
            try {
              const { data: adminData } = await supabase
                .from('profiles')
                .select('full_name, companyname')
                .eq('id', eventData.admin_id)
                .single();
              
              if (adminData) {
                adminName = adminData.full_name || adminData.companyname || 'Event Organizer';
              }
            } catch (adminErr) {
              console.error('Error fetching admin details:', adminErr);
              // Continue with default admin name
            }
          }

          setEventDetails({ ...eventData, adminName });
        } else {
          // Final fallback - create a generic placeholder
          console.log('Event not found in database, using generic placeholder');
          setEventDetails({
            id: eventId,
            name: 'Invited Event',
            description: 'You were invited to this event. Details will be provided by the organizer.',
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            location: 'To be announced',
            image_url: null,
            status: 'invited',
            type: 'Event', // Default type
            sub_type: null,
            budget: null,
            is_placeholder: true,
            adminName: 'Event Organizer'
          });
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('This event may not exist or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    }

    fetchEventDetails();
  }, [eventId]);

  // Helper to format date strings with time
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
    }
  };
  
  // Helper functions for status styling
  const getStatusBackground = (status) => {
    status = status?.toLowerCase() || 'active';
    
    switch(status) {
      case 'pending':
      case 'invited': 
        return '#FFEBCD'; // Light orange
      case 'active': 
        return '#E6F7FF'; // Light blue
      case 'completed': 
        return '#E6FFE6'; // Light green
      case 'cancelled': 
        return '#FFE6E6'; // Light red
      default: 
        return '#E6F7FF'; // Default light blue
    }
  };
  
  const getStatusColor = (status) => {
    status = status?.toLowerCase() || 'active';
    
    switch(status) {
      case 'pending':
      case 'invited': 
        return '#CD853F'; // Brown
      case 'active': 
        return '#0073CF'; // Blue
      case 'completed': 
        return '#008800'; // Green
      case 'cancelled': 
        return '#CC0000'; // Red
      default: 
        return '#0073CF'; // Default blue
    }
  };

  return (
    <div className="supplier-event-detail-root" style={{ backgroundColor: '#A888B5', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: '#441752' }}>
      {/* Top Navigation Bar */}
      <nav className="top-nav" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '32px',
        paddingRight: '32px',
        height: '64px',
        background: '#441752',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="nav-section left" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <img 
            src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} 
            alt="CITADA Logo"
            className="nav-logo"
            style={{ height: '28px', marginRight: '16px' }}
          />
          {mainNavItems.map(item => (
            <button
              key={item.name}
              className={`nav-btn${activeNav === item.name ? ' active' : ''}`}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeNav === item.name ? '#441752' : 'none',
                color: '#A888B5',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
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
        <div className="nav-section right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userNavItems.map(item => (
            <button
              key={item.name}
              className="nav-btn"
              style={{
                padding: '8px 16px',
                border: 'none',
                background: 'none',
                color: '#A888B5',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          <UserAvatar />
        </div>
      </nav>

      {/* Event Detail Content */}
      <div className="content-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => navigate('/SupplierEvents')}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              cursor: 'pointer',
              padding: '8px 0',
              fontSize: '16px'
            }}
          >
            ← Back to Events
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: '8px' }}>
            <p>Loading event details...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: '8px', color: 'red' }}>
            <p>{error}</p>
            <button
              onClick={() => navigate('/SupplierEvents')}
              style={{
                backgroundColor: '#441752',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                marginTop: '15px',
                cursor: 'pointer'
              }}
            >
              Return to My Events
            </button>
          </div>
        ) : eventDetails ? (
          <div className="event-detail-card" style={{
            background: 'white',
            borderRadius: '8px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {/* Status Badge - at top right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h1 style={{ color: '#441752', fontSize: '28px', margin: 0 }}>{eventDetails.name}</h1>
              
              <span style={{
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: getStatusBackground(eventDetails.status),
                color: getStatusColor(eventDetails.status)
              }}>
                {/* Remove any pending status restrictions - show all events */}
                {eventDetails.status || 'Active'}
              </span>
            </div>
            
            <div className="event-organizer" style={{ marginBottom: '25px' }}>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '5px' }}>
                <strong>Organized by:</strong> {eventDetails.adminName}
              </p>
              
              {/* Display creation date if available */}
              {eventDetails.created_at && (
                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
                  Created on {new Date(eventDetails.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {/* Event Description */}
            {eventDetails.description && (
              <div className="event-description" style={{ 
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '8px',
              }}>
                <p style={{ margin: 0, lineHeight: '1.6' }}>{eventDetails.description}</p>
              </div>
            )}

            <div className="event-info-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '25px',
              marginBottom: '30px'
            }}>
              {/* Event Type Information */}
              <div className="info-item" style={{
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#faf5ff',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span role="img" aria-label="type" style={{ marginRight: '8px', fontSize: '20px' }}>📋</span>
                  <h3 style={{ color: '#441752', margin: 0, fontSize: '18px' }}>Event Type</h3>
                </div>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  {eventDetails.type || 'Not specified'}
                  {eventDetails.sub_type && <span><br/><strong>Sub-type:</strong> {eventDetails.sub_type}</span>}
                </p>
              </div>

              {/* Location Information */}
              <div className="info-item" style={{
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#faf5ff',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span role="img" aria-label="location" style={{ marginRight: '8px', fontSize: '20px' }}>📍</span>
                  <h3 style={{ color: '#441752', margin: 0, fontSize: '18px' }}>Location</h3>
                </div>
                <p style={{ margin: 0, fontSize: '16px' }}>{eventDetails.location || 'Not specified'}</p>
              </div>

              {/* Date Information */}
              <div className="info-item" style={{
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#faf5ff',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span role="img" aria-label="date" style={{ marginRight: '8px', fontSize: '20px' }}>📅</span>
                  <h3 style={{ color: '#441752', margin: 0, fontSize: '18px' }}>Date & Time</h3>
                </div>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  <strong>Start:</strong> {formatDate(eventDetails.start_date)}
                  {eventDetails.end_date && eventDetails.end_date !== eventDetails.start_date && (
                    <><br/><strong>End:</strong> {formatDate(eventDetails.end_date)}</>
                  )}
                </p>
              </div>

              {/* Budget Information - Always show with fallback */}
              <div className="info-item" style={{
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#faf5ff',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span role="img" aria-label="budget" style={{ marginRight: '8px', fontSize: '20px' }}>💰</span>
                  <h3 style={{ color: '#441752', margin: 0, fontSize: '18px' }}>Budget</h3>
                </div>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  {eventDetails.budget 
                    ? `$${typeof eventDetails.budget === 'number' 
                      ? eventDetails.budget.toLocaleString() 
                      : parseFloat(eventDetails.budget || 0).toLocaleString()}` 
                    : 'Not specified'}
                </p>
              </div>
            </div>

            {/* Show image if available */}
            {eventDetails.image_url && (
              <div className="event-image" style={{ marginBottom: '25px' }}>
                <img 
                  src={eventDetails.image_url} 
                  alt={eventDetails.name} 
                  style={{ 
                    maxWidth: '100%', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                  }}
                />
              </div>
            )}

            {/* Display placeholder notice if needed */}
            {eventDetails.is_placeholder && (
              <div style={{ 
                marginBottom: '20px', 
                padding: '10px 15px', 
                backgroundColor: '#FFF3E0', 
                borderRadius: '6px',
                borderLeft: '4px solid #FF9800'
              }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <strong>Note:</strong> This is a preliminary event. The organizer may update details later.
                </p>
              </div>
            )}

            <div className="event-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
              <button
                onClick={() => navigate(`/SupplierEventTasks/${eventId}`)}
                style={{
                  backgroundColor: '#441752',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span role="img" aria-label="tasks">📋</span>
                View Tasks
              </button>

            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderRadius: '8px' }}>
            <p>Event not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierEventDetail;
