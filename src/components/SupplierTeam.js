import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

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

// Helper to get user context from localStorage
function getUserContext() {
  const isSupplier = localStorage.getItem('isSupplier') === 'true';
  const name = isSupplier
    ? localStorage.getItem('supplierName') || 'Supplier'
    : localStorage.getItem('signupName') || 'Admin';
  return { isSupplier, name };
}

const SupplierTeam = () => {
  const navigate = useNavigate();
  const user = getUserContext();
  const [liaisons, setLiaisons] = useState([]);
  const [newLiaison, setNewLiaison] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [activeNav, setActiveNav] = useState('My Team');
  const [supplierId, setSupplierId] = useState(null);

  // Get supplier's Supabase user ID on mount
  useEffect(() => {
    async function fetchSupplierId() {
      try {
        const { data: { user } } = await import('../supabaseClient').then(m => m.supabase.auth.getUser());
        if (user && user.id) {
          setSupplierId(user.id);
        }
      } catch {
        setSupplierId(null);
      }
    }
    fetchSupplierId();
  }, []);

  // Load liaisons for this supplierId from Supabase
  useEffect(() => {
    if (!supplierId) return;
    async function fetchLiaisons() {
      try {
        const { data, error } = await import('../supabaseClient').then(m => m.supabase
          .from('liaisons')
          .select('*')
          .eq('user_id', supplierId)
          .order('created_at', { ascending: false })
        );
        if (!error && Array.isArray(data)) {
          setLiaisons(data);
        } else {
          setLiaisons([]);
        }
      } catch {
        setLiaisons([]);
      }
    }
    fetchLiaisons();
  }, [supplierId]);

  const addLiaison = async () => {
    console.log("addLiaison called");
    const { data: { user }, error: authError } = await import('../supabaseClient').then(m => m.supabase.auth.getUser());
    console.log("auth user:", user, "auth error:", authError);
    if (!user) {
      alert('User not authenticated');
      return;
    }
    if (
      newLiaison.trim() &&
      newEmail.trim() &&
      !liaisons.some(
        (l) => l && typeof l === 'object' && l.name === newLiaison.trim() && l.email === newEmail.trim()
      )
    ) {
      try {
        const adminEmail = user.email;
        const { data, error } = await import('../supabaseClient').then(m => m.supabase
          .from('liaisons')
          .insert([{ user_id: user.id, admin_email: adminEmail, name: newLiaison.trim(), email: newEmail.trim() }])
          .select()
        );
        console.log("insert result:", data, error);
        if (!error && Array.isArray(data)) {
          setLiaisons([data[0], ...liaisons]);
        } else if (error) {
          alert('Error adding liaison: ' + error.message);
          console.error('Supabase insert error:', error.message);
        }
      } catch (err) {
        alert('Unexpected error: ' + err.message);
        console.error('Unexpected error:', err);
      }
      setNewLiaison("");
      setNewEmail("");
    }
  };

  // Optionally, update/remove logic to delete from Supabase as well if needed
  // (No debug logs needed for removeLiaison)
  const removeLiaison = async (name, email) => {
    if (!supplierId) return;
    try {
      const liaisonToRemove = liaisons.find(l => l.name === name && l.email === email);
      if (liaisonToRemove && liaisonToRemove.id) {
        await import('../supabaseClient').then(m => m.supabase
          .from('liaisons')
          .delete()
          .eq('id', liaisonToRemove.id)
        );
      }
      const updated = liaisons.filter(
        (l) => !(l && typeof l === 'object' && l.name === name && l.email === email)
      );
      setLiaisons(updated);
    } catch {
      // fallback: just update UI
      const updated = liaisons.filter(
        (l) => !(l && typeof l === 'object' && l.name === name && l.email === email)
      );
      setLiaisons(updated);
    }
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
              className={`nav-btn${activeNav === item.name ? ' active' : ''}`}
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
              onClick={() => {
                setActiveNav(item.name);
                navigate(item.path);
              }}
            >
              {item.name}
            </button>
          ))}
          {/* User Avatar */}
          <UserAvatar />
        </div>
      </nav>
      <div className="supplierteam-content">
        <h1>Supplier Team</h1>
        <div className="liaison-inputs">
          <input
            type="text"
            value={newLiaison}
            onChange={e => setNewLiaison(e.target.value)}
            placeholder="Liaison name"
            className="styled-input"
          />
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="Email"
            className="styled-input"
          />
          <button
            className="styled-btn"
            onClick={addLiaison}
            disabled={!newLiaison.trim() || !newEmail.trim()}
          >
            Add Liaison
          </button>
        </div>
        <h2>Liaisons</h2>
        {Array.isArray(liaisons) && liaisons.length === 0 ? (
          <p>No liaisons added yet.</p>
        ) : (
          <ul className="liaison-list">
            {Array.isArray(liaisons) && liaisons.map((liaison, idx) => {
              if (!liaison || typeof liaison !== 'object' || !liaison.name || !liaison.email) return null;
              return (
                <li className="liaison-list-item" key={idx + '-' + String(liaison.name) + '-' + String(liaison.email)}>
                  <span className="liaison-name">{typeof liaison.name === 'string' ? liaison.name : ''}</span>
                  <span className="liaison-email">{typeof liaison.email === 'string' ? liaison.email : ''}</span>
                  <button className="remove-btn" onClick={() => removeLiaison(liaison.name, liaison.email)}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
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
        .app-container h1, .app-container h2 {
          color: #441752;
        }

        .styled-input {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          background: #fff;
          color: #441752;
          box-shadow: 0 1px 4px rgba(68,23,82,0.06);
          outline: none;
        }
        .styled-input::placeholder {
          color: #441752;
          text-color: #441752;
          opacity: 1;
        }
        .styled-btn {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: bold;
          background: #441752;
          color: #A888B5;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(68,23,82,0.06);
          transition: background 0.2s;
        }
        .styled-btn:disabled {
          background: #441752;
          color: #A888B5;
          cursor: not-allowed;
        }
        .remove-btn {
          background: #441752;
          color: #A888B5;
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-size: 0.95rem;
          font-weight: bold;
          cursor: pointer;
          margin-left: 2rem;
          transition: background 0.2s;
        }
        .remove-btn:hover {
          background: #2D113A;
        }
        .liaison-list {
          list-style: disc inside;
          padding-left: 0;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .liaison-list-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }
        .liaison-name, .liaison-email {
          min-width: 120px;
        }
        .liaison-inputs {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
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
}

.app-container {
min-height: 100vh;
background-color: var(--light-bg);
font-family: 'Inter', sans-serif;
}
.app-container h1, .app-container h2 {
color: #441752;
}

.styled-input {
padding: 0.75rem 1rem;
border: none;
border-radius: 6px;
font-size: 1rem;
background: #fff;
color: #441752;
box-shadow: 0 1px 4px rgba(68,23,82,0.06);
outline: none;
}
.styled-input::placeholder {
color: #441752;
text-color: #441752;
opacity: 1;
}
.styled-btn {
padding: 0.75rem 1rem;
border: none;
border-radius: 6px;
font-size: 1rem;
font-weight: bold;
background: #441752;
color: #A888B5;
cursor: pointer;
box-shadow: 0 2px 8px rgba(68,23,82,0.06);
transition: background 0.2s;
}
.styled-btn:disabled {
background: #441752;
color: #A888B5;
cursor: not-allowed;
}
.remove-btn {
background: #441752;
color: #A888B5;
border: none;
border-radius: 6px;
padding: 0.5rem 1rem;
font-size: 0.95rem;
font-weight: bold;
cursor: pointer;
margin-left: 2rem;
transition: background 0.2s;
}
.remove-btn:hover {
background: #2D113A;
}
.liaison-list {
list-style: disc inside;
padding-left: 0;
margin-top: 1rem;
margin-bottom: 1rem;
}
.liaison-list-item {
display: flex;
align-items: center;
gap: 1.5rem;
margin-bottom: 1rem;
}
.liaison-name, .liaison-email {
min-width: 120px;
}
.liaison-inputs {
display: flex;
flex-direction: column;
gap: 1rem;
max-width: 400px;
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
.supplierteam-content {
margin-left: 30px;
}

@media (max-width: 900px) {
.supplierteam-content {
margin-left: 0;
padding: 1rem;
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
.supplierteam-content {
margin-left: 0;
padding: 0.5rem;
}
.liaison-inputs {
max-width: 100%;
gap: 0.5rem;
}
.liaison-list-item {
flex-direction: column;
align-items: flex-start;
gap: 0.5rem;
}
.liaison-name, .liaison-email {
min-width: 0;
font-size: 0.95rem;
}
.styled-input {
font-size: 0.95rem;
padding: 0.5rem 0.7rem;
}
.styled-btn, .remove-btn {
font-size: 0.9rem;
padding: 0.4rem 0.8rem;
margin-left: 0;
}
.app-container h1 {
font-size: 1.2rem;
}

        @media (max-width: 900px) {
          .supplierteam-content {
            margin-left: 0;
            padding: 1rem;
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
          .supplierteam-content {
            margin-left: 0;
            padding: 0.5rem;
          }
          .liaison-inputs {
            max-width: 100%;
            gap: 0.5rem;
          }
          .liaison-list-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .liaison-name, .liaison-email {
            min-width: 0;
            font-size: 0.95rem;
          }
          .styled-input {
            font-size: 0.95rem;
            padding: 0.5rem 0.7rem;
          }
          .styled-btn, .remove-btn {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
            margin-left: 0;
          }
          .app-container h1 {
            font-size: 1.2rem;
          }
          .app-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SupplierTeam;
