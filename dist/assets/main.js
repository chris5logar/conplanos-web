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
function trackLead(name, link, contactType) {
  if (typeof window.gtag !== 'function') return;
  const pagePath = safePagePath();
  window.gtag('event', name, {
    page_path: pagePath,
    page_title: document.title,
    service_slug: serviceSlug(pagePath),
    button_location: buttonLocation(link),
    contact_type: contactType
  });
}
document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href') || '';
  if (link.dataset.contact === 'whatsapp' || href.includes('wa.me/')) {
    document.dispatchEvent(new CustomEvent('conplanos:contact', { detail: { channel: 'whatsapp', page: location.pathname } }));
    trackLead('click_whatsapp', link, 'whatsapp');
    if (link.dataset.lead === 'quote') trackLead('quote_request', link, 'whatsapp');
  } else if (href.startsWith('tel:')) {
    trackLead('click_phone', link, 'phone');
  }
});

