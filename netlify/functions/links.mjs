import { authOk, COUNTRIES, createLinkToken, json } from './_lib.mjs';

export const handler = async (event) => {
  if (event.httpMethod === 'GET' && event.queryStringParameters?.public === 'countries') {
    return json(200, { ok: true, countries: COUNTRIES });
  }

  if (!authOk(event)) {
    return json(401, { ok: false, reason: 'unauthorized' });
  }

  if (event.httpMethod === 'GET') {
    return json(200, { ok: true });
  }

  if (event.httpMethod === 'POST') {
    let body = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { ok: false, reason: 'bad_json' });
    }

    const url = (body.url || '').trim();
    const country = (body.country || '').trim().toUpperCase();
    const label = (body.label || '').trim();

    if (!url || !/^https?:\/\//i.test(url)) {
      return json(400, { ok: false, reason: 'bad_url' });
    }
    if (!COUNTRIES.some((c) => c.code === country)) {
      return json(400, { ok: false, reason: 'bad_country' });
    }

    const id = createLinkToken(url, country, label);
    const link = {
      id,
      url,
      country,
      label,
      createdAt: new Date().toISOString(),
    };

    return json(200, { ok: true, link });
  }

  return json(405, { ok: false, reason: 'method' });
};
