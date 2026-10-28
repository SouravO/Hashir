// Single source of truth for the brand portfolio. Used by pages/Home.jsx and pages/Ventures.jsx.
// Put this file at: src/data/brands.js
//
// Content comes from the HU. blueprint (Startups & Businesses): approved names, categories, descriptions and scope.
// No years, outcomes or client metrics are listed, because the blueprint does not include them.
//
// Images live in /public/ventures/. `file` must match the file name exactly (including capital letters),
// because production servers are case-sensitive even though macOS is not.
// Dayone, START-X, Oxtel, Admos, Xyklon and Hand Revolution have no image yet: add the files below
// (or change `file`) and they appear. Until then the cards show the project name.
// Add a real link in `url` and a "Visit" button appears on the Ventures page.

export const BRAND_DIR = '/ventures/'
// encodeURIComponent keeps odd characters in file names safe (for example the bullet in Hosther•hostels.png).
export const brandImage = (file) => `${BRAND_DIR}${encodeURIComponent(file)}`

export const groups = ['Food & Drink', 'Retail & Lifestyle', 'Beauty & Wellness', 'Hospitality', 'Business & Tech']

// Same order as the blueprint. `group` drives the filter chips, `category` is the label shown on each card.
export const brands = [
  { id: 'ezkaa', name: 'Ezkaa by Fousiya Shameer', file: 'ezka.png', category: 'Fashion / Branding', group: 'Retail & Lifestyle', url: null,
    short: 'A premium fashion identity developed through brand direction, visual identity, and packaging concepts.',
    scope: ['Branding', 'Identity', 'Packaging'] },

  { id: 'dayone', name: 'Dayone Venture Studio', file: 'dayone.png', category: 'Venture Building', group: 'Business & Tech', url: null,
    short: 'A startup studio where my work spans venture strategy, founder development, operational systems, and business execution.',
    scope: ['Venture Leadership', 'Strategy', 'Operations'] },

  { id: 'no-two', name: 'NO TWO', file: 'NOWO.png', category: 'Skincare / Technology', group: 'Beauty & Wellness', url: null,
    short: 'A personalised skincare venture exploring how skin analysis, technology, and product strategy can work together.',
    scope: ['Venture Architecture', 'Product Strategy', 'GTM'] },

  { id: 'hosther', name: 'Hosther Hostels', file: 'Hosther•hostels.png', category: 'Hospitality', group: 'Hospitality', url: null,
    short: 'A women-focused accommodation brand built around belonging, comfort, and a welcoming customer experience.',
    scope: ['Branding', 'Positioning'] },

  { id: 'ai-designers', name: 'Aii Designers Ecosystem', file: 'aidesignersecosystem.png', category: 'AI / Architecture', group: 'Business & Tech', url: null,
    short: 'Connecting design, AI, education, technology, and professional development through a larger business ecosystem.',
    scope: ['Ecosystem Design', 'Business Strategy'] },

  { id: 'sol', name: 'sol. — for her', file: 'sOl.png', category: 'Fashion / Retail', group: 'Retail & Lifestyle', url: null,
    short: 'A women’s fashion concept built around retail positioning, brand identity, and community experience.',
    scope: ['Brand Direction', 'Retail Strategy'] },

  { id: 'nothing-else', name: 'Nothing Else', file: 'nothingelse.png', category: 'FMCG', group: 'Retail & Lifestyle', url: null,
    short: 'Everyday consumer products with simple, distinctive branding and product-focused packaging.',
    scope: ['Branding', 'Packaging', 'Positioning'] },

  { id: 'bare-logic', name: 'Bare Logic', file: 'barelogic.png', category: 'Skincare', group: 'Beauty & Wellness', url: null,
    short: 'Exploring research-led skincare concepts through brand strategy, product thinking, and technology.',
    scope: ['Venture Concept', 'Brand Strategy'] },

  { id: 'start-x', name: 'START-X', file: 'start-x.png', category: 'Startup Ecosystem', group: 'Business & Tech', url: null,
    short: 'A networking concept designed to connect founders with venture capital professionals and new opportunities.',
    scope: ['Concept Development', 'Networking'] },

  { id: 'popsi', name: 'POPSI', file: 'popsi.png', category: 'Beverages', group: 'Food & Drink', url: null,
    short: 'A playful consumer beverage concept developed through business planning, branding, and creative activation ideas.',
    scope: ['Business Planning', 'Branding', 'Activations'] },

  { id: 'heydossa', name: 'Hey Dossa', file: 'heydossa.png', category: 'Food / QSR', group: 'Food & Drink', url: null,
    short: 'A quick-service restaurant concept combining a familiar food experience with a fresh brand identity.',
    scope: ['QSR Concept', 'Branding', 'Idea Development'] },

  { id: 'moonbliss', name: 'Moonbliss', file: 'moonBLISS.png', category: 'Menstrual Wellness', group: 'Beauty & Wellness', url: null,
    short: 'Building a menstrual wellness venture across business strategy, product positioning, brand development, and go-to-market planning.',
    scope: ['Venture Leadership', 'Branding', 'GTM'] },

  { id: 'zaati', name: 'Zaati', file: 'zaati.png', category: 'Restaurant / UK', group: 'Food & Drink', url: null,
    short: 'An Indian-Arabic food business supported through branding, kitchen and dish SOPs, social media planning, and sales strategies.',
    scope: ['Branding', 'SOPs', 'Sales', 'Social Media'] },

  { id: 'de-coff', name: 'DE COFF', file: 'DE-COFF.png', category: 'Coffee / Business Concept', group: 'Food & Drink', url: null,
    short: 'A coffee business concept shaped through idea development, brand building, and product planning.',
    scope: ['Business Idea', 'Branding', 'Product Development'] },

  { id: 'house-of-bliss', name: 'House of Bliss', file: 'HOUSE-of-Biss.png', category: 'Community / Events', group: 'Beauty & Wellness', url: null,
    short: 'A Moonbliss-connected community initiative developed through events, branding, engagement, and content strategy.',
    scope: ['Community', 'Events', 'Branding', 'Content'] },

  { id: 'hungry-potato', name: 'Hungry Potato', file: 'hungry-potato.png', category: 'QSR', group: 'Food & Drink', url: null,
    short: 'A quick-service food business supported through operational SOPs, menu engineering, technology systems, and sales planning.',
    scope: ['QSR Operations', 'SOPs', 'Menu Engineering'] },

  { id: 'the-grid-store', name: 'The Grid Store', file: 'the-grid-store.png', category: 'Electronics / E-Commerce', group: 'Retail & Lifestyle', url: null,
    short: 'An electronics retail concept developed across naming, branding, business idea development, and online shopping experience.',
    scope: ['Naming', 'Branding', 'E-Commerce'] },

  { id: 'car-broker', name: 'CarBroker', file: 'CarBrOker.png', category: 'Automotive / Marketplace', group: 'Business & Tech', url: null,
    short: 'A used-car marketplace idea exploring a more structured experience through inspections, information, and buyer confidence.',
    scope: ['Marketplace Concept', 'Business Strategy'] },

  { id: 'curry-bag', name: 'Curry Bag', file: 'CURRY-BAG.png', category: 'Food / Business Setup', group: 'Food & Drink', url: null,
    short: 'A food business developed across branding, business setup, legal coordination, website planning, and founder preparation.',
    scope: ['Venture Setup', 'Branding', 'Founder Support'] },

  { id: 'suite-spot', name: 'Suite Spot', file: 'SUITE-SPOT.png', category: 'HR Services / UK', group: 'Business & Tech', url: null,
    short: 'A people-services business supported through business development, revenue strategy, marketing, and client relationship systems.',
    scope: ['Business Development', 'Revenue', 'Client SOPs'] },

  { id: 'oxtel', name: 'Oxtel', file: 'oxtel.png', category: 'Accommodation Technology', group: 'Hospitality', url: null,
    short: 'A hostel discovery platform for students and working professionals, supported through brand identity and visual direction.',
    scope: ['Branding', 'Identity'] },

  { id: 'admos', name: 'Admos', file: 'admos.png', category: 'Consumer Electronics / GCC', group: 'Retail & Lifestyle', url: null,
    short: 'Supporting an accessories business through management structures, product planning, SOPs, and operational systems.',
    scope: ['Operations', 'Management', 'Products', 'SOPs'] },

  { id: 'xyklon', name: 'Xyklon', file: 'xyklon.png', category: 'Mobile Accessories / GCC', group: 'Retail & Lifestyle', url: null,
    short: 'Working on product structure, management strategy, business processes, and operational systems.',
    scope: ['Management', 'Products', 'Operations', 'SOPs'] },

  { id: 'hand-revolution', name: 'Hand Revolution', file: 'hand-revolution.png', category: 'Footwear / E-Commerce', group: 'Retail & Lifestyle', url: null,
    short: 'Working on scaling plans, business valuation, operational structure, workflow automation, and AI integration planning.',
    scope: ['Scaling', 'Valuation', 'Operations', 'AI'] },
]