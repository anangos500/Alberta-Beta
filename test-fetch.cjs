const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function fetchPublicData() {
  try {
    const tentorsRes = await supabase.from('profiles').select('*').eq('role', 'tentor');
    console.log('Tentors:', tentorsRes.data?.length, tentorsRes.error);
    
    const settingsRes = await supabase.from('public_settings').select('*').eq('id', 'main').single();
    console.log('Settings:', settingsRes.data?.id, settingsRes.error);
  } catch (e) {
    console.error('Error fetching public data:', e);
  }
}
fetchPublicData();
