-- Migração para adicionar coluna status na tabela clients
-- Data: 23 de maio de 2024
-- Descrição: Adiciona a coluna status na tabela clients para controlar o estado dos clientes

-- Adicionar coluna status
ALTER TABLE public.clients
ADD COLUMN status VARCHAR(20) DEFAULT 'active' NOT NULL;

-- Adicionar constraint para validar valores
ALTER TABLE public.clients
ADD CONSTRAINT clients_status_check 
CHECK (status IN ('active', 'inactive', 'delinquent'));

COMMENT ON COLUMN public.clients.status IS 'Status do cliente (active, inactive, delinquent)'; 