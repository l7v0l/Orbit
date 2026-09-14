import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://daqziaqukmjkunsuixug.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZDM74TWR9CHUuQ_GLrhGIg_qo3sWkTX';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const email = 'admin@orbit.com';
  const password = 'Admin123456!';
  const username = 'l7v0l';
  const fullName = 'المدير العام (Super Admin)';

  console.log(`Creating Admin user: ${email} (${username})...`);

  // Sign up user via Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
        role: 'admin',
        is_verified: true,
      },
    },
  });

  if (error) {
    console.log('Signup result notice:', error.message);
  } else {
    console.log('Admin User Created Successfully!', data?.user?.id);
  }
}

main();
