import {
  authOk,
  COUNTRIES,
  json,
  loadAllLinks,
  newLinkId,
  saveAllLinks,
} from './_lib.mjs';

export const handler = async (event) => {
  try {
    if (event.httpMethod === 'GET' && event.queryStringParameters?.public === 'countries') {
      return json(200, { ok: true, countries: COUNTRIES });
    }

    if (!authOk(event)) {
      return json(401, { ok: false, reason: 'unauthorized' });
    }

    if (event.httpMethod === 'GET') {
      const links = await loadAllLinks();
      return json(200, { ok: true, links });
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

      const id = newLinkId();
      const link = {
        id,
        url,
        country,
        label,
        createdAt: new Date().toISOString(),
      };

      const links = await loadAllLinks();
      links.unshift(link);
      await saveAllLinks(links);

      return json(200, { ok: true, link });
    }

    if (event.httpMethod === 'DELETE') {
      const id = (event.queryStringParameters?.id || '').toLowerCase();
      if (!id) return json(400, { ok: false, reason: 'missing_id' });

      const links = await loadAllLinks();
      const next = links.filter((l) => l.id !== id);
      if (next.length === links.length) {
        return json(404, { ok: false, reason: 'not_found' });
      }
      await saveAllLinks(next);
      return json(200, { ok: true });
    }

    return json(405, { ok: false, reason: 'method' });
  } catch (err) {
    console.error('links error:', err);
    return json(500, {
      ok: false,
      reason: 'server',
      message: err?.message || 'storage_error',
    });
  }
};
