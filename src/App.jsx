import React, { useCallback, useState } from 'react';
import {
  Header, Hero, TrustStrip, Problems, Reviews, Band, Services, HowItWorks,
  BeforeAfter, WhyHex, Crew, Faq, FinalCta, Footer, MobileBar,
} from './components/Sections.jsx';
import BathroomDesigner from './components/BathroomDesigner.jsx';
import QuoteModal from './components/QuoteModal.jsx';
import ThankYou from './components/ThankYou.jsx';
import { useMotion } from './useMotion.js';

export default function App() {
  useMotion();
  if (window.location.pathname.replace(/\/+$/, '') === '/thank-you') return <ThankYou />;
  return <LandingPage />;
}

function LandingPage() {
  const [open, setOpen] = useState(false);
  const openQuote = useCallback(() => setOpen(true), []);
  const closeQuote = useCallback(() => setOpen(false), []);

  return (
    <>
      <Header onQuote={openQuote} />
      <main>
        <Hero onQuote={openQuote} />
        <TrustStrip />
        <BathroomDesigner />
        <Problems onQuote={openQuote} />
        <Reviews onQuote={openQuote} />
        <Band onQuote={openQuote} />
        <Services onQuote={openQuote} />
        <HowItWorks onQuote={openQuote} />
        <BeforeAfter onQuote={openQuote} />
        <WhyHex onQuote={openQuote} />
        <Crew onQuote={openQuote} />
        <Faq onQuote={openQuote} />
        <FinalCta onQuote={openQuote} />
      </main>
      <Footer />
      <MobileBar onQuote={openQuote} />
      <QuoteModal open={open} onClose={closeQuote} />
    </>
  );
}
