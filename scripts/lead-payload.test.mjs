import assert from 'node:assert/strict';
import { leadPayload } from '../api/lead.js';

const tracked = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid',
  'fbp', 'fbc', 'landing_page', 'referrer',
];

const empty = leadPayload({
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '(916) 555-0100',
  email: 'jane@example.com',
  zip: '95660',
  projectType: 'Full bathroom remodel',
  timeline: 'ASAP',
  source: 'Bathroom landing page',
  page: 'https://hex.example/',
  submittedAt: '2026-11-19T00:00:00.000Z',
});

assert.equal(empty.first_name, 'Jane');
assert.equal(empty.last_name, 'Doe');
assert.equal(empty.full_name, 'Jane Doe');
assert.equal(empty.phone, '9165550100');
assert.equal(empty.phone_e164, '+19165550100');
assert.equal(empty.postal_code, '95660');
assert.equal(empty.project_type, 'Full bathroom remodel');
assert.equal(empty.timeline, 'ASAP');
assert.equal(empty.source, 'Bathroom landing page');
assert.equal(empty.submitted_at, '2026-11-19T00:00:00.000Z');
assert.equal(empty.utm, undefined);
tracked.forEach((key) => assert.equal(empty[key], '', `${key} should be an empty string`));

const filled = leadPayload({
  first_name: 'Ada',
  last_name: 'Lovelace',
  phone: '9165550199',
  utm_source: 'facebook',
  utm_medium: 'paid',
  utm_campaign: 'test-campaign',
  utm_content: 'ad1',
  utm_term: 'bath',
  utm_id: '99',
  fbclid: 'TEST123',
  gclid: 'g-1',
  gbraid: 'gb',
  wbraid: 'wb',
  msclkid: 'ms',
  ttclid: 'tt',
  fbp: 'fb.1.1.aaa',
  fbc: 'fb.1.1.TEST123',
  landing_page: 'https://hex.example/?utm_source=facebook',
  referrer: 'https://facebook.com/',
});

assert.equal(filled.utm_source, 'facebook');
assert.equal(filled.utm_medium, 'paid');
assert.equal(filled.utm_campaign, 'test-campaign');
assert.equal(filled.utm_content, 'ad1');
assert.equal(filled.utm_term, 'bath');
assert.equal(filled.utm_id, '99');
assert.equal(filled.fbclid, 'TEST123');
assert.equal(filled.gclid, 'g-1');
assert.equal(filled.gbraid, 'gb');
assert.equal(filled.wbraid, 'wb');
assert.equal(filled.msclkid, 'ms');
assert.equal(filled.ttclid, 'tt');
assert.equal(filled.fbp, 'fb.1.1.aaa');
assert.equal(filled.fbc, 'fb.1.1.TEST123');
assert.equal(filled.landing_page, 'https://hex.example/?utm_source=facebook');
assert.equal(filled.referrer, 'https://facebook.com/');
assert.equal(filled.utm, undefined);
assert.equal(filled.phone, '9165550199');

const store = new Map();
globalThis.localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};
globalThis.document = { referrer: 'https://facebook.com/', cookie: '' };
globalThis.window = {
  location: {
    href: 'http://127.0.0.1:4173/?utm_source=facebook&utm_medium=paid&utm_campaign=test-campaign&utm_content=ad1&utm_term=bath&fbclid=TEST123',
    search: '?utm_source=facebook&utm_medium=paid&utm_campaign=test-campaign&utm_content=ad1&utm_term=bath&fbclid=TEST123',
  },
};

const { captureAttribution, getAttribution } = await import('../src/lib/attribution.js');
captureAttribution();
window.location.href = 'http://127.0.0.1:4173/';
window.location.search = '';
const kept = getAttribution();
assert.equal(kept.utm_source, 'facebook');
assert.equal(kept.utm_campaign, 'test-campaign');
assert.equal(kept.fbclid, 'TEST123');
assert.match(kept.fbc, /^fb\.1\.\d+\.TEST123$/);
assert.equal(kept.fbp, '');
assert.equal(kept.landing_page, 'http://127.0.0.1:4173/?utm_source=facebook&utm_medium=paid&utm_campaign=test-campaign&utm_content=ad1&utm_term=bath&fbclid=TEST123');

document.cookie = '_fbp=fb.1.1.browser; _fbc=fb.1.9.FROMCOOKIE';
window.location.search = '?fbclid=OTHER';
const fromCookie = getAttribution();
assert.equal(fromCookie.fbclid, 'OTHER');
assert.equal(fromCookie.fbc, 'fb.1.9.FROMCOOKIE');
assert.equal(fromCookie.fbp, 'fb.1.1.browser');
assert.equal(fromCookie.utm_source, 'facebook');

window.location.href = 'http://127.0.0.1:4173/?utm_source=newsletter&gclid=NEWCLICK';
window.location.search = '?utm_source=newsletter&gclid=NEWCLICK';
captureAttribution();
window.location.search = '';
const touched = getAttribution();
assert.equal(touched.utm_source, 'newsletter');
assert.equal(touched.gclid, 'NEWCLICK');
assert.equal(touched.fbclid, '');
assert.equal(touched.utm_campaign, '');
assert.equal(touched.landing_page, 'http://127.0.0.1:4173/?utm_source=facebook&utm_medium=paid&utm_campaign=test-campaign&utm_content=ad1&utm_term=bath&fbclid=TEST123');

console.log('leadPayload attribution keys ok');
