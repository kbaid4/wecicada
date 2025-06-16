import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyLink = ({ className = '', children = 'Privacy Policy' }) => {
  return (
    <Link 
      to="/privacy-policy" 
      className={`text-purple-700 hover:underline ${className}`}
      aria-label="View our privacy policy"
    >
      {children}
    </Link>
  );
};

export default PrivacyPolicyLink;
