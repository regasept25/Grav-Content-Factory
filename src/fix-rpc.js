const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('/home/rega/ai-content-factory/.env', 'utf-8');
const url = env.match(/SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/SUPABASE_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.rpc('execute_sql_query', { query_text: 'NOTIFY pgrst, \'reload schema\';' });
  console.log('RPC notify result:', data, error);
}
test();
