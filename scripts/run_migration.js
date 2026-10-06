import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://cmzfnieekeckwkigyoew.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemZuaWVla2Vja3draWd5b2V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjM3NTcxOSwiZXhwIjoyMTAxOTUxNzE5fQ.BA-0xTmeRh7CsRZ76qDThGPbd_zW3oyjppTjhWIBhFA';

async function tryExecuteSQL() {
  const sql = readFileSync('supabase/schema.sql', 'utf8');

  // Attempt via Supabase SQL endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  console.log('RPC endpoint status:', res.status);
  const text = await res.text();
  console.log('RPC response:', text);
}

tryExecuteSQL().catch(console.error);
