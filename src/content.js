// All page copy and image paths live here so edits don't require touching components.

export const PHONE_DISPLAY = '(279) 260-7205';
export const PHONE_TEL = 'tel:+12792607205';
export const LICENSE = 'CA License #1017950';
export const PRIVACY_URL = 'https://www.hexrenewal.com/privacy-policy';
export const TERMS_URL = 'https://www.hexrenewal.com/terms-of-service';

const img = (name) => `/images/${name}`;

// Public photos already on hexrenewal.com. Used automatically when the matching
// local file in /public/images is missing (see Photo in components/ui.jsx).
const SQ = 'https://images.squarespace-cdn.com/content/v1/662140f0ef4578539dff3e73/';
const sq = (path) => `${SQ}${path}?format=1500w`;
export const FALLBACKS = {
  [img('logo.png')]: `${SQ}23ffb430-42b7-475c-bcd0-e2d148b5f5b3/Hex-Affordable-General-Contractors-Sacramento-CA.png?format=500w`,
  [img('hero-bg.jpg')]: sq('0818d1a2-1bb0-4a17-b53d-73f9d1d11ac0/white-marble-shower-bathroom-remodel-hex-sacramento.jpg'),
  [img('final-cta-bg.jpg')]: sq('8694b58b-a0b9-40c5-87cc-0a585e6c91db/hex-bathroom-remodel-black-roseville-ca.jpg'),
  [img('service-tub-to-shower.jpg')]: sq('0f9cf7bc-b519-4581-a857-0671f4b3028c/custom-bathroom-hex-general-contractor-sacramento-ca.jpg'),
  [img('service-walk-in.jpg')]: sq('972e4f91-338b-4358-a423-c321f34e5170/hex-custom-bathroom-remodel-elk-grove-ca.jpg'),
  [img('service-full.jpg')]: sq('a97b8a0d-07b0-4404-9312-a5ba14a3d5a1/hex-modern-bathroom-remodel-sacramento-ca.jpg'),
  [img('service-vanity.jpg')]: sq('9291cdf7-73cb-45e1-948c-225e2b6fb935/bathroom-remodeler-hex-contractor-roseville-ca.jpg'),
  [img('service-tile.jpg')]: sq('f75f64c4-e656-46b5-b61f-a9d64c1d906f/bathroom-remodeler-hex-contractor-folsom-ca.jpg'),
  [img('why-hex.jpg')]: sq('ab066f9e-150d-4f04-a563-4fff1b059a3b/bathroom-remodel-hex-contractor-fair-oaks-ca.jpg'),
  [img('gallery-1.jpg')]: sq('4c22fdbe-35ab-4d8d-9c2f-3a1ba4139eaf/hex-general-contractor-bathroom-folsom-ca.jpg'),
  [img('gallery-2.jpg')]: sq('3bb8a359-198f-4424-b6c8-62d53bbef95e/hex-bathroom-general-contractor-sacramento-ca.jpg'),
  [img('gallery-3.jpg')]: sq('52818d24-1444-465e-ad8c-c0a78cc5e395/hex-bathroom-general-contractor-roseville-ca.jpg'),
  [img('gallery-4.jpg')]: sq('88df1ff0-1e09-48b8-8a3a-d040e49246d1/hex-bathroom-general-contractor-elk-grove-ca.jpg'),
  [img('gallery-5.jpg')]: sq('c5f82bdd-77f3-4827-8dd4-4f1845189ffd/hex-bathroom-general-contractor-davis-ca.jpg'),
  [img('gallery-6.jpg')]: sq('a28e2ae8-f0c2-4ec9-b69b-d4931925c8bb/hex-bathroom-general-contractor-fair-oaks-ca.jpg'),
};
export const bg = (path) => (FALLBACKS[path] ? `url(${path}), url(${FALLBACKS[path]})` : `url(${path})`);

export const IMAGES = {
  logo: img('logo.png'),
  heroBg: img('hero-bg.jpg'),
  heroPhoto: img('hero-photo.jpg'),
  finalBg: img('final-cta-bg.jpg'),
  howItWorks: img('service-walk-in.jpg'),
  whyHex: img('why-hex.jpg'),
  crewTeam: img('crew-team.jpg'),
  crewShirt: img('crew-hexshirt.jpg'),
  crewDream: img('crew-dreamhome.jpg'),
};

export const hero = {
  rating: '5.0 on Google from 62 reviews',
  titleTop: 'A bathroom',
  titleAccent: 'you will love',
  titleBottom: 'using every day',
  bullets: [
    'Free consultation and estimate, no obligation',
    `Licensed and insured, ${LICENSE}`,
    'One dedicated project manager, start to finish',
  ],
  financing: 'Flexible financing available through our partner GreenSky.',
  trust: ['Licensed & Insured', 'Dedicated Project Manager', 'CA Lic #1017950'],
  photoPill: 'Real Hex bathroom',
  photoCaption: 'A real Hex remodel',
};

export const trustStrip = [
  { icon: 'star', title: '5.0 on Google', sub: 'From 62 reviews' },
  { icon: 'shield', title: 'Licensed and insured', sub: LICENSE },
  { icon: 'pin', title: 'Local team', sub: 'Serving the Sacramento area' },
  { icon: 'userCheck', title: 'One project manager', sub: 'Your single point of contact' },
  { icon: 'card', title: 'Financing available', sub: 'Through our partner GreenSky' },
];

export const problems = {
  eyebrow: 'Sound familiar?',
  title: 'If your bathroom looks like this, ',
  accent: 'you are not alone',
  intro: 'These are real “before” photos from Hex bathroom projects. Here is how we fix each one.',
  tiles: [
    { title: 'Stuck in another decade', sub: 'Pink tile, old wallpaper and fixtures you stopped noticing years ago.', fix: 'Modern tile, fixtures and lighting', img: img('problem-decade.jpg') },
    { title: 'A big tub you never use', sub: 'It takes up half the room and mostly collects dust.', fix: 'Tub-to-shower conversion', img: img('problem-tub.jpg') },
    { title: 'Grout, mold or a leaky shower', sub: 'You scrub, it comes right back, and you wonder what is behind the tile.', fix: 'New tile shower, hidden damage fixed first', img: img('problem-grout.jpg') },
    { title: 'No room at the vanity', sub: 'One small sink, nowhere to set things down, always cluttered.', fix: 'A bigger vanity with real storage', img: img('problem-vanity.jpg') },
    { title: 'Worried a contractor will vanish', sub: '“These guys were here every day from the start of our project to the end.” Charlotte N., Google review', fix: 'One project manager, start to finish', img: null },
    { title: 'Cramped, dark and closed in', sub: 'Tight corners and poor light make a small room feel even smaller.', fix: 'Smarter layout and better lighting', img: img('problem-cramped.jpg') },
  ],
  closingTitle: 'Hex fixes all of this with one local team.',
  closingSub: 'Licensed and insured, one dedicated project manager, and a free consultation and estimate to start.',
};

export const reviews = {
  eyebrow: 'Reviews',
  title: 'Real reviews from ',
  accent: 'real bathroom clients',
  intro: 'Rated 5.0 stars from 62 Google reviews. Here’s what our bathroom clients say.',
  sub: 'Next step: we call you to set up a free consultation. No pressure, no sales pitch.',
  items: [
    { name: 'Tracy W.', text: 'HEX is the absolute best! I have been wanting to remodel my ugly bathroom for years! I am so happy I chose HEX Contractors! They are all VERY professional and their work is of the highest quality! I am beyond happy with my new bathroom and will be using HEX again in the future! I would highly recommend HEX! You will not be disappointed!' },
    { name: 'Marshon T.', text: 'I had a bathroom remodel. Wallpaper energy Jacuzzi tub were removed and replaced with a walk-in shower. The new bathroom is absolutely beautiful. I very much recommend Hex for your remodel and repair jobs.' },
    { name: 'Tim B.', text: 'Friends recommended Hex General Contractors to us and it was the best recommendation we could have gotten. Alex oversaw the project and made sure everything went seamlessly. The crew was friendly, professional and did exceptional quality work. Vitali, did the tile work and he is a true artist. The beauty of our new master bath has exceeded our expectations.' },
    { name: 'Gail S.', text: 'Hex Contractors up graded my bathroom. They found dry rot and told me right away what needed to be done to continue the job. The bathroom turned out very nice and I am very happy with the end result. Vlad did a wonderful job installing the marble floor and bath surround. He and his workers were very careful to clean up every night.' },
    { name: 'Joshua M.', text: 'We recently just finished a bathroom remodel and we were extremely impressed with Hex. Essentially they did what they said they would do every day and the results were fantastic! Thank you!' },
    { name: 'Lou Ann B.', text: 'First the bathroom, with a complete teardown, new sinks, toilet, cabinets, shower, with new walls, flooring. They did a great job with this project. The workers that did the different jobs were easy to work with, cleaned up after themselves, and communicated when they were going to be there. Fun crew! I highly recommend this group!' },
    { name: 'Paul G.', text: 'Contacted Hex to replace our siding, remodel our master bathroom... The crew Hex sent was very professional and courteous - whenever they saw something during the demo process, they would come get me and point out where there would be any issues. We received high quality work and we’re glad we went with Hex.' },
    { name: 'DiAnna M.', text: 'They did very good job. I keep changing things and they just went with it. Also the guys were very nice and easy to work with.' },
    { name: 'Sean H.', text: 'Hex did a great job on our bathroom remodel! We would definitely work with them again in the future.' },
  ],
};

export const band = {
  title: 'One licensed local team. One project manager. One clear plan.',
  sub: `Free consultation, no obligation. ${LICENSE}.`,
};

export const services = {
  eyebrow: 'What we do',
  title: 'One local team for your ',
  accent: 'whole bathroom',
  intro: 'From a simple tub-to-shower swap to a full remodel, we handle design and construction from start to finish.',
  items: [
    { title: 'Tub-to-shower conversions', text: 'Swap a tub you never use for an easy step-in shower.', img: img('service-tub-to-shower.jpg') },
    { title: 'Walk-in showers', text: 'Custom tile, glass, and built-in niches made for daily use.', img: img('service-walk-in.jpg') },
    { title: 'Full bathroom remodels', text: 'Layout, plumbing, tile, lighting, and finishes handled by one team.', img: img('service-full.jpg') },
    { title: 'Vanities and storage', text: 'More counter space and storage that fits your room.', img: img('service-vanity.jpg') },
    { title: 'Tile and flooring', text: 'Durable tile floors and walls that are easy to keep clean.', img: img('service-tile.jpg') },
  ],
  notSureTitle: 'Not sure what you need?',
  notSureText: 'Tell us about your bathroom and we will help you pick the right option.',
};

export const howItWorks = {
  eyebrow: 'How it works',
  title: 'Your new bathroom in ',
  accent: '4 simple steps',
  quote: '“The beauty of our new master bath has exceeded our expectations.”',
  quoteBy: 'Tim B. · Google review',
  steps: [
    { chip: 'About 1 minute', title: 'Tell us about your bathroom', text: 'Answer 5 quick questions about what you want to change.' },
    { chip: 'Free, no obligation', title: 'Free consultation', text: 'We come out, look at your space, talk through layouts and finishes, and answer your questions.' },
    { chip: 'No surprises', title: 'Clear plan and price', text: 'You get a clear plan, with design help, and see the full price before any work starts.' },
    { chip: 'One point of contact', title: 'We build it', text: 'Your dedicated project manager keeps you updated from demo day to the final walk-through.' },
  ],
  sub: 'Takes about a minute. Then we call to set up your free consultation.',
};

export const beforeAfter = {
  eyebrow: 'Real results',
  title: 'See the difference in a ',
  accent: 'real Hex bathroom',
  pairs: [
    { label: 'Pair 1', sub: 'Wide view', before: img('ba1-before.jpg'), after: img('ba1-after.jpg') },
    { label: 'Pair 2', sub: 'Window view', before: img('ba2-before.jpg'), after: img('ba2-after.jpg') },
  ],
  caption: 'Two angles of the same Hex bathroom. Dated pink tile and a cramped corner shower became a bright glass shower with deep green tile. Drag the handle to compare.',
  galleryTitle: 'More bathrooms we have finished',
  gallery: [1, 2, 3, 4, 5, 6].map((n) => img(`gallery-${n}.jpg`)),
  sub: 'We call you to set up a free consultation. No pressure, no sales pitch.',
};

export const whyHex = {
  eyebrow: 'Why Hex',
  title: 'What you can ',
  accent: 'count on',
  titleEnd: ' with us',
  items: [
    { title: 'Licensed and insured', text: 'California contractor license #1017950.' },
    { title: 'Local to the Sacramento area', text: 'We live here too, and we want our neighbors happy with the result.' },
    { title: 'One dedicated project manager', text: 'One point of contact from the first visit to the final walk-through.' },
    { title: 'Design help from the start', text: 'We help you choose tile, fixtures, vanity, and layout that fit your style.' },
    { title: 'Financing options', text: 'Ask about financing through our partner, GreenSky.' },
  ],
  sub: 'Next step: we call you to set up a free consultation. No pressure, no sales pitch.',
};

export const crew = {
  eyebrow: 'Meet the crew',
  title: 'Meet the crew you will see ',
  accent: 'in your home',
  text: 'These are real Hex team members on the job. You get one dedicated project manager who keeps you updated, and a licensed and insured crew that shows up ready to work.',
  points: ['One dedicated project manager from start to finish', `Licensed and insured, ${LICENSE}`, 'A local Sacramento-area team'],
};

export const faq = {
  eyebrow: 'FAQ',
  title: 'Questions ',
  accent: 'before you start',
  items: [
    { q: 'How much does a bathroom remodel cost?', a: 'It depends on the size of the room, the layout, and the materials you choose. After a free consultation, we give you an estimate so you know the price before any work starts. Financing is available through GreenSky.' },
    { q: 'How long will it take?', a: 'Every bathroom is different. One of our bathroom remodels in Carmichael took about two weeks from demo to final walk-through, and one in Riverview took just over four weeks. You get a timeline before we start.' },
    { q: 'Will my house be a mess?', a: 'Past clients have mentioned our cleanliness while working in their home. At your consultation we will walk you through how we protect your space during the work.' },
    { q: 'Do you handle permits?', a: 'Permit needs depend on the scope of your project. As a licensed contractor (#1017950), we will tell you what your project needs during the consultation.' },
    { q: 'Is the consultation really free?', a: 'Yes. The consultation is free and there is no obligation.' },
  ],
  sub: 'Questions? Ask them on your free consultation call. No pressure, no sales pitch.',
};

export const finalCta = {
  title: 'Ready for a bathroom that ',
  accent: 'works for you?',
  text: 'Answer 5 quick questions. We call you to set up a free consultation. No pressure, no sales pitch.',
  chips: ['Free consultation', 'No obligation', LICENSE, 'Financing available'],
};

export const thankYou = {
  sub: 'A member of the Hex team will reach out to set up your free consultation. Keep an eye on your phone.',
  steps: [
    { tag: 'Done', title: 'You told us about your bathroom', text: 'We have your project details and contact info.' },
    { tag: 'Next', title: 'We call you', text: 'A member of the Hex team calls to go over your project, answer quick questions, and find a time that works for your free consultation.' },
    { tag: 'Free, no obligation', title: 'Free consultation', text: 'We come out, look at your space, talk through layouts and finishes, and answer your questions.' },
    { tag: 'No surprises', title: 'Clear plan and price', text: 'You get a clear plan, with design help, and see the full price before any work starts. Financing is available through our partner GreenSky.' },
    { tag: 'One point of contact', title: 'We build it', text: 'Your dedicated project manager keeps you updated from demo day to the final walk-through.' },
  ],
  prepIntro: 'You do not need anything to get started. These help us give you a more accurate plan and price.',
  prep: [
    { title: 'A few photos of your bathroom', text: 'The shower or tub, vanity, and floor. Phone photos are perfect.' },
    { title: 'Ideas you like', text: 'Saved photos, Pinterest boards, or tile and fixtures you have seen.' },
    { title: 'A rough budget and timeline', text: 'A ballpark helps us suggest the right options for you.' },
    { title: 'Your questions', text: 'Write them down so nothing gets missed during the call.' },
  ],
  quotes: [
    { name: 'Tim B.', text: 'The beauty of our new master bath has exceeded our expectations.' },
    { name: 'Marshon T.', text: 'The new bathroom is absolutely beautiful. I very much recommend Hex for your remodel and repair jobs.' },
    { name: 'Joshua M.', text: 'Essentially they did what they said they would do every day and the results were fantastic!' },
  ],
  badges: ['5.0 on Google from 62 reviews', LICENSE, 'Licensed and insured', 'One dedicated project manager'],
  gallery: [1, 2, 3].map((n) => img(`gallery-${n}.jpg`)),
};

export const quiz = {
  projectTypes: [
    { value: 'Tub-to-shower', icon: 'bath' },
    { value: 'Full bathroom remodel', icon: 'home' },
    { value: 'Walk-in shower', icon: 'shower' },
    { value: 'Other', icon: 'dots' },
  ],
  timelines: ['ASAP', '1-3 months', '3-6 months', 'Just researching'],
};
