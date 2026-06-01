const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|selenium|puppeteer|playwright|scrapy|python-requests|curl\/|wget\/|httpclient|java\/|libwww|go-http|postman|insomnia|ahrefs|semrush|bytespider|petalbot|gptbot|claudebot|anthropic|facebookexternalhit|meta-externalagent/i;

const MIN_WAIT_MS = 1200;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, reason: 'method' });
  }

  const redirectUrl = process.env.REDIRECT_URL || '';
  const allowedCountry = (process.env.ALLOWED_COUNTRY || 'MA').toUpperCase();

  if (!redirectUrl) {
    return json(500, { ok: false, reason: 'missing_redirect' });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, reason: 'bad_json' });
  }

  const ua = event.headers['user-agent'] || body.ua || '';
  if (!ua || BOT_UA.test(ua)) {
    return json(403, { ok: false, reason: 'bot' });
  }

  if (body.webdriver === true) {
    return json(403, { ok: false, reason: 'automation' });
  }

  if (body.hp) {
    return json(403, { ok: false, reason: 'honeypot' });
  }

  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_WAIT_MS) {
    return json(403, { ok: false, reason: 'too_fast' });
  }

  const country =
    context.geo?.country?.code ||
    event.headers['x-nf-client-connection-country'] ||
    event.headers['x-nf-geo-country'] ||
    event.headers['x-nf-client-geo-country'] ||
    event.headers['x-country'] ||
    '';

  if (country && country.toUpperCase() !== allowedCountry) {
    return json(403, { ok: false, reason: 'country', country });
  }

  return json(200, { ok: true, redirect: redirectUrl });
};
