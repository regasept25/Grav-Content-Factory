import { supabase } from './services/supabase';
async function test() {
  const { data, error } = await supabase.from('niches').select('*').limit(1);
  console.log('Niches exists check:', !error, error ? error.message : 'OK');
}
test();
