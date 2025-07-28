-- Create security definer functions to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT ur.role::text 
  FROM public.user_roles ur 
  WHERE ur.user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_user_teacher_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_house()
RETURNS UUID AS $$
  SELECT uh.house_id 
  FROM public.user_houses uh 
  WHERE uh.user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_user_admin());

CREATE POLICY "Admins can create profiles"
ON public.profiles FOR INSERT
WITH CHECK (public.is_user_admin());

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.is_user_admin());

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_user_admin());

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_user_admin())
WITH CHECK (public.is_user_admin());

-- RLS Policies for houses table
CREATE POLICY "Everyone can view houses"
ON public.houses FOR SELECT
USING (true);

CREATE POLICY "Admins can manage houses"
ON public.houses FOR ALL
USING (public.is_user_admin())
WITH CHECK (public.is_user_admin());

-- RLS Policies for user_houses table
CREATE POLICY "Users can view their house assignment"
ON public.user_houses FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Everyone can view house assignments"
ON public.user_houses FOR SELECT
USING (true);

CREATE POLICY "Admins can manage house assignments"
ON public.user_houses FOR ALL
USING (public.is_user_admin())
WITH CHECK (public.is_user_admin());

-- RLS Policies for sports table
CREATE POLICY "Everyone can view sports"
ON public.sports FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can manage sports"
ON public.sports FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for teams table
CREATE POLICY "Everyone can view teams"
ON public.teams FOR SELECT
USING (true);

CREATE POLICY "Coaches can update their teams"
ON public.teams FOR UPDATE
USING (coach_id = auth.uid());

CREATE POLICY "Teachers and admins can manage teams"
ON public.teams FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for team_members table
CREATE POLICY "Everyone can view team members"
ON public.team_members FOR SELECT
USING (true);

CREATE POLICY "Team members can view their memberships"
ON public.team_members FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Teachers and admins can manage team members"
ON public.team_members FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for events table
CREATE POLICY "Everyone can view public events"
ON public.events FOR SELECT
USING (is_public = true);

CREATE POLICY "Event creators can view their events"
ON public.events FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Teachers and admins can manage events"
ON public.events FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for competitions table
CREATE POLICY "Everyone can view competitions"
ON public.competitions FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can manage competitions"
ON public.competitions FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for matches table
CREATE POLICY "Everyone can view matches"
ON public.matches FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can manage matches"
ON public.matches FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for match_results table
CREATE POLICY "Everyone can view match results"
ON public.match_results FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can record results"
ON public.match_results FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for house_points table
CREATE POLICY "Everyone can view house points"
ON public.house_points FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can award points"
ON public.house_points FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for leaderboard_snapshots table
CREATE POLICY "Everyone can view leaderboard snapshots"
ON public.leaderboard_snapshots FOR SELECT
USING (true);

CREATE POLICY "System can create snapshots"
ON public.leaderboard_snapshots FOR INSERT
WITH CHECK (true);

-- RLS Policies for announcements table
CREATE POLICY "Everyone can view active announcements"
ON public.announcements FOR SELECT
USING (is_active = true);

CREATE POLICY "Teachers and admins can manage announcements"
ON public.announcements FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- RLS Policies for gallery_items table
CREATE POLICY "Everyone can view public gallery items"
ON public.gallery_items FOR SELECT
USING (is_public = true);

CREATE POLICY "Uploaders can view their uploads"
ON public.gallery_items FOR SELECT
USING (uploaded_by = auth.uid());

CREATE POLICY "Teachers and admins can manage gallery"
ON public.gallery_items FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

CREATE POLICY "Users can upload to gallery"
ON public.gallery_items FOR INSERT
WITH CHECK (uploaded_by = auth.uid());

-- RLS Policies for certificates table
CREATE POLICY "Users can view their certificates"
ON public.certificates FOR SELECT
USING (recipient_id = auth.uid());

CREATE POLICY "Teachers and admins can view all certificates"
ON public.certificates FOR SELECT
USING (public.is_user_teacher_or_admin());

CREATE POLICY "Teachers and admins can issue certificates"
ON public.certificates FOR ALL
USING (public.is_user_teacher_or_admin())
WITH CHECK (public.is_user_teacher_or_admin());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('gallery', 'gallery', true),
('certificates', 'certificates', false),
('team-logos', 'team-logos', true);

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Teachers can upload to gallery" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gallery' AND public.is_user_teacher_or_admin());

CREATE POLICY "Teachers can manage gallery uploads" 
ON storage.objects FOR ALL
USING (bucket_id = 'gallery' AND public.is_user_teacher_or_admin());

-- Storage policies for certificates bucket
CREATE POLICY "Users can view their certificates" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all certificates" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'certificates' AND public.is_user_admin());

CREATE POLICY "Teachers can upload certificates" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'certificates' AND public.is_user_teacher_or_admin());

-- Storage policies for team-logos bucket
CREATE POLICY "Team logos are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'team-logos');

CREATE POLICY "Teachers can upload team logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'team-logos' AND public.is_user_teacher_or_admin());

CREATE POLICY "Teachers can manage team logos" 
ON storage.objects FOR ALL
USING (bucket_id = 'team-logos' AND public.is_user_teacher_or_admin());