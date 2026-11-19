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

export function SectionHeader({ eyebrow, text, accent, end, intro, dark = false, align = 'center', reveal = true, delay = 0 }) {
  return (
    <div
      className={`section-header section-header--${align}`}
      {...(reveal ? { 'data-reveal': '', style: { '--d': `${delay}ms` } } : {})}
    >
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <Title text={text} accent={accent} end={end} />
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}

// Local photo. Above-the-fold slots pass eager; everything else lazy-loads.
export function Photo({ src, alt = '', className = '', style, eager = false, priority = false, reveal = false, delay = 0 }) {
  return (
    <img
      className={`photo ${className}`}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      data-reveal={reveal ? '' : undefined}
      style={reveal ? { ...style, '--d': `${delay}ms` } : style}
    />
  );
}
