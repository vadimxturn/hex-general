// Last-touch ad parameters, kept for 90 days so a quote still has them
// after the landing URL loses its query string.

const STORAGE_KEY = 'hexAttribution';
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export const CLICK_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
  'ttclid',
];

function clickParams(search) {
  const params = new URLSearchParams(search || '');
  const found = {};
  CLICK_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) found[key] = value;
  });
  return found;
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.expires_at !== 'number' || Date.now() > data.expires_at) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeStored(record) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* private mode or a full store */
  }
}

export function captureAttribution() {
  if (typeof window === 'undefined') return null;
  const incoming = clickParams(window.location.search);
  const hasIncoming = Object.keys(incoming).length > 0;
  const existing = readStored();
  const now = Date.now();

  if (!existing) {
    const record = {
      ...incoming,
      landing_page: window.location.href,
      referrer: document.referrer || '',
      first_seen_at: new Date(now).toISOString(),
      expires_at: now + NINETY_DAYS_MS,
    };
    writeStored(record);
    return record;
  }

  if (!hasIncoming) return existing;

  const record = {
    ...incoming,
    landing_page: existing.landing_page || window.location.href,
    referrer: existing.referrer || '',
    first_seen_at: existing.first_seen_at || new Date(now).toISOString(),
    expires_at: now + NINETY_DAYS_MS,
  };
  writeStored(record);
  return record;
}

function cookie(name) {
  if (typeof document === 'undefined' || !document.cookie) return '';
  const prefix = `${name}=`;
  const part = document.cookie.split('; ').find((item) => item.startsWith(prefix));
  if (!part) return '';
  try {
    return decodeURIComponent(part.slice(prefix.length));
  } catch {
    return part.slice(prefix.length);
  }
}

// Stored values, then whatever is still on the URL (the URL wins).
// _fbp / _fbc are read now, not from storage.
export function getAttribution() {
  const stored = readStored() || {};
  const fromUrl = typeof window === 'undefined' ? {} : clickParams(window.location.search);
  const fields = {};
  CLICK_KEYS.forEach((key) => {
    fields[key] = fromUrl[key] || stored[key] || '';
  });
  fields.landing_page = stored.landing_page || (typeof window !== 'undefined' ? window.location.href : '');
  fields.referrer = stored.referrer || '';
  fields.fbp = cookie('_fbp');
  const fbc = cookie('_fbc');
  fields.fbc = fbc || (fields.fbclid ? `fb.1.${Date.now()}.${fields.fbclid}` : '');
  return fields;
}
