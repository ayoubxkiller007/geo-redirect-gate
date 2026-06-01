import { getCountry, isBotUa, json, MIN_WAIT_MS, parseLinkToken } from './_lib.mjs';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, reason: 'method' });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, reason: 'bad_json' });
  }

  const linkId = (body.linkId || '').trim();
  if (!linkId) {
    return json(400, { ok: false, reason: 'missing_link' });
  }

  const link = parseLinkToken(linkId);
  if (!link) {
    return json(404, { ok: false, reason: 'not_found' });
  }

  const ua = event.headers['user-agent'] || body.ua || '';
  if (isBotUa(ua)) {
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

  const country = getCountry(context, event.headers);
  if (country && country.toUpperCase() !== link.country.toUpperCase()) {
    return json(403, { ok: false, reason: 'country', country });
  }

  return json(200, { ok: true, redirect: link.url });
};
