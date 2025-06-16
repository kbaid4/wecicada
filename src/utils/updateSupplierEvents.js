import { supabase } from '../supabaseClient';

/**
 * Update the event_suppliers table to add supplier_user_id for any entries that match the supplier's email
 * This ensures that suppliers can see their events after email verification or subsequent logins
 * 
 * @param {string} userId - The user ID of the supplier
 * @param {string} userEmail - The email of the supplier
 * @returns {Promise<{success: boolean, message: string}>} - Result of the operation
 */
export async function updateEventSuppliersWithUserId(userId, userEmail) {
  if (!userId || !userEmail) {
    console.error('updateEventSuppliersWithUserId: Missing userId or userEmail');
    return { success: false, message: 'Missing userId or userEmail' };
  }

  try {
    console.log(`[updateEventSuppliersWithUserId] Updating event_suppliers for email: ${userEmail}, userId: ${userId}`);
    // 1. Find all event_suppliers entries for this email where supplier_user_id is null, empty string, or undefined
    const { data: entries, error: fetchError } = await supabase
      .from('event_suppliers')
      .select('*')
      .eq('supplier_email', userEmail)
      .is('supplier_user_id', null);

    if (fetchError) {
      console.error('[updateEventSuppliersWithUserId] Error fetching event_suppliers entries:', fetchError);
      return { success: false, message: 'Error fetching entries', error: fetchError };
    }

    console.log(`[updateEventSuppliersWithUserId] Found ${entries?.length || 0} event_suppliers entries to update`);
    let updatedCount = 0;
    if (entries && entries.length > 0) {
      // 2. Update all matching entries
      const { error: updateError } = await supabase
        .from('event_suppliers')
        .update({ supplier_user_id: userId })
        .eq('supplier_email', userEmail)
        .is('supplier_user_id', null);

      if (updateError) {
        console.error('[updateEventSuppliersWithUserId] Error updating event_suppliers entries:', updateError);
        return { success: false, message: 'Error updating entries', error: updateError };
      }
      updatedCount = entries.length;
      console.log(`[updateEventSuppliersWithUserId] Successfully updated ${updatedCount} event_suppliers entries`);
      return { success: true, message: `Updated ${updatedCount} entries` };
    }

    // 3. If no entries updated, check for invites and insert into event_suppliers if needed
    // (Only do this if you want to auto-link on signup/login)
    const { data: invites, error: inviteFetchError } = await supabase
      .from('invites')
      .select('event_id')
      .eq('supplier_email', userEmail)
      .eq('status', 'pending');
    if (inviteFetchError) {
      console.error('[updateEventSuppliersWithUserId] Error fetching invites:', inviteFetchError);
      return { success: false, message: 'Error fetching invites', error: inviteFetchError };
    }
    if (invites && invites.length > 0) {
      // Insert new event_suppliers rows for each invite
      const inserts = invites.map(invite => ({
        event_id: invite.event_id,
        supplier_email: userEmail,
        supplier_user_id: userId,
      }));
      const { error: insertError } = await supabase
        .from('event_suppliers')
        .upsert(inserts, { onConflict: ['event_id', 'supplier_email'] });
      if (insertError) {
        console.error('[updateEventSuppliersWithUserId] Error inserting event_suppliers from invites:', insertError);
        return { success: false, message: 'Error inserting from invites', error: insertError };
      }
      console.log(`[updateEventSuppliersWithUserId] Inserted/Upserted ${inserts.length} new event_suppliers rows from invites`);
      return { success: true, message: `Inserted/Upserted ${inserts.length} from invites` };
    }

    // 4. If nothing was updated or inserted
    console.warn('[updateEventSuppliersWithUserId] No event_suppliers entries needed updating or inserting');
    return { success: true, message: 'No entries needed updating or inserting' };
  } catch (err) {
    console.error('[updateEventSuppliersWithUserId] Unexpected error:', err);
    return { success: false, message: 'Unexpected error', error: err };
  }
}

