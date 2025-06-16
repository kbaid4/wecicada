import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveConsent, getConsent } from '../utils/cookieUtils';

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [consent, setConsent] = useState({
    analytics: false,
    marketing: false,
  });

  // Load current consent settings
  useEffect(() => {
    const currentConsent = getConsent();
    if (currentConsent) {
      setConsent({
        analytics: currentConsent.analytics || false,
        marketing: currentConsent.marketing || false,
      });
    }
  }, []);

  const handleToggle = (type) => {
    setConsent(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newConsent = {
      ...consent,
      necessary: true // Always keep necessary cookies enabled
    };
    saveConsent(newConsent);
    
    // Show confirmation and redirect after a short delay
    alert('Your privacy preferences have been saved.');
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Privacy Settings</h1>
        
        <form onSubmit={handleSave}>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium mb-4">Cookie Preferences</h2>
              <p className="text-sm text-gray-600 mb-6">
                We use cookies to enhance your experience on our website. You can set your preferences below.
              </p>
              
              <div className="space-y-4">
                {/* Necessary Cookies - Always on */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Necessary Cookies</h3>
                    <p className="text-sm text-gray-500">Essential for the website to function properly</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-2">Always Active</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={true}
                        disabled
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                    </div>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Analytics Cookies</h3>
                    <p className="text-sm text-gray-500">Help us improve our website by collecting usage information</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      checked={consent.analytics}
                      onChange={() => handleToggle('analytics')}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Marketing Cookies</h3>
                    <p className="text-sm text-gray-500">Used to track visitors across websites for marketing purposes</p>
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      checked={consent.marketing}
                      onChange={() => handleToggle('marketing')}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium mb-4">Data Rights</h2>
              <p className="text-sm text-gray-600 mb-4">
                Under GDPR, you have the right to access, correct, or delete your personal data.
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => alert('Export functionality coming soon')}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Export My Data
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account and all associated data? This action cannot be undone.')) {
                      alert('Account deletion request received. We will process this shortly.');
                    }
                  }}
                  className="w-full md:w-auto px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete My Account
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Need help?</h3>
          <p className="mt-1 text-sm text-gray-500">
            If you have any questions about our privacy practices, please contact us at{' '}
            <a href="mailto:privacy@example.com" className="text-blue-600 hover:underline">
              privacy@example.com
            </a>.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Read our full{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
