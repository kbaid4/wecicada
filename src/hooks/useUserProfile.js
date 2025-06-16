import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';

// Cache for session to prevent unnecessary re-fetches
let sessionCache = null;
let sessionPromise = null;

export function useUserProfile() {
  const [state, setState] = useState({
    profile: null,
    loading: true,
    error: null
  });
  const initialLoad = useRef(true);

  const fetchProfile = useCallback(async (user) => {
    if (!user) return null;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Profile fetch error (non-critical):', fetchError);
        throw fetchError;
      }

      return data || {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        ...(fetchError && { _error: fetchError.message })
      };
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        _error: err.message
      };
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const updateState = (updates) => {
      if (!mounted) return;
      setState(prev => ({ ...prev, ...updates }));
    };

    const getProfile = async () => {
      if (!mounted || signal.aborted) return;
      
      try {
        if (initialLoad.current) {
          updateState({ loading: true });
        }

        // Get or wait for session
        let session;
        if (sessionCache) {
          session = sessionCache;
        } else if (!sessionPromise) {
          sessionPromise = supabase.auth.getSession()
            .then(({ data, error }) => {
              if (error) throw error;
              sessionCache = data?.session;
              return sessionCache;
            });
        }

        if (!session) {
          session = await sessionPromise;
        }
        
        if (!session?.user) {
          updateState({
            profile: null,
            error: null,
            loading: false
          });
          return;
        }


        // Get profile with timeout
        const profileData = await Promise.race([
          fetchProfile(session.user),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
          )
        ]);
        
        if (!mounted || signal.aborted) return;

        const userProfile = {
          id: session.user.id,
          email: session.user.email,
          ...profileData,
          full_name: profileData?.full_name || 
                    session.user.user_metadata?.full_name || 
                    session.user.email?.split('@')[0] || 'User'
        };

        updateState({
          profile: userProfile,
          error: null,
          loading: false
        });

      } catch (error) {
        if (!mounted) return;
        
        console.error('Error in getProfile:', error);
        
        // Try to create a minimal profile from session
        try {
          const session = sessionCache || (await supabase.auth.getSession()).data.session;
          if (session?.user) {
            updateState({
              profile: {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 'User',
                _error: error.message
              },
              error: error,
              loading: false
            });
          } else {
            updateState({
              profile: null,
              error: error,
              loading: false
            });
          }
        } catch (e) {
          updateState({
            profile: null,
            error: error,
            loading: false
          });
        }
      } finally {
        initialLoad.current = false;
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          sessionCache = session;
          getProfile();
        } else if (event === 'SIGNED_OUT') {
          sessionCache = null;
          sessionPromise = null;
          updateState({
            profile: null,
            error: null,
            loading: false
          });
        }
      }
    );

    // Initial fetch
    getProfile();

    return () => {
      mounted = false;
      controller.abort();
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  return state;
}
