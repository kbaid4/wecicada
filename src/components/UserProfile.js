import React, { useMemo } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

const UserProfile = ({ showName = true, className = '' }) => {
  const { profile, loading, error } = useUserProfile();
  
  const { displayName, displayInitial } = useMemo(() => {
    // If we have profile data, use it
    if (profile) {
      const name = profile.full_name || profile.email?.split('@')[0] || 'User';
      return {
        displayName: name,
        displayInitial: name.charAt(0).toUpperCase()
      };
    }

    // If there's an error but we have partial data
    if (error) {
      const name = profile?.email?.split('@')[0] || 'User';
      return {
        displayName: name || 'Error',
        displayInitial: (name?.charAt(0) || 'E').toUpperCase()
      };
    }

    // If still loading
    if (loading) {
      return {
        displayName: 'Loading...',
        displayInitial: 'L'
      };
    }

    // Default fallback
    return {
      displayName: 'User',
      displayInitial: 'U'
    };
  }, [profile, loading, error]);

  // Show just the name if showName is true
  if (showName) {
    return (
      <span 
        className={`user-name ${className}`} 
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
          display: 'inline-block',
          color: '#441752',
          fontSize: '16px',
          fontWeight: 500,
          opacity: loading ? 0.7 : 1
        }}
        title={displayName}
      >
        {displayName}
      </span>
    );
  }

  // If showName is true, only show the name, otherwise show the avatar
  if (showName) {
    return (
      <span 
        className={`user-name ${className}`} 
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px',
          display: 'inline-block'        }}
      >
        {displayName}
      </span>
    );
  }

  // Show just the avatar when showName is false
  return (
    <div 
      className={`user-avatar ${className}`} 
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
        fontSize: '14px',
        flexShrink: 0,
        cursor: 'pointer'
      }}
      title={displayName}
    >
      {displayInitial}
    </div>
  );
};

export default UserProfile;
