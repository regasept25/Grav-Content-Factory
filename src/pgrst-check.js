const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('/home/rega/ai-content-factory/.env', 'utf-8');
const url = env.match(/SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_KEY=(.*)/)[1].trim();

fetch(url + '/rest/v1/', {
  headers: {
    'apikey': key,
    'Authorization': 'Bearer ' + key
  }
}).then(r => r.json()).then(data => {
  console.log('Introspected Paths:', Object.keys(data.paths));
}).catch(err => console.log('Introspect error:', err.message));
