import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* =========================================================
   HU STUDIO — Creative Portfolio (page route)
   Converted from the original HTML + CSS + JS to React + Tailwind.

   IMAGES: brand marks are loaded from the supplied ventures assets.
   ========================================================= */

const LOGO_ASSETS = {
  'admos': '/brand-logos/admos.png',
  'oxtel': '/brand-logos/oxtel.png',
  'dayone': '/brand-logos/dayone.png',
  'nkreatives': '/brand-logos/nkreatives.png',
  'carzo': '/brand-logos/carzo.jpeg',
  'founderverse': '/brand-logos/founderverse.png',
  'start-x': '/brand-logos/start-x.png',
  'hey-dossa': '/brand-logos/hey-dossa.png',
  'moon-bliss': '/brand-logos/moon-bliss.png',
  'zaati': '/brand-logos/zaati.png',
  'de-coff': '/brand-logos/de-coff.png',
  'house-of-bliss': '/brand-logos/house-of-bliss.png',
  'hungry-potato': '/brand-logos/hungry-potato.png',
  'carbroker': '/brand-logos/carbroker.png',
  'curry-bag': '/brand-logos/curry-bag.png',
  'suite-spot': '/brand-logos/suite-spot.png',
  'no-two': '/brand-logos/no-two.png',
  'hyzo': '/brand-logos/hyzo.jpeg',
  'ezka': '/brand-logos/ezka.png',
  'hosther-hostels': '/brand-logos/hosther-hostels.png',
  'ai-designers': '/brand-logos/ai-designers.png',
  'ai-institute': '/brand-logos/ai-institute.png',
  'aisen-studio': '/brand-logos/aisen-studio.png',
  'coffee-klatch': '/brand-logos/coffee-klatch.png',
  'global-venture': '/brand-logos/global-venture.png',
  'tanza-opticals': '/brand-logos/tanza-opticals.png',
  'tempest-automotive': '/brand-logos/tempest-automotive.png',
  'terminal': '/brand-logos/terminal.png',
  'tp-group-of-companies': '/brand-logos/tp-group-of-companies.png',
  'vinayaka-hospital': '/brand-logos/vinayaka-hospital.png',
  'warrior-mens': '/brand-logos/warrior-mens.png',
  'wayanad-trade-centre': '/brand-logos/wayanad-trade-centre.png',
  'sol-for-her': '/brand-logos/sol-for-her.png',
  'sol': '/brand-logos/sol.png',
  'nothing-else': '/brand-logos/nothing-else.png',
  'bare-logic': '/brand-logos/bare-logic.png',
  'shameers-cars': '/brand-logos/shameers-cars.png',
  'popsi': '/brand-logos/popsi.png',
  'the-grid-store': '/brand-logos/the-grid-store.png',
  'beyond-the-business': '/brand-logos/beyond-the-business.jpeg',
  'celebrations': '/brand-logos/celebrations.jpeg',
  'xyklon': '/brand-logos/xyklon.png',
  'hand-revolution': '/brand-logos/hand-revolution.jpeg',
}

const ZOOMED_LOGOS = new Set(['nkreatives', 'curry-bag', 'ai-institute', 'tempest-automotive', 'vinayaka-hospital', 'wayanad-trade-centre', 'beyond-the-business'])
const LOGO_BACKGROUNDS = { 'curry-bag': '#050505', 'tempest-automotive': '#d41450' }
const LOGO_SIZES = { 'curry-bag': 'size-[180%]', 'beyond-the-business': 'size-[140%] translate-y-[8%]' }

// Social media examples shown inside each selected work's case detail.
const WORK_GALLERIES = {
  nkreatives: [
    ['nkreactives-insta-prof.jpeg', 'NKreatives Instagram profile'],
  ],
  oxtel: [
    ['oxtelinstaprof.jpeg', 'Oxtel Instagram profile'],
  ],
  'coffee-klatch': [
    ['coffee-klatch-insta.png', 'Coffee Klatch Instagram post'],
    ['coffee-klatch-posts.png', 'Coffee Klatch social posts'],
  ],
  carzo: [
    ['carzo.jpeg', 'Carzo brand logo', '/carzo.jpeg'],
    ['carzo-posts.png', 'Carzo social posts'],
  ],
  'bare-logic': [
    ['barelogic.png', 'Bare Logic brand logo', '/ventures/barelogic.png'],
  ],
  'nothing-else': [
    ['nothing-else-post.png', 'Nothing Else social post'],
    ['nothing-else-post2.png', 'Nothing Else social post'],
  ],
  'no-two': [
    ['notwo-post.png', 'No Two social post'],
    ['notwo-post2.png', 'No Two social post'],
  ],
  founderverse: [
    ['fv.png', 'Founderverse social post'],
  ],
  dayone: [
    ['davone.png', 'DayOne brand logo', '/ventures/davone.png'],
    ['dayoneinsta.png', 'DayOne Instagram profile'],
    ['dayonepost1.png', 'DayOne Instagram post'],
    ['dayonepost2.png', 'DayOne Instagram post'],
    ['instagrampost3.png', 'DayOne Instagram post'],
    ['dayone-crm.png', 'DayOne CRM dashboard'],
  ],
  'moon-bliss': [
    ['moonbliss-post.png', 'MoonBliss social post'],
    ['moonbliss-post2.png', 'MoonBliss social post'],
    ['moonbliss-reels.png', 'MoonBliss content'],
  ],
  zaati: [
    ['zaati-insta.png', 'Zaati Instagram post'],
    ['zaati-insta-posts.png', 'Zaati Instagram posts'],
  ],
  'shameers-cars': [
    ['shameers-reels.png', "Shameer's Cars content"],
  ],
  'aisen-studio': [
    ['aisen-posts.png', 'Aisen Studio social posts'],
    ['aisenstudio-insta-prof.png', 'Aisen Studio Instagram profile'],
  ],
  'ai-institute': [
    ['aiinstitute-insta-posts.png', 'AI Institute Instagram post'],
  ],
}

const WORK_PACKAGING = {
  'bare-logic': [['barelogic.png', 'Bare Logic product packaging']],
  'nothing-else': [['nothingelse.png', 'Nothing Else product packaging']],
}

const WORK_VIDEOS = {
  nkreatives: [
    { src: 'https://www.instagram.com/reel/DXt4ZYLgP2J/embed', title: 'NKreatives Instagram reel' },
    { src: 'https://www.instagram.com/reel/DV8ogXLEbcC/embed', title: 'NKreatives Instagram reel' },
  ],
  oxtel: [
    { src: 'https://www.instagram.com/reel/C6S8Ei4rGV-/embed', title: 'Oxtel Instagram reel' },
    { src: 'https://www.instagram.com/reel/DBRHBrZyo0F/embed', title: 'Oxtel Instagram reel' },
  ],
  carzo: [
    { src: 'https://www.instagram.com/reel/Db8QT0Tznb1/embed', title: 'Carzo Instagram reel' },
    { src: 'https://www.instagram.com/reel/Deg2XMDTgi5/embed', title: 'Carzo Instagram reel' },
    { src: 'https://www.instagram.com/reel/De1deFLzllt/embed', title: 'Carzo Instagram reel' },
  ],
  dayone: [
    { src: 'https://www.instagram.com/reel/De3mc-kNwdD/embed', title: 'DayOne Instagram reel' },
  ],
  'nothing-else': [
    { src: 'https://www.instagram.com/reel/DfEsErLT1ob/embed', title: 'Nothing Else Instagram reel' },
  ],
  'no-two': [
    { src: 'https://www.instagram.com/reel/DfCb6ech3Cu/embed', title: 'No Two Instagram reel' },
  ],
  zaati: [
    { src: 'https://www.instagram.com/reel/DdHNBvJqj16/embed', title: 'Zaati Instagram reel' },
    { src: 'https://www.instagram.com/reel/DZveBOeN1dd/embed', title: 'Zaati Instagram reel' },
  ],
  'moon-bliss': [
    { src: 'https://www.instagram.com/reel/DfCb-eBAwIj/embed', title: 'MoonBliss Instagram reel' },
    { src: 'https://www.instagram.com/reel/DYZd31XttAK/embed', title: 'MoonBliss Instagram reel' },
  ],
  'house-of-bliss': [
    { src: 'https://www.instagram.com/reel/DV-S-H-D1SJ/embed', title: 'House of Bliss Instagram reel' },
  ],
  'aisen-studio': [
    { src: 'https://www.instagram.com/reel/DVm70zikRKw/embed', title: 'Aisen Studio Instagram reel' },
  ],
  'ai-institute': [
    { src: 'https://www.instagram.com/reel/DNVR0stP4NS/embed', title: 'AI Institute Instagram reel' },
    { src: 'https://www.instagram.com/reel/DK1eipgJnVD/embed', title: 'AI Institute Instagram reel' },
  ],
  'shameers-cars': [
    { src: 'https://www.instagram.com/reel/DGVwJYTTFV_/embed', title: "Shameer's Cars Instagram reel" },
    { src: 'https://www.instagram.com/reel/DHaVnHiy-SF/embed', title: "Shameer's Cars Instagram reel" },
  ],
}

function Logo({ slug, name, className = '', cover = false, style }) {
  const asset = LOGO_ASSETS[slug]
  if (asset) {
    return (
      <span style={style} className={`relative block overflow-hidden ${className}`}>
        <img
          src={asset.startsWith('/') ? asset : `/ventures/${asset}`}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          draggable={false}
          style={ZOOMED_LOGOS.has(slug) ? { backgroundColor: 'transparent' } : undefined}
          className={`absolute ${ZOOMED_LOGOS.has(slug) ? `inset-0 m-auto ${LOGO_SIZES[slug] || 'size-[82%]'} object-contain` : 'inset-0 size-full bg-white'} ${cover ? 'object-cover' : 'object-contain'}`}
        />
      </span>
    )
  }

  return (
    <div
      role="img"
      aria-label={`${name} logo`}
      className={`grid place-items-center bg-[#eee] text-[0.8rem] font-black uppercase text-[#5b5b5b] ${className}`}
    >
      {name.slice(0, 2)}
    </div>
  )
}

function DeferredInstagramEmbed({ src, title, thumbnail }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="w-full">
      {loaded ? (
        <iframe
          src={src}
          title={title}
          allow="encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="block aspect-[9/16] max-h-[280px] w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          aria-label={`Play ${title}`}
          className="group relative block aspect-[9/16] max-h-[280px] w-full overflow-hidden bg-[#141414] text-left text-white"
        >
          {thumbnail && <img src={thumbnail} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none' }} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15" />
          <span aria-hidden className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-black/35 shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-0.5 size-5 fill-current"><path d="M7 4.8c0-.77.84-1.25 1.5-.85l10.1 6.2a1 1 0 0 1 0 1.7l-10.1 6.2A1 1 0 0 1 7 17.2V4.8Z" /></svg>
          </span>
        </button>
      )}
    </div>
  )
}

function SocialAssetGrid({ items }) {
  const hasBareLogicLogo = items.some(([file, , src]) => file === 'barelogic.png' && src === '/ventures/barelogic.png')
  return (
    <div
      className="grid items-start gap-3"
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, 150px), ${hasBareLogicLogo ? 250 : 190}px))` }}
    >
      {items.map(([file, label, src]) => (
        <figure key={file} className={`m-0 min-w-0 overflow-hidden rounded-lg border-2 border-[#141414] bg-white shadow-[2px_2px_0_#141414] ${file === 'dayone-crm.png' ? 'col-span-2 max-[500px]:col-span-1' : ''}`}>
          <div className={`grid ${file === 'dayone-crm.png' ? 'aspect-video' : hasBareLogicLogo && file === 'barelogic.png' ? 'aspect-square' : 'aspect-[4/5]'} place-items-center overflow-hidden bg-[#f3f0eb]`}>
            <img src={src || `/social-media/${file}`} alt={label} loading="lazy" decoding="async" className={`block h-full w-full object-contain ${hasBareLogicLogo && file === 'barelogic.png' ? 'scale-[1.65]' : ''}`} />
          </div>
          {file !== 'dayone-crm.png' && !/instagram|social post/i.test(label) && (
            <figcaption className="border-t-2 border-[#141414] px-2 py-1.5 text-[0.7rem] font-bold leading-tight">{label}</figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}

/* ---------- Data: featured case studies ---------- */

const FEATURED = [
  {
    slug: 'carzo', name: 'Carzo', sector: 'Automotive / car selling', role: 'Creative Director',
    filter: 'creative', accent: '#80dcea',
    headline: 'A faster way to sell a car',
    summary: 'Creative direction for a car-selling service built around a quick, hassle-free sale and instant payment.',
    lead: ['Creative direction'],
    mkt: [],
    note: 'Instagram profile, reels and featured video.',
  },
  {
    slug: 'dayone', name: 'DayOne Venture Studio', sector: 'Venture studio', role: 'CEO / Business Head',
    filter: 'ceo', accent: '#ffe14d',
    headline: 'Leadership + growth systems',
    summary: 'Executive oversight of venture-building activity, bringing together growth, creative direction, marketing, operational discipline and coordinated execution.',
    lead: ['Business leadership', 'Marketing leadership', 'Team execution', 'Operations & SOPs', 'Brand strategy', 'Creative direction', 'Quality control'],
    mkt: ['360° planning', 'Social strategy', 'Paid media', 'Launches', 'Website', 'Influencer / PR', 'Sales & revenue'],
    note: 'A portfolio-wide view: linking creative and marketing work to operational priorities and venture progress.',
  },
  {
    slug: 'moon-bliss', name: 'MoonBliss', sector: "Women's wellness", role: 'CEO / Business Head',
    filter: 'ceo', accent: '#c9b8ff',
    headline: 'From proposition to market experience',
    summary: 'A broad business and marketing leadership role across a menstrual-wellness venture, connecting product storytelling, brand experience, go-to-market and commercial coordination.',
    lead: ['CEO leadership', 'Marketing direction', 'Brand identity', 'Architecture', 'Voice & QA', 'Teams & SOPs', 'Content direction'],
    mkt: ['Paid media', 'Social strategy / design', 'Website experience', 'Influencer / PR', 'GTM', 'Sales & growth planning'],
    note: 'Working example of a product-led wellness narrative, including the four-shot ritual concept.',
  },
  {
    slug: 'nothing-else', name: 'Nothing Else', sector: 'FMCG', role: 'Founder / Co-founder',
    filter: 'founder', accent: '#80dcea',
    headline: 'Brand clarity for a consumer product',
    summary: 'Founder-led involvement across consumer positioning, branding, packaging direction, market preparation and the systems needed to coordinate marketing and commercial activity.',
    lead: ['Business leadership', 'Marketing leadership', 'Identity', 'Architecture', 'Brand voice', 'Creative direction', 'Content & brand QA'],
    mkt: ['360° marketing', 'Paid ads', 'Social strategy / design', 'Website', 'Launch', 'Influencer / PR', 'Sales & revenue', 'Team & SOPs'],
    note: 'Consumer brand exploration with a distinctive blue visual identity and a product-packaging direction.',
  },
  {
    slug: 'founderverse', name: 'The Founderverse', sector: 'Startup education', role: 'Founder / Co-founder',
    filter: 'founder', accent: '#7ee2a8',
    headline: 'Turning knowledge into an accessible platform',
    summary: 'Founder-led platform creation combining education, editorial storytelling, digital experience and marketing execution for entrepreneurs and aspiring founders.',
    lead: ['Business leadership', 'Marketing leadership', 'Positioning', 'Naming', 'Identity', 'Architecture', 'Brand voice', 'Creative direction', 'Content systems'],
    mkt: ['Social media', 'Paid marketing', 'Launch', 'Website', 'Influencers / PR', 'Sales & growth planning', 'Brand QA', 'Operating processes'],
    note: 'A recurring illustrated practical-guide format creates a distinct content experience around startup learning.',
  },
  {
    slug: 'nkreatives', name: 'NKreatives', sector: 'Creative / marketing agency', role: 'Creative Director',
    filter: 'creative', accent: '#c6f24e',
    headline: 'Creative direction with commercial context',
    summary: 'Agency-side creative leadership spanning brand thinking, marketing execution, content systems, customer-facing digital assets and coordination of integrated campaigns.',
    lead: ['Creative direction', 'Brand strategy', 'Identity', 'Voice & architecture', 'Content production', 'Social design', 'Brand QA'],
    mkt: ['CMO / marketing leadership', '360° planning', 'Paid media', 'Social strategy', 'Launches', 'Website', 'PR & BD', 'Teams & SOPs'],
    note: 'A useful reference for the intersection of agency delivery quality and client growth objectives.',
  },
  {
    slug: 'zaati', name: 'Zaati', sector: 'Restaurant', role: 'CMO / Head of Marketing',
    filter: 'marketing', accent: '#ffcfae',
    headline: 'Cultural identity meets modern marketing',
    summary: 'Marketing-lead responsibility across brand positioning, storytelling, creative direction and an integrated restaurant communication plan.',
    lead: ['CMO scope', 'Brand strategy', 'Naming / identity', 'Architecture & voice', 'Creative direction', 'Production', 'Social design & QA'],
    mkt: ['Social strategy', '360° planning', 'Influencer / PR', 'Sales & business development', 'Operating processes'],
    note: 'A culinary brand with an Indian–Arabic identity direction and a premium visual expression.',
  },
  {
    slug: 'start-x', name: 'Start-X', sector: 'Startup ecosystem', role: 'Marketing / Growth Lead',
    filter: 'marketing', accent: '#ff5a52',
    headline: 'Building visibility around opportunity',
    summary: 'Marketing and growth leadership scope for a startup ecosystem brand, spanning brand foundations, market launch, channel strategy and commercial outreach.',
    lead: ['Marketing leadership', 'Identity', 'Brand architecture', 'Operational processes'],
    mkt: ['Social media strategy', 'Integrated 360° planning', 'Go-to-market', 'Sales & business development'],
    note: 'A bold, high-contrast identity designed to communicate an outward-looking startup proposition.',
  },
  {
    slug: 'ai-designers', name: 'AI Designers Ecosystem', sector: 'Technology / creative community', role: 'CMO / Head of Marketing',
    filter: 'marketing', accent: '#5468ff',
    headline: 'From identity to an integrated ecosystem story',
    summary: 'Marketing leadership for a creative-technology community proposition with integrated brand, media, outreach and growth scope.',
    lead: ['Positioning', 'Naming / identity', 'Architecture', 'Voice', 'Creative direction', 'Content / social design', 'Brand QA'],
    mkt: ['360° planning', 'Social strategy', 'Paid campaigns', 'Influencer / PR', 'Sales', 'Growth / revenue strategy'],
    note: 'Cross-disciplinary marketing across technology, professional community and creative engagement.',
  },
  {
    slug: 'shameers-cars', name: "Shameer's Cars", sector: 'Automotive', role: 'Marketing / Creative',
    filter: 'marketing', accent: '#b9d9ff',
    headline: 'Making the cars the story',
    summary: 'Social media content for Shameer’s Cars, presenting its vehicles through clear, engaging automotive visuals.',
    lead: ['Social content'],
    mkt: ['Social media'],
    note: 'Automotive social content featuring the cars and brand.',
  },
]

const WORK_FILTERS = [
  ['ceo', 'Business head'],
  ['founder', 'Founder'],
  ['marketing', 'Marketing lead'],
  ['creative', 'Creative director'],
  ['advisor', 'Consultant / Advisor'],
  ['event-head', 'Event head'],
]

const matchesWorkFilter = (item, filter) => {
  if (filter === 'all') return true
  return item.filter === filter
}

/* ---------- Data: brand universe (logo wall) ---------- */

const BRANDS = [
  ['admos', 'Admos', 'Consumer electronics / GCC'],
  ['oxtel', 'Oxtel', 'Hospitality'],
  ['start-x', 'Start-X', 'Startup ecosystem'], ['hey-dossa', 'Hey Dossa', 'Food & beverage'],
  ['moon-bliss', 'MoonBliss', "Women's wellness"], ['zaati', 'Zaati', 'Restaurant'],
  ['de-coff', 'De Coff', 'Café'], ['house-of-bliss', 'House of Bliss', 'Lifestyle'],
  ['hungry-potato', 'Hungry Potato', 'Food & beverage'], ['carbroker', 'CarBroker', 'Automotive'],
  ['carzo', 'Carzo', 'Automotive / car selling'],
  ['curry-bag', 'Curry Bag', 'Food & takeaway'], ['suite-spot', 'Suite Spot', 'Hospitality'],
  ['founderverse', 'The Founderverse', 'Startup education'], ['hyzo', 'Hyzo', 'Brand concept'],
  ['ezka', 'Ezka', 'Fashion & lifestyle'], ['dayone', 'DayOne', 'Venture studio'],
  ['no-two', 'No Two', 'Skincare'], ['hosther-hostels', 'Hosther Hostels', 'Hospitality'],
  ['ai-designers', 'AI Designers', 'Tech community'], ['sol', 'Sol.', "Women's fashion"],
  ['nothing-else', 'Nothing Else', 'FMCG'], ['bare-logic', 'Bare Logic', 'Skincare'],
  ['popsi', 'POPSI', 'Beverages'], ['the-grid-store', 'The Grid Store', 'Electronics / e-commerce'],
  ['beyond-the-business', 'Beyond the Business', 'Management consultancy / digital marketing'],
  ['celebrations', 'Celebrations', 'Corporate events'], ['xyklon', 'Xyklon', 'Mobile accessories / GCC'],
  ['hand-revolution', 'Hand Revolution', 'Footwear / e-commerce'],
  ['terminal', 'Terminal', "Men's fashion"], ['nkreatives', 'NKreatives', 'Creative / marketing agency'],
  ['coffee-klatch', 'Coffee Klatch', 'Café'], ['global-venture', 'Global Venture', 'Construction / design'],
  ['wayanad-trade-centre', 'Wayanad Trade Centre', 'Commercial / trade'],
  ['tempest-automotive', 'Tempest Automotive', 'Automotive'], ['warrior-mens', 'Warrior Mens', 'Fashion'],
  ['tp-group-of-companies', 'TP Group of Companies', 'Building materials / corporate'],
  ['vinayaka-hospital', 'Vinayaka Hospital', 'Healthcare'], ['aisen-studio', 'Aisen Studio', "Women's fashion"],
  ['ai-institute', 'AI Institute', 'Education'], ['tanza-opticals', 'Tanza Opticals', 'Optical / retail healthcare'],
  ['shameers-cars', "Shameer's Cars", 'Automotive'],
].sort((a, b) => a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }))

/* ---------- Data: full project index ---------- */

// Shared scope sets — several projects carry the complete range.
const L_ALL = ['CEO / business leadership', 'Marketing leadership', 'Team leadership', 'Operations / SOPs']
const B_ALL = ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design', 'Brand QA']
const M_ALL = ['Social strategy', 'Paid media', '360° marketing', 'Go-to-market', 'Growth & revenue', 'Sales & BD', 'Influencers / PR', 'Web / digital']
const MAX = { l: L_ALL.length, b: B_ALL.length, m: M_ALL.length }

const INDUSTRIES = {
  food: 'Food & Hospitality',
  style: 'Fashion & Beauty',
  venture: 'Ventures & Education',
  consumer: 'Consumer & Auto',
  corporate: 'Corporate & Health',
}
const INDUSTRY_FILTERS = { all: 'All sectors', ...INDUSTRIES }

const P = (name, sector, ind, role, roleKey, l, b, m, note) => ({ name, sector, ind, role, roleKey, l, b, m, note })

const PROJECTS = [
  P('Carzo', 'Automotive / car selling', 'consumer', 'Creative Director', 'creative',
    [], [], [], 'Creative direction for a car-selling service focused on a fast, hassle-free sale and instant payment.'),
  P('Start-X', 'Startup ecosystem', 'venture', 'Marketing / Growth Lead', 'marketing',
    ['Marketing leadership', 'Operations / SOPs'], ['Naming & identity', 'Brand architecture'], ['Social strategy', '360° marketing', 'Go-to-market', 'Sales & BD']),
  P('Hey Dossa', 'Food & beverage', 'food', 'Consultant / Advisor', 'advisor',
    ['Operations / SOPs'], ['Brand strategy', 'Naming & identity', 'Brand architecture', 'Social design'], ['Social strategy', 'Go-to-market']),
  P('Oxtel', 'Hospitality', 'venture', 'Consultant / Advisor', 'advisor',
    [], [], [], 'Instagram profile and reels.'),
  P('MoonBliss', "Women's wellness", 'style', 'CEO / Business Head', 'ceo', L_ALL, B_ALL, M_ALL),
  P('Zaati', 'Restaurant', 'food', 'CMO / Head of Marketing', 'marketing',
    ['Marketing leadership', 'Operations / SOPs'], B_ALL, ['Social strategy', '360° marketing', 'Sales & BD', 'Influencers / PR']),
  P('De Coff', 'Café', 'food', 'Founder / Co-founder', 'founder',
    ['CEO / business leadership', 'Team leadership'], ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture'],
    ['Paid media', '360° marketing', 'Go-to-market', 'Growth & revenue', 'Sales & BD']),
  P('House of Bliss', 'Lifestyle / concept', 'style', 'Event Head', 'event-head', [], [], []),
  P('Hungry Potato', 'Food & beverage', 'food', 'Founder / Co-founder', 'founder',
    ['CEO / business leadership', 'Marketing leadership', 'Operations / SOPs'],
    ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production'], ['360° marketing', 'Growth & revenue']),
  P('CarBroker', 'Automotive', 'consumer', 'Founder / Co-founder', 'founder',
    ['CEO / business leadership', 'Marketing leadership'],
    ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing']),
  P('Curry Bag', 'Food & takeaway', 'food', 'Founder / Co-founder', 'founder',
    ['CEO / business leadership', 'Marketing leadership'],
    ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Go-to-market']),
  P('Suite Spot', 'Hospitality', 'food', 'CMO / Head of Marketing', 'marketing',
    ['Marketing leadership', 'Team leadership', 'Operations / SOPs'], ['Brand strategy'], ['Growth & revenue', 'Sales & BD']),
  P('The Founderverse', 'Startup education', 'venture', 'Founder / Co-founder', 'founder', L_ALL, B_ALL, M_ALL),
  P('Hyzo', 'Brand concept', 'consumer', 'Consultant / Advisor', 'advisor',
    [], ['Naming & identity', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], []),
  P('Ezka', 'Fashion & lifestyle', 'style', 'Consultant / Advisor', 'advisor',
    [], ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'],
    ['Social strategy', 'Paid media', '360° marketing', 'Growth & revenue', 'Sales & BD', 'Influencers / PR']),
  P('DayOne Venture Studio', 'Venture studio', 'venture', 'CEO / Business Head', 'ceo', L_ALL, B_ALL, M_ALL),
  P('No Two', 'Skincare', 'style', 'Founder / Co-founder', 'founder',
    ['Marketing leadership', 'Team leadership', 'Operations / SOPs'],
    ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Content production', 'Social design', 'Brand QA'],
    ['Paid media', '360° marketing', 'Go-to-market', 'Growth & revenue', 'Sales & BD', 'Influencers / PR', 'Web / digital']),
  P('Hosther Hostels', 'Hospitality', 'food', 'Consultant / Advisor', 'advisor',
    [], ['Naming & identity', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['360° marketing']),
  P('AI Designers Ecosystem', 'Technology / community', 'venture', 'CMO / Head of Marketing', 'marketing',
    ['Marketing leadership'], B_ALL, ['Social strategy', 'Paid media', '360° marketing', 'Growth & revenue', 'Sales & BD', 'Influencers / PR']),
  P('Sol.', "Women's fashion", 'style', 'Consultant / Advisor', 'advisor',
    [], ['Brand strategy', 'Naming & identity', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'],
    ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('Nothing Else', 'FMCG', 'consumer', 'Founder / Co-founder', 'founder', L_ALL, B_ALL, M_ALL),
  P('Bare Logic', 'Skincare', 'style', 'Founder / Co-founder', 'founder',
    [], ['Naming & identity', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing']),
  P('Terminal', "Men's fashion", 'style', 'Consultant / Advisor', 'advisor',
    [], ['Brand strategy', 'Brand architecture', 'Creative direction', 'Content production', 'Social design', 'Brand QA'],
    ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('NKreatives', 'Creative / marketing agency', 'corporate', 'Creative Director', 'creative',
    ['Marketing leadership', 'Team leadership', 'Operations / SOPs'], B_ALL, M_ALL),
  P('Coffee Klatch', 'Café', 'food', 'Creative Director', 'creative',
    ['CEO / business leadership'], ['Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing']),
  P('Global Venture', 'Construction / design', 'corporate', 'Creative Director', 'creative',
    [], ['Brand strategy', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'],
    ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('Wayanad Trade Centre', 'Commercial / trade', 'corporate', 'Creative Director', 'creative',
    [], ['Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing']),
  P('Tempest Automotive ', 'Automotive', 'consumer', 'Consultant / Advisor', 'advisor',
    [], ['Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing', 'Influencers / PR']),
  P('Warrior Mens', 'Fashion', 'style', 'Consultant / Advisor', 'advisor',
    [], ['Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', 'Paid media', '360° marketing']),
  P('TP Group of Companies', 'Building materials / corporate', 'corporate', 'Consultant / Advisor', 'advisor',
    ['Marketing leadership'], ['Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design', 'Brand QA'],
    ['Social strategy', 'Paid media', '360° marketing', 'Growth & revenue', 'Sales & BD', 'Influencers / PR']),
  P('Vinayaka Hospital', 'Healthcare', 'corporate', 'Consultant / Advisor', 'advisor',
    [], ['Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing', 'Growth & revenue']),
  P('Aisen Studio', "Women's fashion", 'style', 'Consultant / Advisor', 'advisor',
    [], ['Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('AI Institute', 'Education', 'venture', 'CMO / Head of Marketing', 'marketing',
    [], [], ['Social strategy', 'Paid media', '360° marketing', 'Sales & BD', 'Influencers / PR']),
  P('Tanza Opticals', 'Optical / retail healthcare', 'consumer', 'Consultant / Advisor', 'advisor',
    [], ['Creative direction', 'Content production'], ['360° marketing']),
  P('POPSI', 'Beverages', 'food', 'Consultant / Advisor', 'advisor',
    [], ['Brand strategy', 'Naming & identity', 'Creative direction'], ['Go-to-market', 'Social strategy']),
  P('The Grid Store', 'Electronics / e-commerce', 'consumer', 'Consultant / Advisor', 'advisor',
    [], ['Brand strategy', 'Naming & identity', 'Brand architecture'], ['Go-to-market', 'Web / digital']),
  P('Beyond the Business', 'Management consultancy / digital marketing', 'corporate', 'CMO / Head of Marketing', 'marketing',
    ['Marketing leadership'], ['Brand strategy', 'Creative direction'], ['Social strategy', '360° marketing', 'Growth & revenue']),
  P('Celebrations', 'Events / corporate', 'food', 'Event Head', 'event-head',
    ['Team leadership', 'Operations / SOPs'], ['Creative direction'], ['Social strategy']),
  P('Xyklon', 'Mobile accessories / GCC', 'consumer', 'Consultant / Advisor', 'advisor',
    ['Operations / SOPs'], ['Brand strategy'], ['Growth & revenue']),
  P('Hand Revolution', 'Footwear / e-commerce', 'consumer', 'Founder / Co-founder', 'founder',
    ['CEO / business leadership', 'Operations / SOPs'], ['Brand strategy'], ['Growth & revenue', 'Web / digital']),
].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })).map((p) => ({
  ...p,
  search: [p.name, p.sector, p.role, INDUSTRIES[p.ind], ...p.l, ...p.b, ...p.m].join(' ').toLowerCase(),
}))

const FEATURED_NAMES = new Set(FEATURED.map((item) => item.name.trim().toLowerCase()))
const ROLE_ACCENTS = { ceo: '#ff5a52', founder: '#ff5a52', marketing: '#7ee2a8', creative: '#c9b8ff', advisor: '#c9b8ff', 'event-head': '#ffe14d' }
const ALL_WORK = [
  ...FEATURED,
  ...PROJECTS.filter((project) => !FEATURED_NAMES.has(project.name.trim().toLowerCase())).map((project) => ({
    ...project,
    slug: project.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    filter: project.roleKey,
    accent: ROLE_ACCENTS[project.roleKey] || '#c9b8ff',
    headline: project.role,
    summary: project.note || `Selected responsibilities across ${project.l.length + project.b.length + project.m.length} areas of leadership, brand and growth work.`,
    note: project.note || `${project.role} scope across leadership, brand and growth responsibilities.`,
    lead: [...project.l, ...project.b],
    mkt: project.m,
  })),
]
/* ---------- Data: static copy blocks ---------- */

const RANGE = [
  ['Business leadership', 'CEO / business-head responsibilities at DayOne Venture Studio and MoonBliss; founder-led work across selected consumer and education ventures.'],
  ['Marketing direction', 'CMO or marketing-lead scopes across restaurant, startup ecosystem, creative-community and hospitality projects.'],
  ['Creative agency execution', 'Creative Director scope at NKreatives, Coffee Klatch and Wayanad Trade Centre, alongside cross-sector creative assignments.'],
  ['Entrepreneurial thinking', 'Hands-on exposure to FMCG, skincare, fashion, hospitality, automotive, education, healthcare and other business categories.'],
]

const CAPS = [
  ['01', 'Business leadership & execution', 'Business priorities, owner accountability, cross-functional coordination, processes, SOPs and review cadences.', 'bg-[#ffe14d]'],
  ['02', 'CMO & integrated marketing', 'Market positioning, annual / quarterly plans, channel mix, campaign orchestration and marketing-to-business alignment.', 'bg-[#7ee2a8]'],
  ['03', 'Brand & creative direction', 'Naming, architecture, visual identity, brand voice, creative briefs, design consistency and content quality.', 'bg-[#ffcfae]'],
  ['04', 'Growth, acquisition & revenue', 'Paid marketing direction, customer acquisition priorities, sales coordination, go-to-market and commercial decision-making.', 'bg-[#80dcea]'],
  ['05', 'Social media & content systems', 'Platform positioning, content pillars, creative calendars, production direction, campaign formats and channel consistency.', 'bg-[#c9b8ff]'],
  ['06', 'Digital experience & partnerships', 'Website experience, launch assets, influencer / PR collaboration, external partners and brand touchpoint quality.', 'bg-[#ff5a52]'],
]

const STEPS = [
  ['01', 'Diagnose', 'bg-[#ffe14d]'],
  ['02', 'Position', 'bg-[#7ee2a8]'],
  ['03', 'Build the plan', 'bg-[#ffcfae]'],
  ['04', 'Lead execution', 'bg-[#c9b8ff]'],
  ['05', 'Measure & review', 'bg-[#80dcea]'],
  ['06', 'Improve & scale', 'bg-[#ff5a52]'],
]

const PROMISES = [
  ['01', 'Direction', 'Translate business objectives into a clear brand and marketing agenda, with priorities that teams can act on.', 'bg-[#ffe14d]'],
  ['02', 'Integration', 'Align creative, content, paid campaigns, digital, sales and partnerships rather than running them as isolated activities.', 'bg-[#7ee2a8]'],
  ['03', 'Ownership', 'Lead the cadence: briefs, responsibilities, reviews, quality, improvement cycles and escalation of blockers.', 'bg-[#ffcfae]'],
  ['04', 'Commercial awareness', 'Keep growth, customer acquisition and revenue relevance visible while developing differentiated brand experiences.', 'bg-[#c9b8ff]'],
]

const SIDE_NAV = [
  ['dashboard', '01', 'The Dashboard'],
  ['profile', '02', 'Executive Profile'],
  ['expertise', '03', 'What I Lead'],
  ['work', '04', 'Selected Work'],
  ['brands', '05', 'Brand Universe'],
  ['index', '06', 'Project Index'],
  ['promise', '07', 'Operating Promise'],
  ['contact', '08', 'Work With Me'],
]

const GROUPS = {
  lead: { dot: 'bg-[#ff5a52]', tag: 'text-[0.72rem] bg-[#ffe0dc]' },
  brand: { dot: 'bg-[#c9b8ff]', tag: 'text-[0.72rem] bg-[#ece6ff]' },
  mkt: { dot: 'bg-[#7ee2a8]', tag: 'text-[0.72rem] bg-[#dcf7e7]' },
}

const SEARCH_ICON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%23141414' stroke-width='2.6' stroke-linecap='round'%3E%3Ccircle cx='8.5' cy='8.5' r='6'/%3E%3Cpath d='M13 13l5 5'/%3E%3C/svg%3E\")"

/* ---------- Shared Tailwind class strings ---------- */

const pad = (n) => String(n).padStart(2, '0')

const GAP = 'gap-[clamp(14px,1.8vw,24px)]'
const SECTION = `flex flex-col ${GAP}`

// Keep page content visible immediately; image assets begin loading on mount.
const REVEAL = 'opacity-100 translate-y-0'

const FRAME = 'hu-checker relative border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px]'
const PAD = 'p-[clamp(18px,2.2vw,28px)]'
const CARD = `${FRAME} ${PAD} shadow-[6px_6px_0_#141414] max-[760px]:shadow-[4px_4px_0_#141414]`
const CARD_INK = `${FRAME} ${PAD} bg-[#141414] text-white shadow-[6px_6px_0_#ffe14d]`

const PILL = 'inline-block text-[0.75rem] font-extrabold uppercase tracking-[0.02em] px-[14px] py-1 border-2 border-[#141414] rounded-full'
const EYEBROW = 'inline-block text-[0.8rem] font-extrabold tracking-[0.08em] uppercase px-2.5 py-[3px] border-2 rounded-lg mb-[14px]'
const EYEBROW_WHITE = `${EYEBROW} bg-white border-[#141414]`
const H2 = 'text-[length:clamp(1.9rem,4vw,3.1rem)] font-black leading-[1.02] tracking-[-0.01em] [font-stretch:85%] uppercase max-w-[22ch]'
const LEAD = 'text-[#5b5b5b] text-[1.05rem] max-w-[62ch] mt-2.5'
const FINE = 'text-[length:clamp(0.9rem,1vw,1rem)] leading-[1.5] text-[#5b5b5b] mt-[18px] max-w-[90ch]'
const HL = 'px-[0.12em] box-decoration-clone'

const BTN_CORE =
  'inline-flex items-center gap-2.5 font-extrabold uppercase tracking-[0.02em] no-underline border-[3px] rounded-[14px] cursor-pointer transition-[transform,box-shadow] duration-150 ease-[ease] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px]'
const BTN_DARK = 'border-[#141414] shadow-[4px_4px_0_#141414] hover:shadow-[6px_6px_0_#141414] active:shadow-[1px_1px_0_#141414]'
const BTN_PAD = 'px-[22px] py-3'

const CHIP =
  'cursor-pointer text-[0.82rem] font-extrabold uppercase tracking-[0.02em] px-3.5 py-[7px] border-2 border-[#141414] rounded-full shadow-[2px_2px_0_#141414] transition-[background-color,transform] duration-150 hover:-translate-x-px hover:-translate-y-px'
const CHIP_SM = 'cursor-pointer text-[0.74rem] font-extrabold uppercase tracking-[0.02em] px-[11px] py-[5px] border-2 border-[#141414] rounded-full shadow-[2px_2px_0_#141414] transition-[background-color,transform] duration-150 hover:-translate-x-px hover:-translate-y-px'

/* ---------- Small components ---------- */

function Tags({ items, itemClass = 'text-[0.76rem] bg-white' }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t} className={`font-bold px-[9px] py-[3px] border-[1.5px] border-[#141414] rounded-full ${itemClass}`}>{t}</li>
      ))}
    </ul>
  )
}

function Dot({ bg }) {
  return <i className={`inline-block w-3 h-3 rounded-full border-2 border-[#141414] ${bg}`} />
}

function Bar({ n, max, fill }) {
  return (
    <span className="h-[7px] border-[1.5px] border-[#141414] rounded-full bg-white overflow-hidden" title={`${n} of ${max}`}>
      <i className={`block h-full ${fill}`} style={{ width: `${(n / max) * 100}%` }} />
    </span>
  )
}

function FilterChips({ map, value, onChange, small, label }) {
  const cls = small ? CHIP_SM : CHIP
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {Object.entries(map).map(([k, text]) => (
        <button key={k} type="button" className={`${cls} ${value === k ? 'bg-[#141414] text-white' : 'bg-white'}`} onClick={() => onChange(value === k ? 'all' : k)}>
          {text}
        </button>
      ))}
    </div>
  )
}

// Counts up when scrolled into view (skipped for reduced-motion users).
function CountUp({ to, pad: width = 0, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (t) => {
          const p = Math.min((t - t0) / 900, 1)
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3)))).padStart(width, '0')
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, width])

  return <span ref={ref} className={className}>{String(to).padStart(width, '0')}</span>
}

/* =========================================================
   PAGE
   ========================================================= */

export default function CreativePortfolio() {
  const rootRef = useRef(null)
  const topbarRef = useRef(null)
  const dialogRef = useRef(null)
  const sidebarRef = useRef(null)
  const sidebarListRef = useRef(null)

  const [active, setActive] = useState('dashboard')
  const [headerVisible, setHeaderVisible] = useState(true)
  const [workFilter, setWorkFilter] = useState('ceo')
  const [current, setCurrent] = useState(0)
  const [caseOpen, setCaseOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sectorIndexFilter, setSectorIndexFilter] = useState('all')
  const [openRows, setOpenRows] = useState(() => new Set())

  /* ---------- Document title ---------- */
  useEffect(() => {
    document.title = 'Creative Portfolio | Hashir Usman'
    return () => { document.title = 'Hashir Usman' }
  }, [])

  useEffect(() => {
    const sidebar = sidebarRef.current
    const list = sidebarListRef.current
    if (!sidebar || !list) return undefined

    const scrollSidebar = (event) => {
      if (event.deltaY === 0) return
      event.preventDefault()
      const scale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1
      list.scrollTop += event.deltaY * scale
    }

    sidebar.addEventListener('wheel', scrollSidebar, { passive: false })
    return () => sidebar.removeEventListener('wheel', scrollSidebar)
  }, [])

  /* ---------- Smooth scroll + topbar height (sticky offsets) ---------- */
  useEffect(() => {
    const html = document.documentElement
    const prev = { behavior: html.style.scrollBehavior, padding: html.style.scrollPaddingTop }
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) html.style.scrollBehavior = 'smooth'

    const sync = () => {
      const h = topbarRef.current ? topbarRef.current.offsetHeight : 96
      if (rootRef.current) rootRef.current.style.setProperty('--topbar-h', `${h}px`)
      html.style.scrollPaddingTop = `${h + 16}px`
    }
    sync()
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('resize', sync)
      html.style.scrollBehavior = prev.behavior
      html.style.scrollPaddingTop = prev.padding
    }
  }, [])

  /* Hide the sticky header while moving down; reveal it as soon as the visitor scrolls up. */
  useEffect(() => {
    let lastY = window.scrollY
    let direction = 0
    let travel = 0
    let raf = 0

    const update = () => {
      const y = window.scrollY
      const delta = y - lastY
      lastY = y

      if (y < 80) {
        direction = 0
        travel = 0
        setHeaderVisible(true)
      } else if (Math.abs(delta) > 0) {
        const nextDirection = Math.sign(delta)
        if (nextDirection !== direction) {
          direction = nextDirection
          travel = delta
        } else {
          travel += delta
        }

        if (travel > 12) setHeaderVisible(false)
        if (travel < -12) setHeaderVisible(true)
      }

      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  /* ---------- Scroll spy ---------- */
  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => { entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id) }) },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    rootRef.current.querySelectorAll('main section[id]').forEach((s) => spy.observe(s))
    return () => spy.disconnect()
  }, [])

  /* ---------- Case dialog ---------- */
  const visibleWorkCards = useMemo(
    () => ALL_WORK.map((f, i) => ({ f, i })).filter(({ f }) => matchesWorkFilter(f, workFilter)),
    [workFilter],
  )
  const visibleCases = visibleWorkCards.map(({ i }) => i)

  const openCase = (i) => {
    setCurrent(i)
    setCaseOpen(true)
    dialogRef.current.showModal()
  }
  const stepCase = (dir) => {
    const pos = visibleCases.indexOf(current)
    setCurrent(visibleCases[(pos + dir + visibleCases.length) % visibleCases.length])
  }
  const onDialogClick = (e) => {
    if (e.target === dialogRef.current || e.target.closest('[data-close]')) dialogRef.current.close()
  }
  const c = ALL_WORK[current]
  const workGallery = WORK_GALLERIES[c.slug] || []
  const workPackaging = WORK_PACKAGING[c.slug] || []
  const workVideos = WORK_VIDEOS[c.slug] || []

  /* ---------- Project index ---------- */
  const visibleProjects = useMemo(
    () => PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) =>
      (sectorIndexFilter === 'all' || p.ind === sectorIndexFilter) &&
      (!query || p.search.includes(query))),
    [sectorIndexFilter, query],
  )

  const toggleRow = (i) =>
    setOpenRows((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div
      ref={rootRef}
      className="hu-root min-h-screen overflow-x-clip bg-[#fff8ec] bg-[radial-gradient(rgba(20,20,20,0.08)_1px,transparent_1px)] bg-[length:22px_22px] text-[#141414] antialiased"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap');
        .hu-root { --topbar-h: 96px; font-family: Archivo, system-ui, -apple-system, "Segoe UI", sans-serif; }
        .hu-checker:not(.bg-cover) { background-image: repeating-conic-gradient(rgba(20,20,20,.045) 0% 25%, transparent 0% 50%); background-size: 48px 48px; }
        .hu-checker.value-proposition-card { background-color: #141414; background-image: repeating-conic-gradient(rgba(255,255,255,.055) 0% 25%, rgba(0,0,0,.08) 0% 50%); background-size: 48px 48px; }
        :where(.hu-root) :focus-visible { outline: 3px solid #5468ff; outline-offset: 3px; }
        @keyframes pop { from { transform: translateY(14px) scale(0.98); opacity: 0; } }
      `}</style>

      {/* ============ TOP BAR ============ */}
      <header ref={topbarRef} className={`sticky top-0 z-50 border-b-[3px] border-[#141414] bg-[#fffdf8] transition-transform duration-300 ease-out ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`} id="top">
        <div className="max-w-[1920px] mx-auto relative grid grid-cols-[1fr_auto] items-center gap-6 px-[clamp(16px,3vw,36px)] py-3">
          <a className="flex items-center gap-3 no-underline" href="https://hashirusman.com" target="_blank" rel="noopener noreferrer" aria-label="Visit hashirusman.com">
            <span className="grid place-items-center w-[58px] h-[52px] text-[1.6rem] font-black bg-[#ffe14d] border-[3px] border-[#141414] rounded-xl shadow-[3px_3px_0_#141414]">HU</span>
            <span className="flex flex-col leading-[1.05]">
              <strong className="text-[1.6rem] font-black tracking-[0.02em]">STUDIO</strong>
              <small className="text-[0.72rem] font-semibold uppercase max-[760px]:hidden">Hashir Usman  Creative Portfolio</small>
            </span>
          </a>

          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-wrap items-center justify-center gap-3 max-[1240px]:relative max-[1240px]:left-auto max-[1240px]:top-auto max-[1240px]:col-span-2 max-[1240px]:col-start-1 max-[1240px]:row-start-2 max-[1240px]:translate-x-0 max-[1240px]:translate-y-0 max-[1024px]:hidden">
            <span className="text-sm font-semibold text-[#141414]">More about me?</span>
            <a href="/" target="_blank" rel="noopener noreferrer" className={`${BTN_CORE} ${BTN_DARK} px-4 py-2 text-[0.78rem] bg-[#ffe14d] text-[#141414]`}>
              Visit Hashirusman.com <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="col-start-2 row-start-1 flex items-center gap-3">
            <a
              className={`${BTN_CORE} ${BTN_DARK} ${BTN_PAD} bg-[#ff5a52] max-[760px]:hidden`}
              href="#contact"
            >
              Let's talk <span aria-hidden="true">→</span>
            </a>

            <Link
              to="/"
              aria-label="Go to homepage"
              className="hidden h-11 items-center justify-center rounded-xl border-[3px] border-[#141414] bg-[#ffe14d] px-3 text-[0.78rem] font-black uppercase no-underline shadow-[3px_3px_0_#141414] max-[1024px]:flex"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className={`max-w-[1920px] mx-auto grid grid-cols-[250px_minmax(0,1fr)] max-[1024px]:grid-cols-1 ${GAP} px-[clamp(16px,3vw,36px)] pt-[clamp(14px,1.8vw,24px)] pb-10`}>
        {/* ============ SIDE NAV ============ */}
        <aside
          ref={sidebarRef}
          id="sidenav"
          aria-label="Sections"
          className="relative max-[1024px]:hidden"
        >
          <div className="hu-checker sticky top-[calc(var(--topbar-h)_+_20px)] flex h-[calc(100vh_-_var(--topbar-h)_-_40px)] min-h-0 flex-col max-h-[calc(100vh_-_var(--topbar-h)_-_40px)] bg-[#ffe14d] border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px] shadow-[6px_6px_0_#141414] max-[760px]:shadow-[4px_4px_0_#141414] pt-[22px] px-4 pb-4 overflow-hidden">
            <p className="font-black text-[1rem] tracking-[0.04em] uppercase px-2 pb-3">Navigation</p>
            <ol ref={sidebarListRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
              {SIDE_NAV.map(([id, no, label], i) => (
                <li key={id} className={i > 0 ? 'border-t-2 border-[#141414]' : ''}>
                  <a
                    href={`#${id}`}
                    className={`flex gap-3 my-1.5 p-2.5 text-[0.88rem] font-extrabold uppercase no-underline border-[3px] rounded-xl transition-[background-color,border-color] duration-150 ${
                      active === id
                        ? 'bg-[#ff5a52] border-[#141414] shadow-[3px_3px_0_#141414]'
                        : 'border-transparent hover:border-[#141414] hover:bg-white/[0.45]'
                    }`}
                  >
                    <b className="min-w-[22px]">{no}</b> {label}
                  </a>
                </li>
              ))}
            </ol>
            <div className="hu-checker relative mt-3 shrink-0 px-4 py-[18px] bg-[#5468ff] text-white border-[3px] border-[#141414] rounded-[14px]">
              <span className="absolute -top-[18px] right-2 text-[2.4rem] text-[#ffe14d] leading-none [text-shadow:2px_2px_0_#141414]" aria-hidden="true">✦</span>
              <p className="font-black uppercase tracking-[0.03em] mb-1.5">The mindset</p>
              <p className="font-bold text-[1.05rem] leading-[1.3]">Build with clarity.<br />Scale with intention.</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex flex-col gap-[clamp(48px,6vw,80px)]">
          {/* ============ 01 DASHBOARD ============ */}
          <section className={SECTION} id="dashboard" aria-labelledby="dash-title">
            <div className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] max-[1024px]:grid-cols-1 ${GAP}`}>
              <article
                data-reveal
                className={`${CARD} ${REVEAL} order-2 relative min-h-[520px] overflow-hidden bg-[#ffcfae] flex flex-col gap-[18px] max-[760px]:min-h-[460px]`}
              >
                <span className={`${PILL} bg-[#ffe14d] self-start`}>01 / The creative leadership dashboard</span>
                <h1 id="dash-title" className="text-[length:clamp(2.4rem,5.3vw,5.8rem)] font-black [font-stretch:82%] leading-[0.92] tracking-[-0.02em] uppercase">
                  Think.<br />
                  Create.<br />
                  Execute.<br />
                  <span className="inline-block rounded-xl border-[3px] border-[#141414] bg-[#ffe14d] px-3 py-[0.08em]">Make moves.</span>
                </h1>
                <p className="max-w-[48ch] text-[clamp(1rem,1.5vw,1.35rem)] font-semibold leading-[1.4]">
                  Business strategy. Creative direction. Marketing leadership. Growth execution.
                </p>
                <a href="#work" className={`${BTN_CORE} ${BTN_DARK} mt-auto w-fit bg-[#ff5a52] px-6 py-3 text-[#141414]`}>
                  Explore my work <span aria-hidden="true">→</span>
                </a>
                <div aria-hidden="true" className="pointer-events-none absolute bottom-8 right-8 flex items-center gap-5 max-[760px]:bottom-5 max-[760px]:right-5">
                  <span className="size-8 rotate-45 bg-[#5468ff] sm:size-10" />
                  <span className="size-4 rounded-full border-[3px] border-[#141414] bg-[#ffe14d] sm:size-5" />
                </div>
              </article>

              <article
                data-reveal
                className={`${CARD} ${REVEAL} order-1 relative isolate min-h-[360px] overflow-hidden bg-cover bg-center max-[760px]:min-h-[min(112vw,460px)]`}
                style={{ backgroundImage: "url('/hashir.PNG')", backgroundPosition: 'center 38%' }}
              >
                <span className="absolute right-4 top-4 z-10 grid size-14 place-items-center rounded-xl border-[3px] border-[#141414] bg-[#ffe14d] text-xl font-black shadow-[3px_3px_0_#141414]">01</span>
                <span className="absolute bottom-4 left-1/2 z-10 w-[min(88%,420px)] -translate-x-1/2 rounded-xl border-[3px] border-[#141414] bg-[#c9b8ff] px-5 py-3 text-center text-[clamp(1.5rem,3vw,2.5rem)] font-black uppercase leading-none shadow-[4px_4px_0_#141414] sm:px-7 sm:py-4">Your move.</span>
              </article>
            </div>

            <div className={`grid grid-cols-4 max-[1240px]:grid-cols-2 max-[760px]:grid-cols-1 ${GAP}`}>
              {[
                ['bg-[#ffe14d]', 32, 0, 'Brand entries in the portfolio'],
                ['bg-[#7ee2a8]', 8, 2, 'Featured case studies'],
                ['bg-[#80dcea]', 6, 2, 'Core leadership capabilities'],
              ].map(([bg, n, w, label]) => (
                <div key={label} data-reveal className={`${CARD} ${REVEAL} ${bg} flex flex-wrap items-center gap-x-4 gap-y-2 min-h-[120px]`}>
                  <CountUp to={n} pad={w} className="text-[length:clamp(2.4rem,4.2vw,3.8rem)] font-black leading-none [font-stretch:85%]" />
                  <span className="font-extrabold uppercase text-[0.85rem] leading-[1.2] max-w-[14ch]">{label}</span>
                </div>
              ))}
              <div data-reveal className={`${CARD} ${REVEAL} bg-[#ff5a52] flex flex-wrap items-center gap-x-4 gap-y-2 min-h-[120px]`}>
                <span className="text-[length:clamp(2.4rem,4.2vw,3.8rem)] font-black leading-none [font-stretch:85%]">360°</span>
                <span className="font-extrabold uppercase text-[0.85rem] leading-[1.2] max-w-[14ch]">Marketing thinking</span>
              </div>
            </div>

          </section>

          {/* ============ 02 PROFILE ============ */}
          <section className={SECTION} id="profile" aria-labelledby="profile-title">
            <header data-reveal className={REVEAL}>
              <span className={EYEBROW_WHITE}>02 / Executive profile</span>
              <h2 id="profile-title" className={H2}>Business thinking. Creative instincts. Execution discipline.</h2>
              <p className={LEAD}>A cross-functional leader working at the intersection of venture operations, brand building, integrated marketing and commercial growth.</p>
            </header>

            <div className={`grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] max-[1024px]:grid-cols-1 ${GAP}`}>
              <article data-reveal className={`${CARD} ${REVEAL} bg-[#fffdf8] flex flex-col gap-4`}>
                <p className="text-[length:clamp(1.15rem,1.8vw,1.45rem)] font-extrabold leading-[1.35]">I bring together the perspective of a business head, the judgement of a marketing leader and the creative direction required to make an idea visible in the market.</p>
                <p className="text-[length:clamp(1rem,1.15vw,1.125rem)] leading-[1.55] text-[#5b5b5b]">My work has involved leading venture-level priorities, defining brand systems, planning and coordinating 360° marketing, directing content and campaigns, supporting paid acquisition, shaping go-to-market activity, and connecting marketing choices with revenue objectives.</p>
                <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-3 mt-auto">
                  {[
                    ['32', 'Brand entries & concepts'],
                    ['CEO → CMO', 'Leadership & marketing range'],
                    ['Strategy → Delivery', 'Operating orientation'],
                  ].map(([b, s]) => (
                    <div key={b} className="flex flex-col gap-1 p-[14px] border-2 border-[#141414] rounded-xl bg-[#fff8ec]">
                      <b className="text-[length:clamp(1.1rem,1.7vw,1.45rem)] font-black leading-[1.1]">{b}</b>
                      <span className="text-[0.74rem] font-bold uppercase text-[#5b5b5b]">{s}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article data-reveal className={`${CARD} ${REVEAL} bg-[#ffe14d]`}>
                <h3 className="text-[length:clamp(1rem,1.15vw,1.125rem)] font-extrabold uppercase tracking-[0.04em] mb-[14px]">The leadership range</h3>
                <ul className="flex flex-col gap-3">
                  {RANGE.map(([b, s]) => (
                    <li key={b} className="flex flex-col gap-1 px-4 py-3.5 bg-white border-2 border-[#141414] rounded-xl">
                      <b className="uppercase text-[length:clamp(0.9rem,1vw,1rem)] font-black">{b}</b>
                      <span className="text-[length:clamp(0.98rem,1.1vw,1.1rem)] leading-[1.5]">{s}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <article data-reveal className={`${CARD_INK} value-proposition-card ${REVEAL}`}>
              <span className={`${EYEBROW} bg-[#ff5a52] text-[#141414] border-[#ff5a52]`}>My value proposition</span>
              <p className="max-w-[52ch] text-[length:clamp(1.15rem,2.1vw,1.65rem)] font-extrabold leading-[1.3] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">I can translate an ambition into an operating plan, a market-facing brand, a coordinated marketing engine and a team that knows what to execute.</p>
            </article>
          </section>

          {/* ============ 03 EXPERTISE ============ */}
          <section className={SECTION} id="expertise" aria-labelledby="exp-title">
            <header data-reveal className={REVEAL}>
              <span className={EYEBROW_WHITE}>03 / Executive toolkit</span>
              <h2 id="exp-title" className={H2}>What I can lead.</h2>
              <p className={LEAD}>Not a list of software tools — the functions and decisions I can take responsibility for.</p>
            </header>

            <div className={`grid grid-cols-3 max-[1024px]:grid-cols-2 max-[760px]:grid-cols-1 ${GAP}`}>
              {CAPS.map(([no, title, text, bg]) => (
                <article key={no} data-reveal className={`${CARD} ${REVEAL} ${bg} flex flex-col gap-2 hover:shadow-[9px_9px_0_#141414]`}>
                  <span className="self-start text-[0.8rem] font-black px-2.5 py-0.5 border-2 border-[#141414] rounded-lg bg-white">{no}</span>
                  <h3 className="text-[1.2rem] font-black uppercase leading-[1.15] mt-1.5">{title}</h3>
                  <p className="text-[length:clamp(1rem,1.1vw,1.1rem)] leading-[1.5]">{text}</p>
                </article>
              ))}
            </div>

            <article data-reveal className={`${CARD} ${REVEAL} bg-[#5468ff] text-white`}>
              <h3 className="text-[length:clamp(1.5rem,2.6vw,2.2rem)] font-black uppercase mb-[18px]">How I think about delivery</h3>
              <ol className="grid grid-cols-6 max-[1240px]:grid-cols-3 max-[760px]:grid-cols-2 gap-3">
                {STEPS.map(([no, label, bg], i) => (
                  <li
                    key={no}
                    className={`hu-checker relative flex flex-col gap-1.5 p-[14px] text-[#141414] font-black uppercase text-[0.95rem] leading-[1.15] border-[3px] border-[#141414] rounded-xl ${bg} ${
                      i < STEPS.length - 1
                        ? "after:content-['→'] after:absolute after:-right-3 after:top-1/2 after:translate-x-1/2 after:-translate-y-1/2 after:text-white after:font-black after:z-[1] max-[1240px]:after:hidden"
                        : ''
                    }`}
                  >
                    <b className="text-[0.78rem]">{no}</b> {label}
                  </li>
                ))}
              </ol>
              <p className={`${FINE} !text-white/[0.82]`}>Scope is project-specific: a selected capability indicates involvement, not that every task was personally executed. Some contributions were leadership, some strategic direction, some creative supervision and some hands-on delivery.</p>
            </article>
          </section>

          {/* ============ 04 SELECTED WORK ============ */}
          <section className={SECTION} id="work" aria-labelledby="work-title">
            <header data-reveal className={`${REVEAL} flex justify-between items-end gap-5 flex-wrap`}>
              <div>
                <span className={EYEBROW_WHITE}>04 / Selected contributions</span>
                <h2 id="work-title" className={H2}>Selected leadership work.</h2>
                <p className={LEAD}>Leadership, strategy and execution across selected brands and business environments.</p>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter featured work by role">
                {WORK_FILTERS.map(([role, label]) => (
                  <button
                    key={role}
                    type="button"
                    className={`${CHIP} ${workFilter === role ? 'bg-[#141414] text-white' : 'bg-white'}`}
                    onClick={() => setWorkFilter(workFilter === role ? 'all' : role)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </header>

            <div className={`grid grid-cols-2 max-[760px]:grid-cols-1 ${GAP}`}>
              {visibleWorkCards.map(({ f, i }) => {
                return (
                  <button
                    key={f.slug}
                    type="button"
                    data-reveal
                    data-in="true"
                    onClick={() => openCase(i)}
                    style={{ backgroundColor: '#fffdf8', backgroundImage: `repeating-conic-gradient(color-mix(in srgb, ${f.accent} 15%, transparent) 0% 25%, #fffdf8 0% 50%)`, backgroundSize: '48px 48px' }}
                    className={`hu-checker group flex flex-col gap-[14px] text-left cursor-pointer border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px] shadow-[6px_6px_0_#141414] max-[760px]:shadow-[4px_4px_0_#141414] hover:shadow-[9px_9px_0_#141414] p-[18px] bg-[#fffdf8] ${REVEAL}`}
                  >
                    <div className="flex gap-4 items-center">
                      <Logo slug={f.slug} name={f.name} className="flex-none w-[86px] h-[86px] border-[3px] border-[#141414] rounded-xl overflow-hidden" />
                      <div>
                        <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.05em] text-[#5b5b5b]">{pad(i + 1)} / {f.sector}</p>
                        <h3 className="text-[length:clamp(1.25rem,2vw,1.6rem)] font-black leading-[1.05] [font-stretch:90%]">{f.name}</h3>
                        <span
                          className="inline-block mt-1.5 text-[0.74rem] font-extrabold uppercase px-2.5 py-[3px] border-2 border-[#141414] rounded-full"
                          style={{ background: f.accent }}
                        >
                          {f.role}
                        </span>
                      </div>
                    </div>
                    <p className="font-extrabold text-[1.02rem]">{f.headline}</p>
                    <p className="text-[length:clamp(1rem,1.1vw,1.1rem)] leading-[1.5] text-[#5b5b5b]">{f.summary}</p>
                    <span className="mt-auto flex justify-between items-center pt-3 border-t-2 border-dashed border-[#141414] text-[0.8rem] font-black uppercase">
                      View case scope{' '}
                      <span
                        className="grid place-items-center w-[34px] h-[34px] border-2 border-[#141414] rounded-full transition-transform duration-200 group-hover:-rotate-45"
                        style={{ background: f.accent }}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ============ 05 BRAND UNIVERSE ============ */}
          <section className={SECTION} id="brands" aria-labelledby="brands-title">
            <header data-reveal className={REVEAL}>
              <span className={EYEBROW_WHITE}>05 / Identity breadth</span>
              <h2 id="brands-title" className={H2}>Different categories. Different expressions.</h2>
              <p className={LEAD}>Visual examples from the brand assets supplied for this portfolio. Brand identities and creative contributions vary by project and role.</p>
            </header>

            <div className="grid grid-cols-5 max-[1240px]:grid-cols-4 max-[760px]:grid-cols-2 gap-[14px]">
              {BRANDS.map(([slug, name, sector]) => (
                <figure
                  key={slug}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 320px' }}
                  className="relative m-0 border-[3px] border-[#141414] rounded-[14px] overflow-hidden bg-white shadow-[4px_4px_0_#141414] hover:shadow-[7px_7px_0_#141414]"
                >
                  <Logo slug={slug} name={name} cover={!['admos', 'founderverse', 'oxtel', 'xyklon', ...ZOOMED_LOGOS].includes(slug)} className="block w-full aspect-[453/293] bg-white" style={{ backgroundColor: LOGO_BACKGROUNDS[slug] || '#fff' }} />
                  <figcaption className="flex flex-col gap-px px-2.5 py-2 text-[0.76rem] font-extrabold border-t-[3px] border-[#141414] bg-[#fffdf8]">
                    {name}
                    <small className="font-semibold text-[#5b5b5b] normal-case">{sector}</small>
                  </figcaption>
                </figure>
              ))}
            </div>

            <p className={FINE}>Shown here are supplied brand marks and identity variations across startup ecosystems, consumer products, food, hospitality, fashion, skincare and community concepts. These images illustrate the breadth of projects, rather than claiming that every visual asset was personally designed by Hashir.</p>
          </section>

          {/* ============ 06 PROJECT INDEX ============ */}
          <section className={SECTION} id="index" aria-labelledby="index-title">
            <header data-reveal className={REVEAL}>
              <span className={EYEBROW_WHITE}>06 / Project contribution directory</span>
              <h2 id="index-title" className={H2}>Full project index.</h2>
              <p className={LEAD}>Browse all {PROJECTS.length} projects by sector, then expand a brand to see its leadership, brand &amp; creative, and marketing &amp; growth responsibilities.</p>
            </header>

            <div data-reveal className={`${CARD} ${REVEAL} bg-[#fffdf8] flex flex-col gap-4`}>
              <div className="flex flex-col gap-3">
                <label className="block">
                  <span className="sr-only">Search projects</span>
                  <input
                    type="search"
                    placeholder="Search brand, sector or skill…"
                    autoComplete="off"
                    onChange={(e) => setQuery(e.target.value.trim().toLowerCase())}
                    style={{ backgroundImage: SEARCH_ICON, backgroundRepeat: 'no-repeat', backgroundPosition: '14px center' }}
                    className="w-full font-semibold py-3 pr-4 pl-11 border-[3px] border-[#141414] rounded-xl bg-[#fff8ec] focus:[outline:none] focus:shadow-[4px_4px_0_#141414] focus:bg-white"
                  />
                </label>
                <FilterChips map={INDUSTRY_FILTERS} value={sectorIndexFilter} onChange={setSectorIndexFilter} label="Filter projects by sector" />
              </div>

              <div className="flex flex-wrap gap-4 items-center text-[0.78rem] font-extrabold uppercase" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5"><Dot bg="bg-[#ff5a52]" />Leadership</span>
                <span className="inline-flex items-center gap-1.5"><Dot bg="bg-[#c9b8ff]" />Brand &amp; creative</span>
                <span className="inline-flex items-center gap-1.5"><Dot bg="bg-[#7ee2a8]" />Marketing &amp; growth</span>
                <span className="inline-flex items-center gap-1.5 ml-auto max-[760px]:ml-0 px-2.5 py-[3px] border-2 border-[#141414] rounded-full bg-[#ffe14d]">
                  {visibleProjects.length} of {PROJECTS.length} projects
                </span>
              </div>

              <ul className="flex flex-col gap-2.5">
                {visibleProjects.map(({ p, i }) => {
                  const open = openRows.has(i)
                  return (
                    <li key={p.name} className={`border-2 border-[#141414] rounded-xl bg-[#fffdf8] overflow-hidden ${open ? 'shadow-[4px_4px_0_#141414]' : ''}`}>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`row-${i}`}
                        onClick={() => toggleRow(i)}
                        className="w-full grid grid-cols-[44px_minmax(0,1.4fr)_minmax(0,1fr)_150px_30px] max-[760px]:grid-cols-[34px_minmax(0,1fr)_26px] items-center gap-3 px-[14px] py-3 text-left cursor-pointer bg-transparent border-0 hover:bg-[#fff8ec]"
                      >
                        <span className="font-black text-[0.9rem]">{pad(i + 1)}</span>
                        <span className="font-black text-[0.98rem] leading-[1.15]">
                          {p.name}
                          <span className="block font-semibold text-[length:clamp(0.9rem,1vw,1rem)] text-[#5b5b5b] normal-case">{p.sector}</span>
                        </span>
                        <span
                          className="justify-self-start text-[0.72rem] font-extrabold uppercase px-[9px] py-[3px] border-2 border-[#141414] rounded-full bg-[#ffe14d] max-[760px]:col-start-2"
                        >
                          {p.role}
                        </span>
                        <span className="flex flex-col gap-1 max-[760px]:col-start-2" aria-hidden="true">
                          <Bar n={p.l.length} max={MAX.l} fill="bg-[#ff5a52]" />
                          <Bar n={p.b.length} max={MAX.b} fill="bg-[#c9b8ff]" />
                          <Bar n={p.m.length} max={MAX.m} fill="bg-[#7ee2a8]" />
                        </span>
                        <span
                          className={`font-black text-[1.2rem] text-center transition-transform duration-200 max-[760px]:row-start-1 max-[760px]:col-start-3 ${open ? 'rotate-45' : ''}`}
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </button>
                      <div
                        id={`row-${i}`}
                        className={`${open ? 'grid' : 'hidden'} pt-1 pr-[14px] pb-4 pl-[70px] max-[760px]:pl-[14px] gap-3 grid-cols-3 max-[760px]:grid-cols-1`}
                      >
                        {p.note ? (
                          <p className="col-span-full text-[length:clamp(0.98rem,1.05vw,1.08rem)] leading-[1.5] text-[#5b5b5b]">{p.note}</p>
                        ) : (
                          [['lead', 'Leadership', p.l], ['brand', 'Brand & creative', p.b], ['mkt', 'Marketing & growth', p.m]].map(([k, title, items]) => (
                            <div key={k}>
                              <h5 className="text-[0.74rem] font-black uppercase mb-2 flex items-center gap-1.5"><Dot bg={GROUPS[k].dot} />{title}</h5>
                              {items.length ? <Tags items={items} itemClass={GROUPS[k].tag} /> : <p className="text-[0.82rem] text-[#5b5b5b]">—</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
              {visibleProjects.length === 0 && (
                <p className="text-center p-[26px] font-extrabold border-2 border-dashed border-[#141414] rounded-xl">No projects match that filter.</p>
              )}
            </div>
          </section>

          {/* ============ 07 OPERATING PROMISE ============ */}
          <section className={SECTION} id="promise" aria-labelledby="promise-title">
            <header data-reveal className={REVEAL}>
              <span className={EYEBROW_WHITE}>07 / The operating promise</span>
              <h2 id="promise-title" className={H2}>A leader who gets the work moving.</h2>
              <p className={LEAD}>Good creative work needs a commercial reason. Good marketing needs a plan. Good plans need accountable execution.</p>
            </header>

            <div className={`grid grid-cols-4 max-[1240px]:grid-cols-2 max-[760px]:grid-cols-1 ${GAP}`}>
              {PROMISES.map(([no, title, text, bg]) => (
                <article key={no} data-reveal className={`${CARD} ${REVEAL} ${bg} flex flex-col gap-2.5`}>
                  <span className="text-[2.6rem] font-black leading-none [font-stretch:80%]">{no}</span>
                  <h3 className="text-[1.2rem] font-black uppercase">{title}</h3>
                  <p className="text-[length:clamp(1rem,1.1vw,1.1rem)] leading-[1.5]">{text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ============ 08 CONTACT ============ */}
          <section className={SECTION} id="contact" aria-labelledby="contact-title">
            <article
              data-reveal
              className={`${FRAME} ${REVEAL} bg-[#f4f4f4] text-[#141414] shadow-[6px_6px_0_#ffe14d] flex flex-col gap-2.5 p-[clamp(26px,4vw,48px)] overflow-hidden`}
            >
              <span className={`${EYEBROW} bg-[#ffe14d] border-[#ffe14d] self-start`}>08 / Work with me</span>
              <h2 id="contact-title" className="text-[length:clamp(2rem,4.6vw,3.8rem)] font-black uppercase leading-none [font-stretch:85%]">
                Let's build with clarity.<br /><span className={`${HL} bg-[#5468ff] text-white`}>Scale with intention.</span>
              </h2>
              <p className="text-[1.6rem] font-black mt-4">Hashir Usman</p>
              <p className="text-[#141414]/75">Business &amp; Marketing Leadership · Creative Direction · Venture Building</p>
              <p className="max-w-[54ch] text-[#141414]/75">Have a project in mind? Call me directly or send a note through the contact form.</p>
              <div className="flex flex-wrap gap-3 mt-2 relative z-[1]">
                <a className={`${BTN_CORE} ${BTN_DARK} ${BTN_PAD} bg-[#ff5a52] text-[#141414]`} href="tel:+917789800898">Call +91 77 898 00 898 <span aria-hidden="true">↗</span></a>
                <Link className={`${BTN_CORE} ${BTN_DARK} ${BTN_PAD} bg-[#ffe14d] text-[#141414]`} to="/contact">Email / contact form <span aria-hidden="true">↗</span></Link>
                <a className={`${BTN_CORE} ${BTN_DARK} ${BTN_PAD} bg-[#ffe14d] text-[#141414]`} href="#top">Back to top <span aria-hidden="true">↑</span></a>
              </div>
            </article>
          </section>
        </main>
      </div>

      {/* ============ CASE DETAIL DIALOG ============ */}
      <dialog
        ref={dialogRef}
        aria-labelledby="caseName"
        data-lenis-prevent
        onClose={() => setCaseOpen(false)}
        onClick={onDialogClick}
        className="m-auto w-[min(1040px,calc(100%_-_28px))] max-h-[calc(100dvh_-_24px)] overflow-y-auto overscroll-contain touch-pan-y p-0 border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px] shadow-[10px_10px_0_#141414] bg-[#fffdf8] text-[#141414] backdrop:bg-[rgba(20,20,20,0.55)] backdrop:backdrop-blur-[3px] open:animate-[pop_0.22s_ease-out]"
      >
        {caseOpen && <div key={current} className="relative flex flex-col gap-[14px] p-[clamp(20px,3vw,34px)]">
          <button
            type="button"
            data-close
            aria-label="Close"
            className="absolute top-[14px] right-[14px] w-10 h-10 text-[1.6rem] font-black leading-none border-[3px] border-[#141414] rounded-[10px] bg-[#ff5a52] shadow-[3px_3px_0_#141414] cursor-pointer"
          >
            ×
          </button>
          <div
            className="flex gap-[18px] items-center max-[760px]:flex-col max-[760px]:items-start p-4 border-[3px] border-[#141414] rounded-[14px] mr-[52px]"
            style={{ background: c.accent }}
          >
            <Logo slug={c.slug} name={c.name} className="w-24 h-24 shrink-0 border-[3px] border-[#141414] rounded-xl overflow-hidden" />
            <div>
              <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.05em]">{pad(current + 1)} / {c.sector}</p>
              <h3 id="caseName" className="text-[length:clamp(1.5rem,3vw,2.2rem)] font-black leading-none">{c.name}</h3>
              <p className="font-extrabold uppercase text-[0.85rem] mt-1">{c.role}</p>
            </div>
          </div>
          <h4 className="text-[1.25rem] font-black">{c.headline}</h4>
          <p>{c.summary}</p>
          <div className="grid grid-cols-2 max-[760px]:grid-cols-1 gap-[14px]">
            <div className="p-[14px] border-2 border-[#141414] rounded-xl bg-[#fff8ec]">
              <h5 className="text-[0.8rem] font-black uppercase mb-2.5">Leadership &amp; brand</h5>
              <Tags items={c.lead} />
            </div>
            <div className="p-[14px] border-2 border-[#141414] rounded-xl bg-[#fff8ec]">
              <h5 className="text-[0.8rem] font-black uppercase mb-2.5">Marketing &amp; growth</h5>
              <Tags items={c.mkt} />
            </div>
          </div>
          <p className="text-[length:clamp(0.98rem,1.05vw,1.08rem)] leading-[1.5] text-[#5b5b5b] italic">{c.note}</p>
          {workGallery.length > 0 && (
            <section aria-label={`${c.name} gallery`} className="flex flex-col gap-3">
              <h4 className="text-[0.9rem] font-black uppercase">Gallery</h4>
              <SocialAssetGrid items={workGallery} />
            </section>
          )}
          {workPackaging.length > 0 && (
            <section aria-label={`${c.name} packaging`} className="flex flex-col gap-3">
              <h4 className="text-[0.9rem] font-black uppercase">Product packaging concept</h4>
              <div className="grid items-start gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, 150px), ${c.slug === 'bare-logic' ? 250 : 190}px))` }}>
                {workPackaging.map(([file, label]) => (
                  <figure key={file} className="m-0 min-w-0 overflow-hidden rounded-lg border-2 border-[#141414] bg-white shadow-[2px_2px_0_#141414]">
                    <div className={`grid ${file === 'nothingelse.png' ? 'aspect-[16/9]' : c.slug === 'bare-logic' ? 'aspect-[4/3]' : 'aspect-[4/5]'} place-items-center overflow-hidden bg-[#f3f0eb]`}><img src={`/packaging/${file}`} alt={label} loading="lazy" decoding="async" className="block h-full w-full object-contain" /></div>
                    <figcaption className="border-t-2 border-[#141414] px-2 py-1.5 text-[0.7rem] font-bold leading-tight">{label}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
          {workVideos.length > 0 && (
            <section aria-label={`${c.name} videos`} className="flex flex-col gap-3">
              <h4 className="text-[0.9rem] font-black uppercase">Videos</h4>
              <div className="grid items-start gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 190px))' }}>
                {workVideos.map(({ src, title, thumbnail }) => (
                  <div key={src} className="min-w-0 overflow-hidden rounded-lg border-2 border-[#141414] bg-white shadow-[2px_2px_0_#141414]">
                    <DeferredInstagramEmbed src={src} title={title} thumbnail={thumbnail} />
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="flex justify-between">
            <button type="button" className={`${BTN_CORE} ${BTN_DARK} bg-white px-4 py-2 text-[0.85rem]`} onClick={() => stepCase(-1)}>← Prev</button>
            <button type="button" className={`${BTN_CORE} ${BTN_DARK} bg-white px-4 py-2 text-[0.85rem]`} onClick={() => stepCase(1)}>Next →</button>
          </div>
        </div>}
      </dialog>
    </div>
  )
}
