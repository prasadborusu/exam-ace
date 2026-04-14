import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: subjects } = await supabase.from('subjects').select('*');
  console.log("Subjects:", subjects);

  const { data: modules } = await supabase.from('modules').select('*');
  console.log("Modules:", modules);

  const { data: categories } = await supabase.from('marks_categories').select('*');
  console.log("Categories:", categories);

  const { data: questions } = await supabase.from('questions').select('*');
  console.log("Questions Count:", questions?.length);
  if (questions && questions.length > 0) {
      console.log("Sample Question:", questions[0]);
  }
}

check();
