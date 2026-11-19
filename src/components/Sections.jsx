import React, { useEffect, useRef, useState } from 'react';
import Icon, { Stars, GoogleG } from './Icon.jsx';
import { CtaButton, Eyebrow, Photo, SectionHeader, Title } from './ui.jsx';
import {
  IMAGES, bg, PHONE_DISPLAY, PHONE_TEL, LICENSE, PRIVACY_URL,
  hero, trustStrip, problems, reviews, band, services, howItWorks, beforeAfter, whyHex, crew, faq, finalCta,
} from '../content.js';

/* ---------- Header ---------- */
export function Header({ onQuote }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Photo eager src={IMAGES.logo} alt={IMAGES.logoAlt} className="site-header__logo" />
        <div className="site-header__actions">
          <a className="header-call" href={PHONE_TEL}>
            <span className="header-call__icon"><Icon name="phone" size={18} /></span>
            <span className="header-call__text">
              <small>Free Consultations</small>
              <strong>{PHONE_DISPLAY}</strong>
            </span>
          </a>
          <button type="button" className="btn-header" onClick={onQuote}>Free Estimate</button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
export function Hero({ onQuote }) {
  return (
    <section className="hero" style={{ backgroundImage: bg(IMAGES.heroBg) }}>
      <div className="hero__overlay" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <div className="hero__rating hero-in" style={{ '--d': '0ms' }}><Stars size={20} /><span>{hero.rating}</span></div>
          <h1 className="hero__title hero-in" style={{ '--d': '80ms' }}>
            {hero.titleTop}<br />
            <span className="accent">{hero.titleAccent}</span><br />
            {hero.titleBottom}
          </h1>
          <ul className="hero__bullets hero-in" style={{ '--d': '160ms' }}>
            {hero.bullets.map((b) => (
              <li key={b}><span className="check-circle"><Icon name="check" size={16} stroke={3} /></span>{b}</li>
            ))}
          </ul>
          <div className="hero__cta-row hero-in" style={{ '--d': '240ms' }}>
            <CtaButton onClick={onQuote} className="btn-cta--lg" />
            <a className="hero__call" href={PHONE_TEL}>or call {PHONE_DISPLAY}</a>
          </div>
          <p className="hero__financing hero-in" style={{ '--d': '320ms' }}>{hero.financing}</p>
          <div className="hero__divider" />
          <ul className="hero__trust hero-in" style={{ '--d': '400ms' }}>
            <li><Icon name="shield" size={22} />{hero.trust[0]}</li>
            <li><Icon name="userCheck" size={22} />{hero.trust[1]}</li>
            <li><Icon name="award" size={22} />{hero.trust[2]}</li>
          </ul>
        </div>
        <div className="hero__photo-wrap hero-in" style={{ '--d': '180ms' }}>
          <span className="pill">{hero.photoPill}</span>
          <figure className="photo-card photo-card--tilt-left">
            <Photo eager priority src={IMAGES.heroPhoto} alt={IMAGES.heroPhotoAlt} className="photo-card__img hero__photo" />
            <figcaption>{hero.photoCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------- Trust strip ---------- */
export function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container trust-strip__inner">
        {trustStrip.map((t, i) => (
          <div className="trust-item" data-reveal="" style={{ '--d': `${i * 60}ms` }} key={t.title}>
            <span className="trust-item__icon"><Icon name={t.icon} size={22} /></span>
            <span>
              <strong>{t.title}</strong>
              <small>{t.sub}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Problems ---------- */
export function Problems({ onQuote }) {
  return (
    <section className="section section--dark">
      <div className="container">
        <SectionHeader dark eyebrow={problems.eyebrow} text={problems.title} accent={problems.accent} intro={problems.intro} />
        <div className="tiles swipe-row">
          {problems.tiles.map((t, i) => (
            <article className="tile" data-reveal="" style={{ '--d': `${i * 70}ms` }} key={t.title}>
              <div className="tile__media">
                {t.img ? (
                  <>
                    <Photo src={t.img} alt={t.alt} />
                    <span className="tile__chip">Real Hex before</span>
                  </>
                ) : (
                  <div className="tile__graphic"><Icon name="userX" size={64} stroke={1.6} /></div>
                )}
              </div>
              <div className="tile__body">
                <h3>{t.title}</h3>
                <p>{t.sub}</p>
                <div className="fix-pill">
                  <span className="fix-pill__check"><Icon name="check" size={12} stroke={3.5} /></span>
                  <span><span className="muted">Hex fix:</span> <strong>{t.fix}</strong></span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="swipe-hint">Swipe to see more →</p>
        <div className="closing-band" data-reveal="" style={{ '--d': '80ms' }}>
          <div>
            <h3>{problems.closingTitle}</h3>
            <p>{problems.closingSub}</p>
          </div>
          <CtaButton onClick={onQuote} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Reviews slider ---------- */
export function Reviews({ onQuote }) {
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(3);

  const phoneCarousel = () => window.matchMedia('(max-width: 768px)').matches;

  const cardLeft = (el, card) => card.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft;

  const measure = () => {
    const el = trackRef.current;
    if (!el) return;
    if (phoneCarousel()) {
      const cards = [...el.querySelectorAll('.review-card')];
      setPages(Math.max(1, cards.length));
      const left = el.scrollLeft;
      let active = 0;
      cards.forEach((card, i) => {
        if (cardLeft(el, card) <= left + 24) active = i;
      });
      setPage(Math.min(cards.length - 1, active));
      return;
    }
    const total = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(total);
    setPage(Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)));
  };

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const go = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    if (phoneCarousel()) {
      const cards = [...el.querySelectorAll('.review-card')];
      const next = Math.min(cards.length - 1, Math.max(0, page + dir));
      if (cards[next]) el.scrollTo({ left: cardLeft(el, cards[next]), behavior: 'smooth' });
      return;
    }
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };
  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    if (phoneCarousel()) {
      const card = el.querySelectorAll('.review-card')[i];
      if (card) el.scrollTo({ left: cardLeft(el, card), behavior: 'smooth' });
      return;
    }
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <section className="section section--white">
      <div className="container">
        <SectionHeader eyebrow={reviews.eyebrow} text={reviews.title} accent={reviews.accent} intro={reviews.intro} />
        <div className="review-track" ref={trackRef} onScroll={measure}>
          {reviews.items.map((r) => (
            <article className="review-card" key={r.name}>
              <div className="review-card__top">
                <Stars size={22} />
                <span className="google-mark"><GoogleG size={20} /> Google</span>
              </div>
              <p className="review-card__text">{r.text}</p>
              <div className="review-card__author">
                <span className="avatar">{r.name[0]}</span>
                <span>
                  <strong>{r.name}</strong>
                  <small>Google review</small>
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="slider-controls">
          <div className="dots">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} type="button" aria-label={`Go to page ${i + 1}`} className={`dot${i === page ? ' dot--active' : ''}`} onClick={() => goTo(i)} />
            ))}
          </div>
          <div className="arrows">
            <button type="button" className="arrow" aria-label="Previous reviews" onClick={() => go(-1)} disabled={page === 0}><Icon name="chevronLeft" size={22} /></button>
            <button type="button" className="arrow arrow--solid" aria-label="Next reviews" onClick={() => go(1)} disabled={page >= pages - 1}><Icon name="chevronRight" size={22} /></button>
          </div>
        </div>
        <div className="cta-block" data-reveal="" style={{ '--d': '80ms' }}>
          <CtaButton onClick={onQuote} />
          <p className="cta-sub">{reviews.sub}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Highlight band ---------- */
export function Band({ onQuote }) {
  return (
    <section className="band">
      <div className="container band__inner" data-reveal="">
        <div>
          <h3>{band.title}</h3>
          <p>{band.sub}</p>
        </div>
        <CtaButton onClick={onQuote} />
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
export function Services({ onQuote }) {
  return (
    <section className="section section--white">
      <div className="container">
        <SectionHeader eyebrow={services.eyebrow} text={services.title} accent={services.accent} intro={services.intro} />
        <div className="service-grid swipe-row">
          {services.items.map((s, i) => (
            <article className="service-card" data-reveal="" style={{ '--d': `${i * 70}ms` }} key={s.title}>
              <Photo src={s.img} alt={s.alt} className="service-card__img" />
              <div className="service-card__body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
          <article className="service-card service-card--cta" data-reveal="" style={{ '--d': '350ms' }}>
            <h3>{services.notSureTitle}</h3>
            <p>{services.notSureText}</p>
            <CtaButton onClick={onQuote} />
          </article>
        </div>
        <p className="swipe-hint swipe-hint--dark">Swipe to see more →</p>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
export function HowItWorks({ onQuote }) {
  return (
    <section className="section section--dark">
      <div className="container">
        <SectionHeader dark eyebrow={howItWorks.eyebrow} text={howItWorks.title} accent={howItWorks.accent} />
        <div className="hiw">
          <div className="hiw__photo-slot" data-reveal="" style={{ '--d': '40ms' }}>
          <figure className="photo-card photo-card--tilt-left hiw__photo">
            <div className="hiw__photo-inner">
              <Photo src={IMAGES.howItWorks} alt={IMAGES.howItWorksAlt} className="photo-card__img" />
              <div className="quote-card">
                <Stars size={18} />
                <p>{howItWorks.quote}</p>
                <small>{howItWorks.quoteBy}</small>
              </div>
            </div>
          </figure>
          </div>
          <div className="timeline">
            {howItWorks.steps.map((s, i) => (
              <div className="step" data-reveal="" style={{ '--d': `${i * 80}ms` }} key={s.title}>
                <div className="step__rail">
                  <span className="step__num">{i + 1}</span>
                  {i < howItWorks.steps.length - 1 && <span className="step__line" />}
                </div>
                <div className="step__content">
                  <span className="chip">{s.chip}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
            <div className="timeline__cta" data-reveal="" style={{ '--d': '280ms' }}>
              <CtaButton onClick={onQuote} />
              <p className="cta-sub cta-sub--light">{howItWorks.sub}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Before / after ---------- */
function CompareSlider({ before, after, beforeAlt, afterAlt }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="compare">
      <Photo eager src={after} alt={afterAlt} className="compare__img" />
      <div className="compare__before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Photo eager src={before} alt={beforeAlt} className="compare__img" />
      </div>
      <span className="compare__tag compare__tag--before">Before</span>
      <span className="compare__tag compare__tag--after">After</span>
      <div className="compare__handle" style={{ left: `${pos}%` }}>
        <span className="compare__knob"><Icon name="chevronLeft" size={16} stroke={3} /><Icon name="chevronRight" size={16} stroke={3} /></span>
      </div>
      <input
        className="compare__range"
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
      />
    </div>
  );
}

export function BeforeAfter({ onQuote }) {
  const [active, setActive] = useState(0);
  const pair = beforeAfter.pairs[active];
  return (
    <section className="section section--gray">
      <div className="container">
        <SectionHeader eyebrow={beforeAfter.eyebrow} text={beforeAfter.title} accent={beforeAfter.accent} />
        <CompareSlider key={active} before={pair.before} after={pair.after} beforeAlt={pair.beforeAlt} afterAlt={pair.afterAlt} />
        <div className="pair-thumbs">
          {beforeAfter.pairs.map((p, i) => (
            <button type="button" key={p.label} className={`pair-thumb${i === active ? ' pair-thumb--active' : ''}`} onClick={() => setActive(i)}>
              <Photo src={p.after} alt="" className="pair-thumb__img" />
              <span><strong>{p.label}</strong><small>{p.sub}</small></span>
            </button>
          ))}
        </div>
        <p className="ba-caption">{beforeAfter.caption}</p>
        <h3 className="gallery-title" data-reveal="">{beforeAfter.galleryTitle}</h3>
        <div className="gallery">
          {beforeAfter.gallery.map((photo, i) => (
            <div className="gallery__item" data-reveal="" style={{ '--d': `${(i % 3) * 70}ms` }} key={photo.src}>
              <Photo src={photo.src} alt={photo.alt} className="gallery__img" />
            </div>
          ))}
        </div>
        <div className="cta-block" data-reveal="" style={{ '--d': '80ms' }}>
          <CtaButton onClick={onQuote} />
          <p className="cta-sub">{beforeAfter.sub}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Hex ---------- */
export function WhyHex({ onQuote }) {
  return (
    <section className="section section--white">
      <div className="container why">
        <div className="why__photo-slot" data-reveal="" style={{ '--d': '40ms' }}>
          <figure className="photo-card photo-card--tilt-right why__photo">
            <Photo src={IMAGES.whyHex} alt={IMAGES.whyHexAlt} className="photo-card__img" />
          </figure>
        </div>
        <div className="why__copy" data-reveal="" style={{ '--d': '120ms' }}>
          <Eyebrow>{whyHex.eyebrow}</Eyebrow>
          <Title text={whyHex.title} accent={whyHex.accent} end={whyHex.titleEnd} />
          <ul className="why__list">
            {whyHex.items.map((it) => (
              <li key={it.title}>
                <span className="check-circle check-circle--navy"><Icon name="check" size={14} stroke={3} /></span>
                <span><strong>{it.title}</strong><small>{it.text}</small></span>
              </li>
            ))}
          </ul>
          <div className="cta-block cta-block--left">
            <CtaButton onClick={onQuote} />
            <p className="cta-sub">{whyHex.sub}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Crew ---------- */
export function Crew({ onQuote }) {
  return (
    <section className="section section--dark">
      <div className="container crew">
        <div className="crew__copy" data-reveal="">
          <Eyebrow dark>{crew.eyebrow}</Eyebrow>
          <Title text={crew.title} accent={crew.accent} />
          <p className="crew__text">{crew.text}</p>
          <ul className="crew__points">
            {crew.points.map((p) => (
              <li key={p}><span className="check-circle"><Icon name="check" size={14} stroke={3} /></span>{p}</li>
            ))}
          </ul>
          <div className="cta-block cta-block--left">
            <CtaButton onClick={onQuote} />
            <a className="cta-sub cta-sub--light" href={PHONE_TEL}>Prefer to talk? Call {PHONE_DISPLAY}</a>
          </div>
        </div>
        <div className="crew__photos">
          <Photo src={IMAGES.crewTeam} alt={IMAGES.crewTeamAlt} className="crew__big" reveal />
          <Photo src={IMAGES.crewShirt} alt={IMAGES.crewShirtAlt} className="crew__small" reveal delay={80} />
          <Photo src={IMAGES.crewDream} alt={IMAGES.crewDreamAlt} className="crew__small" reveal delay={150} />
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq({ onQuote }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="section section--gray">
      <div className="container container--narrow">
        <SectionHeader eyebrow={faq.eyebrow} text={faq.title} accent={faq.accent} />
        <div className="faq">
          {faq.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq__item${isOpen ? ' faq__item--open' : ''}`} data-reveal="" style={{ '--d': `${i * 60}ms` }} key={it.q}>
                <button
                  type="button"
                  className="faq__q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  {it.q}
                  <Icon name={isOpen ? 'minus' : 'plus'} size={20} stroke={2.5} />
                </button>
                <div className="faq__panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`} aria-hidden={!isOpen}>
                  <div className="faq__panel-inner">
                    <p className="faq__a">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="cta-block" data-reveal="" style={{ '--d': '80ms' }}>
          <CtaButton onClick={onQuote} />
          <p className="cta-sub">{faq.sub}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
export function FinalCta({ onQuote }) {
  return (
    <section className="final-cta" style={{ backgroundImage: bg(IMAGES.finalBg) }}>
      <div className="final-cta__overlay" />
      <div className="container final-cta__inner" data-reveal="">
        <Title text={finalCta.title} accent={finalCta.accent} />
        <p className="final-cta__text">{finalCta.text}</p>
        <CtaButton onClick={onQuote} className="btn-cta--lg" />
        <ul className="chips">
          {finalCta.chips.map((c) => (
            <li key={c}><Icon name="check" size={14} stroke={3} />{c}</li>
          ))}
        </ul>
        <a className="final-cta__call" href={PHONE_TEL}>Prefer to talk? Call {PHONE_DISPLAY}</a>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <Photo src={IMAGES.logo} alt={IMAGES.logoAlt} className="site-footer__logo" />
        <div className="site-footer__info">
          <span>Contractor {LICENSE.replace('CA ', '')}</span>
          <a href={PHONE_TEL}><strong>{PHONE_DISPLAY}</strong></a>
          <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy Policy</a>
          <span>©{new Date().getFullYear()} HEX General Contractors. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Mobile sticky bar ---------- */
export function MobileBar({ onQuote }) {
  return (
    <div className="mobile-bar">
      <a className="mobile-bar__call" href={PHONE_TEL}><Icon name="phone" size={18} />Call</a>
      <button type="button" className="mobile-bar__quote" onClick={onQuote}>Get Free Estimate</button>
    </div>
  );
}
