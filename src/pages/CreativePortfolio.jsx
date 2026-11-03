import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* =========================================================
   HU STUDIO — Creative Portfolio (page route)
   Converted from the original HTML + CSS + JS to React + Tailwind.

   IMAGES: brand marks are loaded from the supplied ventures assets.
   ========================================================= */

const LOGO_ASSETS = {
  dayone: 'davone.png',
  'start-x': 'START-x.png',
  'hey-dossa': 'heydossa.png',
  'moon-bliss': 'moonBLISS.png',
  zaati: 'zaati.png',
  'de-coff': 'DE-COFF.png',
  'house-of-bliss': 'HOUSE-of-Biss.png',
  'hungry-potato': 'hungry-potato.png',
  carbroker: 'CarBrOker.png',
  'curry-bag': 'CURRY-BAG.png',
  'suite-spot': 'SUITE-SPOT.png',
  'no-two': 'NOWO.png',
  hyzo: 'hyzo.jpeg',
  ezka: 'ezka.png',
  'hosther-hostels': 'Hosther•hostels.png',
  'ai-designers': 'aidesignersecosystem.png',
  'sol-for-her': 'sOl.png',
  'nothing-else': 'nothingelse.png',
  'bare-logic': 'barelogic.png',
}

function Logo({ slug, name, className = '' }) {
  const asset = LOGO_ASSETS[slug]
  if (asset) {
    return (
      <img
        src={`/ventures/${asset}`}
        alt={`${name} logo`}
        loading="lazy"
        decoding="async"
        className={`bg-white object-contain ${className}`}
      />
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

/* ---------- Data: featured case studies ---------- */

const FEATURED = [
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
    slug: 'moon-bliss', name: 'Moon Bliss', sector: "Women's wellness", role: 'CEO / Business Head',
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
    slug: 'start-x', name: 'START-X', sector: 'Startup ecosystem', role: 'Marketing / Growth Lead',
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
]

const WORK_FILTERS = [
  ['all', 'All 8'],
  ['ceo', 'Business head'],
  ['founder', 'Founder'],
  ['marketing', 'Marketing lead'],
  ['creative', 'Creative director'],
  ['marketing360', '360 Degree Marketing'],
]

const matchesWorkFilter = (item, filter) => {
  if (filter === 'all') return true
  if (filter === 'marketing360') return item.mkt.some((scope) => scope.includes('360°'))
  return item.filter === filter
}

/* ---------- Data: brand universe (logo wall) ---------- */

const BRANDS = [
  ['start-x', 'START-X', 'Startup ecosystem'], ['hey-dossa', 'Hey Dossa', 'Food & beverage'],
  ['moon-bliss', 'Moon Bliss', "Women's wellness"], ['zaati', 'Zaati', 'Restaurant'],
  ['de-coff', 'De Coff', 'Café'], ['house-of-bliss', 'House of Bliss', 'Lifestyle'],
  ['hungry-potato', 'Hungry Potato', 'Food & beverage'], ['carbroker', 'CarBroker', 'Automotive'],
  ['curry-bag', 'Curry Bag', 'Food & takeaway'], ['suite-spot', 'Suite Spot', 'Hospitality'],
  ['founderverse', 'The Founderverse', 'Startup education'], ['hyzo', 'Hyzo', 'Brand concept'],
  ['ezka', 'Ezka', 'Fashion & lifestyle'], ['dayone', 'DayOne', 'Venture studio'],
  ['no-two', 'NO TWO', 'Skincare'], ['hosther-hostels', 'Hosther Hostels', 'Hospitality'],
  ['ai-designers', 'AI Designers', 'Tech community'], ['sol-for-her', 'Sol. for Her', "Women's fashion"],
  ['nothing-else', 'Nothing Else', 'FMCG'], ['bare-logic', 'Bare Logic', 'Skincare'],
]

/* ---------- Data: full project index (32) ---------- */

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

const ROLES = {
  ceo: 'Business head',
  founder: 'Founder',
  marketing: 'Marketing lead',
  creative: 'Creative director',
  advisor: 'Advisor',
  none: 'Not specified',
}

const P = (name, sector, ind, role, roleKey, l, b, m, note) => ({ name, sector, ind, role, roleKey, l, b, m, note })

const PROJECTS = [
  P('START-X', 'Startup ecosystem', 'venture', 'Marketing / Growth Lead', 'marketing',
    ['Marketing leadership', 'Operations / SOPs'], ['Naming & identity', 'Brand architecture'], ['Social strategy', '360° marketing', 'Go-to-market', 'Sales & BD']),
  P('Hey Dossa', 'Food & beverage', 'food', 'Role not specified', 'none',
    ['Operations / SOPs'], ['Brand strategy', 'Naming & identity', 'Brand architecture', 'Social design'], ['Social strategy', 'Go-to-market']),
  P('Moon Bliss', "Women's wellness", 'style', 'CEO / Business Head', 'ceo', L_ALL, B_ALL, M_ALL),
  P('Zaati', 'Restaurant', 'food', 'CMO / Head of Marketing', 'marketing',
    ['Marketing leadership', 'Operations / SOPs'], B_ALL, ['Social strategy', '360° marketing', 'Sales & BD', 'Influencers / PR']),
  P('De Coff', 'Café', 'food', 'Founder / Co-founder', 'founder',
    ['CEO / business leadership', 'Team leadership'], ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture'],
    ['Paid media', '360° marketing', 'Go-to-market', 'Growth & revenue', 'Sales & BD']),
  P('House of Bliss', 'Lifestyle / concept', 'style', 'Role not specified', 'none', [], [], [],
    'Portfolio reference only; role and contribution scope not detailed.'),
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
  P('Ezka by Fousiya Shameer', 'Fashion & lifestyle', 'style', 'Role not specified', 'none',
    [], ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'],
    ['Social strategy', 'Paid media', '360° marketing', 'Growth & revenue', 'Sales & BD', 'Influencers / PR']),
  P('DayOne Venture Studio', 'Venture studio', 'venture', 'CEO / Business Head', 'ceo', L_ALL, B_ALL, M_ALL),
  P('NO TWO', 'Skincare', 'style', 'Founder / Co-founder', 'founder',
    ['Marketing leadership', 'Team leadership', 'Operations / SOPs'],
    ['Brand strategy', 'Naming & identity', 'Brand voice', 'Brand architecture', 'Content production', 'Social design', 'Brand QA'],
    ['Paid media', '360° marketing', 'Go-to-market', 'Growth & revenue', 'Sales & BD', 'Influencers / PR', 'Web / digital']),
  P('Hosther Hostels', 'Hospitality', 'food', 'Consultant / Advisor', 'advisor',
    [], ['Naming & identity', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['360° marketing']),
  P('AI Designers Ecosystem', 'Technology / community', 'venture', 'CMO / Head of Marketing', 'marketing',
    ['Marketing leadership'], B_ALL, ['Social strategy', 'Paid media', '360° marketing', 'Growth & revenue', 'Sales & BD', 'Influencers / PR']),
  P('Sol. for Her', "Women's fashion", 'style', 'Consultant / Advisor', 'advisor',
    [], ['Brand strategy', 'Naming & identity', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'],
    ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('Nothing Else', 'FMCG', 'consumer', 'Founder / Co-founder', 'founder', L_ALL, B_ALL, M_ALL),
  P('Bare Logic', 'Skincare', 'style', 'Role not specified', 'none',
    [], ['Naming & identity', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing']),
  P('Terminal', "Men's fashion", 'style', 'Role not specified', 'none',
    [], ['Brand strategy', 'Brand architecture', 'Creative direction', 'Content production', 'Social design', 'Brand QA'],
    ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('NKreatives', 'Creative / marketing agency', 'corporate', 'Creative Director', 'creative',
    ['Marketing leadership', 'Team leadership', 'Operations / SOPs'], B_ALL, M_ALL),
  P('Coffee Klatch', 'Café', 'food', 'Creative Director', 'creative',
    ['CEO / business leadership'], ['Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing']),
  P('Global Venture', 'Construction / design', 'corporate', 'Role not specified', 'none',
    [], ['Brand strategy', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design'],
    ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('Wayanad Trade Centre', 'Commercial / trade', 'corporate', 'Creative Director', 'creative',
    [], ['Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing']),
  P('Tempest Automotive Battery', 'Automotive', 'consumer', 'Role not specified', 'none',
    [], ['Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing', 'Influencers / PR']),
  P('Warrior Mens/Kids', 'Fashion', 'style', 'Role not specified', 'none',
    [], ['Brand architecture', 'Creative direction', 'Content production', 'Social design'], ['Social strategy', 'Paid media', '360° marketing']),
  P('TP Group of Companies', 'Building materials / corporate', 'corporate', 'Role not specified', 'none',
    ['Marketing leadership'], ['Naming & identity', 'Brand voice', 'Brand architecture', 'Creative direction', 'Content production', 'Social design', 'Brand QA'],
    ['Social strategy', 'Paid media', '360° marketing', 'Growth & revenue', 'Sales & BD', 'Influencers / PR']),
  P('Vinayaka Hospital', 'Healthcare', 'corporate', 'Role not specified', 'none',
    [], ['Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing', 'Growth & revenue']),
  P('Aisen Studio', "Women's fashion", 'style', 'Role not specified', 'none',
    [], ['Creative direction', 'Content production', 'Social design'], ['Social strategy', '360° marketing', 'Growth & revenue', 'Influencers / PR']),
  P('AI Institute', 'Education', 'venture', 'Role not specified', 'none',
    [], [], ['Social strategy', 'Paid media', '360° marketing', 'Sales & BD', 'Influencers / PR']),
  P('Tanza Opticals', 'Optical / retail healthcare', 'consumer', 'Role not specified', 'none',
    [], ['Creative direction', 'Content production'], ['360° marketing']),
].map((p) => ({
  ...p,
  search: [p.name, p.sector, p.role, INDUSTRIES[p.ind], ...p.l, ...p.b, ...p.m].join(' ').toLowerCase(),
}))

const countBy = (key) => PROJECTS.reduce((acc, p) => ((acc[p[key]] = (acc[p[key]] || 0) + 1), acc), {})
const IND_COUNTS = countBy('ind')
const ROLE_COUNTS = countBy('roleKey')

/* ---------- Data: static copy blocks ---------- */

const RANGE = [
  ['Business leadership', 'CEO / business-head responsibilities at DayOne Venture Studio and Moon Bliss; founder-led work across selected consumer and education ventures.'],
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

/* ---------- 360° starburst points ---------- */

const STAR_POINTS = (() => {
  const pts = []
  const spikes = 14
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 92 : 52
    const a = (Math.PI * i) / spikes - Math.PI / 2
    pts.push(`${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
})()

const SEARCH_ICON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%23141414' stroke-width='2.6' stroke-linecap='round'%3E%3Ccircle cx='8.5' cy='8.5' r='6'/%3E%3Cpath d='M13 13l5 5'/%3E%3C/svg%3E\")"

/* ---------- Shared Tailwind class strings ---------- */

const pad = (n) => String(n).padStart(2, '0')

const GAP = 'gap-[clamp(14px,1.8vw,24px)]'
const SECTION = `flex flex-col ${GAP}`

// Scroll-reveal: .reveal → data-reveal; the page-level effect sets data-in="true" once visible.
const REVEAL =
  'opacity-0 translate-y-[18px] transition-[opacity,transform] duration-500 ease-[ease] data-[in=true]:opacity-100 data-[in=true]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none'

const FRAME = 'relative border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px]'
const PAD = 'p-[clamp(18px,2.2vw,28px)]'
const CARD = `${FRAME} ${PAD} shadow-[6px_6px_0_#141414] max-[760px]:shadow-[4px_4px_0_#141414]`
const CARD_INK = `${FRAME} ${PAD} bg-[#141414] text-white shadow-[6px_6px_0_#ffe14d]`

const PILL = 'inline-block text-[0.75rem] font-extrabold uppercase tracking-[0.02em] px-[14px] py-1 border-2 border-[#141414] rounded-full'
const EYEBROW = 'inline-block text-[0.8rem] font-extrabold tracking-[0.08em] uppercase px-2.5 py-[3px] border-2 rounded-lg mb-[14px]'
const EYEBROW_WHITE = `${EYEBROW} bg-white border-[#141414]`
const EYEBROW_LIME = `${EYEBROW} bg-[#c6f24e] text-[#141414] border-[#c6f24e]`
const H2 = 'text-[length:clamp(1.9rem,4vw,3.1rem)] font-black leading-[1.02] tracking-[-0.01em] [font-stretch:85%] uppercase max-w-[22ch]'
const LEAD = 'text-[#5b5b5b] text-[1.05rem] max-w-[62ch] mt-2.5'
const FINE = 'text-[0.82rem] text-[#5b5b5b] mt-[18px] max-w-[90ch]'
const HL = 'px-[0.12em] box-decoration-clone'

const BTN_CORE =
  'inline-flex items-center gap-2.5 font-extrabold uppercase tracking-[0.02em] no-underline border-[3px] rounded-[14px] cursor-pointer transition-[transform,box-shadow] duration-150 ease-[ease] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px]'
const BTN_DARK = 'border-[#141414] shadow-[4px_4px_0_#141414] hover:shadow-[6px_6px_0_#141414] active:shadow-[1px_1px_0_#141414]'
const BTN_GHOST = 'border-white bg-transparent text-white shadow-[4px_4px_0_#fff] hover:shadow-[6px_6px_0_#fff]'
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

function FilterChips({ map, value, onChange, counts, total, small, label }) {
  const cls = small ? CHIP_SM : CHIP
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      <button type="button" className={`${cls} ${value === 'all' ? 'bg-[#141414] text-white' : 'bg-white'}`} onClick={() => onChange('all')}>
        All<span className="opacity-60 ml-1">{total}</span>
      </button>
      {Object.entries(map).map(([k, text]) => (
        <button key={k} type="button" className={`${cls} ${value === k ? 'bg-[#141414] text-white' : 'bg-white'}`} onClick={() => onChange(k)}>
          {text}<span className="opacity-60 ml-1">{counts[k] || 0}</span>
        </button>
      ))}
    </div>
  )
}

// Counts up when scrolled into view (skipped for reduced-motion users).
function CountUp({ to, pad: width = 0, className }) {
  const ref = useRef(null)
  const [val, setVal] = useState(to)

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
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
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
  }, [to])

  return <span ref={ref} className={className}>{String(val).padStart(width, '0')}</span>
}

/* =========================================================
   PAGE
   ========================================================= */

export default function CreativePortfolio() {
  const rootRef = useRef(null)
  const topbarRef = useRef(null)
  const dialogRef = useRef(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('dashboard')
  const [workFilter, setWorkFilter] = useState('all')
  const [current, setCurrent] = useState(0)
  const [query, setQuery] = useState('')
  const [indFilter, setIndFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [openRows, setOpenRows] = useState(() => new Set())

  /* ---------- Document title ---------- */
  useEffect(() => {
    document.title = 'Creative Portfolio | Hashir Usman'
    return () => { document.title = 'Hashir Usman' }
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

  /* ---------- Mobile menu: close on Escape ---------- */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
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

  /* ---------- Reveal on scroll ---------- */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          en.target.setAttribute('data-in', 'true')
          io.unobserve(en.target)
        })
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    rootRef.current.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  /* ---------- Case dialog ---------- */
  const visibleCases = FEATURED.map((_, i) => i).filter((i) => matchesWorkFilter(FEATURED[i], workFilter))

  const openCase = (i) => {
    setCurrent(i)
    dialogRef.current.showModal()
  }
  const stepCase = (dir) => {
    const pos = visibleCases.indexOf(current)
    setCurrent(visibleCases[(pos + dir + visibleCases.length) % visibleCases.length])
  }
  const onDialogClick = (e) => {
    if (e.target === dialogRef.current || e.target.closest('[data-close]')) dialogRef.current.close()
  }
  const c = FEATURED[current]

  /* ---------- Project index ---------- */
  const visibleProjects = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) =>
    (indFilter === 'all' || p.ind === indFilter) &&
    (roleFilter === 'all' || p.roleKey === roleFilter) &&
    (!query || p.search.includes(query)))

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
        :where(.hu-root) :focus-visible { outline: 3px solid #5468ff; outline-offset: 3px; }
        @keyframes pop { from { transform: translateY(14px) scale(0.98); opacity: 0; } }
      `}</style>

      {/* ============ TOP BAR ============ */}
      <header ref={topbarRef} className="sticky top-0 z-50 bg-[#fffdf8] border-b-[3px] border-[#141414]" id="top">
        <div className="max-w-[1480px] mx-auto flex items-center gap-6 px-[clamp(16px,3vw,36px)] py-3">
          <a className="flex items-center gap-3 no-underline" href="../" aria-label="Back to hashirusman.online">
            <span className="grid place-items-center w-[58px] h-[52px] text-[1.6rem] font-black bg-[#ffe14d] border-[3px] border-[#141414] rounded-xl shadow-[3px_3px_0_#141414]">HU</span>
            <span className="flex flex-col leading-[1.05] max-[420px]:hidden">
              <strong className="text-[1.6rem] font-black tracking-[0.02em]">STUDIO</strong>
              <small className="text-[0.72rem] font-semibold uppercase max-[760px]:hidden">Hashir Usman / Creative &amp; Portfolio</small>
            </span>
          </a>

          <a
            className={`${BTN_CORE} ${BTN_DARK} ${BTN_PAD} ml-auto bg-[#ff5a52] max-[760px]:px-[14px] max-[760px]:py-[9px] max-[760px]:text-[0.82rem]`}
            href="#contact"
          >
            Let's talk <span aria-hidden="true">→</span>
          </a>

          <button
            className="hidden max-[1024px]:flex ml-0 w-12 h-11 flex-col justify-center items-center gap-[5px] border-[3px] border-[#141414] rounded-xl bg-[#ffe14d] shadow-[3px_3px_0_#141414] cursor-pointer"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="sidenav"
            aria-label={menuOpen ? 'Close section menu' : 'Open section menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`w-5 h-[3px] bg-[#141414] rounded-[2px] transition-[transform,opacity] duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`w-5 h-[3px] bg-[#141414] rounded-[2px] transition-[transform,opacity] duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-[3px] bg-[#141414] rounded-[2px] transition-[transform,opacity] duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
        <div className="max-w-[1480px] mx-auto relative flex flex-wrap items-center justify-between gap-3 px-[clamp(16px,3vw,36px)] pb-2 text-[0.75rem] text-[#5b5b5b] max-[1240px]:flex-col max-[1240px]:justify-center">
          <div className="min-w-0 max-[1240px]:text-center">
            <a className="no-underline hover:underline" href="../">hashirusman.online</a> <span className="mx-1">/</span> hu-studio <span className="mx-1">/</span> <b className="text-[#141414]">creative-portfolio</b>
          </div>
          <div className="absolute left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 max-[1240px]:static max-[1240px]:translate-x-0">
            <span className="text-sm font-semibold text-[#141414]">Want to see who I really am?</span>
            <Link to="/ventures" className={`${BTN_CORE} ${BTN_DARK} px-4 py-2 text-[0.78rem] bg-[#ffe14d] text-[#141414]`}>
              View My Portfolio <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      <div className={`max-w-[1480px] mx-auto grid grid-cols-[250px_minmax(0,1fr)] max-[1024px]:grid-cols-1 ${GAP} px-[clamp(16px,3vw,36px)] pt-[clamp(14px,1.8vw,24px)] pb-10`}>
        {/* ============ SIDE NAV ============ */}
        <aside
          id="sidenav"
          aria-label="Sections"
          onClick={(e) => { if (e.target.closest('a')) setMenuOpen(false) }}
          className={`relative max-[1024px]:fixed max-[1024px]:z-40 max-[1024px]:top-[var(--topbar-h)] max-[1024px]:inset-x-0 max-[1024px]:px-[clamp(16px,3vw,36px)] max-[1024px]:py-3 max-[1024px]:transition-transform max-[1024px]:duration-[250ms] max-[1024px]:ease-[ease] ${
            menuOpen
              ? 'max-[1024px]:translate-y-0 max-[1024px]:pointer-events-auto'
              : 'max-[1024px]:-translate-y-[120%] max-[1024px]:pointer-events-none'
          }`}
        >
          <div className="sticky top-[calc(var(--topbar-h)_+_20px)] flex flex-col max-h-[calc(100vh_-_var(--topbar-h)_-_40px)] bg-[#ffe14d] border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px] shadow-[6px_6px_0_#141414] max-[760px]:shadow-[4px_4px_0_#141414] pt-[22px] px-4 pb-4 overflow-y-auto max-[1024px]:static max-[1024px]:max-h-[calc(100vh_-_var(--topbar-h)_-_30px)]">
            <p className="font-black text-[1rem] tracking-[0.04em] uppercase px-2 pb-3">Navigation</p>
            <ol>
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
            <div className="relative mt-[18px] px-4 py-[18px] bg-[#5468ff] text-white border-[3px] border-[#141414] rounded-[14px]">
              <span className="absolute -top-[18px] right-2 text-[2.4rem] text-[#ffe14d] leading-none [text-shadow:2px_2px_0_#141414]" aria-hidden="true">✦</span>
              <p className="font-black uppercase tracking-[0.03em] mb-1.5">The mindset</p>
              <p className="font-bold text-[1.05rem] leading-[1.3]">Build with clarity.<br />Scale with intention.</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex flex-col gap-[clamp(48px,6vw,80px)]">
          {/* ============ 01 DASHBOARD ============ */}
          <section className={SECTION} id="dashboard" aria-labelledby="dash-title">
            <div className={`grid grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] max-[1024px]:grid-cols-1 ${GAP}`}>
              <article
                data-reveal
                className={`${CARD} ${REVEAL} bg-[#ffcfae] pr-[clamp(18px,16vw,230px)] min-h-[330px] flex flex-col gap-[18px] max-[760px]:pr-[clamp(18px,2.2vw,28px)] max-[760px]:pb-[170px]`}
              >
                <span className={`${PILL} bg-[#ffe14d] self-start`}>The creative leadership dashboard</span>
                <h1 id="dash-title" className="text-[length:clamp(2rem,3.9vw,3.9rem)] font-black [font-stretch:82%] leading-[0.95] tracking-[-0.01em] uppercase">
                  Building brands.<br />
                  Leading execution.<br />
                  <span className={`${HL} bg-[#ffe14d]`}>Driving growth.</span>
                </h1>
                <p className="mt-auto text-[1.05rem] font-medium">
                  Business strategy <i className="not-italic font-extrabold mx-1.5">×</i> Creative direction <i className="not-italic font-extrabold mx-1.5">×</i> Marketing execution
                </p>
                <div
                  className="absolute top-1/2 right-[clamp(14px,2.5vw,34px)] w-[clamp(130px,14vw,190px)] aspect-square -translate-y-1/2 max-[760px]:top-auto max-[760px]:bottom-4 max-[760px]:translate-y-0 max-[760px]:w-[140px]"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible animate-[spin_26s_linear_infinite] motion-reduce:animate-none">
                    <circle cx="100" cy="100" r="96" className="fill-[#5468ff] stroke-[#141414] [stroke-width:5]" />
                    <polygon points={STAR_POINTS} className="fill-[#ffe14d]" />
                  </svg>
                  <span className="absolute inset-0 flex flex-col items-center justify-center font-extrabold uppercase text-[0.8rem] tracking-[0.04em]">
                    <b className="text-[length:clamp(1.8rem,3vw,2.6rem)] font-black leading-none">360°</b>Thinking
                  </span>
                </div>
              </article>

              <article data-reveal className={`${CARD} ${REVEAL} bg-[#c9b8ff] flex flex-col items-center text-center justify-center gap-1.5`}>
                <span className={`${PILL} bg-white absolute top-4 left-4`}>Meet the studio</span>
                <p className="text-[length:clamp(4rem,8vw,6.5rem)] font-black leading-[0.9] [font-stretch:90%] mt-7">H/U</p>
                <p className="text-[length:clamp(1.4rem,2.4vw,2.1rem)] font-black uppercase leading-none">Hashir Usman</p>
                <hr className="w-full border-t-[3px] border-[#141414] mt-[14px] mb-2" />
                <p className="font-extrabold uppercase text-[0.92rem]">Business / Marketing / Creative</p>
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

            <p className="flex flex-wrap gap-2">
              {['Executive leadership', 'CMO capabilities', 'Creative direction', 'Integrated marketing', 'Go-to-market', 'Revenue strategy'].map((t) => (
                <span key={t} className="text-[0.82rem] font-bold px-3 py-[5px] border-2 border-dashed border-[#141414] rounded-full bg-white/60">{t}</span>
              ))}
            </p>
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
                <p className="text-[#5b5b5b]">My work has involved leading venture-level priorities, defining brand systems, planning and coordinating 360° marketing, directing content and campaigns, supporting paid acquisition, shaping go-to-market activity, and connecting marketing choices with revenue objectives.</p>
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
                <h3 className="text-[1rem] font-extrabold uppercase tracking-[0.04em] mb-[14px]">The leadership range</h3>
                <ul className="flex flex-col gap-3">
                  {RANGE.map(([b, s]) => (
                    <li key={b} className="flex flex-col gap-[3px] px-[14px] py-3 bg-white border-2 border-[#141414] rounded-xl">
                      <b className="uppercase text-[0.88rem] font-black">{b}</b>
                      <span className="text-[0.9rem]">{s}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <article data-reveal className={`${CARD_INK} ${REVEAL}`}>
              <span className={EYEBROW_LIME}>My value proposition</span>
              <p className="text-[length:clamp(1.15rem,2.1vw,1.65rem)] font-extrabold leading-[1.3] max-w-[52ch]">I can translate an ambition into an operating plan, a market-facing brand, a coordinated marketing engine and a team that knows what to execute.</p>
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
                  <p className="text-[0.95rem]">{text}</p>
                </article>
              ))}
            </div>

            <article data-reveal className={`${CARD} ${REVEAL} bg-[#5468ff] text-white`}>
              <h3 className="text-[length:clamp(1.5rem,2.6vw,2.2rem)] font-black uppercase mb-[18px]">How I think about delivery</h3>
              <ol className="grid grid-cols-6 max-[1240px]:grid-cols-3 max-[760px]:grid-cols-2 gap-3">
                {STEPS.map(([no, label, bg], i) => (
                  <li
                    key={no}
                    className={`relative flex flex-col gap-1.5 p-[14px] text-[#141414] font-black uppercase text-[0.95rem] leading-[1.15] border-[3px] border-[#141414] rounded-xl ${bg} ${
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
                    onClick={() => setWorkFilter(role)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </header>

            <div className={`grid grid-cols-2 max-[760px]:grid-cols-1 ${GAP}`}>
              {FEATURED.map((f, i) => {
                const shown = matchesWorkFilter(f, workFilter)
                return (
                  <button
                    key={f.slug}
                    type="button"
                    data-reveal
                    onClick={() => openCase(i)}
                    className={`group ${shown ? 'flex' : 'hidden'} flex-col gap-[14px] text-left cursor-pointer border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px] shadow-[6px_6px_0_#141414] max-[760px]:shadow-[4px_4px_0_#141414] hover:shadow-[9px_9px_0_#141414] p-[18px] bg-[#fffdf8] ${REVEAL}`}
                  >
                    <div className="flex gap-4 items-center">
                      <Logo slug={f.slug} name={f.name} className="flex-none w-[86px] h-[86px] border-[3px] border-[#141414] rounded-xl overflow-hidden" />
                      <div>
                        <p className="text-[0.74rem] font-extrabold uppercase tracking-[0.05em] text-[#5b5b5b]">{pad(i + 1)} / {f.sector}</p>
                        <h3 className="text-[length:clamp(1.25rem,2vw,1.6rem)] font-black uppercase leading-[1.05] [font-stretch:90%]">{f.name}</h3>
                        <span
                          className="inline-block mt-1.5 text-[0.74rem] font-extrabold uppercase px-2.5 py-[3px] border-2 border-[#141414] rounded-full"
                          style={{ background: f.accent }}
                        >
                          {f.role}
                        </span>
                      </div>
                    </div>
                    <p className="font-extrabold text-[1.02rem]">{f.headline}</p>
                    <p className="text-[0.92rem] text-[#5b5b5b]">{f.summary}</p>
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
                  data-reveal
                  className={`relative m-0 border-[3px] border-[#141414] rounded-[14px] overflow-hidden bg-white shadow-[4px_4px_0_#141414] hover:shadow-[7px_7px_0_#141414] ${REVEAL}`}
                >
                  <Logo slug={slug} name={name} className="w-full aspect-[453/293]" />
                  <figcaption className="flex flex-col gap-px px-2.5 py-2 text-[0.76rem] font-extrabold uppercase border-t-[3px] border-[#141414] bg-[#fffdf8]">
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
              <p className={LEAD}>All 32 projects, with responsibilities grouped by leadership, brand &amp; creative and marketing &amp; growth scope.</p>
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
                <FilterChips map={INDUSTRIES} value={indFilter} onChange={setIndFilter} counts={IND_COUNTS} total={PROJECTS.length} label="Filter by industry" />
                <FilterChips map={ROLES} value={roleFilter} onChange={setRoleFilter} counts={ROLE_COUNTS} total={PROJECTS.length} label="Filter by role" small />
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
                        <span className="font-black uppercase text-[0.98rem] leading-[1.15]">
                          {p.name}
                          <span className="block font-semibold text-[0.8rem] text-[#5b5b5b] normal-case">{p.sector}</span>
                        </span>
                        <span
                          className={`justify-self-start text-[0.72rem] font-extrabold uppercase px-[9px] py-[3px] border-2 border-[#141414] rounded-full max-[760px]:col-start-2 ${
                            p.roleKey === 'none' ? 'bg-[#eee] text-[#5b5b5b] border-dashed' : 'bg-[#ffe14d]'
                          }`}
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
                          <p className="col-span-full text-[0.85rem] text-[#5b5b5b]">{p.note}</p>
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
                  <p className="text-[0.94rem]">{text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ============ 08 CONTACT ============ */}
          <section className={SECTION} id="contact" aria-labelledby="contact-title">
            <article
              data-reveal
              className={`${FRAME} ${REVEAL} bg-[#141414] text-white shadow-[6px_6px_0_#ffe14d] flex flex-col gap-2.5 p-[clamp(26px,4vw,48px)] overflow-hidden after:content-['H/U'] after:absolute after:-right-2.5 after:-bottom-10 after:text-[length:clamp(8rem,18vw,15rem)] after:font-black after:leading-none after:text-white/[0.06] after:pointer-events-none`}
            >
              <span className={`${EYEBROW_LIME} self-start`}>08 / Work with me</span>
              <h2 id="contact-title" className="text-[length:clamp(2rem,4.6vw,3.8rem)] font-black uppercase leading-none [font-stretch:85%]">
                Let's build with clarity.<br /><span className={`${HL} bg-[#c6f24e] text-[#141414]`}>Scale with intention.</span>
              </h2>
              <p className="text-[1.6rem] font-black mt-4">Hashir Usman</p>
              <p className="text-white/80">Business &amp; Marketing Leadership · Creative Direction · Venture Building</p>
              <div className="flex flex-wrap gap-[14px] mt-[18px] relative z-[1]">
                <a className={`${BTN_CORE} ${BTN_DARK} ${BTN_PAD} bg-[#ffe14d] text-[#141414]`} href="../">Visit hashirusman.online <span aria-hidden="true">→</span></a>
                <a className={`${BTN_CORE} ${BTN_GHOST} ${BTN_PAD}`} href="#top">Back to top <span aria-hidden="true">↑</span></a>
              </div>
            </article>
            <p className={FINE}>Portfolio note: project-specific responsibilities are shown according to the scope of involvement. Quantitative results and campaign case evidence can be added where documented. “Role not specified” indicates that no primary role is being claimed for that entry.</p>
          </section>

          <footer className="flex flex-wrap justify-between gap-2.5 pt-[18px] border-t-[3px] border-[#141414] text-[0.8rem] font-bold uppercase">
            <span>hashirusman.online</span><span>Selected work / 2026</span><span>H/U — Business. Marketing. Creative.</span>
          </footer>
        </main>
      </div>

      {/* ============ CASE DETAIL DIALOG ============ */}
      <dialog
        ref={dialogRef}
        aria-labelledby="caseName"
        onClick={onDialogClick}
        className="m-auto w-[min(760px,calc(100%_-_28px))] max-h-[calc(100vh_-_40px)] p-0 border-[3px] border-[#141414] rounded-[18px] max-[760px]:rounded-[14px] shadow-[10px_10px_0_#141414] bg-[#fffdf8] text-[#141414] backdrop:bg-[rgba(20,20,20,0.55)] backdrop:backdrop-blur-[3px] open:animate-[pop_0.22s_ease-out]"
      >
        <div className="relative p-[clamp(20px,3vw,34px)] flex flex-col gap-[14px]">
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
              <h3 id="caseName" className="text-[length:clamp(1.5rem,3vw,2.2rem)] font-black uppercase leading-none">{c.name}</h3>
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
          <p className="text-[0.88rem] text-[#5b5b5b] italic">{c.note}</p>
          <div className="flex justify-between">
            <button type="button" className={`${BTN_CORE} ${BTN_DARK} bg-white px-4 py-2 text-[0.85rem]`} onClick={() => stepCase(-1)}>← Prev</button>
            <button type="button" className={`${BTN_CORE} ${BTN_DARK} bg-white px-4 py-2 text-[0.85rem]`} onClick={() => stepCase(1)}>Next →</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
