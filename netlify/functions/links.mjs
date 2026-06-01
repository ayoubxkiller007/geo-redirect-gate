import {
  authOk,
  COUNTRIES,
  getLink,
  json,
  linksStore,
  newLinkId,
} from './_lib.mjs';

export const handler = async (event) => {
  if (event.httpMethod === 'GET' && event.queryStringParameters?.public === 'countries') {
    return json(200, { ok: true, countries: COUNTRIES });
  }

  if (!authOk(event)) {
    return json(401, { ok: false, reason: 'unauthorized' });
  }

  if (event.httpMethod === 'GET') {
    const store = linksStore();
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map(async (meta) => {
        const link = await store.get(meta.key, { type: 'json' });
        return link
          ? {
              id: link.id,
              country: link.country,
              label: link.label || '',
              url: link.url,
              createdAt: link.createdAt,
            }
          : null;
      })
    );
    items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return json(200, { ok: true, links: items.filter(Boolean) });
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

    await linksStore().setJSON(id, link);

    return json(200, { ok: true, link });
  }

  if (event.httpMethod === 'DELETE') {
    const id = (event.queryStringParameters?.id || '').toLowerCase();
    if (!id) return json(400, { ok: false, reason: 'missing_id' });
    const existing = await getLink(id);
    if (!existing) return json(404, { ok: false, reason: 'not_found' });
    await linksStore().delete(id);
    return json(200, { ok: true });
  }

  return json(405, { ok: false, reason: 'method' });
};
