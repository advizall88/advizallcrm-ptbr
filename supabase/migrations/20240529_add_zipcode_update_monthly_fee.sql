-- Migração para adicionar campo zip_code e modificar monthly_fee
-- Data: 29 de maio de 2024
-- Descrição: Adiciona o campo zip_code à tabela clients e modifica monthly_fee para permitir valores nulos

-- Adicionar coluna zip_code
ALTER TABLE clients ADD COLUMN IF NOT EXISTS zip_code TEXT;
COMMENT ON COLUMN clients.zip_code IS 'Código postal/CEP do cliente';

-- Modificar a coluna monthly_fee para permitir valores nulos
ALTER TABLE clients ALTER COLUMN monthly_fee DROP NOT NULL;
ALTER TABLE clients ALTER COLUMN monthly_fee DROP DEFAULT;

-- Modificar a coluna ad_budget para permitir valores nulos
ALTER TABLE clients ALTER COLUMN ad_budget DROP NOT NULL;
ALTER TABLE clients ALTER COLUMN ad_budget DROP DEFAULT; 