import React, { useCallback, useState } from 'react';
import {
  Header, Hero, TrustStrip, Problems, Reviews, Band, Services, HowItWorks,
  BeforeAfter, WhyHex, Crew, Faq, FinalCta, Footer, MobileBar,
} from './components/Sections.jsx';
import QuoteModal from './components/QuoteModal.jsx';

export default function App() {
  const [open, setOpen] = useState(false);
  const openQuote = useCallback(() => setOpen(true), []);
  const closeQuote = useCallback(() => setOpen(false), []);

  return (
    <>
      <Header onQuote={openQuote} />
      <main>
        <Hero onQuote={openQuote} />
        <TrustStrip />
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
