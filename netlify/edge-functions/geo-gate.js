const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|selenium|puppeteer|playwright|scrapy|python-requests|curl\/|wget\/|httpclient|java\/|libwww|go-http|postman|insomnia|ahrefs|semrush|bytespider|petalbot|gptbot|claudebot|anthropic|facebookexternalhit|meta-externalagent/i;

const SKIP_PATHS = /^\/(blocked\.html|favicon\.ico|api\/)/;

function env(name, fallback = '') {
  return Netlify.env.get(name) || fallback;
}

export default async (request, context) => {
  const url = new URL(request.url);
  if (SKIP_PATHS.test(url.pathname)) {
    return context.next();
  }

  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOT_UA.test(ua)) {
    return new Response('Forbidden', { status: 403 });
  }

  const allowed = (env('ALLOWED_COUNTRY') || 'MA').toUpperCase();
  const country = (context.geo?.country?.code || '').toUpperCase();

  if (!country) {
    return context.next();
  }

  if (country !== allowed) {
    const blocked = new URL('/blocked.html', request.url);
    blocked.searchParams.set('c', country);
    return Response.redirect(blocked.toString(), 302);
  }

  return context.next();
};
