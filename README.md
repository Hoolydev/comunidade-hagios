# Comunidade Hagios

Plataforma web da Hagios Marketing para uma comunidade paga de Marketing com IA.
O MVP inclui landing page pública, login/cadastro, Stripe Checkout, webhook de
assinatura, área interna protegida, cursos com YouTube embedado, materiais por
links externos, grupo de WhatsApp configurável e painel admin.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, banco e controle de usuários
- Stripe Checkout, Customer Portal e Webhook
- YouTube Embed

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

Preencha `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_PRICE_ID=
```

`STRIPE_PRICE_ID` é opcional. Se ficar vazio, o app cria o preço mensal de
R$39,90 diretamente na sessão do Checkout. Para usar um preço criado no painel
Stripe, informe o ID do price mensal em BRL.

## Supabase

1. Crie um projeto no Supabase.
2. Rode `supabase/schema.sql` no SQL Editor.
3. Rode `supabase/seed.sql` para dados iniciais.
4. Ative Email/Password em Authentication.
5. Para tornar um usuário admin, cadastre-se pela plataforma e rode:

```sql
update public.profiles
set role = 'admin'
where email = 'seu-email@dominio.com';
```

O acesso à comunidade é liberado quando `profiles.subscription_status` for
`active` ou `trialing`. Status como `canceled`, `past_due` e `unpaid` bloqueiam
o acesso.

## Stripe

Crie ou use um produto chamado `Comunidade Hagios`, assinatura mensal em BRL no
valor de R$39,90. Configure o webhook para:

```text
https://seu-dominio.com/api/stripe/webhook
```

Eventos usados:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Para testar localmente:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o webhook secret gerado para `STRIPE_WEBHOOK_SECRET`.

## Rotas principais

- `/` landing page pública
- `/login` login, cadastro e recuperação de senha
- `/checkout` compra da assinatura
- `/comunidade` dashboard interno protegido
- `/comunidade/conteudos` grade com filtros
- `/comunidade/cursos/[slug]` curso com aulas e vídeos
- `/comunidade/materiais` materiais externos
- `/comunidade/whatsapp` grupo oficial
- `/comunidade/conta` dados e portal Stripe
- `/admin` CRUD de cursos, aulas, materiais, WhatsApp e usuários

## Pagamento único no futuro

A configuração de cobrança fica em `src/lib/stripe/config.ts` e a criação da
sessão fica em `src/app/api/checkout/route.ts`. Para trocar para pagamento único,
altere `mode` para `payment` e remova `recurring` do `price_data`.
