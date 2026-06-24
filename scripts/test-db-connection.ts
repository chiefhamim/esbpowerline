import dotenv from 'dotenv';
import path from 'path';

const result = dotenv.config({ path: path.resolve(process.cwd(), '.env.production.local') });
if (result.error) {
  console.error('Failed to load .env.production.local:', result.error.message);
}

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'PRESENT' : 'MISSING');
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL (masked):', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
}
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING');
