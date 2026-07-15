# Chios Commercial Divers — Service Report Tool

Web app that generates the company's boat cleaning service report (`.docx`)
from a form: header/general details, an underwater assignment checklist, a
13-part condition table, and 37 before/after photo slots. Replaces the old
desktop Python tool with something deployable on Vercel.

## How it works

- `templates/report-template.docx` is `MAIN REPORT FILE.docx` with `{{TOKEN}}`
  placeholders added for every text field (see `src/lib/report-fields.ts` for
  the token list) alongside the original `{{IMG_00}}`–`{{IMG_36}}` photo
  placeholders.
- The form (`/`) collects text field values and photos, uploading each photo
  directly to Vercel Blob as it's picked (client-side resized first).
- `POST /api/generate-report` fetches the uploaded photos, resizes each to
  its exact print size with `sharp` (auto-rotating via EXIF, matching the
  legacy tool's 300 DPI / stretch-to-fit behavior), fills the template with
  `easy-template-x`, and streams back the finished `.docx`.
- Access is gated behind a single shared password (`APP_PASSWORD`), no user
  accounts — see `src/proxy.ts`.

## Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `APP_PASSWORD` — the shared password divers will use to log in.
- `AUTH_SECRET` — random signing secret for the session cookie, e.g.
  `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
- `BLOB_READ_WRITE_TOKEN` — from a Vercel Blob store (see below). Not needed
  for `npm run build`/`npm run lint`, only for actually uploading photos.

```bash
npm run dev
```

## Deploying on Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add a **Blob store** to the project (Storage tab → Create → Blob). Vercel
   sets `BLOB_READ_WRITE_TOKEN` automatically once it's connected.
3. Set `APP_PASSWORD` and `AUTH_SECRET` as project environment variables.
4. The `/api/generate-report` route needs the **Node.js runtime** (already
   set via `export const runtime = "nodejs"`) since it uses `sharp` and zip
   manipulation — this is not Edge-compatible. It also processes up to 37
   photos per request; the **Hobby plan's 10s function timeout may not be
   enough** — if reports fail or time out in production, upgrade to Pro
   (`maxDuration` is set to 60s in the route, which requires Pro or higher).

## Known limitations

- The report's "Type of work" checklist (Inspection / Hull cleaning /
  Propeller polishing / etc.) uses Word drawing-shape checkboxes, not text —
  these aren't wired up to the form and remain blank in generated reports.
  Everything else in the template is driven by the form.
- Uploaded photos live under `reports/<session-id>/...` in Blob storage and
  are deleted after a successful report generation. If a diver abandons a
  report mid-way, those blobs are simply left behind (harmless, but not
  auto-cleaned — fine for expected usage volume).
