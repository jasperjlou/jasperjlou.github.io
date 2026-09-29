---
title: AI Sync and Scheduled Tasks
englishTitle: Portable AI Development State
category: ai-tools
repositoryVisibility: private
visual: pipeline
order: 4
status: Private infrastructure · Cloud-first · Active
statusDetail: The repository separates client-owned state, client-neutral shared contracts, private recovery material, and narrow GitHub Actions jobs. Restore is preview-first and the repository remains private because it contains personal working state.
description: A private cross-device system for versioning selected AI rules, skills, curated memory, plugin manifests, localization terminology, and scheduled workflows without relying on a resident watcher.
summary: I wanted a new machine to inherit more than source code. AI development also depends on rules, skills, curated memory, terminology, and connector manifests. This project makes the portable subset explicit, versioned, auditable, and conflict-aware.
githubUrl: https://github.com/jasperjlou/ai-sync-and-scheduled-tasks
launched: "2026 · ongoing"
lastVerified: 2026-09-29
metrics:
  - value: "22"
    label: plugin identifiers
    note: Current checked-in shared/cloud-index.json inventory.
  - value: "47"
    label: catalogued shared skills
    note: Current checked-in shared/cloud-index.json inventory.
  - value: "615"
    label: localization terms
    note: Current checked-in shared/cloud-index.json inventory across six games.
  - value: "0"
    label: shared-skill divergences
    note: Current checked-in shared/cloud-index.json inventory.
pipeline:
  - title: Select portable state
    detail: Rules · skills · curated memory · manifests · terminology
  - title: Export and audit
    detail: Allowlists · path normalization · hashes · secret boundaries
  - title: Private GitHub state
    detail: Codex namespace · Antigravity namespace · shared client-neutral contracts
  - title: Narrow cloud automation
    detail: Read-only audit · deterministic shared index · independent keepalive
  - title: Preview and restore
    detail: Diff first · surface conflicts · reviewed apply on another device
features:
  - index: "01"
    title: Explicit state ownership
    description: Codex, Antigravity, client-neutral shared contracts, and private IDE recovery material live in separate namespaces instead of being treated as one interchangeable backup.
  - index: "02"
    title: Deterministic cloud inventory
    description: The shared cloud index records file counts, hashes, skill/plugin inventory, localization state, memory counts, and workflow schedules from approved checked-in content.
  - index: "03"
    title: Conflict-aware restore
    description: Restore defaults to a preview. Files that already match need no action, while conflicting local content is surfaced rather than silently overwritten.
  - index: "04"
    title: Narrow scheduled jobs
    description: Audit, shared-index organization, and Hugging Face keepalive remain separate workflows because they have different permissions, state scopes, and failure modes.
  - index: "05"
    title: Cross-device portability without a resident watcher
    description: Cloud automation validates checked-in state, while device-local export/restore happens when a device is available. An offline machine is not treated as synchronized.
engineering:
  - title: Portable is an allowlist, not a full user profile backup
    detail: The Codex portable contract excludes authenticated sessions, browser profiles, OAuth state, API keys, cookies, runtime databases, model caches, and generated logs. Client-specific recovery data is kept separate from shared portability guarantees.
  - title: Shared content has a higher bar
    detail: A file enters shared only when it is client-neutral and reusable across current or future clients. Adapters and restore paths stay under their owner namespace.
  - title: Hashes reduce false cross-platform differences
    detail: The synchronization tooling normalizes relevant text representation and compares content hashes so line-ending or path differences are less likely to appear as meaningful changes.
  - title: Cloud jobs cannot read powered-off devices
    detail: GitHub Actions can audit or organize what was committed, but fresh local state still needs an export from an active trusted device.
principles:
  - The repository stays private because it contains personal working and recovery state.
  - Credentials and connector authentication remain device-local.
  - Restore does not silently overwrite a conflict.
  - Client-neutral shared material is kept separate from client-owned or archival state.
stack:
  - Python
  - Git
  - SHA-256
  - GitHub Actions
  - Windows Task Scheduler
  - JSON / Markdown contracts
evidence: []
---

AI Sync exists because changing computers can break an AI development environment even when all project repositories are intact. The missing pieces are often the rules, skills, curated memory, terminology, plugin identities, and small workflow conventions that make the tools behave consistently.

The current design treats portability as an explicit contract rather than a full-machine backup. GitHub is the canonical versioned copy of approved state; cloud jobs audit and organize that state; device-side tools export or restore it with a preview and conflict checks. Private recovery material can coexist in the repository without being mistaken for client-neutral shared state.
