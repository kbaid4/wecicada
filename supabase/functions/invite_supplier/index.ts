// Supabase Edge Function: Invite Supplier & Link to Event
// Place this in supabase/functions/invite_supplier/index.ts
// Requires service_role key (set as env var SUPABASE_SERVICE_ROLE_KEY)

// Note: The following import and Deno.env.get are valid in Supabase Edge Functions (Deno runtime).
// Your local IDE may show errors, but Supabase will run this code correctly.
// Deno import: Your IDE may show an error, but this works in Supabase Edge Functions.
// Deno import: Your IDE may show an error, but this works in Supabase Edge Functions.
// @ts-expect-error: Deno import only works in Supabase Edge Functions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }
  const { supplier_email, event_id } = await req.json();
  if (!supplier_email || !event_id) {
    return new Response(JSON.stringify({ error: 'Missing supplier_email or event_id' }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  // Get env vars
  // @ts-expect-error: Deno.env.get is available in Supabase Edge Functions runtime
  // @ts-expect-error: Deno.env.get is only available at runtime in Supabase Edge Functions
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  // Service role key is hardcoded as a workaround for Supabase reserved secret bug.
  // @ts-expect-error: Deno.env.get is only available at runtime in Supabase Edge Functions
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  // Invite supplier via Admin API
  const inviteRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: supplier_email, email_confirm: true }),
  });
  const inviteData = await inviteRes.json();
  if (!inviteRes.ok) {
    return new Response(JSON.stringify({ error: inviteData.msg || inviteData.error || 'Failed to invite user' }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }
  const supplier_user_id = inviteData.user?.id || null;

  // Insert into event_suppliers
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/event_suppliers`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ event_id, supplier_email, supplier_user_id }),
  });
  const insertData = await insertRes.json();
  if (!insertRes.ok) {
    return new Response(JSON.stringify({ error: insertData.msg || insertData.error || 'Failed to link supplier to event' }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  return new Response(JSON.stringify({ success: true, user: inviteData.user, event_supplier: insertData[0] }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
});
