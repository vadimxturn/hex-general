import React, { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { quiz, PHONE_DISPLAY, PHONE_TEL, PRIVACY_URL, TERMS_URL } from '../content.js';

const TOTAL = 5;

function getUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    return Object.fromEntries(keys.filter((k) => p.get(k)).map((k) => [k, p.get(k)]));
  } catch {
    return {};
  }
}

function formatPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function QuoteModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ projectType: '', timeline: '', zip: '', name: '', phone: '', email: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setError('');
      if (step === 6) {
        setStep(1);
        setData({ projectType: '', timeline: '', zip: '', name: '', phone: '', email: '' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const next = () => { setError(''); setStep((s) => s + 1); };
  const back = () => { setError(''); setStep((s) => Math.max(1, s - 1)); };

  const pick = (k, v) => { set(k, v); setTimeout(next, 150); };

  const submitZip = (e) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(data.zip)) return setError('Please enter a 5-digit zip code.');
    next();
  };
  const submitName = (e) => {
    e.preventDefault();
    if (data.name.trim().length < 2) return setError('Please enter your name.');
    next();
  };
  const submitContact = async (e) => {
    e.preventDefault();
    if (data.phone.replace(/\D/g, '').length !== 10) return setError('Please enter a 10-digit phone number.');
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) return setError('Please check your email address.');
    setSending(true);
    const payload = { ...data, source: 'Bathroom landing page', page: window.location.href, submittedAt: new Date().toISOString(), ...getUtm() };
    try {
      await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch {
      /* still show thank-you; lead is logged server-side when possible */
    }
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead_submit', projectType: data.projectType });
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    } catch { /* ignore */ }
    setSending(false);
    setStep(6);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="quote-title" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal__card">
        <div className="modal__top">
          {step > 1 && step < 6 ? (
            <button type="button" className="modal__back" onClick={back}><Icon name="chevronLeft" size={18} stroke={2.5} />Back</button>
          ) : <span />}
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}><Icon name="x" size={22} /></button>
        </div>

        {step < 6 && (
          <>
            <div className="progress"><span style={{ width: `${(step / TOTAL) * 100}%` }} /></div>
            <p className="modal__step">Step {step} of {TOTAL}</p>
          </>
        )}

        {step === 1 && (
          <div>
            <h2 id="quote-title" className="modal__title">What kind of bathroom project are you planning?</h2>
            <p className="modal__sub">Pick one to continue. Your free estimate starts here.</p>
            <div className="tile-grid">
              {quiz.projectTypes.map((p) => (
                <button type="button" key={p.value} className={`icon-tile${data.projectType === p.value ? ' icon-tile--active' : ''}`} onClick={() => pick('projectType', p.value)}>
                  <span className="icon-tile__icon"><Icon name={p.icon} size={30} stroke={1.8} /></span>
                  {p.value}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 id="quote-title" className="modal__title">When would you like to start?</h2>
            <p className="modal__sub">Pick one to continue.</p>
            <div className="option-list">
              {quiz.timelines.map((t) => (
                <button type="button" key={t} className={`option${data.timeline === t ? ' option--active' : ''}`} onClick={() => pick('timeline', t)}>
                  <span className="option__radio" />{t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={submitZip} noValidate>
            <h2 id="quote-title" className="modal__title">What is your zip code?</h2>
            <p className="modal__sub">So we can confirm you are in our Sacramento-area service area.</p>
            <label className="field">
              <span>Zip code <em>(required)</em></span>
              <input autoFocus inputMode="numeric" autoComplete="postal-code" placeholder="e.g. 95660" maxLength={5} value={data.zip} onChange={(e) => set('zip', e.target.value.replace(/\D/g, ''))} />
            </label>
            {error && <p className="field-error">{error}</p>}
            <button type="submit" className="btn-cta btn-cta--full">Continue<Icon name="arrowRight" size={20} stroke={2.5} /></button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={submitName} noValidate>
            <h2 id="quote-title" className="modal__title">What is your name?</h2>
            <p className="modal__sub">So we know who we are talking to.</p>
            <label className="field">
              <span>Full name <em>(required)</em></span>
              <input autoFocus autoComplete="name" placeholder="First and last name" value={data.name} onChange={(e) => set('name', e.target.value)} />
            </label>
            {error && <p className="field-error">{error}</p>}
            <button type="submit" className="btn-cta btn-cta--full">Continue<Icon name="arrowRight" size={20} stroke={2.5} /></button>
          </form>
        )}

        {step === 5 && (
          <form onSubmit={submitContact} noValidate>
            <h2 id="quote-title" className="modal__title">How can we reach you?</h2>
            <p className="modal__sub">We will contact you to set up your free consultation.</p>
            <label className="field">
              <span>Phone <em>(required)</em></span>
              <input autoFocus type="tel" inputMode="tel" autoComplete="tel" placeholder="(916) 000-0000" value={data.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" autoComplete="email" placeholder="you@email.com" value={data.email} onChange={(e) => set('email', e.target.value)} />
            </label>
            {error && <p className="field-error">{error}</p>}
            <button type="submit" className="btn-cta btn-cta--full" disabled={sending}>
              {sending ? 'Sending…' : 'Get My Free Quote'}<Icon name="arrowRight" size={20} stroke={2.5} />
            </button>
            <p className="modal__legal">
              <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy Policy</a>
              <span> | </span>
              <a href={TERMS_URL} target="_blank" rel="noreferrer">Terms of Service</a>
            </p>
          </form>
        )}

        {step === 6 && (
          <div className="modal__done">
            <span className="done-check"><Icon name="check" size={34} stroke={3} /></span>
            <p className="modal__step">All done</p>
            <h2 id="quote-title" className="modal__title">Thanks! Your request is in.</h2>
            <p className="modal__sub">A member of the Hex team will reach out to set up your free consultation.</p>
            <a className="modal__call" href={PHONE_TEL}>Want to talk now? Call {PHONE_DISPLAY}</a>
            <button type="button" className="btn-outline" onClick={onClose}>Back to the page</button>
          </div>
        )}
      </div>
    </div>
  );
}
