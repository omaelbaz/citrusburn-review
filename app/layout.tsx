import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CitrusBurn™ — Official Website | Thermogenic Fat-Burning Formula',
  description:
    'Backed by Harvard & Barcelona research, CitrusBurn™ uses 7 rare botanicals to break Thermogenic Resistance and reignite your metabolism — without stimulants, injections, or crash diets. 180-Day Money-Back Guarantee.',
  keywords: [
    'CitrusBurn',
    'CitrusBurn review',
    'thermogenic supplement',
    'weight loss supplement',
    'fat burner',
    'Seville orange peel',
    'metabolism booster',
    'thermogenesis',
    'natural weight loss',
  ],
  authors: [{ name: 'CitrusBurn™' }],
  creator: 'CitrusBurn™',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'CitrusBurn™ — Burn More. Crave Less. Feel Great All Day.',
    description:
      'New Harvard & Barcelona breakthrough reveals the hidden cause of slow metabolism. CitrusBurn™ — 7 rare botanicals, 180-Day Guarantee, 75% OFF today.',
    siteName: 'CitrusBurn™',
    images: [
      {
        url: '/s6prd.png',
        width: 1200,
        height: 630,
        alt: 'CitrusBurn™ — Official Product',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CitrusBurn™ — Official Website',
    description:
      'Break Thermogenic Resistance with 7 rare botanicals. 180-Day Money-Back Guarantee. Limited-time 75% OFF.',
    images: ['/s6prd.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#FF8C00" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#F9FAFB', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
