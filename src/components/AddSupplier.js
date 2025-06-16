import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useAdminId } from '../hooks/useAdminId';

const AddSupplier = () => {
  const { eventId } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingInvite, setLoadingInvite] = useState(false);

  // Get event details for the invitation email
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      if (eventId) {
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

          if (error) {
            console.error('Error fetching event details:', error);
            return;
          }

          if (data) {
            setEventDetails(data);
          }
        } catch (err) {
          console.error('Unexpected error fetching event details:', err);
        }
      }
    }
    fetchEventDetails();
  }, [eventId]);

  // Generate a signup URL with invitation params
  const generateInviteUrl = (email, eventId) => {
    // Create a URL with query parameters for the invitation
    const baseUrl = window.location.origin;
    const signupUrl = `${baseUrl}/SignUpPage?invite=true&email=${encodeURIComponent(email)}&eventId=${encodeURIComponent(eventId)}`;
    return signupUrl;
  };

  // Invite supplier by inserting into Supabase invites table and sending email via backend API
  async function inviteSupplier(supplier_email, event_id, admin_id) {
    setError('');
    setSuccessMsg('');
    setLoadingInvite(true);
    const payload = {
      event_id,
      supplier_email,
      invited_by_admin_id: admin_id,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    try {
      // First insert the invitation record
      const { data, error } = await supabase
        .from('invites')
        .insert([payload]);

      if (error) {
        console.error('Supabase invite insert error:', error, 'Payload:', payload);
        setError('Failed to invite supplier: ' + error.message + (error.details ? ' (' + error.details + ')' : ''));
        setLoadingInvite(false);
        return false;
      }

      // Send invitation email via backend API
      const eventName = eventDetails?.name || 'an event';
      const signupUrl = generateInviteUrl(supplier_email, event_id);
      try {
        const response = await fetch('/api/send-invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: supplier_email,
            eventName: eventName,
            signupUrl: signupUrl
          })
        });
        if (!response.ok) {
          const resp = await response.json();
          throw new Error(resp.error || 'Failed to send invitation email');
        }
        setSuccessMsg('Supplier invited and email sent successfully!');
      } catch (emailErr) {
        console.error('Error sending invitation email:', emailErr);
        setError('Supplier invited, but failed to send email: ' + emailErr.message);
        setLoadingInvite(false);
        return false;
      }

      setLoadingInvite(false);
      return true;
    } catch (err) {
      console.error('Unexpected error during invite insert:', err, 'Payload:', payload);
      setError('Unexpected error: ' + err.message);
      setLoadingInvite(false);
      return false;
    }
  }

  const { adminId, loading } = useAdminId(); // loading here is from useAdminId, not local invite

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId) {
      setError('Admin ID not found. Please log in again.');
      return;
    }
    if (!formData.email) {
      setError('Supplier email is required');
      return;
    }
    const success = await inviteSupplier(formData.email, eventId, adminId);
    if (success) {
      setFormData({ name: '', email: '' });
      setTimeout(() => {
        navigate(`/EventsManagementPage/${eventId}`);
      }, 1000);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    //navigate("/LandingPage");
  };

  return (
    <div className="main-container">
      <div className="signup-container">
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {successMsg && <div style={{ color: 'green', marginBottom: '10px' }}>{successMsg}</div>}

        </form>
      <div className="logo-container">
          <img 
            src={`${process.env.PUBLIC_URL}/images/landingpage/logo.png`} 
            alt="CITADA Logo" 
            className="site-logo"
          />
        </div>        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="signup-button">Invite</button>
        </form>

        <style jsx>{`
          .main-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: url('/images/landingpage/loginbg.png');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
          }

          .signup-container {
            max-width: 400px;
            width: 90%;
            margin: 2rem;
            padding: 2rem;
            background: rgba(168, 136, 181, 0.95);
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            border-radius: 10px;
            backdrop-filter: blur(5px);
          }
          .logo-container {
            text-align: center;
            margin: 0 auto 2rem;
            max-width: 200px;
          }

          .site-logo {
            width: 100%;
            height: auto;
            max-height: 80px;
            object-fit: contain;
          }

          .signup-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          label {
            font-weight: 500;
            color: #555;
          }

          input, select {
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.9);
          }

          input:focus, select:focus {
            outline: none;
            border-color: #646cff;
          }

          .signup-button {
            background-color: #441752;
            color: white;
            padding: 1rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
          }


          .error-message {
            color: #ff0000;
            margin: 0.5rem 0;
            text-align: center;
          }

          .forgot-password {
            display: block;
            text-align: center;
            margin-top: 1rem;
            color: #441752;
            text-decoration: none;
          }

          .forgot-password:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AddSupplier;


