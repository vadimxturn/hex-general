import React, { useEffect, useRef } from 'react';
import { SectionHeader } from './ui.jsx';
import { designer } from '../content.js';

// The embed script is the uploaded block (srcdoc iframe, KD_CONFIG, bd-height).
// It lives in public/ so the base64 payload is not retyped, and it runs once
// after this section mounts. A second pass (React strict mode) is a no-op
// because the script itself bails out when an iframe is already in #bd-root.
export default function BathroomDesigner() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const script = document.createElement('script');
    script.src = '/bathroom-designer.js';
    script.async = false;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="section section--white designer" id="customize-your-bathroom">
      <div className="container">
        <SectionHeader
          eyebrow={designer.eyebrow}
          text={designer.title}
          accent={designer.accent}
          intro={designer.intro}
        />
        <div id="bd-root" ref={rootRef} style={{ width: '100%', minHeight: 600 }} />
      </div>
    </section>
  );
}
