# Geo Redirect Gate

Redirect links for ads: **pick a country per link**, block bots, real visitors only.

## Quick start (Netlify)

1. Deploy from GitHub: `ayoubxkiller007/geo-redirect-gate`
2. Open **`https://YOUR-SITE.netlify.app/admin.html`**
3. Login with password from **`netlify/functions/config.mjs`**
4. Paste destination URL → choose country → **Create gate link**
5. Copy link like `https://YOUR-SITE.netlify.app/r/a1b2c3d4e5` → use in Snap/TikTok/Meta ads

## How each link works

| Step | What happens |
|------|----------------|
| Visitor opens `/r/{id}` | Bot user-agents blocked at edge |
| Gate page | ~1.3s human check + honeypot |
| Server verify | Re-checks country for that link + bot signals |
| OK | Redirect to **your URL** (stored server-side) |
| Wrong country / bot | Blocked |

## Admin

- **URL:** `/admin.html`
- **Password:** edit `ADMIN_PASSWORD` in `netlify/functions/config.mjs`
- Add many links, each with its own country

## Local dev

```bash
npm install
netlify dev
```

Password: `netlify/functions/config.mjs`
