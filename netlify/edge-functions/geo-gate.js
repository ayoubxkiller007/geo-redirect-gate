const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|selenium|puppeteer|playwright|scrapy|python-requests|curl\/|wget\/|httpclient|java\/|libwww|go-http|postman|insomnia|ahrefs|semrush|bytespider|petalbot|gptbot|claudebot|anthropic|facebookexternalhit|meta-externalagent|Googlebot|bingbot|LinkedInBot|Twitterbot|Slackbot|Discordbot|Applebot/i;

/** Pages crawlers should see (normal news site). */
const PUBLIC_NEWS =
  /^\/($|index\.html|about\.html|contact\.html|privacy\.html|robots\.txt|sitemap\.xml|css\/|article\/)/;

/** Internal tools — never for crawlers. */
const INTERNAL_ONLY = /^\/(admin\.html|api\/)/;

/** Default article shown when a bot hits ad landing paths. */
const BOT_LANDING_ARTICLE = '/article/streaming-tv-evolution-2025.html';

function isBot(ua) {
  return !ua || BOT_UA.test(ua);
}

export default async (request, context) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const ua = request.headers.get('user-agent') || '';
  const bot = isBot(ua);

  if (INTERNAL_ONLY.test(path)) {
    if (bot) {
      return new Response('Forbidden', { status: 403 });
    }
    return context.next();
  }

  if (bot) {
    if (path.startsWith('/r/') || path === '/gate.html' || path === '/blocked.html') {
      return context.rewrite(new URL(BOT_LANDING_ARTICLE, request.url));
    }
    if (PUBLIC_NEWS.test(path)) {
      return context.next();
    }
    return context.next();
  }

  return context.next();
};
