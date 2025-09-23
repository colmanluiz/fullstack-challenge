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

### 6. **Shared ValidationService Pattern**

**Decisão:** Criar `ValidationService` centralizado para comunicação entre microserviços.

**Contexto:** Comments precisa validar tanto `taskId` (mesmo serviço) quanto `authorId` (Auth Service).

**Vantagens:**

- ✅ **DRY principle** - lógica de validação escrita uma vez, reutilizada em múltiplos domains
- ✅ **Comunicação centralizada** - único ponto de configuração para TCP client com Auth Service
- ✅ **Consistência de erro** - todos os services usam as mesmas exceptions e padrões
- ✅ **Facilita testing** - mock único ValidationService para testes unitários
- ✅ **Escalabilidade** - fácil adicionar novas validações (permissions, status, etc.)

**Implementação:**

```typescript
// Shared validation across domains
class ValidationService {
  async validateUserExists(userId: string): Promise<void> {
    const userExists = await this.authClient.send("user_exists", userId);
    if (!userExists) throw new UserNotFoundException(userId);
  }

  async validateTaskExists(taskId: string): Promise<void> {
    // Direct DB access (same service)
  }
}

// Usage in both TasksService and CommentsService
await this.validationService.validateUserExists(authorId);
```

**Trade-offs:**

- ❌ **Abstração adicional** - uma camada a mais vs validação direta
- ❌ **Acoplamento suave** - domains compartilham o ValidationService

**Alternativas Consideradas:**

- **Validação direta em cada service** - mais simples, mas duplica código
- **Validação apenas no API Gateway** - perderia business rules no domain layer

### 7. **Cross-Domain Validation Strategy**

**Decisão:** Comments Service valida `taskId` (mesmo serviço) e `authorId` (Auth Service).

**Trade-offs Analisados:**

**Abordagem 1: Validação Cross-Domain (Implementada)**

```typescript
// ✅ Implementado
async createComment(createCommentDto, taskId: string, authorId: string) {
  await this.validationService.validateTaskExists(taskId);   // Same service
  await this.validationService.validateUserExists(authorId); // Cross-service TCP
}
```

**Vantagens:**

- ✅ **UX superior** - erro claro "Task not found" vs array vazio confuso
- ✅ **Data integrity** - garante que authorId existe no sistema
- ✅ **Business rules** - validação no domain layer (onde pertence)

**Desvantagens:**

- ❌ **Latência adicional** - chamada TCP para Auth Service
- ❌ **Dependência cross-service** - Comments depende de Auth estar disponível

**Abordagem 2: Pure Domain (Considerada)**

```typescript
// ❌ Rejeitada
async createComment(createCommentDto, taskId: string, authorId: string) {
  // Apenas criar comment, confiar nos dados
  return this.commentRepository.save(newComment);
}
```

**Rejeitada por que:**

- ❌ **UX inferior** - GET /api/tasks/invalid-uuid/comments retorna `200 []`
- ❌ **Data integrity** - aceita authorId inválidos silenciosamente
- ❌ **Debugging difícil** - erros aparecem apenas quando algo quebra

**Decisão Final:** Validação cross-domain justificada pela qualidade da UX e integridade dos dados.

### 8. **HTTP to TCP Routing Pattern**

**Decisão:** API Gateway converte HTTP requests para TCP messages direcionados aos microservices.

**Implementação:**

```typescript
// API Gateway (HTTP Layer)
@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TasksController {
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.id; // Extract from JWT
    return this.tasksService.createTask(createTaskDto, userId);
  }
}

// API Gateway Service (TCP Client)
@Injectable()
export class TasksService {
  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    return firstValueFrom(
      this.tasksClient.send("create_task", { createTaskDto, userId })
    );
  }
}

// Tasks Microservice (TCP Server)
@Controller()
export class TasksController {
  @MessagePattern("create_task")
  async createTask(
    @Payload() data: { createTaskDto: CreateTaskDto; userId: string }
  ) {
    const { createTaskDto, userId } = data;
    return this.tasksService.createTask(createTaskDto, userId);
  }
}
```

**Vantagens:**

- ✅ **Separation of concerns** - API Gateway: HTTP/Auth, Microservice: Business Logic
- ✅ **Scalabilidade** - Microservices podem ser escalados independentemente
- ✅ **Reutilização** - Múltiplos gateways podem usar o mesmo microservice
- ✅ **Type safety** - Shared DTOs garantem consistência de tipos

**Trade-offs:**

- ❌ **Latência** - Overhead de rede para cada operação
- ❌ **Complexidade** - Duas camadas para manter vs API monolítica

### 9. **Rate Limiting Global**

**Decisão:** Implementar rate limiting (10 req/sec) no API Gateway.

**Vantagens:**

- ✅ Proteção contra ataques DDoS
- ✅ Controle centralizado de tráfego
- ✅ Cumprimento do requisito do desafio

**Trade-offs:**

- ❌ Possível limitação para usuários legítimos em picos

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

**Authentication:**

```bash
POST /api/auth/register    # Registro + auto-login
POST /api/auth/login       # Autenticação
POST /api/auth/refresh     # Token refresh (protegido)
POST /api/auth/logout      # Logout (protegido)
```

**Tasks Management:**

```bash
POST   /api/tasks                    # Criar task (protegido)
GET    /api/tasks?page=1&limit=10    # Listar tasks com paginação (protegido)
GET    /api/tasks/:id                # Buscar task por ID (protegido)
PUT    /api/tasks/:id                # Atualizar task (protegido)
DELETE /api/tasks/:id                # Deletar task (protegido)
POST   /api/tasks/:id/assign         # Atribuir usuário à task (protegido)
GET    /api/tasks/:id/history        # Histórico da task (protegido)
```

**Comments:**

```bash
POST   /api/tasks/:taskId/comments              # Criar comentário (protegido)
GET    /api/tasks/:taskId/comments?page=1&limit=10  # Listar comentários (protegido)
```

**Swagger Documentation:** `http://localhost:3001/api/docs`

### ✅ **Tasks Service (Completo)**

#### Core Implementation

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
  - `TaskNotFoundException` e `ExistingAssignmentException` implementadas
  - Integração com o Turborepo funcionando
- ✅ **CRUD Operations** completas:
  - `createTask` - criação com conversão de data e audit trail
  - `getTasks` - listagem com paginação (page, limit, total, totalPages)
  - `getTaskById` - busca individual com opção de incluir relations
  - `updateTask` - atualização com audit trail e conversão de data
  - `deleteTask` - remoção com audit trail
  - `assignUsersToTask` - atribuição com validação de duplicatas
  - `getTaskHistory` - histórico de alterações ordenado por data
- ✅ **Audit Trail System** implementado:
  - `TaskHistory` entity para rastreamento de mudanças
  - Método privado `createHistoryEntry` para todas as operações
  - Tracking automático em create/update/delete operations
  - Estrutura: action, previousValue, newValue, userId, timestamp
- ✅ **Data Validation & Conversion**:
  - DTOs com class-validator (@IsEnum, @IsDateString, @IsOptional)
  - Conversão automática string → Date para deadline
  - Validação de enums para Priority e Status
- ✅ **Comments Service** implementado:
  - `createComment` - criação com validação cross-service (task + user)
  - `getCommentsByTaskId` - listagem com paginação e validação de task
  - Integração com SharedModule/ValidationService
  - DTOs com validação apropriada
- ✅ **Shared ValidationService** implementado:
  - `validateUserExists` - comunicação TCP com Auth Service
  - `validateTaskExists` - validação local de tasks
  - Centralização de ClientProxy para Auth Service
  - Reutilização entre TasksService e CommentsService
- ✅ **TCP Communication** com Auth Service:
  - `user_exists` message pattern implementado no Auth Service
  - ClientProxy configurado via SharedModule
  - Validação cross-service funcionando
  - Environment-based configuration para host/port
- ✅ **Tasks Controller (TCP)** implementado:
  - `create_task`, `get_tasks`, `get_task_by_id`, `update_task`, `delete_task`
  - `assign_users_to_task`, `get_task_history`
  - Proper @Payload() destructuring para all message patterns
  - Pagination support com defaults (page=1, limit=10)
- ✅ **Comments Controller (TCP)** implementado:
  - `create_comment`, `get_task_comments`
  - Cross-service validation (task exists + user exists)
  - Pagination support para listagem de comentários
- ✅ **API Gateway Integration** completa:
  - HTTP to TCP routing para todos os endpoints
  - Shared DTOs entre API Gateway e Tasks Service
  - JWT Guards protecting all endpoints
  - Complete Swagger documentation
- ✅ **RabbitMQ Event System** implementado:
  - EventsService com padrão fire-and-forget para performance
  - Event publishing: `task.created`, `task.updated`, `comment.created`
  - Payloads baseados em DTOs (não entidades) para arquitetura limpa
  - RabbitMQ ClientProxy configurado no SharedModule
  - Queue `task_events` com configuração durable
  - Management UI disponível em http://localhost:15672
- ✅ **Event DTOs** para type safety:
  - TaskCreatedEventDto, TaskUpdatedEventDto, CommentCreatedEventDto criados
  - Type safety completa entre Events Service e Notifications Controller
  - Validação compile-time dos payloads RabbitMQ
  - Intellisense e refactoring safety para toda a arquitetura de eventos

### ✅ **Notifications Service (Foundation Completa)**

#### Core Implementation

- ✅ **Estrutura básica** criada (NestJS hybrid app: HTTP + WebSocket + RabbitMQ)
- ✅ **Notification Entity** implementada:
  - UUID primary key para consistência com outros serviços
  - Campos: userId, type, title, message, metadata, status, timestamps
  - Enums: NotificationType (task_assigned, task_updated, comment_created)
  - Status tracking: unread/read para controle de leitura
- ✅ **DTOs completos** com validação e Swagger:
  - CreateNotificationDto, NotificationResponseDto, GetNotificationsDto
  - MarkAsReadDto, NotificationsListResponseDto, WebSocketNotificationDto
  - Enums exportados: NotificationType, NotificationStatus, NotificationStatusFilter
  - Validação com class-validator e documentação @ApiProperty
- ✅ **NotificationsService** implementado:
  - `createNotification()` - criação com DTO validation
  - `getUserNotifications()` - listagem com paginação e filtros inteligentes
  - `markNotificationAsRead()` - marcação individual com segurança (userId check)
  - `markAllNotificationsAsRead()` - bulk update para UX melhorada
  - Filtros: "all" (sem filtro), "unread", "read" com type safety
- ✅ **Exception Handling** seguindo padrão compartilhado:
  - NotificationNotFoundException com mensagens internal/external
  - Integração com @task-management/exceptions package
  - HTTP 404 status codes apropriados
- ✅ **Type Safety** completa:
  - Separação clara entre API filters (NotificationStatusFilter) e entity enums
  - Solução elegante para filtro "all" sem type casting inseguro
  - Imports organizados e enums re-exportados para facilidade de uso
- ✅ **NotificationsController** estruturado:
  - @EventPattern handlers para RabbitMQ events (task.created, task.updated, comment.created)
  - @MessagePattern handlers para API calls (get_user_notifications, mark_as_read, etc.)
  - Type safety completa com Event DTOs importados
  - Separação clara entre event processing e API endpoints

#### Implementação Completa

- ✅ **RabbitMQ Event Processing** - Business logic completa em todos @EventPattern handlers
- ✅ **Database Integration** - Notificações sendo criadas e persistidas corretamente
- ✅ **Environment Configuration** - .env configurado com database e RabbitMQ credentials
- ✅ **End-to-End Event Flow** - task.created, task.updated, comment.created funcionando

#### Arquitetura Preparada

- 🏗️ **WebSocket Gateway** (estrutura criada, implementação pendente)
- 🏗️ **Hybrid Application** configurado para HTTP + WebSocket + RabbitMQ

### 🚧 **Próximos Passos**

#### 1. Notifications Service - WebSocket Implementation (Priority: Alta)

- ✅ Event processing completamente implementado e testado
- 🚧 WebSocket Gateway para delivery real-time das notificações
- 🚧 Room-based user targeting para envio direcionado
- 🚧 Frontend WebSocket client integration

#### 2. Frontend Implementation (Priority: Média)

- React + TanStack Router setup
- Páginas: Login, Task List, Task Detail com comentários
- shadcn/ui + Tailwind CSS components
- WebSocket client para notificações
- Context/Zustand para state management

#### 3. Integration & Testing (Priority: Baixa)

- E2E testing com todos os serviços
- Performance testing das APIs
- Deployment com Docker Compose completo

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

- [ ] **Adicionar endpoints de notificacoes no api gateway** adicionar endpoints HTTP para notificações no API Gateway
- [ ] **Health Checks** para todos os serviços
- [ ] **Logging centralizado** com Winston/Pino
- [ ] **Input sanitization** adicional
- [ ] **Error handling** padronizado
- [ ] **Improve DTOs** melhorar validação e mensagens de erro dos DTOs de Tasks e Comments
- [ ] **WebSocket Authentication** adicionar JWT validation na autenticação do websocket
- [ ] **Improve auth return messages validations** adicionar validações mais robustas nas mensagens de retorno de autenticação

#### Médio Prazo

- [ ] **Testes unitários** completos (Jest)
- [ ] **Monitoring** com métricas de performance

#### Longo Prazo

- [ ] **Kubernetes deployment**
- [ ] **CI/CD pipeline** automatizado
