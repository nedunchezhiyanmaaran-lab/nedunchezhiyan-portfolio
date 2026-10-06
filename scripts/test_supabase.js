import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmzfnieekeckwkigyoew.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemZuaWVla2Vja3draWd5b2V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjM3NTcxOSwiZXhwIjoyMTAxOTUxNzE5fQ.BA-0xTmeRh7CsRZ76qDThGPbd_zW3oyjppTjhWIBhFA';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  console.log('Testing Supabase connection...');
  
  // Test contact_leads
  const { data: leads, error: leadsErr } = await supabaseAdmin.from('contact_leads').select('*');
  console.log('contact_leads query:', { count: leads?.length, error: leadsErr?.message });

  // Test visitor_sessions
  const { data: sessions, error: sessionsErr } = await supabaseAdmin.from('visitor_sessions').select('*');
  console.log('visitor_sessions query:', { count: sessions?.length, error: sessionsErr?.message });

  // Test analytics_events
  const { data: events, error: eventsErr } = await supabaseAdmin.from('analytics_events').select('*');
  console.log('analytics_events query:', { count: events?.length, error: eventsErr?.message });
}

test().catch(console.error);
