-- Migração para atualizar a nulabilidade de colunas nas tabelas prospects e clients
-- Data: 24 de maio de 2024
-- Descrição: Permite valores nulos para email, region_city e region_state nas tabelas prospects e clients
--            e adiciona valor padrão (CURRENT_TIMESTAMP) para a coluna first_contact_at na tabela clients

-- Atualiza a tabela prospects
ALTER TABLE public.prospects 
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN region_city DROP NOT NULL,
  ALTER COLUMN region_state DROP NOT NULL;

-- Atualiza a tabela clients
ALTER TABLE public.clients 
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN region_city DROP NOT NULL,
  ALTER COLUMN region_state DROP NOT NULL;

-- Adiciona valor padrão para first_contact_at na tabela clients
ALTER TABLE public.clients
  ALTER COLUMN first_contact_at SET DEFAULT CURRENT_TIMESTAMP;

COMMENT ON COLUMN public.prospects.email IS 'Email do contato (opcional)';
COMMENT ON COLUMN public.prospects.region_city IS 'Cidade (opcional)';
COMMENT ON COLUMN public.prospects.region_state IS 'Estado (opcional)';

COMMENT ON COLUMN public.clients.email IS 'Email do contato (opcional)';
COMMENT ON COLUMN public.clients.region_city IS 'Cidade (opcional)';
COMMENT ON COLUMN public.clients.region_state IS 'Estado (opcional)';
COMMENT ON COLUMN public.clients.first_contact_at IS 'Data do primeiro contato (padrão: data atual)'; 