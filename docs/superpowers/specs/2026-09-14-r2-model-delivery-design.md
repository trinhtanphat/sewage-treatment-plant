# R2 Model Delivery Design

## Goal

Reduce cold-load latency for the sewage-treatment-plant 3D model without changing a single byte of the production GLB. Keep GitHub Pages as a verified fallback so an R2 outage cannot make the model unavailable.

## Current State

- Production `main`: `cbd334531fc78c8694f507d9b83b02044362abf8`.
- Canonical model: `sewageModel.glb`, 117,426,548 bytes.
- Canonical SHA-256: `65A9E7430836816699A5FB0F29DEB8104147697E350E355104BD3389BCA0A0D6`.
- GitHub Pages delivers the model correctly but cold-load throughput from VPS 182 is highly variable.
- Geometry-compression experiments are rejected because pixel-level verification showed measurable visual differences.
- Parallel Range loading is rejected because Pages returns uncompressed 206 bodies and produced only a small throughput improvement.

## Architecture

Store the canonical GLB byte-for-byte in Cloudflare R2 bucket `sewage-treatment-assets` under the immutable, hash-versioned key:

`models/sewageModel-65a9e7430836816699a5fb0f29deb8104147697e350e355104bd3389bca0a0d6.glb`

Expose that bucket through custom domain `sewage-assets.qs3d.site`. The object receives `Content-Type: model/gltf-binary` and `Cache-Control: public, max-age=31536000, immutable`.

The application reads the primary model URL from build-time `VITE_SEWAGE_MODEL_URL`. If the variable is empty, only the existing local Pages URL `./sewageModel.glb` is used. If the variable is present, the loader tries the CDN URL first and automatically retries the local Pages URL on network/load failure.

GitHub Pages continues restoring the release asset during builds exactly as today. This is deliberate redundancy, not duplication to remove.

## Cloudflare Configuration

- Authenticate with Wrangler OAuth device flow and keyring storage.
- R2 bucket: `sewage-treatment-assets`.
- Custom domain: `sewage-assets.qs3d.site`.
- Public object path is the hash-versioned key above.
- CORS permits public `GET` access because the object is already public read-only content.
- CORS exposes `Content-Length`, `ETag`, `Cache-Control`, `Content-Range`, and `Accept-Ranges` for diagnostics.
- Wrangler OAuth token may be retrieved transiently with `wrangler auth token --json` only to query the `qs3d.site` Zone ID; it must never be written to repo files or logs.

## Application Changes

Create `src/view/threejs/modelSource.js` as the single responsibility unit for source selection and retry order. It exports pure source-list construction plus a loader retry helper so behavior is unit-testable without WebGL.

Modify `src/view/threejs/addSewageModel/index.js` only enough to use the source helper. Geometry normalization, capabilities, materials, progress semantics, fence logic, plant logic, and visual behavior remain unchanged.

Modify `.github/workflows/pages.yml` so the build step receives `VITE_SEWAGE_MODEL_URL` from GitHub Actions repository variable `SEWAGE_MODEL_CDN_URL`. Do not hardcode Cloudflare URLs in application source.

## Verification Gates

Cloud mutation is allowed only after the local canonical model has been revalidated for exact size and SHA-256.

After upload, download the R2 object back to a fresh file and require the exact same 117,426,548-byte size and canonical SHA-256 before the custom domain or application is enabled.

Benchmark the custom-domain URL from VPS 182 with both a fresh full download and browser cold-load. The R2 path must be materially faster than the current Pages path; otherwise leave `SEWAGE_MODEL_CDN_URL` unset and make no production delivery change.

Before merge, require:

- source-selection unit tests with RED→GREEN evidence;
- full `npm test` pass;
- production `npm run build` pass;
- `git diff --check` pass;
- candidate browser visual render pass using the exact canonical GLB bytes;
- CDN failure simulation proving automatic Pages fallback;
- exact model SHA evidence for both R2 and Pages copies.

After merge, require GitHub Pages workflow success and a fresh-profile production visual/load verification. If CDN delivery regresses, rollback is performed by clearing the GitHub variable `SEWAGE_MODEL_CDN_URL`; no model or geometry rollback is needed.

## Non-Goals

- No Meshopt, Draco, geometry simplification, texture recompression, or model-coordinate rewrite.
- No removal of the GitHub Release/Page fallback asset.
- No Worker proxy unless direct R2 custom-domain delivery is proven unavailable.
- No changes to the current 3D camera, normalization, materials, UI layout, or dashboard data.
