import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmzfnieekeckwkigyoew.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemZuaWVla2Vja3draWd5b2V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjM3NTcxOSwiZXhwIjoyMTAxOTUxNzE5fQ.BA-0xTmeRh7CsRZ76qDThGPbd_zW3oyjppTjhWIBhFA';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkExistingTables() {
  const candidateTables = [
    'contact', 'contacts', 'lead', 'leads', 'inquiry', 'inquiries', 'messages', 'message',
    'visitor', 'visitors', 'session', 'sessions', 'analytics', 'events', 'projects', 'project',
    'portfolio', 'settings', 'admin', 'users', 'profiles'
  ];

  console.log('Checking candidate tables in Supabase...');
  for (const table of candidateTables) {
    const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
    if (!error) {
      console.log(`FOUND TABLE: "${table}" with data:`, data);
    } else if (!error.message.includes('Could not find the table')) {
      console.log(`TABLE "${table}" exists with error:`, error.message);
    }
  }
}

checkExistingTables().catch(console.error);
