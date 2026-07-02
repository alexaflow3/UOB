// Product bundles — CASA cross-sell handled WITHIN the card pages (a bundle
// block on the PDP) plus a dedicated, crawlable bundle landing page. This is
// the in-scope answer to "how would you encourage new-to-One Card customers to
// apply for both the One Credit Card and the One Account" — the confirmation-
// step add-on in the apply flow is a separate, later touchpoint.

export const BUNDLES = {
  one: {
    slug: 'one',
    cardSlug: 'one-card',
    accountName: 'UOB One Account',
    name: 'UOB One Card + UOB One Account',
    tagline: 'The everyday duo that pays you twice',
    // Answer-first summary — the direct, quotable answer for AI/search (GEO).
    summary:
      'Pairing the UOB One Card with a UOB One Account makes your everyday money work twice: earn up to 5% cashback on what you spend and up to 3.4% p.a. bonus interest on what you save. You unlock the bonus interest when you spend at least S$500 a month on the card and credit your salary or make 3 GIRO payments.',
    // The two halves of the combined value (spend side + save side).
    combined: [
      { k: 'Up to 5%', v: 'cashback on everyday spend', src: 'from the UOB One Card' },
      { k: 'Up to 3.4% p.a.', v: 'bonus interest on your savings', src: 'from the UOB One Account' },
    ],
    // What it takes to unlock the full bundle rate.
    unlock: [
      'Spend a minimum of S$500 each month on your UOB One Card',
      'Credit your salary or make 3 GIRO payments from your UOB One Account',
    ],
    // Why apply for both together (the pitch, framed as loss-aversion).
    reasons: [
      { icon: 'Coin', title: 'Your spend works twice', body: 'The same monthly spend that earns cashback also unlocks bonus interest on your savings — nothing extra to do.' },
      { icon: 'Clock', title: 'One application, both products', body: 'Apply for the card and open the account in a single Singpass-verified flow. Details are shared, so there’s nothing to re-enter.' },
      { icon: 'Shield', title: 'Fully insured savings', body: 'SGD deposits in your UOB One Account are insured up to S$100,000 by SDIC.' },
    ],
    faqs: [
      {
        q: 'Can I apply for the UOB One Card and One Account at the same time?',
        a: 'Yes. New-to-bank customers can apply for both in one Singpass-verified flow — your details carry across, so you only enter them once.',
      },
      {
        q: 'How do I unlock the up to 3.4% p.a. bonus interest?',
        a: 'Spend at least S$500 a month on your UOB One Card and either credit your salary or make 3 GIRO payments from your UOB One Account. Meet both and the bonus interest applies on eligible balances.',
      },
      {
        q: 'Do I need the account to use the card?',
        a: 'No. The card works on its own for up to 5% cashback. The One Account is what adds the savings interest on top — that’s why the two are stronger together.',
      },
    ],
  },
}

export const bundleBySlug = (s) => BUNDLES[s]
