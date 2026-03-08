import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gcmbsuliipmtosnlzezh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbWJzdWxpaXBtdG9zbmx6ZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5Nzg0NzYsImV4cCI6MjA4ODU1NDQ3Nn0.Ng0d2xDJErbWyr6DiEY9cply7cMvhXuRM9pf81mross';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
