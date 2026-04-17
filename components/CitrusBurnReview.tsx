'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------------
const AFFILIATE_LINK = 'https://d2dc49u948m5po32yfulzx1o0m.hop.clickbank.net';
const TIMER_MINUTES = 9;
const TIMER_SECONDS = 59;

// Image base path — if you place the assets in /public/citrusburns/ adjust here
const IMG = (file: string) => `/${file}`;

// ---------------------------------------------------------------------------
// DESIGN TOKENS (inline style helpers)
// ---------------------------------------------------------------------------
const C = {
  bgPrimary: '#0a0a0a',
  bgCard: '#111111',
  bgElevated: '#1a1a1a',
  orange: '#f97316',
  orangeHover: '#ea6c0a',
  gold: '#d4a017',
  goldLight: '#f0c040',
  textPrimary: '#f5f5f5',
  textMuted: '#a8a29e',
  border: '#2a2a2a',
  borderGold: '#d4a017',
  red: '#ef4444',
};

// ---------------------------------------------------------------------------
// INLINE GLOBAL STYLES (animations — avoids needing tailwind.config changes)
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      background-color: #0a0a0a;
      color: #f5f5f5;
      font-family: 'Inter', sans-serif;
      margin: 0;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.3); }
      50% { box-shadow: 0 0 40px rgba(249,115,22,0.7); }
    }
    @keyframes badge-bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes ticker-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .pulse-dot { animation: pulse-dot 1.2s ease-in-out infinite; }
    .glow-btn { animation: glow-pulse 2s ease-in-out infinite; }
    .badge-bounce { animation: badge-bounce 2.5s ease-in-out infinite; }
    .fade-in-up { animation: fade-in-up 0.6s ease-out both; }
    .ticker-blink { animation: ticker-blink 1.5s ease-in-out infinite; }

    .shimmer-text {
      background: linear-gradient(90deg, #d4a017 0%, #f0c040 40%, #d4a017 60%, #f0c040 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }

    .card-gold-border {
      border: 1px solid #d4a017;
      box-shadow: 0 0 30px rgba(212,160,23,0.15), inset 0 0 30px rgba(212,160,23,0.03);
    }
    .card-orange-glow {
      box-shadow: 0 4px 30px rgba(249,115,22,0.2);
    }

    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #f97316 0%, #ea6c0a 100%);
      color: #fff;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      text-decoration: none;
      text-align: center;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(249,115,22,0.5);
    }
    .btn-primary:active { transform: translateY(0); }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease, padding 0.35s ease;
    }
    .faq-answer.open { max-height: 500px; }

    .most-popular-card {
      position: relative;
      border: 2px solid #d4a017 !important;
      box-shadow: 0 0 40px rgba(212,160,23,0.25), 0 0 80px rgba(212,160,23,0.1);
      transform: scale(1.03);
    }

    .ingredient-card:hover {
      border-color: #f97316 !important;
      transform: translateY(-3px);
      transition: all 0.2s;
    }

    .sticky-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #0a0a0a;
      border-bottom: 1px solid #d4a017;
    }

    @media (max-width: 768px) {
      .most-popular-card { transform: scale(1); }
      .hide-mobile { display: none !important; }
      .show-mobile { display: block !important; }
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
  const totalSecs = initMin * 60 + initSec;
  const [seconds, setSeconds] = useState(totalSecs);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? totalSecs : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [totalSecs]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// ---------------------------------------------------------------------------
// STAR RATING
// ---------------------------------------------------------------------------
function Stars({ count = 5 }: { count?: number }) {
  return (
    <span style={{ color: C.gold, fontSize: '1rem', letterSpacing: '2px' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// CTA BUTTON
// ---------------------------------------------------------------------------
function CTAButton({
  label = 'BUY NOW — CLAIM DISCOUNT',
  size = 'md',
  className = '',
}: {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const padding =
    size === 'lg' ? '18px 48px' : size === 'sm' ? '10px 24px' : '14px 36px';
  const fontSize =
    size === 'lg' ? '1.2rem' : size === 'sm' ? '0.85rem' : '1rem';

  return (
    <a
      href={AFFILIATE_LINK}
      className={`btn-primary glow-btn ${className}`}
      style={{ padding, fontSize, borderRadius: '8px', display: 'inline-block' }}
      rel="nofollow noopener"
      target="_blank"
    >
      {label} →
    </a>
  );
}

// ---------------------------------------------------------------------------
// SECTION: STICKY ORDER BAR
// ---------------------------------------------------------------------------
function StickyOrderBar() {
  const timer = useCountdown(TIMER_MINUTES, TIMER_SECONDS);
  return (
    <div className="sticky-bar" style={{ padding: '10px 20px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            className="pulse-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: C.red,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>
            SALE ENDS IN:
          </span>
          <span
            className="ticker-blink"
            style={{
              color: C.orange,
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: 'monospace',
            }}
          >
            {timer}
          </span>
          <span
            className="hide-mobile"
            style={{ color: C.textMuted, fontSize: '0.8rem' }}
          >
            | 🔥 75% OFF + FREE Shipping on 6-Bottle Pack | Stock Level:{' '}
            <span style={{ color: C.red, fontWeight: 700 }}>LOW</span>
          </span>
        </div>
        <a
          href={AFFILIATE_LINK}
          className="btn-primary"
          style={{ padding: '8px 20px', fontSize: '0.85rem', borderRadius: '6px', flexShrink: 0 }}
          rel="nofollow noopener"
          target="_blank"
        >
          ORDER NOW →
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION: NAV
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <nav
      style={{
        background: C.bgPrimary,
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px',
        marginTop: '45px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <img src={IMG('logo.png')} alt="CitrusBurn™" style={{ height: '40px' }} />
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {['Free Bonuses', 'About', 'Ingredients', 'FAQ'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(' ', '-')}`}
              style={{ color: C.textMuted, fontSize: '0.875rem', textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}
          <a
            href={AFFILIATE_LINK}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.8rem', borderRadius: '6px' }}
            rel="nofollow noopener"
            target="_blank"
          >
            ORDER NOW
          </a>
        </div>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// SECTION: HERO
// ---------------------------------------------------------------------------
function HeroSection() {
  return (
    <section
      style={{
        background: `linear-gradient(180deg, #0a0a0a 0%, #0f0a04 50%, #0a0a0a 100%)`,
        padding: '60px 20px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative glow blob */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        {/* Research badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212,160,23,0.1)',
            border: `1px solid ${C.gold}`,
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '24px',
          }}
        >
          <span style={{ color: C.gold, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            APRIL 2026 · NEW SCIENTIFIC BREAKTHROUGH
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: C.textPrimary,
            marginBottom: '16px',
          }}
        >
          The Citrus Secret{' '}
          <span className="shimmer-text">Everyone's Talking About!</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: C.textMuted,
            marginBottom: '32px',
            maxWidth: '680px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Burn More. Crave Less. Feel Great All Day with CitrusBurn™.
          <br />
          <span style={{ color: C.textPrimary, fontWeight: 600 }}>
            Harvard & Barcelona researchers finally revealed why diets fail after 35 —
            and the 7-botanical fix that changes everything.
          </span>
        </p>

        {/* Rating strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '32px',
          }}
        >
          <Stars />
          <span style={{ color: C.textMuted, fontSize: '0.9rem' }}>
            4.9/5 · <strong style={{ color: C.textPrimary }}>73,000+</strong> Verified Reviews
          </span>
        </div>

        {/* Product image */}
        <div style={{ marginBottom: '32px' }}>
          <img
            src={IMG('s6prd.png')}
            alt="CitrusBurn™ — 6 Bottle Pack"
            className="show-mobile"
            style={{ maxWidth: '100%', height: 'auto', margin: '0 auto', display: 'block' }}
          />
          <img
            src={IMG('s6prd.png')}
            alt="CitrusBurn™ — 6 Bottle Pack"
            className="hide-mobile"
            style={{ maxWidth: '520px', height: 'auto', margin: '0 auto', display: 'block' }}
          />
        </div>

        {/* Micro testimonials */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '36px',
          }}
        >
          {[
            { quote: 'I can actually see the results! Finally something that actually works!', name: 'Joanne P.', tag: 'Verified Buyer' },
            { quote: 'More energy, better sleep, and I didn\'t change my diet.', name: 'Sam L.', tag: 'Verified Buyer' },
          ].map((t) => (
            <div
              key={t.name}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '16px 20px',
                maxWidth: '340px',
                textAlign: 'left',
              }}
            >
              <Stars count={5} />
              <p style={{ color: C.textPrimary, fontSize: '0.9rem', margin: '8px 0 4px', fontStyle: 'italic' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <span style={{ color: C.orange, fontSize: '0.8rem', fontWeight: 600 }}>
                — {t.name} · {t.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Hero CTA */}
        <CTAButton label="CLAIM YOUR DISCOUNTED CITRUSBURNTODAY" size="lg" />
        <p style={{ color: C.textMuted, fontSize: '0.8rem', marginTop: '12px' }}>
          🔒 Secure Checkout · 180-Day Money-Back Guarantee · One-Time Payment
        </p>

        {/* Press logos strip */}
        <div style={{ marginTop: '40px', opacity: 0.6 }}>
          <p style={{ color: C.textMuted, fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '12px' }}>
            AS FEATURED IN
          </p>
          <img
            src={IMG('s11logos.png')}
            alt="Press logos"
            className="hide-mobile"
            style={{ maxWidth: '560px', height: 'auto', margin: '0 auto', display: 'block', filter: 'grayscale(100%) brightness(2)' }}
          />
          <img
            src={IMG('s11logos-mob.png')}
            alt="Press logos"
            className="show-mobile"
            style={{ maxWidth: '100%', height: 'auto', margin: '0 auto', display: 'block', filter: 'grayscale(100%) brightness(2)' }}
          />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: URGENCY BANNER
// ---------------------------------------------------------------------------
function UrgencyBanner() {
  const timer = useCountdown(TIMER_MINUTES, TIMER_SECONDS);
  return (
    <section
      style={{
        background: 'linear-gradient(90deg, #1a0800 0%, #2d1200 50%, #1a0800 100%)',
        borderTop: `1px solid rgba(249,115,22,0.3)`,
        borderBottom: `1px solid rgba(249,115,22,0.3)`,
        padding: '16px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          flexWrap: 'wrap',
          textAlign: 'center',
        }}
      >
        {/* Status blocks */}
        {[
          {
            label: 'SALE STATUS',
            value: 'LIVE',
            valueColor: '#22c55e',
            icon: '●',
            iconAnim: 'pulse-dot',
          },
          {
            label: 'STOCK LEVEL',
            value: 'LOW',
            valueColor: C.red,
            icon: '⚠',
            iconAnim: '',
          },
          {
            label: 'SPOT RESERVED FOR',
            value: timer,
            valueColor: C.orange,
            icon: '⏱',
            iconAnim: 'ticker-blink',
          },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span style={{ color: C.textMuted, fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 600 }}>
              {item.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                className={item.iconAnim}
                style={{ color: item.valueColor, fontSize: '0.9rem' }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  color: item.valueColor,
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  fontFamily: item.label === 'SPOT RESERVED FOR' ? 'monospace' : 'inherit',
                }}
              >
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
function PricingCard({
  label,
  bottles,
  duration,
  perBottle,
  total,
  originalTotal,
  savings,
  bonuses,
  shipping,
  highlighted,
  packageImg,
}: {
  label: string;
  bottles: number;
  duration: string;
  perBottle: number;
  total: number;
  originalTotal: number;
  savings: number;
  bonuses: boolean;
  shipping: string;
  highlighted?: boolean;
  packageImg: string;
}) {
  return (
    <div
      className={highlighted ? 'most-popular-card' : ''}
      style={{
        background: highlighted ? 'linear-gradient(180deg, #1a1000 0%, #111111 100%)' : C.bgCard,
        border: highlighted ? '2px solid #d4a017' : `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '28px 24px',
        flex: '1 1 300px',
        maxWidth: '360px',
        position: 'relative',
        transition: 'transform 0.2s',
      }}
    >
      {highlighted && (
        <div
          className="badge-bounce"
          style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
            color: '#000',
            fontWeight: 900,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            padding: '5px 18px',
            borderRadius: '100px',
            whiteSpace: 'nowrap',
          }}
        >
          ★ MOST POPULAR · BEST VALUE ★
        </div>
      )}

      {/* Label */}
      <p style={{ color: highlighted ? C.gold : C.textMuted, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>
        {label}
      </p>

      {/* Title */}
      <h3 style={{ color: C.textPrimary, fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>
        {bottles} Bottles
      </h3>
      <p style={{ color: C.textMuted, fontSize: '0.85rem', marginBottom: '20px' }}>
        {duration} Supply
      </p>

      {/* Package image */}
      <img
        src={IMG(packageImg)}
        alt={`${bottles}-bottle pack`}
        style={{ width: '140px', height: 'auto', display: 'block', margin: '0 auto 20px' }}
      />

      {/* Price */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: highlighted ? C.gold : C.orange,
              lineHeight: 1,
            }}
          >
            ${perBottle}
          </span>
          <span style={{ color: C.textMuted, fontSize: '0.9rem' }}>/ bottle</span>
        </div>
        <div style={{ marginTop: '4px' }}>
          <span
            style={{
              textDecoration: 'line-through',
              color: C.textMuted,
              fontSize: '0.95rem',
              marginRight: '8px',
            }}
          >
            ${originalTotal}
          </span>
          <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: '1.1rem' }}>${total}</span>
        </div>
        <p style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>
          You Save: ${savings}!
        </p>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          bonuses && '2 FREE Digital Bonuses',
          shipping === 'free' && 'Free USA Shipping',
          shipping !== 'free' && '+ Shipping',
          '180-Day Money-Back Guarantee',
        ]
          .filter(Boolean)
          .map((feat) => (
            <li key={String(feat)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: C.textPrimary }}>
              <span style={{ color: '#22c55e', fontSize: '1rem' }}>✓</span> {feat}
            </li>
          ))}
      </ul>

      {/* CTA */}
      <a
        href={AFFILIATE_LINK}
        className={`btn-primary ${highlighted ? 'glow-btn' : ''}`}
        style={{
          display: 'block',
          width: '100%',
          padding: '16px',
          fontSize: '1rem',
          borderRadius: '8px',
          background: highlighted
            ? `linear-gradient(135deg, ${C.gold}, ${C.orange})`
            : `linear-gradient(135deg, ${C.orange}, ${C.orangeHover})`,
        }}
        rel="nofollow noopener"
        target="_blank"
      >
        BUY NOW
      </a>

      {highlighted && (
        <p style={{ color: C.gold, fontSize: '0.75rem', textAlign: 'center', marginTop: '8px', fontWeight: 600 }}>
          BIGGEST DISCOUNT · FREE BONUSES INCLUDED
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SECTION: PRICING
// ---------------------------------------------------------------------------
function PricingSection({ id }: { id?: string }) {
  const timer = useCountdown(TIMER_MINUTES, TIMER_SECONDS);
  return (
    <section
      id={id}
      style={{ background: C.bgPrimary, padding: '60px 20px' }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '100px',
              padding: '6px 16px',
              marginBottom: '16px',
            }}
          >
            <span
              className="pulse-dot"
              style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.red, display: 'inline-block' }}
            />
            <span style={{ color: C.red, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
              STOCK LEVEL: LOW — SPOT RESERVED FOR{' '}
              <span style={{ fontFamily: 'monospace' }}>{timer}</span>
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 900,
              color: C.textPrimary,
              marginBottom: '8px',
            }}
          >
            Claim Your Discounted CitrusBurn™ Below
          </h2>
          <p style={{ color: C.textMuted, fontSize: '1rem' }}>
            While Stock Lasts — Order 6 Bottles and Join 96% of Customers Who Choose the Best-Value Pack
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            marginTop: '40px',
          }}
        >
          <PricingCard
            label="BASIC"
            bottles={2}
            duration="60 Day"
            perBottle={79}
            total={158}
            originalTotal={398}
            savings={240}
            bonuses={false}
            shipping="+ Shipping"
            packageImg="pkg1.png"
          />
          <PricingCard
            label="BUNDLE"
            bottles={3}
            duration="90 Day"
            perBottle={69}
            total={207}
            originalTotal={597}
            savings={390}
            bonuses={true}
            shipping="+ Shipping"
            packageImg="pkg2.png"
          />
          <PricingCard
            label="MOST POPULAR"
            bottles={6}
            duration="180 Day"
            perBottle={49}
            total={294}
            originalTotal={1194}
            savings={900}
            bonuses={true}
            shipping="free"
            highlighted={true}
            packageImg="pkg3.png"
          />
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '36px',
            alignItems: 'center',
          }}
        >
          <img src={IMG('mbseal.png')} alt="180-Day Guarantee" style={{ height: '80px' }} />
          <img src={IMG('bestseller-seal.png')} alt="Best Seller" style={{ height: '60px' }} />
          <img src={IMG('shipping-seal.png')} alt="Free Shipping" style={{ height: '60px' }} />
          <img src={IMG('cards.png')} alt="Secure Payment" style={{ height: '36px' }} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: GUARANTEE
// ---------------------------------------------------------------------------
function GuaranteeSection() {
  return (
    <section style={{ background: C.bgCard, padding: '60px 20px', borderTop: `1px solid ${C.border}` }}>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          gap: '36px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <img src={IMG('mbseal.png')} alt="180-Day Money-Back Guarantee" style={{ width: '160px', flexShrink: 0 }} />
        <div style={{ flex: '1 1 300px', textAlign: 'left' }}>
          <h2
            style={{
              color: C.gold,
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            180-Day · 100% Satisfaction Guarantee
          </h2>
          <p style={{ color: C.textPrimary, lineHeight: 1.8, marginBottom: '12px' }}>
            Your order is protected by our no-risk 180-day 100% money-back guarantee. If you're not amazed at how quickly your body feels lighter, more energized, and visibly transformed — or if you're not thrilled by how your metabolism responds — just let us know within the next 180 days and we'll refund every cent of your purchase.
          </p>
          <p style={{ color: C.gold, fontWeight: 700, fontSize: '1rem' }}>
            No questions asked. Zero risk to you.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: BONUS
// ---------------------------------------------------------------------------
function BonusSection() {
  return (
    <section id="free-bonuses" style={{ background: C.bgPrimary, padding: '60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212,160,23,0.1)',
            border: `1px solid ${C.gold}`,
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '16px',
          }}
        >
          <span style={{ color: C.gold, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
            🎁 ORDER 3 OR 6 BOTTLES AND GET
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 900,
            color: C.textPrimary,
            marginBottom: '8px',
          }}
        >
          2 FREE Digital Bonuses
        </h2>
        <p style={{ color: C.textMuted, marginBottom: '40px' }}>
          A combined $114 value — yours FREE when you choose the 3 or 6 bottle pack
        </p>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            {
              img: 'bonus1.png',
              num: '#1',
              title: 'Spanish Rapid Detox Protocol',
              value: '$67',
              desc: 'Keep out toxins and support thermogenesis with this 15-day Mediterranean cleanse using simple, powerful ingredients from your kitchen. Designed to jumpstart your results and keep you at your peak.',
            },
            {
              img: 'bonus2.png',
              num: '#2',
              title: 'Mind Over Metabolism Mastery',
              value: '$47',
              desc: 'Rewire your mindset with daily 5-minute visualization and craving-reset techniques. This guide helps reduce emotional eating, boost motivation, and lock in long-term transformation.',
            },
          ].map((bonus) => (
            <div
              key={bonus.num}
              className="card-gold-border"
              style={{
                background: C.bgCard,
                borderRadius: '16px',
                padding: '28px 24px',
                flex: '1 1 300px',
                maxWidth: '400px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  background: 'rgba(212,160,23,0.1)',
                  border: `1px solid ${C.gold}`,
                  borderRadius: '8px',
                  display: 'inline-block',
                  padding: '3px 10px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ color: C.gold, fontSize: '0.75rem', fontWeight: 700 }}>
                  FREE BONUS {bonus.num}
                </span>
              </div>
              <img
                src={IMG(bonus.img)}
                alt={bonus.title}
                style={{ width: '100%', maxWidth: '200px', height: 'auto', display: 'block', margin: '0 auto 16px' }}
              />
              <h3 style={{ color: C.textPrimary, fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>
                {bonus.title}
              </h3>
              <p style={{ color: C.gold, fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>
                Value: {bonus.value} — Yours 100% FREE
              </p>
              <p style={{ color: C.textMuted, fontSize: '0.875rem', lineHeight: 1.7 }}>
                {bonus.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '36px' }}>
          <CTAButton label="GET FREE BONUSES + CLAIM DISCOUNT" size="lg" />
          <p style={{ color: C.textMuted, fontSize: '0.8rem', marginTop: '10px' }}>
            Get Free Shipping when you order 6 bottles
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: SCIENCE
// ---------------------------------------------------------------------------
function ScienceSection() {
  return (
    <section
      id="about"
      style={{
        background: `linear-gradient(180deg, #0a0a0a 0%, #050800 100%)`,
        padding: '70px 20px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Tag */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(249,115,22,0.08)',
              border: `1px solid rgba(249,115,22,0.3)`,
              borderRadius: '100px',
              padding: '6px 16px',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: C.orange, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
              HARVARD & BARCELONA RESEARCH · APRIL 2026
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 900,
              color: C.textPrimary,
              marginBottom: '12px',
            }}
          >
            Scientists Reveal the Hidden Cause of Slow Metabolism
          </h2>
          <p style={{ color: C.textMuted, fontSize: '1.1rem' }}>
            And it's <em>not</em> your age, diet, or willpower.
          </p>
        </div>

        {/* Content card */}
        <div
          style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: '20px',
            padding: '40px 36px',
            marginBottom: '32px',
          }}
        >
          <p style={{ color: C.textPrimary, lineHeight: 1.9, marginBottom: '20px', fontSize: '1rem' }}>
            New studies show the real reason most people struggle to lose weight — especially after 35 — is something called{' '}
            <strong style={{ color: C.orange }}>Thermogenic Resistance</strong>. This condition prevents your metabolism from entering a natural fat-burning state known as{' '}
            <strong style={{ color: C.textPrimary }}>thermogenesis</strong>, even if you're eating well or exercising.
          </p>

          {/* Pull quote */}
          <div
            style={{
              borderLeft: `4px solid ${C.orange}`,
              paddingLeft: '20px',
              margin: '24px 0',
            }}
          >
            <p style={{ color: C.textPrimary, fontSize: '1.1rem', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.7 }}>
              &ldquo;It's like flipping a switch that tells your body to burn fat, automatically.&rdquo;
            </p>
            <span style={{ color: C.textMuted, fontSize: '0.85rem' }}>— Dr. Reeves, Lead Researcher</span>
          </div>

          <p style={{ color: C.textPrimary, lineHeight: 1.9, marginBottom: '24px' }}>
            Research from <strong style={{ color: C.gold }}>Harvard</strong>, <strong style={{ color: C.gold }}>Mayo Clinic</strong>, and the{' '}
            <strong style={{ color: C.gold }}>University of Barcelona</strong> shows a rare compound found in the peel of Seville oranges can break through Thermogenic Resistance — increasing thermogenesis by up to:
          </p>

          {/* Stat callout */}
          <div
            style={{
              textAlign: 'center',
              padding: '28px',
              background: 'rgba(212,160,23,0.05)',
              border: `1px solid rgba(212,160,23,0.2)`,
              borderRadius: '16px',
              marginBottom: '24px',
            }}
          >
            <div className="shimmer-text" style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
              74%
            </div>
            <p style={{ color: C.textMuted, marginTop: '8px' }}>
              Increase in thermogenesis — allowing your body to burn stored fat continuously,{' '}
              <strong style={{ color: C.textPrimary }}>even while sleeping</strong>.
            </p>
          </div>

          <h3 style={{ color: C.textPrimary, fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px' }}>
            What Is Thermogenesis?
          </h3>
          <p style={{ color: C.textMuted, lineHeight: 1.8 }}>
            Thermogenesis is your body's natural way of burning calories for energy. It powers everything from digestion and movement to body temperature and fat metabolism. But after age 35, thermogenesis slows — especially in women — leading to weight gain, low energy, and stalled progress. The good news? The CitrusBurn™ formula <strong style={{ color: C.textPrimary }}>activates fat-burning at the source</strong> with scientifically researched botanicals that support thermogenesis and break the cycle.
          </p>
        </div>

        {/* Product intro */}
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              fontWeight: 900,
              color: C.textPrimary,
              marginBottom: '12px',
            }}
          >
            That's Why We Created CitrusBurn™
          </h3>
          <p style={{ color: C.textMuted, maxWidth: '680px', margin: '0 auto 16px', lineHeight: 1.8 }}>
            CitrusBurn™ is a 100% natural breakthrough designed to reignite your metabolism — without harsh stimulants, injections, or crash diets. It's one of the only supplements in the world with a science-backed blend of{' '}
            <strong style={{ color: C.orange }}>7 rare botanicals</strong> scientifically shown to help optimize the body's natural fat-burning capacity, naturally — even while you sleep.
          </p>

          {/* Product badges */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '24px',
              marginBottom: '36px',
            }}
          >
            {[
              '100% Natural Formula',
              'Plant-Based Ingredients',
              'Non-GMO & Gluten Free',
              'Stimulant-Free & Jitter-Free',
              'Non-Habit Forming',
              'FDA-Registered Facility',
              'GMP Certified',
            ].map((badge) => (
              <span
                key={badge}
                style={{
                  background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  color: C.orange,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '100px',
                }}
              >
                ✓ {badge}
              </span>
            ))}
          </div>

          <img src={IMG('s3icons.png')} alt="Certifications" style={{ maxWidth: '400px', width: '100%', height: 'auto', opacity: 0.8 }} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: INGREDIENTS
// ---------------------------------------------------------------------------
const INGREDIENTS = [
  {
    icon: 's8licon1.png',
    name: 'Seville Orange Peel',
    subtitle: '(p-synephrine)',
    benefit: 'Supports thermogenesis and burns fat fast',
    stat: 'Primary Thermogenic Activator',
    color: C.orange,
  },
  {
    icon: 's8licon2.png',
    name: 'Spanish Red Apple Vinegar',
    subtitle: '',
    benefit: 'Promotes a feeling of fullness and satiety',
    stat: 'Appetite Suppression',
    color: '#e85d04',
  },
  {
    icon: 's8licon3.png',
    name: 'Andalusian Red Pepper',
    subtitle: '',
    benefit: 'Increases calorie burn by 25% after meals',
    stat: '+25% Calorie Burn',
    color: C.red,
  },
  {
    icon: 's8licon4.png',
    name: 'Himalayan Mountain Ginger',
    subtitle: '',
    benefit: 'Reduces cravings by 54%, supports blood sugar',
    stat: '54% Craving Reduction',
    color: '#f59e0b',
  },
  {
    icon: 's8licon5.png',
    name: 'Ceremonial Green Tea',
    subtitle: '',
    benefit: 'Enhances fat oxidation and energy',
    stat: 'Fat Oxidation Booster',
    color: '#22c55e',
  },
  {
    icon: 's8licon6.png',
    name: 'Berberine',
    subtitle: '',
    benefit: 'Supports metabolic & hormonal balance',
    stat: 'Metabolic Regulator',
    color: C.gold,
  },
  {
    icon: 's8licon1.png',
    name: 'Korean Red Ginseng',
    subtitle: '',
    benefit: 'Metabolic & hormonal balance',
    stat: 'Hormone Optimizer',
    color: '#a78bfa',
  },
];

function IngredientsSection() {
  return (
    <section id="ingredients" style={{ background: C.bgElevated, padding: '70px 20px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: C.orange, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '8px' }}>
            THE SPANISH FAT-MELTING FORMULA
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 900,
              color: C.textPrimary,
              marginBottom: '12px',
            }}
          >
            7 Rare Botanicals Inside Every Capsule
          </h2>
          <p style={{ color: C.textMuted, maxWidth: '600px', margin: '0 auto' }}>
            Each ingredient is sourced from elite botanical regions and standardized for maximum bioavailability and potency.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {INGREDIENTS.map((ing) => (
            <div
              key={ing.name}
              className="ingredient-card"
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                padding: '24px 20px',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `rgba(${ing.color === C.orange ? '249,115,22' : '212,160,23'},0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img src={IMG(ing.icon)} alt={ing.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{ color: C.textPrimary, fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{ing.name}</h3>
                  {ing.subtitle && (
                    <p style={{ color: C.textMuted, fontSize: '0.75rem', margin: '2px 0 0' }}>{ing.subtitle}</p>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  background: `rgba(${ing.color === C.orange ? '249,115,22' : '212,160,23'},0.1)`,
                  color: ing.color,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  marginBottom: '10px',
                  letterSpacing: '0.05em',
                }}
              >
                {ing.stat}
              </div>
              <p style={{ color: C.textMuted, fontSize: '0.875rem', lineHeight: 1.6 }}>{ing.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: TESTIMONIALS
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    photo: 'testi-1-min.png',
    name: 'Tasha M.',
    age: 41,
    location: 'Austin, TX',
    lost: '22 lbs',
    rating: 5,
    quote:
      "I bought CitrusBurn™ on a whim. I've tried powders, shakes, and all the latest trends, but I wasn't expecting much. Within a week, I noticed my jeans were looser and my energy was stable all day. No jitters, no weird feelings. Just calm, steady progress. I've lost 22 pounds and feel in control for the first time in years.",
  },
  {
    photo: 'testi-2-min.png',
    name: 'Neil C.',
    age: 57,
    location: 'Asheville, NC',
    lost: '17 lbs',
    rating: 5,
    quote:
      "The late-night eating was killing me. CitrusBurn™ made the difference almost immediately. I'm not constantly thinking about food anymore. I've dropped 17 pounds, my doctor noticed my improved overall wellness markers, and I'm not falling asleep at my desk by 3pm. It's subtle, but powerful. I feel younger than I have in a decade.",
  },
  {
    photo: 'testi-3-min.png',
    name: 'Elizabeth V.',
    age: 62,
    location: 'Boise, ID',
    lost: '14 lbs',
    rating: 5,
    quote:
      "I used to wake up foggy, bloated, and dragging myself through the day. Now, I take CitrusBurn™ with water when I wake up and within 30 minutes I'm moving with purpose. I've lost 14 pounds, but more than that, I'm back to being the version of myself I actually like.",
  },
];

function TestimonialsSection() {
  return (
    <section
      style={{
        background: `linear-gradient(180deg, #0a0a0a 0%, #0f0700 100%)`,
        padding: '70px 20px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: C.orange, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '8px' }}>
            REAL CITRUSBURNUSERS · REAL RESULTS
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 900,
              color: C.textPrimary,
              marginBottom: '8px',
            }}
          >
            Life-Changing Results From Real People
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Stars />
            <span style={{ color: C.textMuted, fontSize: '0.9rem' }}>
              Average rating: <strong style={{ color: C.textPrimary }}>4.9/5</strong> · 73,000+ verified reviews
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card-orange-glow"
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                padding: '28px 24px',
                flex: '1 1 300px',
                maxWidth: '360px',
                position: 'relative',
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '24px',
                  fontSize: '3rem',
                  color: C.orange,
                  opacity: 0.2,
                  lineHeight: 1,
                  fontFamily: 'Georgia, serif',
                }}
              >
                &rdquo;
              </div>

              {/* Photo + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={IMG(t.photo)}
                  alt={t.name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.orange}` }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: C.textPrimary, fontSize: '1rem' }}>{t.name}, age {t.age}</div>
                  <div style={{ color: C.textMuted, fontSize: '0.8rem' }}>{t.location} · Verified Purchase</div>
                  <Stars count={t.rating} />
                </div>
              </div>

              {/* Lost badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '100px',
                  padding: '3px 12px',
                  marginBottom: '14px',
                }}
              >
                <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 700 }}>Lost {t.lost}</span>
              </div>

              <p style={{ color: C.textMuted, fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <CTAButton label="JOIN THOUSANDS — CLAIM YOUR DISCOUNT" size="lg" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: TRUST STRIP
// ---------------------------------------------------------------------------
function TrustStrip() {
  const badges = [
    { icon: '🏭', label: 'FDA-Registered Facility' },
    { icon: '✅', label: 'GMP Certified' },
    { icon: '🌱', label: '100% Plant-Based' },
    { icon: '🚫', label: 'Non-GMO & Gluten Free' },
    { icon: '🇺🇸', label: 'Made in USA' },
    { icon: '💳', label: 'One-Time Payment' },
  ];
  return (
    <section
      style={{
        background: C.bgElevated,
        padding: '28px 20px',
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        {badges.map((b) => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.1rem' }}>{b.icon}</span>
            <span style={{ color: C.textMuted, fontSize: '0.8rem', fontWeight: 600 }}>{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SECTION: FAQ
// ---------------------------------------------------------------------------
const FAQS = [
  {
    q: 'Is CitrusBurn™ right for me?',
    a: "If you're struggling with stubborn weight, low energy, or a sluggish metabolism — especially after 40 — CitrusBurn™ was made for you. It's designed for both men and women who want a natural way to support a healthier metabolic function and overall vitality.",
  },
  {
    q: 'Is CitrusBurn™ safe?',
    a: 'CitrusBurn™ is a natural, proprietary formula crafted in the USA. We manufacture it in our FDA-registered and GMP-certified facility using state-of-the-art, precision-engineered machinery under the strictest sterile standards. Every ingredient is 100% plant-based, soy-free, dairy-free, and non-GMO, and undergoes additional third-party inspections and quality control to guarantee the highest purity and potency. For your safety, we always recommend consulting your doctor before starting any new supplement.',
  },
  {
    q: 'How many bottles should I order?',
    a: 'We recommend starting with the 6-bottle package for the best results and value. Most customers experience noticeable changes after 6–12 weeks of consistent use. Plus, 6-bottle orders come with free shipping and both digital bonuses.',
  },
  {
    q: "What's the best way to take CitrusBurn™?",
    a: 'Take 1 easy-to-swallow capsule daily with a full glass of water, ideally in the morning before breakfast. Consistency is key — take it daily for the best metabolic support.',
  },
  {
    q: 'Is this a one-time payment?',
    a: "Yes. There are no hidden charges, subscriptions, or automatic re-bills. You make a one-time purchase and that's it.",
  },
  {
    q: "What if CitrusBurn™ doesn't work for me?",
    a: "We stand behind CitrusBurn™ with a 180-day money-back guarantee. If you're not thrilled with your results, just contact our customer support team and we'll refund your full purchase. No questions asked.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" style={{ background: C.bgPrimary, padding: '70px 20px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 900,
              color: C.textPrimary,
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${isOpen ? C.orange : C.border}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ color: C.textPrimary, fontWeight: 600, fontSize: '0.95rem', flex: 1 }}>
                    {faq.q}
                  </span>
                  <span
                    style={{
                      color: C.orange,
                      fontSize: '1.4rem',
                      lineHeight: 1,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                      transition: 'transform 0.25s',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`faq-answer ${isOpen ? 'open' : ''}`}
                  style={{ padding: isOpen ? '0 24px 20px' : '0 24px 0' }}
                >
                  <p style={{ color: C.textMuted, lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>{faq.a}</p>
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
// SECTION: FOOTER
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer
      style={{
        background: '#050505',
        borderTop: `1px solid ${C.border}`,
        padding: '40px 20px 24px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src={IMG('logo.png')} alt="CitrusBurn™" style={{ height: '36px', opacity: 0.7 }} />
        </div>

        {/* Links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
        >
          {['Terms', 'Privacy', 'Order Support', 'Returns & Refunds', 'Track My Order'].map((link) => (
            <a
              key={link}
              href={AFFILIATE_LINK}
              style={{ color: C.textMuted, fontSize: '0.8rem', textDecoration: 'none' }}
              rel="nofollow noopener"
              target="_blank"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Disclaimers */}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <p style={{ color: '#5a5a5a', fontSize: '0.72rem', lineHeight: 1.7, textAlign: 'center' }}>
            Statements found on this website have not been evaluated by the Food and Drug Administration. Products on this website are not intended to diagnose, treat, cure, or prevent any disease. If you are pregnant, nursing, taking medication, or have a medical condition, consult your physician before using our products.
          </p>
          <p style={{ color: '#5a5a5a', fontSize: '0.72rem', lineHeight: 1.7, textAlign: 'center' }}>
            ClickBank® is a registered trademark of Click Sales, Inc., a Delaware corporation located at 1444 S. Entertainment Ave., Suite 410 Boise, ID 83709, USA and used by permission. ClickBank's role as retailer does not constitute an endorsement, approval or review of these products or any claim, statement or opinion used in promotion of these products.
          </p>
          <p style={{ color: '#5a5a5a', fontSize: '0.72rem', lineHeight: 1.7, textAlign: 'center' }}>
            Individual results may vary. The testimonials shown are from real customers. Results are not guaranteed and your results may differ. This site contains affiliate links and the publisher may receive compensation for purchases made through those links.
          </p>
          <p style={{ color: '#3a3a3a', fontSize: '0.72rem', textAlign: 'center', marginTop: '8px' }}>
            Copyright © {new Date().getFullYear()} CitrusBurn™. All Rights Reserved. Made in USA.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// ROOT COMPONENT
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
