# Sistema de Gestão de Tarefas Colaborativo

**Desafio Full-stack Júnior — Jungle Gaming**

Uma aplicação completa de gerenciamento de tarefas colaborativo construída com arquitetura de microserviços usando NestJS, React, e RabbitMQ.

---

## 🏗️ Arquitetura

### Diagrama da Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   (React +      │◄──►│   (NestJS)     │◄──►│   (NestJS)     │
│   TanStack)     │    │   Port: 3001    │    │   Port: 3003    │
│   Port: 3000    │    │                 │    │   TCP Service   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                │ HTTP Routing
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │                 │    │                 │
                       │  Tasks Service  │    │ Notifications   │
                       │   (NestJS)     │◄──►│   Service       │
                       │   Port: 3004    │    │   (NestJS)     │
                       │   TCP Service   │    │   Port: 3005    │
                       │                 │    │   WebSocket     │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       │
                                ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   PostgreSQL    │    │    RabbitMQ     │    │   Rate Limiting │
│   Database      │    │   Message Broker│    │   (10 req/sec) │
│   Port: 5432    │    │   Port: 5672    │    │   Throttler     │
│   UUID Support  │    │   Management UI │    │                 │
│                 │    │   Port: 15672   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Padrões de Comunicação

```
┌─────────────────┐
│ Communication   │
│ Patterns        │
└─────────────────┘
         │
         ▼
┌─────────────────┐    ┌─────────────────┐
│ Synchronous     │    │ Asynchronous    │
│ (HTTP/TCP)      │    │ (RabbitMQ)      │
├─────────────────┤    ├─────────────────┤
│ • Frontend ←→   │    │ • Task Events   │
│   API Gateway   │    │ • Notifications │
│ • Gateway ←→    │    │ • Audit Logs    │
│   Microservices │    │ • Real-time     │
│ • JWT Validation│    │   Updates       │
└─────────────────┘    └─────────────────┘
```

---

## 🔧 Decisões Técnicas e Trade-offs

### 1. **Arquitetura de Microserviços**

**Decisão:** Implementar microserviços separados para Auth, Tasks e Notifications.

**Vantagens:**

- ✅ Separação clara de responsabilidades
- ✅ Escalabilidade independente de cada serviço
- ✅ Facilita manutenção e desenvolvimento em equipe
- ✅ Isolamento de falhas

**Trade-offs:**

- ❌ Maior complexidade de deployment
- ❌ Necessidade de comunicação entre serviços
- ❌ Overhead de rede para chamadas internas

### 2. **Comunicação Híbrida (HTTP + RabbitMQ)**

**Decisão:** HTTP para chamadas síncronas, RabbitMQ para eventos assíncronos.

**Vantagens:**

- ✅ Respostas rápidas para operações do usuário (HTTP)
- ✅ Desacoplamento para eventos de background (RabbitMQ)
- ✅ Flexibilidade para diferentes tipos de comunicação

**Trade-offs:**

- ❌ Complexidade de gerenciar dois protocolos
- ❌ Necessidade de garantir consistência eventual

### 3. **Passport JWT Strategy vs Custom Guards**

**Decisão:** Implementar Passport JWT Strategy conforme requisito do desafio.

**Vantagens:**

- ✅ Padrão da indústria
- ✅ Extensibilidade para múltiplas estratégias
- ✅ Integração nativa com NestJS
- ✅ Atende requisito obrigatório do desafio

**Trade-offs:**

- ❌ Maior overhead comparado a guards customizados
- ❌ Dependência adicional

### 4. **UUID como Primary Keys**

**Decisão:** Usar UUIDs em vez de auto-increment integers.

**Vantagens:**

- ✅ Segurança aprimorada (não-sequencial)
- ✅ Prevenção de enumeration attacks
- ✅ Fácil distribuição entre microserviços
- ✅ Sem conflitos de ID entre bancos

**Trade-offs:**

- ❌ Maior uso de espaço em disco
- ❌ Performance ligeiramente inferior em índices

### 5. **Rate Limiting Global**

**Decisão:** Implementar rate limiting (10 req/sec) no API Gateway.

**Vantagens:**

- ✅ Proteção contra ataques DDoS
- ✅ Controle centralizado de tráfego
- ✅ Cumprimento do requisito do desafio

**Trade-offs:**

- ❌ Possível limitação para usuários legítimos em picos
- ❌ Necessidade de configuração adequada por ambiente

---

## 🎯 Status de Implementação

### ✅ **Completado**

#### Authentication System

- **JWT Authentication** completo com Passport Strategy
- **User registration/login** com bcrypt password hashing
- **Token refresh e logout** com refresh token rotation
- **UUID-based security** para primary keys
- **Rate limiting** (10 req/sec) no API Gateway
- **Swagger documentation** completa com @ApiProperty decorators

#### Infrastructure

- **Docker Compose** com PostgreSQL e RabbitMQ
- **Monorepo setup** com Turborepo
- **TypeORM** com auto-migration
- **Environment-based configuration**
- **Microservice communication** via TCP transport

#### API Endpoints

```bash
POST /api/auth/register    # Registro + auto-login
POST /api/auth/login       # Autenticação
POST /api/auth/refresh     # Token refresh (protegido)
POST /api/auth/logout      # Logout (protegido)
```

### 🚧 **Em Desenvolvimento**

#### Tasks Service

- Estrutura básica criada
- Entities em desenvolvimento (Task.entity.ts aberto no IDE)
- CRUD operations pendentes
- RabbitMQ integration pendente

#### Frontend

- Estrutura não iniciada
- React + TanStack Router planejado
- shadcn/ui + Tailwind CSS planejado

#### Notifications Service

- Estrutura não iniciada

---

## 🐛 Problemas Conhecidos e Melhorias

### Problemas Conhecidos

1. **Validação de DTO Inconsistente**

   - **Problema:** RefreshTokenDto estava sem decorators de validação
   - **Status:** ✅ Corrigido
   - **Solução:** Adicionados @IsString() decorators

2. **Ports Mapping Inconsistente**
   - **Problema:** Documentação menciona diferentes portas
   - **Status:** 🔄 Em revisão
   - **Impacto:** Confusão na configuração de desenvolvimento

### Melhorias Planejadas

#### Curto Prazo

- [ ] **Health Checks** para todos os serviços
- [ ] **Logging centralizado** com Winston/Pino
- [ ] **Input sanitization** adicional
- [ ] **Error handling** padronizado

#### Médio Prazo

- [ ] **Testes unitários** completos (Jest)
- [ ] **Monitoring** com métricas de performance

#### Longo Prazo

- [ ] **Kubernetes deployment**
- [ ] **CI/CD pipeline** automatizado
