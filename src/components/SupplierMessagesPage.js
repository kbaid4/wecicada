import React, { useState, useEffect } from 'react';

// UserAvatar component for nav bar
const UserAvatar = () => {
  const [initial, setInitial] = useState('S');
  useEffect(() => {
    async function fetchInitial() {
      let name = localStorage.getItem('supplierName') || localStorage.getItem('signupName') || 'Supplier';
      try {
        const { data: { user } } = await import('../supabaseClient').then(m => m.supabase.auth.getUser());
        if (user) {
          const { data: profile } = await import('../supabaseClient').then(m => m.supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single());
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

function getUserContext() {
  const isSupplier = localStorage.getItem('isSupplier') === 'true';
  const name = isSupplier
    ? localStorage.getItem('supplierName') || 'Supplier'
    : localStorage.getItem('signupName') || 'Admin';
  return { isSupplier, name };
}

const SupplierMessagesPage = () => {
  const user = getUserContext();
  const [allMessages, setAllMessages] = useState([]);
  const [eventList, setEventList] = useState([]); // [{eventId, eventName}]
  const [selectedEvent, setSelectedEvent] = useState(null); // {eventId, eventName}
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const supplierEmail = localStorage.getItem('supplierEmail');
    // Only show events where supplier is invited
    const relevantEvents = events.filter(ev => Array.isArray(ev.invitedSuppliers) && ev.invitedSuppliers.includes(supplierEmail))
      .map(ev => ({ eventId: ev.id, eventName: ev.name }));
    setEventList(relevantEvents);
    if (relevantEvents.length > 0 && !selectedEvent) setSelectedEvent(relevantEvents[0]);
  }, []);

  useEffect(() => {
    const msgs = JSON.parse(localStorage.getItem('messages')) || [];
    setAllMessages(msgs);
  }, [selectedEvent]);

  // Filter messages for selected event and this supplier
  const filteredMessages = selectedEvent
    ? allMessages.filter(
        msg => msg.eventId === selectedEvent.eventId && msg.supplier === user.name
      )
    : [];

  const sendMessage = () => {
    if (!inputValue.trim() || !selectedEvent) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: user.name,
      receiver: 'Admin',
      eventId: selectedEvent.eventId,
      supplier: user.name,
      content: inputValue,
      timestamp: Date.now(),
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
          <button className="nav-btn" onClick={() => window.location.href='/SupplierHomepage'}>Home</button>
          <button className="nav-btn" onClick={() => window.location.href='/SupplierEvents'}>My Events</button>
          <button className="nav-btn active">Messages</button>
        </div>
        <div className="nav-section right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="nav-btn" onClick={() => window.location.href='/SupplierWork'}>My Work</button>
          <button className="nav-btn" onClick={() => window.location.href='/SupplierTeam'}>My Team</button>
          {/* User Avatar */}
          <UserAvatar />
        </div>
      </nav>
      <main className="content-area">
        <h2 className="section-title">My Messages</h2>
        <div className="container">
          {/* Sidebar for Events */}
          <div className="sidebar">
            {eventList.length === 0 && (
              <div className="event" style={{color:'#999'}}>No conversations</div>
            )}
            {eventList.map(ev => (
              <div
                key={ev.eventId}
                className={`event${selectedEvent && ev.eventId === selectedEvent.eventId ? ' active' : ''}`}
                style={{cursor:'pointer', background: selectedEvent && ev.eventId === selectedEvent.eventId ? '#fff' : undefined, color: '#441752'}}
                onClick={() => setSelectedEvent(ev)}
              >
                <div style={{fontWeight:'bold'}}>{ev.eventName}</div>
              </div>
            ))}
          </div>
          {/* Chat Container */}
          <div className="chat-box">
            <div className="supplier-name">
              {selectedEvent ? (
                <span style={{fontWeight:600}}>{selectedEvent.eventName}</span>
              ) : 'Select an event'}
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
            {/* Message Input */}
            <div className="message-input" style={{marginTop: 0}}>
              <input
                type="text"
                placeholder="Message"
                className="message-field"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                disabled={!selectedEvent}
              />
              <button className="send-button" onClick={sendMessage} disabled={!selectedEvent || !inputValue.trim()}>Send</button>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background-color: #A888B5;
          font-family: 'Inter', sans-serif;
        }
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
        .content-area {
          padding: 32px 40px;
          margin-top: 32px;
        }
        .section-title {
          font-size: 24px;
          color: #441752;
          margin-left: 40px;
        }
        .container {
          display: flex;
          height: 70vh;
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
        .event {
          padding: 16px;
          font-weight: bold;
          border-bottom: 2px solid  #441752;
          background-color: #A888B5;
          color:  #441752;
        }
        .event.active {
          background: #fff;
        }
        .chat-box {
          display: flex;
          flex-direction: column;
          width: 80%;
          padding: 16px 32px;
        }
        .supplier-name {
          font-size: 18px;
          color: #441752;
          margin-bottom: 16px;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 16px;
        }
        .message-input {
          display: flex;
          gap: 8px;
        }
        .message-field {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #A888B5;
          font-size: 15px;
          outline: none;
        }
        .send-button {
          background: #441752;
          color: #A888B5;
          border: none;
          border-radius: 8px;
          padding: 0 24px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .send-button:disabled {
          background: #A888B5;
          color: #441752;
          cursor: not-allowed;
        }
        @media (max-width: 900px) {
          .content-area {
            padding: 12px 4px;
          }
          .container {
            height: auto;
          }
        }
        @media (max-width: 600px) {
          .top-nav {
            flex-direction: column;
            height: auto;
            padding: 8px 4px;
            gap: 8px;
          }
          .nav-section {
            gap: 8px;
          }
          .content-area {
            padding: 4px 1px;
            margin-top: 24px;
          }
          .section-title {
            font-size: 15px;
            margin-left: 8px;
          }
          .container {
            flex-direction: column;
            height: auto;
            min-height: 0;
          }
          .sidebar {
            width: 100%;
            flex-direction: row;
            border-right: none;
            border-bottom: 2px solid #441752;
            padding: 4px;
            overflow-x: auto;
            gap: 4px;
          }
          .event {
            padding: 8px 12px;
            font-size: 12px;
            min-width: 80px;
          }
          .chat-box {
            width: 100%;
            padding: 8px 4px;
            min-width: 0;
          }
          .supplier-name {
            font-size: 13px;
            margin-bottom: 8px;
          }
          .chat-messages {
            font-size: 13px;
            margin-bottom: 8px;
          }
          .message-field {
            font-size: 12px;
            padding: 8px;
          }
          .send-button {
            font-size: 12px;
            padding: 0 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default SupplierMessagesPage;
