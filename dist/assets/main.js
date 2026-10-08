const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation?.addEventListener('click', event => {
  if (event.target.closest('a')) {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    toggle.focus();
  }
});
function safePagePath() {
  const path = location.pathname;
  return /^\/(?:[a-z0-9-]+\/?)?$/.test(path) ? path : '/';
}
function serviceSlug(path) {
  const slug = path.replace(/^\/|\/$/g, '');
  return /^[a-z0-9-]+$/.test(slug) ? slug : '';
}
function buttonLocation(link) {
  const places = [['.header', 'header'], ['.site-footer', 'footer'], ['.wa-float', 'float'], ['.hero', 'hero'], ['#contacto', 'contact'], ['#equipo', 'team'], ['#trabajos', 'field'], ['.start', 'start'], ['.more', 'topics'], ['.not-found', 'not-found']];
  for (const [selector, name] of places) if (link.closest(selector)) return name;
  return 'page';
}
function trackLead(name, link, contactType, controls = {}) {
  const pagePath = safePagePath();
  window.gtag('event', name, {
    page_path: pagePath,
    page_title: document.title,
    service_slug: serviceSlug(pagePath),
    button_location: buttonLocation(link),
    contact_type: contactType,
    ...controls
  });
}
document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  const link = target?.closest('a, [data-contact="whatsapp"], [data-lead="quote"]');
  if (!link || typeof window.gtag !== 'function') return;
  const href = link.getAttribute('href') || '';
  let whatsapp = link.dataset.contact === 'whatsapp';
  try { whatsapp ||= new URL(href, location.href).hostname === 'wa.me'; } catch {}
  const phone = href.startsWith('tel:');
  const quote = !!target.closest('[data-lead="quote"]');
  const names = [];
  if (whatsapp) {
    document.dispatchEvent(new CustomEvent('conplanos:contact', { detail: { channel: 'whatsapp', page: location.pathname } }));
    names.push('click_whatsapp');
  } else if (phone) {
    names.push('click_phone');
  }
  if (quote) names.push('quote_request');
  if (!names.length) return;
  const contactType = whatsapp ? 'whatsapp' : phone ? 'phone' : 'other';
  // Keep new tabs and modified clicks native. Delay only same-tab contact navigation.
  const wait = href && link.matches('a') && (whatsapp || phone) &&
    (!link.target || link.target === '_self') && !link.hasAttribute('download') &&
    !event.defaultPrevented && event.button === 0 &&
    !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
  let controls = {};
  if (wait) {
    event.preventDefault();
    let remaining = names.length;
    let navigated = false;
    const navigate = () => {
      if (navigated) return;
      navigated = true;
      window.location.assign(href);
    };
    // The fallback also covers an unavailable or blocked Analytics network request.
    const timer = window.setTimeout(navigate, 1000);
    controls = { event_timeout: 1000, event_callback: () => {
      if (--remaining === 0) { window.clearTimeout(timer); navigate(); }
    } };
  }
  for (const name of names) trackLead(name, link, contactType, controls);
}, { capture: true });

