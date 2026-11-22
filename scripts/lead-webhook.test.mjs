// Routes quote-form and Bathroom Designer leads to separate local mocks.
// Never calls GoHighLevel.
import assert from 'node:assert/strict';
import http from 'node:http';
import handler, { webhookFor } from '../api/lead.js';

const QUOTE_DEFAULT = 'https://services.leadconnectorhq.com/hooks/1sTgLh3ok877p3MU8Rzl/webhook-trigger/30c81703-1df3-48b7-befb-252eedbf2f59';
const DESIGNER_DEFAULT = 'https://services.leadconnectorhq.com/hooks/1sTgLh3ok877p3MU8Rzl/webhook-trigger/91e64c89-5f0b-4abf-9053-9f2f2ed77034';

const saved = {
  LEAD_WEBHOOK_URL: process.env.LEAD_WEBHOOK_URL,
  DESIGNER_WEBHOOK_URL: process.env.DESIGNER_WEBHOOK_URL,
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function listen(server) {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));
}

function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

const quoteHits = [];
const designerHits = [];
const quoteServer = http.createServer(async (req, res) => {
  quoteHits.push(JSON.parse(await readBody(req)));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('{"ok":true}');
});
const designerServer = http.createServer(async (req, res) => {
  designerHits.push(JSON.parse(await readBody(req)));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('{"ok":true}');
});

const quotePort = await listen(quoteServer);
const designerPort = await listen(designerServer);
const quoteUrl = `http://127.0.0.1:${quotePort}/quote`;
const designerUrl = `http://127.0.0.1:${designerPort}/designer`;

const realFetch = globalThis.fetch;
const blocked = [];
globalThis.fetch = async (url, opts) => {
  const target = String(url);
  if (!target.startsWith('http://127.0.0.1:') && !target.startsWith('http://localhost:')) {
    blocked.push(target);
    throw new Error(`Refusing non-local webhook: ${target}`);
  }
  return realFetch(url, opts);
};

try {
  delete process.env.LEAD_WEBHOOK_URL;
  delete process.env.DESIGNER_WEBHOOK_URL;
  assert.equal(webhookFor({ source: 'Bathroom landing page' }), QUOTE_DEFAULT);
  assert.equal(webhookFor({ source: 'Bathroom Designer' }), DESIGNER_DEFAULT);
  assert.equal(webhookFor({ source: '' }), QUOTE_DEFAULT);

  process.env.LEAD_WEBHOOK_URL = quoteUrl;
  process.env.DESIGNER_WEBHOOK_URL = designerUrl;
  assert.equal(webhookFor({ source: 'Bathroom Designer' }), designerUrl);
  assert.equal(webhookFor({ source: 'Bathroom landing page' }), quoteUrl);
  // A designer lead must not follow the quote-form override.
  delete process.env.DESIGNER_WEBHOOK_URL;
  assert.equal(webhookFor({ source: 'Bathroom Designer' }), DESIGNER_DEFAULT);
  process.env.DESIGNER_WEBHOOK_URL = designerUrl;

  const quote = fakeRes();
  await handler({
    method: 'POST',
    body: {
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '(916) 555-0100',
      email: 'jane@example.com',
      zip: '95660',
      projectType: 'Full bathroom remodel',
      timeline: 'ASAP',
      source: 'Bathroom landing page',
      page: 'https://hexremodel.com/',
      submittedAt: '2026-11-22T00:00:00.000Z',
    },
  }, quote);

  const designer = fakeRes();
  await handler({
    method: 'POST',
    body: {
      first_name: 'Test',
      last_name: 'Lead',
      full_name: 'Test Lead',
      name: 'Test Lead',
      phone: '9165550101',
      email: 'test.lead@example.com',
      postal_code: '95814',
      zip: '95814',
      timeline: 'Just exploring ideas',
      project_notes: 'Keep the tub.',
      notes: 'Layout: Walk-in Shower\nLook: Custom',
      layout: 'Walk-in Shower',
      look: 'Custom',
      lighting_mode: 'Day',
      source: 'Bathroom Designer',
      project_type: 'Bathroom remodel (designer)',
      page: 'https://hexremodel.com/',
      page_url: 'https://hexremodel.com/',
      submitted_at: '2026-11-22T00:00:00.000Z',
    },
  }, designer);

  assert.equal(blocked.length, 0);
  assert.equal(quote.statusCode, 200);
  assert.equal(quote.body.forwarded, true);
  assert.equal(designer.statusCode, 200);
  assert.equal(designer.body.forwarded, true);
  assert.equal(quoteHits.length, 1);
  assert.equal(designerHits.length, 1);
  assert.equal(quoteHits[0].source, 'Bathroom landing page');
  assert.equal(quoteHits[0].first_name, 'Jane');
  assert.equal(quoteHits[0].last_name, 'Doe');
  assert.equal(quoteHits[0].phone, '9165550100');
  assert.equal(quoteHits[0].project_type, 'Full bathroom remodel');
  assert.equal(quoteHits[0].layout, undefined);
  assert.equal(designerHits[0].source, 'Bathroom Designer');
  assert.equal(designerHits[0].full_name, 'Test Lead');
  assert.equal(designerHits[0].notes, 'Layout: Walk-in Shower\nLook: Custom');
  assert.equal(designerHits[0].layout, 'Walk-in Shower');
  assert.equal(designerHits[0].look, 'Custom');
  assert.equal(designerHits[0].lighting_mode, 'Day');
  assert.equal(designerHits[0].project_notes, 'Keep the tub.');
  console.log('quote form -> local quote mock');
  console.log('designer form -> local designer mock');
} finally {
  globalThis.fetch = realFetch;
  quoteServer.close();
  designerServer.close();
  if (saved.LEAD_WEBHOOK_URL === undefined) delete process.env.LEAD_WEBHOOK_URL;
  else process.env.LEAD_WEBHOOK_URL = saved.LEAD_WEBHOOK_URL;
  if (saved.DESIGNER_WEBHOOK_URL === undefined) delete process.env.DESIGNER_WEBHOOK_URL;
  else process.env.DESIGNER_WEBHOOK_URL = saved.DESIGNER_WEBHOOK_URL;
}
