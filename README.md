# Geo Redirect Gate

Redirect links for ads: **pick a country per link**, geo-filter real visitors.

**Public face:** the root domain looks like a normal Arabic news site (**المشهد**) so ad crawlers (Meta, TikTok, Google, etc.) get real HTML articles instead of a 403.

No database or Netlify Blobs — each gate link is a signed token in the URL.

## News site (for bots / review)

| Path | Crawlers / bots | Real visitors |
|------|-----------------|---------------|
| `/` | News homepage | News homepage |
| `/article/*` | Full articles | Full articles |
| `/r/{token}` | Rewritten → main article | Gate → redirect |
| `/admin.html` | Blocked | Admin panel |

Edit articles in `public/article/` and `public/index.html`. Update `sitemap.xml` with your Netlify domain.

## Quick start (Netlify)

1. Deploy from GitHub: `ayoubxkiller007/geo-redirect-gate`
2. Open **`https://YOUR-SITE.netlify.app/admin.html`**
3. Login with password from **`netlify/functions/_lib.mjs`** (`ADMIN_PASSWORD`)
4. Paste destination URL → choose country → **Create gate link**
5. Copy link → use in Snap/TikTok/Meta ads

**Note:** List of links is saved in your browser (localStorage). The gate URL itself works everywhere — share it in ads.

## How each link works

| Step | What happens |
|------|----------------|
| Visitor opens `/r/{id}` | Bots see news article; humans → gate |
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
