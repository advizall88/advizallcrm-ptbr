-- Migration: Add Tasks table - 20 Maio 2024
-- Descrição: Adiciona tabela de tarefas para projetos de clientes

-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
    due_at TIMESTAMPTZ,
    assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar comentários nas colunas
COMMENT ON TABLE public.tasks IS 'Tarefas associadas a projetos de clientes';
COMMENT ON COLUMN public.tasks.id IS 'ID único da tarefa';
COMMENT ON COLUMN public.tasks.project_id IS 'ID do projeto associado à tarefa';
COMMENT ON COLUMN public.tasks.title IS 'Título da tarefa';
COMMENT ON COLUMN public.tasks.description IS 'Descrição detalhada da tarefa';
COMMENT ON COLUMN public.tasks.status IS 'Status atual da tarefa (todo, doing, done)';
COMMENT ON COLUMN public.tasks.due_at IS 'Data de vencimento da tarefa';
COMMENT ON COLUMN public.tasks.assignee_id IS 'ID do usuário responsável pela tarefa';
COMMENT ON COLUMN public.tasks.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.tasks.updated_at IS 'Data da última atualização do registro';

-- Adicionar índices para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks (assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);

-- Configurar políticas RLS (Row Level Security)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam suas próprias tarefas ou tarefas de projetos que gerenciam
CREATE POLICY tasks_select_policy ON public.tasks
    FOR SELECT
    USING (
        -- Usuários podem ver tarefas atribuídas a eles
        assignee_id = auth.uid() OR
        -- Ou tarefas de projetos associados a clientes que eles gerenciam
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.clients c ON p.client_id = c.id
            WHERE p.id = tasks.project_id AND c.owner_id = auth.uid()
        ) OR
        -- Moderadores e Admins podem ver todas as tarefas
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role IN ('moderator', 'admin')
        )
    );

-- Política para permitir que usuários insiram tarefas em projetos que gerenciam
CREATE POLICY tasks_insert_policy ON public.tasks
    FOR INSERT
    WITH CHECK (
        -- Usuários podem adicionar tarefas a projetos de seus clientes
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.clients c ON p.client_id = c.id
            WHERE p.id = tasks.project_id AND c.owner_id = auth.uid()
        ) OR
        -- Moderadores e Admins podem adicionar tarefas a qualquer projeto
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role IN ('moderator', 'admin')
        )
    );

-- Política para permitir que usuários atualizem tarefas atribuídas a eles ou em projetos que gerenciam
CREATE POLICY tasks_update_policy ON public.tasks
    FOR UPDATE
    USING (
        -- Usuários podem atualizar tarefas atribuídas a eles
        assignee_id = auth.uid() OR
        -- Ou tarefas de projetos associados a clientes que eles gerenciam
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.clients c ON p.client_id = c.id
            WHERE p.id = tasks.project_id AND c.owner_id = auth.uid()
        ) OR
        -- Moderadores e Admins podem atualizar todas as tarefas
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role IN ('moderator', 'admin')
        )
    );

-- Política para permitir que usuários deletem tarefas em projetos que gerenciam
CREATE POLICY tasks_delete_policy ON public.tasks
    FOR DELETE
    USING (
        -- Usuários não podem excluir tarefas, apenas Moderadores e Admins
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role IN ('moderator', 'admin')
        )
    );

-- Adicionar trigger para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION public.update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_tasks_updated_at(); 