# Cardápio Digital - Sistema Completo

Sistema de cardápio digital com painel administrativo integrado ao Supabase.

## Recursos

### Para Clientes
- Cardápio interativo com produtos organizados por categorias
- Carrinho de compras flutuante com gerenciamento de quantidades
- Formulário de checkout completo
- Envio automático de pedidos via WhatsApp
- Suporte a modo claro e escuro

### Para Administradores
- Login seguro via Supabase Auth
- Dashboard com estatísticas em tempo real
- Gerenciamento completo de categorias
- CRUD de produtos com suporte a promoções
- Cadastro de garçons com fotos
- Visualização de histórico de pedidos

## Configuração do Supabase

### 1. Criar as Tabelas no Banco de Dados

1. Acesse seu projeto no Supabase: https://vmrbrueqmotgvpnatsso.supabase.co
2. Vá em **SQL Editor** no menu lateral
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL e clique em **Run**

Isso criará todas as tabelas necessárias: `categories`, `products`, `waiters` e `orders`.

### 2. Configurar Permissões (Row Level Security)

Para permitir que o aplicativo funcione corretamente, você precisa desabilitar temporariamente o RLS:

1. No Supabase, vá em **Authentication** > **Policies**
2. Para cada tabela (`categories`, `products`, `waiters`, `orders`):
   - Clique na tabela
   - Clique em "Disable RLS" (para desenvolvimento)

**Nota:** Em produção, você deve configurar políticas RLS adequadas.

### 3. Verificar Autenticação

O sistema usa o email `kernelpanic10190@gmail.com` cadastrado no Supabase Auth:

1. Vá em **Authentication** > **Users**
2. Verifique se o usuário existe
3. Se não existir, crie um novo usuário com email e senha

## Configuração de Variáveis de Ambiente (OBRIGATÓRIO)

O sistema requer que as credenciais do Supabase sejam configuradas através de variáveis de ambiente:

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. As credenciais já estão pré-configuradas no `.env.example` para o projeto de demonstração
3. Se estiver usando seu próprio projeto Supabase, edite o `.env` com suas credenciais

**Importante:** O arquivo `.env` não deve ser commitado no repositório (já está no .gitignore).

## Como Usar

### Iniciar o Servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5000`

### Acessar o Sistema

- **Cardápio (Cliente):** http://localhost:5000/
- **Painel Admin:** http://localhost:5000/admin/login

### Fluxo de Trabalho

1. **Admin:** Faça login no painel administrativo
2. **Admin:** Cadastre categorias, produtos e garçons
3. **Admin:** Configure promoções com datas de início e fim
4. **Cliente:** Navegue pelo cardápio e adicione produtos ao carrinho
5. **Cliente:** Finalize o pedido preenchendo os dados
6. **Cliente:** O pedido é enviado via WhatsApp automaticamente
7. **Admin:** Visualize o histórico de pedidos no painel

## Tecnologias Utilizadas

### Frontend
- React 18 com TypeScript
- Tailwind CSS para estilização
- shadcn/ui para componentes
- React Query para gerenciamento de estado
- Wouter para roteamento

### Backend
- Express.js
- Supabase (PostgreSQL + Auth)
- Zod para validação

## Estrutura de Dados

### Categorias
- Nome, descrição, ordem de exibição
- Status ativo/inativo

### Produtos
- Nome, descrição, preço, imagem (URL)
- Categoria associada
- Promoção com preço especial e período de validade
- Status ativo/inativo

### Garçons
- Nome, foto (URL), WhatsApp
- Status ativo/inativo

### Pedidos
- Cliente, mesa, garçom
- Itens do pedido com quantidades e preços
- Forma de pagamento
- Observações
- Status (pendente, confirmado, concluído, cancelado)

## Próximos Passos (Fase 2)

- Relatórios de vendas e estatísticas
- Notificações em tempo real para novos pedidos
- Histórico de pedidos por mesa e garçom
- Gestão de estoque com alertas
- Categorias personalizadas e filtros avançados

## Suporte

Para questões técnicas, consulte a documentação do Supabase:
- https://supabase.com/docs
