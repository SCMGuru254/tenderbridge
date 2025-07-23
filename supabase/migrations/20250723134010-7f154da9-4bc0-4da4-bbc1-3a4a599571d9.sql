-- Add RLS policies for new tables

-- Discussion likes policies
CREATE POLICY "Users can like discussions" ON public.discussion_likes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view discussion likes" ON public.discussion_likes
FOR SELECT USING (true);

CREATE POLICY "Users can unlike discussions" ON public.discussion_likes
FOR DELETE USING (auth.uid() = user_id);

-- Discussion comments policies
CREATE POLICY "Users can comment on discussions" ON public.discussion_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view discussion comments" ON public.discussion_comments
FOR SELECT USING (true);

CREATE POLICY "Users can update their own comments" ON public.discussion_comments
FOR UPDATE USING (auth.uid() = user_id);

-- Discussion bookmarks policies
CREATE POLICY "Users can bookmark discussions" ON public.discussion_bookmarks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their bookmarks" ON public.discussion_bookmarks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks" ON public.discussion_bookmarks
FOR DELETE USING (auth.uid() = user_id);

-- Discussion shares policies
CREATE POLICY "Users can share discussions" ON public.discussion_shares
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view share counts" ON public.discussion_shares
FOR SELECT USING (true);

-- Company reviews policies
CREATE POLICY "Users can create company reviews" ON public.company_reviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view company reviews" ON public.company_reviews
FOR SELECT USING (true);

CREATE POLICY "Users can update their own reviews" ON public.company_reviews
FOR UPDATE USING (auth.uid() = user_id);

-- HR profiles policies
CREATE POLICY "HR can create their profile" ON public.hr_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view HR profiles" ON public.hr_profiles
FOR SELECT USING (true);

CREATE POLICY "HR can update their profile" ON public.hr_profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Job bookmarks policies
CREATE POLICY "Users can bookmark jobs" ON public.job_bookmarks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their bookmarks" ON public.job_bookmarks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks" ON public.job_bookmarks
FOR DELETE USING (auth.uid() = user_id);

-- Document uploads policies
CREATE POLICY "Users can upload documents" ON public.document_uploads
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their documents" ON public.document_uploads
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their documents" ON public.document_uploads
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their documents" ON public.document_uploads
FOR DELETE USING (auth.uid() = user_id);