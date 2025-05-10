# Avatares de Usuários

Este diretório é usado para armazenar os avatares de usuários que são enviados através da interface do perfil.

## Formato de arquivos

- Os avatares são salvos com um nome único baseado no formato: `{user_id}_{timestamp}.{extensão}`
- Formatos suportados: JPEG, PNG, GIF
- Tamanho máximo: 5MB

## Fluxo de trabalho

1. Quando um usuário faz upload de uma imagem na página de perfil, um nome de arquivo único é gerado
2. A imagem é salva fisicamente neste diretório
3. O caminho relativo (`/images/avatars/filename.ext`) é armazenado no banco de dados
4. As imagens são acessadas diretamente pelo navegador usando o caminho relativo

## Benefícios deste sistema

- Evita o uso de URLs de tipo "blob" que são temporárias e geram erros depois que a sessão termina
- Mantém compatibilidade com URLs externas (usuários podem usar links para avatares online)
- Garante o controle sobre os tipos e tamanhos de arquivo
- Facilita backup e gerenciamento de arquivos

## Acesso e Processamento

- As imagens são processadas pela função `processAvatarUrl()` localizada em `src/lib/utils.ts`
- Esta função detecta diferentes tipos de URLs (externas, blobs, caminhos locais) e os processa corretamente 