import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oesorptwsvoydqhmkbof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc29ycHR3c3ZveWRxaG1rYm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzk5MzIsImV4cCI6MjA2NDY1NTkzMn0.8bE5C-L0q040phw4gnRgo4rJ2XNnZ64My_02GMj9hAU';

export const supabase = createClient(supabaseUrl, supabaseKey);
