import { supabase } from './services/supabase';
async function test() {
  const { data, error } = await supabase.from('niches').select('*');
  console.log('Error:', error ? error.message : 'OK', 'Data count:', data ? data.length : 0);
}
test();
