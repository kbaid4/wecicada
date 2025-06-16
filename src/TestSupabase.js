import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function TestSupabase() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testConnection() {
      // Try to fetch all supplier rows for diagnostics
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) {
        setStatus('Connected to Supabase, but error occurred.');
        setError(error.message);
      } else {
        setStatus('Supabase connection successful!');
        setError(null);
        console.log('All profiles:', data);
      }
    }
    testConnection();
  }, []);

  return (
    <div style={{padding: '2rem', background: '#F5F2FA', borderRadius: '8px', margin: '2rem'}}>
      <h2>Supabase Connection Test</h2>
      <p>{status}</p>
      {error && <pre style={{color: 'red'}}>{error}</pre>}
      <p style={{fontSize: '0.9em', color: '#666'}}>
        (If you see "table not found", it's OK if you haven't created the 'profiles' table yet. This just means the connection is working!)
      </p>
    </div>
  );
}

export default TestSupabase;
