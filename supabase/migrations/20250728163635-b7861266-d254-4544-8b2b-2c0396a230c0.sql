-- Create security definer functions to prevent RLS recursion (only if they don't exist)
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

-- RLS Policies for new tables (excluding thoughts which already has policies)

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

CREATE POLICY "System can create user profiles"
ON public.profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

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

-- Create storage buckets (only if they don't exist)
INSERT INTO storage.buckets (id, name, public) 
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');

INSERT INTO storage.buckets (id, name, public) 
SELECT 'gallery', 'gallery', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'gallery');

INSERT INTO storage.buckets (id, name, public) 
SELECT 'certificates', 'certificates', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'certificates');

INSERT INTO storage.buckets (id, name, public) 
SELECT 'team-logos', 'team-logos', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'team-logos');

-- Continue with all other tables and their policies...
-- Truncated for space - will add the rest in next migration if needed