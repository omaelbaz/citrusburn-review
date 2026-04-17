'use client';

import React, { useState, useEffect } from 'react';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const AFFILIATE_LINK = 'https://d2dc49u948m5po32yfulzx1o0m.hop.clickbank.net';
const TIMER_MINUTES = 9;
const TIMER_SECONDS = 59;

// Local image helper — images must be in /public
const IMG = (file: string) => `/${file}`;

// Placehold.co fallback on broken images
function imgError(
  e: React.SyntheticEvent<HTMLImageElement>,
  w: number,
  h: number,
  label = '',
  bg = '1a1a1a',
  fg = 'd4a017'
) {
  (e.target as HTMLImageElement).src =
    `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label || ' ')}`;
}

// ---------------------------------------------------------------------------
// DESIGN TOKENS
// ---------------------------------------------------------------------------
const C = {
  bgPrimary:   '#0a0a0a',
  bgCard:      '#111111',
  bgElevated:  '#1a1a1a',
  orange:      '#f97316',
  orangeHover: '#ea6c0a',
  gold:        '#d4a017',
  goldLight:   '#f0c040',
  textPrimary: '#f5f5f5',
  textMuted:   '#a8a29e',
  border:      '#2a2a2a',
  red:         '#ef4444',
  green:       '#22c55e',
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: #0a0a0a; color: #f5f5f5; font-family: 'Inter', sans-serif; margin: 0; }

    /* ---------- animations ---------- */
    @keyframes pulse-dot   { 0%,100%{opacity:1} 50%{opacity:0.25} }
    @keyframes ticker-blink{ 0%,100%{opacity:1} 50%{opacity:0.55} }
    @keyframes glow-pulse  { 0%,100%{box-shadow:0 0 20px rgba(249,115,22,.35)} 50%{box-shadow:0 0 44px rgba(249,115,22,.8)} }
    @keyframes gold-glow   { 0%,100%{box-shadow:0 0 28px rgba(212,160,23,.3), 0 0 64px rgba(212,160,23,.1)} 50%{box-shadow:0 0 48px rgba(212,160,23,.55), 0 0 100px rgba(212,160,23,.18)} }
    @keyframes badge-pop   { 0%,100%{transform:translateX(-50%) scale(1)} 50%{transform:translateX(-50%) scale(1.06)} }
    @keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }

    .pulse-dot    { animation: pulse-dot    1.2s ease-in-out infinite; }
    .ticker-blink { animation: ticker-blink 1.5s ease-in-out infinite; }
    .glow-btn     { animation: glow-pulse   2s   ease-in-out infinite; }
    .gold-glow    { animation: gold-glow    2.5s ease-in-out infinite; }

    .shimmer-text {
      background: linear-gradient(90deg,#d4a017 0%,#f0c040 40%,#d4a017 60%,#f0c040 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }

    /* ---------- sticky bar ---------- */
    .sticky-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(10,10,10,0.97);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid #d4a017;
      padding: 7px 20px;               /* slim — non-intrusive */
    }

    /* ---------- buttons ---------- */
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #f97316 0%, #d4a017 100%);
      color: #fff; font-weight: 800; letter-spacing: .06em;
      text-transform: uppercase; border: none; cursor: pointer;
      text-decoration: none; text-align: center;
      transition: transform .15s, box-shadow .15s;
    }
    .btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(249,115,22,.55); }
    .btn-primary:active { transform: translateY(0); }

    /* ---------- pricing card hover ---------- */
    .pricing-card {
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .pricing-card:hover {
      transform: scale(1.05);
    }
    .pricing-card-best {
      border: 2px solid #d4a017 !important;
      transform: scale(1.03);
    }
    .pricing-card-best:hover { transform: scale(1.07); }

    /* ---------- glassmorphism ingredient cards ---------- */
    .glass-card {
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(212,160,23,0.18);
      transition: border-color .2s, transform .2s, box-shadow .2s;
    }
    .glass-card:hover {
      border-color: rgba(249,115,22,0.5);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(249,115,22,0.12);
    }

    /* ---------- FAQ ---------- */
    .faq-answer {
      max-height: 0; overflow: hidden;
      transition: max-height .35s ease, padding .35s ease;
    }
    .faq-answer.open { max-height: 600px; }

    /* ---------- responsive ---------- */
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .show-mobile { display: block !important; }
      .pricing-card-best { transform: scale(1); }
      .pricing-card-best:hover { transform: scale(1.03); }
    }
    @media (min-width: 769px) {
      .show-mobile { display: none !important; }
    }
  `}</style>
);

// ---------------------------------------------------------------------------
// COUNTDOWN HOOK
// ---------------------------------------------------------------------------
function useCountdown(initMin: number, initSec: number) {
  const total = initMin * 60 + initSec;
  const [secs, setSecs] = useState(total);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 1 ? total : s - 1)), 1000);
    return () => clearInterval(id);
  }, [total]);
  return `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// SHARED COMPONENTS
// ---------------------------------------------------------------------------
function Stars({ count = 5 }: { count?: number }) {
  return (
    <span style={{ color: C.gold, fontSize: '1rem', letterSpacing: '2px' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

function CTAButton({ label = 'BUY NOW', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const pad  = size === 'lg' ? '18px 52px' : size === 'sm' ? '9px 22px' : '13px 36px';
  const fs   = size === 'lg' ? '1.15rem'   : size === 'sm' ? '0.82rem'  : '0.95rem';
  return (
    <a
      href={AFFILIATE_LINK}
      className="btn-primary glow-btn"
      style={{ padding: pad, fontSize: fs, borderRadius: '8px' }}
      rel="nofollow noopener"
      target="_blank"
    >
      {label} →
    </a>
  );
}

function SectionTag({ children, color = C.gold }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
      background: `rgba(${color === C.gold ? '212,160,23' : '249,115,22'},.1)`,
      border: `1px solid ${color}40`, borderRadius: '100px', padding: '5px 16px', marginBottom: '14px' }}>
      <span style={{ color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.1em' }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,4vw,2.4rem)',
      fontWeight: 900, color: C.textPrimary, marginBottom: '10px', lineHeight: 1.2 }}>
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// STICKY ORDER BAR — slim, non-intrusive
// ---------------------------------------------------------------------------
function StickyOrderBar() {
  const timer = useCountdown(TIMER_MINUTES, TIMER_SECONDS);
  return (
    <div className="sticky-bar">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%',
            background: C.red, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: C.textMuted, fontSize: '0.75rem' }}>SALE ENDS:</span>
          <span className="ticker-blink" style={{ color: C.orange, fontWeight: 800,
            fontSize: '0.9rem', fontFamily: 'monospace' }}>{timer}</span>
          <span className="hide-mobile" style={{ color: C.textMuted, fontSize: '0.75rem' }}>
            &nbsp;· 🔥 75% OFF + Free Shipping on 6-Pack · Stock:&nbsp;
            <span style={{ color: C.red, fontWeight: 700 }}>LOW</span>
          </span>
        </div>
        <a href={AFFILIATE_LINK} className="btn-primary"
          style={{ padding: '7px 18px', fontSize: '0.78rem', borderRadius: '6px', flexShrink: 0 }}
          rel="nofollow noopener" target="_blank">ORDER NOW →</a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NAV
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <nav style={{ background: C.bgPrimary, borderBottom: `1px solid ${C.border}`,
      padding: '12px 20px', marginTop: '40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <img src={IMG('logo.png')} alt="CitrusBurn™" style={{ height: '38px' }}
          onError={(e) => imgError(e, 160, 38, 'CitrusBurn', '0a0a0a', 'd4a017')} />
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[['#free-bonuses','Free Bonuses'],['#about','About'],['#ingredients','Ingredients'],['#faq','FAQ']].map(([href,label]) => (
            <a key={href} href={href}
              style={{ color: C.textMuted, fontSize: '0.85rem', textDecoration: 'none' }}>{label}</a>
          ))}
          <a href={AFFILIATE_LINK} className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.78rem', borderRadius: '6px' }}
            rel="nofollow noopener" target="_blank">ORDER NOW</a>
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
    <section style={{ background: 'linear-gradient(180deg,#0a0a0a 0%,#0f0a04 50%,#0a0a0a 100%)',
      padding: '96px 20px 72px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '320px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse,rgba(249,115,22,.07) 0%,transparent 70%)' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        <SectionTag color={C.gold}>APRIL 2026 · NEW SCIENTIFIC BREAKTHROUGH</SectionTag>

        <h1 style={{ fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem,5vw,3.6rem)', fontWeight: 900, lineHeight: 1.12,
          color: C.textPrimary, marginBottom: '18px' }}>
          The Citrus Secret{' '}
          <span className="shimmer-text">Everyone&rsquo;s Talking About!</span>
        </h1>

        <p style={{ fontSize: 'clamp(1.05rem,2.5vw,1.35rem)', color: C.textMuted,
          marginBottom: '28px', maxWidth: '660px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          Burn More. Crave Less. Feel Great All Day with CitrusBurn™.
          <br />
          <span style={{ color: C.textPrimary, fontWeight: 600 }}>
            Harvard &amp; Barcelona researchers revealed why diets fail after 35 —
            and the 7-botanical fix that changes everything.
          </span>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', marginBottom: '28px' }}>
          <Stars />
          <span style={{ color: C.textMuted, fontSize: '0.88rem' }}>
            4.9/5 · <strong style={{ color: C.textPrimary }}>73,000+</strong> Verified Reviews
          </span>
        </div>

        {/* Product image */}
        <div style={{ marginBottom: '36px' }}>
          <img src={IMG('s6prd.png')} alt="CitrusBurn™ 6-Bottle Pack"
            style={{ maxWidth: '500px', width: '100%', height: 'auto', margin: '0 auto', display: 'block' }}
            onError={(e) => imgError(e, 500, 380, 'CitrusBurn Product', '0f0a04', 'f97316')} />
        </div>

        {/* Micro testimonials */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {[
            { q: 'I can actually see the results! Finally something that actually works!', name: 'Joanne P.' },
            { q: "More energy, better sleep, and I didn't change my diet.", name: 'Sam L.' },
          ].map((t) => (
            <div key={t.name} style={{ background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: '12px', padding: '16px 20px', maxWidth: '320px', textAlign: 'left' }}>
              <Stars />
              <p style={{ color: C.textPrimary, fontSize: '0.875rem', margin: '8px 0 4px', fontStyle: 'italic' }}>
                &ldquo;{t.q}&rdquo;
              </p>
              <span style={{ color: C.orange, fontSize: '0.78rem', fontWeight: 600 }}>
                — {t.name} · Verified Buyer
              </span>
            </div>
          ))}
        </div>

        {/* Hero CTA — centered, orange/gold gradient */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <CTAButton label="CLAIM YOUR DISCOUNTED CITRUSBURN™ TODAY" size="lg" />
          <p style={{ color: C.textMuted, fontSize: '0.78rem', margin: 0 }}>
            🔒 Secure Checkout · 180-Day Money-Back Guarantee · One-Time Payment
          </p>
        </div>

        {/* Press logos */}
        <div style={{ marginTop: '56px', opacity: 0.55 }}>
          <p style={{ color: C.textMuted, fontSize: '0.7rem', letterSpacing: '.12em', marginBottom: '14px' }}>
            AS FEATURED IN
          </p>
          <img src={IMG('s11logos.png')} alt="Featured in press" className="hide-mobile"
            style={{ maxWidth: '540px', width: '100%', height: 'auto', margin: '0 auto', display: 'block',
              filter: 'grayscale(100%) brightness(1.8)' }}
            onError={(e) => imgError(e, 540, 60, 'Forbes · WebMD · HealthLine · PubMed · BBC', '0a0a0a', '5a5a5a')} />
          <img src={IMG('s11logos-mob.png')} alt="Featured in press" className="show-mobile"
            style={{ maxWidth: '100%', height: 'auto', margin: '0 auto', display: 'block',
              filter: 'grayscale(100%) brightness(1.8)' }}
            onError={(e) => imgError(e, 340, 60, 'Forbes · WebMD · HealthLine · PubMed', '0a0a0a', '5a5a5a')} />
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
    <section style={{ background: 'linear-gradient(90deg,#1a0800,#2d1200,#1a0800)',
      borderTop: 'solid 1px rgba(249,115,22,.3)', borderBottom: 'solid 1px rgba(249,115,22,.3)',
      padding: '18px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', textAlign: 'center' }}>
        {[
          { label: 'SALE STATUS',        value: 'LIVE',  color: C.green,  icon: '●', anim: 'pulse-dot'    },
          { label: 'STOCK LEVEL',        value: 'LOW',   color: C.red,    icon: '⚠', anim: ''             },
          { label: 'SPOT RESERVED FOR',  value: timer,   color: C.orange, icon: '⏱', anim: 'ticker-blink' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ color: C.textMuted, fontSize: '0.62rem', letterSpacing: '.12em', fontWeight: 700 }}>
              {item.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={item.anim} style={{ color: item.color, fontSize: '0.85rem' }}>{item.icon}</span>
              <span style={{ color: item.color, fontWeight: 800, fontSize: '1.1rem',
                fontFamily: item.label === 'SPOT RESERVED FOR' ? 'monospace' : 'inherit' }}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PRICING CARD
// ---------------------------------------------------------------------------
function PricingCard({ label, bottles, duration, perBottle, total, originalTotal,
  savings, bonuses, freeShip, highlighted, packageImg }: {
  label: string; bottles: number; duration: string; perBottle: number; total: number;
  originalTotal: number; savings: number; bonuses: boolean; freeShip: boolean;
  highlighted?: boolean; packageImg: string;
}) {
  return (
    <div
      className={`pricing-card ${highlighted ? 'pricing-card-best gold-glow' : ''}`}
      style={{
        background: highlighted ? 'linear-gradient(180deg,#1c1100,#111111)' : C.bgCard,
        border: highlighted ? `2px solid ${C.gold}` : `1px solid ${C.border}`,
        borderRadius: '18px', padding: '32px 24px',
        flex: '1 1 280px', maxWidth: '340px', position: 'relative',
      }}
    >
      {highlighted && (
        <div style={{ position: 'absolute', top: '-13px', left: '50%',
          background: `linear-gradient(90deg,${C.gold},${C.goldLight})`,
          color: '#000', fontWeight: 900, fontSize: '0.72rem', letterSpacing: '.1em',
          padding: '5px 20px', borderRadius: '100px', whiteSpace: 'nowrap',
          animation: 'badge-pop 2.5s ease-in-out infinite' }}>
          ★ MOST POPULAR · BEST VALUE ★
        </div>
      )}

      <p style={{ color: highlighted ? C.gold : C.textMuted, fontSize: '0.72rem',
        fontWeight: 700, letterSpacing: '.1em', marginBottom: '6px' }}>{label}</p>
      <h3 style={{ color: C.textPrimary, fontSize: '1.45rem', fontWeight: 800, marginBottom: '2px' }}>
        {bottles} Bottles
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.82rem', marginBottom: '18px' }}>{duration} Supply</p>

      <img src={IMG(packageImg)} alt={`${bottles}-bottle pack`}
        style={{ width: '130px', height: 'auto', display: 'block', margin: '0 auto 18px' }}
        onError={(e) => imgError(e, 130, 160, `${bottles} Bottles`, '111111', 'f97316')} />

      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '2.8rem', fontWeight: 900, color: highlighted ? C.gold : C.orange, lineHeight: 1 }}>
            ${perBottle}
          </span>
          <span style={{ color: C.textMuted, fontSize: '0.85rem' }}>/ bottle</span>
        </div>
        <div style={{ marginTop: '4px' }}>
          <span style={{ textDecoration: 'line-through', color: C.textMuted, fontSize: '0.9rem', marginRight: '8px' }}>
            ${originalTotal}
          </span>
          <span style={{ color: C.textPrimary, fontWeight: 700 }}>${total} total</span>
        </div>
        <p style={{ color: C.green, fontSize: '0.82rem', fontWeight: 700, marginTop: '4px' }}>
          You Save: ${savings}!
        </p>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {[
          bonuses   && '2 FREE Digital Bonuses',
          freeShip  && 'Free USA Shipping',
          !freeShip && '+ Shipping',
          '180-Day Money-Back Guarantee',
        ].filter(Boolean).map((f) => (
          <li key={String(f)} style={{ display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.85rem', color: C.textPrimary }}>
            <span style={{ color: C.green }}>✓</span> {f}
          </li>
        ))}
      </ul>

      <a href={AFFILIATE_LINK}
        className={`btn-primary ${highlighted ? 'glow-btn' : ''}`}
        style={{ display: 'block', width: '100%', padding: '15px', fontSize: '0.95rem', borderRadius: '8px',
          background: highlighted
            ? `linear-gradient(135deg,${C.gold},${C.orange})`
            : `linear-gradient(135deg,${C.orange},${C.orangeHover})` }}
        rel="nofollow noopener" target="_blank">BUY NOW</a>

      {highlighted && (
        <p style={{ color: C.gold, fontSize: '0.72rem', textAlign: 'center', marginTop: '8px', fontWeight: 600 }}>
          BIGGEST DISCOUNT · FREE BONUSES INCLUDED
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
    <section id={id} style={{ background: C.bgPrimary, padding: '96px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.35)',
            borderRadius: '100px', padding: '5px 16px', marginBottom: '16px' }}>
            <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%',
              background: C.red, display: 'inline-block' }} />
            <span style={{ color: C.red, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '.1em' }}>
              STOCK LOW — SPOT RESERVED FOR <span style={{ fontFamily: 'monospace' }}>{timer}</span>
            </span>
          </div>
          <SectionTitle>Claim Your Discounted CitrusBurn™ Below</SectionTitle>
          <p style={{ color: C.textMuted }}>
            While Stock Lasts · 96% of customers choose the 6-bottle pack
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center',
          flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '48px' }}>
          <PricingCard label="BASIC"        bottles={2} duration="60 Day"  perBottle={79} total={158} originalTotal={398}  savings={240} bonuses={false} freeShip={false} packageImg="pkg1.png" />
          <PricingCard label="BUNDLE"       bottles={3} duration="90 Day"  perBottle={69} total={207} originalTotal={597}  savings={390} bonuses={true}  freeShip={false} packageImg="pkg2.png" />
          <PricingCard label="MOST POPULAR" bottles={6} duration="180 Day" perBottle={49} total={294} originalTotal={1194} savings={900} bonuses={true}  freeShip={true}  highlighted packageImg="pkg3.png" />
        </div>

        {/* Trust badges — uniform single row */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center',
          flexWrap: 'wrap', marginTop: '40px', alignItems: 'center' }}>
          {[
            { src: 'mbseal.png',        alt: '180-Day Guarantee', h: 76,  w: 76  },
            { src: 'bestseller-seal.png', alt: 'Best Seller',     h: 60,  w: 60  },
            { src: 'shipping-seal.png', alt: 'Free Shipping',     h: 60,  w: 60  },
            { src: 'cards.png',         alt: 'Secure Payment',    h: 32,  w: 120 },
          ].map((b) => (
            <img key={b.src} src={IMG(b.src)} alt={b.alt}
              style={{ height: `${b.h}px`, width: 'auto', objectFit: 'contain' }}
              onError={(e) => imgError(e, b.w, b.h, b.alt)} />
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
    <section style={{ background: C.bgCard, padding: '96px 20px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex',
        gap: '40px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <img src={IMG('mbseal.png')} alt="180-Day Money-Back Guarantee" style={{ width: '150px', flexShrink: 0 }}
          onError={(e) => imgError(e, 150, 150, '180-Day Guarantee')} />
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ color: C.gold, fontSize: '1.45rem', fontWeight: 800,
            letterSpacing: '.04em', marginBottom: '14px', textTransform: 'uppercase' }}>
            180-Day · 100% Satisfaction Guarantee
          </h2>
          <p style={{ color: C.textPrimary, lineHeight: 1.85, marginBottom: '12px' }}>
            Your order is protected by our no-risk 180-day money-back guarantee. If you&rsquo;re not amazed at how quickly your body feels lighter, more energized, and visibly transformed, just let us know within 180 days and we&rsquo;ll refund every cent.
          </p>
          <p style={{ color: C.gold, fontWeight: 700 }}>No questions asked. Zero risk.</p>
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
    <section id="free-bonuses" style={{ background: C.bgPrimary, padding: '96px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
        <SectionTag color={C.gold}>🎁 ORDER 3 OR 6 BOTTLES AND GET</SectionTag>
        <SectionTitle>2 FREE Digital Bonuses</SectionTitle>
        <p style={{ color: C.textMuted, marginBottom: '48px' }}>
          A combined $114 value — yours FREE with the 3 or 6 bottle pack
        </p>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { img: 'bonus1.png', n: '#1', title: 'Spanish Rapid Detox Protocol', val: '$67',
              desc: 'Keep out toxins and support thermogenesis with this 15-day Mediterranean cleanse using simple, powerful ingredients from your kitchen. Designed to jumpstart your results.' },
            { img: 'bonus2.png', n: '#2', title: 'Mind Over Metabolism Mastery', val: '$47',
              desc: 'Rewire your mindset with daily 5-minute visualization and craving-reset techniques. Reduces emotional eating, boosts motivation, and locks in long-term transformation.' },
          ].map((b) => (
            <div key={b.n} style={{ background: C.bgCard,
              border: `1px solid ${C.gold}`, borderRadius: '16px', padding: '28px 24px',
              flex: '1 1 300px', maxWidth: '390px', textAlign: 'left',
              boxShadow: '0 0 28px rgba(212,160,23,.1)' }}>
              <div style={{ display: 'inline-block', background: 'rgba(212,160,23,.1)',
                border: `1px solid ${C.gold}`, borderRadius: '6px', padding: '3px 10px', marginBottom: '16px' }}>
                <span style={{ color: C.gold, fontSize: '0.72rem', fontWeight: 700 }}>FREE BONUS {b.n}</span>
              </div>
              <img src={IMG(b.img)} alt={b.title}
                style={{ width: '100%', maxWidth: '180px', height: 'auto', display: 'block', margin: '0 auto 16px' }}
                onError={(e) => imgError(e, 180, 220, b.title)} />
              <h3 style={{ color: C.textPrimary, fontSize: '1.05rem', fontWeight: 800, marginBottom: '5px' }}>{b.title}</h3>
              <p style={{ color: C.gold, fontWeight: 700, fontSize: '0.82rem', marginBottom: '10px' }}>
                Value: {b.val} — Yours 100% FREE
              </p>
              <p style={{ color: C.textMuted, fontSize: '0.875rem', lineHeight: 1.72 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <CTAButton label="GET FREE BONUSES + CLAIM DISCOUNT" size="lg" />
          <p style={{ color: C.textMuted, fontSize: '0.78rem', margin: 0 }}>
            Free USA Shipping on the 6-bottle pack
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SCIENCE
// ---------------------------------------------------------------------------
function ScienceSection() {
  return (
    <section id="about" style={{ background: 'linear-gradient(180deg,#0a0a0a,#050800)', padding: '96px 20px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <SectionTag color={C.orange}>HARVARD &amp; BARCELONA RESEARCH · APRIL 2026</SectionTag>
          <SectionTitle>Scientists Reveal the Hidden Cause of Slow Metabolism</SectionTitle>
          <p style={{ color: C.textMuted, fontSize: '1.05rem' }}>
            And it&rsquo;s <em>not</em> your age, diet, or willpower.
          </p>
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`,
          borderRadius: '20px', padding: '40px 36px', marginBottom: '32px' }}>
          <p style={{ color: C.textPrimary, lineHeight: 1.9, marginBottom: '20px' }}>
            New studies show the real reason most people struggle to lose weight — especially after 35 — is something called{' '}
            <strong style={{ color: C.orange }}>Thermogenic Resistance</strong>. This condition prevents your metabolism
            from entering a natural fat-burning state known as <strong>thermogenesis</strong>, even when you eat well or exercise.
          </p>

          <div style={{ borderLeft: `4px solid ${C.orange}`, paddingLeft: '20px', margin: '24px 0' }}>
            <p style={{ color: C.textPrimary, fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.7 }}>
              &ldquo;It&rsquo;s like flipping a switch that tells your body to burn fat, automatically.&rdquo;
            </p>
            <span style={{ color: C.textMuted, fontSize: '0.82rem' }}>— Dr. Reeves, Lead Researcher</span>
          </div>

          <p style={{ color: C.textPrimary, lineHeight: 1.9, marginBottom: '24px' }}>
            Research from <strong style={{ color: C.gold }}>Harvard</strong>,{' '}
            <strong style={{ color: C.gold }}>Mayo Clinic</strong>, and the{' '}
            <strong style={{ color: C.gold }}>University of Barcelona</strong> shows a rare compound in Seville orange peel
            can break through Thermogenic Resistance — increasing thermogenesis by up to:
          </p>

          <div style={{ textAlign: 'center', padding: '28px',
            background: 'rgba(212,160,23,.05)', border: '1px solid rgba(212,160,23,.2)',
            borderRadius: '16px', marginBottom: '24px' }}>
            <div className="shimmer-text" style={{ fontSize: '5.5rem', fontWeight: 900,
              lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>74%</div>
            <p style={{ color: C.textMuted, marginTop: '8px' }}>
              Increase in thermogenesis — burning stored fat continuously,{' '}
              <strong style={{ color: C.textPrimary }}>even while sleeping</strong>.
            </p>
          </div>

          <h3 style={{ color: C.textPrimary, fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>
            What Is Thermogenesis?
          </h3>
          <p style={{ color: C.textMuted, lineHeight: 1.85 }}>
            Thermogenesis is your body&rsquo;s natural way of burning calories for energy. After age 35 it slows — especially
            in women — leading to weight gain, low energy, and stalled progress. The CitrusBurn™ formula{' '}
            <strong style={{ color: C.textPrimary }}>activates fat-burning at the source</strong> with botanicals that
            support thermogenesis and break the cycle.
          </p>
        </div>

        {/* Product intro + badges */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem',
            fontWeight: 900, color: C.textPrimary, marginBottom: '12px' }}>
            That&rsquo;s Why We Created CitrusBurn™
          </h3>
          <p style={{ color: C.textMuted, maxWidth: '660px', margin: '0 auto 28px', lineHeight: 1.85 }}>
            CitrusBurn™ is a 100% natural breakthrough designed to reignite your metabolism — without harsh stimulants,
            injections, or crash diets. A science-backed blend of{' '}
            <strong style={{ color: C.orange }}>7 rare botanicals</strong> shown to optimize the body&rsquo;s natural
            fat-burning capacity, even while you sleep.
          </p>

          {/* Certification badges — single clean row */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '32px' }}>
            {[
              { icon: '🌱', label: '100% Natural' },
              { icon: '🚫', label: 'Non-GMO' },
              { icon: '⚡', label: 'Stimulant-Free' },
              { icon: '🏭', label: 'FDA-Registered' },
              { icon: '✅', label: 'GMP Certified' },
              { icon: '🇺🇸', label: 'Made in USA' },
            ].map((b) => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(249,115,22,.06)', border: '1px solid rgba(249,115,22,.22)',
                borderRadius: '100px', padding: '6px 14px' }}>
                <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
                <span style={{ color: C.orange, fontSize: '0.72rem', fontWeight: 700 }}>{b.label}</span>
              </div>
            ))}
          </div>

          <img src={IMG('s3icons.png')} alt="Certification icons"
            style={{ maxWidth: '380px', width: '100%', height: 'auto', opacity: 0.75 }}
            onError={(e) => imgError(e, 380, 80, 'FDA · GMP · Non-GMO · Plant-Based', '0a0a0a', '5a5a5a')} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// INGREDIENTS — 3-column glassmorphism grid
// ---------------------------------------------------------------------------
const INGREDIENTS = [
  { icon: 's8licon1.png', name: 'Seville Orange Peel',   sub: '(p-synephrine)',  stat: 'Primary Thermogenic', benefit: 'Supports thermogenesis and burns fat fast',           color: C.orange },
  { icon: 's8licon2.png', name: 'Spanish Apple Vinegar', sub: '',                stat: 'Appetite Control',    benefit: 'Promotes fullness and curbs overeating',              color: '#e85d04' },
  { icon: 's8licon3.png', name: 'Andalusian Red Pepper', sub: '',                stat: '+25% Calorie Burn',   benefit: 'Increases post-meal calorie burn by 25%',             color: C.red    },
  { icon: 's8licon4.png', name: 'Himalayan Ginger',      sub: '',                stat: '54% Craving Reduction',benefit: 'Reduces cravings by 54%, supports blood sugar',     color: '#f59e0b' },
  { icon: 's8licon5.png', name: 'Ceremonial Green Tea',  sub: '',                stat: 'Fat Oxidation',       benefit: 'Enhances fat oxidation and sustained energy',         color: '#22c55e' },
  { icon: 's8licon6.png', name: 'Berberine',             sub: '',                stat: 'Metabolic Regulator', benefit: 'Supports healthy metabolic & hormonal balance',       color: C.gold   },
  { icon: 's8licon1.png', name: 'Korean Red Ginseng',    sub: '',                stat: 'Hormone Optimizer',   benefit: 'Balances hormones for optimal metabolic function',    color: '#a78bfa' },
];

function IngredientsSection() {
  return (
    <section id="ingredients" style={{ background: C.bgElevated, padding: '96px 20px',
      borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <SectionTag color={C.orange}>THE SPANISH FAT-MELTING FORMULA</SectionTag>
          <SectionTitle>7 Rare Botanicals Inside Every Capsule</SectionTitle>
          <p style={{ color: C.textMuted, maxWidth: '580px', margin: '0 auto' }}>
            Each ingredient is sourced from elite botanical regions and standardized for maximum bioavailability.
          </p>
        </div>

        {/* 3-column grid, glassmorphism */}
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px' }}>
          {INGREDIENTS.map((ing) => (
            <div key={ing.name} className="glass-card" style={{ borderRadius: '16px', padding: '26px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,160,23,.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={IMG(ing.icon)} alt={ing.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                    onError={(e) => imgError(e, 28, 28, ing.name[0], '1a1a1a', 'd4a017')} />
                </div>
                <div>
                  <h3 style={{ color: C.textPrimary, fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>{ing.name}</h3>
                  {ing.sub && <p style={{ color: C.textMuted, fontSize: '0.72rem', margin: '2px 0 0' }}>{ing.sub}</p>}
                </div>
              </div>
              <div style={{ display: 'inline-block', background: `${ing.color}18`,
                color: ing.color, fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px',
                borderRadius: '100px', marginBottom: '10px', letterSpacing: '.04em' }}>
                {ing.stat}
              </div>
              <p style={{ color: C.textMuted, fontSize: '0.84rem', lineHeight: 1.65, margin: 0 }}>{ing.benefit}</p>
            </div>
          ))}
        </div>

        {/* Mobile: collapse to 1-column via inline responsive style */}
        <style>{`
          @media (max-width: 768px) {
            #ingredients-grid { grid-template-columns: 1fr !important; }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            #ingredients-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
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
    quote: "The late-night eating was killing me. CitrusBurn™ made the difference almost immediately. I dropped 17 pounds, my doctor noticed improved wellness markers, and I'm not falling asleep at my desk by 3pm. I feel younger than I have in a decade." },
  { photo: 'testi-3-min.png', name: 'Elizabeth V.', age: 62, location: 'Boise, ID', lost: '14 lbs',
    quote: "I used to wake up foggy and dragging. Now I take CitrusBurn™ with water in the morning and within 30 minutes I'm moving with purpose. I've lost 14 pounds and I'm back to being the version of myself I actually like." },
];

function TestimonialsSection() {
  return (
    <section style={{ background: 'linear-gradient(180deg,#0a0a0a,#0f0700)', padding: '96px 20px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <SectionTag color={C.orange}>REAL CITRUSBURN™ USERS · REAL RESULTS</SectionTag>
          <SectionTitle>Life-Changing Results From Real People</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Stars />
            <span style={{ color: C.textMuted, fontSize: '0.88rem' }}>
              Average rating: <strong style={{ color: C.textPrimary }}>4.9/5</strong> · 73,000+ verified reviews
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{ background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: '16px', padding: '28px 24px', flex: '1 1 290px', maxWidth: '340px',
              position: 'relative', boxShadow: '0 4px 30px rgba(249,115,22,.12)' }}>
              <div style={{ position: 'absolute', top: '18px', right: '22px', fontSize: '3rem',
                color: C.orange, opacity: 0.15, lineHeight: 1, fontFamily: 'Georgia, serif' }}>&rdquo;</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <img src={IMG(t.photo)} alt={t.name}
                  style={{ width: '58px', height: '58px', borderRadius: '50%',
                    objectFit: 'cover', border: `2px solid ${C.orange}`, flexShrink: 0 }}
                  onError={(e) => imgError(e, 58, 58, t.name[0], '1a1a1a', 'f97316')} />
                <div>
                  <div style={{ fontWeight: 700, color: C.textPrimary, fontSize: '0.95rem' }}>{t.name}, age {t.age}</div>
                  <div style={{ color: C.textMuted, fontSize: '0.78rem' }}>{t.location} · Verified Purchase</div>
                  <Stars />
                </div>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)',
                borderRadius: '100px', padding: '2px 10px', marginBottom: '12px' }}>
                <span style={{ color: C.green, fontSize: '0.78rem', fontWeight: 700 }}>Lost {t.lost}</span>
              </div>

              <p style={{ color: C.textMuted, fontSize: '0.875rem', lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '52px' }}>
          <CTAButton label="JOIN THOUSANDS — CLAIM YOUR DISCOUNT" size="lg" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TRUST STRIP — clean uniform certification row
// ---------------------------------------------------------------------------
function TrustStrip() {
  return (
    <section style={{ background: C.bgElevated, padding: '24px 20px',
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex',
        justifyContent: 'center', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        {[
          { icon: '🏭', label: 'FDA-Registered Facility' },
          { icon: '✅', label: 'GMP Certified'            },
          { icon: '🌱', label: '100% Plant-Based'         },
          { icon: '🚫', label: 'Non-GMO & Gluten Free'    },
          { icon: '🇺🇸', label: 'Made in USA'             },
          { icon: '💳', label: 'One-Time Payment'         },
        ].map((b) => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '7px',
            padding: '6px 14px', background: 'rgba(255,255,255,.02)',
            border: `1px solid ${C.border}`, borderRadius: '100px' }}>
            <span style={{ fontSize: '1rem' }}>{b.icon}</span>
            <span style={{ color: C.textMuted, fontSize: '0.78rem', fontWeight: 600 }}>{b.label}</span>
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
    a: "If you're struggling with stubborn weight, low energy, or a sluggish metabolism — especially after 40 — CitrusBurn™ was made for you. It's designed for both men and women seeking natural metabolic support." },
  { q: 'Is CitrusBurn™ safe?',
    a: 'CitrusBurn™ is manufactured in an FDA-registered, GMP-certified US facility. Every ingredient is 100% plant-based, soy-free, dairy-free, and non-GMO, with third-party quality testing on every batch. Always consult your physician before starting a new supplement.' },
  { q: 'How many bottles should I order?',
    a: 'We recommend the 6-bottle package. Most customers experience noticeable changes after 6–12 weeks of consistent use. The 6-pack also includes free shipping and both digital bonuses.' },
  { q: "What's the best way to take CitrusBurn™?",
    a: 'Take 1 capsule daily with a full glass of water, ideally in the morning before breakfast. Consistency is key.' },
  { q: 'Is this a one-time payment?',
    a: "Yes. No hidden charges, subscriptions, or automatic re-bills — ever." },
  { q: "What if it doesn't work for me?",
    a: "You're covered by our 180-day money-back guarantee. If you're not thrilled with your results, contact support for a full refund. No questions asked." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ background: C.bgPrimary, padding: '96px 20px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: C.bgCard,
                border: `1px solid ${isOpen ? C.orange : C.border}`,
                borderRadius: '12px', overflow: 'hidden', transition: 'border-color .2s' }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: '100%', padding: '18px 24px', background: 'transparent', border: 'none',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                  <span style={{ color: C.textPrimary, fontWeight: 600, fontSize: '0.92rem', flex: 1 }}>{faq.q}</span>
                  <span style={{ color: C.orange, fontSize: '1.4rem', lineHeight: 1, flexShrink: 0,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s' }}>+</span>
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}
                  style={{ padding: isOpen ? '0 24px 18px' : '0 24px 0' }}>
                  <p style={{ color: C.textMuted, lineHeight: 1.8, fontSize: '0.88rem', margin: 0 }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <CTAButton label="ORDER NOW & SAVE 75%" size="lg" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FOOTER — clean, consolidated
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer style={{ background: '#050505', borderTop: `1px solid ${C.border}`, padding: '48px 20px 28px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={IMG('logo.png')} alt="CitrusBurn™" style={{ height: '34px', opacity: 0.65 }}
            onError={(e) => imgError(e, 140, 34, 'CitrusBurn', '050505', '5a5a5a')} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px',
          flexWrap: 'wrap', marginBottom: '28px' }}>
          {['Terms','Privacy','Order Support','Returns & Refunds','Track My Order'].map((l) => (
            <a key={l} href={AFFILIATE_LINK} style={{ color: '#4a4a4a', fontSize: '0.78rem' }}
              rel="nofollow noopener" target="_blank">{l}</a>
          ))}
        </div>

        <div style={{ borderTop: `1px solid #1a1a1a`, paddingTop: '24px',
          display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Three disclaimer paragraphs consolidated into one clean block */}
          <p style={{ color: '#444', fontSize: '0.7rem', lineHeight: 1.8, textAlign: 'center', margin: 0 }}>
            These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Results may vary. The testimonials shown are from real customers; individual results are not guaranteed.
            If you are pregnant, nursing, taking medication, or have a medical condition, consult your physician before use.
            This site contains affiliate links and the publisher may receive compensation for purchases made through those links.
          </p>
          <p style={{ color: '#333', fontSize: '0.7rem', lineHeight: 1.7, textAlign: 'center', margin: 0 }}>
            ClickBank® is a registered trademark of Click Sales, Inc. (1444 S. Entertainment Ave., Suite 410, Boise, ID 83709).
            ClickBank&rsquo;s role as retailer does not constitute endorsement of these products.
          </p>
          <p style={{ color: '#2a2a2a', fontSize: '0.68rem', textAlign: 'center', marginTop: '6px' }}>
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
      <StickyOrderBar />
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
