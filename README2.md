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

### 4. **UUID como Primary Keys para Tasks**

**Decisão:** Usar UUIDs em vez de auto-increment integers nas entidades do Tasks Service.

**Vantagens:**

- ✅ **Segurança aprimorada** (não-sequencial, previne enumeration attacks)
- ✅ **Consistência arquitetural** (Auth Service já usa UUIDs)
- ✅ **Microserviços** - fácil distribuição, sem conflitos de ID
- ✅ **Privacidade** - usuários não podem descobrir quantidade de tasks
- ✅ **Foreign Key consistency** - referências para User (UUID) já estabelecidas

**Trade-offs:**

- ❌ **Performance** - maior uso de espaço (16 bytes vs 4-8 bytes)
- ❌ **UX** - URLs menos amigáveis, sem referência humana ("Task #1234")
- ❌ **Debugging** - mais difícil trabalhar durante desenvolvimento
- ❌ **Indexação** - performance ligeiramente inferior para índices grandes

**Alternativa Considerada:**

- Sistema híbrido: UUID como PK + campo `taskNumber` auto-incrementing para referência humana
- **Decisão Final:** Manter apenas UUIDs por consistência e segurança no contexto do desafio

### 5. **Shared Exception Pattern**

**Decisão:** Criar classe `Exception` abstrata dentro de packages/ `@task-management/exceptions`.

**Vantagens:**

- ✅ **Consistência cross-service** - padrão uniforme de erros entre todos os microserviços
- ✅ **Separação Internal/External** - mensagens internas para logs, externas para API responses
- ✅ **Monorepo best practices** - reutilização de código via workspace packages
- ✅ **Debugging aprimorado** - metadados consistentes (timestamp, context, statusCode)
- ✅ **Security by design** - evita vazamento de informações internas para clientes
- ✅ **Maintainability** - mudanças centralizadas beneficiam todos os serviços

**Implementação:**

```typescript
export class Exception extends Error {
  public readonly internalMessage: string; // Para logs
  public readonly externalMessage: string; // Para clientes
  public readonly statusCode: number;
  public readonly context: string;
  public readonly timestamp: Date;
}
```

**Exemplo de Uso:**

```typescript
// TaskNotFoundException extends Exception
throw new TaskNotFoundException(taskId);
// Result: Internal: "Task with ID uuid not found in database"
//         External: "Task not found"
```

**Trade-offs:**

- ❌ **Overhead mínimo** - classe adicional vs exceptions nativas
- ❌ **Learning curve** - desenvolvedores precisam seguir o padrão

### 6. **Rate Limiting Global**

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

- ✅ **Estrutura básica** criada (NestJS microservice + TCP transport)
- ✅ **Entities completas** com TypeORM relationships:
  - `Task` - título, descrição, prazo, prioridade, status, createdBy
  - `Comment` - taskId, authorId, content, timestamps
  - `TaskAssignment` - taskId, userId, assignedAt (many-to-many)
  - `TaskHistory` - taskId, userId, action, previousValue, newValue (audit log)
- ✅ **Relacionamentos TypeORM** implementados:
  - Task ←→ Comments (OneToMany/ManyToOne)
  - Task ←→ TaskAssignments (OneToMany/ManyToOne)
  - Task ←→ TaskHistory (OneToMany/ManyToOne)
  - Cascade deletion configurado
- ✅ **Shared Exception Pattern** implementado:
  - Pacote `@task-management/exceptions` criado
  - Classe base `Exception` com internal/external messages
  - `TaskNotFoundException` implementada como exemplo
  - Integração com o Turborepo
- 🚧 **CRUD operations** pendentes
- 🚧 **RabbitMQ integration** pendente

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
