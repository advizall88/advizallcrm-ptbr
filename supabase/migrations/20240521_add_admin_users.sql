-- Migration: Adicionar usuários administradores
-- Data: 21 de maio de 2024
-- Descrição: Cadastra os usuários administradores iniciais para o sistema

-- Usuário: Andre Souza (admin)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  is_super_admin
)
VALUES (
  gen_random_uuid(),
  'andre@advizall.com',
  crypt('251108', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Adicionar entrada na tabela pública
INSERT INTO public.users (
  id,
  name,
  email,
  role
)
SELECT 
  id,
  'Andre Souza',
  'andre@advizall.com',
  'admin'
FROM auth.users 
WHERE email = 'andre@advizall.com'
ON CONFLICT (email) DO NOTHING;

-- Usuário: Vinicius Fernandes (admin)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  is_super_admin
)
VALUES (
  gen_random_uuid(),
  'vinicius@advizall.com',
  crypt('2025@Advizall', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Adicionar entrada na tabela pública
INSERT INTO public.users (
  id,
  name,
  email,
  role
)
SELECT 
  id,
  'Vinicius Fernandes',
  'vinicius@advizall.com',
  'admin'
FROM auth.users 
WHERE email = 'vinicius@advizall.com'
ON CONFLICT (email) DO NOTHING; 