# Geo Redirect Gate

Redirect links for ads: **pick a country per link**, block bots, real visitors only.

## Quick start (Netlify)

1. Deploy from GitHub: `ayoubxkiller007/geo-redirect-gate`
2. Add env var: **`ADMIN_SECRET`** = strong password
3. Open **`https://YOUR-SITE.netlify.app/admin.html`**
4. Login → paste destination URL → choose country → **Create gate link**
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
- **Password:** same as `ADMIN_SECRET` in Netlify env
- Add many links, each with its own country

## Local dev

```bash
npm install
netlify dev
```

Set `ADMIN_SECRET` in `.env`.
