# Spec: <short title>

| | |
|---|---|
| **Ticket** | XXX-0000 |
| **Project / service** | <repo or service name> |
| **Stack** | <e.g. Java/Spring, React, Node/Express, NestJS — fill from the repo> |
| **Status** | Draft \| Approved \| Implemented |
| **Author** | <name> |
| **Date** | YYYY-MM-DD |

## 1. Problem / Goal
<What user/business problem are we solving, and why now? 2–4 sentences. No solution here.>

## 2. Scope
**In scope**
- <bullet>

**Non-goals** (explicitly NOT doing)
- <bullet>

## 3. Current behavior
<How does the relevant part work today? Reference real code: `path/to/File.ext:42`. If new, say "new".>

## 4. Proposed change
> Fill only the subsections that apply to this change and this stack. Delete the rest.

### 4.1 API / interface contract
<The contract this change exposes or consumes. Pick what fits:>
- **HTTP API** (Java controller, Express route, NestJS controller): method + path, request shape,
  response shape, status codes, error cases.
- **UI component / module** (React): component name, props in/out, state, events/callbacks,
  the data it fetches and from where.
- **Library/function**: signature, inputs, outputs, errors thrown.

| Method/Type | Path / name | Request / props | Response / return | Notes |
|-------------|-------------|-----------------|-------------------|-------|
| | | | | |

### 4.2 Data / state model
<Pick the row(s) that apply:>
- **Relational (MySQL/PostgreSQL):** new/changed tables, columns, types, indexes, constraints,
  and the **migration** (never hand-edited schema). Note transactions where multiple writes
  must be atomic. Mind dialect specifics (Postgres `SERIAL`/`RETURNING` vs MySQL `AUTO_INCREMENT`).
- **Document (MongoDB):** new/changed collections, document shape, schema/validation, indexes,
  and any migration/backfill of existing documents.
- **Client state (React):** new/changed state shape, where it lives (component, store, cache),
  and how it's derived/invalidated.

### 4.3 Events / side-effects
<Async messages, queues/topics, jobs, webhooks, cache invalidation, emails — payload shape,
idempotency, and failure handling. Omit if none.>

### 4.4 External / cross-service / integration calls
<Outbound calls to other services or third parties (HTTP client, Feign, SDK). For each: what's
called, the contract assumed, and failure/timeout behavior. Omit if none.>

### 4.5 Config / feature flags / env
<New config keys, environment variables (`.env`), feature flags to gate rollout, profiles affected.>

## 5. Acceptance criteria
<Testable Given/When/Then statements. These become the tests AND the review checklist.>

- [ ] **AC1** — Given <state>, when <action>, then <observable outcome>.
- [ ] **AC2** — ...

## 6. Test plan
<Map each AC to at least one test using THIS project's framework: Java `*Test.java`/`*IT.java`;
React Jest/Vitest + Testing Library; Node Jest/Vitest + Supertest, `@nestjs/testing`; e2e
Playwright/Cypress.>

| AC | Test type | Test file / class / method |
|----|-----------|----------------------------|
| AC1 | unit | |

## 7. Rollout & risks
<Deploy order if cross-service, backward compatibility, data migration risk, rollback plan,
and mitigations.>

## 8. Open questions / follow-ups
- <bullet>
