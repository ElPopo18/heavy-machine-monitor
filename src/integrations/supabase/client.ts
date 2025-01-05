import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pzaqrdflwnnimknmthkf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6YXFyZGZsd25uaW1rbm10aGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzODAxODEsImV4cCI6MjA0OTk1NjE4MX0.gRv6NfNW6JMgG3Myt-oTDL3fgGdrJhKJiicSiF1nDuQ";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);