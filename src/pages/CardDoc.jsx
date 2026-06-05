import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cardBySlug } from '../data/cards'
import { Icon } from '../lib/icons'

// "PDFs that answer the question instead of burying it" (Alexa — UX/IA).
// A buried product PDF, reimagined as a human-readable, crawlable HTML document:
//  - plain-language cover summary up top (what it is / who it's for / what to know)
//  - a contents list so a user can jump straight to one answer
//  - fees, rates and caps as real HTML tables (not screenshots inside a PDF)
//  - full legal clauses kept below, in a consistent hierarchy
//
// This sample is built for the UOB One Card.
const DOC = {
  'one-card': {
    fileName: 'uob-one-card-product-factsheet.pdf',
    updated: '1 May 2026',
    title: 'UOB One Card — fees, rates & key terms',
    summary: {
      what: 'A cashback credit card for everyday spend in Singapore — groceries, transport, bills, food delivery and online shopping.',
      who: 'Singaporeans & PRs earning at least S$30,000 a year who can spend a minimum of S$500 each month.',
      know: [
        'Annual fee is S$196.20 — waived for the first year.',
        'Up to 10% cashback, capped at S$200 per quarter, when you meet the minimum spend.',
        'Interest of 26.9% p.a. applies if you don’t pay your statement in full.',
      ],
    },
    contents: [
      { id: 'fees', label: 'Fees & charges' },
      { id: 'rates', label: 'Interest rates' },
      { id: 'cashback', label: 'Cashback & caps' },
      { id: 'eligibility', label: 'Who can apply' },
      { id: 'terms', label: 'Full terms & conditions' },
    ],
    fees: [
      ['Annual fee (principal)', 'S$196.20 · first year waived'],
      ['1st supplementary card', 'Free'],
      ['2nd supplementary card onwards', 'S$98.10 each'],
      ['Late payment fee', 'S$100'],
      ['Foreign currency transaction', '3.25% of amount'],
      ['Cash advance fee', '8% or S$15, whichever is higher'],
      ['Over-limit fee', 'S$40'],
    ],
    rates: [
      ['Retail purchases', '26.9% p.a.'],
      ['Cash advances', '28.9% p.a.'],
      ['Minimum monthly payment', 'S$50 or 3% of balance, whichever is higher'],
      ['Interest-free period', 'Up to 23 days (if previous balance paid in full)'],
    ],
    cashback: {
      note: 'Cashback is paid quarterly when you meet the minimum monthly spend for 3 consecutive months. Each tier is capped per quarter.',
      rows: [
        ['S$600 / month', 'S$60 / quarter', 'up to 3.33%'],
        ['S$1,000 / month', 'S$100 / quarter', 'up to 3.33%'],
        ['S$2,000 / month', 'S$200 / quarter', 'up to 3.33%'],
      ],
    },
    eligibility: [
      ['Age', '21 years and above'],
      ['Income (Singaporean / PR)', 'S$30,000 per year'],
      ['Income (non-Singaporean)', 'S$40,000 per year'],
      ['Documents', 'NRIC, latest income proof (or CPF statement)'],
    ],
    terms: [
      {
        h: '1. Cashback computation',
        p: 'Cashback is calculated on eligible retail transactions posted within a calendar quarter. Cash advances, balance transfers, fund transfers, annual fees, late charges, instalment-plan amounts and tax payments are excluded from eligible spend and from the cashback cap.',
      },
      {
        h: '2. Minimum spend & qualifying purchases',
        p: 'A minimum of 10 eligible card transactions per statement month is required, in addition to meeting the minimum spend tier, for cashback to accrue for that quarter. Spend across principal and supplementary cards is aggregated.',
      },
      {
        h: '3. Fees & interest',
        p: 'The annual fee is charged on card approval and on each anniversary, subject to any waiver in force. Interest is charged on the unpaid balance at the prevailing rate when the statement balance is not paid in full by the payment due date. The Bank may vary fees and rates with 30 days’ notice.',
      },
      {
        h: '4. General',
        p: 'These terms are to be read with the UOB Cardmember Agreement and the UOB Deals & Privileges terms. In the event of inconsistency, the Cardmember Agreement prevails. The Bank may amend these terms from time to time and will give notice where required by law.',
      },
    ],
  },
}

export default function CardDoc() {
  const { slug } = useParams()
  const card = cardBySlug(slug)
  const doc = DOC[slug]
  if (!card || !doc) return <Navigate to={`/cards/${slug || ''}`} replace />

  const jump = (id) => {
    const el = document.getElementById(id)
    const scroller = document.querySelector('main')
    if (el && scroller) scroller.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#eceff4] pb-16">
      {/* Document chrome — looks like an opened file, with the old filename and
          a "readable version" badge to signal the reframe from the slide. */}
      <div className="sticky top-0 z-20 border-b border-line bg-white/95 px-5 py-3 backdrop-blur">
        <Link to={`/cards/${slug}`} className="inline-flex items-center gap-1 text-[13px] font-semibold text-royal">
          <Icon.ArrowLeft size={16} /> Back to card
        </Link>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-uobred/10 text-uobred">
            <Icon.Doc size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-navy">{doc.fileName}</p>
            <p className="text-[11px] text-slatey">Updated {doc.updated}</p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sky-soft px-3 py-1.5 text-[12px] font-bold text-royal hover:bg-royal/10"
          >
            <Icon.Download size={15} />
            Download
          </button>
        </div>
      </div>

      {/* The "page" */}
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-3 my-4 overflow-hidden rounded-card bg-white shadow-tile ring-1 ring-line/70"
      >
        {/* Cover summary */}
        <header className="border-b border-line/70 px-5 pb-6 pt-6">
          <p className="eyebrow">Product factsheet</p>
          <h1 className="mt-1.5 font-display text-[20px] font-bold leading-tight text-navy">{doc.title}</h1>

          <div className="mt-5 space-y-3.5">
            <SummaryRow label="What it is" value={doc.summary.what} />
            <SummaryRow label="Who it’s for" value={doc.summary.who} />
          </div>

          <div className="mt-5 rounded-tile bg-sky-soft px-4 py-4 ring-1 ring-royal/10">
            <p className="text-[12px] font-bold uppercase tracking-wide text-royal">What you need to know</p>
            <ul className="mt-2.5 space-y-2">
              {doc.summary.know.map((k) => (
                <li key={k} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink">
                  <Icon.Check size={16} className="mt-0.5 shrink-0 text-royal" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Contents */}
        <nav className="border-b border-line/70 px-5 py-5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-slatey">On this page</p>
          <ol className="mt-2.5 space-y-0.5">
            {doc.contents.map((c, i) => (
              <li key={c.id}>
                <button
                  onClick={() => jump(c.id)}
                  className="flex w-full items-center justify-between gap-3 py-1.5 text-left text-[13.5px] text-royal"
                >
                  <span><span className="text-slatey">{i + 1}.</span> {c.label}</span>
                  <Icon.Arrow size={14} className="shrink-0 -rotate-45" />
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Fees & charges */}
        <DocSection id="fees" title="Fees & charges">
          <DataTable rows={doc.fees} />
        </DocSection>

        {/* Interest rates */}
        <DocSection id="rates" title="Interest rates">
          <DataTable rows={doc.rates} />
        </DocSection>

        {/* Cashback & caps */}
        <DocSection id="cashback" title="Cashback & caps">
          <div className="overflow-hidden rounded-tile ring-1 ring-line/70">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-mist text-left text-[11px] uppercase tracking-wide text-slatey">
                  <th className="px-3.5 py-2.5 font-bold">Monthly spend</th>
                  <th className="px-3.5 py-2.5 font-bold">Cashback</th>
                  <th className="px-3.5 py-2.5 font-bold">Base rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {doc.cashback.rows.map((r) => (
                  <tr key={r[0]}>
                    <td className="px-3.5 py-3 font-semibold text-navy">{r[0]}</td>
                    <td className="px-3.5 py-3 text-ink">{r[1]}</td>
                    <td className="px-3.5 py-3 text-ink">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 text-[12px] leading-relaxed text-slatey">{doc.cashback.note}</p>
        </DocSection>

        {/* Eligibility */}
        <DocSection id="eligibility" title="Who can apply">
          <DataTable rows={doc.eligibility} />
        </DocSection>

        {/* Full terms */}
        <DocSection id="terms" title="Full terms & conditions" last>
          <div className="space-y-4">
            {doc.terms.map((t) => (
              <div key={t.h}>
                <h3 className="text-[13.5px] font-bold text-navy">{t.h}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-slatey">{t.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-line/70 pt-4 text-[11.5px] leading-relaxed text-slatey">
            This is an illustrative sample for Project Simple. Figures are representative of the
            UOB One Card and are not a substitute for the official terms.
          </p>
        </DocSection>
      </motion.article>
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-wide text-slatey">{label}</p>
      <p className="mt-1 text-[14px] leading-relaxed text-ink">{value}</p>
    </div>
  )
}

function DocSection({ id, title, children, last }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-6 ${last ? '' : 'border-b border-line/70'}`}>
      <h2 className="mb-3 font-display text-[16px] font-bold text-navy">{title}</h2>
      {children}
    </section>
  )
}

function DataTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-tile ring-1 ring-line/70">
      <table className="w-full border-collapse text-[13px]">
        <tbody className="divide-y divide-line/70">
          {rows.map((r) => (
            <tr key={r[0]} className="align-top">
              <th scope="row" className="w-[46%] bg-mist/60 px-3.5 py-3 text-left font-semibold text-navy">{r[0]}</th>
              <td className="px-3.5 py-3 text-ink">{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
