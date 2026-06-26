import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

async function main() {
  if (!url || !serviceRoleKey) {
    console.error('Missing env vars');
    return;
  }
  
  const supabase = createClient(url, serviceRoleKey);
  
  console.log('Listing files in media bucket under library/');
  const { data, error } = await supabase.storage.from('media').list('library', {
    limit: 100
  });
  
  if (error) {
    console.error('Error listing files:', error.message);
    return;
  }
  
  console.log(`Found ${data.length} files:`);
  for (const item of data) {
    console.log(`- ${item.name} (size: ${item.metadata?.size ?? 'unknown'})`);
  }
}

main();
