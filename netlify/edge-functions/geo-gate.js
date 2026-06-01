const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|selenium|puppeteer|playwright|scrapy|python-requests|curl\/|wget\/|httpclient|java\/|libwww|go-http|postman|insomnia|ahrefs|semrush|bytespider|petalbot|gptbot|claudebot|anthropic|facebookexternalhit|meta-externalagent/i;

const SKIP_PATHS = /^\/(blocked\.html|gate\.html|admin\.html|favicon\.ico|api\/)/;

export default async (request, context) => {
  const url = new URL(request.url);
  if (SKIP_PATHS.test(url.pathname)) {
    return context.next();
  }

  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOT_UA.test(ua)) {
    return new Response('Forbidden', { status: 403 });
  }

  return context.next();
};
