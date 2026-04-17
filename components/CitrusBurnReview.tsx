'use client';

import React, { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const AFFILIATE_LINK = 'https://d2dc49u948m5po32yfulzx1o0m.hop.clickbank.net';
const TIMER_MINUTES  = 9;
const TIMER_SECONDS  = 59;

const IMG = (file: string) => `/${file}`;

function imgFallback(
  e: React.SyntheticEvent<HTMLImageElement>,
  w: number, h: number, label = '', bg = 'f0f0f0', fg = '374151'
) {
  (e.target as HTMLImageElement).src =
    `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label || ' ')}`;
}

// ---------------------------------------------------------------------------
// DESIGN TOKENS
// ---------------------------------------------------------------------------
const C = {
  bgPage:   '#F9FAFB',
  bgWhite:  '#FFFFFF',
  bgSoft:   '#FFF7ED',
  bgGreen:  '#F0FDF4',
  bgGray:   '#F3F4F6',
  orange:   '#FF8C00',
  orangeD:  '#E07800',
  green:    '#4CAF50',
  greenD:   '#388E3C',
  greenL:   '#E8F5E9',
  textDark: '#111827',
  textBody: '#374151',
  textMuted:'#6B7280',
  textLight:'#9CA3AF',
  border:   '#E5E7EB',
  borderOr: '#FDBA74',
  borderGr: '#86EFAC',
  shadow:   '0 1px 3px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.06)',
  shadowMd: '0 4px 6px rgba(0,0,0,.05), 0 10px 30px rgba(0,0,0,.08)',
  shadowOr: '0 4px 20px rgba(255,140,0,.18)',
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES + RESPONSIVE SYSTEM
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #F9FAFB; color: #374151;
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased; line-height: 1.6;
    }
    h1,h2,h3,h4 { font-family: 'Montserrat', sans-serif; color: #111827; line-height: 1.2; }
    a { text-decoration: none; }
    button { font-family: inherit; }
    img { max-width: 100%; display: block; }

    /* ─────────────── LAYOUT UTILS ─────────────── */

    /* Responsive section padding */
    .sec { padding: 64px 16px; }
    @media (min-width: 640px)  { .sec { padding: 80px 24px; } }
    @media (min-width: 1024px) { .sec { padding: 96px 48px; } }

    /* Constrained widths */
    .wrap-sm  { max-width: 680px;  margin-left: auto; margin-right: auto; }
    .wrap-md  { max-width: 860px;  margin-left: auto; margin-right: auto; }
    .wrap-lg  { max-width: 1080px; margin-left: auto; margin-right: auto; }
    .wrap-xl  { max-width: 1200px; margin-left: auto; margin-right: auto; }

    /* Centered text block */
    .text-center { text-align: center; }

    /* ─────────────── STICKY BAR ─────────────── */
    .sticky-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: #fff; border-bottom: 2px solid #FF8C00;
      box-shadow: 0 2px 12px rgba(255,140,0,.12);
      padding: 7px 16px;
    }
    .sticky-inner {
      display: flex; align-items: center; justify-content: space-between;
      gap: 8px; max-width: 1200px; margin: 0 auto;
    }
    .sticky-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .sticky-label {
      color: #374151; font-size: 0.75rem; font-weight: 600;
      white-space: nowrap;
    }
    .sticky-timer {
      color: #FF8C00; font-weight: 800; font-size: 0.9rem;
      font-family: monospace; white-space: nowrap;
    }
    .sticky-extra {
      color: #6B7280; font-size: 0.75rem; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
    }
    /* hide less important text on small screens */
    @media (max-width: 479px)  { .sticky-extra { display: none; } .sticky-label { display: none; } }
    @media (max-width: 639px)  { .sticky-extra { display: none; } }

    /* ─────────────── BUTTONS ─────────────── */
    .btn-orange {
      display: inline-block;
      background: #FF8C00; color: #fff;
      font-family: 'Montserrat', sans-serif; font-weight: 800;
      letter-spacing: .04em; text-transform: uppercase;
      border: none; cursor: pointer; border-radius: 10px;
      transition: background .18s, transform .15s, box-shadow .15s;
      text-align: center; white-space: nowrap;
    }
    .btn-orange:hover  { background: #E07800; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,140,0,.35); }
    .btn-orange:active { transform: translateY(0); }

    /* ─────────────── NAV ─────────────── */
    .nav-links { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }
    @media (max-width: 639px) { .nav-links a:not(.btn-orange) { display: none; } }

    /* ─────────────── HERO ─────────────── */
    .hero-sec {
      background: linear-gradient(160deg, #FFFBF5 0%, #F9FAFB 60%, #F0FDF4 100%);
      padding: 72px 16px 64px; text-align: center;
      position: relative; overflow: hidden;
    }
    @media (min-width: 640px)  { .hero-sec { padding: 88px 24px 72px; } }
    @media (min-width: 1024px) { .hero-sec { padding: 104px 48px 88px; } }

    .hero-title {
      font-size: clamp(1.8rem, 5vw, 3.8rem);
      font-weight: 900; color: #111827; margin-bottom: 20px; line-height: 1.1;
    }
    .hero-sub {
      font-size: clamp(0.95rem, 2.5vw, 1.2rem);
      color: #374151; max-width: 640px; margin: 0 auto 28px; line-height: 1.75;
    }
    .hero-cta-row {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .hero-trust-row {
      display: flex; align-items: center; gap: 12px;
      flex-wrap: wrap; justify-content: center;
    }

    /* ─────────────── MICRO TESTIMONIALS ─────────────── */
    .micro-testi-row {
      display: flex; gap: 16px; justify-content: center;
      flex-wrap: wrap; margin-bottom: 40px;
    }
    .micro-testi-card {
      background: #fff; border: 1.5px solid #E5E7EB;
      border-radius: 14px; padding: 18px 20px;
      width: 100%; max-width: 300px; text-align: left;
      box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.06);
    }

    /* ─────────────── PRICING CARDS ─────────────── */
    .pricing-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-top: 16px;
    }
    @media (min-width: 640px)  { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); } }

    .pricing-card {
      background: #fff; border: 1.5px solid #E5E7EB;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,.05);
      transition: transform .22s ease, box-shadow .22s ease;
      padding: 32px 24px; position: relative;
    }
    .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0,0,0,.1); }
    .pricing-card-best {
      border: 2.5px solid #FF8C00 !important;
      box-shadow: 0 4px 24px rgba(255,140,0,.18) !important;
    }
    .pricing-card-best:hover { box-shadow: 0 14px 48px rgba(255,140,0,.26) !important; }

    /* On mobile the best card gets priority order */
    @media (max-width: 639px) {
      .pricing-card-best { order: -1; }
    }

    /* ─────────────── SCIENCE GRID ─────────────── */
    .science-grid {
      display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px;
    }
    @media (min-width: 640px)  { .science-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .science-grid { grid-template-columns: repeat(3, 1fr); } }

    .stat-card {
      display: flex; gap: 40px; align-items: center;
      flex-wrap: wrap; justify-content: center;
    }
    @media (max-width: 639px) { .stat-card { flex-direction: column; text-align: center; gap: 20px; } }

    /* ─────────────── CERTIFICATION BADGES ─────────────── */
    /* Used in science section AND trust strip */
    .cert-badges {
      display: flex; gap: 10px; justify-content: center;
      align-items: center; flex-wrap: wrap;
    }
    .cert-badge {
      display: flex; align-items: center; gap: 6px;
      background: #fff; border: 1.5px solid #E5E7EB;
      border-radius: 100px; padding: 7px 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
      white-space: nowrap;
    }
    .cert-badge span.label {
      color: #374151; font-size: 0.75rem; font-weight: 600;
    }

    /* ─────────────── INGREDIENT GRID ─────────────── */
    .ingredient-grid {
      display: grid; grid-template-columns: 1fr; gap: 16px;
    }
    @media (min-width: 640px)  { .ingredient-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .ingredient-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }

    .ingredient-card {
      background: #fff; border: 1.5px solid #E5E7EB; border-radius: 16px;
      padding: 22px 18px;
      transition: border-color .2s, transform .2s, box-shadow .2s;
    }
    .ingredient-card:hover {
      border-color: #FF8C00; transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(255,140,0,.1);
    }

    /* ─────────────── TESTIMONIALS ─────────────── */
    .testi-grid {
      display: grid; grid-template-columns: 1fr; gap: 20px;
    }
    @media (min-width: 640px)  { .testi-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .testi-grid { grid-template-columns: repeat(3, 1fr); } }

    /* ─────────────── BONUS CARDS ─────────────── */
    .bonus-grid {
      display: grid; grid-template-columns: 1fr; gap: 24px;
    }
    @media (min-width: 768px) { .bonus-grid { grid-template-columns: repeat(2, 1fr); } }

    /* ─────────────── TRUST STRIP ─────────────── */
    .trust-strip {
      background: #fff; padding: 24px 16px;
      border-top: 1px solid #E5E7EB; border-bottom: 1px solid #E5E7EB;
    }

    /* ─────────────── GUARANTEE ─────────────── */
    .guarantee-inner {
      display: flex; gap: 40px; align-items: center;
      flex-wrap: wrap; justify-content: center;
    }
    @media (max-width: 639px) { .guarantee-inner { flex-direction: column; text-align: center; } }

    /* ─────────────── FAQ ─────────────── */
    .faq-answer { max-height: 0; overflow: hidden; transition: max-height .35s ease, padding .3s ease; }
    .faq-answer.open { max-height: 500px; }

    /* ─────────────── ANIMATIONS ─────────────── */
    @keyframes pulse-dot  { 0%,100%{opacity:1} 50%{opacity:.2} }
    @keyframes ticker     { 0%,100%{opacity:1} 50%{opacity:.45} }
    @keyframes badge-pop  { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.05)} }
    @keyframes float-in   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

    .pulse-dot    { animation: pulse-dot 1.2s ease-in-out infinite; }
    .ticker-blink { animation: ticker   1.5s ease-in-out infinite; }

    /* ─────────────── SECTION DIVIDER ─────────────── */
    .divider {
      width: 56px; height: 4px;
      background: linear-gradient(90deg,#FF8C00,#4CAF50);
      border-radius: 2px; margin: 14px auto 0;
    }

    /* ─────────────── FOOTER ─────────────── */
    .footer-links {
      display: flex; justify-content: center; gap: 16px;
      flex-wrap: wrap; margin-bottom: 28px;
    }
  `}</style>
);

// ---------------------------------------------------------------------------
// COUNTDOWN HOOK
// ---------------------------------------------------------------------------
function useCountdown(m: number, s: number) {
  const total = m * 60 + s;
  const [secs, setSecs] = useState(total);
  useEffect(() => {
    const id = setInterval(() => setSecs((x) => (x <= 1 ? total : x - 1)), 1000);
    return () => clearInterval(id);
  }, [total]);
  return `${String(Math.floor(secs / 60)).padStart(2,'0')}:${String(secs % 60).padStart(2,'0')}`;
}

// ---------------------------------------------------------------------------
// PRIMITIVES
// ---------------------------------------------------------------------------
function Stars({ n = 5, size = '1rem' }: { n?: number; size?: string }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: size, letterSpacing: '1px' }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  );
}

function Tag({ children, color = C.orange }: { children: React.ReactNode; color?: string }) {
  const isOr = color === C.orange;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: isOr ? '#FFF7ED' : '#F0FDF4',
      border: `1.5px solid ${isOr ? '#FDBA74' : '#86EFAC'}`,
      borderRadius: '100px', padding: '5px 16px', marginBottom: '14px' }}>
      <span style={{ color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.1em' }}>{children}</span>
    </div>
  );
}

function SectionHeading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center" style={{ marginBottom: '44px' }}>
      <h2 style={{ fontSize: 'clamp(1.55rem,4vw,2.35rem)', fontWeight: 900, color: C.textDark,
        marginBottom: sub ? '10px' : 0 }}>{children}</h2>
      <div className="divider" />
      {sub && (
        <p style={{ color: C.textMuted, marginTop: '14px', fontSize: 'clamp(0.9rem,2vw,1.05rem)',
          maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>{sub}</p>
      )}
    </div>
  );
}

function CTAButton({ label = 'ORDER NOW', pad = '13px 36px', fs = '0.9rem', full = false }: {
  label?: string; pad?: string; fs?: string; full?: boolean;
}) {
  return (
    <a href={AFFILIATE_LINK} className="btn-orange"
      style={{ padding: pad, fontSize: fs, display: full ? 'block' : 'inline-block',
        width: full ? '100%' : undefined }}
      rel="nofollow noopener" target="_blank">
      {label} →
    </a>
  );
}

// ---------------------------------------------------------------------------
// STICKY BAR
// ---------------------------------------------------------------------------
function StickyBar() {
  const timer = useCountdown(TIMER_MINUTES, TIMER_SECONDS);
  return (
    <div className="sticky-bar">
      <div className="sticky-inner">
        <div className="sticky-left">
          <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%',
            background: '#EF4444', display: 'inline-block', flexShrink: 0 }} />
          <span className="sticky-label">LIMITED OFFER ENDS IN:</span>
          <span className="sticky-timer ticker-blink">{timer}</span>
          <span className="sticky-extra">· 🔥 Save 75% + Free Shipping on 6-Bottle Pack</span>
        </div>
        <CTAButton label="CLAIM DEAL" pad="7px 18px" fs="0.78rem" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NAV
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <nav style={{ background: C.bgWhite, borderBottom: `1px solid ${C.border}`,
      padding: '12px 16px', marginTop: '40px',
      boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
      <div className="wrap-xl" style={{ display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '12px' }}>
        <img src={IMG('logo.png')} alt="CitrusBurn™" style={{ height: '36px', width: 'auto' }}
          onError={(e) => imgFallback(e, 150, 36, 'CitrusBurn', 'ffffff', 'FF8C00')} />
        <div className="nav-links">
          {[['#free-bonuses','Bonuses'],['#about','Science'],['#ingredients','Ingredients'],['#faq','FAQ']].map(([href,label]) => (
            <a key={href} href={href} style={{ color: C.textMuted, fontSize: '0.875rem', fontWeight: 500 }}>{label}</a>
          ))}
          <CTAButton label="ORDER NOW" pad="8px 18px" fs="0.78rem" />
        </div>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <section className="hero-sec">
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '360px', height: '360px',
        borderRadius: '50%', background: 'rgba(255,140,0,.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '260px', height: '260px',
        borderRadius: '50%', background: 'rgba(76,175,80,.05)', pointerEvents: 'none' }} />

      <div className="wrap-lg" style={{ position: 'relative' }}>
        <div className="text-center">
          <Tag>APRIL 2026 · HARVARD &amp; BARCELONA BREAKTHROUGH</Tag>

          <h1 className="hero-title">
            The Citrus Secret{' '}
            <span style={{ color: C.orange }}>Everyone&rsquo;s</span>{' '}
            Talking About
          </h1>

          <p className="hero-sub">
            Burn More. Crave Less. Feel Great All Day with CitrusBurn™.{' '}
            <strong style={{ color: C.textDark }}>
              Harvard &amp; Barcelona researchers revealed why diets fail after 35 —
              and the 7-botanical fix that changes everything.
            </strong>
          </p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <Stars n={5} size="1.1rem" />
            <span style={{ color: C.textBody, fontSize: '0.9rem' }}>
              <strong>4.9/5</strong> · 73,000+ Verified Reviews
            </span>
          </div>
        </div>

        {/* Product image */}
        <div style={{ marginBottom: '36px' }}>
          <img src={IMG('s6prd.png')} alt="CitrusBurn™ 6-Bottle Pack"
            style={{ maxWidth: 'min(480px, 90%)', width: '100%', height: 'auto',
              margin: '0 auto', filter: 'drop-shadow(0 16px 36px rgba(255,140,0,.15))' }}
            onError={(e) => imgFallback(e, 480, 340, 'CitrusBurn Product', 'FFF7ED', 'FF8C00')} />
        </div>

        {/* Micro testimonials */}
        <div className="micro-testi-row">
          {[
            { q: 'I can actually see the results! Finally something that works!', name: 'Joanne P.' },
            { q: "More energy, better sleep — and I didn't change my diet.", name: 'Sam L.' },
          ].map((t) => (
            <div key={t.name} className="micro-testi-card">
              <Stars n={5} size="0.9rem" />
              <p style={{ color: C.textBody, fontSize: '0.875rem', margin: '8px 0 6px',
                fontStyle: 'italic', lineHeight: 1.6 }}>&ldquo;{t.q}&rdquo;</p>
              <span style={{ color: C.orange, fontSize: '0.78rem', fontWeight: 700 }}>
                — {t.name} · Verified Buyer
              </span>
            </div>
          ))}
        </div>

        {/* Hero CTA */}
        <div className="hero-cta-row">
          <CTAButton
            label="CLAIM YOUR DISCOUNTED CITRUSBURN™ TODAY"
            pad="clamp(14px,3vw,18px) clamp(24px,5vw,52px)"
            fs="clamp(0.82rem,2vw,1.1rem)"
          />
          <div className="hero-trust-row">
            {['🔒 Secure Checkout', '180-Day Guarantee', 'No Subscription'].map((t) => (
              <span key={t} style={{ color: C.textMuted, fontSize: '0.78rem' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Press logos */}
        <div style={{ marginTop: '52px', paddingTop: '32px', borderTop: `1px solid ${C.border}`,
          textAlign: 'center' }}>
          <p style={{ color: C.textLight, fontSize: '0.7rem', letterSpacing: '.14em',
            fontWeight: 600, marginBottom: '14px', textTransform: 'uppercase' }}>As Featured In</p>
          <img src={IMG('s11logos.png')} alt="As featured in press"
            style={{ maxWidth: 'min(520px, 90%)', width: '100%', height: 'auto',
              margin: '0 auto', filter: 'grayscale(100%) opacity(0.4)' }}
            onError={(e) => imgFallback(e, 520, 52, 'Forbes · WebMD · Healthline · PubMed · BBC', 'F9FAFB', '9CA3AF')} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// URGENCY BANNER
// ---------------------------------------------------------------------------
function UrgencyBanner() {
  const timer = useCountdown(TIMER_MINUTES, TIMER_SECONDS);
  return (
    <div style={{ background: C.orange, padding: '12px 16px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px,4vw,36px)',
        flexWrap: 'wrap', textAlign: 'center' }}>
        {[
          { label: 'SALE STATUS', value: 'LIVE',  mono: false },
          { label: 'STOCK LEVEL', value: 'LOW',   mono: false },
          { label: 'RESERVED FOR', value: timer,  mono: true  },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,.72)', fontSize: '0.6rem',
              letterSpacing: '.14em', fontWeight: 700 }}>{item.label}</span>
            <span className={item.mono ? 'ticker-blink' : ''}
              style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1rem,3vw,1.2rem)',
                fontFamily: item.mono ? 'monospace' : 'Montserrat,sans-serif' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PRICING CARD
// ---------------------------------------------------------------------------
function PricingCard({ label, bottles, duration, perBottle, total, originalTotal,
  savings, bonuses, freeShip, best, packageImg }: {
  label: string; bottles: number; duration: string; perBottle: number;
  total: number; originalTotal: number; savings: number;
  bonuses: boolean; freeShip: boolean; best?: boolean; packageImg: string;
}) {
  return (
    <div className={`pricing-card ${best ? 'pricing-card-best' : ''}`}>
      {best && (
        <div style={{ position: 'absolute', top: '-13px', left: '50%',
          background: C.orange, color: '#fff',
          fontFamily: 'Montserrat,sans-serif', fontWeight: 800,
          fontSize: '0.7rem', letterSpacing: '.1em',
          padding: '5px 18px', borderRadius: '100px', whiteSpace: 'nowrap',
          animation: 'badge-pop 2.5s ease-in-out infinite' }}>
          ⭐ BEST VALUE · MOST POPULAR ⭐
        </div>
      )}

      <div style={{ display: 'inline-block',
        background: best ? '#FFF7ED' : C.bgGray,
        color: best ? C.orange : C.textMuted,
        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.1em',
        padding: '3px 12px', borderRadius: '100px', marginBottom: '10px' }}>
        {label}
      </div>

      <h3 style={{ fontSize: 'clamp(1.2rem,3vw,1.5rem)', fontWeight: 900,
        color: C.textDark, marginBottom: '2px' }}>{bottles} Bottles</h3>
      <p style={{ color: C.textMuted, fontSize: '0.82rem', marginBottom: '18px' }}>{duration} Supply</p>

      <img src={IMG(packageImg)} alt={`${bottles}-bottle pack`}
        style={{ width: 'clamp(100px,30%,130px)', height: 'auto', margin: '0 auto 18px' }}
        onError={(e) => imgFallback(e, 130, 160, `${bottles} Bottles`, 'F9FAFB', 'FF8C00')} />

      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
          <span style={{ fontSize: 'clamp(2.2rem,5vw,2.8rem)', fontWeight: 900,
            color: best ? C.orange : C.textDark, lineHeight: 1 }}>${perBottle}</span>
          <span style={{ color: C.textMuted, fontSize: '0.82rem' }}>/bottle</span>
        </div>
        <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ textDecoration: 'line-through', color: C.textLight, fontSize: '0.88rem' }}>
            ${originalTotal}
          </span>
          <span style={{ fontWeight: 700, color: C.textDark }}>${total} total</span>
        </div>
        <div style={{ display: 'inline-block', background: C.greenL, color: C.greenD,
          fontWeight: 700, fontSize: '0.8rem', padding: '3px 12px',
          borderRadius: '100px', marginTop: '6px' }}>
          You Save ${savings}!
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px',
        display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          bonuses  && '2 FREE Digital Bonuses',
          freeShip && 'Free USA Shipping',
          !freeShip && '+ Shipping',
          '180-Day Money-Back Guarantee',
        ].filter(Boolean).map((f) => (
          <li key={String(f)} style={{ display: 'flex', alignItems: 'center',
            gap: '8px', color: C.textBody, fontSize: '0.855rem' }}>
            <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <CTAButton label="BUY NOW" pad="15px" fs="0.95rem" full />

      {best && (
        <p style={{ color: C.green, fontSize: '0.75rem', textAlign: 'center',
          marginTop: '8px', fontWeight: 600 }}>
          ✓ Free bonuses &amp; free shipping included
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PRICING SECTION
// ---------------------------------------------------------------------------
function PricingSection({ id }: { id?: string }) {
  const timer = useCountdown(TIMER_MINUTES, TIMER_SECONDS);
  return (
    <section id={id} className="sec" style={{ background: C.bgSoft }}>
      <div className="wrap-lg">
        <div className="text-center" style={{ marginBottom: '20px' }}>
          {/* Stock alert */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '100px',
            padding: '6px 16px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%',
              background: '#EF4444', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 700 }}>
              STOCK LOW — RESERVED FOR{' '}
              <span className="ticker-blink" style={{ fontFamily: 'monospace' }}>{timer}</span>
            </span>
          </div>
          <SectionHeading sub="Join 96% of customers who choose the 6-bottle pack for best results">
            Claim Your Discounted CitrusBurn™ Today
          </SectionHeading>
        </div>

        {/* 1-col mobile → 2-col tablet → 3-col desktop */}
        <div className="pricing-grid">
          <PricingCard label="STARTER"    bottles={2} duration="60 Day"  perBottle={79} total={158} originalTotal={398}  savings={240} bonuses={false} freeShip={false} packageImg="pkg1.png" />
          <PricingCard label="POPULAR"    bottles={3} duration="90 Day"  perBottle={69} total={207} originalTotal={597}  savings={390} bonuses={true}  freeShip={false} packageImg="pkg2.png" />
          <PricingCard label="BEST VALUE" bottles={6} duration="180 Day" perBottle={49} total={294} originalTotal={1194} savings={900} bonuses={true}  freeShip={true}  best packageImg="pkg3.png" />
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center',
          flexWrap: 'wrap', marginTop: '36px', alignItems: 'center',
          padding: 'clamp(16px,3vw,24px)', background: C.bgWhite,
          borderRadius: '16px', boxShadow: C.shadow }}>
          {[
            { src: 'mbseal.png',          alt: '180-Day Guarantee', h: 68 },
            { src: 'bestseller-seal.png', alt: 'Best Seller',       h: 54 },
            { src: 'shipping-seal.png',   alt: 'Free Shipping',     h: 54 },
            { src: 'cards.png',           alt: 'Secure Payment',    h: 28 },
          ].map((b) => (
            <img key={b.src} src={IMG(b.src)} alt={b.alt}
              style={{ height: `${b.h}px`, width: 'auto', objectFit: 'contain' }}
              onError={(e) => imgFallback(e, 100, b.h, b.alt, 'ffffff', '6B7280')} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// GUARANTEE
// ---------------------------------------------------------------------------
function GuaranteeSection() {
  return (
    <section className="sec" style={{ background: C.bgGreen,
      borderTop: `1px solid ${C.borderGr}`, borderBottom: `1px solid ${C.borderGr}` }}>
      <div className="wrap-md">
        <div className="guarantee-inner">
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <img src={IMG('mbseal.png')} alt="180-Day Money-Back Guarantee"
              style={{ width: 'clamp(100px,20vw,140px)', height: 'auto',
                filter: 'drop-shadow(0 4px 12px rgba(76,175,80,.2))' }}
              onError={(e) => imgFallback(e, 140, 140, '180 Days', 'F0FDF4', '4CAF50')} />
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <Tag color={C.green}>ZERO RISK · ZERO QUESTIONS</Tag>
            <h2 style={{ fontSize: 'clamp(1.3rem,3.5vw,1.65rem)', fontWeight: 900,
              color: C.textDark, marginBottom: '14px' }}>
              180-Day 100% Money-Back Guarantee
            </h2>
            <p style={{ color: C.textBody, lineHeight: 1.85, marginBottom: '14px',
              fontSize: 'clamp(0.875rem,2vw,1rem)' }}>
              Your order is completely protected. If you&rsquo;re not amazed at how quickly your body
              feels lighter, more energized, and visibly transformed — just contact us within 180 days
              and we&rsquo;ll refund every cent. No hassle, no forms.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: C.green, fontSize: '1.1rem' }}>✓</span>
              <span style={{ color: C.greenD, fontWeight: 700, fontSize: '0.95rem' }}>
                No questions asked. Full refund.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BONUS SECTION
// ---------------------------------------------------------------------------
function BonusSection() {
  return (
    <section id="free-bonuses" className="sec" style={{ background: C.bgWhite }}>
      <div className="wrap-md text-center">
        <Tag>🎁 FREE WITH 3 OR 6 BOTTLE ORDER</Tag>
        <SectionHeading sub="A combined $114 value — yours absolutely FREE with the 3 or 6 bottle pack">
          2 FREE Digital Bonuses
        </SectionHeading>

        <div className="bonus-grid">
          {[
            { img: 'bonus1.png', n: '#1', title: 'Spanish Rapid Detox Protocol', val: '$67',
              desc: 'A 15-day Mediterranean cleanse using simple, powerful ingredients from your kitchen. Designed to support thermogenesis and jumpstart your CitrusBurn™ results from day one.',
              accent: C.orange },
            { img: 'bonus2.png', n: '#2', title: 'Mind Over Metabolism Mastery', val: '$47',
              desc: '5-minute daily visualization and craving-reset techniques that reduce emotional eating, boost motivation, and lock in long-term transformation.',
              accent: C.green },
          ].map((b) => (
            <div key={b.n} style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
              borderRadius: '20px', padding: 'clamp(20px,4vw,32px)',
              textAlign: 'left', boxShadow: C.shadowMd,
              borderTop: `4px solid ${b.accent}` }}>
              <div style={{ display: 'inline-block',
                background: b.accent === C.orange ? '#FFF7ED' : C.greenL,
                color: b.accent, fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '.08em', padding: '4px 12px',
                borderRadius: '6px', marginBottom: '16px' }}>
                FREE BONUS {b.n}
              </div>
              <img src={IMG(b.img)} alt={b.title}
                style={{ width: 'clamp(120px,40%,170px)', height: 'auto', margin: '0 auto 16px' }}
                onError={(e) => imgFallback(e, 170, 210, b.title, 'F9FAFB', 'FF8C00')} />
              <h3 style={{ color: C.textDark, fontSize: 'clamp(0.95rem,2.5vw,1.05rem)',
                fontWeight: 800, marginBottom: '6px' }}>{b.title}</h3>
              <p style={{ color: b.accent, fontWeight: 700, fontSize: '0.82rem', marginBottom: '10px' }}>
                Retail Value: {b.val} — Yours 100% FREE
              </p>
              <p style={{ color: C.textMuted, fontSize: '0.875rem', lineHeight: 1.75 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px' }}>
          <CTAButton label="CLAIM FREE BONUSES + SAVE 75%"
            pad="clamp(14px,3vw,18px) clamp(20px,4vw,48px)"
            fs="clamp(0.82rem,2vw,1.05rem)" />
          <p style={{ color: C.textMuted, fontSize: '0.8rem' }}>
            Free USA Shipping on the 6-bottle pack
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SCIENCE — Medical Journal Grid
// ---------------------------------------------------------------------------
function ScienceSection() {
  return (
    <section id="about" className="sec" style={{ background: C.bgPage }}>
      <div className="wrap-lg">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <Tag color={C.orange}>HARVARD &amp; BARCELONA RESEARCH · APRIL 2026</Tag>
          <SectionHeading sub="New studies reveal why diets fail after 35 — and it's not what you think.">
            Scientists Reveal the Hidden Cause of Slow Metabolism
          </SectionHeading>
        </div>

        {/* 3-column medical journal cards */}
        <div className="science-grid">
          {[
            { label: 'THE CONDITION', title: 'Thermogenic Resistance',
              body: 'A metabolic condition that prevents your body from entering the natural fat-burning state of thermogenesis — even when eating well or exercising consistently.',
              icon: '🔬', accent: C.orange },
            { label: 'THE RESEARCH', title: 'Harvard, Mayo Clinic & University of Barcelona',
              body: 'Three independent research institutions confirmed that a rare compound in Seville orange peel can break through Thermogenic Resistance and restore metabolic function.',
              icon: '📋', accent: '#6366F1' },
            { label: 'THE RESULT', title: 'Up to 74% Increase in Thermogenesis',
              body: 'Participants experienced up to a 74% increase in thermogenesis — burning stored fat continuously, even during sleep.',
              icon: '📈', accent: C.green },
          ].map((card) => (
            <div key={card.label} style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
              borderRadius: '16px', padding: 'clamp(20px,3vw,28px)',
              boxShadow: C.shadow, borderLeft: `4px solid ${card.accent}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem' }}>{card.icon}</span>
                <span style={{ color: card.accent, fontSize: '0.68rem', fontWeight: 800,
                  letterSpacing: '.12em', textTransform: 'uppercase' }}>{card.label}</span>
              </div>
              <h3 style={{ color: C.textDark, fontSize: 'clamp(0.9rem,2vw,1.05rem)',
                fontWeight: 800, marginBottom: '10px' }}>{card.title}</h3>
              <p style={{ color: C.textBody, fontSize: '0.88rem', lineHeight: 1.75 }}>{card.body}</p>
            </div>
          ))}
        </div>

        {/* 74% stat block */}
        <div className="stat-card" style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
          borderRadius: '20px', padding: 'clamp(28px,5vw,48px)',
          boxShadow: C.shadowMd, marginBottom: '48px' }}>
          <div className="text-center" style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 'clamp(3.5rem,10vw,5.5rem)', fontWeight: 900, color: C.orange,
              fontFamily: 'Montserrat,sans-serif', lineHeight: 1 }}>74%</div>
            <div style={{ color: C.textMuted, fontSize: '0.82rem', marginTop: '4px' }}>
              Thermogenesis increase
            </div>
          </div>
          <div style={{ flex: '1 1 280px' }}>
            <p style={{ color: C.textBody, fontSize: 'clamp(0.875rem,2vw,1rem)',
              lineHeight: 1.85, marginBottom: '16px' }}>
              Research from <strong>Harvard</strong>, <strong>Mayo Clinic</strong>, and the{' '}
              <strong>University of Barcelona</strong> shows that p-synephrine — the active compound
              in CitrusBurn™&rsquo;s Seville Orange Peel extract — can increase thermogenesis by up to{' '}
              <strong style={{ color: C.orange }}>74%</strong>, enabling your body to burn stored fat
              continuously, even while you sleep.
            </p>
            <blockquote style={{ borderLeft: `3px solid ${C.orange}`, paddingLeft: '16px', margin: 0 }}>
              <p style={{ color: C.textDark, fontStyle: 'italic',
                fontSize: 'clamp(0.875rem,2vw,0.95rem)', fontWeight: 500, lineHeight: 1.7 }}>
                &ldquo;It&rsquo;s like flipping a switch that tells your body to burn fat, automatically.&rdquo;
              </p>
              <cite style={{ color: C.textMuted, fontSize: '0.8rem', fontStyle: 'normal' }}>
                — Dr. Reeves, Lead Researcher
              </cite>
            </blockquote>
          </div>
        </div>

        {/* Product intro — CENTERED */}
        <div className="text-center">
          <h3 style={{ fontSize: 'clamp(1.4rem,4vw,1.8rem)', fontWeight: 900,
            color: C.textDark, marginBottom: '14px' }}>
            That&rsquo;s Why We Created CitrusBurn™
          </h3>
          <p style={{ color: C.textBody, maxWidth: '640px', margin: '0 auto 28px',
            lineHeight: 1.85, fontSize: 'clamp(0.875rem,2vw,1rem)' }}>
            CitrusBurn™ is a 100% natural breakthrough designed to reignite your metabolism
            without harsh stimulants, injections, or crash diets. A science-backed blend of{' '}
            <strong style={{ color: C.orange }}>7 rare botanicals</strong> that optimize your
            body&rsquo;s natural fat-burning capacity — even while you sleep.
          </p>

          {/* Certification badges — perfectly centered, wraps cleanly */}
          <div className="cert-badges" style={{ marginBottom: '28px' }}>
            {[
              { icon: '🌱', label: '100% Natural'   },
              { icon: '🚫', label: 'Non-GMO'        },
              { icon: '⚡', label: 'Stimulant-Free' },
              { icon: '🏭', label: 'FDA-Registered' },
              { icon: '✅', label: 'GMP Certified'  },
              { icon: '🇺🇸', label: 'Made in USA'   },
            ].map((b) => (
              <div key={b.label} className="cert-badge">
                <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
                <span className="label">{b.label}</span>
              </div>
            ))}
          </div>

          <img src={IMG('s3icons.png')} alt="Certification seal strip"
            style={{ maxWidth: 'min(380px, 90%)', width: '100%', height: 'auto',
              margin: '0 auto', opacity: 0.6 }}
            onError={(e) => imgFallback(e, 380, 72, 'FDA · GMP · Non-GMO · Plant-Based', 'F9FAFB', '9CA3AF')} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// INGREDIENTS — responsive 3-column grid
// ---------------------------------------------------------------------------
const INGREDIENTS = [
  { icon: 's8licon1.png', name: 'Seville Orange Peel',   sub: '(p-synephrine)',  stat: 'Primary Thermogenic',    benefit: 'Supports thermogenesis and accelerates fat burn',              accent: C.orange  },
  { icon: 's8licon2.png', name: 'Spanish Apple Vinegar', sub: '',                stat: 'Appetite Control',       benefit: 'Promotes fullness and reduces overeating impulses',            accent: '#F59E0B' },
  { icon: 's8licon3.png', name: 'Andalusian Red Pepper', sub: '',                stat: '+25% Calorie Burn',      benefit: 'Increases post-meal calorie burn by up to 25%',                accent: '#EF4444' },
  { icon: 's8licon4.png', name: 'Himalayan Ginger',      sub: '',                stat: '54% Craving Reduction',  benefit: 'Clinically reduces cravings by 54%, supports blood sugar',     accent: '#10B981' },
  { icon: 's8licon5.png', name: 'Ceremonial Green Tea',  sub: '',                stat: 'Fat Oxidation',          benefit: 'Enhances fat oxidation and delivers sustained energy',         accent: C.green   },
  { icon: 's8licon6.png', name: 'Berberine',             sub: '',                stat: 'Metabolic Regulator',    benefit: 'Supports healthy metabolic and hormonal balance',              accent: '#8B5CF6' },
  { icon: 's8licon1.png', name: 'Korean Red Ginseng',    sub: '',                stat: 'Hormone Optimizer',      benefit: 'Balances hormones for optimal metabolic performance',          accent: '#EC4899' },
];

function IngredientsSection() {
  return (
    <section id="ingredients" className="sec" style={{ background: C.bgPage,
      borderTop: `1px solid ${C.border}` }}>
      <div className="wrap-lg">
        <div className="text-center">
          <Tag color={C.orange}>THE SPANISH FAT-MELTING FORMULA</Tag>
          <SectionHeading sub="Each ingredient is sourced from elite botanical regions and standardized for maximum bioavailability.">
            7 Rare Botanicals Inside Every Capsule
          </SectionHeading>
        </div>

        {/* ← class drives 1→2→3 columns via media queries */}
        <div className="ingredient-grid">
          {INGREDIENTS.map((ing) => (
            <div key={ing.name} className="ingredient-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                  background: `${ing.accent}15`, border: `1.5px solid ${ing.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={IMG(ing.icon)} alt={ing.name}
                    style={{ width: '26px', height: '26px', objectFit: 'contain' }}
                    onError={(e) => imgFallback(e, 26, 26, ing.name[0], 'F9FAFB', 'FF8C00')} />
                </div>
                <div>
                  <h3 style={{ color: C.textDark, fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{ing.name}</h3>
                  {ing.sub && <p style={{ color: C.textMuted, fontSize: '0.7rem', marginTop: '2px' }}>{ing.sub}</p>}
                </div>
              </div>
              <div style={{ display: 'inline-block', background: `${ing.accent}12`,
                color: ing.accent, fontSize: '0.68rem', fontWeight: 700,
                padding: '3px 10px', borderRadius: '100px', marginBottom: '8px' }}>
                {ing.stat}
              </div>
              <p style={{ color: C.textMuted, fontSize: '0.84rem', lineHeight: 1.65, margin: 0 }}>{ing.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  { photo: 'testi-1-min.png', name: 'Tasha M.', age: 41, location: 'Austin, TX',    lost: '22 lbs',
    quote: "I bought CitrusBurn™ on a whim. Within a week my jeans were looser and my energy was stable all day. No jitters — just calm, steady progress. I've lost 22 pounds and feel in control for the first time in years." },
  { photo: 'testi-2-min.png', name: 'Neil C.',  age: 57, location: 'Asheville, NC', lost: '17 lbs',
    quote: "The late-night eating was killing me. CitrusBurn™ made the difference almost immediately. I dropped 17 pounds, my doctor noticed improved wellness markers, and I'm not falling asleep at my desk by 3pm anymore." },
  { photo: 'testi-3-min.png', name: 'Elizabeth V.', age: 62, location: 'Boise, ID', lost: '14 lbs',
    quote: "I used to wake up foggy and dragging through the day. Now I take CitrusBurn™ in the morning and within 30 minutes I'm moving with purpose. 14 pounds gone and I'm back to the version of myself I actually like." },
];

function TestimonialsSection() {
  return (
    <section className="sec" style={{ background: C.bgGray }}>
      <div className="wrap-lg">
        <div className="text-center">
          <Tag color={C.green}>REAL CITRUSBURN™ USERS · VERIFIED RESULTS</Tag>
          <SectionHeading sub="4.9/5 average rating across 73,000+ verified customer reviews">
            Life-Changing Results From Real People
          </SectionHeading>
        </div>

        {/* 1→2→3 column testimonial grid */}
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
              borderRadius: '20px', padding: 'clamp(20px,3vw,32px)',
              boxShadow: C.shadowMd, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '18px', right: '20px',
                fontSize: '2.2rem', color: C.orange, opacity: 0.12,
                lineHeight: 1, fontFamily: 'Georgia,serif' }}>&rdquo;</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <img src={IMG(t.photo)} alt={t.name}
                  style={{ width: '54px', height: '54px', borderRadius: '50%',
                    objectFit: 'cover', border: `2px solid ${C.borderOr}`, flexShrink: 0 }}
                  onError={(e) => imgFallback(e, 54, 54, t.name[0], 'FFF7ED', 'FF8C00')} />
                <div>
                  <div style={{ fontWeight: 700, color: C.textDark, fontSize: '0.95rem' }}>
                    {t.name}, age {t.age}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: '0.78rem' }}>{t.location} · Verified Purchase</div>
                  <Stars n={5} size="0.85rem" />
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: C.greenL, border: `1px solid ${C.borderGr}`,
                borderRadius: '100px', padding: '3px 12px', marginBottom: '12px' }}>
                <span style={{ color: C.greenD, fontSize: '0.8rem', fontWeight: 700 }}>
                  ↓ Lost {t.lost}
                </span>
              </div>

              <p style={{ color: C.textBody, fontSize: '0.875rem', lineHeight: 1.75,
                fontStyle: 'italic', margin: 0 }}>&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '48px' }}>
          <CTAButton label="JOIN 73,000+ CUSTOMERS — CLAIM YOUR DISCOUNT"
            pad="clamp(14px,3vw,18px) clamp(20px,4vw,48px)"
            fs="clamp(0.82rem,2vw,1.05rem)" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TRUST STRIP — centered, wraps cleanly
// ---------------------------------------------------------------------------
function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="cert-badges wrap-lg">
        {[
          { icon: '🏭', label: 'FDA-Registered Facility' },
          { icon: '✅', label: 'GMP Certified'            },
          { icon: '🌱', label: '100% Plant-Based'         },
          { icon: '🚫', label: 'Non-GMO & Gluten Free'    },
          { icon: '🇺🇸', label: 'Made in USA'             },
          { icon: '💳', label: 'One-Time Payment'         },
        ].map((b) => (
          <div key={b.label} className="cert-badge">
            <span style={{ fontSize: '0.95rem' }}>{b.icon}</span>
            <span className="label">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
const FAQS = [
  { q: 'Is CitrusBurn™ right for me?',
    a: "If you're struggling with stubborn weight, low energy, or a sluggish metabolism — especially after 40 — CitrusBurn™ was made for you. It's designed for both men and women who want a natural way to support healthier metabolic function and overall vitality." },
  { q: 'Is CitrusBurn™ safe?',
    a: 'CitrusBurn™ is manufactured in an FDA-registered, GMP-certified US facility. Every ingredient is 100% plant-based, soy-free, dairy-free, and non-GMO, with rigorous third-party quality testing on every batch. Always consult your physician before starting any new supplement.' },
  { q: 'How many bottles should I order?',
    a: 'We recommend the 6-bottle package. Most customers experience noticeable changes after 6–12 weeks of consistent use. The 6-pack also includes free USA shipping and both digital bonuses.' },
  { q: "What's the best way to take CitrusBurn™?",
    a: 'Take 1 easy-to-swallow capsule daily with a full glass of water, ideally in the morning before breakfast. Consistency is key.' },
  { q: 'Is this a one-time payment?',
    a: "Yes — absolutely. No hidden charges, subscriptions, or automatic re-bills. One purchase, that's it." },
  { q: "What if CitrusBurn™ doesn't work for me?",
    a: "You're fully covered by our 180-day money-back guarantee. Contact our support team for a full refund. No questions, no hassle." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="sec" style={{ background: C.bgWhite }}>
      <div className="wrap-sm">
        <SectionHeading>Frequently Asked Questions</SectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: C.bgPage,
                border: `1.5px solid ${isOpen ? C.orange : C.border}`,
                borderRadius: '14px', overflow: 'hidden',
                boxShadow: isOpen ? C.shadowOr : 'none',
                transition: 'border-color .2s, box-shadow .2s' }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: '100%', padding: 'clamp(14px,2vw,18px) clamp(16px,3vw,24px)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                  <span style={{ color: C.textDark, fontWeight: 700,
                    fontSize: 'clamp(0.85rem,2vw,0.92rem)', flex: 1 }}>{faq.q}</span>
                  <span style={{ color: C.orange, fontSize: '1.4rem', lineHeight: 1, flexShrink: 0,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform .25s' }}>+</span>
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}
                  style={{ padding: isOpen ? '0 clamp(16px,3vw,24px) 16px' : '0 clamp(16px,3vw,24px) 0' }}>
                  <p style={{ color: C.textBody, lineHeight: 1.8,
                    fontSize: 'clamp(0.84rem,2vw,0.9rem)', margin: 0 }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center" style={{ marginTop: '48px' }}>
          <CTAButton label="ORDER NOW & SAVE 75%"
            pad="clamp(14px,3vw,18px) clamp(24px,5vw,52px)"
            fs="clamp(0.85rem,2vw,1.1rem)" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer style={{ background: '#1F2937', padding: 'clamp(36px,6vw,56px) 16px 28px' }}>
      <div className="wrap-md">
        <div className="text-center" style={{ marginBottom: '20px' }}>
          <img src={IMG('logo.png')} alt="CitrusBurn™"
            style={{ height: '34px', width: 'auto', margin: '0 auto',
              filter: 'brightness(0) invert(1)', opacity: 0.75 }}
            onError={(e) => imgFallback(e, 150, 34, 'CitrusBurn', '1F2937', '9CA3AF')} />
        </div>

        <div className="footer-links">
          {['Terms','Privacy','Order Support','Returns & Refunds','Track My Order'].map((l) => (
            <a key={l} href={AFFILIATE_LINK}
              style={{ color: '#6B7280', fontSize: '0.8rem' }}
              rel="nofollow noopener" target="_blank">{l}</a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #374151', paddingTop: '24px',
          display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ color: '#4B5563', fontSize: 'clamp(0.65rem,1.5vw,0.7rem)',
            lineHeight: 1.8, textAlign: 'center' }}>
            These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Results may vary. Individual testimonials are from real customers; results are not guaranteed.
            If you are pregnant, nursing, taking medication, or have a medical condition,
            consult your physician before use. This site may contain affiliate links and the publisher
            may receive compensation for purchases made through those links.
          </p>
          <p style={{ color: '#374151', fontSize: 'clamp(0.65rem,1.5vw,0.7rem)',
            lineHeight: 1.7, textAlign: 'center' }}>
            ClickBank® is a registered trademark of Click Sales, Inc.
            (1444 S. Entertainment Ave., Suite 410, Boise, ID 83709).
            ClickBank&rsquo;s role as retailer does not constitute endorsement of these products.
          </p>
          <p style={{ color: '#374151', fontSize: '0.68rem', textAlign: 'center', marginTop: '4px' }}>
            Copyright &copy; {new Date().getFullYear()} CitrusBurn™. All Rights Reserved. Made in USA.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// ROOT
// ---------------------------------------------------------------------------
export default function CitrusBurnReview() {
  return (
    <>
      <GlobalStyles />
      <StickyBar />
      <Nav />
      <main>
        <HeroSection />
        <UrgencyBanner />
        <PricingSection id="order" />
        <GuaranteeSection />
        <BonusSection />
        <ScienceSection />
        <IngredientsSection />
        <TestimonialsSection />
        <TrustStrip />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
