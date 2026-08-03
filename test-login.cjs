const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({ email: 'admin@alberta.com', password: 'password' }); // Guessing credentials
  if (data.session) {
      const res = await supabase.from('profiles').select('*').eq('role', 'tentor');
      console.log('Logged in data:', res.data);
  } else {
      console.log('Login failed:', error);
  }
}
test();
