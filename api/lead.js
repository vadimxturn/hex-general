// Vercel serverless function: receives quote-form leads and forwards them
// to a CRM webhook (GoHighLevel inbound webhook).
// Quote-form leads use LEAD_WEBHOOK_URL, or DEFAULT_WEBHOOK when that is unset.
// Bathroom Designer leads (source "Bathroom Designer") use DESIGNER_WEBHOOK_URL,
// or DEFAULT_DESIGNER_WEBHOOK when that is unset.

const DEFAULT_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/1sTgLh3ok877p3MU8Rzl/webhook-trigger/30c81703-1df3-48b7-befb-252eedbf2f59';
const DEFAULT_DESIGNER_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/1sTgLh3ok877p3MU8Rzl/webhook-trigger/91e64c89-5f0b-4abf-9053-9f2f2ed77034';

export function webhookFor(payload) {
  if (payload && payload.source === 'Bathroom Designer') {
    return process.env.DESIGNER_WEBHOOK_URL || DEFAULT_DESIGNER_WEBHOOK;
  }
  return process.env.LEAD_WEBHOOK_URL || DEFAULT_WEBHOOK;
}

function text(value) {
  return String(value ?? '').trim();
}

export function leadPayload(lead) {
  const first = text(lead.first_name || lead.firstName);
  const last = text(lead.last_name || lead.lastName);
  const phone = text(lead.phone).replace(/\D/g, '');
  const trackedKeys = [
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
    'fbp',
    'fbc',
    'landing_page',
    'referrer',
  ];
  const tracked = {};
  trackedKeys.forEach((key) => {
    tracked[key] = text(lead[key]);
  });

  return {
    ...lead,
    first_name: first,
    last_name: last,
    full_name: text(lead.full_name || lead.name) || `${first} ${last}`.trim(),
    phone,
    phone_e164: phone ? `+1${phone}` : '',
    email: text(lead.email),
    postal_code: text(lead.postal_code || lead.zip),
    project_type: text(lead.project_type || lead.projectType),
    timeline: text(lead.timeline),
    source: text(lead.source),
    page: text(lead.page),
    submitted_at: text(lead.submitted_at || lead.submittedAt),
    ...tracked,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let lead = req.body;
  if (typeof lead === 'string') {
    try { lead = JSON.parse(lead); } catch { lead = {}; }
  }
  lead = lead || {};

  const payload = leadPayload(lead);
  if (payload.phone.length !== 10 || payload.first_name.length < 2 || payload.last_name.length < 2) {
    return res.status(400).json({ ok: false, error: 'First name, last name, and a 10-digit phone are required' });
  }

  const webhook = webhookFor(payload);

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) console.error('[lead] webhook responded', r.status);
    return res.status(200).json({ ok: true, forwarded: r.ok });
  } catch (err) {
    console.error('[lead] webhook error', err);
    return res.status(200).json({ ok: true, forwarded: false });
  }
}
