import React, { useEffect, useMemo } from 'react';
import Icon, { Stars } from './Icon.jsx';
import { Photo, Eyebrow, Title } from './ui.jsx';
import { Footer } from './Sections.jsx';
import { IMAGES, PHONE_DISPLAY, PHONE_TEL, bg, thankYou } from '../content.js';

function readLead() {
  try {
    return JSON.parse(sessionStorage.getItem('hexLead') || '{}');
  } catch {
    return {};
  }
}

export default function ThankYou() {
  const lead = useMemo(readLead, []);
  const firstName = (lead.firstName || '').trim();

  useEffect(() => {
    document.title = 'Thank you | HEX General Contractors';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    window.scrollTo(0, 0);
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'thank_you_view', projectType: lead.projectType || '' });
    } catch { /* ignore */ }
    try {
      const raw = sessionStorage.getItem('hexLead');
      if (raw) {
        const stored = JSON.parse(raw);
        if (stored && typeof stored === 'object' && !stored.leadTracked) {
          sessionStorage.setItem('hexLead', JSON.stringify({ ...stored, leadTracked: true }));
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'Lead', { content_name: stored.projectType || '' });
          }
        }
      }
    } catch { /* ignore */ }
    return () => robots.remove();
  }, [lead.projectType]);

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <a href="/" aria-label="Back to home"><Photo eager src={IMAGES.logo} alt={IMAGES.logoAlt} className="site-header__logo" /></a>
          <a className="header-call" href={PHONE_TEL}>
            <span className="header-call__icon"><Icon name="phone" size={18} /></span>
            <span className="header-call__text">
              <small>Questions? Call us</small>
              <strong>{PHONE_DISPLAY}</strong>
            </span>
          </a>
        </div>
      </header>

      <main>
        {/* Confirmation */}
        <section className="ty-hero" style={{ backgroundImage: bg(IMAGES.heroBg) }}>
          <div className="hero__overlay" />
          <div className="container ty-hero__inner">
            <span className="ty-check hero-in" style={{ '--d': '0ms' }}><Icon name="check" size={40} stroke={3} /></span>
            <span className="eyebrow eyebrow--dark hero-in" style={{ '--d': '80ms' }}>Request received</span>
            <h1 className="ty-title hero-in" style={{ '--d': '160ms' }}>
              Thanks{firstName ? `, ${firstName}` : ''}!<br />
              <span className="accent">Your request is in.</span>
            </h1>
            <p className="ty-sub hero-in" style={{ '--d': '240ms' }}>{thankYou.sub}</p>
            {lead.projectType && (
              <p className="ty-summary">
                Project: <strong>{lead.projectType}</strong>
                {lead.timeline ? <> · Start: <strong>{lead.timeline}</strong></> : null}
              </p>
            )}
            <div className="ty-call hero-in" style={{ '--d': '320ms' }}>
              <a className="btn-cta btn-cta--lg" href={PHONE_TEL}>
                <Icon name="phone" size={20} stroke={2.5} />Call {PHONE_DISPLAY}
              </a>
              <span>Want to talk now? We are happy to take your call.</span>
            </div>
          </div>
        </section>

        {/* Next steps */}
        <section className="section section--white">
          <div className="container container--narrow">
            <div className="section-header section-header--center" data-reveal="">
              <Eyebrow>Next steps</Eyebrow>
              <Title text="Here is what " accent="happens next" />
            </div>
            <ol className="ty-steps">
              {thankYou.steps.map((s, i) => (
                <li className={`ty-step${i === 0 ? ' ty-step--done' : ''}`} data-reveal="" style={{ '--d': `${i * 70}ms` }} key={s.title}>
                  <span className="ty-step__num">{i === 0 ? <Icon name="check" size={20} stroke={3} /> : i + 1}</span>
                  <div>
                    <span className="ty-step__tag">{s.tag}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Prep checklist */}
        <section className="section section--gray">
          <div className="container ty-prep">
            <div data-reveal="">
              <Eyebrow>Get ready</Eyebrow>
              <Title text="Make the most of your " accent="free consultation" />
              <p className="section-intro">{thankYou.prepIntro}</p>
            </div>
            <ul className="ty-checklist">
              {thankYou.prep.map((p, i) => (
                <li data-reveal="" style={{ '--d': `${i * 70}ms` }} key={p.title}>
                  <span className="check-circle check-circle--navy"><Icon name="check" size={14} stroke={3} /></span>
                  <span><strong>{p.title}</strong><small>{p.text}</small></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Reassurance */}
        <section className="section section--dark">
          <div className="container">
            <div className="section-header section-header--center" data-reveal="">
              <span className="eyebrow eyebrow--dark">You are in good hands</span>
              <Title text="What our bathroom clients " accent="say" />
            </div>
            <div className="ty-quotes">
              {thankYou.quotes.map((q, i) => (
                <figure className="ty-quote" data-reveal="" style={{ '--d': `${i * 80}ms` }} key={q.name}>
                  <Stars size={18} />
                  <blockquote>“{q.text}”</blockquote>
                  <figcaption>{q.name} · Google review</figcaption>
                </figure>
              ))}
            </div>
            <ul className="ty-badges">
              {thankYou.badges.map((b) => (
                <li key={b}><Icon name="check" size={16} stroke={3} />{b}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recent work */}
        <section className="section section--white">
          <div className="container">
            <div className="section-header section-header--center" data-reveal="">
              <Eyebrow>Recent work</Eyebrow>
              <Title text="Get inspired before " accent="we talk" />
            </div>
            <div className="gallery">
              {thankYou.gallery.map((photo, i) => (
                <div className="gallery__item" data-reveal="" style={{ '--d': `${i * 70}ms` }} key={photo.src}>
                  <Photo src={photo.src} alt={photo.alt} className="gallery__img" />
                </div>
              ))}
            </div>
            <div className="cta-block">
              <a className="btn-outline ty-back" href="/">Back to the main page</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <div className="mobile-bar mobile-bar--single">
        <a className="mobile-bar__quote" href={PHONE_TEL}><Icon name="phone" size={18} /> Call {PHONE_DISPLAY}</a>
      </div>
    </>
  );
}
