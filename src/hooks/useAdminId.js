import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Simple hook to get the current admin's user id (auth id)
export function useAdminId() {
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (mounted) {
        setAdminId(data?.user?.id || null);
        setLoading(false);
      }
    }
    fetchUser();
    return () => { mounted = false; };
  }, []);

  return { adminId, loading };
}
