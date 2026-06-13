# Arquitetura da Rádio Web - Igreja Vivendo em Cristo

## 1. Visão Geral

Este projeto propõe uma plataforma completa de rádio web para a Igreja Vivendo em Cristo, com transmissão ao vivo, catálogo de mensagens e louvores, programação, área administrativa e integrações para distribuição em web e dispositivos móveis.

O objetivo principal é oferecer uma experiência estável, simples de operar e escalável, permitindo:

- transmissão contínua 24/7;
- publicação de conteúdos gravados;
- gerenciamento de programação e locuções;
- divulgação de eventos, campanhas e avisos da igreja;
- coleta de métricas de audiência;
- suporte a pedidos de oração, contato e participação dos ouvintes.

## 2. Objetivos de Arquitetura

- Alta disponibilidade para a transmissão ao vivo.
- Baixa complexidade operacional para a equipe da igreja.
- Separação clara entre frontend, backend, streaming e administração.
- Escalabilidade horizontal para picos de audiência.
- Segurança para área administrativa e dados dos usuários.
- Facilidade de evolução para app mobile, smart speakers e integrações futuras.

## 3. Escopo Funcional

### 3.1 Funcionalidades públicas

- Player da rádio ao vivo.
- Página inicial com destaques, programação e avisos.
- Grade de programação diária e semanal.
- Biblioteca de conteúdos sob demanda:
  - pregações;
  - devocionais;
  - louvores;
  - podcasts;
  - programas especiais.
- Página de eventos e campanhas.
- Formulário de contato.
- Formulário de pedido de oração.
- Compartilhamento de conteúdo e transmissão.
- Links para redes sociais e canais externos.

### 3.2 Funcionalidades administrativas

- Login administrativo.
- Gestão de locutores, programas e horários.
- Cadastro e publicação de conteúdos gravados.
- Gestão de banners, avisos e destaques.
- Moderação de mensagens e pedidos recebidos.
- Painel com métricas básicas de audiência e consumo.
- Gestão de usuários administrativos por perfil.

## 4. Princípios Arquiteturais

- **Modularidade:** cada domínio funcional deve ser isolado.
- **API-first:** frontend e integrações consomem APIs bem definidas.
- **Cloud-ready:** componentes preparados para hospedagem em nuvem.
- **Observabilidade:** logs, métricas e alertas desde o início.
- **Fail-safe:** falhas em módulos auxiliares não devem derrubar a transmissão.
- **Content-centric:** conteúdos e programação são tratados como entidades centrais.

## 5. Arquitetura de Alto Nível

```text
Ouvinte Web/Mobile
        |
        v
Frontend Web / App
        |
        v
API Gateway / Backend
   |        |        |
   |        |        +--> Serviço de Conteúdo / CMS
   |        +-----------> Serviço de Programação
   +--------------------> Serviço de Interação
        |
        +--> Banco de Dados
        +--> Cache
        +--> Armazenamento de Mídia

Fonte de Áudio / Automação / Estúdio
        |
        v
Servidor de Ingestão de Streaming
        |
        v
Distribuição de Streaming / CDN
        |
        v
Player no Frontend
```

## 6. Componentes Principais

### 6.1 Frontend público

Responsável pela experiência do ouvinte.

#### Responsabilidades

- renderizar páginas públicas;
- reproduzir o stream ao vivo;
- exibir programação e conteúdos;
- enviar formulários de contato e oração;
- apresentar eventos, avisos e destaques.

#### Recomendação tecnológica

- **Next.js** para SSR/SSG e boa performance;
- **React** para componentes reutilizáveis;
- **Tailwind CSS** ou sistema de design leve para consistência visual;
- player HTML5 com fallback para dispositivos móveis.

### 6.2 Painel administrativo

Responsável pela operação diária da rádio.

#### Responsabilidades

- autenticação de administradores;
- CRUD de conteúdos;
- CRUD de programação;
- gestão de banners e avisos;
- visualização de métricas;
- moderação de interações.

#### Recomendação tecnológica

- aplicação web protegida, podendo compartilhar base com o frontend;
- rotas administrativas segregadas;
- controle de acesso por papéis:
  - administrador geral;
  - editor de conteúdo;
  - operador da rádio;
  - atendimento/moderação.

### 6.3 Backend / API

Camada central de negócio.

#### Responsabilidades

- autenticação e autorização;
- exposição de APIs públicas e privadas;
- regras de programação;
- publicação e consulta de conteúdos;
- recebimento de formulários;
- integração com serviços externos;
- consolidação de métricas.

#### Recomendação tecnológica

- **Node.js com TypeScript**;
- **Next.js API Routes** ou backend dedicado com **NestJS**;
- arquitetura em módulos por domínio.

### 6.4 Serviço de streaming

Camada responsável pela transmissão de áudio ao vivo.

#### Responsabilidades

- receber o áudio do estúdio ou automação;
- manter stream contínuo;
- distribuir áudio para ouvintes;
- suportar múltiplos formatos e bitrate quando necessário.

#### Recomendação tecnológica

- **Icecast** ou **SHOUTcast** para transmissão;
- encoder no estúdio com **BUTT**, **OBS**, **Mixxx** ou automação equivalente;
- CDN de streaming quando houver crescimento de audiência.

### 6.5 Banco de dados

Responsável por persistir dados estruturados da plataforma.

#### Entidades principais

- usuários administrativos;
- programas;
- episódios/conteúdos;
- categorias;
- agenda/programação;
- banners;
- eventos;
- pedidos de oração;
- mensagens de contato;
- métricas agregadas.

#### Recomendação tecnológica

- **PostgreSQL** como banco principal.

### 6.6 Cache e filas

#### Uso recomendado

- cache de programação e conteúdos mais acessados;
- desacoplamento de tarefas assíncronas;
- envio de notificações e e-mails;
- processamento de métricas.

#### Recomendação tecnológica

- **Redis** para cache e filas leves.

### 6.7 Armazenamento de mídia

Responsável por arquivos de áudio, imagens e materiais de apoio.

#### Recomendação tecnológica

- armazenamento em objeto compatível com **S3**;
- organização por buckets/pastas:
  - `audio/episodes`;
  - `audio/podcasts`;
  - `images/banners`;
  - `images/events`;
  - `documents`.

## 7. Domínios de Negócio

### 7.1 Domínio de transmissão

- estado do stream;
- origem do áudio;
- fallback de transmissão;
- metadados da faixa atual;
- bitrate e disponibilidade.

### 7.2 Domínio de programação

- programas recorrentes;
- horários;
- exceções de grade;
- campanhas especiais;
- transmissões ao vivo extraordinárias.

### 7.3 Domínio de conteúdo

- pregações;
- séries;
- podcasts;
- devocionais;
- categorias e tags;
- autores/pregadores.

### 7.4 Domínio de interação

- pedidos de oração;
- mensagens dos ouvintes;
- formulários de contato;
- participação em campanhas.

### 7.5 Domínio administrativo

- usuários;
- perfis;
- permissões;
- auditoria de ações.

## 8. Modelo de Dados Conceitual

### Principais relacionamentos

- um **Programa** possui vários **Horários**;
- um **Programa** pode possuir vários **Conteúdos**;
- um **Conteúdo** pertence a uma ou mais **Categorias**;
- um **Evento** pode possuir banners e links externos;
- um **Usuário Administrativo** possui um **Perfil**;
- um **Pedido de Oração** pode ter status de atendimento;
- uma **Mensagem** pode ser classificada e moderada.

## 9. APIs Recomendadas

### 9.1 APIs públicas

- `GET /api/public/live`
- `GET /api/public/schedule`
- `GET /api/public/programs`
- `GET /api/public/content`
- `GET /api/public/content/:slug`
- `GET /api/public/events`
- `POST /api/public/contact`
- `POST /api/public/prayer-requests`

### 9.2 APIs administrativas

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/dashboard`
- `CRUD /api/admin/programs`
- `CRUD /api/admin/schedule`
- `CRUD /api/admin/content`
- `CRUD /api/admin/events`
- `CRUD /api/admin/banners`
- `GET /api/admin/messages`
- `PATCH /api/admin/messages/:id`
- `GET /api/admin/prayer-requests`
- `PATCH /api/admin/prayer-requests/:id`

## 10. Fluxos Principais

### 10.1 Fluxo de transmissão ao vivo

1. Operador inicia encoder no estúdio.
2. Encoder envia áudio ao servidor de ingestão.
3. Servidor de streaming publica o stream.
4. Frontend consome URL pública do stream.
5. Ouvinte reproduz áudio no player.

### 10.2 Fluxo de publicação de conteúdo gravado

1. Administrador acessa painel.
2. Faz upload do áudio e imagem.
3. Preenche metadados do conteúdo.
4. Backend valida e persiste dados.
5. Arquivos são enviados ao storage.
6. Conteúdo é publicado no frontend.

### 10.3 Fluxo de pedido de oração

1. Ouvinte preenche formulário.
2. Frontend envia dados à API.
3. Backend valida e grava solicitação.
4. Sistema notifica equipe responsável.
5. Pedido recebe status no painel.

## 11. Segurança

### 11.1 Autenticação e autorização

- autenticação com sessão segura ou JWT com refresh controlado;
- RBAC por perfis administrativos;
- MFA opcional para administradores principais.

### 11.2 Proteções recomendadas

- HTTPS obrigatório;
- rate limiting em endpoints públicos;
- proteção CSRF em rotas sensíveis;
- validação de payloads;
- sanitização de entradas;
- política de upload segura;
- logs de auditoria para ações administrativas.

### 11.3 Dados sensíveis

- criptografia em trânsito;
- senhas com hash forte;
- retenção mínima de dados pessoais;
- adequação à LGPD para formulários e consentimento.

## 12. Escalabilidade

### Estratégias

- frontend servido por CDN;
- backend stateless para escalar horizontalmente;
- cache para endpoints públicos;
- storage externo para mídia;
- streaming desacoplado da aplicação principal;
- possibilidade de CDN de áudio para grandes audiências.

## 13. Disponibilidade e Resiliência

### Recomendações

- health checks para backend e streaming;
- reinício automático de serviços;
- monitoramento de uptime;
- fallback para playlist automática quando não houver entrada ao vivo;
- backups regulares do banco;
- versionamento e redundância de arquivos críticos.

## 14. Observabilidade

### Logs

- logs estruturados no backend;
- logs de autenticação;
- logs de publicação de conteúdo;
- logs de falhas de streaming e integrações.

### Métricas

- ouvintes simultâneos;
- tempo médio de sessão;
- conteúdos mais acessados;
- taxa de envio de formulários;
- disponibilidade do stream;
- erros por endpoint.

### Alertas

- stream offline;
- falha de upload;
- erro elevado na API;
- indisponibilidade do banco;
- uso anormal de recursos.

## 15. Ambientes

### 15.1 Desenvolvimento

- ambiente local com frontend, backend e banco;
- mocks para streaming quando necessário.

### 15.2 Homologação

- ambiente espelhando produção;
- testes de publicação e autenticação;
- validação de programação e conteúdo.

### 15.3 Produção

- infraestrutura gerenciada;
- domínio oficial da rádio;
- CDN e monitoramento ativos;
- rotinas de backup e observabilidade habilitadas.

## 16. Estratégia de Deploy

### Frontend

- deploy contínuo via pipeline CI/CD;
- preview por branch;
- promoção controlada para produção.

### Backend

- deploy automatizado com migrações versionadas;
- rollback simples;
- variáveis de ambiente segregadas por ambiente.

### Streaming

- configuração separada da aplicação;
- mudanças controladas e testadas fora do horário crítico.

## 17. Stack Recomendada

### Opção principal

- **Frontend:** Next.js + React + TypeScript
- **Backend:** Next.js API ou NestJS + TypeScript
- **Banco:** PostgreSQL
- **Cache/Fila:** Redis
- **Storage:** S3-compatible object storage
- **Streaming:** Icecast
- **Auth:** sessão segura ou provider externo
- **Hospedagem:** Vercel para frontend + backend compatível, ou infraestrutura separada para API e streaming

### Justificativa

Essa combinação reduz custo operacional, facilita manutenção, oferece boa performance e permite evolução gradual sem exigir uma equipe grande de infraestrutura.

## 18. Estrutura de Projeto Sugerida

```text
/
├─ app/                     # frontend público
├─ admin/                   # área administrativa
├─ components/              # componentes compartilhados
├─ lib/                     # utilitários, clientes e helpers
├─ modules/
│  ├─ auth/
│  ├─ content/
│  ├─ schedule/
│  ├─ streaming/
│  ├─ interaction/
│  └─ analytics/
├─ api/                     # handlers ou controllers
├─ prisma/                  # schema e migrações
├─ public/                  # assets estáticos
├─ docs/                    # documentação complementar
└─ ARCHITECTURE.md
```

## 19. Roadmap de Implementação

### Fase 1 - Fundação

- definição visual e identidade;
- setup do projeto;
- autenticação administrativa;
- player ao vivo;
- páginas institucionais;
- cadastro básico de programação.

### Fase 2 - Conteúdo e operação

- biblioteca de conteúdos;
- upload de mídia;
- banners e eventos;
- formulários de contato e oração;
- painel administrativo inicial.

### Fase 3 - Escala e inteligência

- métricas de audiência;
- notificações;
- automações operacionais;
- app mobile ou PWA;
- integrações com redes sociais e mensageria.

## 20. Riscos e Mitigações

### Risco: queda do stream

- mitigação: monitoramento, restart automático e fallback de playlist.

### Risco: operação complexa para equipe pequena

- mitigação: painel simples, automações e workflows enxutos.

### Risco: crescimento de audiência

- mitigação: CDN, cache e desacoplamento do streaming.

### Risco: perda de conteúdo

- mitigação: storage redundante e backups periódicos.

## 21. Conclusão

A arquitetura proposta prioriza simplicidade operacional, estabilidade da transmissão e capacidade de crescimento. Ela separa claramente a camada de experiência do usuário, a camada de negócio e a infraestrutura de streaming, permitindo que a Igreja Vivendo em Cristo tenha uma rádio web moderna, segura e preparada para expansão futura.