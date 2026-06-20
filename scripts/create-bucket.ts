import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Creating bucket...');
  const { data, error } = await supabase.storage.createBucket('media', {
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
  });
  
  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket already exists.');
    } else {
      console.error('Error creating bucket:', error);
    }
  } else {
    console.log('Bucket created:', data);
  }
}
main();
