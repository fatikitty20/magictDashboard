# Tickets Ejecutables - Magict Dashboard

Generado desde: ANALISIS_GLOBAL_PROYECTO.md
Fecha: 2026-05-03
Formato: Markdown (compatible con GitHub Issues / Jira import)

---

## FASE 1: ALTO IMPACTO, BAJO RIESGO (1-2 semanas)

### P0-001 | Unificar Rutas - Usar src/config/routes.tsx como Fuente Única
- **Prioridad**: P0 (crítica)
- **Esfuerzo**: L (Large - 1 día)
- **Depende de**: Ninguno
- **Bloqueador para**: Todos los tickets posteriores que modifiquen rutas
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 4.2.A, 8 (Fase 1.1)

#### Descripción
Actualmente hay duplicidad entre `src/config/routes.tsx` (declaración centralizada) y `src/App.tsx` (renderización manual). Esto crea riesgo de regresiones al cambiar permisos o mover features.

#### Aceptación Criterios
- [ ] `App.tsx` renderiza rutas SOLO desde `appRoutes` de `src/config/routes.tsx`
- [ ] No hay rutas hardcodeadas en JSX de `App.tsx`
- [ ] Todas las rutas protegidas usan `RutaProtegida` con roles validados desde config
- [ ] `npm run build` pasa sin errores
- [ ] Verificar que admin accede a `/transactions` vía router, no hardcode
- [ ] Tests de rutas protegidas pasan (si existen; crear si no)

#### Tareas
1. Revisar estructura de `appRoutes` en `src/config/routes.tsx`
2. Refactorizar `App.tsx` para renderizar desde `appRoutes` dinámicamente
3. Validar que `RutaProtegida` interca roles desde config
4. Actualizar `ARCHITECTURE.md` con nuevo flujo de rutas
5. Run build + dev tests

#### Notas
- Esto establece la base para cambios de permisos centralizados.
- Es prerequisito técnico para tickets posteriores que toquen autenticación.

---

### P0-002 | Definir USE_REAL_API via Variables de Entorno
- **Prioridad**: P0 (crítica)
- **Esfuerzo**: S (Small - 2-4 horas)
- **Depende de**: Ninguno
- **Bloqueador para**: P1-004 (Auth contract with backend)
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 5.1.1, 8 (Fase 1.2)

#### Descripción
Actualmente `USE_REAL_API = false` está hardcodeado en `src/features/auth/authService.ts`. Esto debe ser configurable por entorno (.env.local, .env.production, etc.) para permitir modo mock en desarrollo y modo real en staging/prod.

#### Aceptación Criterios
- [ ] Crear `.env.example` con `VITE_USE_REAL_API=false`
- [ ] `src/features/auth/authService.ts` lee `import.meta.env.VITE_USE_REAL_API`
- [ ] Modo mock activo en dev (.env.local)
- [ ] Modo real habilitado en staging/prod vía CI/CD
- [ ] No hay valores hardcodeados en código fuente
- [ ] `npm run build` pasa con ambos modos

#### Tareas
1. Crear `.env` y `.env.example` con configuración
2. Actualizar `authService.ts` para usar `import.meta.env`
3. Documentar en `ARCHITECTURE.md` cómo cambiar modo
4. Validar en dev server que funciona en ambos modos
5. Actualizar `.github/copilot-instructions.md` si aplica

#### Notas
- Vite usa prefijo `VITE_` para exponer variables al navegador.
- `.env.local` debe estar en `.gitignore`.

---

### P0-003 | Implementar Estrategia Central de 401 en apiClient
- **Prioridad**: P0 (crítica)
- **Esfuerzo**: M (Medium - 1-2 días)
- **Depende de**: P0-002 (USE_REAL_API via env)
- **Bloqueador para**: P1-003, P1-004
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 5.1.3, 8 (Fase 1.3)

#### Descripción
Actualmente `src/shared/api/apiClient.ts` solo hace `console.warn` en 401. No hay estrategia centralizada de cierre de sesión, limpieza de caché, invalidación de React Query o redirección controlada. Esto causa inconsistencia de estado y UX insegura.

#### Aceptación Criterios
- [ ] `apiClient` intercepta respuesta 401 centralmente
- [ ] En 401: ejecuta logout (clear Zustand store) + clear React Query cache + redirect a `/login`
- [ ] Evita loops de peticiones al servidor en 401
- [ ] UX feedback claro al usuario (toast/notificación opcional)
- [ ] No afecta a rutas públicas (Login, NotFound)
- [ ] Tests para flujo 401 + redirect
- [ ] `npm run build` pasa

#### Tareas
1. Extender `apiClient.ts` con manejador de 401
2. Integrar limpieza de Zustand store
3. Integrar clear de React Query `queryClient.clear()`
4. Usar React Router `navigate()` para redirect a `/login`
5. Agregar tests en `src/test/apiClient.test.ts` (crear si no existe)
6. Validar en dev que logout automático funciona

#### Notas
- Requiere acceso a `useAuth()` hook y `navigate` de Router; considera composición de funciones o Context.
- Debe ser idempotente (llamar 2x no causa daño).

---

### P0-004 | Estandarizar Manejo de Errores Visibles
- **Prioridad**: P0 (alta)
- **Esfuerzo**: M (Medium - 1 día)
- **Depende de**: Ninguno
- **Bloqueador para**: Ninguno directo, pero mejora UX
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 5.1.6, 8 (Fase 1.4)

#### Descripción
Actualmente hay riesgo de que mensajes de error de backend (stack traces, detalles internos) se filtren al usuario. Se necesita mapear códigos HTTP a mensajes seguros.

#### Aceptación Criterios
- [ ] Crear utilidad `lib/errorMessages.ts` que mapea código HTTP → mensaje seguro
  - 400 → "Datos inválidos. Por favor, verifica tu entrada."
  - 401 → "Sesión expirada. Inicia sesión de nuevo."
  - 403 → "No tienes permiso para acceder a este recurso."
  - 500 → "Error del servidor. Intenta más tarde."
  - default → "Ocurrió un error inesperado."
- [ ] `apiClient.ts` usa `errorMessages` en lugar de `error.message` crudo
- [ ] Todos los componentes que muestran errores usan la utilidad
- [ ] Logs internos (console) mantienen detalles completos (no sanitizados)
- [ ] Tests para mapeo de errores
- [ ] `npm run build` pasa

#### Tareas
1. Crear `lib/errorMessages.ts` con mapeo seguro
2. Actualizar `apiClient.ts` para usar mapeo
3. Revisar componentes (Payments, Orders, Clients, Reports, Transactions) que muestran errores
4. Reemplazar `.catch(err => setError(err.message))` con `.catch(err => setError(getErrorMessage(err)))`
5. Tests unitarios en `src/lib/errorMessages.test.ts`

#### Notas
- Mantén los logs completos internamente para debugging.
- Esto también reduce riesgo de fuga de información.

---

### P0-005 | Completar i18n en Textos Hardcodeados
- **Prioridad**: P0 (media)
- **Esfuerzo**: S (Small - 4-6 horas)
- **Depende de**: Ninguno
- **Bloqueador para**: Ninguno
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 4.2.C, 8 (Fase 1.5)

#### Descripción
Existen textos aún hardcodeados en algunas vistas (ej. Transacciones). Todos los textos deben estar centralizados en `locales/*/common.json` y accesibles vía `useTranslation()`.

#### Aceptación Criterios
- [ ] Scan de todas las vistas en `src/pages/` y `src/features/*/views/` para textos hardcodeados
- [ ] Agregar claves a `locales/es/common.json` y `locales/en/common.json`
- [ ] Reemplazar textos en componentes con `useTranslation()` + claves
- [ ] Verificar que tema (light/dark) y idioma funcionan en todas las vistas
- [ ] No quedan strings en español/inglés hardcodeados fuera de `locales/`
- [ ] `npm run build` pasa
- [ ] Tema + idioma se cambian en runtime sin reload

#### Tareas
1. Buscar textos hardcodeados con grep (ej. `grep -r "class.*Login\|class.*Logout\|"` o revisar manualmente)
2. Listar todas las claves faltantes
3. Agregar a `locales/es/common.json` y `locales/en/common.json`
4. Refactorizar componentes que usan esos textos
5. Verificar en dev con cambio de idioma

#### Notas
- Probablemente ya está mayormente hecho (theme toggle fue reparado en P0-005 anterior), pero hay que verificar exhaustivamente.

---

## FASE 2: SEGURIDAD Y CONTRATO (2-4 semanas)

### P1-001 | Introducir Validación Runtime (Zod) en Respuestas API - Empezar por Payments
- **Prioridad**: P1 (alta)
- **Esfuerzo**: M (Medium - 1-2 días)
- **Depende de**: P0-001, P0-002
- **Bloqueador para**: P1-002 (error handling)
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 5.1.4, 8 (Fase 2.1)

#### Descripción
Actualmente `paymentsApi.ts` acepta payloads flexibles sin validación de schema. Sin validación runtime, hay riesgo de errores silenciosos y manejo inseguro de respuestas inesperadas.

#### Aceptación Criterios
- [ ] Instalar `zod` en `package.json` (ya puede estar)
- [ ] Crear `src/features/payments/types/paymentSchema.ts` con esquema Zod para respuesta API
- [ ] Validar respuesta en `paymentsApi.ts` antes de retornar
- [ ] Si validación falla: lanzar error tipado (no silenciar)
- [ ] Tests para validación exitosa y fallo
- [ ] Ejemplos de respuesta esperada documentados en schema
- [ ] `npm run build` pasa

#### Tareas
1. Instalar Zod: `npm install zod` (si no está)
2. Crear `paymentSchema.ts` basado en respuesta actual
3. Actualizar `paymentsApi.ts` con `.parse()` o `.safeParse()`
4. Manejar errores de validación apropiadamente
5. Tests en `src/features/payments/types/paymentSchema.test.ts`
6. Documentar en ARCHITECTURE.md

#### Notas
- Usa `.safeParse()` para no lanzar exceptions, sino retornar resultado con errores.
- Esto es patrón: repetir para Orders, Clients, Reports, Transactions en P2-001.

---

### P1-002 | Definir Contrato de Auth con Backend + RBAC Server-Side
- **Prioridad**: P1 (muy alta - bloqueador de seguridad)
- **Esfuerzo**: L (Large - 2-3 días)
- **Depende de**: P0-002 (USE_REAL_API), P0-003 (401 handling), P1-001 (Zod)
- **Bloqueador para**: Paso a producción, integración real
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 5.1.1, 6, 8 (Fase 2.2)

#### Descripción
Actualmente RBAC y auth son efectivos solo en cliente con mock (role derivado de email). Para seguridad real, auth y RBAC deben validarse en backend. Este ticket es coordinación + contrato.

#### Aceptación Criterios
- [ ] Documentar endpoints de backend esperados:
  - `POST /auth/login` - retorna token/sesión
  - `GET /auth/me` - retorna usuario + roles/permisos
  - `POST /auth/logout` - invalida sesión
  - `POST /auth/refresh` - refresca token (si aplica)
- [ ] Definir schema de respuesta `/auth/me` (usuario, roles, permisos, expiracion)
- [ ] Frontend `authService.ts` adapta respuesta real a `AuthUser` store
- [ ] Backend valida permisos en CADA endpoint sensible (no confiar en frontend)
- [ ] Documento `BACKEND_API_CONTRACT.md` creado y revisado
- [ ] Tests de integración para flujo de autenticación (mock + real)

#### Tareas
1. Crear `BACKEND_API_CONTRACT.md` en raíz (especifica endpoints, schemas, códigos de error)
2. Actualizar `src/features/auth/authService.ts` para adaptar respuesta real
3. Revisar `src/features/auth/store/authStore.ts` - qué se guarda, qué se descarta
4. Agregar validación Zod para respuesta `/auth/me`
5. Sincronizar con equipo de backend sobre contrato
6. Tests de flujo de login + redirect

#### Notas
- Este es el TICKET MÁS IMPORTANTE de seguridad; coordina con backend.
- Sin esto, seguridad del frontend sigue siendo ilusión.

---

### P1-003 | Minimizar Datos de Sesión en Local Storage
- **Prioridad**: P1 (muy alta - seguridad)
- **Esfuerzo**: M (Medium - 1 día)
- **Depende de**: P1-002 (Backend auth contract)
- **Bloqueador para**: P2-001 (scaling auth)
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 5.1.2, 8 (Fase 2.3)

#### Descripción
Actualmente sesión se persiste en local storage (Zustand `persist` middleware), que es accesible/modificable por scripts XSS. Solución ideal: sesión en httpOnly cookie + backend validation.

#### Aceptación Criterios
- [ ] Coordinar con backend: sesión en httpOnly + Secure + SameSite cookie
- [ ] Frontend guarda SOLO:
  - `user.id` (no sensible)
  - `user.nombre` / `user.email` (no sensible)
  - `roles` (lista de strings, sin claims)
  - Opcionalmente: `theme`, `language` (preferencias, no sensibles)
- [ ] Token/sesión REAL vive en cookie httpOnly (backend administra)
- [ ] Frontend NO almacena tokens/secrets en localStorage
- [ ] Validar en dev que apiClient envía cookies automáticamente (`credentials: include` ya existe)
- [ ] Tests que sesión es accesible pero no modificable desde console

#### Tareas
1. Revisar `src/features/auth/store/authStore.ts` - qué se persiste hoy
2. Reducir persistencia a solo datos públicos (user.id, user.name, roles)
3. Remover tokens/secrets de persist
4. Actualizar `authService.ts` para no guardar tokens en store
5. Tests de que cookie se envía en requests y sesión es validada server-side
6. Documentar en ADR

#### Notas
- Backend debe rechazar requests sin cookie válida, incluso si frontend usa datos guardados.
- Esto reduce superficie de XSS.

---

### P1-004 | Instrumentar Auditoría en CI - npm audit + ESLint + TypeCheck
- **Prioridad**: P1 (media)
- **Esfuerzo**: M (Medium - 1 día)
- **Depende de**: Ninguno
- **Bloqueador para**: Ninguno, pero recomendado antes de produción
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 5.2, 8 (Fase 2.4), § 11.3, 11.4

#### Descripción
Actualmente no hay escaneo de seguridad en CI/CD. Se necesita: npm audit para dependencias, ESLint para patrones inseguros, TypeCheck para errores estáticos.

#### Aceptación Criterios
- [ ] `.github/workflows/audit.yml` (o similar) ejecuta en cada PR:
  - `npm audit --json` (falla si hay vulnerabilidades serias)
  - `npm run lint` (ESLint)
  - `npm run typecheck` (tsc --noEmit)
  - `npm run test` (tests existentes)
- [ ] Lint rules incluyen reglas de seguridad (no `eval`, no `dangerouslySetInnerHTML`, etc.)
- [ ] Falla el check si hay issues de seguridad críticos
- [ ] Documentado en `CONTRIBUTING.md` o README

#### Tareas
1. Crear `.github/workflows/audit.yml` (o `.github/workflows/ci.yml`)
2. Agregar steps: npm install, npm audit, npm run lint, npm run typecheck, npm run test
3. Configurar ESLint para incluir reglas de seguridad (plugin react, typescript, etc.)
4. Validar localmente: `npm run lint`, `npm run typecheck`
5. Documentar en README o CONTRIBUTING.md

#### Notas
- `npm run build` también debería fallar si hay errores TypeScript.
- Considera agregar SAST (CodeQL, SonarQube) después.

---

## FASE 3: ESCALA Y CONSISTENCIA (4-8 semanas)

### P2-001 | Migrar Orders/Clients/Reports/Transactions al Patrón de Payments
- **Prioridad**: P2 (media - escala)
- **Esfuerzo**: L (Large - 3-5 días)
- **Depende de**: P0-001, P1-001, P1-002
- **Bloqueador para**: Ninguno, pero mejora mantenibilidad
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 4.2.B, 7, 8 (Fase 3.1)

#### Descripción
Actualmente Order/Clients/Reports/Transactions dependen de mocks y servicios simples. Payments ya sigue Clean Architecture (api + domain + mapper + hook + view). Se debe aplicar este patrón a todos.

#### Aceptación Criterios
- [ ] Cada módulo (Orders, Clients, Reports, Transactions) tiene:
  - `api/` - funciones de red (URL building, apiClient wrapping)
  - `domain/` - lógica de negocio (filtros, paginación, estadísticas)
  - `mappers/` - DTO → entidad UI
  - `hooks/` - React Query (useFetch, etc.)
  - `types/` - TypeScript interfaces
  - `views/` - componentes de página
- [ ] Cada módulo valida respuesta con Zod
- [ ] Tests para domain logic de cada módulo
- [ ] `npm run build` pasa

#### Tareas (por módulo - repetir 4 veces)
1. Revisar mock en `services/` actuales
2. Crear `api/` con funciones de red
3. Crear `domain/` con lógica de negocio
4. Crear `mappers/` con adaptadores DTO
5. Crear `hooks/` con React Query
6. Actualizar `views/` para usar hooks
7. Tests de domain logic
8. Validar visualmente en dev

#### Notas
- Esto es el ticket MÁS LARGO pero el de mayor impacto en mantenibilidad.
- Puede hacerse módulo por módulo en PRs separados.

---

### P2-002 | Adoptar Typed Query Keys y Estrategia de Invalidaciones
- **Prioridad**: P2 (media - optimización)
- **Esfuerzo**: M (Medium - 1-2 días)
- **Depende de**: P2-001, P1-001
- **Bloqueador para**: Ninguno
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 8 (Fase 3.2)

#### Descripción
Actualmente React Query cache keys son strings manuales. Deberían ser tipadas y centralizadas para evitar invalidaciones erróneas o cache stale.

#### Aceptación Criterios
- [ ] Crear `src/lib/queryKeys.ts` con factory tipadas:
  - `queryKeys.payments.list(filters)` → ['payments', 'list', filters]
  - `queryKeys.orders.list(filters)` → ['orders', 'list', filters]
  - `queryKeys.clients.list(filters)` → ['clients', 'list', filters]
  - etc.
- [ ] Todos los hooks (`usePayments`, `useOrders`, etc.) usan factory
- [ ] Invalidaciones centralizadas (ej. al crear → invalidar `queryKeys.payments.list()`)
- [ ] Tests para cache invalidation

#### Tareas
1. Crear `lib/queryKeys.ts` con todas las factory
2. Actualizar todos los hooks (`usePayments`, `useOrders`, etc.)
3. Revisar mutaciones (create, update, delete) y agregar invalidaciones
4. Tests para que cache se invalida correctamente

#### Notas
- Esto evita bugs sutiles de cache stale.
- Pattern basado en React Query v5 best practices.

---

### P2-003 | Agregar Pruebas de Integración para Auth + Features Protegidas
- **Prioridad**: P2 (media - calidad)
- **Esfuerzo**: M (Medium - 1-2 días)
- **Depende de**: P1-002, P2-001
- **Bloqueador para**: Ninguno
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 8 (Fase 3.3)

#### Descripción
Actualmente hay tests unitarios pero no integración (auth + feature + routing). Se necesitan tests E2E o integración para flujos críticos.

#### Aceptación Criterios
- [ ] Tests de integración (Vitest + Testing Library) para:
  - Login exitoso → redirect a `/dashboard`
  - Login fallido → error message + stay en `/login`
  - 401 durante browsing → logout automático + redirect a `/login`
  - Acceso a ruta protegida sin auth → redirect a `/login`
  - Acceso a ruta `admin-only` sin rol → error de permiso
- [ ] Tests para cada módulo migrante (Orders, Clients, Payments, etc.)
- [ ] `npm run test` pasa con cobertura > 70%

#### Tareas
1. Crear `src/test/integration/auth.test.ts`
2. Crear tests de login, 401, unauthorized access
3. Crear `src/test/integration/features.test.ts` (Payments, Orders, etc.)
4. Ejecutar localmente: `npm run test`
5. Agregar coverage tracking

#### Notas
- Testing Library simula user interactions (clicks, inputs).
- Vitest es rápido para integración.

---

### P2-004 | Agregar Documentación ADR (Architecture Decision Records)
- **Prioridad**: P2 (baja - documentación)
- **Esfuerzo**: S (Small - 4-6 horas por ADR)
- **Depende de**: Todos los anteriores (resumen)
- **Bloqueador para**: Ninguno
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 8 (Fase 3.4)

#### Descripción
ADR documenta decisiones técnicas importantes (por qué Zustand, por qué Payments es guía, por qué httpOnly cookies, etc.). Facilita onboarding y evita regresiones.

#### Aceptación Criterios
- [ ] Crear `docs/adr/` con ADRs clave:
  - `ADR-001-State-Management.md` - Por qué Zustand + React Query
  - `ADR-002-Clean-Architecture-Pattern.md` - Patrón de Payments
  - `ADR-003-Auth-Strategy.md` - Auth server-side, RBAC, httpOnly cookies
  - `ADR-004-Error-Handling.md` - Mapeo de errores, manejo centralizado
- [ ] Cada ADR incluye: Contexto, Decisión, Consecuencias, Alternativas consideradas

#### Tareas
1. Crear `docs/adr/` directory
2. Escribir ADRs basados en análisis (4-5 ADRs principales)
3. Linkar desde `ARCHITECTURE.md` y `README.md`
4. Revisar con equipo

#### Notas
- ADRs son valiosos para futuros developers.
- Usar formato simple: título, contexto, decisión, consecuencias.

---

## TICKETS MENORES / NICE-TO-HAVE

### P2-005 | Configurar CORS Estricto en Backend
- **Prioridad**: P2 (media - seguridad)
- **Esfuerzo**: S (Small - 2-4 horas)
- **Depende de**: Backend changes
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 11.2 (A05)

#### Descripción
Coordinar con backend: CORS debe ser restrictivo (solo origen esperado, sin `*`).

#### Tareas
- Backend configura `Access-Control-Allow-Origin: https://magict.example.com` (no `*`)
- Backend valida `Origin` header
- Frontend vite proxy incluye headers correctos

---

### P2-006 | Agregar Rate Limiting en Endpoints Sensibles
- **Prioridad**: P2 (baja)
- **Esfuerzo**: S (Small - 2-4 horas)
- **Depende de**: Backend changes
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 11.1

#### Descripción
Coordinar con backend: rate limiting en `/auth/login`, `/auth/refresh`, webhooks, etc.

#### Tareas
- Backend implementa rate limiting (ej. 5 intentos fallidos por IP)
- Backend retorna 429 (Too Many Requests)
- Frontend maneja 429 con UX apropiado (espera X segundos)

---

### P2-007 | Agregar SAST (CodeQL / SonarQube)
- **Prioridad**: P2 (baja - después de audit CI)
- **Esfuerzo**: M (Medium - 1 día setup)
- **Depende de**: P1-004 (CI audit base)
- **Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 11.3

#### Descripción
Escaneo estático de seguridad para patrones comunes inseguros.

#### Tareas
- Integrar CodeQL o SonarQube en `.github/workflows/`
- Configurar reglas básicas
- Revisar findings y cerrar falsos positivos

---

## RESUMEN Y CADENCIA RECOMENDADA

### Roadmap por Semana

**Semana 1 (P0 - Fundacional)**
- P0-001: Unificar rutas (1 día)
- P0-002: USE_REAL_API via env (4-6 horas)
- P0-003: Estrategia 401 central (1-2 días)

**Semana 2 (P0 - Continuación)**
- P0-004: Manejo de errores (1 día)
- P0-005: Completar i18n (4-6 horas)

**Semana 3-4 (P1 - Seguridad y Contrato)**
- P1-001: Zod validation (1-2 días)
- P1-002: Backend auth contract (2-3 días, con coordinación)
- P1-003: Minimizar session en storage (1 día)

**Semana 5 (P1 - Auditoría)**
- P1-004: Instrumentar CI/audit (1 día)

**Semana 6-8 (P2 - Escala)**
- P2-001: Migrar módulos a patrón Payments (3-5 días, iterativo)
- P2-002: Typed query keys (1-2 días)
- P2-003: Tests de integración (1-2 días)
- P2-004: ADRs (4-6 horas)

### Cadencia de Ejecución

- **En cada PR**: lint + typecheck + npm audit + tests + build
- **Semanal**: escaneo de seguridad automatizado + revisión de findings
- **Mensual**: revisión OWASP Top 10 + planificación de mejoras
- **Trimestral**: auditoría de dependencias y actualización de versiones

---

## FORMATO PARA IMPORTAR A GITHUB ISSUES

Si prefieres copiar/pegar en GitHub Issues, usa este formato para cada ticket:

```markdown
### [P0-001] Unificar Rutas - Usar src/config/routes.tsx como Fuente Única

**Prioridad**: P0  
**Esfuerzo**: L (Large)  
**Referencia**: ANALISIS_GLOBAL_PROYECTO.md § 4.2.A, 8 (Fase 1.1)

#### Descripción
[Copiar descripción del ticket anterior]

#### Aceptación Criterios
- [ ] [Criterio 1]
- [ ] [Criterio 2]
- ... etc

#### Tareas
1. [Tarea 1]
2. [Tarea 2]
...

#### Notas
[Notas relevantes]
```

Copiar/pegar en cada issue, cambiar título y contenido. Etiquetar con labels: `priority-p0`, `effort-L`, `security` (si aplica), `phase-1`, etc.

---

## FORMATO PARA JIRA (JSON)

Si usas Jira, genera issues con este JSON (adaptar a tu configuración):

```json
{
  "fields": {
    "project": { "key": "MD" },
    "summary": "[P0-001] Unificar Rutas - Usar src/config/routes.tsx",
    "description": "Actualmente hay duplicidad...",
    "issuetype": { "name": "Task" },
    "priority": { "name": "Highest" },
    "customfield_effort": "Large",
    "labels": ["phase-1", "architecture"],
    "components": [{ "name": "Frontend" }]
  }
}
```

Importar bulk vía Jira REST API.

---

## TRACKING Y VALIDACIÓN

- Usar este documento como source of truth
- Actualizar estado de tickets a medida que se completan
- Linkar PRs a tickets correspondientes (GitHub Issues: `fixes #123`)
- Ejecutar `npm run build` después de cada ticket para validar
- Revisar ANALISIS_GLOBAL_PROYECTO.md cuando haya dudas sobre contexto

---

Generado: 2026-05-03  
Documento: TICKETS_ACCIONABLES.md  
Fuente: ANALISIS_GLOBAL_PROYECTO.md