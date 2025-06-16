import React, { useState, useEffect } from 'react';
import { useAdminId } from '../hooks/useAdminId';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

// Helper to get user context from localStorage (simple demo)
function getUserContext() {
  // You may want to use a better structure for real apps
  // For demo: if 'isSupplier' is true, user is supplier; else admin
  const isSupplier = localStorage.getItem('isSupplier') === 'true';
  const name = isSupplier
    ? localStorage.getItem('supplierName') || 'Supplier'
    : localStorage.getItem('signupName') || 'Admin';
  return { isSupplier, name };
}


const MessagesPage = () => {
  const { adminId } = useAdminId();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [allMessages, setAllMessages] = useState([]);
  const [eventSupplierPairs, setEventSupplierPairs] = useState([]); // [{eventId, eventName, supplierName}]
  const [selectedPair, setSelectedPair] = useState(null); // {eventId, eventName, supplierName}
  const [inputValue, setInputValue] = useState('');
  const user = getUserContext();


  // Updated navigation items
  const mainNavItems = [
    { name: 'Home', path: '/SuppliersPage' },
    { name: 'Events', path: '/Events' },
    { name: 'Messages', path: '/MessagesPage' }
  ];

  // Updated user nav items with correct paths
  const userNavItems = [
    { name: 'My Work', path: '/my-work' },
    { name: 'My Team', path: '/my-team' }
  ];
  
  // State
  
  
  
   // [{eventId, eventName, supplierName}]
   // {eventId, eventName, supplierName}
  
  

  // Fetch events and suppliers for sidebar
  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    let pairs = [];
    if (user.isSupplier) {
      // Supplier: find all events where invitedSuppliers includes me
      pairs = events
        .filter(ev => Array.isArray(ev.invitedSuppliers) && ev.invitedSuppliers.includes(user.name))
        .map(ev => ({ eventId: ev.id, eventName: ev.name, supplierName: user.name }));
    } else {
      // Admin: only show events created by this admin
      pairs = events
        .filter(ev => ev.admin_id === adminId)
        .flatMap(ev => {
          if (!ev.invitedSuppliers || ev.invitedSuppliers.length === 0) {
            // No suppliers yet: show a placeholder so the admin can see their event
            return [{ eventId: ev.id, eventName: ev.name, supplierName: '(No suppliers yet)' }];
          }
          return (ev.invitedSuppliers || []).map(supplier => ({ eventId: ev.id, eventName: ev.name, supplierName: supplier }));
        });
    }
    setEventSupplierPairs(pairs);
    // Always auto-select first pair if none is selected or if selectedPair is no longer in the list
    if (pairs.length > 0 && (!selectedPair || !pairs.some(pair => pair.eventId === selectedPair.eventId && pair.supplierName === selectedPair.supplierName))) {
      setSelectedPair(pairs[0]);
    }
    // If no pairs, clear selectedPair
    if (pairs.length === 0 && selectedPair) {
      setSelectedPair(null);
    }
  }, [user.isSupplier, user.name, adminId, selectedPair]);

  // Fetch all messages
  useEffect(() => {
    // Load messages from localStorage
    let stored = JSON.parse(localStorage.getItem('messages')) || [];
    // If admin, filter by admin_id
    if (!user.isSupplier && adminId) {
      stored = stored.filter(m => m.admin_id === adminId);
    }
    setAllMessages(stored);
  }, [adminId]);

  // Filter messages for selected event/supplier pair
  const filteredMessages = selectedPair
    ? allMessages.filter(
        msg => msg.eventId === selectedPair.eventId && msg.supplier === selectedPair.supplierName
      )
    : [];

  // Send message
  const sendMessage = () => {
    if (!inputValue.trim() || !selectedPair) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: user.name,
      receiver: user.isSupplier ? 'Admin' : selectedPair.supplierName,
      eventId: selectedPair.eventId,
      supplier: selectedPair.supplierName,
      content: inputValue,
      timestamp: Date.now(),
      ...(user.isSupplier ? {} : { admin_id: adminId })
    };
    const updatedMsgs = [...allMessages, newMsg];
    setAllMessages(updatedMsgs);
    localStorage.setItem('messages', JSON.stringify(updatedMsgs));
    setInputValue('');
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
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
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
          <div className="header-left">
            <div className="welcome-section">
              <h1 className="welcome-text">Welcome,</h1>
              <UserProfile showName={true} />
            </div>

          </div>
        </header>
      </main>

      <h2 className="section-title">My Messages</h2>
      <div className="container">
        {/* Sidebar for Event/Supplier Pairs */}
        <div className="sidebar">
          {eventSupplierPairs.length === 0 && (
            <div className="event" style={{color:'#999'}}>No conversations</div>
          )}
          {eventSupplierPairs.map((pair, idx) => (
            <div
              key={pair.eventId + pair.supplierName}
              className={`event${selectedPair && pair.eventId === selectedPair.eventId && pair.supplierName === selectedPair.supplierName ? ' active' : ''}`}
              style={{cursor:'pointer', background: selectedPair && pair.eventId === selectedPair.eventId && pair.supplierName === selectedPair.supplierName ? '#fff' : undefined, color: '#441752'}}
              onClick={() => setSelectedPair(pair)}
            >
              <div style={{fontWeight:'bold'}}>{pair.eventName}</div>
              <div style={{fontSize:'14px', color:'#441752'}}>{pair.supplierName}</div>
            </div>
          ))}
        </div>

        {/* Chat Container */}
        <div className="chat-box">
          {/* Supplier Name */}
          <div className="supplier-name">
            {selectedPair ? (
              <>
                <span style={{fontWeight:600}}>{selectedPair.eventName}</span>
                <span style={{fontWeight:400, marginLeft:8}}>/ {selectedPair.supplierName}</span>
              </>
            ) : 'Select a conversation'}
          </div>
          {/* Chat Messages */}
          <div className="chat-messages" style={{overflowY:'auto', flex: 1, minHeight: 0}}>
            {filteredMessages.length === 0 && (
              <div style={{color:'#999', textAlign:'center', marginTop:'40px'}}>No messages yet. Start the conversation!</div>
            )}
            {filteredMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: user.name === msg.sender ? 'row-reverse' : 'row',
                  marginBottom: '10px',
                  alignItems: 'flex-end'
                }}
              >
                <div
                  style={{
                    background: user.name === msg.sender ? '#441752' : '#fff',
                    color: user.name === msg.sender ? '#fff' : '#441752',
                    borderRadius: '16px',
                    padding: '10px 16px',
                    maxWidth: '60%',
                    fontSize: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {msg.content}
                  <div style={{fontSize:'11px', color: user.name === msg.sender ? '#ddd' : '#A888B5', marginTop:4, textAlign:'right'}}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Message Input (sticks to bottom) */}
          <div className="message-input" style={{marginTop: 0}}>
            <input
              type="text"
              placeholder="Message"
              className="message-field"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              disabled={!selectedPair}
            />
            <button className="send-button" onClick={sendMessage} disabled={!selectedPair || !inputValue.trim()}>Send</button>
          </div>
        </div>
      </div>

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
          color: #A888B5;
          background: #441752;
        }

        /* User profile styles now handled by UserProfile component */
        .user-avatar {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }

        /* Main Content Styles */
        .content-area {
          padding: 32px 40px;
          margin-top: 64px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .header-left {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .welcome-section {
          margin-bottom: 16px;
        }

        .welcome-text {
          font-size: 32px;
          color: #441752;
          margin: 0;
        }

        /* User name styles now handled by UserProfile */

        .action-btns {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .primary-btn {
          padding: 10px 24px;
          background: var(--primary-blue);
          color: #A888B5;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn:hover {
          background: var(--hover-blue);
          transform: translateY(-1px);
        }

        .section-title {
          font-size: 24px;
          color: #441752;
          margin-left: 40px;
        }
        
        .container {
          display: flex;
          height: 100vh;
          background-color: #A888B5;
          font-family: 'Inter', sans-serif;
        }

        .sidebar {
          width: 20%;
          display: flex;
          flex-direction: column;
          border-right: 2px solid #441752;
          background-color: #A888B5;
          padding: 8px;
        }

        /* Responsive Styles */
        @media (max-width: 900px) {
          .content-area {
            padding: 24px 10px;
          }
          .content-header {
            flex-direction: column;
            gap: 16px;
          }
          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }

        @media (max-width: 700px) {
          .container {
            flex-direction: column;
            height: auto;
          }
          .sidebar {
            width: 100%;
            min-width: 0;
            border-right: none;
            border-bottom: 2px solid #441752;
            flex-direction: row;
            overflow-x: auto;
            padding: 0 4px;
          }
          .event {
            min-width: 120px;
            padding: 12px 8px;
            font-size: 14px;
            border-bottom: none;
            border-right: 2px solid #441752;
          }
          .chat-box {
            width: 100%;
            min-width: 0;
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
          .section-title {
            font-size: 17px;
            margin-left: 12px;
          }
          .welcome-text {
            font-size: 22px;
          }
          .primary-btn {
            padding: 8px 14px;
            font-size: 12px;
          }
          .sidebar {
            font-size: 13px;
          }
          .supplier-name {
            padding: 8px;
            font-size: 15px;
          }
          .chat-messages {
            font-size: 13px;
          }
          .message-input {
            flex-direction: column;
            gap: 6px;
          }
          .message-field {
            font-size: 13px;
          }
          .send-button {
            font-size: 13px;
            padding: 6px 10px;
          }
        }

        .sidebar {
          width: 20%;
          display: flex;
          flex-direction: column;
          border-right: 2px solid #441752;
          background-color: #A888B5;
          padding: 8px;
        }

        .event {
          padding: 16px;
          font-weight: bold;
          border-bottom: 2px solid  #441752;
          background-color: #A888B5;
          color:  #441752;
        }

        .chat-box {
          display: flex;
          flex-direction: column;
          width: 80%;
          background-color: #A888B5;
        }

        .supplier-name {
          padding: 12px;
          font-weight: bold;
          border-bottom: 2px solid  #441752;
          background-color: #A888B5;
          color:  #441752;
        }

        .chat-messages {
          flex-grow: 1;
          padding: 16px;
        }

        .message-input {
          display: flex;
          border-top: 2px solid  #441752;
          padding: 8px;
          background-color: #A888B5;
        }

        .message-field {
          flex-grow: 1;
          padding: 8px;
          border: 2px solid  #441752;
          background-color: #A888B5;
        }

        .send-button {
          background-color:  #441752;
          color: #A888B5;
          padding: 8px 16px;
          margin-left: 8px;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;
