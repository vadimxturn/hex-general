import React from 'react';
import Icon from './Icon.jsx';

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

// Image with graceful fallback (shows a soft gradient if the file is missing).
export function Photo({ src, alt = '', className = '', style }) {
  const [failed, setFailed] = React.useState(false);
  if (!src || failed) return <div className={`photo photo--fallback ${className}`} style={style} role="img" aria-label={alt} />;
  return <img className={`photo ${className}`} src={src} alt={alt} loading="lazy" style={style} onError={() => setFailed(true)} />;
}
