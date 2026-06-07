#!/usr/bin/env python3
"""
Generate the UOB One Card product factsheet as a real, downloadable PDF.

Recreates the clean "floating white page" look of the in-app factsheet:
a white rounded panel on a soft grey field, the real UOB logo in the header,
hairline-divided sections, a sky-soft "what you need to know" box, and soft
rounded tables. Content mirrors the old in-app CardDoc document.

Output: public/uob-one-card-product-factsheet.pdf  (served by Vite under /UOB/)
"""
import os
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)

# ---- UOB brand palette ------------------------------------------------------
ROYAL = colors.HexColor("#005eb8")
NAVY = colors.HexColor("#0a2240")
INK = colors.HexColor("#333333")
SLATEY = colors.HexColor("#5f6670")
UOBRED = colors.HexColor("#d50025")
MIST = colors.HexColor("#f1f4f8")
MIST_60 = colors.HexColor("#f6f8fb")
SKY_SOFT = colors.HexColor("#edf5ff")
LINE = colors.HexColor("#dfe4ec")
LINE_70 = colors.HexColor("#e6eaf1")
PAGE_BG = colors.HexColor("#eceff4")
SKY_RING = colors.HexColor("#cfe0f5")
ORANGE = colors.HexColor("#F09252")      # UOB "Confident" accent
ORANGE_DK = colors.HexColor("#B5521A")
ZEBRA = colors.HexColor("#f8fafc")

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(HERE, "src", "assets", "uob-logo.png")

# ---- Document content (kept in sync with the in-app CardDoc document) --------
FILE_NAME = "uob-one-card-product-factsheet.pdf"
UPDATED = "1 May 2026"
TITLE = "UOB One Card"
SUBTITLE = "Fees, rates &amp; key terms — at a glance"

# Headline facts for the stat band (the "not boring" hero strip).
STATS = [
    ("Up to 10%", "cashback on eligible spend"),
    ("S$196.20", "annual fee · 1st year free"),
    ("S$30,000", "min. income (SG / PR)"),
]

SUMMARY_WHAT = ("A cashback credit card for everyday spend in Singapore — groceries, "
                "transport, bills, food delivery and online shopping.")
SUMMARY_WHO = ("Singaporeans &amp; PRs earning at least S$30,000 a year who can spend a "
               "minimum of S$500 each month.")
KNOW = [
    "Annual fee is S$196.20 — waived for the first year.",
    "Up to 10% cashback, capped at S$200 per quarter, when you meet the minimum spend.",
    "Interest of 26.9% p.a. applies if you don’t pay your statement in full.",
]

CONTENTS = [
    "Fees &amp; charges",
    "Interest rates",
    "Cashback &amp; caps",
    "Who can apply",
    "Full terms &amp; conditions",
]

FEES = [
    ["Annual fee (principal)", "S$196.20 · first year waived"],
    ["1st supplementary card", "Free"],
    ["2nd supplementary card onwards", "S$98.10 each"],
    ["Late payment fee", "S$100"],
    ["Foreign currency transaction", "3.25% of amount"],
    ["Cash advance fee", "8% or S$15, whichever is higher"],
    ["Over-limit fee", "S$40"],
]

RATES = [
    ["Retail purchases", "26.9% p.a."],
    ["Cash advances", "28.9% p.a."],
    ["Minimum monthly payment", "S$50 or 3% of balance, whichever is higher"],
    ["Interest-free period", "Up to 23 days (if previous balance paid in full)"],
]

CASHBACK_HEAD = ["Monthly spend", "Cashback", "Base rate"]
CASHBACK_ROWS = [
    ["S$600 / month", "S$60 / quarter", "up to 3.33%"],
    ["S$1,000 / month", "S$100 / quarter", "up to 3.33%"],
    ["S$2,000 / month", "S$200 / quarter", "up to 3.33%"],
]
CASHBACK_NOTE = ("Cashback is paid quarterly when you meet the minimum monthly spend for 3 "
                 "consecutive months. Each tier is capped per quarter.")

ELIGIBILITY = [
    ["Age", "21 years and above"],
    ["Income (Singaporean / PR)", "S$30,000 per year"],
    ["Income (non-Singaporean)", "S$40,000 per year"],
    ["Documents", "NRIC, latest income proof (or CPF statement)"],
]

TERMS = [
    ("1. Cashback computation",
     "Cashback is calculated on eligible retail transactions posted within a calendar quarter. "
     "Cash advances, balance transfers, fund transfers, annual fees, late charges, instalment-plan "
     "amounts and tax payments are excluded from eligible spend and from the cashback cap."),
    ("2. Minimum spend &amp; qualifying purchases",
     "A minimum of 10 eligible card transactions per statement month is required, in addition to "
     "meeting the minimum spend tier, for cashback to accrue for that quarter. Spend across principal "
     "and supplementary cards is aggregated."),
    ("3. Fees &amp; interest",
     "The annual fee is charged on card approval and on each anniversary, subject to any waiver in "
     "force. Interest is charged on the unpaid balance at the prevailing rate when the statement "
     "balance is not paid in full by the payment due date. The Bank may vary fees and rates with 30 "
     "days’ notice."),
    ("4. General",
     "These terms are to be read with the UOB Cardmember Agreement and the UOB Deals &amp; Privileges "
     "terms. In the event of inconsistency, the Cardmember Agreement prevails. The Bank may amend these "
     "terms from time to time and will give notice where required by law."),
]

DISCLAIMER = ("This is an illustrative sample for Project Simple. Figures are representative of the "
              "UOB One Card and are not a substitute for the official terms.")

# ---- Geometry: a narrow "mobile web article" page (not A4) ------------------
# Sized between desktop and mobile so it fits-to-width comfortably on a phone
# (large type, single column) while still reading fine on desktop.
PAGE_W, PAGE_H = (470, 770)
PANEL_M = 0               # full bleed — the page fills the sheet edge to edge
INNER = 30                # content margin from the page edge (points)
HEADER_H = 46             # logo + eyebrow zone at the top of the page
FOOTER_H = 30             # footer zone at the bottom of the page

PANEL_X = PANEL_M
PANEL_Y = PANEL_M
PANEL_W = PAGE_W - 2 * PANEL_M
PANEL_H = PAGE_H - 2 * PANEL_M
PANEL_TOP = PANEL_Y + PANEL_H

FRAME_X = PANEL_X + INNER
FRAME_W = PANEL_W - 2 * INNER
FRAME_TOP = PANEL_TOP - HEADER_H
FRAME_BOTTOM = PANEL_Y + FOOTER_H
FRAME_H = FRAME_TOP - FRAME_BOTTOM

CONTENT_W = FRAME_W

# ---- Styles -----------------------------------------------------------------
styles = {
    "eyebrow": ParagraphStyle("eyebrow", fontName="Helvetica-Bold", fontSize=11,
                              textColor=ROYAL, leading=14, spaceAfter=4),
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=27, textColor=NAVY,
                         leading=31, spaceAfter=0),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=14.5,
                               textColor=SLATEY, leading=20),
    "stat_num": ParagraphStyle("stat_num", fontName="Helvetica-Bold", fontSize=20,
                               textColor=ROYAL, leading=23),
    "stat_label": ParagraphStyle("stat_label", fontName="Helvetica", fontSize=10,
                                 textColor=SLATEY, leading=13, spaceBefore=3),
    "label": ParagraphStyle("label", fontName="Helvetica-Bold", fontSize=10.5,
                            textColor=SLATEY, leading=14, spaceAfter=3),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=14.5, textColor=INK,
                           leading=21),
    "know_head": ParagraphStyle("know_head", fontName="Helvetica-Bold", fontSize=11,
                                textColor=ROYAL, leading=15, spaceAfter=7),
    "know_item": ParagraphStyle("know_item", fontName="Helvetica", fontSize=13.5,
                                textColor=INK, leading=20, leftIndent=18,
                                bulletIndent=0, spaceAfter=3),
    "contents_head": ParagraphStyle("contents_head", fontName="Helvetica-Bold",
                                    fontSize=11, textColor=SLATEY, leading=15,
                                    spaceAfter=6),
    "contents_item": ParagraphStyle("contents_item", fontName="Helvetica", fontSize=14.5,
                                    textColor=ROYAL, leading=26),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=19, textColor=NAVY,
                         leading=24, spaceBefore=2, spaceAfter=11),
    "cell_key": ParagraphStyle("cell_key", fontName="Helvetica-Bold", fontSize=13,
                               textColor=NAVY, leading=18),
    "cell_val": ParagraphStyle("cell_val", fontName="Helvetica", fontSize=13,
                               textColor=INK, leading=18),
    "cell_head": ParagraphStyle("cell_head", fontName="Helvetica-Bold", fontSize=10.5,
                                textColor=SLATEY, leading=14),
    "cell_head_w": ParagraphStyle("cell_head_w", fontName="Helvetica-Bold", fontSize=10,
                                  textColor=colors.white, leading=14),
    "note": ParagraphStyle("note", fontName="Helvetica", fontSize=12, textColor=SLATEY,
                           leading=17, spaceBefore=8),
    "term_h": ParagraphStyle("term_h", fontName="Helvetica-Bold", fontSize=14,
                             textColor=NAVY, leading=19, spaceAfter=3),
    "term_p": ParagraphStyle("term_p", fontName="Helvetica", fontSize=12.5,
                             textColor=SLATEY, leading=18, spaceAfter=9),
    "disclaimer": ParagraphStyle("disclaimer", fontName="Helvetica-Oblique", fontSize=11,
                                 textColor=SLATEY, leading=16),
}


# ---- Soft, rounded tables (echo the in-app ring-1 rounded-tile cards) --------
def two_col_table(rows):
    data = [[Paragraph(k, styles["cell_key"]), Paragraph(v, styles["cell_val"])] for k, v in rows]
    t = Table(data, colWidths=[CONTENT_W * 0.46, CONTENT_W * 0.54])
    t.setStyle(TableStyle([
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, ZEBRA]),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, LINE_70),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("ROUNDEDCORNERS", [9, 9, 9, 9]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


# Headline-fact stat band — three tiles with a big royal number over a label.
def stat_band():
    cells = [[Paragraph(n, styles["stat_num"]), Paragraph(l, styles["stat_label"])]
             for n, l in STATS]
    t = Table([cells], colWidths=[CONTENT_W / 3.0] * 3)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MIST_60),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("LINEAFTER", (0, 0), (-2, -1), 0.5, LINE_70),
        ("ROUNDEDCORNERS", [10, 10, 10, 10]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 13),
        ("RIGHTPADDING", (0, 0), (-1, -1), 11),
        ("TOPPADDING", (0, 0), (-1, -1), 13),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 13),
    ]))
    return t


def cashback_table():
    head = [Paragraph(h.upper(), styles["cell_head_w"]) for h in CASHBACK_HEAD]
    body = [[Paragraph(c, styles["cell_key"] if i == 0 else styles["cell_val"]) for i, c in enumerate(r)]
            for r in CASHBACK_ROWS]
    data = [head] + body
    t = Table(data, colWidths=[CONTENT_W * 0.36, CONTENT_W * 0.34, CONTENT_W * 0.30])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ZEBRA]),
        ("LINEBELOW", (0, 1), (-1, -2), 0.4, LINE_70),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("ROUNDEDCORNERS", [9, 9, 9, 9]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


def know_box():
    inner = [Paragraph("WHAT YOU NEED TO KNOW", styles["know_head"])]
    for k in KNOW:
        inner.append(Paragraph(k, styles["know_item"], bulletText="✓"))
    wrap = Table([[inner]], colWidths=[CONTENT_W])
    wrap.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SKY_SOFT),
        ("BOX", (0, 0), (-1, -1), 0.6, SKY_RING),
        ("ROUNDEDCORNERS", [9, 9, 9, 9]),
        ("LEFTPADDING", (0, 0), (-1, -1), 15),
        ("RIGHTPADDING", (0, 0), (-1, -1), 15),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
    ]))
    return wrap


def divider():
    return HRFlowable(width="100%", thickness=0.6, color=LINE_70,
                      spaceBefore=2, spaceAfter=2)


def accent_rule():
    # Short orange accent bar that leads each section heading.
    return HRFlowable(width=32, thickness=3, color=ORANGE, spaceBefore=0, spaceAfter=8)


def section(title, *flowables):
    return KeepTogether([accent_rule(), Paragraph(title, styles["h2"]), *flowables])


# ---- Page furniture: full-bleed white page, logo header, footer -------------
RIGHT_X = PAGE_W - INNER


def header_footer(canvas, doc):
    canvas.saveState()

    # Full-bleed white page
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Header: real UOB logo (left) + muted file meta (right)
    logo_h = 17
    logo_w = logo_h * (1280.0 / 359.0)
    logo_top_pad = 15
    logo_y = PAGE_H - logo_top_pad - logo_h
    canvas.drawImage(ImageReader(LOGO), FRAME_X, logo_y, width=logo_w, height=logo_h,
                     mask="auto")

    meta_y = logo_y + logo_h / 2 - 3.2
    canvas.setFont("Helvetica", 9.5)
    canvas.setFillColor(colors.HexColor("#9aa3b0"))
    canvas.drawRightString(RIGHT_X, meta_y, f"Updated {UPDATED}")

    # Hairline under the header
    div_y = FRAME_TOP + 6
    canvas.setStrokeColor(LINE_70)
    canvas.setLineWidth(0.6)
    canvas.line(FRAME_X, div_y, RIGHT_X, div_y)

    # Footer: hairline + filename / page meta
    foot_div_y = FRAME_BOTTOM - 6
    canvas.line(FRAME_X, foot_div_y, RIGHT_X, foot_div_y)
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(SLATEY)
    canvas.drawString(FRAME_X, foot_div_y - 11, FILE_NAME)
    canvas.drawRightString(RIGHT_X, foot_div_y - 11, f"Page {doc.page}")

    canvas.restoreState()


def build():
    out = os.path.join(HERE, "public", "uob-one-card-product-factsheet.pdf")
    doc = BaseDocTemplate(
        out, pagesize=(PAGE_W, PAGE_H),
        leftMargin=FRAME_X, rightMargin=PANEL_X,
        topMargin=PANEL_M, bottomMargin=PANEL_M,
        title="UOB One Card — Product factsheet",
        author="UOB", subject="Fees, rates & key terms",
    )
    frame = Frame(FRAME_X, FRAME_BOTTOM, FRAME_W, FRAME_H, id="main",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=header_footer)])

    story = []
    SECTION_GAP = 20  # consistent rhythm between sections

    # --- Title block: eyebrow, big title, orange accent, subtitle -------------
    story.append(Spacer(1, 16))
    story.append(Paragraph("PRODUCT FACTSHEET", styles["eyebrow"]))
    story.append(Paragraph(TITLE, styles["h1"]))
    story.append(HRFlowable(width=44, thickness=3.5, color=ORANGE, spaceBefore=9, spaceAfter=9))
    story.append(Paragraph(SUBTITLE, styles["subtitle"]))

    # --- Headline stat band ---------------------------------------------------
    story.append(Spacer(1, 18))
    story.append(stat_band())

    # --- What it is / who it's for --------------------------------------------
    story.append(Spacer(1, 20))
    story.append(Paragraph("WHAT IT IS", styles["label"]))
    story.append(Paragraph(SUMMARY_WHAT, styles["body"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("WHO IT’S FOR", styles["label"]))
    story.append(Paragraph(SUMMARY_WHO, styles["body"]))

    # --- What you need to know ------------------------------------------------
    story.append(Spacer(1, 18))
    story.append(know_box())

    # --- Contents -------------------------------------------------------------
    story.append(Spacer(1, 20))
    story.append(Paragraph("ON THIS SHEET", styles["contents_head"]))
    for i, c in enumerate(CONTENTS, 1):
        story.append(Paragraph(f'<font color="#F09252"><b>{i:02d}</b></font>&nbsp;&nbsp;&nbsp;{c}', styles["contents_item"]))
    story.append(Spacer(1, SECTION_GAP))

    # --- Detail sections ------------------------------------------------------
    story.append(section("Fees &amp; charges", two_col_table(FEES)))
    story.append(Spacer(1, SECTION_GAP))
    story.append(section("Interest rates", two_col_table(RATES)))
    story.append(Spacer(1, SECTION_GAP))
    story.append(section("Cashback &amp; caps", cashback_table(),
                         Paragraph(CASHBACK_NOTE, styles["note"])))
    story.append(Spacer(1, SECTION_GAP))
    story.append(section("Who can apply", two_col_table(ELIGIBILITY)))
    story.append(Spacer(1, SECTION_GAP))

    # Full terms — keep each heading with its body so headings never orphan;
    # bind the final clause to the closing rule + disclaimer so the tail of the
    # document doesn't strand a near-empty page on its own.
    story.append(accent_rule())
    story.append(Paragraph("Full terms &amp; conditions", styles["h2"]))
    for i, (h, p) in enumerate(TERMS):
        block = [Paragraph(h, styles["term_h"]), Paragraph(p, styles["term_p"])]
        if i == len(TERMS) - 1:
            block += [
                Spacer(1, 3),
                divider(),
                Spacer(1, 6),
                Paragraph(DISCLAIMER, styles["disclaimer"]),
            ]
        story.append(KeepTogether(block))

    doc.build(story)
    print("wrote", out)


if __name__ == "__main__":
    build()
