import { supabase } from '../supabaseClient';

/**
 * Logs a task change to the task_audit_logs table
 * @param {string} action - The action performed ('create', 'update', 'delete')
 * @param {object} taskData - The task data to be logged
 * @param {string} userId - ID of the user who performed the action
 * @returns {Promise<object>} - The created log entry or error
 */
export const logTaskChange = async (action, taskData, userId) => {
  try {
    // First, get the user's email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();

    const userEmail = userData?.email || 'unknown@example.com';

    const { data, error } = await supabase
      .from('task_audit_logs')
      .insert([
        {
          action: action,
          task_id: taskData.id,
          task_data: taskData,
          user_id: userId,
          user_email: userEmail,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging task change:', error);
    throw error;
  }
};

/**
 * Logs an event change to the event_audit_logs table
 * @param {string} action - The action performed ('create', 'update', 'delete')
 * @param {object} eventData - The event data to be logged
 * @param {string} userId - ID of the user who performed the action
 * @returns {Promise<object>} - The created log entry or error
 */
export const logEventChange = async (action, eventData, userId) => {
  try {
    // Prepare the base log entry
    const logEntry = {
      action: action,
      event_id: eventData.id,
      event_data: eventData,
      user_id: userId,
      created_at: new Date().toISOString()
    };

    // Try to get user's email if user is authenticated
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (userData?.email) {
        logEntry.user_email = userData.email;
      }
    } catch (userError) {
      console.warn('Could not fetch user email:', userError);
    }

    // Insert the log entry
    const { data, error } = await supabase
      .from('event_audit_logs')
      .insert([logEntry]);

    if (error) {
      // If the error is about missing user_email column, try without it
      if (error.message.includes('user_email')) {
        delete logEntry.user_email;
        const { data: retryData, error: retryError } = await supabase
          .from('event_audit_logs')
          .insert([logEntry]);
        
        if (retryError) throw retryError;
        return retryData;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error logging event change:', error);
    throw error;
  }
};

/**
 * Logs a profile change to the profiles_audit_logs table
 * @param {string} action - The action performed ('create', 'update', 'delete')
 * @param {object} profileData - The profile data to be logged
 * @param {string} userId - ID of the user who performed the action
 * @returns {Promise<object>} - The created log entry or error
 */
export const logProfileChange = async (action, profileData, userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles_audit_logs')
      .insert([
        {
          action: action,
          profile_id: profileData.id,
          profile_data: profileData,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging profile change:', error);
    throw error;
  }
};

export default {
  logEventChange,
  logTaskChange,
  logProfileChange
};
