# Configuração do Storage no Supabase para Avatares

Este guia explica como configurar o Supabase Storage para permitir o upload de avatares de usuários.

## 1. Criar um Bucket para Avatares

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. No menu lateral, clique em **Storage**
4. Clique no botão **+ Create new bucket**
5. Digite `avatars` como nome do bucket
6. Marque a opção **Public bucket** para permitir acesso público às imagens
7. Clique em **Create bucket**

## 2. Configurar Políticas de Segurança (RLS)

### Para permitir que usuários autenticados façam upload de avatares:

1. Vá para a seção **Storage** no dashboard
2. Selecione o bucket `avatars` que você acabou de criar
3. Clique na aba **Policies**
4. Clique em **+ Add Policy**
5. Escolha a opção **For authenticated users only**
6. Defina as seguintes permissões:

**Para INSERT (Upload de arquivos):**

- Nome da Política: `Avatar Upload`
- Permissão: `INSERT`
- Usando expressão: 
```sql
auth.uid() = auth.uid()
```

**Para SELECT (Visualização de arquivos):**

- Nome da Política: `Avatar View`
- Permissão: `SELECT`
- Usando expressão: 
```sql
bucket_id = 'avatars'
```

**Para UPDATE (Atualização de arquivos):**

- Nome da Política: `Avatar Update`
- Permissão: `UPDATE`
- Usando expressão: 
```sql
auth.uid() = auth.uid() AND (storage.foldername(name))[1] = auth.uid()::text
```

## 3. Testar a Configuração

Após configurar as políticas, você pode testar o upload de avatares através da sua aplicação:

1. Faça login na aplicação AdvizallCRM
2. Vá para a página de Configurações
3. Clique em "Change Avatar" e selecione uma imagem
4. A imagem deve ser enviada com sucesso para o Supabase Storage

## 4. Limitações e Considerações

- O tamanho máximo do arquivo é de 2MB
- Apenas formatos JPEG, PNG e GIF são permitidos
- As URLs dos avatares são armazenadas na coluna `avatar_url` da tabela `users`
- As imagens são nomeadas usando o formato `userId_timestamp.extensão`

## 5. Solução de Problemas

Se você encontrar erros durante o upload:

- **Erro 400 (Bad Request)** - Verifique se o bucket 'avatars' existe
- **Erro 403 (Forbidden)** - Verifique as políticas RLS
- **Erro 413 (Payload Too Large)** - A imagem excede o limite de 2MB

Para verificar os logs de erro, acesse a seção **Storage** no dashboard do Supabase. 