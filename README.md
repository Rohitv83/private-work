# Freelance Desk — HTML + Vercel Cloud Edition

This keeps the UI in one `index.html` (HTML/CSS/JavaScript) and includes small Vercel serverless JavaScript API files. A server backend is necessary for secure cross-device cloud syncing: the private Blob token must never be placed in browser HTML.

## What this does
- Same project records on every device when you visit the same deployed Vercel URL and sign in
- Secure server-side password check and signed HTTP-only session cookie
- Private Vercel Blob storage; the data file is not publicly readable
- Add/edit/delete projects; client, status, amount, received, deadline, start date, hours, notes
- Dashboard totals, search/filter and CSV export
- Responsive layout

## Deploy

1. Upload this folder to a private GitHub repository.
2. Import it into Vercel.
3. In Vercel, create a **Private** Blob store and connect it to this project. This should provide `BLOB_READ_WRITE_TOKEN`.
4. In Vercel Project Settings → Environment Variables, add:
   - `FREELANCE_PASSWORD`: your strong, unique panel password
   - `SESSION_SECRET`: random secret wit at least 32 characters
   - `BLOB_READ_WRITE_TOKEN`: generated when you connect Blob
5. Redeploy after setting environment variables.
6. Open the Vercel URL on your laptop and phone. Use the same password; data is shared through the cloud.

## Local development (optional)
Install Node.js, then run:
```bash
npm install
npx vercel login
npx vercel dev
```
Configure environment variables in the linked Vercel project or `.env.local`.

## Security and limitations
- Blob store must be **Private**, not Public.
- Never put `BLOB_READ_WRITE_TOKEN`, `SESSION_SECRET`, or the password in `index.html` or any `NEXT_PUBLIC_` variable.
- Use HTTPS (Vercel provides it) and a long unique password.
- This is designed for a single personal workspace. The data is stored as one JSON blob, so avoid saving edits concurrently from two devices at exactly the same time; a later save can overwrite a concurrent change. For simultaneous editing, use a database.
- Export CSV backups regularly.
