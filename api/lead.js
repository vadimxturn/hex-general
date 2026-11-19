// Vercel serverless function: receives quote-form leads and forwards them
// to a CRM webhook (for example a GoHighLevel inbound webhook).
// Set LEAD_WEBHOOK_URL in Vercel > Project > Settings > Environment Variables.

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

  const phoneDigits = String(lead.phone || '').replace(/\D/g, '');
  if (phoneDigits.length !== 10 || !lead.name) {
    return res.status(400).json({ ok: false, error: 'Name and a 10-digit phone are required' });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.log('[lead] LEAD_WEBHOOK_URL not set. Lead received:', JSON.stringify(lead));
    return res.status(200).json({ ok: true, forwarded: false });
  }

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!r.ok) console.error('[lead] webhook responded', r.status);
    return res.status(200).json({ ok: true, forwarded: r.ok });
  } catch (err) {
    console.error('[lead] webhook error', err);
    return res.status(200).json({ ok: true, forwarded: false });
  }
}
