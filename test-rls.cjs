const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles:', data?.length);
  const { data: st, error: err } = await supabase.from('students').select('*');
  console.log('Students:', st?.length);
}
test();
