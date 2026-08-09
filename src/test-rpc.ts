import { supabase } from './services/supabase';
async function test() {
  const { data, error } = await supabase.rpc('execute_sql_query', { query_text: 'SELECT 1' });
  console.log('Result:', data, 'Error:', error);
}
test();
