import { useEffect } from 'react';

const REDUCE = '(prefers-reduced-motion: reduce)';

// One observer for every [data-reveal] element. Each element animates once.
export function useMotion() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia(REDUCE).matches) {
      root.classList.remove('js-motion');
      return undefined;
    }
    root.classList.add('js-motion');

    const onEnd = (event) => {
      if (event.animationName !== 'rise') return;
      const el = event.target;
      if (el instanceof Element && el.hasAttribute('data-reveal')) el.classList.add('is-settled');
    };
    document.addEventListener('animationend', onEnd);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
        // Hover styles wait for is-settled. Cover the longest stagger if animationend is missed.
        const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--d')) || 0;
        window.setTimeout(() => entry.target.classList.add('is-settled'), delay + 700);
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

    document.querySelectorAll('[data-reveal]').forEach((node) => {
      if (!node.classList.contains('is-in')) io.observe(node);
    });
    // Added only after the observer exists, so a failed script never leaves content hidden.
    root.classList.add('motion-ready');

    return () => {
      document.removeEventListener('animationend', onEnd);
      io.disconnect();
    };
  }, []);
}
