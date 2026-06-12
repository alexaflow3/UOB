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
        '0.3% base cashback on all other spend — no minimum, no cap',
        'Up to S$2,600 in total cashback per year',
      ],
      footnote: 'T&Cs apply',
    },
    // Spend-category labels rendered as legible chips under the hero card
    heroLabels: ['Groceries', 'Food delivery', 'Transport', 'Online shopping', 'Bills', 'Fuel'],
    // Category cashback tiles — shown as a banner at the top of the apply flow so
    // the where-you-earn story is the first thing applicants see. Brand logos load
    // from src/assets/brand-<key>.{png,svg,jpg}; until supplied, the brand name
    // renders as a clean text fallback.
    applyTiles: [
      { category: 'Dining', brands: ['mcdonalds', 'grabfood'], value: 'Up to 20%', metric: 'cashback', enhanced: true, at: 'at McDonald’s, GrabFood and Grab Dine Out Deals' },
      { category: 'Daily Commute', brands: ['grab', 'simplygo'], value: 'Up to 20%', metric: 'cashback', enhanced: true, at: 'on all your Grab and SimplyGo bus and train rides' },
      { category: 'Shopping', brands: ['shopee'], value: 'Up to 20%', metric: 'cashback', enhanced: true, at: 'at Shopee Singapore' },
      { category: 'Utilities', brands: ['spgroup'], value: 'Up to 4.33%', metric: 'cashback', at: 'at Singapore Power' },
      { category: 'Fuel', brands: ['shell', 'spc'], value: 'Up to 22.66%', metric: 'fuel savings', at: 'at Shell and SPC' },
    ],
    // UDS promotion-banner — concise, max 100 chars incl. the inline link
    promoBanner: {
      text: 'Earn up to 20% cashback in your first quarter — double the standard rate.',
      headline: 'Earn up to 20% cashback in your first quarter',
      sub: 'Double the standard rate!',
      cta: 'Find out more',
    },
    glance: {
      heading: 'UOB One card at a glance',
      rows: [
        // Per head-of-design (Camille): keep base and bonus cashback as two
        // distinct rows so the everyday return is never overstated — the base
        // rate everyone gets, then the bonus you unlock by hitting the tiers.
        { label: 'Cashback', points: ['0.3% base cashback on all spend — no minimum, no cap', 'Earned automatically on everything, everywhere Visa is accepted', 'Credited to your account every statement'] },
        { label: 'Bonus cashback', points: ['Up to 10% on eligible everyday spend — Grab, groceries, public transport, fast food, Shopee, SimplyGo & SP utilities', 'Spend S$600, S$1,000 or S$2,000 a month to earn S$60, S$100 or S$200 each quarter', 'Up to S$2,600 in total cashback a year'], note: 'Bonus is earned per quarter — hit your chosen minimum spend across 3 consecutive months. T&Cs apply.' },
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
    secondaryHeading: 'Beyond cashback',
    secondaryBenefits: [
      { icon: 'Coin', title: 'SMART$ rebates, automatically', body: 'Earn extra SMART$ rebates at 1,000+ participating merchants island-wide — no registration, redeemed straight off your spend.' },
      { icon: 'Wallet', title: 'Unlock bonus interest with your UOB One Account', body: 'Use the card to help unlock up to 3.4% p.a. on a linked UOB One Account — your everyday spend works twice.' },
      { icon: 'Phone', title: 'Contactless & mobile wallets', body: 'Add it to Apple Pay, Google Pay or Samsung Pay and tap to pay everywhere Visa/Mastercard is accepted.' },
      { icon: 'Spark', title: 'Year-round UOB Deals', body: 'Limited-time cardmember offers on dining, shopping and travel, refreshed throughout the year in UOB TMRW.' },
    ],
    calculation: {
      heading: 'How is your cashback calculated?',
      intro: 'Your cashback is calculated per quarter — not after each transaction. You need to hit the minimum spend in each of the 3 months within the quarter to qualify for that quarter’s cashback.',
      example: {
        caption: 'Cashback earned · 15 Nov',
        parts: [
          { amount: 'S$60', note: 'up to 3.33% cashback on all eligible spend' },
          { amount: '+ S$20', note: 'additional 5% on Grab, McDonald’s, Shopee & SimplyGo' },
          { amount: '+ S$2', note: 'additional 1% on Singapore Power utilities bill' },
        ],
        total: '= S$82',
      },
      cta: 'Calculate your cashback',
    },
    linkedProduct: {
      eyebrow: 'Linked account',
      heading: 'Earn up to 3.4% p.a. by linking your UOB One Account',
      body: 'Pair this card with a UOB One Account and earn up to 3.4% p.a. interest when you:',
      points: ['spend a min. S$500 each month on your UOB One card, and', 'credit your salary or make 3 GIRO transactions monthly'],
      cta: 'Get the details',
    },
    disclosures: [
      'The “highest cashback” claim is based on S$2,600 annual cashback cap with monthly S$2,000 spend, compared with major banks’ cashback cards in Singapore as at 15 April 2026.',
      'SGD deposits in a linked UOB account are insured up to S$100,000 by SDIC.',
      'Subject to qualifying criteria. Terms and conditions apply.',
    ],
    earn: { rate: 'Up to 5%', detail: 'cashback on all spend, incl. groceries, transport & bills' },
    fit: {
      verdict: 'A cashback workhorse for consistent, everyday spenders. The more steadily you spend across the quarter, the more you earn.',
      goodFor: [
        'You spend at least S$600 a month on everyday categories like groceries, transport and bills',
        'You can keep your spend steady across all 3 months of a quarter',
        'You want certainty — fixed bonus categories rather than rotating ones to track',
      ],
      thinkTwice: [
        'Your monthly spend is low or uneven — you may miss the tiers and earn only the base rate',
        'You’d rather have a flat, simple rate with no minimum spend (look at the UOB Absolute Cashback Card)',
        'You want lounge access or travel perks more than everyday cashback',
      ],
    },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
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
    hero: {
      eyebrow: 'UOB Lady’s Credit Card',
      headline: 'Earn 10X rewards on the category you love',
      body: [
        '10X UNI$ (4 miles per S$1) on one bonus category you choose',
        'Switch your category every quarter in the UOB TMRW app',
        'UNI$ never expire — redeem for miles, vouchers or rebates',
      ],
      footnote: 'T&Cs apply',
    },
    heroLabels: ['Beauty & Wellness', 'Dining', 'Fashion', 'Family', 'Transport', 'Travel'],
    applyTiles: [
      { category: 'Beauty & Wellness', value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'when this is your chosen earning category', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'Dining', value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'when dining is your chosen earning category', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'Fashion', value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'when fashion is your chosen earning category', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'Travel', value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'when travel is your chosen earning category', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'All other spend', value: '1X UNI$', metric: '· 0.4 mpd', at: 'earned automatically, no cap' },
    ],
    glance: {
      heading: 'UOB Lady’s Card at a glance',
      rows: [
        { label: 'Rewards', points: ['1X UNI$ (0.4 miles per S$1) on all spend — no cap', 'Earned automatically on every retail purchase', 'UNI$ never expire while your account is active'] },
        { label: 'Bonus rewards', points: ['10X UNI$ (4 miles per S$1) on your chosen bonus category', 'Earn on up to S$1,000 of that category each month', 'Pick from Beauty, Dining, Fashion, Family, Transport or Travel'], note: 'Choose — and realign — your bonus category each quarter in the UOB TMRW app. T&Cs apply.' },
        { label: 'Annual fee', points: ['Principal card: S$196.20/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      image: 'ladys',
      heading: 'Rewards that follow how you actually shop',
      paragraphs: [
        'Beauty hauls one quarter, travel the next. Your spending shifts — your bonus category should move with it.',
        'Pick one of six categories and earn 10X UNI$ on it, then switch any quarter as your life changes.',
        'Every UNI$ you bank stays yours — they never expire while your account is active.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Choose your 10X category and earn faster',
      howItWorks: {
        title: 'How you earn 10X UNI$',
        steps: [
          'Pick one bonus category in the UOB TMRW app (Beauty, Dining, Fashion, Family, Transport or Travel)',
          'Spend on that category to earn 10X UNI$ (4 miles per S$1), up to S$1,000 each calendar month',
          'Earn 1X UNI$ on everything else; realign your category any new quarter',
        ],
        note: 'UNI$ convert to miles with KrisFlyer and other partners, or redeem for vouchers and statement rebates.',
      },
      tabs: [
        { label: 'Rewards', tiles: [
          { title: 'Your 10X category', body: '10X UNI$ (4 miles per S$1) on the bonus category you choose, on up to S$1,000 spend per month' },
          { title: 'Everything else', body: '1X UNI$ (0.4 miles per S$1) on all other retail spend, with no cap' },
          { title: 'UNI$ never expire', body: 'Bank your rewards and redeem when you like — UNI$ stay valid while your account is active' },
        ] },
        { label: 'Lifestyle', tiles: [
          { title: 'Women’s privileges', body: 'Curated beauty, wellness and lifestyle offers for cardmembers throughout the year' },
          { title: 'Insurance coverage', body: 'Complimentary coverage for selected female medical conditions when you charge premiums to the card' },
        ] },
        { label: 'Shopping', tiles: [
          { title: 'Department-store bonuses', body: 'Extra rewards and seasonal offers at major retail partners' },
          { title: 'Quarterly flexibility', body: 'Realign your 10X category to where you’re shopping this quarter' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the 10X rewards',
    secondaryBenefits: [
      { icon: 'Shield', title: 'Complimentary insurance', body: 'Charge insurance premiums to the card for complimentary coverage on selected female medical conditions.' },
      { icon: 'Coin', title: 'UOB Deals & SMART$', body: 'Year-round cardmember privileges plus automatic SMART$ rebates at 1,000+ merchants island-wide.' },
      { icon: 'Phone', title: 'Mobile wallets', body: 'Add it to Apple Pay, Google Pay or Samsung Pay for tap-to-pay rewards everywhere.' },
    ],
    calculation: {
      heading: 'How are your UNI$ calculated?',
      intro: 'Rewards are earned as UNI$ and shown here as miles. You earn 10X UNI$ (4 miles per S$1) on your chosen category, up to S$1,000 each calendar month, and 1X UNI$ on everything else.',
      example: {
        caption: 'Miles earned · Nov',
        parts: [
          { amount: '4,000 miles', note: '4 miles per S$1 on S$1,000 in your chosen 10X category' },
          { amount: '+ 600 miles', note: '0.4 miles per S$1 on S$1,500 of other spend' },
        ],
        total: '= 4,600 miles',
      },
      cta: 'See how UNI$ convert to miles',
    },
    linkedProduct: {
      eyebrow: 'Linked account',
      heading: 'Earn up to 3.4% p.a. by linking your UOB One Account',
      body: 'Pair this card with a UOB One Account and earn up to 3.4% p.a. interest when you:',
      points: ['spend a min. S$500 each month on your UOB card, and', 'credit your salary or make 3 GIRO transactions monthly'],
      cta: 'Get the details',
    },
    earn: { rate: '10X UNI$', detail: 'on one rewards category you choose each quarter' },
    fit: {
      verdict: 'Flexible rewards that follow your lifestyle. Excellent when your spend is concentrated in a category you choose each quarter.',
      goodFor: [
        'A big chunk of your spend sits in one category (beauty, dining, fashion, family, transport or travel)',
        'You like banking flexible UNI$ that convert to miles, vouchers or rebates',
        'You value the complimentary women’s lifestyle insurance coverage',
      ],
      thinkTwice: [
        'Your spending is spread evenly — you’ll only earn 1X on most of it',
        'You’d rather have straightforward cashback than points to manage',
        'You spend well over S$1,000 a month in your bonus category (10X is capped there)',
      ],
    },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
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
    hero: {
      eyebrow: 'UOB Preferred Platinum Visa Card',
      headline: 'Earn 10X rewards on mobile & online spend',
      body: [
        '10X UNI$ (4 miles per S$1) on mobile contactless payments',
        '1X UNI$ (0.4 miles per S$1) on all other everyday spend',
        'SMART$ rebates at 1,000+ retail and dining outlets',
      ],
      footnote: 'T&Cs apply',
    },
    heroLabels: ['Mobile contactless', 'Online shopping', 'Streaming', 'Food delivery', 'Ride-hailing'],
    applyTiles: [
      { category: 'Mobile Contactless', brands: ['applepay', 'googlepay'], value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'whenever you use Apple Pay, Google Pay and UOB TMRW', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'Entertainment', brands: ['netflix', 'spotify'], value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'for all streaming and online entertainment', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'Food Delivery', brands: ['grabfood', 'foodpanda'], value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'whenever you spend on GrabFood, Deliveroo and foodpanda', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'Online Shopping', value: '10X UNI$', metric: '· 4 mpd', enhanced: true, at: 'on selected online stores', offerHeadline: 'Get 4 miles per S$1' },
      { category: 'All other spend', value: '1X UNI$', metric: '· 0.4 mpd', at: 'earned on everything else' },
    ],
    glance: {
      heading: 'UOB Preferred Visa at a glance',
      rows: [
        { label: 'Rewards', points: ['1X UNI$ (0.4 miles per S$1) on all spend — no cap', 'Earned automatically on every retail purchase', 'UNI$ valid for 2 years'] },
        { label: 'Bonus rewards', points: ['10X UNI$ (4 miles per S$1) on mobile contactless & selected online spend', 'Earn on up to S$1,100 of these transactions each month, combined', 'Mobile contactless = Apple Pay, Google Pay & Samsung Pay'], note: 'Selected online merchants span shopping, food delivery & entertainment. T&Cs apply.' },
        { label: 'Annual fee', points: ['Principal card: S$196.20/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      image: 'preferred',
      heading: 'Built for the way you tap and shop today',
      paragraphs: [
        'You already tap your phone to pay and check out online without thinking about it.',
        'The Preferred Visa turns those everyday taps and online carts into 10X UNI$ — 4 miles for every S$1.',
        'Add it to your mobile wallet the moment you’re approved and start earning on your next tap.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Tap, shop online and earn 10X UNI$',
      howItWorks: {
        title: 'How you earn 10X UNI$',
        steps: [
          'Pay with mobile contactless (Apple Pay, Google Pay, Samsung Pay) or at selected online merchants',
          'Earn 10X UNI$ (4 miles per S$1) on up to S$1,100 of these transactions each month',
          'Earn 1X UNI$ on everything else, with no cap',
        ],
        note: 'UNI$ can be converted to miles or redeemed for vouchers and rebates in the UOB TMRW app.',
      },
      tabs: [
        { label: 'Rewards', tiles: [
          { title: 'Mobile contactless', body: '10X UNI$ (4 miles per S$1) when you pay with Apple Pay, Google Pay or Samsung Pay' },
          { title: 'Selected online spend', body: '10X UNI$ on selected online shopping, food delivery and entertainment merchants' },
          { title: 'Everything else', body: '1X UNI$ (0.4 miles per S$1) on all other retail spend, no cap' },
        ] },
        { label: 'Lifestyle', tiles: [
          { title: 'Streaming & entertainment', body: 'Bonus rewards on selected streaming, gaming and entertainment platforms' },
          { title: 'Ride-hailing & delivery', body: 'Keep earning accelerated UNI$ on everyday rides and food delivery' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the 10X rewards',
    secondaryBenefits: [
      { icon: 'Phone', title: 'Instant mobile wallet', body: 'Provision the card to Apple Pay, Google Pay or Samsung Pay right after approval and pay before the physical card arrives.' },
      { icon: 'Coin', title: 'SMART$ rebates', body: 'Automatic rebates at 1,000+ participating merchants — no registration needed.' },
      { icon: 'Spark', title: 'UOB Deals', body: 'Year-round cardmember offers across dining, shopping and travel in UOB TMRW.' },
    ],
    calculation: {
      heading: 'How are your UNI$ calculated?',
      intro: 'Rewards are earned as UNI$ and shown here as miles. You earn 10X UNI$ (4 miles per S$1) on mobile contactless and selected online spend, up to S$1,100 combined each month, and 1X UNI$ on the rest.',
      example: {
        caption: 'Miles earned · Nov',
        parts: [
          { amount: '4,400 miles', note: '4 miles per S$1 on S$1,100 of mobile & online spend' },
          { amount: '+ 360 miles', note: '0.4 miles per S$1 on S$900 of other spend' },
        ],
        total: '= 4,760 miles',
      },
      cta: 'See how UNI$ convert to miles',
    },
    linkedProduct: {
      eyebrow: 'Linked account',
      heading: 'Earn up to 3.4% p.a. by linking your UOB One Account',
      body: 'Pair this card with a UOB One Account and earn up to 3.4% p.a. interest when you:',
      points: ['spend a min. S$500 each month on your UOB card, and', 'credit your salary or make 3 GIRO transactions monthly'],
      cta: 'Get the details',
    },
    earn: { rate: '10X UNI$', detail: 'on mobile contactless & selected online spend' },
    fit: {
      verdict: 'A rewards card built for taps and online carts. Great when you live in your mobile wallet and shop online.',
      goodFor: [
        'You pay mostly by mobile contactless (Apple Pay, Google Pay, Samsung Pay) and shop online',
        'You want to bank UNI$ that convert to miles or vouchers',
        'You like adding the card to your mobile wallet and earning instantly',
      ],
      thinkTwice: [
        'You mostly use a physical card in store — those swipes earn only 1X',
        'Your mobile and online spend tops S$1,100 a month (the 10X is capped there)',
        'You’d prefer direct cashback over points',
      ],
    },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
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
    hero: {
      eyebrow: 'UOB KrisFlyer Credit Card',
      headline: 'Earn KrisFlyer miles on everyday spend',
      body: [
        'Up to 6 miles per S$1 on SIA, Scoot, dining & online travel',
        '3 miles per S$1 on other selected everyday categories',
        'Miles credit straight to your KrisFlyer account — no conversion',
      ],
      footnote: 'Min. S$500 monthly spend for accelerated tiers. T&Cs apply.',
    },
    heroLabels: ['Singapore Airlines', 'Scoot', 'Dining', 'Food delivery', 'Online travel', 'Grab'],
    applyTiles: [
      { category: 'Air Travel', brands: ['sia', 'scoot'], value: 'Up to 6', metric: 'miles/S$1', enhanced: true, at: 'whenever you spend on SIA, Scoot and KrisShop', offerHeadline: 'Up to 6 miles per S$1' },
      { category: 'Dining', value: 'Up to 3', metric: 'miles/S$1', at: 'whenever you spend on dining and food delivery', offerHeadline: 'Earn up to 3 miles per S$1' },
      { category: 'Online Travel', value: 'Up to 3', metric: 'miles/S$1', at: 'whenever you make hotel and online bookings', offerHeadline: 'Earn up to 3 miles per S$1' },
      { category: 'All other spend', value: '1.2', metric: 'miles/S$1', at: 'KrisFlyer miles, no conversion' },
    ],
    glance: {
      heading: 'UOB KrisFlyer Card at a glance',
      rows: [
        { label: 'Miles', points: ['1.2 miles per S$1 on all spend — no minimum, no cap', 'Credited straight to your KrisFlyer account', 'No manual conversion or transfer fees'] },
        { label: 'Bonus miles', points: ['Up to 6 miles per S$1 on SIA, Scoot, dining, food delivery & online travel', '3 miles per S$1 on other selected everyday categories', 'Earned on top of your base miles'], note: 'Accelerated tiers need min. S$500 spend per statement month. T&Cs apply.' },
        { label: 'Annual fee', points: ['Principal card: S$196.20/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      image: 'krisflyer',
      heading: 'The simplest way to grow your KrisFlyer balance',
      paragraphs: [
        'Flights, dining, food delivery, online travel — the spend you already do can fly you further.',
        'Earn up to 6 KrisFlyer miles per S$1 on the categories that matter, and 3 miles on everyday picks.',
        'Miles land directly in your KrisFlyer account — no manual conversion, no guessing the rate.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Earn up to 6 miles per S$1, credited directly',
      howItWorks: {
        title: 'How you earn your miles',
        steps: [
          'Spend on SIA/Scoot, dining, food delivery or online travel to earn up to 6 miles per S$1',
          'Earn 3 miles per S$1 on other selected categories with min. S$500 spend that month',
          'Miles are credited straight to your KrisFlyer membership, usually within the same statement cycle',
        ],
        note: 'Base earning of 1.2 miles per S$1 applies on all other spend with no minimum.',
      },
      tabs: [
        { label: 'Travel', tiles: [
          { title: 'SIA & Scoot', body: '6 miles per S$1 when you book and fly with Singapore Airlines and Scoot' },
          { title: 'Online travel', body: '6 miles per S$1 on selected online travel bookings — flights, hotels and packages' },
        ] },
        { label: 'Dining', tiles: [
          { title: 'Local dining & delivery', body: '6 miles per S$1 on local dining and food delivery — eat in or order in' },
          { title: 'Everyday categories', body: '3 miles per S$1 on other selected categories with min. S$500 monthly spend' },
        ] },
        { label: 'Miles', tiles: [
          { title: 'Direct crediting', body: 'Miles go straight to your KrisFlyer account — no manual conversion or transfer fees' },
          { title: 'Base earning', body: '1.2 miles per S$1 on all other spend, with no minimum and no cap' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the miles',
    secondaryBenefits: [
      { icon: 'Coin', title: 'KrisFlyer integration', body: 'Link once and watch miles post automatically to your KrisFlyer account each statement cycle.' },
      { icon: 'Plane', title: 'Travel privileges', body: 'Cardmember offers on flights, hotels and travel experiences through UOB and SIA partners.' },
      { icon: 'Phone', title: 'Mobile wallets', body: 'Add to Apple Pay, Google Pay or Samsung Pay and keep earning miles on every tap.' },
    ],
    calculation: {
      heading: 'How are your KrisFlyer miles calculated?',
      intro: 'KrisFlyer miles are credited straight to your account. You earn up to 6 miles per S$1 on eligible spend with min. S$500 a month, 3 miles on other selected categories, and 1.2 miles per S$1 on everything else.',
      example: {
        caption: 'KrisFlyer miles earned · Nov',
        parts: [
          { amount: '3,000 miles', note: '6 miles per S$1 on S$500 of SIA, dining & online travel' },
          { amount: '+ 1,500 miles', note: '3 miles per S$1 on S$500 of other selected categories' },
          { amount: '+ 600 miles', note: '1.2 miles per S$1 on S$500 of all other spend' },
        ],
        total: '= 5,100 miles',
      },
      cta: 'Estimate your miles',
    },
    linkedProduct: {
      eyebrow: 'Linked account',
      heading: 'Earn up to 3.4% p.a. by linking your UOB One Account',
      body: 'Pair this card with a UOB One Account and earn up to 3.4% p.a. interest when you:',
      points: ['spend a min. S$500 each month on your UOB card, and', 'credit your salary or make 3 GIRO transactions monthly'],
      cta: 'Get the details',
    },
    earn: { rate: '6 KF miles', detail: 'per S$1 on Singapore Airlines, dining & online travel' },
    fit: {
      verdict: 'The simplest way to feed your KrisFlyer balance. Ideal for SIA and Scoot loyalists who want miles direct to their account.',
      goodFor: [
        'You collect KrisFlyer miles and fly Singapore Airlines or Scoot',
        'You spend on dining, food delivery and online travel each month',
        'You want miles credited directly with no manual conversion',
      ],
      thinkTwice: [
        'You fly different airlines and want flexible, transferable miles (consider PRVI Miles)',
        'Your spend rarely reaches the S$500 monthly minimum for the accelerated tiers',
        'You’d rather earn cashback than miles',
      ],
    },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
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
    hero: {
      eyebrow: 'UOB EVOL Credit Card',
      headline: 'Up to 8% cashback on online & mobile spend',
      body: [
        '8% cashback on online spend, the way you actually shop',
        '0.3% base cashback on all other spend',
        'A card made from 85% recycled plastic',
      ],
      footnote: 'Min. S$600 monthly spend. Cap S$60/month. T&Cs apply.',
    },
    heroLabels: ['Online shopping', 'Mobile contactless', 'Food delivery', 'Streaming', 'Ride-hailing'],
    applyTiles: [
      { category: 'Online Shopping', value: '8%', metric: 'cashback', enhanced: true, at: 'on all your online spend', offerHeadline: 'Earn 8% cashback' },
      { category: 'Mobile Contactless', brands: ['applepay', 'googlepay'], value: '8%', metric: 'cashback', enhanced: true, at: 'whenever you use Apple Pay, Google Pay and more', offerHeadline: 'Earn 8% cashback' },
      { category: 'All other spend', value: '0.3%', metric: 'cashback', at: 'earned on everything else' },
    ],
    glance: {
      heading: 'UOB EVOL Card at a glance',
      rows: [
        { label: 'Cashback', points: ['0.3% base cashback on all spend — no minimum, no cap', 'Earned automatically on everything, everywhere Visa is accepted', 'Credited to your account every month'] },
        { label: 'Bonus cashback', points: ['8% cashback on online spend + 8% on mobile contactless', 'Unlock the 8% rates with min. S$600 monthly spend', 'Up to S$60 bonus cashback per month (S$720 a year)'], note: 'Below S$600 monthly spend you still earn the 0.3% base on all spend. T&Cs apply.' },
        { label: 'Annual fee', points: ['Principal card: S$196.20/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      image: 'evol',
      heading: 'Cashback for a generation that lives online',
      paragraphs: [
        'Online checkouts, food delivery, mobile taps — your money mostly moves through a screen.',
        'EVOL gives 8% cashback on exactly that: online spend and mobile contactless, where you live.',
        'And it’s made from 85% recycled plastic, with carbon-footprint tracking built into the app.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Up to 8% cashback where you spend most',
      howItWorks: {
        title: 'How you earn your cashback',
        steps: [
          'Spend at least S$600 in a calendar month to unlock the 8% bonus rates',
          'Earn 8% on online transactions and 8% on mobile contactless payments',
          'Bonus cashback is capped at S$60 per month; 0.3% base applies to everything else',
        ],
        note: 'Below S$600 monthly spend, you still earn 0.3% base cashback on all spend.',
      },
      tabs: [
        { label: 'Cashback', tiles: [
          { title: 'Online spend', body: '8% cashback on online transactions — shopping, food delivery, subscriptions and more' },
          { title: 'Mobile contactless', body: '8% cashback when you pay with Apple Pay, Google Pay or Samsung Pay' },
          { title: 'Everything else', body: '0.3% base cashback on all other spend, with no minimum' },
        ] },
        { label: 'Sustainability', tiles: [
          { title: 'Recycled card', body: 'The card body is made from 85% recycled plastic' },
          { title: 'Carbon tracking', body: 'See the estimated carbon footprint of your spending in the UOB TMRW app' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the cashback',
    secondaryBenefits: [
      { icon: 'Spark', title: 'Made to be greener', body: 'An 85% recycled-plastic card paired with in-app carbon-footprint insights on your spend.' },
      { icon: 'Phone', title: 'Mobile-first', body: 'Provision to your mobile wallet instantly after approval and start earning on your next tap.' },
      { icon: 'Coin', title: 'UOB Deals', body: 'Year-round cardmember offers on the brands and platforms you already use.' },
    ],
    calculation: {
      heading: 'How is your cashback calculated?',
      intro: 'Your cashback is worked out each month. Spend at least S$600 in the month to unlock the 8% bonus rates, which are capped at S$60 a month. A 0.3% base rate applies to everything else.',
      example: {
        caption: 'Cashback earned · Nov',
        parts: [
          { amount: 'S$48', note: '8% cashback on S$600 of online spend' },
          { amount: '+ S$12', note: '8% cashback on S$150 of mobile contactless (caps your bonus at S$60)' },
          { amount: '+ S$1.20', note: '0.3% base cashback on S$400 of other spend' },
        ],
        total: '= S$61.20',
      },
      cta: 'Calculate your cashback',
    },
    linkedProduct: {
      eyebrow: 'Linked account',
      heading: 'Earn up to 3.4% p.a. by linking your UOB One Account',
      body: 'Pair this card with a UOB One Account and earn up to 3.4% p.a. interest when you:',
      points: ['spend a min. S$500 each month on your UOB card, and', 'credit your salary or make 3 GIRO transactions monthly'],
      cta: 'Get the details',
    },
    earn: { rate: 'Up to 8%', detail: 'cashback on online & mobile contactless spend' },
    fit: {
      verdict: 'Made for online-and-mobile lives. Strong 8% rates exactly where you spend most day to day.',
      goodFor: [
        'Most of your spend is online or via mobile contactless (Apple Pay, Google Pay, Samsung Pay)',
        'You spend around S$600–S$750 a month — enough to max the bonus without wasting the cap',
        'You like the idea of a card made from recycled plastic with in-app carbon tracking',
      ],
      thinkTwice: [
        'You spend a lot each month — the S$60 monthly cashback cap is reached quickly',
        'Much of your spend is in-store and not contactless',
        'You want travel rewards or miles instead of cashback',
      ],
    },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
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
    hero: {
      eyebrow: 'UOB PRVI Miles Card',
      headline: 'Earn the highest miles, here and overseas',
      body: [
        'Up to 6 miles per S$1 on flights & hotels via UOB Travel',
        '2.4 miles per S$1 overseas and 1.4 miles per S$1 locally',
        'Your miles never expire — bank them for the trips that matter',
      ],
      footnote: 'Accelerated earn applies on eligible bookings via UOB Travel. T&Cs apply.',
    },
    heroLabels: ['Flights', 'Hotels', 'UOB Travel', 'Overseas spend', 'Local spend', 'Airport limo'],
    applyTiles: [
      { category: 'Flights & Hotels', brands: ['uobtravel'], value: 'Up to 6', metric: 'miles/S$1', enhanced: true, at: 'whenever you make a booking via UOB Travel', offerHeadline: 'Earn up to 6 miles per S$1' },
      { category: 'Overseas Spend', value: '2.4', metric: 'miles/S$1', at: 'on all foreign currency spend', offerHeadline: 'Earn 2.4 miles per S$1' },
      { category: 'Local Spend', value: '1.4', metric: 'miles/S$1', at: 'everyday spend in Singapore' },
    ],
    glance: {
      heading: 'UOB PRVI Miles Card at a glance',
      rows: [
        { label: 'Miles', points: ['1.4 miles per S$1 on all local spend — no minimum, no cap', 'Earned automatically on everyday purchases', 'Miles never expire while your account stays active'] },
        { label: 'Bonus miles', points: ['Up to 6 miles per S$1 on flights & hotels booked via UOB Travel', '2.4 miles per S$1 on all overseas spend, in any currency', 'Among the highest local & overseas earn in its class'], note: 'Overseas miles are earned automatically on foreign-currency spend. T&Cs apply.' },
        { label: 'Annual fee', points: ['Principal card: S$256.80/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      image: 'prvi',
      heading: 'Built for people who are always on the move',
      paragraphs: [
        'Whether you fly often or just love a good escape, PRVI Miles turns everyday spend into the highest-earning miles in its class.',
        'Earn up to 6 miles per S$1 on flights and hotels through UOB Travel, plus market-leading 2.4 miles overseas and 1.4 miles locally.',
        'Best of all, your miles never expire — so you can build a balance at your own pace and redeem when you’re ready to go.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'The highest local & overseas miles in its class',
      howItWorks: {
        title: 'How you earn your miles',
        steps: [
          'Book flights and hotels through UOB Travel to earn up to 6 miles per S$1',
          'Spend overseas in any currency to earn 2.4 miles per S$1 automatically',
          'Earn 1.4 miles per S$1 on all your local spend, with no minimum and no cap',
        ],
        note: 'Miles never expire while your account is active — no rush to redeem.',
      },
      tabs: [
        { label: 'Travel', tiles: [
          { title: 'Flights & hotels', body: '6 miles per S$1 on flight and hotel bookings made through UOB Travel' },
          { title: 'Airport privileges', body: 'Complimentary airport limousine transfers and lounge access for cardmembers' },
        ] },
        { label: 'Everyday', tiles: [
          { title: 'Overseas spend', body: '2.4 miles per S$1 on everything you spend abroad — dining, shopping and more' },
          { title: 'Local spend', body: '1.4 miles per S$1 on all local spend, with no minimum and no cap' },
        ] },
        { label: 'Miles', tiles: [
          { title: 'Never expire', body: 'Your miles stay yours for as long as your account is active — bank them freely' },
          { title: 'Flexible transfers', body: 'Convert UNI$ to KrisFlyer and other airline & hotel partners when you’re ready' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the miles',
    secondaryBenefits: [
      { icon: 'Plane', title: 'Airport limousine & lounge', body: 'Arrive in style with complimentary airport transfers and lounge access on qualifying spend.' },
      { icon: 'Shield', title: 'Travel insurance', body: 'Complimentary travel insurance coverage when you charge your trip to the card.' },
      { icon: 'Phone', title: 'Mobile wallets', body: 'Add to Apple Pay, Google Pay or Samsung Pay and keep earning miles on every tap.' },
    ],
    calculation: {
      heading: 'How are your miles calculated?',
      intro: 'You earn up to 6 miles per S$1 on flights and hotels booked via UOB Travel, 2.4 miles per S$1 on overseas spend, and 1.4 miles per S$1 on local spend. Your miles never expire.',
      example: {
        caption: 'Miles earned · Nov',
        parts: [
          { amount: '6,000 miles', note: '6 miles per S$1 on S$1,000 of flights & hotels via UOB Travel' },
          { amount: '+ 1,200 miles', note: '2.4 miles per S$1 on S$500 of overseas spend' },
          { amount: '+ 1,400 miles', note: '1.4 miles per S$1 on S$1,000 of local spend' },
        ],
        total: '= 8,600 miles',
      },
      cta: 'Estimate your miles',
    },
    linkedProduct: {
      eyebrow: 'Linked account',
      heading: 'Earn up to 3.4% p.a. by linking your UOB One Account',
      body: 'Pair this card with a UOB One Account and earn up to 3.4% p.a. interest when you:',
      points: ['spend a min. S$500 each month on your UOB card, and', 'credit your salary or make 3 GIRO transactions monthly'],
      cta: 'Get the details',
    },
    earn: { rate: '6 miles', detail: 'per S$1 on flights & hotels; 2.4 overseas, 1.4 local' },
    fit: {
      verdict: 'A frequent-flyer’s workhorse with the highest local & overseas earn in its class, and miles that never expire.',
      goodFor: [
        'You travel often and book flights or hotels through UOB Travel',
        'You spend overseas regularly and want a strong 2.4 miles per S$1 abroad',
        'You want miles that never expire and transfer to multiple airline partners',
      ],
      thinkTwice: [
        'You rarely travel — the higher S$256.80 annual fee is harder to justify',
        'You only want miles on one airline, credited directly (consider the KrisFlyer Card)',
        'You’d prefer cashback to miles',
      ],
    },
    fees: { annual: 'S$256.80', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
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
  {
    slug: 'absolute-cashback-card',
    name: 'UOB Absolute Cashback Card',
    tier: 'Cashback',
    accent: '#33373D',
    bestFor: 'Flat cashback on everything, no tiers to track',
    headline: '1.7% cashback on everything, no minimum spend',
    tags: ['cashback', 'everyday', 'shopping'],
    valueProp: 'The highest flat, limitless cashback — 1.7% with no minimum spend and no cap',
    image: 'absolute',
    hero: {
      eyebrow: 'UOB Absolute Cashback American Express® Card',
      headline: 'Flat 1.7% cashback on virtually everything',
      body: [
        '1.7% limitless cashback on almost all spend',
        'No minimum spend, no cashback cap, no categories to track',
        '20% cashback on your daily public-transport commute',
      ],
      footnote: 'NETS and a few categories are excluded. T&Cs apply.',
    },
    heroLabels: ['Everyday spend', 'Groceries', 'Dining', 'Online', 'Transport', 'Overseas'],
    applyTiles: [
      { category: 'Almost everything', value: '1.7%', metric: 'cashback', at: 'no minimum, no cap, no categories' },
      { category: 'Public Transport', brands: ['simplygo'], value: '20%', metric: 'cashback', enhanced: true, at: 'on all SimplyGo bus and train rides', offerHeadline: 'Get 20% cashback' },
      { category: 'Excluded spend', value: '0.3%', metric: 'cashback', at: 'NETS & a few categories' },
    ],
    glance: {
      heading: 'UOB Absolute Cashback Card at a glance',
      rows: [
        { label: 'Cashback', points: ['1.7% limitless cashback on virtually all retail spend — no minimum, no cap', 'Earned automatically on everything, everywhere American Express is accepted', 'Credited to your account every statement'] },
        { label: 'Lower-rate spend', points: ['0.3% cashback on local charity, education, government, healthcare, utilities, professional services & Grab wallet top-ups', 'No cashback on NETS, instalment plans, SmartPay, loans, balance transfers, cash advances & fees'], note: 'Everything outside these excluded categories earns the full 1.7%. T&Cs apply.' },
        { label: 'Annual fee', points: ['Principal card: S$196.20/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      heading: 'Cashback that just works — on everything',
      paragraphs: [
        'No bonus categories to pick. No minimum spend to chase. No cap to bump into.',
        'Spend as you normally would and earn a flat 1.7% back on virtually everything — automatically.',
        'It is the simplest way to earn the highest limitless cashback in Singapore.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Flat 1.7% cashback, the simple way',
      howItWorks: {
        title: 'How you earn your cashback',
        steps: [
          'Spend on the card as you normally would — no registration, no minimum',
          'Earn a flat 1.7% on virtually all retail spend, with no cap',
          'Cashback is credited to your statement automatically',
        ],
        note: 'A short list of categories (charity, education, healthcare, utilities and more) earns 0.3%, and NETS is excluded.',
      },
      tabs: [
        { label: 'Cashback', tiles: [
          { title: 'Everything else', body: '1.7% limitless cashback on virtually all retail spend — no minimum and no cap' },
          { title: 'Daily commute', body: '20% cashback on public-transport rides with Tap.Pay.Ride' },
          { title: 'Overseas spend', body: 'Keep earning 1.7% cashback when you spend abroad' },
        ] },
        { label: 'Lifestyle', tiles: [
          { title: 'American Express Offers', body: 'Curated cardmember offers across dining, retail and travel throughout the year' },
          { title: 'Contactless & wallets', body: 'Tap to pay and add the card to Apple Pay, Google Pay or Samsung Pay' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the cashback',
    secondaryBenefits: [
      { icon: 'Coin', title: 'No categories to track', body: 'One flat 1.7% rate on virtually everything — nothing to register, no tiers and no monthly cap to monitor.' },
      { icon: 'Wallet', title: 'No minimum spend', body: 'Earn cashback from your very first dollar — there is no monthly minimum to unlock the rate.' },
      { icon: 'Phone', title: 'Contactless & mobile wallets', body: 'Add it to Apple Pay, Google Pay or Samsung Pay and tap to pay wherever American Express is accepted.' },
    ],
    disclosures: [
      'The “highest limitless cashback” claim refers to the 1.7% flat rate among comparable no-cap cashback cards in Singapore.',
      'NETS transactions, instalment plans, SmartPay, loans, balance transfers, cash advances and fees do not earn cashback.',
      'Subject to qualifying criteria. Terms and conditions apply.',
    ],
    earn: { rate: '1.7%', detail: 'limitless cashback on virtually all spend — no minimum, no cap' },
    fit: {
      verdict: 'A no-fuss flat-rate card for people who would rather not track bonus categories or chase minimum-spend tiers.',
      goodFor: [
        'You want one simple cashback rate on everything, with no categories to track',
        'Your spend is uneven month to month and you do not want minimum-spend tiers',
        'You value a card with no cashback cap to bump into',
      ],
      thinkTwice: [
        'You spend heavily in specific categories — a tiered card like the UOB One may earn more',
        'You mostly want miles or travel perks rather than cashback',
        'You rely on NETS, which does not earn on this card',
      ],
    },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
    nextStep: '5 mins with Singpass · instant approval for most',
    highlights: [
      'Flat 1.7% cashback on virtually all spend',
      'No minimum spend and no cashback cap',
      '20% cashback on daily public-transport commute',
    ],
    benefitTabs: {
      Cashback: ['1.7% limitless cashback on virtually all spend', 'No minimum spend, no cap', '0.3% on a short list of excluded categories'],
      Everyday: ['20% cashback on public-transport commute', 'Earn the full rate on groceries, dining & online'],
    },
    faqs: [
      { q: 'Is there really no minimum spend or cap?', a: 'Correct — you earn 1.7% on virtually all spend from the first dollar, with no monthly minimum and no cashback cap.' },
      { q: 'What does not earn 1.7%?', a: 'A short list of categories (charity, education, government, healthcare, utilities, professional services and Grab wallet top-ups) earns 0.3%, and NETS, instalments, loans and fees do not earn cashback.' },
    ],
  },
  {
    slug: 'lazada-uob-card',
    name: 'Lazada-UOB Card',
    tier: 'Cashback',
    accent: '#1A0E8E',
    bestFor: 'Lazada & RedMart shoppers',
    headline: 'Up to 20% rebates on Lazada & RedMart',
    tags: ['shopping', 'cashback', 'everyday'],
    valueProp: 'Up to 20% back at Lazada and 6% at RedMart, paid as Lazada credit',
    image: 'lazada',
    hero: {
      eyebrow: 'Lazada-UOB Card',
      headline: 'Shop Lazada and RedMart for less',
      body: [
        'Up to 20% rebates at Lazada and 6% at RedMart',
        '0.3% rebate on all other everyday spend',
        'Rebates paid as Lazada Gift Card credit',
      ],
      footnote: 'Min. S$500 monthly spend to qualify. Monthly caps apply. T&Cs apply.',
    },
    heroLabels: ['Lazada', 'RedMart', 'Dining', 'Entertainment', 'Transport', 'Online'],
    applyTiles: [
      { category: 'Lazada', value: 'Up to 20%', metric: 'rebate', enhanced: true, at: 'at Lazada Singapore' },
      { category: 'RedMart', value: '6%', metric: 'rebate', enhanced: true, at: 'groceries on RedMart' },
      { category: 'Dining & Transport', value: '5%', metric: 'rebate', at: 'on all dining, entertainment and transport spend', offerHeadline: 'Get 5% rebate' },
      { category: 'All other spend', value: '0.3%', metric: 'rebate', at: 'paid as Lazada Gift Card credit' },
    ],
    glance: {
      heading: 'Lazada-UOB Card at a glance',
      rows: [
        { label: 'Rebates', points: ['20% rebates at Lazada (capped at S$20/month)', '6% rebates at RedMart (capped at S$20/month)', 'Paid monthly as Lazada Gift Card credit to your Lazada Wallet'] },
        { label: 'Bonus rebates', points: ['5% on dining, entertainment & transport (capped at S$25/month)', '0.3% on all other spend (capped at S$25/month)', 'Spend a minimum of S$500 each month to qualify for rebates'], note: 'Add your card as a payment method in your Lazada account to receive rebates. T&Cs apply.' },
        { label: 'Annual fee', points: ['Principal card: S$196.20/year (first year waived)', '1st supplementary card: Free', '2nd supplementary card onwards: S$98.10'] },
        { label: 'Minimum income', points: ['S$30,000/year (Singaporean/PR)', 'S$40,000/year (non-Singaporean)'] },
      ],
    },
    story: {
      heading: 'Made for the way you shop online',
      paragraphs: [
        'If your cart lives on Lazada and your groceries come from RedMart, this is the card that pays you back the most.',
        'Earn up to 20% at Lazada and 6% at RedMart, plus 5% on dining, entertainment and transport.',
        'Your rebates come back as Lazada credit — ready to spend on your next order.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Up to 20% back where you shop most',
      howItWorks: {
        title: 'How you earn your rebates',
        steps: [
          'Add your Lazada-UOB Card as a payment method in your Lazada account',
          'Spend a minimum of S$500 across the month to qualify',
          'Earn up to 20% at Lazada, 6% at RedMart and 5% on dining, entertainment & transport — paid as Lazada credit',
        ],
        note: 'Each rebate category has its own monthly cap. Rebates are issued as Lazada Gift Card credit.',
      },
      tabs: [
        { label: 'Rebates', tiles: [
          { title: 'Lazada', body: '20% rebates on Lazada purchases, capped at S$20 each month' },
          { title: 'RedMart', body: '6% rebates on RedMart groceries, capped at S$20 each month' },
          { title: 'Dining, entertainment & transport', body: '5% rebates on these everyday categories, capped at S$25 each month' },
        ] },
        { label: 'Everyday', tiles: [
          { title: 'Everything else', body: '0.3% rebates on all other spend, capped at S$25 each month' },
          { title: 'Linked savings', body: 'Pair with a UOB One Account to earn up to 3.4% p.a. interest on your savings' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the rebates',
    secondaryBenefits: [
      { icon: 'Spark', title: 'Rebates as Lazada credit', body: 'Your rebates return as Lazada Gift Card credit each month — ready to spend on your next order.' },
      { icon: 'Coin', title: 'Unlock bonus interest with your UOB One Account', body: 'Link a UOB One Account to earn up to 3.4% p.a. interest on your savings alongside your rebates.' },
      { icon: 'Phone', title: 'Contactless & mobile wallets', body: 'Add it to Apple Pay, Google Pay or Samsung Pay and tap to pay everywhere Visa is accepted.' },
    ],
    disclosures: [
      'Rebates require a minimum monthly spend of S$500 and are subject to per-category monthly caps.',
      'Rebates are issued as Lazada Gift Card credit to the principal cardmember’s Lazada Wallet.',
      'Subject to qualifying criteria. Terms and conditions apply.',
    ],
    earn: { rate: 'Up to 20%', detail: 'rebates at Lazada; 6% RedMart; 5% dining, entertainment & transport' },
    fit: {
      verdict: 'The card to hold if a big chunk of your spending runs through Lazada and RedMart each month.',
      goodFor: [
        'You shop on Lazada and RedMart regularly and can spend at least S$500 a month',
        'You are happy to receive rebates as Lazada credit rather than cash',
        'You want extra back on dining, entertainment and transport too',
      ],
      thinkTwice: [
        'You rarely shop on Lazada — a flat-rate card like UOB Absolute may suit you better',
        'You prefer cash rebates over Lazada credit',
        'Your monthly spend is below S$500, the threshold to earn rebates',
      ],
    },
    fees: { annual: 'S$196.20', waiver: 'First year waived', fx: '3.25% of transaction amount', supplementary: '1st card free · S$98.10 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$30,000', incomeForeigner: 40000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest payslip or 15-month CPF statement — or apply instantly with Singpass Myinfo' },
    nextStep: '5 mins with Singpass · instant approval for most',
    highlights: [
      'Up to 20% rebates at Lazada, 6% at RedMart',
      '5% on dining, entertainment & transport',
      'Rebates paid as Lazada Gift Card credit',
    ],
    benefitTabs: {
      Rebates: ['20% at Lazada (cap S$20/mo)', '6% at RedMart (cap S$20/mo)', '5% on dining, entertainment & transport (cap S$25/mo)'],
      Everyday: ['0.3% on all other spend (cap S$25/mo)', 'Min. S$500 monthly spend to qualify'],
    },
    faqs: [
      { q: 'How are my rebates paid out?', a: 'Rebates are issued monthly as Lazada Gift Card credit to your Lazada Wallet, which you can use to offset future Lazada purchases.' },
      { q: 'Do I need to hit a minimum spend?', a: 'Yes — you need to spend at least S$500 in a month to qualify for that month’s rebates, and each category has its own monthly cap.' },
    ],
  },
  {
    slug: 'visa-infinite-metal-card',
    name: 'UOB Visa Infinite Metal Card',
    tier: 'Travel',
    accent: '#2C2F36',
    bestFor: 'High earners who want premium travel perks',
    headline: 'Up to 2.4 miles per S$1 with lounge access',
    tags: ['travel', 'miles', 'dining'],
    valueProp: 'A premium metal card — 2.4 miles/S$1 overseas, 12 lounge passes and rich travel cover',
    image: 'visa-infinite',
    hero: {
      eyebrow: 'UOB Visa Infinite Metal Card',
      headline: 'Travel further with miles and lounge access',
      body: [
        '2.4 miles per S$1 overseas and 1.4 miles per S$1 locally',
        '12 complimentary airport lounge visits a year via DragonPass',
        'Up to US$1,000,000 travel personal-accident cover',
      ],
      footnote: 'Membership fee is non-waivable. T&Cs apply.',
    },
    heroLabels: ['Overseas spend', 'Local spend', 'Airport lounges', 'Travel insurance', 'Golf', 'Concierge'],
    applyTiles: [
      { category: 'Overseas Spend', value: '2.4', metric: 'miles/S$1', enhanced: true, at: 'on all foreign currency spend', offerHeadline: 'Earn 2.4 miles per S$1' },
      { category: 'Local Spend', value: '1.4', metric: 'miles/S$1', at: 'everyday spend in Singapore' },
      { category: 'Airport Lounges', brands: ['dragonpass'], value: '12 visits', metric: 'a year', at: 'complimentary via DragonPass' },
      { category: 'Travel Cover', value: 'US$1M', metric: 'protection', at: 'your all-in-one travel personal accident cover', offerHeadline: 'Get US$1 million protection' },
    ],
    glance: {
      heading: 'UOB Visa Infinite Metal Card at a glance',
      rows: [
        { label: 'Miles', points: ['2.4 miles per S$1 on overseas spend, in any currency', '1.4 miles per S$1 on all local spend — no cap', 'No conversion fees when you redeem your miles'] },
        { label: 'Travel privileges', points: ['12 complimentary airport lounge visits a year via DragonPass (1,400+ lounges)', 'Up to US$1,000,000 travel personal-accident insurance', '50% off weekday green fees at 50 clubs across Southeast Asia', '24/7 concierge assistance'] },
        { label: 'Annual fee', points: ['Principal card: S$654/year (inclusive of GST) — strictly non-waivable', '1st supplementary card: Free for life', '2nd supplementary card onwards: S$293.38'] },
        { label: 'Minimum income', points: ['S$120,000/year'] },
      ],
    },
    story: {
      heading: 'A premium card for the way you travel',
      paragraphs: [
        'Held in the hand, the metal card sets the tone — but it is the privileges that earn its place in your wallet.',
        'Earn 2.4 miles per S$1 overseas and 1.4 miles locally, then relax in 1,400+ airport lounges worldwide.',
        'With up to US$1,000,000 travel cover and round-the-clock concierge, every trip is taken care of.',
      ],
    },
    benefits: {
      eyebrow: 'Benefits',
      heading: 'Miles, lounges and premium travel cover',
      howItWorks: {
        title: 'How you earn your miles',
        steps: [
          'Spend overseas in any currency to earn 2.4 miles per S$1',
          'Earn 1.4 miles per S$1 on all your local spend, with no cap',
          'Redeem your miles with no conversion fees',
        ],
        note: 'Lounge access, travel insurance and golf privileges come built in with the card.',
      },
      tabs: [
        { label: 'Travel', tiles: [
          { title: 'Airport lounges', body: '12 complimentary visits a year via DragonPass, across 1,400+ lounges worldwide' },
          { title: 'Travel insurance', body: 'Up to US$1,000,000 travel personal-accident cover, plus purchase protection' },
          { title: 'Concierge', body: '24/7 concierge assistance for travel, dining and lifestyle requests' },
        ] },
        { label: 'Miles', tiles: [
          { title: 'Overseas spend', body: '2.4 miles per S$1 on everything you spend abroad' },
          { title: 'Local spend', body: '1.4 miles per S$1 on all local spend, with no cap' },
        ] },
        { label: 'Lifestyle', tiles: [
          { title: 'Golf privileges', body: '50% off weekday green fees at 50 clubs across Southeast Asia' },
          { title: 'Metal card', body: 'A premium metal card with dedicated cardmember offers throughout the year' },
        ] },
      ],
    },
    secondaryHeading: 'Beyond the miles',
    secondaryBenefits: [
      { icon: 'Plane', title: 'Global lounge access', body: '12 complimentary airport lounge visits a year via DragonPass, at over 1,400 lounges worldwide.' },
      { icon: 'Shield', title: 'Rich travel insurance', body: 'Up to US$1,000,000 travel personal-accident cover when you charge your trip to the card.' },
      { icon: 'Phone', title: 'Mobile wallets', body: 'Add to Apple Pay, Google Pay or Samsung Pay and keep earning miles on every tap.' },
    ],
    calculation: {
      heading: 'How are your miles calculated?',
      intro: 'You earn 2.4 miles per S$1 on overseas spend and 1.4 miles per S$1 on local spend, with no conversion fees on redemption.',
      example: {
        caption: 'Miles earned · Nov',
        parts: [
          { amount: '4,800 miles', note: '2.4 miles per S$1 on S$2,000 of overseas spend' },
          { amount: '+ 2,800 miles', note: '1.4 miles per S$1 on S$2,000 of local spend' },
        ],
        total: '= 7,600 miles',
      },
      cta: 'Estimate your miles',
    },
    disclosures: [
      'The S$654 annual membership fee (inclusive of GST) is strictly non-waivable.',
      'A minimum annual income of S$120,000 is required to apply.',
      'Subject to qualifying criteria. Terms and conditions apply.',
    ],
    earn: { rate: '2.4 miles', detail: 'per S$1 overseas, 1.4 miles per S$1 local' },
    fit: {
      verdict: 'A premium travel card for higher earners who will use the lounge access, travel cover and concierge enough to justify the non-waivable fee.',
      goodFor: [
        'You earn at least S$120,000 a year and travel often',
        'You will use airport lounge access and premium travel insurance',
        'You spend overseas regularly and want a strong 2.4 miles per S$1 abroad',
      ],
      thinkTwice: [
        'You travel rarely — the S$654 non-waivable fee is hard to justify',
        'You want a waivable annual fee',
        'You prefer cashback to miles and lounge perks',
      ],
    },
    fees: { annual: 'S$654', waiver: 'Non-waivable', fx: '3.25% of transaction amount', supplementary: '1st card free for life · S$293.38 each thereafter', latePayment: 'S$100', minPayment: 'S$50 or 3% of balance, whichever is higher' },
    eligibility: { income: 'S$120,000', incomeForeigner: 120000, age: '21', residency: 'Singaporean / PR', documents: 'NRIC (or passport + work pass), latest income documents — or apply with Singpass Myinfo' },
    nextStep: '5 mins with Singpass · for income S$120,000+',
    highlights: [
      '2.4 miles per S$1 overseas, 1.4 miles per S$1 local',
      '12 complimentary lounge visits a year via DragonPass',
      'Up to US$1,000,000 travel personal-accident cover',
    ],
    benefitTabs: {
      Travel: ['12 DragonPass lounge visits a year', 'Up to US$1,000,000 travel cover', '50% off weekday golf at 50 clubs'],
      Miles: ['2.4 miles/S$1 overseas, 1.4 miles/S$1 local', 'No conversion fees on redemption'],
    },
    faqs: [
      { q: 'Can the annual fee be waived?', a: 'No. The S$654 membership fee (inclusive of GST) is strictly non-waivable for the principal card.' },
      { q: 'What income do I need to apply?', a: 'A minimum annual income of S$120,000 is required for the UOB Visa Infinite Metal Card.' },
    ],
  },
]

export const cardBySlug = (slug) => CARDS.find((c) => c.slug === slug)

// Hybrid demo data: anchored to UOB's real June 2026 sign-up gifts (Samsonite
// EVOA luggage, Apple AirPods 4, S$60 online-sign-up cash, up-to-60k miles),
// reassigned sensibly across our six cards as plausible illustrative offers.
// Worth figures are only shown where UOB states one (Samsonite S$600); others
// are intentionally omitted rather than invented. Still illustrative — verify
// against the live campaign before any real use.
// Welcome gifts are tied to the cards that genuinely offer them (crawled from
// uob.com.sg sign-up offers, June 2026). The 6 lifestyle/miles cards run
// cashback-boost / fee-waiver welcome offers rather than physical gifts, so the
// physical rewards live on the three cards that actually carry them.
export const PROMOS = [
  {
    id: 'samsonite',
    category: 'Sign-up gift',
    reward: 'Samsonite EVOA Z Spinner 25"',
    worth: 'S$600',
    rewardImage: 'luggage',
    cards: ['absolute-cashback-card'],
    benefit: 'Samsonite EVOA Z 25" Spinner — worth S$600',
    condition: 'New-to-UOB, approved by 30 Jun 2026. Spend min S$2,000/month for 2 consecutive months',
    validUntil: '2026-06-30',
    endsSoon: true,
  },
  {
    id: 'airpods4',
    category: 'Sign-up gift',
    reward: 'Apple AirPods 4',
    rewardImage: 'airpods',
    cards: ['lazada-uob-card'],
    benefit: 'A pair of Apple AirPods 4',
    condition: 'Apply 1 Jun–31 Aug 2026. Spend min S$100/month on Lazada for 3 consecutive months',
    validUntil: '2026-08-31',
    endsSoon: false,
  },
  {
    id: 'bonus-miles',
    category: 'Travel offer',
    reward: 'Up to 60,000 miles',
    rewardImage: 'miles',
    cards: ['visa-infinite-metal-card'],
    benefit: 'Up to 60,000 bonus miles (40,000 for existing members)',
    condition: 'Spend S$4,000 within 30 days of approval and pay the annual membership fee',
    validUntil: '2026-06-30',
    endsSoon: true,
  },
]
