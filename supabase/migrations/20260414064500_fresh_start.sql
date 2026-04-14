-- ==========================================
-- RESET DATABASE SCHEMA
-- ==========================================

-- 1. DROP EXISTING TABLES (ORDER MATTERS)
DROP TABLE IF EXISTS public.questions;
DROP TABLE IF EXISTS public.marks_categories;
DROP TABLE IF EXISTS public.modules;
DROP TABLE IF EXISTS public.subjects;

-- 2. CREATE SUBJECTS TABLE
CREATE TABLE public.subjects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE MODULES TABLE
CREATE TABLE public.modules (
  id SERIAL PRIMARY KEY,
  subject_id INTEGER REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  module_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREATE MARKS CATEGORIES TABLE
CREATE TABLE public.marks_categories (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  marks_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CREATE QUESTIONS TABLE (WITH FLAT SUBJECT CLASSIFICATION)
CREATE TABLE public.questions (
  id SERIAL PRIMARY KEY,
  marks_category_id INTEGER REFERENCES public.marks_categories(id) ON DELETE CASCADE NOT NULL,
  subject TEXT, -- Simple text-based classification for manual entry
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- 7. CREATE PUBLIC READ POLICIES
CREATE POLICY "Allow public read subjects" ON public.subjects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read modules" ON public.modules FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read marks_categories" ON public.marks_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read questions" ON public.questions FOR SELECT TO anon, authenticated USING (true);

-- 8. SEED INITIAL DATA
-- Subjects
INSERT INTO public.subjects (id, name, icon) VALUES
  (1, 'AI', 'Brain'),
  (2, 'OS', 'Monitor'),
  (3, 'TOC', 'BookOpen');

-- Modules for AI
INSERT INTO public.modules (subject_id, name, module_number) VALUES
  (1, 'Introduction to AI', 1), 
  (1, 'Search Algorithms', 2), 
  (1, 'Knowledge Representation', 3);

-- Marks Categories for AI Module 1
INSERT INTO public.marks_categories (id, module_id, marks_type) VALUES
  (1, 1, '2 Marks'),
  (2, 1, '8 Marks');

-- Initial Questions for AI Module 1
INSERT INTO public.questions (marks_category_id, subject, question, answer) VALUES
  (1, 'AI', 'What is Artificial Intelligence?', 'AI is the simulation of human intelligence processes by computer systems.'),
  (1, 'AI', 'What is a Rational Agent?', 'An entity that perceives its environment and acts to maximize performance.'),
  (2, 'AI', 'Explain the applications of AI.', 'AI is used in Healthcare, Finance, Transportation, and more.'),
  (2, 'AI', 'Describe PEAS in detail.', 'Performance, Environment, Actuators, and Sensors.');
