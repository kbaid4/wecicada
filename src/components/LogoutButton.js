import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LogoutButton = ({ className = '', style = {} }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/SignInPage');
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      style={style}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
