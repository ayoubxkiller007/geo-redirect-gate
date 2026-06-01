/* Shared geo-gate logic — must match netlify/functions/_lib.mjs */
(function (global) {
  'use strict';

  var ADMIN_PASSWORD = 'zbi';
  var MIN_WAIT_MS = 1200;

  /** Gate landing copy by link country (language of target geo). */
  var GATE_LOCALES = {
    MA: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'المغرب',
      title: 'جاري تفعيل العرض',
      lead: 'نتحقق من منطقتك ونجهّز صفحة العرض الخاصة بك. بضع ثوانٍ فقط.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'هذا العرض مخصّص لزوار من بلد معيّن فقط.',
    },
    EG: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'مصر',
      title: 'جاري تفعيل العرض',
      lead: 'نتحقق من منطقتك ونجهّز صفحة العرض. انتظر لحظات.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'هذا العرض غير متاح في منطقتك الحالية.',
    },
    SA: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'السعودية',
      title: 'جاري تفعيل العرض',
      lead: 'يتم التحقق من موقعك وتجهيز صفحة العرض الخاصة بك.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'العرض مخصص لزوار من دولة محددة.',
    },
    AE: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'الإمارات',
      title: 'جاري تفعيل العرض',
      lead: 'نتحقق من منطقتك ونجهّز صفحة العرض.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'هذا الرابط غير متاح في منطقتك.',
    },
    KW: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'الكويت',
      title: 'جاري تفعيل العرض',
      lead: 'جاري التحقق وتجهيز صفحة العرض.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'العرض غير متاح في منطقتك.',
    },
    QA: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'قطر',
      title: 'جاري تفعيل العرض',
      lead: 'نتحقق من منطقتك ونجهّز العرض.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'غير متاح في منطقتك.',
    },
    OM: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'عُمان',
      title: 'جاري تفعيل العرض',
      lead: 'جاري التحقق من المنطقة وتجهيز العرض.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'غير متاح في منطقتك.',
    },
    BH: {
      lang: 'ar',
      dir: 'rtl',
      brandSub: 'البحرين',
      title: 'جاري تفعيل العرض',
      lead: 'نتحقق من موقعك ونجهّز صفحة العرض.',
      progress: 'التقدّم',
      steps: ['التحقق من الاتصال', 'تأكيد المنطقة', 'فتح العرض'],
      foot: 'اتصال آمن · المشهد',
      failTitle: 'غير متاح',
      failLead: 'غير متاح في منطقتك.',
    },
    FR: {
      lang: 'fr',
      dir: 'ltr',
      brandSub: 'France',
      title: 'Activation de votre offre',
      lead: 'Nous vérifions votre région et préparons votre page. Quelques secondes.',
      progress: 'Progression',
      steps: ['Vérification de la connexion', 'Confirmation de la région', 'Ouverture de l\'offre'],
      foot: 'Connexion sécurisée · Al-Mashhad',
      failTitle: 'Non disponible',
      failLead: 'Cette offre est réservée à un pays spécifique.',
    },
    DE: {
      lang: 'de',
      dir: 'ltr',
      brandSub: 'Deutschland',
      title: 'Angebot wird aktiviert',
      lead: 'Wir prüfen Ihre Region und bereiten Ihre Seite vor. Einen Moment bitte.',
      progress: 'Fortschritt',
      steps: ['Verbindung prüfen', 'Region bestätigen', 'Angebot öffnen'],
      foot: 'Sichere Verbindung · Al-Mashhad',
      failTitle: 'Nicht verfügbar',
      failLead: 'Dieses Angebot ist für ein bestimmtes Land vorgesehen.',
    },
    US: {
      lang: 'en',
      dir: 'ltr',
      brandSub: 'USA',
      title: 'Activating your offer',
      lead: 'We are verifying your region and preparing your page. Just a few seconds.',
      progress: 'Progress',
      steps: ['Checking connection', 'Confirming region', 'Opening offer'],
      foot: 'Secure connection · Al-Mashhad',
      failTitle: 'Unavailable',
      failLead: 'This offer is only available in a specific country.',
    },
    GB: {
      lang: 'en',
      dir: 'ltr',
      brandSub: 'United Kingdom',
      title: 'Activating your offer',
      lead: 'We are verifying your region and preparing your page.',
      progress: 'Progress',
      steps: ['Checking connection', 'Confirming region', 'Opening offer'],
      foot: 'Secure connection · Al-Mashhad',
      failTitle: 'Unavailable',
      failLead: 'This offer is not available in your region.',
    },
    EE: {
      lang: 'et',
      dir: 'ltr',
      brandSub: 'Eesti',
      title: 'Pakkumise aktiveerimine',
      lead: 'Kontrollime teie piirkonda ja valmistame lehe ette. Palun oodake.',
      progress: 'Edenemine',
      steps: ['Ühenduse kontroll', 'Piirkonna kinnitamine', 'Pakkumise avamine'],
      foot: 'Turvaline ühendus · Al-Mashhad',
      failTitle: 'Pole saadaval',
      failLead: 'See pakkumine on mõeldud kindlale riigile.',
    },
  };

  var GATE_LOCALE_DEFAULT = GATE_LOCALES.US;

  function getGateLocale(countryCode) {
    var code = (countryCode || '').toUpperCase();
    return GATE_LOCALES[code] || GATE_LOCALE_DEFAULT;
  }

  var COUNTRIES = [
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

  function isStaticHost() {
    return location.hostname.endsWith('github.io');
  }

  function siteBasePath() {
    if (!isStaticHost()) return '';
    var seg = location.pathname.split('/').filter(Boolean)[0];
    return seg ? '/' + seg : '';
  }

  function gateUrl(id) {
    var root = location.origin + siteBasePath();
    /* GitHub Pages: /r/TOKEN (dots in path) breaks; use query on gate.html */
    if (isStaticHost()) {
      return root + '/gate.html?link=' + encodeURIComponent(id);
    }
    return root + '/r/' + encodeURIComponent(id);
  }

  function bytesToBase64Url(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function stringToBase64Url(str) {
    return bytesToBase64Url(new TextEncoder().encode(str));
  }

  function base64UrlToString(b64) {
    var s = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(out);
  }

  function hmacSig16(password, data) {
    return crypto.subtle
      .importKey('raw', new TextEncoder().encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, [
        'sign',
      ])
      .then(function (key) {
        return crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
      })
      .then(function (sig) {
        return bytesToBase64Url(new Uint8Array(sig)).slice(0, 16);
      });
  }

  function createLinkToken(url, country, label) {
    var payload = { u: url, c: country.toUpperCase(), l: label || '', t: Date.now() };
    var data = stringToBase64Url(JSON.stringify(payload));
    return hmacSig16(ADMIN_PASSWORD, data).then(function (sig) {
      return data + '.' + sig;
    });
  }

  function parseLinkToken(token) {
    if (!token) return Promise.resolve(null);
    var dot = token.lastIndexOf('.');
    if (dot < 1) return Promise.resolve(null);
    var data = token.slice(0, dot);
    var sig = token.slice(dot + 1);
    return hmacSig16(ADMIN_PASSWORD, data).then(function (expected) {
      if (sig !== expected) return null;
      try {
        var payload = JSON.parse(base64UrlToString(data));
        if (!payload.u || !payload.c) return null;
        return {
          id: data + '.' + sig,
          url: payload.u,
          country: payload.c,
          label: payload.l || '',
          createdAt: payload.t ? new Date(payload.t).toISOString() : '',
        };
      } catch (e) {
        return null;
      }
    });
  }

  function checkPassword(password) {
    return password === ADMIN_PASSWORD;
  }

  function fetchVisitorCountry() {
    return fetch('https://ipwho.is/', { signal: AbortSignal.timeout(5000) })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data && data.success && data.country_code) {
          return String(data.country_code).toUpperCase();
        }
        return '';
      })
      .catch(function () {
        return '';
      });
  }

  function verifyLinkClient(opts) {
    return parseLinkToken(opts.linkId).then(function (link) {
      if (!link) return { ok: false, reason: 'not_found' };
      if (opts.botUa) return { ok: false, reason: 'bot' };
      if (opts.webdriver) return { ok: false, reason: 'automation' };
      if (opts.hp) return { ok: false, reason: 'honeypot' };
      if (!opts.elapsedMs || opts.elapsedMs < MIN_WAIT_MS) return { ok: false, reason: 'too_fast' };
      return fetchVisitorCountry().then(function (country) {
        if (country && country !== link.country.toUpperCase()) {
          return {
            ok: false,
            reason: 'country',
            country: country,
            expected: link.country.toUpperCase(),
          };
        }
        return { ok: true, redirect: link.url };
      });
    });
  }

  global.GeoGate = {
    ADMIN_PASSWORD: ADMIN_PASSWORD,
    COUNTRIES: COUNTRIES,
    GATE_LOCALES: GATE_LOCALES,
    MIN_WAIT_MS: MIN_WAIT_MS,
    isStaticHost: isStaticHost,
    siteBasePath: siteBasePath,
    gateUrl: gateUrl,
    getGateLocale: getGateLocale,
    checkPassword: checkPassword,
    createLinkToken: createLinkToken,
    parseLinkToken: parseLinkToken,
    verifyLinkClient: verifyLinkClient,
  };
})(typeof window !== 'undefined' ? window : globalThis);
