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
  w: number, h: number,
  label = '', bg = 'f0f0f0', fg = '374151'
) {
  (e.target as HTMLImageElement).src =
    `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label || ' ')}`;
}

// ---------------------------------------------------------------------------
// DESIGN TOKENS — Clean Light Mode
// ---------------------------------------------------------------------------
const C = {
  // Backgrounds
  bgPage:    '#F9FAFB',
  bgWhite:   '#FFFFFF',
  bgSoft:    '#FFF7ED',   // warm tint under hero / pricing
  bgGreen:   '#F0FDF4',   // pale green tint
  bgOrange:  '#FFF7ED',
  bgGray:    '#F3F4F6',

  // Brand
  orange:    '#FF8C00',
  orangeD:   '#E07800',
  orangeL:   '#FFA833',
  green:     '#4CAF50',
  greenD:    '#388E3C',
  greenL:    '#E8F5E9',

  // Text
  textDark:  '#111827',
  textBody:  '#374151',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',

  // Borders
  border:    '#E5E7EB',
  borderOr:  '#FDBA74',
  borderGr:  '#86EFAC',

  // Shadows
  shadow:    '0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.06)',
  shadowMd:  '0 4px 6px rgba(0,0,0,0.05), 0 10px 30px rgba(0,0,0,0.08)',
  shadowOr:  '0 4px 20px rgba(255,140,0,0.18)',
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      background: #F9FAFB;
      color: #374151;
      font-family: 'Inter', 'Montserrat', sans-serif;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
    }

    h1,h2,h3,h4 {
      font-family: 'Montserrat', sans-serif;
      color: #111827;
      line-height: 1.2;
    }

    a { text-decoration: none; }
    button { font-family: inherit; }
    img { max-width: 100%; }

    /* ── Sticky bar ── */
    .sticky-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: #fff;
      border-bottom: 2px solid #FF8C00;
      box-shadow: 0 2px 12px rgba(255,140,0,.12);
      padding: 8px 20px;
    }

    /* ── Buttons ── */
    .btn-orange {
      display: inline-block;
      background: #FF8C00;
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: .04em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      border-radius: 10px;
      transition: background .18s, transform .15s, box-shadow .15s;
      text-align: center;
      text-decoration: none;
    }
    .btn-orange:hover {
      background: #E07800;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(255,140,0,.35);
    }
    .btn-orange:active { transform: translateY(0); }

    .btn-outline {
      display: inline-block;
      background: transparent;
      color: #FF8C00;
      border: 2px solid #FF8C00;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 0.875rem;
      letter-spacing: .03em;
      text-transform: uppercase;
      border-radius: 8px;
      padding: 8px 20px;
      transition: all .18s;
      text-decoration: none;
    }
    .btn-outline:hover { background: #FF8C00; color: #fff; }

    /* ── Pricing card ── */
    .pricing-card {
      background: #fff;
      border: 1.5px solid #E5E7EB;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,.05);
      transition: transform .22s ease, box-shadow .22s ease;
    }
    .pricing-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(0,0,0,.1);
    }
    .pricing-card-best {
      border: 2.5px solid #FF8C00 !important;
      box-shadow: 0 4px 24px rgba(255,140,0,.16) !important;
    }
    .pricing-card-best:hover {
      box-shadow: 0 14px 48px rgba(255,140,0,.24) !important;
    }

    /* ── Ingredient card ── */
    .ingredient-card {
      background: #fff;
      border: 1.5px solid #E5E7EB;
      border-radius: 16px;
      transition: border-color .2s, transform .2s, box-shadow .2s;
    }
    .ingredient-card:hover {
      border-color: #FF8C00;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(255,140,0,.1);
    }

    /* ── FAQ ── */
    .faq-answer {
      max-height: 0; overflow: hidden;
      transition: max-height .35s ease, padding .3s ease;
    }
    .faq-answer.open { max-height: 500px; }

    /* ── Animations ── */
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.25} }
    @keyframes ticker    { 0%,100%{opacity:1} 50%{opacity:.5}  }
    @keyframes float-up  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes badge-pop { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.05)} }

    .pulse-dot   { animation: pulse-dot 1.2s ease-in-out infinite; }
    .ticker-blink{ animation: ticker    1.5s ease-in-out infinite; }

    /* ── Section divider ── */
    .divider {
      width: 60px; height: 4px;
      background: linear-gradient(90deg,#FF8C00,#4CAF50);
      border-radius: 2px; margin: 16px auto 0;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .show-mobile { display: block !important; }
      .pricing-card-best { transform: none !important; }
    }
    @media (min-width: 769px) {
      .show-mobile { display: none !important; }
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
// SHARED PRIMITIVES
// ---------------------------------------------------------------------------
function Stars({ n = 5, size = '1rem' }: { n?: number; size?: string }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: size, letterSpacing: '1px' }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  );
}

function Tag({ children, color = C.orange }: { children: React.ReactNode; color?: string }) {
  const isOrange = color === C.orange;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: isOrange ? '#FFF7ED' : '#F0FDF4',
      border: `1.5px solid ${isOrange ? '#FDBA74' : '#86EFAC'}`,
      borderRadius: '100px', padding: '5px 16px', marginBottom: '14px' }}>
      <span style={{ color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.1em' }}>{children}</span>
    </div>
  );
}

function SectionHeading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
      <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 900,
        color: C.textDark, marginBottom: sub ? '12px' : 0 }}>{children}</h2>
      <div className="divider" />
      {sub && <p style={{ color: C.textMuted, marginTop: '16px', fontSize: '1.05rem',
        maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>{sub}</p>}
    </div>
  );
}

function CTAButton({ label = 'ORDER NOW', size = 'md', full = false }: {
  label?: string; size?: 'sm'|'md'|'lg'; full?: boolean;
}) {
  const pad = size === 'lg' ? '18px 52px' : size === 'sm' ? '9px 22px' : '13px 36px';
  const fs  = size === 'lg' ? '1.1rem'   : size === 'sm' ? '0.8rem'   : '0.9rem';
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%',
            background: '#EF4444', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: C.textBody, fontSize: '0.8rem', fontWeight: 600 }}>
            LIMITED OFFER ENDS IN:
          </span>
          <span className="ticker-blink" style={{ color: C.orange, fontWeight: 800,
            fontSize: '0.95rem', fontFamily: 'monospace' }}>{timer}</span>
          <span className="hide-mobile" style={{ color: C.textMuted, fontSize: '0.8rem' }}>
            &nbsp;· 🔥 Save 75% + Free Shipping on 6-Bottle Pack
          </span>
        </div>
        <a href={AFFILIATE_LINK} className="btn-orange"
          style={{ padding: '7px 20px', fontSize: '0.8rem', flexShrink: 0 }}
          rel="nofollow noopener" target="_blank">CLAIM DEAL →</a>
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
      padding: '14px 20px', marginTop: '42px',
      boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <img src={IMG('logo.png')} alt="CitrusBurn™" style={{ height: '38px' }}
          onError={(e) => imgFallback(e, 160, 38, 'CitrusBurn', 'ffffff', 'FF8C00')} />
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[['#free-bonuses','Bonuses'],['#about','Science'],['#ingredients','Ingredients'],['#faq','FAQ']].map(([href,label]) => (
            <a key={href} href={href}
              style={{ color: C.textMuted, fontSize: '0.875rem', fontWeight: 500,
                transition: 'color .15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>
              {label}
            </a>
          ))}
          <CTAButton label="ORDER NOW" size="sm" />
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
    <section style={{ background: 'linear-gradient(160deg, #FFFBF5 0%, #F9FAFB 60%, #F0FDF4 100%)',
      padding: '96px 20px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '380px', height: '380px',
        borderRadius: '50%', background: 'rgba(255,140,0,.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '280px', height: '280px',
        borderRadius: '50%', background: 'rgba(76,175,80,.05)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '920px', margin: '0 auto', position: 'relative' }}>
        <Tag>APRIL 2026 · HARVARD & BARCELONA BREAKTHROUGH</Tag>

        <h1 style={{ fontSize: 'clamp(2.2rem,5.5vw,3.8rem)', fontWeight: 900,
          color: C.textDark, marginBottom: '20px', lineHeight: 1.1 }}>
          The Citrus Secret{' '}
          <span style={{ color: C.orange }}>Everyone&rsquo;s</span>{' '}
          Talking About
        </h1>

        <p style={{ fontSize: 'clamp(1.05rem,2.5vw,1.25rem)', color: C.textBody,
          maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.75 }}>
          Burn More. Crave Less. Feel Great All Day with CitrusBurn™.{' '}
          <strong style={{ color: C.textDark }}>
            Harvard & Barcelona researchers finally revealed why diets fail after 35 —
            and the 7-botanical fix that changes everything.
          </strong>
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', marginBottom: '36px' }}>
          <Stars n={5} size="1.15rem" />
          <span style={{ color: C.textBody, fontSize: '0.9rem' }}>
            <strong>4.9/5</strong> · 73,000+ Verified Reviews
          </span>
        </div>

        {/* Product image */}
        <div style={{ marginBottom: '40px' }}>
          <img src={IMG('s6prd.png')} alt="CitrusBurn™ 6-Bottle Pack"
            style={{ maxWidth: '480px', width: '100%', height: 'auto',
              margin: '0 auto', display: 'block', filter: 'drop-shadow(0 20px 40px rgba(255,140,0,.15))' }}
            onError={(e) => imgFallback(e, 480, 340, 'CitrusBurn Product', 'FFF7ED', 'FF8C00')} />
        </div>

        {/* Social proof micro-quotes */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center',
          flexWrap: 'wrap', marginBottom: '44px' }}>
          {[
            { q: 'I can actually see the results! Finally something that works!', name: 'Joanne P.' },
            { q: "More energy, better sleep — and I didn't change my diet.", name: 'Sam L.' },
          ].map((t) => (
            <div key={t.name} style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
              borderRadius: '14px', padding: '18px 22px', maxWidth: '310px', textAlign: 'left',
              boxShadow: C.shadow }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <CTAButton label="CLAIM YOUR DISCOUNTED CITRUSBURN™ TODAY" size="lg" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
            justifyContent: 'center' }}>
            {['🔒 Secure Checkout','180-Day Guarantee','No Subscription'].map((t) => (
              <span key={t} style={{ color: C.textMuted, fontSize: '0.8rem', display: 'flex',
                alignItems: 'center', gap: '4px' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Press logos */}
        <div style={{ marginTop: '60px', paddingTop: '36px', borderTop: `1px solid ${C.border}` }}>
          <p style={{ color: C.textLight, fontSize: '0.72rem', letterSpacing: '.14em',
            fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase' }}>As Featured In</p>
          <img src={IMG('s11logos.png')} alt="As featured in press" className="hide-mobile"
            style={{ maxWidth: '520px', width: '100%', height: 'auto', margin: '0 auto', display: 'block',
              filter: 'grayscale(100%) opacity(0.4)' }}
            onError={(e) => imgFallback(e, 520, 56, 'Forbes · WebMD · Healthline · PubMed · BBC', 'F9FAFB', '9CA3AF')} />
          <img src={IMG('s11logos-mob.png')} alt="As featured in press" className="show-mobile"
            style={{ maxWidth: '100%', height: 'auto', margin: '0 auto', display: 'block',
              filter: 'grayscale(100%) opacity(0.4)' }}
            onError={(e) => imgFallback(e, 320, 48, 'Forbes · WebMD · Healthline · PubMed', 'F9FAFB', '9CA3AF')} />
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
    <div style={{ background: C.orange, padding: '14px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: '32px',
        flexWrap: 'wrap', textAlign: 'center' }}>
        {[
          { label: 'SALE STATUS',      value: 'LIVE',  accent: '#FFF', sub: '#FFE0A0' },
          { label: 'STOCK LEVEL',      value: 'LOW',   accent: '#FFF', sub: '#FFE0A0' },
          { label: 'RESERVED FOR',     value: timer,   accent: '#FFF', sub: '#FFE0A0', mono: true },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,.75)', fontSize: '0.62rem',
              letterSpacing: '.14em', fontWeight: 700 }}>{item.label}</span>
            <span className={item.mono ? 'ticker-blink' : ''}
              style={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem',
                fontFamily: item.mono ? 'monospace' : 'Montserrat, sans-serif' }}>
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
    <div className={`pricing-card ${best ? 'pricing-card-best' : ''}`}
      style={{ padding: '32px 26px', flex: '1 1 270px', maxWidth: '330px', position: 'relative' }}>

      {best && (
        <div style={{ position: 'absolute', top: '-14px', left: '50%',
          background: C.orange, color: '#fff', fontFamily: 'Montserrat,sans-serif',
          fontWeight: 800, fontSize: '0.72rem', letterSpacing: '.1em',
          padding: '5px 20px', borderRadius: '100px', whiteSpace: 'nowrap',
          animation: 'badge-pop 2.5s ease-in-out infinite' }}>
          ⭐ BEST VALUE · MOST POPULAR ⭐
        </div>
      )}

      {/* Label */}
      <div style={{ display: 'inline-block', background: best ? '#FFF7ED' : C.bgGray,
        color: best ? C.orange : C.textMuted, fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '.1em', padding: '3px 12px', borderRadius: '100px', marginBottom: '10px' }}>
        {label}
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: C.textDark, marginBottom: '2px' }}>
        {bottles} Bottles
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.82rem', marginBottom: '20px' }}>{duration} Supply</p>

      <img src={IMG(packageImg)} alt={`${bottles}-bottle pack`}
        style={{ width: '130px', height: 'auto', display: 'block', margin: '0 auto 20px' }}
        onError={(e) => imgFallback(e, 130, 160, `${bottles} Bottles`, 'F9FAFB', 'FF8C00')} />

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
          <span style={{ fontSize: '2.8rem', fontWeight: 900,
            color: best ? C.orange : C.textDark, lineHeight: 1 }}>${perBottle}</span>
          <span style={{ color: C.textMuted, fontSize: '0.82rem' }}>/bottle</span>
        </div>
        <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px' }}>
          <span style={{ textDecoration: 'line-through', color: C.textLight, fontSize: '0.9rem' }}>
            ${originalTotal}
          </span>
          <span style={{ fontWeight: 700, color: C.textDark, fontSize: '1rem' }}>${total} total</span>
        </div>
        <div style={{ display: 'inline-block', background: C.greenL, color: C.greenD,
          fontWeight: 700, fontSize: '0.8rem', padding: '3px 12px', borderRadius: '100px', marginTop: '6px' }}>
          You Save ${savings}!
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px',
        display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          bonuses  && '2 FREE Digital Bonuses',
          freeShip && '✓ Free USA Shipping',
          !freeShip && '+ Shipping',
          '✓ 180-Day Money-Back Guarantee',
        ].filter(Boolean).map((f) => (
          <li key={String(f)} style={{ display: 'flex', alignItems: 'center', gap: '8px',
            color: C.textBody, fontSize: '0.855rem' }}>
            {String(f).startsWith('✓')
              ? <span style={{ color: C.green, fontWeight: 700 }}>{f}</span>
              : <><span style={{ color: C.green, fontWeight: 700 }}>✓</span> {f}</>
            }
          </li>
        ))}
      </ul>

      <CTAButton label="BUY NOW" size="md" full />
      {best && (
        <p style={{ color: C.green, fontSize: '0.75rem', textAlign: 'center',
          marginTop: '8px', fontWeight: 600 }}>
          ✓ Free bonuses + free shipping included
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
    <section id={id} style={{ background: C.bgSoft, padding: '96px 20px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {/* Stock alert */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '100px',
            padding: '6px 18px', marginBottom: '20px' }}>
            <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%',
              background: '#EF4444', display: 'inline-block' }} />
            <span style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.06em' }}>
              STOCK LOW — RESERVED FOR{' '}
              <span className="ticker-blink" style={{ fontFamily: 'monospace' }}>{timer}</span>
            </span>
          </div>
          <SectionHeading sub="Join 96% of customers who choose the 6-bottle pack for best results & value">
            Claim Your Discounted CitrusBurn™ Today
          </SectionHeading>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center',
          flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '16px' }}>
          <PricingCard label="STARTER"      bottles={2} duration="60 Day"  perBottle={79} total={158} originalTotal={398}  savings={240} bonuses={false} freeShip={false} packageImg="pkg1.png" />
          <PricingCard label="POPULAR"      bottles={3} duration="90 Day"  perBottle={69} total={207} originalTotal={597}  savings={390} bonuses={true}  freeShip={false} packageImg="pkg2.png" />
          <PricingCard label="BEST VALUE"   bottles={6} duration="180 Day" perBottle={49} total={294} originalTotal={1194} savings={900} bonuses={true}  freeShip={true}  best packageImg="pkg3.png" />
        </div>

        {/* Trust badge row */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center',
          flexWrap: 'wrap', marginTop: '44px', alignItems: 'center',
          padding: '24px', background: C.bgWhite, borderRadius: '16px',
          boxShadow: C.shadow, maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
          {[
            { src: 'mbseal.png',          alt: '180-Day Guarantee', h: 70 },
            { src: 'bestseller-seal.png', alt: 'Best Seller',       h: 56 },
            { src: 'shipping-seal.png',   alt: 'Free Shipping',     h: 56 },
            { src: 'cards.png',           alt: 'Secure Payment',    h: 30 },
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
// GUARANTEE — integrated, not floating
// ---------------------------------------------------------------------------
function GuaranteeSection() {
  return (
    <section style={{ background: C.bgGreen, padding: '80px 20px',
      borderTop: `1px solid ${C.borderGr}`, borderBottom: `1px solid ${C.borderGr}` }}>
      <div style={{ maxWidth: '820px', margin: '0 auto',
        display: 'flex', gap: '48px', alignItems: 'center',
        flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* Seal — integrated look */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <img src={IMG('mbseal.png')} alt="180-Day Guarantee"
            style={{ width: '140px', height: '140px', objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(76,175,80,.2))' }}
            onError={(e) => imgFallback(e, 140, 140, '180 Days', 'F0FDF4', '4CAF50')} />
        </div>

        <div style={{ flex: '1 1 320px' }}>
          <Tag color={C.green}>ZERO RISK · ZERO QUESTIONS</Tag>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: C.textDark, marginBottom: '14px' }}>
            180-Day 100% Money-Back Guarantee
          </h2>
          <p style={{ color: C.textBody, lineHeight: 1.85, marginBottom: '14px' }}>
            Your order is completely protected. If you&rsquo;re not amazed at how quickly your body
            feels lighter, more energized, and visibly transformed — just contact us within 180 days
            and we&rsquo;ll refund every cent of your purchase.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: C.green, fontSize: '1.2rem' }}>✓</span>
            <span style={{ color: C.greenD, fontWeight: 700 }}>No questions asked. No hassle. Full refund.</span>
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
    <section id="free-bonuses" style={{ background: C.bgWhite, padding: '96px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
        <Tag>🎁 FREE WITH 3 OR 6 BOTTLE ORDER</Tag>
        <SectionHeading sub="A combined $114 value — yours absolutely FREE when you choose the 3 or 6 bottle pack">
          2 FREE Digital Bonuses
        </SectionHeading>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { img: 'bonus1.png', n: '#1', title: 'Spanish Rapid Detox Protocol', val: '$67',
              desc: 'A 15-day Mediterranean cleanse using simple, powerful ingredients from your kitchen. Designed to support thermogenesis and jumpstart your CitrusBurn™ results from day one.', color: C.orange },
            { img: 'bonus2.png', n: '#2', title: 'Mind Over Metabolism Mastery', val: '$47',
              desc: '5-minute daily visualization and craving-reset techniques that reduce emotional eating, boost motivation, and lock in long-term transformation.', color: C.green },
          ].map((b) => (
            <div key={b.n} style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
              borderRadius: '20px', padding: '32px 28px', flex: '1 1 300px', maxWidth: '390px',
              textAlign: 'left', boxShadow: C.shadowMd,
              borderTop: `4px solid ${b.color}` }}>
              <div style={{ display: 'inline-block', background: b.color === C.orange ? '#FFF7ED' : C.greenL,
                color: b.color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.08em',
                padding: '4px 12px', borderRadius: '6px', marginBottom: '20px' }}>
                FREE BONUS {b.n}
              </div>
              <img src={IMG(b.img)} alt={b.title}
                style={{ width: '100%', maxWidth: '170px', height: 'auto',
                  display: 'block', margin: '0 auto 20px' }}
                onError={(e) => imgFallback(e, 170, 210, b.title, 'F9FAFB', 'FF8C00')} />
              <h3 style={{ color: C.textDark, fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
                {b.title}
              </h3>
              <p style={{ color: b.color, fontWeight: 700, fontSize: '0.82rem', marginBottom: '10px' }}>
                Retail Value: {b.val} — Yours 100% FREE
              </p>
              <p style={{ color: C.textMuted, fontSize: '0.875rem', lineHeight: 1.75 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '44px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px' }}>
          <CTAButton label="CLAIM FREE BONUSES + SAVE 75%" size="lg" />
          <p style={{ color: C.textMuted, fontSize: '0.8rem' }}>Free USA Shipping on the 6-bottle pack</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SCIENCE — Medical Journal Grid Style
// ---------------------------------------------------------------------------
function ScienceSection() {
  return (
    <section id="about" style={{ background: C.bgPage, padding: '96px 20px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Tag color={C.orange}>HARVARD & BARCELONA RESEARCH · APRIL 2026</Tag>
          <SectionHeading sub="New studies reveal why diets fail after 35 — and it's not what you think.">
            Scientists Reveal the Hidden Cause of Slow Metabolism
          </SectionHeading>
        </div>

        {/* Medical journal grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: '24px', marginBottom: '48px' }}>
          {[
            {
              label: 'THE CONDITION',
              title: 'Thermogenic Resistance',
              body: 'A metabolic condition that prevents your body from entering the natural fat-burning state of thermogenesis — even when eating well or exercising consistently.',
              icon: '🔬', accent: C.orange,
            },
            {
              label: 'THE RESEARCH',
              title: 'Harvard, Mayo Clinic & University of Barcelona',
              body: 'Three independent research institutions confirmed that a rare compound in Seville orange peel can break through Thermogenic Resistance and restore metabolic function.',
              icon: '📋', accent: '#6366F1',
            },
            {
              label: 'THE RESULT',
              title: 'Up to 74% Increase in Thermogenesis',
              body: 'Participants who supplemented with the key compound experienced up to a 74% increase in thermogenesis — burning stored fat continuously, even during sleep.',
              icon: '📈', accent: C.green,
            },
          ].map((card) => (
            <div key={card.label} style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
              borderRadius: '16px', padding: '28px 24px', boxShadow: C.shadow,
              borderLeft: `4px solid ${card.accent}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.4rem' }}>{card.icon}</span>
                <span style={{ color: card.accent, fontSize: '0.68rem', fontWeight: 800,
                  letterSpacing: '.12em', textTransform: 'uppercase' }}>{card.label}</span>
              </div>
              <h3 style={{ color: C.textDark, fontSize: '1.05rem', fontWeight: 800,
                marginBottom: '10px' }}>{card.title}</h3>
              <p style={{ color: C.textBody, fontSize: '0.9rem', lineHeight: 1.75 }}>{card.body}</p>
            </div>
          ))}
        </div>

        {/* 74% stat callout */}
        <div style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
          borderRadius: '20px', padding: '48px 40px', boxShadow: C.shadowMd,
          display: 'flex', gap: '48px', alignItems: 'center',
          flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '5.5rem', fontWeight: 900, color: C.orange,
              fontFamily: 'Montserrat,sans-serif', lineHeight: 1 }}>74%</div>
            <div style={{ color: C.textMuted, fontSize: '0.82rem', marginTop: '4px' }}>
              Thermogenesis increase
            </div>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <p style={{ color: C.textBody, fontSize: '1rem', lineHeight: 1.85, marginBottom: '16px' }}>
              Research from <strong>Harvard</strong>, <strong>Mayo Clinic</strong>, and the{' '}
              <strong>University of Barcelona</strong> shows that p-synephrine — the active compound
              in CitrusBurn™&rsquo;s Seville Orange Peel extract — can increase thermogenesis by up to{' '}
              <strong style={{ color: C.orange }}>74%</strong>, enabling your body to burn stored fat
              continuously, even while you sleep.
            </p>
            <blockquote style={{ borderLeft: `3px solid ${C.orange}`, paddingLeft: '16px', margin: 0 }}>
              <p style={{ color: C.textDark, fontStyle: 'italic', fontSize: '0.95rem',
                fontWeight: 500, lineHeight: 1.7 }}>
                &ldquo;It&rsquo;s like flipping a switch that tells your body to burn fat, automatically.&rdquo;
              </p>
              <cite style={{ color: C.textMuted, fontSize: '0.8rem', fontStyle: 'normal' }}>
                — Dr. Reeves, Lead Researcher
              </cite>
            </blockquote>
          </div>
        </div>

        {/* Product intro + certification badges */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.textDark, marginBottom: '14px' }}>
            That&rsquo;s Why We Created CitrusBurn™
          </h3>
          <p style={{ color: C.textBody, maxWidth: '660px', margin: '0 auto 32px', lineHeight: 1.85 }}>
            CitrusBurn™ is a 100% natural breakthrough designed to reignite your metabolism without harsh
            stimulants, injections, or crash diets. A science-backed blend of{' '}
            <strong style={{ color: C.orange }}>7 rare botanicals</strong> that optimize your body&rsquo;s
            natural fat-burning capacity — even while you sleep.
          </p>

          {/* Certification badges — single uniform row */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '32px' }}>
            {[
              { icon: '🌱', label: '100% Natural'      },
              { icon: '🚫', label: 'Non-GMO'           },
              { icon: '⚡', label: 'Stimulant-Free'    },
              { icon: '🏭', label: 'FDA-Registered'    },
              { icon: '✅', label: 'GMP Certified'     },
              { icon: '🇺🇸', label: 'Made in USA'      },
            ].map((b) => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '6px',
                background: C.bgWhite, border: `1.5px solid ${C.border}`,
                borderRadius: '100px', padding: '7px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
                <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
                <span style={{ color: C.textBody, fontSize: '0.75rem', fontWeight: 600 }}>{b.label}</span>
              </div>
            ))}
          </div>

          <img src={IMG('s3icons.png')} alt="Certification icons"
            style={{ maxWidth: '380px', width: '100%', height: 'auto', opacity: 0.6 }}
            onError={(e) => imgFallback(e, 380, 72, 'FDA · GMP · Non-GMO · Plant-Based', 'F9FAFB', '9CA3AF')} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// INGREDIENTS — clean 3-column grid
// ---------------------------------------------------------------------------
const INGREDIENTS = [
  { icon: 's8licon1.png', name: 'Seville Orange Peel',   sub: '(p-synephrine)',  stat: 'Primary Thermogenic',   benefit: 'Supports thermogenesis and accelerates fat burn',          accent: C.orange },
  { icon: 's8licon2.png', name: 'Spanish Apple Vinegar', sub: '',                stat: 'Appetite Control',      benefit: 'Promotes fullness and reduces overeating impulses',        accent: '#F59E0B' },
  { icon: 's8licon3.png', name: 'Andalusian Red Pepper', sub: '',                stat: '+25% Calorie Burn',     benefit: 'Increases post-meal calorie burn by up to 25%',            accent: '#EF4444' },
  { icon: 's8licon4.png', name: 'Himalayan Ginger',      sub: '',                stat: '54% Craving Reduction', benefit: 'Clinically reduces cravings by 54% and supports blood sugar', accent: '#10B981' },
  { icon: 's8licon5.png', name: 'Ceremonial Green Tea',  sub: '',                stat: 'Fat Oxidation',         benefit: 'Enhances fat oxidation and delivers sustained energy',     accent: C.green  },
  { icon: 's8licon6.png', name: 'Berberine',             sub: '',                stat: 'Metabolic Regulator',   benefit: 'Supports healthy metabolic and hormonal balance',          accent: '#8B5CF6' },
  { icon: 's8licon1.png', name: 'Korean Red Ginseng',    sub: '',                stat: 'Hormone Optimizer',     benefit: 'Balances hormones for optimal metabolic performance',      accent: '#EC4899' },
];

function IngredientsSection() {
  return (
    <section id="ingredients" style={{ background: C.bgPage, padding: '96px 20px',
      borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Tag color={C.orange}>THE SPANISH FAT-MELTING FORMULA</Tag>
          <SectionHeading sub="Each ingredient is sourced from elite botanical regions and standardized for maximum bioavailability.">
            7 Rare Botanicals Inside Every Capsule
          </SectionHeading>
        </div>

        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {INGREDIENTS.map((ing) => (
            <div key={ing.name} className="ingredient-card"
              style={{ padding: '24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
                  background: `${ing.accent}15`, border: `1.5px solid ${ing.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={IMG(ing.icon)} alt={ing.name}
                    style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                    onError={(e) => imgFallback(e, 28, 28, ing.name[0], 'F9FAFB', 'FF8C00')} />
                </div>
                <div>
                  <h3 style={{ color: C.textDark, fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{ing.name}</h3>
                  {ing.sub && <p style={{ color: C.textMuted, fontSize: '0.7rem', margin: '2px 0 0' }}>{ing.sub}</p>}
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

        {/* Responsive column adjustment */}
        <style>{`
          @media (max-width: 767px)  { #ing-grid { grid-template-columns: 1fr !important; } }
          @media (min-width: 768px) and (max-width: 1023px) { #ing-grid { grid-template-columns: repeat(2,1fr) !important; } }
        `}</style>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  { photo: 'testi-1-min.png', name: 'Tasha M.', age: 41, location: 'Austin, TX', lost: '22 lbs',
    quote: "I bought CitrusBurn™ on a whim. Within a week my jeans were looser and my energy was stable all day. No jitters — just calm, steady progress. I've lost 22 pounds and feel in control for the first time in years." },
  { photo: 'testi-2-min.png', name: 'Neil C.',  age: 57, location: 'Asheville, NC', lost: '17 lbs',
    quote: "The late-night eating was killing me. CitrusBurn™ made the difference almost immediately. I dropped 17 pounds, my doctor noticed improved wellness markers, and I'm not falling asleep at my desk by 3pm anymore. I feel younger than I have in a decade." },
  { photo: 'testi-3-min.png', name: 'Elizabeth V.', age: 62, location: 'Boise, ID', lost: '14 lbs',
    quote: "I used to wake up foggy and dragging through the day. Now I take CitrusBurn™ in the morning and within 30 minutes I'm moving with purpose. I've lost 14 pounds and I'm back to being the version of myself I actually like." },
];

function TestimonialsSection() {
  return (
    <section style={{ background: C.bgGray, padding: '96px 20px' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <Tag color={C.green}>REAL CITRUSBURN™ USERS · VERIFIED RESULTS</Tag>
          <SectionHeading sub="4.9/5 average rating across 73,000+ verified customer reviews">
            Life-Changing Results From Real People
          </SectionHeading>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{ background: C.bgWhite, border: `1.5px solid ${C.border}`,
              borderRadius: '20px', padding: '32px 28px', flex: '1 1 290px', maxWidth: '330px',
              boxShadow: C.shadowMd, position: 'relative' }}>

              {/* Quote */}
              <div style={{ position: 'absolute', top: '20px', right: '24px',
                fontSize: '2.5rem', color: C.orange, opacity: 0.15,
                lineHeight: 1, fontFamily: 'Georgia,serif' }}>&rdquo;</div>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img src={IMG(t.photo)} alt={t.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%',
                    objectFit: 'cover', border: `2px solid ${C.borderOr}`, flexShrink: 0 }}
                  onError={(e) => imgFallback(e, 56, 56, t.name[0], 'FFF7ED', 'FF8C00')} />
                <div>
                  <div style={{ fontWeight: 700, color: C.textDark, fontSize: '0.95rem' }}>
                    {t.name}, age {t.age}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: '0.78rem' }}>{t.location} · Verified Purchase</div>
                  <Stars n={5} size="0.85rem" />
                </div>
              </div>

              {/* Lost badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: C.greenL, border: `1px solid ${C.borderGr}`, borderRadius: '100px',
                padding: '3px 12px', marginBottom: '14px' }}>
                <span style={{ color: C.greenD, fontSize: '0.8rem', fontWeight: 700 }}>
                  ↓ Lost {t.lost}
                </span>
              </div>

              <p style={{ color: C.textBody, fontSize: '0.88rem', lineHeight: 1.75,
                fontStyle: 'italic', margin: 0 }}>&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <CTAButton label="JOIN 73,000+ CUSTOMERS — CLAIM YOUR DISCOUNT" size="lg" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TRUST STRIP
// ---------------------------------------------------------------------------
function TrustStrip() {
  return (
    <section style={{ background: C.bgWhite, padding: '28px 20px',
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex',
        justifyContent: 'center', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {[
          { icon: '🏭', label: 'FDA-Registered Facility' },
          { icon: '✅', label: 'GMP Certified'            },
          { icon: '🌱', label: '100% Plant-Based'         },
          { icon: '🚫', label: 'Non-GMO & Gluten Free'    },
          { icon: '🇺🇸', label: 'Made in USA'             },
          { icon: '💳', label: 'One-Time Payment'         },
        ].map((b) => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '7px',
            background: C.bgPage, border: `1px solid ${C.border}`,
            borderRadius: '100px', padding: '7px 16px' }}>
            <span style={{ fontSize: '0.95rem' }}>{b.icon}</span>
            <span style={{ color: C.textBody, fontSize: '0.78rem', fontWeight: 600 }}>{b.label}</span>
          </div>
        ))}
      </div>
    </section>
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
    a: "Yes — absolutely. There are no hidden charges, subscriptions, or automatic re-bills. One purchase, that's it." },
  { q: "What if CitrusBurn™ doesn't work for me?",
    a: "You're fully covered by our 180-day money-back guarantee. If you're not completely satisfied with your results, contact our support team for a full refund. No questions, no hassle." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ background: C.bgWhite, padding: '96px 20px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
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
                  style={{ width: '100%', padding: '18px 24px', background: 'transparent',
                    border: 'none', cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    gap: '16px', textAlign: 'left' }}>
                  <span style={{ color: C.textDark, fontWeight: 700, fontSize: '0.92rem', flex: 1 }}>
                    {faq.q}
                  </span>
                  <span style={{ color: C.orange, fontSize: '1.4rem', lineHeight: 1, flexShrink: 0,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform .25s' }}>+</span>
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}
                  style={{ padding: isOpen ? '0 24px 18px' : '0 24px 0' }}>
                  <p style={{ color: C.textBody, lineHeight: 1.8, fontSize: '0.88rem', margin: 0 }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <CTAButton label="ORDER NOW & SAVE 75%" size="lg" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FOOTER — clean, professional
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer style={{ background: '#1F2937', padding: '56px 20px 32px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={IMG('logo.png')} alt="CitrusBurn™"
            style={{ height: '36px', filter: 'brightness(0) invert(1)', opacity: 0.8 }}
            onError={(e) => imgFallback(e, 150, 36, 'CitrusBurn', '1F2937', '9CA3AF')} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px',
          flexWrap: 'wrap', marginBottom: '32px' }}>
          {['Terms','Privacy','Order Support','Returns & Refunds','Track My Order'].map((l) => (
            <a key={l} href={AFFILIATE_LINK}
              style={{ color: '#6B7280', fontSize: '0.8rem', transition: 'color .15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D1D5DB')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
              rel="nofollow noopener" target="_blank">{l}</a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #374151', paddingTop: '28px',
          display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ color: '#4B5563', fontSize: '0.7rem', lineHeight: 1.8, textAlign: 'center' }}>
            These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Results may vary. Individual testimonials are from real customers; results are not guaranteed.
            If you are pregnant, nursing, taking medication, or have a medical condition, consult your physician
            before use. This site may contain affiliate links and the publisher may receive compensation for
            purchases made through those links.
          </p>
          <p style={{ color: '#374151', fontSize: '0.7rem', lineHeight: 1.7, textAlign: 'center' }}>
            ClickBank® is a registered trademark of Click Sales, Inc. (1444 S. Entertainment Ave., Suite 410,
            Boise, ID 83709). ClickBank&rsquo;s role as retailer does not constitute endorsement of these products.
          </p>
          <p style={{ color: '#374151', fontSize: '0.68rem', textAlign: 'center', marginTop: '8px' }}>
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
