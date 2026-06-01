import crypto from 'crypto';

// Bdl password hna
export const ADMIN_PASSWORD = 'zbi';

const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|selenium|puppeteer|playwright|scrapy|python-requests|curl\/|wget\/|httpclient|java\/|libwww|go-http|postman|insomnia|ahrefs|semrush|bytespider|petalbot|gptbot|claudebot|anthropic|facebookexternalhit|meta-externalagent/i;

export const MIN_WAIT_MS = 1200;

export function isBotUa(ua) {
  return !ua || BOT_UA.test(ua);
}

export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

export function getCountry(context, headers) {
  return (
    context.geo?.country?.code ||
    headers['x-nf-client-connection-country'] ||
    headers['x-nf-geo-country'] ||
    headers['x-nf-client-geo-country'] ||
    headers['x-country'] ||
    ''
  );
}

export function createLinkToken(url, country, label = '') {
  const payload = {
    u: url,
    c: country.toUpperCase(),
    l: label,
    t: Date.now(),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', ADMIN_PASSWORD).update(data).digest('base64url').slice(0, 16);
  return `${data}.${sig}`;
}

export function parseLinkToken(token) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;

  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', ADMIN_PASSWORD).update(data).digest('base64url').slice(0, 16);
  if (sig !== expected) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!payload.u || !payload.c) return null;
    return {
      id: `${data}.${sig}`,
      url: payload.u,
      country: payload.c,
      label: payload.l || '',
      createdAt: payload.t ? new Date(payload.t).toISOString() : '',
    };
  } catch {
    return null;
  }
}

export function authOk(event) {
  const header =
    event.headers.authorization ||
    event.headers.Authorization ||
    event.headers['authorization'] ||
    '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (token === ADMIN_PASSWORD) return true;

  if (event.httpMethod === 'GET' || !event.body) return false;

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return false;
  }
  return body.secret === ADMIN_PASSWORD;
}

export const COUNTRIES = [
  { code: 'MA', name: 'Morocco 🇲🇦' },
  { code: 'SA', name: 'Saudi Arabia 🇸🇦' },
  { code: 'AE', name: 'UAE 🇦🇪' },
  { code: 'KW', name: 'Kuwait 🇰🇼' },
  { code: 'QA', name: 'Qatar 🇶🇦' },
  { code: 'OM', name: 'Oman 🇴🇲' },
  { code: 'BH', name: 'Bahrain 🇧🇭' },
  { code: 'EG', name: 'Egypt 🇪🇬' },
  { code: 'US', name: 'USA 🇺🇸' },
  { code: 'FR', name: 'France 🇫🇷' },
  { code: 'DE', name: 'Germany 🇩🇪' },
  { code: 'GB', name: 'UK 🇬🇧' },
  { code: 'EE', name: 'Estonia 🇪🇪' },
];
