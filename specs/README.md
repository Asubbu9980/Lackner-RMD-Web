# Spec-Driven Development (SDD)

Every non-trivial change starts with a **spec** — a reviewable document that defines
*what* and *why* before any *how* is written. The spec is the contract Claude implements
against, and the artifact a human reviews **before** code exists.

> One-line / trivial fixes don't need a spec. Anything touching an API, a data model,
> an event, cross-service behavior, or more than ~one file does.

## The loop

```
  1. SPECIFY   →   2. PLAN   →   3. IMPLEMENT   →   4. VERIFY
   (write spec)   (approve)     (code + tests)    (review + CI)
```

1. **Specify** — `/spec <ticket-or-description>`
   Claude explores the relevant code and fills in `specs/TEMPLATE.md`, saving it as
   `specs/NNNN-slug.md`. **No implementation code is written in this step.** You review
   and edit the spec until it's right. The spec is the source of truth.

2. **Plan** — Claude proposes an implementation plan from the approved spec (plan mode).
   You approve before edits begin.

3. **Implement** — `/spec-build specs/NNNN-slug.md`
   Claude implements **strictly against the spec's acceptance criteria**, writing a test
   for each criterion using this project's framework (Java `*Test.java`/`*IT.java`; React/Node
   Jest/Vitest + Testing Library / Supertest / `@nestjs/testing`; e2e Playwright/Cypress), and
   runs them. Anything not in the spec is out of scope — if a gap surfaces, update the spec
   first, then continue.

4. **Verify** — `/code-review` (and `/security-review` where relevant), then the normal
   CI pipeline. The spec's acceptance criteria are the review checklist.

## Conventions

- Specs are numbered sequentially: `specs/0001-add-coupon-expiry.md`, `specs/0002-...md`.
- Keep the spec in the **same PR/branch** as the implementation — it documents intent and
  lives next to the code it describes.
- A spec is "done" when every acceptance criterion has a passing test.
- Update the spec if reality diverges; a stale spec is worse than none.

## Why this works across many repos and stacks

The same template + the same `/spec` and `/spec-build` commands work in every repo, whatever
the stack (Java, React, Node/Express, NestJS) and database (MySQL, PostgreSQL, MongoDB). The
spec captures the contract — API/interface, data model, events, and any cross-service calls —
explicitly, so changes that ripple between modules or services are designed on paper before
they're coded.
