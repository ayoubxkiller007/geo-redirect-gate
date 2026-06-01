import { getStore } from '@netlify/blobs';
import crypto from 'crypto';
import { ADMIN_PASSWORD } from './config.mjs';

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

export function linksStore() {
  return getStore('geo-links');
}

export async function getLink(linkId) {
  if (!linkId || !/^[a-z0-9]{6,12}$/i.test(linkId)) return null;
  const data = await linksStore().get(linkId.toLowerCase(), { type: 'json' });
  return data || null;
}

export function newLinkId() {
  return crypto.randomBytes(5).toString('hex');
}

export function authOk(event) {
  const header =
    event.headers.authorization ||
    event.headers.Authorization ||
    event.headers['Authorization'] ||
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
];
