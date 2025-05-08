-- Add initial admin user
-- Date: 2024-05-22

-- First create the user in the auth schema
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  aud,
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),  -- Generate a new UUID for the user
  '00000000-0000-0000-0000-000000000000',  -- Default instance ID
  'admin@advizall.com',  -- Admin email
  crypt('advizall-admin-2024', gen_salt('bf')),  -- Hashed password
  now(),  -- Email already confirmed
  'authenticated',
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Administrador do Sistema"}',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;  -- Skip if the user already exists

-- Then get the admin user ID and create their entry in the public.users table
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the ID of the admin user we just created or already existed
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@advizall.com';
  
  -- Create or update the public.users record
  INSERT INTO public.users (
    id,
    name,
    email,
    role,
    created_at,
    avatar_url,
    phone,
    title,
    department,
    bio,
    last_login_at,
    last_active_at
  )
  VALUES (
    admin_user_id,
    'Administrador do Sistema',
    'admin@advizall.com',
    'admin',
    now(),
    '',
    '',
    'System Administrator',
    'IT',
    'Built-in administrator account',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',  -- Ensure the role is set to admin
    name = 'Administrador do Sistema';
END $$; 