-- Tommy Delights Supabase Setup Script
-- 1. Open the SQL Editor in Supabase: https://supabase.com/dashboard/project/_/sql
-- 2. Click "New Query"
-- 3. Paste this entire script and click "Run"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT CHECK (category IN ('food', 'service')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phone TEXT,
  email TEXT,
  address TEXT
);

-- 4. Create Profiles Table (for user metadata)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'staff')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create Public Read Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'products') THEN
        CREATE POLICY "Public Read Access" ON public.products FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Access' AND tablename = 'testimonials') THEN
        CREATE POLICY "Public Read Access" ON public.testimonials FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users Read Own Orders' AND tablename = 'orders') THEN
        CREATE POLICY "Users Read Own Orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Profiles' AND tablename = 'profiles') THEN
        CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
    END IF;
END $$;

-- 7. Create Admin/Authenticated Write Policies
DO $$ 
BEGIN
    -- Drop old broad policies if they exist
    DROP POLICY IF EXISTS "Authenticated Write Access" ON public.products;
    DROP POLICY IF EXISTS "Authenticated Write Access" ON public.testimonials;
    DROP POLICY IF EXISTS "Admin Manage All Orders" ON public.orders;

    -- Products: Only admins can manage
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Products' AND tablename = 'products') THEN
        CREATE POLICY "Admin Manage Products" ON public.products 
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'staff')
            )
        );
    END IF;
    
    -- Testimonials: Only admins can manage
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Testimonials' AND tablename = 'testimonials') THEN
        CREATE POLICY "Admin Manage Testimonials" ON public.testimonials 
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'staff')
            )
        );
    END IF;

    -- Orders: Users create own, Admins manage all
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users Create Own Orders' AND tablename = 'orders') THEN
        CREATE POLICY "Users Create Own Orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage All Orders' AND tablename = 'orders') THEN
        CREATE POLICY "Admin Manage All Orders" ON public.orders 
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role IN ('admin', 'staff')
            )
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users Manage Own Profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users Manage Own Profile" ON public.profiles FOR ALL USING (auth.uid() = id);
    END IF;
END $$;

-- 8. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, full_name, phone, address, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username', 
    new.email,
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'address',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Insert Initial Data (Optional - only if tables are empty)
INSERT INTO public.products (name, description, price, image_url, category)
SELECT 'Tombrown', 'Nutritious cereal mix.', 2500, 'https://files.catbox.moe/cfvetn.jpg', 'food'
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);

INSERT INTO public.testimonials (name, message)
SELECT 'Sarah Johnson', 'The Tombrown is a lifesaver!'
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials LIMIT 1);
