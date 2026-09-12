# Sewage Treatment Plant i18n + CI + Cloudflare Design

## Goal
Fork the upstream Three.js/Vue wastewater digital-twin demo into `trinhtanphat/sewage-treatment-plant`, add Vietnamese and English UI while retaining Chinese, verify builds in CI, and deploy the static output to Cloudflare Pages under account `trinhtanphat6666`.

## Constraints
- Vietnamese is the default locale; supported locales are `vi`, `en`, and `zh-CN`.
- Locale selection persists in `localStorage` and may initialize from the browser language when no saved value exists.
- User-visible strings are localized; Chinese Three.js object/mesh names remain unchanged because model lookup depends on exact names.
- Keep upstream attribution and do not invent a license. The upstream repository currently has no LICENSE file.
- Do not claim the 3D scene is complete when `public/sewageModel.glb` is absent; the file exceeds normal GitHub single-file limits according to upstream documentation.
- Build output is static `dist/` from Vite.
