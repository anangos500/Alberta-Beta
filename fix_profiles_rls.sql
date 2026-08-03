CREATE POLICY "Allow public read access for tentors" ON public.profiles FOR SELECT USING (role = 'tentor');
