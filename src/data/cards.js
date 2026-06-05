// Seed dataset modelled on the real UOB card family referenced in the brief.
// Every card carries a decision signal (bestFor), the four at-a-glance facts
// (earn / fees / eligibility / nextStep), and use-case tags for filtering.

export const USE_CASES = [
  { id: 'everyday', label: 'Everyday' },
  { id: 'dining', label: 'Dining' },
  { id: 'travel', label: 'Travel' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'cashback', label: 'Cashback' },
  { id: 'miles', label: 'Miles' },
]

export const CARDS = [
  {
    slug: 'one-card',
    name: 'UOB One Card',
    tier: 'Cashback',
    accent: '#0046AD',
    bestFor: 'Everyday spenders who pay bills & groceries',
    headline: 'Up to 5% cashback on everyday spend',
    tags: ['everyday', 'cashback', 'shopping'],
    image: 'one',
    popular: true,
    valueProp: 'Highest everyday cashback when you spend min. S$500/month',
    // Product-page content hierarchy supplied by the content designer.
    hero: {
      eyebrow: 'UOB One Credit Card',
      headline: 'Get the highest cashback on your daily spend',
      body: [
        'Up to 20% cashback at Grab, McDonald’s, Shopee and SimplyGo',
        'Up to 18% cashback on your grocery spend',
        'Up to S$2,600 in total cashback per year',
      ],
      footnote: 'T&Cs apply',
    },
    heroBanner: 'one',
    // UDS promotion-banner — concise, max 100 chars incl. the inline link
    promoBanner: {
      text: 'Earn up to 20% cashback in your first quarter — double the standard rate.',
      cta: 'Find out more',
    },
    glance: {
      heading: 'UOB One card at a glance',
      rows: [
        { label: 'Cashback', points: ['Up to 10% cashback on your daily spend', 'Up to S$2,600 cashback a year'], note: 'T&Cs apply' },
        { label: 'Annual fee', points: ['Principal card: S$196.20/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      image: 'one',
      heading: 'The cashback card for how you actually spend every day',
      paragraphs: [
        'Groceries. Grab rides. Bus and MRT. Food delivery. Online shopping. Petrol.',
        'You’re already spending on these. Why not get the highest cashback for your consistent daily spend?',
        'Earn up to S$2,600 in total cashback per year with the UOB One credit card.',
      ],
    },
    // Content-designer hierarchy: primary "Benefits" (how you earn + category
    // tiles) restructured into tab-content by category, with a "how it works"
    // accordion for the long detail.
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Get up to 20% cashback on your daily spend',
      howItWorks: {
        title: 'How you earn your cashback',
        steps: [
          'Spend S$600, S$1,000 or S$2,000 per month (min. 10 purchases) on all eligible retail spend',
          'Meet your minimum monthly spend for 3 consecutive months',
          'Get up to S$60, S$100 or S$200 respectively for that quarter (up to 3.33% cashback)',
        ],
        note: 'Enjoy enhanced cashback on your first spend quarter if you’re a new-to-UOB credit cardmember.',
      },
      tabs: [
        {
          label: 'Cashback',
          tiles: [
            { title: 'Groceries', body: 'Up to 18% cashback on all grocery spend locally and overseas, including at FairPrice, Giant, Cold Storage, Sheng Siong, Prime and Don Don Donki' },
            { title: 'Food & food delivery', body: 'Up to 20% cashback at McDonald’s, GrabFood and Grab Dine Out Deals' },
            { title: 'Online shopping', body: 'Up to 20% cashback at Shopee Singapore' },
            { title: 'Grab rides, bus & MRT', body: 'Up to 20% cashback at Grab and SimplyGo' },
            { title: 'Utilities', body: 'Up to 4.33% cashback on Singapore Power bills' },
            { title: 'Fuel', body: 'Up to 22.66% fuel savings at Shell and SPC' },
          ],
        },
        {
          label: 'Lifestyle',
          tiles: [
            { title: 'Dining deals', body: 'Year-round SMART$ rebates at 1,000+ participating restaurants and cafés island-wide' },
            { title: 'Shopping', body: 'Exclusive cardmember deals across online and in-store retail partners' },
          ],
        },
        {
          label: 'Travel',
          tiles: [
            { title: 'Overseas spend', body: 'Keep earning cashback on grocery and retail spend when you travel' },
            { title: 'Contactless anywhere', body: 'Tap to pay everywhere Visa is accepted, at home or abroad' },
          ],
        },
        {
          label: 'Rewards',
          tiles: [
            { title: 'SMART$ rebates', body: 'Automatic rebates at 1,000+ participating merchants — no registration needed' },
            { title: 'UOB Deals', body: 'Limited-time cardmember offers refreshed throughout the year' },
          ],
        },
      ],
    },
    earn: { rate: 'Up to 5%', detail: 'cashback on all spend, incl. groceries, transport & bills' },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% foreign currency' },
    eligibility: { income: 'S$30,000', age: '21', residency: 'Singaporean / PR' },
    nextStep: '5 mins with Singpass · instant approval for most',
    highlights: [
      'Up to 5% cashback with min. S$500 spend + 1 bill payment',
      'No minimum spend tiers to track on the app',
      'SMART$ rebates at 1,000+ merchants',
    ],
    benefitTabs: {
      Cashback: [
        '5% cashback on all spend (qualifying quarters)',
        '3.33% base cashback with min. S$500/month',
        'Cap of S$200 cashback per quarter',
      ],
      Everyday: [
        'Sheng Siong, Cold Storage & Giant grocery rebates',
        'SimplyGo & transport rebates',
        'Recurring bill payments count toward spend',
      ],
      Dining: ['Up to 8% at selected merchants', 'Year-round SMART$ rebates'],
    },
    faqs: [
      { q: 'How do I qualify for the 5% cashback?', a: 'Spend at least S$500 each month and make one bill payment within the quarter. Cashback is credited at the end of each quarter.' },
      { q: 'Is there a cap on cashback?', a: 'Yes — cashback is capped at S$200 per quarter, which means up to S$800 a year.' },
      { q: 'When is the annual fee charged?', a: 'The first year is waived. From the second year, the fee is S$196.20 and may be waived on request when you meet the spend requirement.' },
    ],
  },
  {
    slug: 'ladys-card',
    name: "UOB Lady's Card",
    tier: 'Rewards',
    accent: '#B0306B',
    bestFor: 'Shoppers who want to choose their bonus category',
    headline: '10X rewards on a category you pick',
    tags: ['shopping', 'dining', 'everyday'],
    valueProp: 'You choose the rewards category — fashion, dining, travel, transport or beauty',
    image: 'ladys',
    earn: { rate: '10X UNI$', detail: 'on one rewards category you choose each quarter' },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% foreign currency' },
    eligibility: { income: 'S$30,000', age: '21', residency: 'Singaporean / PR' },
    nextStep: '5 mins with Singpass · choose your category after approval',
    highlights: [
      'Pick your 10X category: Beauty & Wellness, Dining, Fashion, Family, Transport or Travel',
      'Complimentary lifestyle insurance coverage',
      'UNI$ never expire',
    ],
    benefitTabs: {
      Rewards: ['10X UNI$ on chosen category (up to S$1,000/month)', '1X UNI$ on all other spend'],
      Lifestyle: ['Women’s lifestyle privileges', 'Complimentary coverage for selected medical conditions'],
      Shopping: ['Bonus rewards at department stores', 'Quarterly category switch via the app'],
    },
    faqs: [
      { q: 'Can I change my rewards category?', a: 'Yes — you can switch your 10X category once each quarter in the UOB TMRW app.' },
      { q: 'Do UNI$ expire?', a: 'No. UNI$ earned on the Lady’s Card do not expire as long as your account is active.' },
    ],
  },
  {
    slug: 'preferred-visa-card',
    name: 'UOB Preferred Visa Card',
    tier: 'Rewards',
    accent: '#0E2E54',
    bestFor: 'Online & contactless mobile spenders',
    headline: '10X rewards on mobile & online spend',
    tags: ['shopping', 'everyday', 'dining'],
    valueProp: 'Best for Apple Pay, Google Pay and online shopping rewards',
    image: 'preferred',
    earn: { rate: '10X UNI$', detail: 'on mobile contactless & selected online spend' },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% foreign currency' },
    eligibility: { income: 'S$30,000', age: '21', residency: 'Singaporean / PR' },
    nextStep: '5 mins with Singpass · add to your mobile wallet instantly',
    highlights: [
      '10X UNI$ on mobile contactless (Apple Pay, Google Pay, Samsung Pay)',
      '10X UNI$ on selected online & entertainment spend',
      'SMART$ rebates at 1,000+ outlets',
    ],
    benefitTabs: {
      Rewards: ['10X UNI$ on mobile & online (up to S$1,100/month)', '1X UNI$ on everything else'],
      Lifestyle: ['Streaming & entertainment bonus categories', 'Ride-hailing rebates'],
    },
    faqs: [
      { q: 'What counts as online spend?', a: 'Selected online merchants in entertainment, shopping and food delivery qualify for 10X UNI$. The full merchant list is in the card’s terms.' },
    ],
  },
  {
    slug: 'krisflyer-card',
    name: 'UOB KrisFlyer Card',
    tier: 'Travel',
    accent: '#1257C4',
    bestFor: 'KrisFlyer members earning miles on the go',
    headline: 'Up to 6 miles per S$1 on travel & dining',
    tags: ['travel', 'miles', 'dining'],
    valueProp: 'Direct KrisFlyer miles — no conversion, no expiry surprises',
    image: 'krisflyer',
    popular: true,
    earn: { rate: '6 KF miles', detail: 'per S$1 on Singapore Airlines, dining & online travel' },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% foreign currency' },
    eligibility: { income: 'S$30,000', age: '21', residency: 'Singaporean / PR' },
    nextStep: '5 mins with Singpass · miles credit directly to KrisFlyer',
    highlights: [
      '6 miles per S$1 on SIA, Scoot, dining, food delivery & online travel',
      '3 miles per S$1 on other selected categories (min. S$500 spend)',
      'Miles credited straight to your KrisFlyer account',
    ],
    benefitTabs: {
      Travel: ['6 miles/S$1 on SIA & Scoot', 'Online travel bookings earn accelerated miles'],
      Dining: ['6 miles/S$1 on local dining & food delivery'],
      Miles: ['Direct KrisFlyer crediting — no manual conversion', 'No cap on base miles'],
    },
    faqs: [
      { q: 'How are miles credited?', a: 'KrisFlyer miles are credited directly to your KrisFlyer membership, usually within the same statement cycle.' },
      { q: 'Do I need to spend a minimum?', a: 'The accelerated 6 and 3 miles tiers require a minimum spend of S$500 per statement month. Base earning applies below that.' },
    ],
  },
  {
    slug: 'evol-card',
    name: 'UOB EVOL Card',
    tier: 'Cashback',
    accent: '#00B0A6',
    bestFor: 'Gen Z & first-jobbers spending online',
    headline: 'Up to 8% cashback on online & mobile',
    tags: ['cashback', 'shopping', 'everyday'],
    valueProp: 'Made for online and mobile contactless — and made from recycled plastic',
    image: 'evol',
    earn: { rate: 'Up to 8%', detail: 'cashback on online & mobile contactless spend' },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% foreign currency' },
    eligibility: { income: 'S$30,000', age: '21', residency: 'Singaporean / PR' },
    nextStep: '5 mins with Singpass · eco-friendly recycled card',
    highlights: [
      '8% cashback on online spend (min. S$600/month)',
      '8% cashback on mobile contactless',
      'Made from 85% recycled plastic',
    ],
    benefitTabs: {
      Cashback: ['8% on online + 8% on mobile contactless', '0.3% base cashback on all other spend', 'Cap of S$60 cashback per month'],
      Lifestyle: ['Carbon-footprint tracking in the app', 'Sustainability-linked rewards'],
    },
    faqs: [
      { q: 'What spend qualifies for 8%?', a: 'Online transactions and mobile contactless payments qualify, with a minimum monthly spend of S$600. Cashback is capped at S$60 per month.' },
    ],
  },
  {
    slug: 'prvi-miles-card',
    name: 'UOB PRVI Miles Card',
    tier: 'Travel',
    accent: '#0A2240',
    bestFor: 'Frequent flyers who want the highest earn rate',
    headline: 'Up to 6 miles per S$1, miles never expire',
    tags: ['travel', 'miles'],
    valueProp: 'Highest local & overseas miles earn rate in its class — miles never expire',
    image: 'prvi',
    earn: { rate: '6 miles', detail: 'per S$1 on flights & hotels; 2.4 overseas, 1.4 local' },
    fees: { annual: 'S$256.80', waiver: 'First year waived', fx: '3.25% foreign currency' },
    eligibility: { income: 'S$30,000', age: '21', residency: 'Singaporean / PR' },
    nextStep: '5 mins with Singpass · miles never expire',
    highlights: [
      '6 miles per S$1 on major airlines & hotels (via UOB Travel)',
      '2.4 miles per S$1 overseas, 1.4 miles per S$1 local',
      'UNI$ / miles never expire',
    ],
    benefitTabs: {
      Travel: ['6 miles/S$1 on flights & hotels', 'Airport limousine & lounge privileges'],
      Miles: ['1.4 miles/S$1 local, 2.4 miles/S$1 overseas', 'Miles never expire', 'Transfer to KrisFlyer & other partners'],
    },
    faqs: [
      { q: 'Why is the earn rate higher than the KrisFlyer card?', a: 'PRVI Miles earns flexible UNI$ that convert to multiple airline partners, with a higher base rate. The KrisFlyer card credits SIA miles directly. Choose based on whether you want flexibility or direct crediting.' },
      { q: 'Do the miles expire?', a: 'No. Miles earned on PRVI Miles do not expire while your account is active.' },
    ],
  },
]

export const cardBySlug = (slug) => CARDS.find((c) => c.slug === slug)

export const PROMOS = [
  {
    id: 'airpods',
    category: 'Sign-up gift',
    reward: 'Apple AirPods Pro 2',
    rewardImage: 'airpods',
    cards: ['one-card', 'krisflyer-card'],
    benefit: 'Get Apple AirPods Pro (2nd gen) worth S$369',
    condition: 'Spend S$1,500 within 30 days of approval',
    validUntil: '2026-07-31',
    endsSoon: true,
  },
  {
    id: 'cashback-200',
    category: 'Welcome offer',
    reward: 'S$200 cashback',
    rewardImage: 'cash',
    cards: ['evol-card', 'one-card'],
    benefit: 'S$200 cashback credited to your statement',
    condition: 'Spend S$600 within the first month',
    validUntil: '2026-06-30',
    endsSoon: true,
  },
  {
    id: 'krisflyer-miles',
    category: 'Travel offer',
    reward: '25,000 KrisFlyer miles',
    rewardImage: 'miles',
    cards: ['krisflyer-card', 'prvi-miles-card'],
    benefit: 'Up to 25,000 bonus KrisFlyer miles',
    condition: 'Spend S$3,000 within 60 days',
    validUntil: '2026-09-30',
    endsSoon: false,
  },
  {
    id: 'dyson',
    category: 'Sign-up gift',
    reward: 'Dyson Supersonic',
    rewardImage: 'dyson',
    cards: ['ladys-card', 'preferred-visa-card'],
    benefit: 'Dyson Supersonic hair dryer worth S$609',
    condition: 'Spend S$2,000 within 30 days of approval',
    validUntil: '2026-08-15',
    endsSoon: false,
  },
]
