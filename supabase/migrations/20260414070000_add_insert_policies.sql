-- ==========================================
-- ADD INSERT POLICIES FOR PUBLIC ROLE
-- ==========================================

-- 1. Create INSERT policy for marks_categories
CREATE POLICY "Allow public insert marks_categories" 
ON public.marks_categories 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 2. Create INSERT policy for questions
CREATE POLICY "Allow public insert questions" 
ON public.questions 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
