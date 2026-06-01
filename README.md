# Geo Redirect Gate

Redirect site for Netlify: only visitors from **one country** pass through, bots are blocked, real humans get redirected to your link.

## How it works

1. **Edge function** (`geo-gate`) — checks country via Netlify geo + blocks known bot user-agents before the page loads.
2. **Verify function** — client waits ~1.3s (anti-bot), sends honeypot + timing check; server re-checks country and returns `REDIRECT_URL`.
3. Wrong country → `/blocked.html`. Bot → 403 / silent fail.

## Deploy on Netlify (from GitHub)

1. Push this folder to a new GitHub repo.
2. [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git** → select the repo.
3. Build settings (auto-detected from `netlify.toml`):
   - **Publish directory:** `public`
   - **Functions:** `netlify/functions`
4. **Site settings → Environment variables** — add:

   | Variable | Example | Description |
   |----------|---------|-------------|
   | `ALLOWED_COUNTRY` | `MA` | 2-letter country code (Morocco = MA, Saudi = SA, UAE = AE…) |
   | `REDIRECT_URL` | `https://yoursite.com/page` | Final link after verification |

5. Deploy. Your gate URL is e.g. `https://your-site.netlify.app`.

## Local test

```bash
npm i -g netlify-cli
netlify dev
```

Set env in `.env` (see `.env.example`) or `netlify.toml` `[context.dev.environment]`.

## Notes

- Geo uses Netlify edge geo IP — VPN users may bypass or fail country check.
- Bot filtering blocks common crawlers and automation UAs; no system is 100% bot-proof without CAPTCHA.
- `REDIRECT_URL` stays server-side only — not exposed in HTML source.
