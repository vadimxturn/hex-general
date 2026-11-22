// Posts a Bathroom Designer lead through the real /api/lead handler to a local
// mock webhook. Never calls GoHighLevel.
// Needs Chrome and puppeteer-core (npm install puppeteer-core in /tmp/puppeteer,
// or in this repo). Not part of `npm run build`.
import assert from 'node:assert/strict';
import http from 'node:http';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import handler, { leadPayload } from '../api/lead.js';

const puppeteerPkg = ['/tmp/puppeteer/package.json', new URL('../package.json', import.meta.url).pathname]
  .find((path) => existsSync(path));
const require = createRequire(puppeteerPkg);
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function fakeRes() {
  const res = {
    statusCode: 200,
    body: null,
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
  return res;
}

const single = leadPayload({
  first_name: 'Cher',
  last_name: 'Cher',
  full_name: 'Cher',
  phone: '9165550100',
  email: 'cher@example.com',
});
assert.equal(single.full_name, 'Cher');
assert.equal(single.last_name, 'Cher');
assert.equal(single.phone_e164, '+19165550100');

const { readFileSync } = await import('node:fs');
const script = readFileSync(new URL('../public/bathroom-designer.js', import.meta.url), 'utf8');
const b64 = script.match(/var b64 = "([^"]+)"/)[1];
const html = Buffer.from(b64, 'base64').toString('utf8');

const browserLeads = [];
const forwarded = [];
const blocked = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  const target = String(url);
  if (!target.startsWith('http://127.0.0.1:') && !target.startsWith('http://localhost:')) {
    blocked.push(target);
    throw new Error(`Refusing non-local webhook: ${target}`);
  }
  return realFetch(url, opts);
};

// The designer page and /api/lead share this server. The handler's webhook
// is a second server so the POST is not stuck waiting on itself.
const pageServer = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
    return;
  }
  if (req.method === 'POST' && url.pathname === '/api/lead') {
    browserLeads.push(JSON.parse(await readBody(req) || '{}'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
    return;
  }
  res.writeHead(404);
  res.end('not found');
});

const mockWebhook = http.createServer(async (req, res) => {
  forwarded.push(JSON.parse(await readBody(req) || '{}'));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('{"ok":true}');
});

await new Promise((resolve) => pageServer.listen(0, '127.0.0.1', resolve));
await new Promise((resolve) => mockWebhook.listen(0, '127.0.0.1', resolve));
const { port } = pageServer.address();
process.env.LEAD_WEBHOOK_URL = `http://127.0.0.1:${mockWebhook.address().port}/hook`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1400 });
  const leadUrl = `http://localhost:${port}/?utm_source=newsletter&utm_medium=email&utm_campaign=bath-designer&utm_content=ad1&utm_term=shower&fbclid=TEST123`;
  await page.goto(leadUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('#next', { timeout: 15000 });
  await page.click('[data-look="green"]');
  await page.click('[data-set="layout"][data-val="spa"]');
  await page.click('[data-mode="evening"]');
  for (let i = 0; i < 8; i += 1) await page.click('#next');
  await page.waitForSelector('#quoteForm');
  await page.type('#fName', 'Test Lead');
  await page.type('#fPhone', '9165550100');
  await page.type('#fEmail', 'test.lead@example.com');
  await page.type('#fZip', '95660');
  await page.select('#fWhen', 'As soon as possible');
  await page.type('#fNotes', 'Corner bath, keep the window.');
  await page.$eval('#sendBtn', (btn) => btn.scrollIntoView({ block: 'center' }));
  await page.click('#sendBtn');
  await page.waitForFunction(
    () => document.body.innerText.includes('Your design is saved'),
    { timeout: 15000 },
  );
} finally {
  await browser.close();
  pageServer.close();
}

assert.equal(browserLeads.length, 1, 'designer should POST once to /api/lead');
const apiResult = fakeRes();
await handler({ method: 'POST', body: browserLeads[0] }, apiResult);
mockWebhook.close();
globalThis.fetch = realFetch;
assert.equal(apiResult.statusCode, 200);
assert.equal(apiResult.body.ok, true);
assert.equal(apiResult.body.forwarded, true);

assert.equal(blocked.length, 0, `blocked calls: ${blocked.join(', ')}`);
assert.equal(forwarded.length, 1, 'mock webhook should receive one lead');
const lead = forwarded[0];

const expectedNotes = [
  'Layout: Freestanding Tub',
  'Vanity size: Double Vanity',
  'Vanity style: Shaker',
  'Cabinet color: Forest Green',
  'Vanity top: Nero Marquina',
  'Sink: Undermount',
  'Wall tile: Subway',
  'Wall tile color: Cream',
  'Vanity wall: Wainscot',
  'Tub finish: Sage',
  'Flooring: Patterned Cement',
  'Mirror: Arched',
  'Lighting: Wall Sconces',
  'Metal finish: Aged Bronze',
  'Faucet: Wall-Mount',
  'Drawer pulls: Cup Pulls',
  'Look: Moody Green',
  'Lighting mode: Evening',
  'Project notes: Corner bath, keep the window.',
].join('\n');

assert.equal(lead.notes, expectedNotes);
assert.equal(lead.bath_design_summary, expectedNotes.split('\n').slice(0, -1).join('\n'));
assert.equal(lead.first_name, 'Test');
assert.equal(lead.last_name, 'Lead');
assert.equal(lead.full_name, 'Test Lead');
assert.equal(lead.phone, '9165550100');
assert.equal(lead.phone_e164, '+19165550100');
assert.equal(lead.email, 'test.lead@example.com');
assert.equal(lead.postal_code, '95660');
assert.equal(lead.zip, '95660');
assert.equal(lead.timeline, 'As soon as possible');
assert.equal(lead.project_notes, 'Corner bath, keep the window.');
assert.equal(lead.layout, 'Freestanding Tub');
assert.equal(lead.vanity_size, 'Double Vanity');
assert.equal(lead.vanity_style, 'Shaker');
assert.equal(lead.cabinet_color, 'Forest Green');
assert.equal(lead.vanity_top, 'Nero Marquina');
assert.equal(lead.sink, 'Undermount');
assert.equal(lead.wall_tile, 'Subway');
assert.equal(lead.wall_tile_color, 'Cream');
assert.equal(lead.vanity_wall, 'Wainscot');
assert.equal(lead.tub_finish, 'Sage');
assert.equal(lead.flooring, 'Patterned Cement');
assert.equal(lead.mirror, 'Arched');
assert.equal(lead.lighting, 'Wall Sconces');
assert.equal(lead.metal_finish, 'Aged Bronze');
assert.equal(lead.faucet, 'Wall-Mount');
assert.equal(lead.drawer_pulls, 'Cup Pulls');
assert.equal(lead.look, 'Moody Green');
assert.equal(lead.lighting_mode, 'Evening');
assert.equal(lead.shower_glass, undefined);
assert.equal(lead.source, 'Bathroom Designer');
assert.equal(lead.project_type, 'Bathroom remodel (designer)');
assert.equal(lead.utm_source, 'newsletter');
assert.equal(lead.utm_medium, 'email');
assert.equal(lead.utm_campaign, 'bath-designer');
assert.equal(lead.utm_content, 'ad1');
assert.equal(lead.utm_term, 'shower');
assert.equal(lead.utm_id, '');
assert.equal(lead.fbclid, 'TEST123');
assert.match(lead.fbc, /^fb\.1\.\d+\.TEST123$/);
assert.equal(lead.page, lead.page_url);
assert.match(lead.page, /utm_source=newsletter/);
assert.match(lead.page, /fbclid=TEST123/);
const selections = JSON.parse(lead.bath_selections);
assert.equal(selections.layout, 'spa');
assert.equal(selections.mode, 'evening');
assert.equal(selections.look, 'Moody Green');
assert.equal(selections.cabColor, 'forest');

const { writeFileSync } = await import('node:fs');
writeFileSync('/tmp/designer-forwarded.json', `${JSON.stringify(lead, null, 2)}\n`);
console.log('designer lead forwarded to local mock');
console.log(lead.notes);
