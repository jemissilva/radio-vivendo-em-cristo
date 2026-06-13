# Rádio Web Igreja Vivendo em Cristo

Documentação completa do projeto da Rádio Web Igreja Vivendo em Cristo, cobrindo backend, website público, aplicativo mobile, arquitetura, execução local, APIs, segurança, estrutura de dados e próximos passos.

## 1. Visão geral

O projeto foi estruturado como uma plataforma digital para a rádio oficial da Igreja Vivendo em Cristo, com três frentes principais:

- **backend** em Node.js + TypeScript + Express;
- **website público** em React + Vite;
- **aplicativo mobile** em Expo + React Native.

O objetivo é disponibilizar transmissão ao vivo, programação, conteúdos sob demanda, eventos, formulários de contato e pedidos de oração, além de uma base administrativa pronta para evolução.

## 2. Estrutura do repositório

```text
/
├─ src/                 # backend API
├─ website/             # frontend web público
├─ mobile/              # aplicativo mobile Expo
├─ ARCHITECTURE.md      # visão arquitetural macro
├─ README.md            # documentação consolidada do projeto
├─ env.example          # variáveis de ambiente do backend
├─ package.json         # scripts e dependências do backend
└─ tsconfig.json        # TypeScript do backend
```

## 3. Componentes do projeto

### 3.1 Backend

O backend expõe:

- endpoints públicos para consumo do site e do app;
- autenticação administrativa com JWT;
- endpoints administrativos protegidos por perfil;
- validação de payloads com Zod;
- persistência inicial em memória com dados seed.

Stack principal:

- `Node.js`
- `TypeScript`
- `Express`
- `Zod`
- `JWT`
- `bcryptjs`
- `helmet`
- `cors`

### 3.2 Website público

O website consome a API pública do backend e apresenta:

- player ao vivo;
- hero institucional;
- programas;
- programação;
- conteúdos;
- eventos;
- formulário de oração;
- formulário de contato.

Stack principal:

- `React 18`
- `TypeScript`
- `Vite`

### 3.3 Aplicativo mobile

O app mobile entrega a experiência da rádio em dispositivos móveis com:

- player ao vivo;
- home com destaques;
- listagem de programas;
- listagem de conteúdos;
- listagem de eventos;
- favoritos locais;
- envio de contato e pedido de oração.

Stack principal:

- `Expo`
- `React Native`
- `Expo Router`
- `expo-av`
- `AsyncStorage`

## 4. Funcionalidades implementadas

### 4.1 Funcionalidades públicas

- transmissão ao vivo com metadados básicos;
- grade de programação;
- catálogo de programas;
- catálogo de conteúdos publicados;
- listagem de eventos publicados;
- envio de mensagem de contato;
- envio de pedido de oração.

### 4.2 Funcionalidades administrativas

- login administrativo;
- logout administrativo;
- dashboard com métricas agregadas;
- CRUD de programas;
- CRUD de programação;
- CRUD de conteúdos;
- CRUD de eventos;
- CRUD de banners;
- listagem e atualização de mensagens;
- listagem e atualização de pedidos de oração.

### 4.3 Controle de acesso por perfil

Perfis existentes no backend:

- `admin`
- `content_editor`
- `radio_operator`
- `moderator`

Regras atuais:

- `admin`: acesso total;
- `content_editor`: programas, conteúdos, eventos e banners;
- `radio_operator`: programação;
- `moderator`: mensagens e pedidos de oração.

## 5. Arquitetura atual

### 5.1 Fluxo geral

```text
Website / App Mobile
        |
        v
Backend Express (/api/public)
        |
        +--> dados em memória (seed)
        |
        +--> autenticação JWT (/api/admin)
```

### 5.2 Situação atual da persistência

Hoje o projeto usa uma base em memória definida em `src/lib/store.ts`. Isso significa:

- os dados são carregados a partir de um seed inicial;
- alterações feitas via API não persistem após reiniciar o servidor;
- a estrutura já está pronta para futura migração para banco relacional, como PostgreSQL.

### 5.3 Segurança aplicada

O backend já inclui:

- `helmet` para headers de segurança;
- `cors` configurável por variável de ambiente;
- autenticação JWT para área administrativa;
- hash de senha com `bcryptjs`;
- validação de entrada com `zod`;
- middleware centralizado de tratamento de erros.

## 6. Backend em detalhes

### 6.1 Inicialização

Arquivos principais:

- `src/server.ts`: sobe o servidor HTTP;
- `src/app.ts`: configura middlewares, healthcheck e rotas.

### 6.2 Middlewares

Middlewares principais:

- `cors` com origem configurável;
- `helmet`;
- `express.json({ limit: "2mb" })`;
- `requireAuth`;
- `requireRole`;
- `notFoundHandler`;
- `errorHandler`.

### 6.3 Healthcheck

Endpoint:

- `GET /health`

Resposta esperada:

```json
{
  "status": "ok",
  "service": "radio-vivendo-em-cristo-backend",
  "timestamp": "2026-06-13T00:00:00.000Z"
}
```

### 6.4 Variáveis de ambiente

Arquivo base:

- `env.example`

Variáveis atuais:

| Variável | Obrigatória | Descrição |
|---|---:|---|
| `PORT` | não | Porta do backend. Padrão: `3001` |
| `JWT_SECRET` | sim | Segredo usado para assinar e validar tokens JWT |
| `CORS_ORIGIN` | não | Origem permitida no CORS. Padrão: `*` |

Exemplo:

```env
PORT=3001
JWT_SECRET=change-me
CORS_ORIGIN=*
```

### 6.5 Usuário seed

Usuário administrativo inicial:

- email: `admin@vivendoemcristo.org`
- senha: `Admin@123`
- perfil: `admin`

## 7. Modelo de dados do backend

As entidades principais definidas em `src/types.ts` são:

### 7.1 `AdminUser`

- identificação do administrador;
- email;
- senha com hash;
- perfil de acesso;
- status ativo;
- timestamps.

### 7.2 `Program`

- nome do programa;
- slug;
- descrição;
- apresentador;
- status ativo;
- imagem de capa opcional.

### 7.3 `ScheduleEntry`

- vínculo com programa;
- dia da semana;
- horário inicial e final;
- indicador de transmissão ao vivo;
- observações.

### 7.4 `Category`

- nome;
- slug.

### 7.5 `ContentItem`

- título;
- slug;
- descrição;
- tipo do conteúdo;
- autor;
- URL do áudio;
- imagem opcional;
- duração;
- data de publicação;
- status;
- categorias;
- programa relacionado;
- tags.

Tipos de conteúdo suportados:

- `pregacao`
- `devocional`
- `louvor`
- `podcast`
- `programa_especial`

### 7.6 `EventItem`

- título;
- slug;
- descrição;
- local;
- início e fim;
- banner opcional;
- link externo opcional;
- status de publicação.

### 7.7 `Banner`

- título;
- imagem;
- link opcional;
- ativo/inativo;
- prioridade.

### 7.8 `ContactMessage`

- nome;
- email;
- telefone opcional;
- assunto;
- mensagem;
- status;
- classificação opcional.

### 7.9 `PrayerRequest`

- nome;
- email opcional;
- telefone opcional;
- pedido;
- indicador de privacidade;
- status;
- responsável opcional.

### 7.10 `StreamStatus`

- status ao vivo;
- URL principal do stream;
- URL fallback opcional;
- faixa atual;
- bitrate;
- ouvintes atuais;
- timestamp de atualização.

### 7.11 `AnalyticsSnapshot`

- ouvintes atuais;
- pico diário;
- média de sessão;
- conteúdos mais acessados;
- mensagens recebidas no dia;
- pedidos de oração no dia;
- uptime do stream.

## 8. Seed inicial

O seed atual inclui:

- 1 usuário administrador;
- 2 programas;
- 2 horários de programação;
- 2 categorias;
- 2 conteúdos publicados;
- 1 evento;
- 1 banner;
- status inicial do stream;
- snapshot inicial de analytics.

Isso permite testar o projeto imediatamente após subir o backend.

## 9. API pública

Base:

- `/api/public`

### 9.1 `GET /api/public/live`

Retorna o status atual da transmissão.

Campos principais:

- `isLive`
- `streamUrl`
- `fallbackUrl`
- `currentTrack`
- `bitrateKbps`
- `listenersNow`
- `updatedAt`

### 9.2 `GET /api/public/schedule`

Retorna a grade de programação com o programa associado em cada entrada.

Campos principais:

- dados do horário;
- objeto `program` resolvido a partir de `programId`.

### 9.3 `GET /api/public/programs`

Retorna apenas programas ativos.

### 9.4 `GET /api/public/content`

Retorna conteúdos publicados, ordenados por data decrescente, com categorias resolvidas.

### 9.5 `GET /api/public/content/:slug`

Retorna um conteúdo específico pelo slug.

Erros:

- `404` quando o conteúdo não existe.

### 9.6 `GET /api/public/events`

Retorna eventos publicados, ordenados por data.

### 9.7 `POST /api/public/contact`

Cria uma mensagem de contato.

Payload:

```json
{
  "name": "Maria",
  "email": "maria@email.com",
  "phone": "11999999999",
  "subject": "Pedido de informação",
  "message": "Gostaria de saber os horários dos programas."
}
```

Resposta:

```json
{
  "message": "Mensagem recebida com sucesso",
  "data": {
    "id": "message_xxx"
  }
}
```

### 9.8 `POST /api/public/prayer-requests`

Cria um pedido de oração.

Payload:

```json
{
  "name": "José",
  "email": "jose@email.com",
  "phone": "11999999999",
  "request": "Peço oração pela minha família.",
  "privateRequest": true
}
```

Resposta:

```json
{
  "message": "Pedido de oração recebido com sucesso",
  "data": {
    "id": "prayer_xxx"
  }
}
```

## 10. API administrativa

Base:

- `/api/admin`

Todas as rotas, exceto login, exigem token Bearer.

### 10.1 Autenticação

#### `POST /api/admin/auth/login`

Payload:

```json
{
  "email": "admin@vivendoemcristo.org",
  "password": "Admin@123"
}
```

Resposta:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "admin_xxx",
    "name": "Administrador Geral",
    "email": "admin@vivendoemcristo.org",
    "role": "admin"
  }
}
```

#### `POST /api/admin/auth/logout`

Requer autenticação.

Resposta:

```json
{
  "message": "Logout realizado com sucesso"
}
```

### 10.2 Dashboard

#### `GET /api/admin/dashboard`

Retorna:

- analytics;
- totais por entidade;
- últimas mensagens;
- últimos pedidos de oração.

### 10.3 Programas

- `GET /api/admin/programs`
- `POST /api/admin/programs`
- `PUT /api/admin/programs/:id`
- `DELETE /api/admin/programs/:id`

### 10.4 Programação

- `GET /api/admin/schedule`
- `POST /api/admin/schedule`
- `PUT /api/admin/schedule/:id`
- `DELETE /api/admin/schedule/:id`

### 10.5 Conteúdos

- `GET /api/admin/content`
- `POST /api/admin/content`
- `PUT /api/admin/content/:id`
- `DELETE /api/admin/content/:id`

### 10.6 Eventos

- `GET /api/admin/events`
- `POST /api/admin/events`
- `PUT /api/admin/events/:id`
- `DELETE /api/admin/events/:id`

### 10.7 Banners

- `GET /api/admin/banners`
- `POST /api/admin/banners`
- `PUT /api/admin/banners/:id`
- `DELETE /api/admin/banners/:id`

### 10.8 Mensagens

- `GET /api/admin/messages`
- `PATCH /api/admin/messages/:id`

### 10.9 Pedidos de oração

- `GET /api/admin/prayer-requests`
- `PATCH /api/admin/prayer-requests/:id`

## 11. Validações de entrada

As validações ficam em `src/lib/validators.ts`.

### 11.1 Login

- email válido;
- senha com mínimo de 8 caracteres.

### 11.2 Programas

- nome mínimo de 3 caracteres;
- descrição mínima de 10;
- apresentador mínimo de 3;
- imagem opcional deve ser URL válida.

### 11.3 Programação

- `dayOfWeek` entre `0` e `6`;
- horários no formato `HH:mm`.

### 11.4 Conteúdos

- título e descrição mínimos;
- tipo restrito aos valores suportados;
- `audioUrl` obrigatória e válida;
- `durationSeconds` positivo;
- ao menos uma categoria.

### 11.5 Eventos

- datas em formato datetime;
- URLs opcionais válidas.

### 11.6 Banners

- imagem obrigatória;
- prioridade inteira.

### 11.7 Formulários públicos

Contato:

- nome;
- email;
- assunto;
- mensagem.

Pedido de oração:

- nome;
- pedido;
- email opcional;
- telefone opcional.

## 12. Website em detalhes

### 12.1 Objetivo

O website é o frontend público oficial da rádio e consome a API REST do backend.

### 12.2 Estrutura principal

Arquivos centrais:

- `website/src/App.tsx`
- `website/src/lib/api.ts`
- `website/src/lib/content.ts`
- `website/src/components/*`

### 12.3 Fluxo de carregamento

Na inicialização, o website busca em paralelo:

- live;
- programs;
- schedule;
- content;
- events.

Se a API falhar, a interface mostra estado de erro orientando a verificar o backend.

### 12.4 Seções renderizadas

- topo com navegação;
- hero;
- player ao vivo;
- programas;
- programação;
- conteúdos;
- eventos;
- oração;
- contato;
- rodapé.

### 12.5 Configuração da API

Por padrão:

- `http://localhost:3001/api/public`

Variável suportada:

```env
VITE_API_BASE_URL=http://localhost:3001/api/public
```

### 12.6 Scripts do website

Executar dentro de `website/`:

```bash
npm install
npm run dev
```

Scripts disponíveis:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`

## 13. Mobile em detalhes

### 13.1 Objetivo

O app mobile entrega a experiência da rádio em Android, iOS e web via Expo.

### 13.2 Estrutura principal

Arquivos centrais:

- `mobile/app/_layout.tsx`
- `mobile/app/(tabs)/index.tsx`
- `mobile/app/(tabs)/programas.tsx`
- `mobile/app/(tabs)/conteudos.tsx`
- `mobile/app/(tabs)/eventos.tsx`
- `mobile/app/(tabs)/mais.tsx`
- `mobile/src/context/app-context.tsx`
- `mobile/src/services/public-api.ts`
- `mobile/src/services/forms-service.ts`
- `mobile/src/hooks/use-audio-player.ts`

### 13.3 Navegação

O app usa navegação por abas com telas para:

- início;
- programas;
- conteúdos;
- eventos;
- mais.

### 13.4 Recursos implementados

- player ao vivo com `expo-av`;
- fallback local de dados quando a API falha;
- favoritos persistidos com `AsyncStorage`;
- formulários de oração e contato;
- links externos para redes sociais.

### 13.5 Configuração da API e stream

Arquivo:

- `mobile/src/config/app-config.ts`

Valores atuais:

- `apiBaseUrl: http://10.0.2.2:3001/api/public`
- `streamUrl: https://stream.zeno.fm/r4mpcrfwfzzuv`

Observação:

- `10.0.2.2` é o host especial do emulador Android para acessar `localhost` da máquina.

### 13.6 Estratégia de fallback

O contexto principal do app tenta carregar dados reais da API. Se falhar:

- usa dados fallback locais;
- mantém o stream configurado;
- preserva a experiência básica do usuário.

### 13.7 Scripts do mobile

Executar dentro de `mobile/`:

```bash
npm install
npm run dev
```

Scripts disponíveis:

- `npm run dev`
- `npm run android`
- `npm run web`
- `npm run lint`

## 14. Como executar o projeto

### 14.1 Backend

Na raiz:

```bash
npm install
npm run dev
```

Servidor padrão:

- `http://localhost:3001`

### 14.2 Website

Em outro terminal:

```bash
cd website
npm install
npm run dev
```

### 14.3 Mobile

Em outro terminal:

```bash
cd mobile
npm install
npm run dev
```

## 15. Fluxos principais do sistema

### 15.1 Fluxo do ouvinte no website

1. usuário acessa o site;
2. frontend consulta a API pública;
3. player recebe a URL do stream;
4. usuário navega por programas, conteúdos e eventos;
5. usuário pode enviar contato ou pedido de oração.

### 15.2 Fluxo do ouvinte no app

1. app inicializa;
2. contexto carrega dados da API;
3. em caso de falha, usa fallback local;
4. usuário ouve a rádio e interage com conteúdos;
5. favoritos ficam salvos localmente.

### 15.3 Fluxo administrativo

1. administrador faz login;
2. backend valida credenciais;
3. JWT é emitido;
4. cliente administrativo envia Bearer token;
5. backend aplica `requireAuth` e `requireRole`;
6. operações CRUD são executadas.

## 16. Estado atual do projeto

### 16.1 O que já está pronto

- backend funcional;
- API pública funcional;
- API administrativa funcional;
- website público funcional;
- app mobile funcional;
- documentação arquitetural macro;
- seed inicial para demonstração.

### 16.2 O que ainda não existe

No estado atual, ainda não há:

- banco de dados persistente;
- painel administrativo frontend;
- upload real de mídia;
- integração real com provedor de streaming;
- autenticação com refresh token;
- observabilidade externa;
- testes automatizados;
- pipeline CI/CD configurado no repositório.

## 17. Limitações atuais

- persistência apenas em memória;
- dados resetam ao reiniciar o backend;
- URLs de mídia e imagens ainda são exemplos;
- website depende do backend estar ativo;
- mobile depende da configuração correta do host da API;
- não existe painel visual para administração, apenas API.

## 18. Recomendações para evolução

### 18.1 Prioridade alta

- migrar `store.ts` para PostgreSQL;
- criar painel administrativo web;
- implementar upload de áudio e imagens;
- integrar streaming real com monitoramento;
- separar ambientes dev, homologação e produção.

### 18.2 Prioridade média

- adicionar testes unitários e de integração;
- adicionar logs estruturados;
- adicionar rate limiting;
- adicionar auditoria administrativa;
- adicionar paginação e filtros nas listagens.

### 18.3 Prioridade futura

- notificações;
- analytics avançado;
- PWA;
- integração com redes sociais;
- push notifications no app.

## 19. Deploy sugerido

### 19.1 Backend

Pode ser hospedado em:

- VPS;
- Render;
- Railway;
- Fly.io;
- outro ambiente Node compatível.

#### Deploy no Render

Arquivos preparados no repositório:

- `render.yaml`
- `.renderignore`

Configuração usada:

- **Root Directory:** raiz do projeto
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/health`

Variáveis de ambiente obrigatórias no Render:

- `JWT_SECRET`
- `CORS_ORIGIN`
- `NODE_ENV=production`

Observações:

- `PORT` é fornecida automaticamente pelo Render;
- após publicar o site na Vercel, atualize `CORS_ORIGIN` no Render com o domínio final do frontend.

### 19.2 Website

Pode ser hospedado em:

- Vercel;
- Netlify;
- Cloudflare Pages;
- qualquer host estático compatível com Vite.

#### Deploy na Vercel

Arquivos preparados no repositório:

- `vercel.json`
- `website/.vercelignore`

Configuração usada:

- **Root Directory:** `website`
- **Framework Preset:** `Vite`
- **Output Directory:** `dist`

Variável de ambiente obrigatória na Vercel:

- `VITE_API_BASE_URL=https://SEU-BACKEND.onrender.com/api/public`

Fluxo recomendado:

1. publicar o backend no Render;
2. copiar a URL pública do backend;
3. configurar `VITE_API_BASE_URL` na Vercel;
4. atualizar `CORS_ORIGIN` no Render com o domínio final da Vercel.

### 19.3 Mobile

Pode ser distribuído via:

- Expo;
- build Android APK/AAB;
- build iOS quando aplicável.

## 20. Arquivos mais importantes

### Raiz

- `README.md`: documentação consolidada;
- `ARCHITECTURE.md`: visão arquitetural macro;
- `package.json`: scripts do backend;
- `env.example`: variáveis do backend.

### Backend

- `src/server.ts`
- `src/app.ts`
- `src/routes/public-routes.ts`
- `src/routes/admin-routes.ts`
- `src/services/public-service.ts`
- `src/services/admin-service.ts`
- `src/lib/store.ts`
- `src/lib/auth.ts`
- `src/lib/validators.ts`
- `src/middleware/auth.ts`

### Website

- `website/src/App.tsx`
- `website/src/lib/api.ts`
- `website/src/lib/content.ts`

### Mobile

- `mobile/src/config/app-config.ts`
- `mobile/src/context/app-context.tsx`
- `mobile/src/services/public-api.ts`
- `mobile/src/services/forms-service.ts`
- `mobile/src/hooks/use-audio-player.ts`

## 21. Resumo executivo

O projeto já possui uma base sólida e funcional para a Rádio Web Igreja Vivendo em Cristo. A solução atual entrega backend, website e aplicativo mobile integrados, com autenticação administrativa, catálogo de conteúdos, programação, eventos e formulários públicos.

O próximo passo natural é transformar a base atual em uma plataforma pronta para produção, principalmente com persistência real, painel administrativo visual, integração definitiva com streaming e observabilidade.