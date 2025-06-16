import { useState, useEffect } from 'react';
import { getConsent, saveConsent, initializeServices } from '../utils/cookieUtils';
import { FaTimes, FaCookie } from 'react-icons/fa';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true, // Always true as these are essential
    analytics: false,
    marketing: false
  });

  // Check if we should show the banner on component mount
  useEffect(() => {
    const currentConsent = getConsent();
    setShowBanner(currentConsent === null);
    
    // If we have consent, initialize services
    if (currentConsent) {
      initializeServices(currentConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent = { necessary: true, analytics: true, marketing: true };
    saveConsent(newConsent);
    initializeServices(newConsent);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newConsent = { necessary: true, analytics: false, marketing: false };
    saveConsent(newConsent);
    initializeServices(newConsent);
    setShowBanner(false);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    saveConsent(consent);
    initializeServices(consent);
    setShowBanner(false);
  };

  const toggleConsent = (type) => {
    setConsent(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      boxShadow: '0 -2px 15px rgba(0, 0, 0, 0.08)',
      padding: '16px 0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            gap: '16px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <FaCookie style={{
                color: '#8b5cf6',
                fontSize: '20px',
                flexShrink: 0
              }} />
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: '#1f2937',
                lineHeight: '1.4'
              }}>We Value Your Privacy</h3>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                marginLeft: '8px',
                ':hover': {
                  color: '#6b7280',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }
              }}
              aria-label="Close cookie consent"
            >
              <FaTimes />
            </button>
          </div>
          
          <p style={{
            margin: '4px 0 0',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#4b5563',
            maxWidth: '800px'
          }}>
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
            By using our site, you acknowledge that you have read and understand our{' '}
            <a href="/privacy-policy" style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: 500,
              borderBottom: '1px solid transparent',
              transition: 'all 0.2s ease',
              ':hover': {
                borderBottomColor: '#8b5cf6'
              }
            }}>Privacy Policy</a>.
          </p>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '8px',
            width: '100%',
            justifyContent: 'flex-end'
          }}>
            <button 
              type="button"
              onClick={handleRejectAll}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#4b5563',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#d1d5db'
                },
                ':focus': {
                  outline: 'none',
                  boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)'
                }
              }}
            >
              Reject All
            </button>
            <button 
              type="button"
              onClick={handleSavePreferences}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'white',
                backgroundColor: '#8b5cf6',
                border: '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#7c3aed',
                },
                ':focus': {
                  outline: 'none',
                  boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.4)'
                }
              }}
            >
              Save Preferences
            </button>
            <button 
              type="button"
              onClick={handleAcceptAll}
              style={{
                padding: '8px 24px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'white',
                backgroundColor: '#7c3aed',
                border: '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ':hover': {
                  backgroundColor: '#6d28d9',
                },
                ':focus': {
                  outline: 'none',
                  boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.4)'
                }
              }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
