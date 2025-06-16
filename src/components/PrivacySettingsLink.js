import React from 'react';
import { Link } from 'react-router-dom';

const PrivacySettingsLink = ({ className = '', children = 'Privacy Settings' }) => {
  return (
    <Link 
      to="/privacy-settings" 
      className={`text-purple-700 hover:underline ${className}`}
      aria-label="Manage your privacy settings"
    >
      {children}
    </Link>
  );
};

export default PrivacySettingsLink;
