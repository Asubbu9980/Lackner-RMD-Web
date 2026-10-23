# The SDD agent team

Spec-driven development as a team of subagents. Three roles, mapped to the loop:

| Agent | Phase | Tools | Job |
|-------|-------|-------|-----|
| `sdd-spec-author` | SPECIFY | read + Write | Ticket → reviewable spec under `specs/`. No code. |
| `sdd-developer` | IMPLEMENT | read + Edit/Write + Bash | Builds ONE approved spec, test-first. |
| `sdd-reviewer` | VERIFY | read-only + Bash | Adversarially checks the impl against the spec's acceptance criteria. |

Definitions live in `.claude/agents/`. Invoke one by asking for it ("use the sdd-developer
agent to build specs/0001-…"), or let Claude pick by description.

## "Three developers working" = parallel implement, isolated

The team had three developers building features concurrently. To mirror that, run **three
`sdd-developer` agents in parallel — one spec each — and give each its own git worktree**
so their edits never collide:

```
   ┌─ sdd-spec-author  →  specs/0001-a.md ─┐
   ├─ sdd-spec-author  →  specs/0002-b.md ─┤   (human reviews/approves the specs)
   └─ sdd-spec-author  →  specs/0003-c.md ─┘
                  │  approved
                  ▼
   ┌─ sdd-developer  (worktree A)  builds 0001 ─┐
   ├─ sdd-developer  (worktree B)  builds 0002 ─┤   run concurrently
   └─ sdd-developer  (worktree C)  builds 0003 ─┘
                  │  each returns diff + test results
                  ▼
   ┌─ sdd-reviewer  verifies 0001 ─┐
   ├─ sdd-reviewer  verifies 0002 ─┤   verify per spec
   └─ sdd-reviewer  verifies 0003 ─┘
                  │
                  ▼   human merges the approved branches
```

### Why worktree isolation matters
Three agents editing the same checkout would clobber each other. Each `sdd-developer` runs
in its own git worktree (a separate working copy on its own branch), so the three streams
are independent and merge cleanly — exactly like three developers on three branches.

**Important:** parallelize across *independent* specs. If two specs touch the same files
(e.g. both edit `CouponService`), sequence them instead — paper conflicts are cheaper than
merge conflicts.

## How to kick it off
- One ticket: `/spec DLA-1234 …` → review → `/spec-build specs/NNNN-….md`.
- A batch (the 3-developer pattern): ask Claude to "spec these 3 tickets, then build them in
  parallel with isolated worktrees, then review each against its spec." Claude orchestrates
  the fan-out. For larger batches this is worth running as a structured multi-agent workflow.
