const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupUsers() {
  console.log('Creating Owner User...');
  const { data: ownerData, error: ownerError } = await supabase.auth.signUp({
    email: 'owner@workroom.space',
    password: 'owner@workroom@07',
    options: {
      data: {
        full_name: 'Workroom Owner',
      }
    }
  });

  if (ownerError) {
    console.error('Failed to create owner:', ownerError.message);
  } else {
    console.log('Owner created successfully:', ownerData.user?.id);
  }

  console.log('Creating Admin User...');
  const { data: adminData, error: adminError } = await supabase.auth.signUp({
    email: 'admin@workroom.space',
    password: 'admin@workroom07',
    options: {
      data: {
        full_name: 'Workroom Admin',
      }
    }
  });

  if (adminError) {
    console.error('Failed to create admin:', adminError.message);
  } else {
    console.log('Admin created successfully:', adminData.user?.id);
  }
}

setupUsers();
