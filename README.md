# HEX General Contractors — Bathroom Landing Page

React (Vite) landing page for HEX General Contractors bathroom remodeling ads, built from the Figma "Bathroom Landing Page v7 (redesign)".

## Stack

- React 18 + Vite
- Plain CSS (`src/styles.css`)
- Vercel serverless function for leads (`api/lead.js`)

## Editing

- **All copy, phone number and image paths:** `src/content.js`
- **Sections:** `src/components/Sections.jsx`
- **Quote popup (5 steps + thank you):** `src/components/QuoteModal.jsx`
- **Photos:** `public/images/` (file names are listed in `src/content.js`)

## Leads

The quote popup POSTs to `/api/lead`, which forwards the lead to `LEAD_WEBHOOK_URL`
when that variable is set, and otherwise to the GoHighLevel webhook in `api/lead.js`.

Payload includes the form fields plus `first_name`, `last_name`, `full_name`, `phone` (digits),
`phone_e164`, `postal_code`, `project_type`, and `submitted_at`, along with any `utm_*` fields.

Tracking: a `lead_submit` event is pushed to `window.dataLayer`, and `fbq('track','Lead')`
fires if the Meta Pixel is on the page.

## Local development

```bash
npm install
npm run dev
```

## Deploy

Pushes to `main` deploy automatically on Vercel.
