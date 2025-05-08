-- Adição de colunas que estão faltando na tabela clients
-- Data: 20 de maio de 2024
-- Descrição: Adiciona colunas monthly_fee e ad_budget que são usadas na interface do usuário

-- Adicionar coluna monthly_fee como numérico com 10 dígitos, incluindo 2 decimais
ALTER TABLE clients ADD COLUMN IF NOT EXISTS monthly_fee NUMERIC(10, 2) DEFAULT 0;
COMMENT ON COLUMN clients.monthly_fee IS 'Valor da mensalidade cobrada do cliente';

-- Adicionar coluna ad_budget como numérico com 10 dígitos, incluindo 2 decimais
ALTER TABLE clients ADD COLUMN IF NOT EXISTS ad_budget NUMERIC(10, 2) DEFAULT 0;
COMMENT ON COLUMN clients.ad_budget IS 'Orçamento mensal para anúncios'; 