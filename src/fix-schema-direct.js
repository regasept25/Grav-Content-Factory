const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('/home/rega/ai-content-factory/.env', 'utf-8');
const url = env.match(/SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('niches').select('*');
  console.log('Direct test:', error ? error.message : 'OK', data ? data.length : 0);
}
check();
