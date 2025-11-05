import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

/**
 * Supabase client configuration
 * Initialize the Supabase client with environment variables
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase environment variables are not set. Please add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

