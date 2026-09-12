# Sewage Treatment Plant i18n + CI + Cloudflare Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public multilingual fork with verified CI and static Cloudflare Pages deployment.

**Architecture:** Add a shared `vue-i18n` instance and locale dictionaries, wire locale-aware Ant Design/Day.js behavior, and convert only user-facing copy to translation keys. Preserve Three.js scene/model identifiers verbatim. GitHub Actions verifies Node tests plus Vite build; Cloudflare Pages serves `dist/`.

**Tech Stack:** Vue 3, Vite 5, Three.js, Ant Design Vue, ECharts, vue-i18n, Node test runner, GitHub Actions, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-12-i18n-cloudflare-design.md`

## Global Constraints
- Supported locales: `vi`, `en`, `zh-CN`; default: `vi`.
- Preserve exact Chinese mesh/object lookup keys.
- Keep upstream attribution; do not add a fabricated license.
- Build and deploy static `dist/` only after tests pass.
- Missing `public/sewageModel.glb` must be documented explicitly.

---

### Task 1: i18n core and regression tests
**Files:** `src/i18n/index.js`, `src/i18n/messages.js`, `src/main.js`, `test/i18n.test.mjs`, `test/ui-i18n.test.mjs`, `package.json`.
- [ ] Run existing RED tests and preserve the demonstrated failures.
- [ ] Add `vue-i18n`, locale resolution, persistence, and app registration.
- [ ] Re-run focused Node tests until GREEN.

### Task 2: Localize visible UI without breaking the 3D model
**Files:** `src/App.vue`, `src/view/shouye/index.vue`, `craftAssist.vue`, `historyData.vue`, `src/view/threejs/index.vue`, `label/index.vue`, `progressBar/index.vue`, `speedControlBar/index.vue`, `inspection/index.js`.
- [ ] Convert template labels, menu copy, chart titles/series labels, and inspection presentation data to i18n lookups.
- [ ] Add a compact language selector to the dashboard header.
- [ ] Keep all exact mesh/object keys used by `getObjectByName` and related scene code unchanged.
- [ ] Fix the stray leading `!` before `<template>` in the label component.
- [ ] Run Node regression tests and build.

### Task 3: CI, documentation, and deployment metadata
**Files:** `.github/workflows/ci.yml`, `README.md`, `index.html`, `vite.config.js`.
- [ ] Add CI using Node 20 with `npm ci`, `npm test`, and `npm run build`.
- [ ] Make Vite static-host-safe and set localized HTML metadata.
- [ ] Document local development, supported languages, upstream provenance, Cloudflare deployment, and the missing GLB requirement.
- [ ] Run full local verification.

### Task 4: GitHub integration and Cloudflare Pages
- [ ] Commit and push feature branch.
- [ ] Open PR, verify Actions is green, and merge to `main` without bypassing failed checks.
- [ ] Create/deploy Cloudflare Pages project in account `trinhtanphat6666` from verified `dist/`.
- [ ] Verify the deployed URL responds and report any asset limitation honestly.
