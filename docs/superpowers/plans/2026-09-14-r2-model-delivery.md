# R2 Model Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the exact canonical sewage GLB from Cloudflare R2 first, with automatic GitHub Pages fallback, only when R2 proves materially faster from VPS 182.

**Architecture:** Keep the existing Pages copy unchanged. Add a pure model-source/fallback helper, inject the R2 URL through `VITE_SEWAGE_MODEL_URL`, and provision an immutable hash-versioned R2 object behind `sewage-assets.qs3d.site`. Production activation is a GitHub repository variable, so rollback requires no code or model rollback.

**Tech Stack:** Vue 3, Vite 5, Three.js 0.162, Node `node:test`, GitHub Actions/Pages, Cloudflare R2, Wrangler 4.x.

**Spec:** `docs/superpowers/specs/2026-09-14-r2-model-delivery-design.md`

## Global Constraints

- Canonical GLB size must remain exactly `117426548` bytes.
- Canonical SHA-256 must remain exactly `65A9E7430836816699A5FB0F29DEB8104147697E350E355104BD3389BCA0A0D6`.
- R2 bucket is `sewage-treatment-assets`.
- R2 key is `models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb`.
- Custom domain is `sewage-assets.qs3d.site`.
- GitHub Pages local model remains the fallback and must not be removed.
- No geometry, texture, camera, material, normalization, UI, or dashboard changes.
- Never print or persist a Cloudflare OAuth/API token.

---
### Task 1: Add model-source selection and fallback with TDD

**Files:**
- Create: `src/view/threejs/modelSource.js`
- Create: `test/model-source.test.mjs`
- Modify: `src/view/threejs/addSewageModel/index.js`

**Interfaces:**
- Produces: `getModelSources(cdnUrl: unknown): string[]`.
- Produces: `loadModelFromSources(loader, sources, onProgress): Promise<GLTF>`.
- Consumes: `import.meta.env.VITE_SEWAGE_MODEL_URL` in `addSewageModel`.

- [ ] **Step 1: Write the failing source-list tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { getModelSources } from '../src/view/threejs/modelSource.js';

test('cdn is primary and Pages is fallback', () => {
  assert.deepEqual(getModelSources('https://sewage-assets.qs3d.site/models/model.glb'), [
    'https://sewage-assets.qs3d.site/models/model.glb', './sewageModel.glb'
  ]);
});

test('empty cdn uses only Pages', () => {
  assert.deepEqual(getModelSources('  '), ['./sewageModel.glb']);
});
```
- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test test/model-source.test.mjs`

Expected: FAIL because `src/view/threejs/modelSource.js` does not exist.

- [ ] **Step 3: Implement the pure source helper**

```js
export const LOCAL_SEWAGE_MODEL_URL = './sewageModel.glb';

export function getModelSources(cdnUrl) {
  const primary = typeof cdnUrl === 'string' ? cdnUrl.trim() : '';
  if (!primary || primary === LOCAL_SEWAGE_MODEL_URL) return [LOCAL_SEWAGE_MODEL_URL];
  return [primary, LOCAL_SEWAGE_MODEL_URL];
}

export function loadModelFromSources(loader, sources, onProgress) {
  return new Promise((resolve, reject) => {
    let index = 0;
    const attempt = () => loader.load(sources[index], resolve, onProgress, (error) => {
      index += 1;
      if (index < sources.length) attempt(); else reject(error);
    });
    attempt();
  });
}
```
- [ ] **Step 4: Add fallback-order tests**

```js
test('loadModelFromSources retries the Pages fallback', async () => {
  const calls = [];
  const fakeLoader = {
    load(url, onLoad, _onProgress, onError) {
      calls.push(url);
      if (url.startsWith('https://')) onError(new Error('cdn down'));
      else onLoad({ scene: { name: 'ok' } });
    }
  };
  const gltf = await loadModelFromSources(fakeLoader,
    ['https://cdn/model.glb', './sewageModel.glb']);
  assert.equal(gltf.scene.name, 'ok');
  assert.deepEqual(calls, ['https://cdn/model.glb', './sewageModel.glb']);
});
```

- [ ] **Step 5: Wire `addSewageModel` to the helper**

Import `getModelSources` and `loadModelFromSources`, compute sources from `import.meta.env.VITE_SEWAGE_MODEL_URL`, and replace the direct `gltfLoader.load('./sewageModel.glb', ...)` call with the retry helper. Keep the existing progress callback body and all GLTF success handling unchanged.

- [ ] **Step 6: Run focused and full tests**

Run: `node --test test/model-source.test.mjs`
Expected: PASS.

Run: `npm test`
Expected: all existing tests plus the new model-source tests PASS.

- [ ] **Step 7: Commit Task 1**

```bash
git add src/view/threejs/modelSource.js src/view/threejs/addSewageModel/index.js test/model-source.test.mjs
git commit -m "feat: add resilient model source fallback"
```
### Task 2: Inject the CDN URL through GitHub Actions

**Files:**
- Create: `test/model-delivery-workflow.test.mjs`
- Modify: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: GitHub repository variable `SEWAGE_MODEL_CDN_URL`.
- Produces: build-time environment variable `VITE_SEWAGE_MODEL_URL` for Vite.

- [ ] **Step 1: Write a failing workflow regression test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/pages.yml', 'utf8');

test('Pages build maps the repository CDN variable into Vite', () => {
  assert.match(workflow, /VITE_SEWAGE_MODEL_URL:\s*\$\{\{\s*vars\.SEWAGE_MODEL_CDN_URL\s*\}\}/);
});
```

- [ ] **Step 2: Run the workflow test and verify RED**

Run: `node --test test/model-delivery-workflow.test.mjs`
Expected: FAIL because the environment mapping is absent.

- [ ] **Step 3: Add the build environment mapping**

```yaml
      - name: Build
        env:
          VITE_SEWAGE_MODEL_URL: ${{ vars.SEWAGE_MODEL_CDN_URL }}
        run: npm run build
```
- [ ] **Step 4: Run workflow test and full suite**

Run: `node --test test/model-delivery-workflow.test.mjs`
Expected: PASS.

Run: `npm test`
Expected: all tests PASS.

Run: `npm run build`
Expected: exit 0 with `SEWAGE_MODEL_CDN_URL` unset, proving the local fallback remains a valid build.

- [ ] **Step 5: Commit Task 2**

```bash
git add .github/workflows/pages.yml test/model-delivery-workflow.test.mjs
git commit -m "ci: inject optional model CDN url"
```

### Task 3: Provision and verify the R2 object

**Files:**
- Temporary only: `C:\Temp\r2-sewage\sewageModel.glb`
- Temporary only: `C:\Temp\r2-sewage\roundtrip.glb`
- Temporary only: `C:\Temp\r2-sewage\cors.json`

**Interfaces:**
- Produces: `https://sewage-assets.qs3d.site/models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb`.
- No repository secret or Cloudflare token is written to disk.

- [ ] **Step 1: Re-fetch and verify the canonical GitHub Release asset**

```powershell
$dir='C:\Temp\r2-sewage'; New-Item -ItemType Directory -Force $dir | Out-Null
gh release download model-assets --repo trinhtanphat/sewage-treatment-plant --pattern sewageModel.glb --dir $dir --clobber
$f="$dir\sewageModel.glb"
if ((Get-Item $f).Length -ne 117426548) { throw 'Canonical model size mismatch' }
if ((Get-FileHash $f -Algorithm SHA256).Hash -ne '65A9E7430836816699A5FB0F29DEB8104147697E350E355104BD3389BCA0A0D6') { throw 'Canonical model hash mismatch' }
```
- [ ] **Step 2: Authenticate Wrangler without writing a token file**

Run:

```powershell
npx wrangler@latest login --device --use-keyring
npx wrangler@latest whoami
```

Expected: Wrangler reports an authenticated Cloudflare account and keyring-backed credentials.

- [ ] **Step 3: Create or verify the bucket**

```powershell
npx wrangler@latest r2 bucket info sewage-treatment-assets --json
if ($LASTEXITCODE -ne 0) { npx wrangler@latest r2 bucket create sewage-treatment-assets }
npx wrangler@latest r2 bucket info sewage-treatment-assets --json
if ($LASTEXITCODE -ne 0) { throw 'R2 bucket unavailable after create' }
```

- [ ] **Step 4: Upload the exact immutable object**

```powershell
$key='sewage-treatment-assets/models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb'
npx wrangler@latest r2 object put $key --file='C:\Temp\r2-sewage\sewageModel.glb' --content-type='model/gltf-binary' --cache-control='public, max-age=31536000, immutable' --remote
if ($LASTEXITCODE -ne 0) { throw 'R2 upload failed' }
```

- [ ] **Step 5: Download round-trip copy and verify exact bytes**

```powershell
npx wrangler@latest r2 object get $key --file='C:\Temp\r2-sewage\roundtrip.glb' --remote
$r='C:\Temp\r2-sewage\roundtrip.glb'
if ((Get-Item $r).Length -ne 117426548) { throw 'R2 roundtrip size mismatch' }
if ((Get-FileHash $r -Algorithm SHA256).Hash -ne '65A9E7430836816699A5FB0F29DEB8104147697E350E355104BD3389BCA0A0D6') { throw 'R2 roundtrip hash mismatch' }
```
- [ ] **Step 6: Apply public GET CORS**

Create `C:\Temp\r2-sewage\cors.json` with:

```json
{
  "rules": [
    {
      "allowed": { "origins": ["*"], "methods": ["GET"] },
      "exposeHeaders": ["Content-Length", "ETag", "Cache-Control", "Content-Range", "Accept-Ranges"],
      "maxAgeSeconds": 86400
    }
  ]
}
```

Run:

```powershell
npx wrangler@latest r2 bucket cors set sewage-treatment-assets --file='C:\Temp\r2-sewage\cors.json'
npx wrangler@latest r2 bucket cors list sewage-treatment-assets
```

Expected: the GET rule above is returned.

- [ ] **Step 7: Resolve the `qs3d.site` Zone ID in-memory and attach the custom domain**

```powershell
$auth = npx wrangler@latest auth token --json | ConvertFrom-Json
if (-not $auth.token) { throw 'Wrangler auth token unavailable' }
$headers = @{ Authorization = "Bearer $($auth.token)" }
$zones = Invoke-RestMethod -Headers $headers -Uri 'https://api.cloudflare.com/client/v4/zones?name=qs3d.site'
$zoneId = ($zones.result | Where-Object name -eq 'qs3d.site' | Select-Object -First 1).id
Remove-Variable auth,headers,zones -ErrorAction SilentlyContinue
if (-not $zoneId) { throw 'qs3d.site Zone ID not found in authenticated account' }
npx wrangler@latest r2 bucket domain add sewage-treatment-assets --domain sewage-assets.qs3d.site --zone-id $zoneId --min-tls 1.2 --force
npx wrangler@latest r2 bucket domain get sewage-treatment-assets --domain sewage-assets.qs3d.site
```
### Task 4: Benchmark R2 and gate production activation

**Files:**
- Temporary benchmark outputs under `C:\Temp\r2-sewage\` only.
- GitHub repository variable: `SEWAGE_MODEL_CDN_URL`.

**Interfaces:**
- Candidate URL: `https://sewage-assets.qs3d.site/models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb`.
- Baseline URL: `https://trinhtanphat.github.io/sewage-treatment-plant/sewageModel.glb`.

- [ ] **Step 1: Verify public headers and CORS**

```powershell
$u='https://sewage-assets.qs3d.site/models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb'
$r=Invoke-WebRequest -Method Head -Uri $u
if ($r.StatusCode -ne 200) { throw 'R2 custom domain is not serving the object' }
$r.Headers
```

Then issue a GET request with `Origin: https://trinhtanphat.github.io` and require `Access-Control-Allow-Origin` to be present.

- [ ] **Step 2: Benchmark three fresh full downloads of Pages and R2 from VPS 182**

Use a Python script that streams each URL to `NUL`, disables application-level reuse between trials, records wall time and byte count, and runs Pages/R2 alternately for three trials each.

Pass gate: all six downloads complete with `117426548` bytes and R2 median wall time is at most `70%` of Pages median wall time. If the gate fails, do not set the GitHub variable; keep production on Pages and close the change as no-op infrastructure.

- [ ] **Step 3: Set the repository variable only after the benchmark gate passes**

```powershell
$url='https://sewage-assets.qs3d.site/models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb'
gh variable set SEWAGE_MODEL_CDN_URL --repo trinhtanphat/sewage-treatment-plant --body $url
gh variable get SEWAGE_MODEL_CDN_URL --repo trinhtanphat/sewage-treatment-plant
```

Expected: exact candidate URL is returned.

- [ ] **Step 4: Run candidate browser verification before merge**

Build with `VITE_SEWAGE_MODEL_URL` set to the R2 URL, serve the build locally, and run a fresh Edge profile. Require model render, no JavaScript exception, progress completion, and a network trace showing the R2 URL was requested.

Then intentionally set the candidate URL to an unreachable URL for a second fresh profile and require the network trace to show failure of the primary followed by successful `./sewageModel.glb` fallback and a rendered model.
### Task 5: Final verification, PR, merge, and production proof

**Files:**
- No additional source files beyond Tasks 1–2.
- Evidence files under `C:\Temp\r2-sewage\` only.

**Interfaces:**
- Consumes: completed source branch, R2 custom domain, GitHub variable.
- Produces: merged `main` with resilient CDN-first model loading.

- [ ] **Step 1: Run fresh pre-commit verification on the exact branch state**

Run:

```powershell
npm test
if ($LASTEXITCODE -ne 0) { throw 'Tests failed' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
git diff --check
if ($LASTEXITCODE -ne 0) { throw 'Whitespace check failed' }
```

Also restore/download the canonical Pages asset and re-check its exact size and SHA-256.

- [ ] **Step 2: Push the implementation branch and open a PR**

```powershell
git push -u origin HEAD
gh pr create --repo trinhtanphat/sewage-treatment-plant --base main --head HEAD --title 'perf: serve canonical 3D model from R2 with Pages fallback' --body 'Adds CDN-first loading for the byte-identical canonical GLB, preserves GitHub Pages fallback, and gates activation on R2 benchmark/hash/visual verification.'
```

Record the PR number and exact head SHA.

- [ ] **Step 3: Require exact-head CI success**

Use `gh run list`/`gh run view` for the PR head SHA. Do not merge if any required workflow is queued, in progress, cancelled, or failed.

- [ ] **Step 4: Merge using the verified exact head**

Merge only after exact-head CI is successful and the candidate visual/fallback tests from Task 4 are documented. Use the repository's normal protected-branch merge path; do not bypass protections or force-push.

- [ ] **Step 5: Require Pages deployment success for the merge commit**

Record the merge SHA and verify the `Deploy GitHub Pages` workflow for that exact SHA reaches `completed/success`.
- [ ] **Step 6: Run fresh production verification from VPS 182**

Open a brand-new Edge profile against `https://trinhtanphat.github.io/sewage-treatment-plant/`. Require the R2 custom-domain model URL first, full model render, progress never above 100%, no uncaught JavaScript errors, and the R2 object still downloads as exactly 117,426,548 bytes with the canonical SHA-256.

- [ ] **Step 7: Roll back by configuration if production verification fails**

```powershell
gh variable delete SEWAGE_MODEL_CDN_URL --repo trinhtanphat/sewage-treatment-plant
```

Wait for or re-run Pages deployment so `VITE_SEWAGE_MODEL_URL` becomes empty, then verify production returns to the local Pages model. Do not revert source fallback code unless it independently causes a regression.

- [ ] **Step 8: Clean up test processes and retain durable evidence**

Stop only Vite/headless Edge/CDP processes created for this implementation. Remove temporary roundtrip downloads and token-bearing process state. Keep R2 resources if production uses them; if the benchmark gate fails before activation, delete the unused object and bucket only after confirming the bucket contains no unrelated objects.

- [ ] **Step 9: Record final evidence in the PR**

Post exact model SHA, R2 and Pages benchmark medians, CI run IDs, Pages deployment run, production screenshot hash, and fallback-test result. Never include Cloudflare auth tokens or credential-file contents.
