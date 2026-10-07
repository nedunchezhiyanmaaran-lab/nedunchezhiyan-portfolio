const SUPABASE_URL = 'https://cmzfnieekeckwkigyoew.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemZuaWVla2Vja3draWd5b2V3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjM3NTcxOSwiZXhwIjoyMTAxOTUxNzE5fQ.BA-0xTmeRh7CsRZ76qDThGPbd_zW3oyjppTjhWIBhFA';

async function run() {
  const eventsRes = await fetch(`${SUPABASE_URL}/rest/v1/analytics_events?select=*`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  const events = await eventsRes.json();

  console.log(`Total Analytics Events in DB: ${events.length}`);
  
  const ownerEvents = [];
  const externalEvents = [];

  events.forEach((e, idx) => {
    const isOwner = (
      (e.meta && (e.meta.includes('Owner') || e.meta.includes('👑') || e.meta.includes('Laptop') || e.meta.includes('Whitelisted'))) ||
      (e.description && (e.description.includes('Owner') || e.description.includes('👑') || e.description.includes('Laptop') || e.description.includes('Whitelisted')))
    );
    if (isOwner) {
      ownerEvents.push(e);
    } else {
      externalEvents.push(e);
    }
  });

  console.log(`Owner Events: ${ownerEvents.length}`);
  console.log(`External Events: ${externalEvents.length}`);

  console.log('\n--- ALL EXTERNAL EVENTS IN LIVE DB ---');
  externalEvents.forEach((e, idx) => {
    console.log(`${idx+1}. [${e.created_at}] [${e.event_type}] ${e.description} | meta: "${e.meta}"`);
  });
}

run().catch(console.error);
