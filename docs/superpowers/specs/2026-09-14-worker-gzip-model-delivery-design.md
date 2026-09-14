# Worker Gzip Model Delivery Design

## Goal

Reduce cold-load latency for the canonical sewage-treatment GLB without changing geometry, textures, materials, normalization, camera framing, or semantic behavior.

The browser must ultimately receive the exact canonical GLB bytes:

- Size: `117426548` bytes.
- SHA-256: `65A9E7430836816699A5FB0F29DEB8104147697E350E355104BD3389BCA0A0D6`.

Production remains on GitHub Pages unless the new delivery path passes a strict benchmark, integrity, fallback, CI, and visual gate.

## Context and rejected predecessor

Direct R2 delivery was tested and rejected. It served the raw 117.4 MB GLB with `CF-Cache-Status: DYNAMIC`; one browser-like full transfer took about 112.4 s versus about 47.9 s for a paired GitHub Pages gzip transfer. The direct-R2 infrastructure was removed and production was never activated.

The new design changes only transport: precompress the canonical GLB deterministically, store that gzip object in private R2, and put a Cloudflare Worker in front of it with explicit response headers and edge Cache API use.

## Approaches considered

### A. Private R2 gzip + Worker edge cache — selected

Store a deterministic `.glb.gz` in private R2. A Worker reads it through an R2 binding, returns it as `Content-Encoding: gzip`, and caches the response at the edge. Browsers transparently decompress it before GLTFLoader parses it.: deterministic wire payload, private origin, explicit browser headers, cache behavior under our control, and no geometry transformation.

### B. Worker proxy of GitHub Pages or GitHub Release

A Worker could fetch the existing upstream asset and cache the upstream gzip response. This avoids an R2 object, but every cold edge miss remains dependent on GitHub availability and tail latency. It also makes byte/control evidence less direct because the Worker does not own the origin artifact.

### C. Direct R2 plus cache/compression rules

This has fewer moving parts, but the prior experiment showed raw 117.4 MB responses and dynamic cache behavior. Compression/cache rules would add dashboard-level policy dependence and be harder to prove deterministic. This option is rejected for this iteration.

## Architecture

The selected path has four independent units:

1. **Canonical asset preparation.** Download the existing `model-assets` release GLB, verify size/SHA, create deterministic gzip with no timestamp entropy, then decompress and re-hash before upload.
2. **Private R2 origin.** Bucket `sewage-treatment-assets` stores only the versioned gzip object for this feature. No public R2 custom domain is used.
3. **Model delivery Worker.** Worker `sewage-model-cdn` is bound to the private bucket and owns `sewage-assets.qs3d.site`. It serves exactly one versioned model path and uses `caches.default` for edge caching.
4. **Existing web app fallback.** Vite receives an optional `VITE_SEWAGE_MODEL_URL`. The app tries the Worker URL first and automatically retries `./sewageModel.glb` if the Worker path fails.

The Worker is infrastructure for model delivery only. It must not host the Vue application or alter the Three.js model. and URL contract

R2 object key:

`models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb.gz`

Public Worker URL:

`https://sewage-assets.qs3d.site/models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb`

The gzip file is generated deterministically from the canonical 117426548-byte GLB. Its compressed size and compressed SHA-256 are measured during provisioning and recorded as evidence. The gzip is accepted only if decompression produces exactly 117426548 bytes and the canonical SHA-256 above.

## Worker request contract

The Worker accepts `GET`, `HEAD`, and `OPTIONS` for the exact versioned model path. Unknown paths return `404`; unsupported methods return `405`.

A normal browser `GET` must advertise gzip support. If `Accept-Encoding` does not include `gzip`, the Worker returns `406` rather than spending CPU decompressing a 117 MB object server-side. `Range` requests are not supported for this precompressed representation and return `416`.

Successful model responses set:

- `Content-Type: model/gltf-binary`
- `Content-Encoding: gzip`
- `Content-Length` equal to the stored gzip object size
- `Cache-Control: public, max-age=31536000, immutable`
- `Access-Control-Allow-Origin: *`
- `Access-Control-Expose-Headers: Content-Length, ETag, X-Model-Cache`
- `Vary: Accept-Encoding`
- `X-Content-Type-Options: nosniff`

`HEAD` returns the same representation headers without a body. `OPTIONS` returns a CORS preflight response without touching R2. cache behavior

The Worker uses `caches.default`. The cache key is the versioned public model URL with query parameters removed so arbitrary query strings cannot fragment the cache.

On cache miss, the Worker reads the gzip object from the private R2 binding, constructs the response headers above, stores a clone in `caches.default` with `ctx.waitUntil`, and streams the response to the client. On cache hit, no R2 read is performed.

For verification only, the Worker adds `X-Model-Cache: MISS` to the client response produced from R2 and `X-Model-Cache: HIT` to a response returned from Cache API. The cached base response does not persist a misleading MISS marker.

The Worker never decompresses or recompresses the model in the normal browser path. This keeps CPU bounded and makes the wire representation deterministic.

## Application integration and fallback

The app adds a pure source-selection helper and a retry loader. `VITE_SEWAGE_MODEL_URL` is optional:

- unset/empty: load only `./sewageModel.glb` from GitHub Pages;
- set: try the Worker URL first, then retry `./sewageModel.glb` on network/HTTP/GLTF load failure.

Existing progress semantics remain unchanged: failed primary attempts must not report 100%, and only a successful GLTF parse may complete the progress bar.

GitHub Pages continues restoring the canonical release GLB into `public/sewageModel.glb`. The fallback copy is never removed from the Pages artifact.

## Provisioning and activation order

1. Verify the canonical GitHub Release asset by size and SHA.
2. Create deterministic gzip and prove gunzip -> canonical size/SHA.
3. Create the private R2 bucket and upload only the versioned gzip object.
4. Deploy the Worker with the R2 binding on a non-production hostname first; verify headers, gzip decoding, cache MISS/HIT, and canonical decoded SHA.
5. Attach `sewage-assets.qs3d.site` to the Worker candidate and repeat the same verification.
6. Run the benchmark gate from VPS 182.
7. Set GitHub repository variable `SEWAGE_MODEL_CDN_URL` only after the gate passes.
8. Run fresh-browser primary and forced-fallback tests before PR/merge. and acceptance gate

The benchmark compares the existing GitHub Pages URL with the final Worker custom-domain URL using browser-like request headers including Chrome-like `User-Agent` and `Accept-Encoding: gzip`.

Before timed warm-cache trials, issue one complete Worker request and then require a second request to report `X-Model-Cache: HIT`. Record the cold-miss time separately; it does not replace the warm-cache gate.

Run three alternating full downloads from each source. Each individual request has a hard total wall-clock limit of 300 seconds, not merely a socket inactivity timeout.

Every timed request must:

- complete successfully;
- decode to exactly `117426548` bytes;
- hash to the canonical SHA-256;
- for Worker responses, transfer no more than `60000000` compressed bytes;
- for Worker warm trials, report `X-Model-Cache: HIT`.

Production activation passes only if all six timed downloads complete and the Worker median full-download wall time is at most `70%` of the GitHub Pages median. A timeout, integrity mismatch, cache miss in a warm trial, or larger ratio fails the gate.

The gate is intentionally strict: this architecture is not merged merely because it works. It must produce a material measured improvement.

## Browser and visual verification

A candidate Vite build is produced with `VITE_SEWAGE_MODEL_URL` set to the Worker URL. A brand-new Edge profile must show:

- the Worker model request occurs first;
- the model renders completely;
- no uncaught JavaScript exception;
- progress never exceeds 100%;
- no geometry, texture, material, normalization, camera, or UI regression.

A second fresh profile uses an intentionally unreachable primary URL and must show the primary failure followed by a successful Pages fallback and rendered model. handling and rollback

The Worker never replaces the Pages copy; it is only an optional primary source.

If provisioning, integrity, cache, benchmark, browser, CI, deployment, or production verification fails before activation, do not set `SEWAGE_MODEL_CDN_URL`. Remove only candidate resources created for this design after confirming they contain no unrelated data.

If failure occurs after activation, delete `SEWAGE_MODEL_CDN_URL`, redeploy Pages so the build-time variable becomes empty, and verify production returns to `./sewageModel.glb`. No model rollback is required because the Pages asset remains canonical throughout.

The source fallback code may remain only if it independently passes all tests and is intentionally merged; a failed performance experiment alone is not a reason to revert unrelated safe fallback logic.

## Security and operational constraints

- R2 remains private; no public R2 custom domain is enabled.
- Cloudflare credentials remain in Wrangler's encrypted keyring and are never printed or written into repository files.
- The Worker exposes only the exact immutable model path and CORS responses required by the browser.
- No dashboard-only configuration is required for correctness; Worker/R2/domain configuration must be reproducible through versioned config and Wrangler/API commands.
- No force-push, branch-protection bypass, or stale CI result may be used.
- The custom domain is attached to the Worker, not directly to R2.

## Testing strategy

Use TDD for the app fallback helper and the Worker request router/cache behavior. Worker tests use a fake R2 binding and fake Cache API so GET/HEAD/OPTIONS, gzip negotiation, path/method rejection, cache MISS/HIT, and header contracts are deterministic.

Repository tests also assert that the Pages workflow maps the optional repository variable into Vite and that the fallback Pages asset restore step remains present.

Infrastructure verification is separate from unit tests: deterministic gzip round-trip hash, R2 upload/download hash, Worker decoded hash, public CORS/headers, cache HIT proof, benchmark gate, fresh-browser rendering, exact-head CI, Pages deployment, and production smoke are all required evidence. boundaries

Expected implementation remains narrowly scoped:

- `src/view/threejs/modelSource.js`: pure source-order and retry helper.
- `src/view/threejs/addSewageModel/index.js`: consume the optional Vite URL while preserving existing model success/progress behavior.
- `.github/workflows/pages.yml`: map `vars.SEWAGE_MODEL_CDN_URL` into `VITE_SEWAGE_MODEL_URL` only for the build.
- `worker/model-cdn/src/index.js`: Worker HTTP/cache/R2 adapter.
- `worker/model-cdn/wrangler.jsonc`: Worker name, R2 binding, compatibility date, and custom-domain configuration.
- focused Node tests under `test/` for app fallback, workflow mapping, and Worker behavior.

No unrelated UI, Three.js scene, translation, dashboard, model-normalization, or build-system refactor is in scope.

## Completion criteria

The feature is complete only when all of the following are true:

1. Canonical source GLB and decoded Worker payload match the fixed size and SHA above.
2. Worker sends the gzip representation with the exact transport/CORS/cache contract.
3. A warmed Worker edge response is demonstrably a Cache API HIT.
4. The 3x3 benchmark gate passes with Worker median <= 70% of Pages median and no request exceeding the 300-second total wall limit.
5. CDN-primary and forced-Page-fallback browser tests both render successfully.
6. Full repository tests, build, and whitespace checks pass on the exact PR head.
7. Protected CI succeeds for that exact head; no stale success is reused.
8. Production Pages deployment succeeds for the merge commit.
9. Fresh production verification proves Worker-first loading, canonical model rendering, and no progress/console regression.
10. Rollback remains configuration-only by deleting `SEWAGE_MODEL_CDN_URL` and redeploying Pages.