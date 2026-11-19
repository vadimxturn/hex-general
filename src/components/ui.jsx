import React from 'react';
import Icon from './Icon.jsx';
import { FALLBACKS } from '../content.js';

export function Eyebrow({ children, dark = false }) {
  return <span className={`eyebrow${dark ? ' eyebrow--dark' : ''}`}>{children}</span>;
}

export function Title({ as: Tag = 'h2', text, accent, end = '', className = '' }) {
  return (
    <Tag className={`title ${className}`}>
      {text}
      <span className="accent">{accent}</span>
      {end}
    </Tag>
  );
}

export function CtaButton({ onClick, label = 'Get My Free Estimate', full = false, className = '' }) {
  return (
    <button type="button" className={`btn-cta${full ? ' btn-cta--full' : ''} ${className}`} onClick={onClick}>
      {label}
      <Icon name="arrowRight" size={20} stroke={2.5} />
    </button>
  );
}

export function SectionHeader({ eyebrow, text, accent, end, intro, dark = false, align = 'center' }) {
  return (
    <div className={`section-header section-header--${align}`}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <Title text={text} accent={accent} end={end} />
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}

// Image with graceful fallback: local file -> hexrenewal.com photo -> soft gradient.
export function Photo({ src, alt = '', className = '', style, eager = false }) {
  const [stage, setStage] = React.useState(0);
  const sources = [src, FALLBACKS[src]].filter(Boolean);
  const current = sources[stage];
  if (!current) return <div className={`photo photo--fallback ${className}`} style={style} role="img" aria-label={alt} />;
  return (
    <img
      className={`photo ${className}`}
      src={current}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      style={style}
      onError={() => setStage((s) => s + 1)}
    />
  );
}
