// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google';
import { Metadata } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'MoffittStatus - Find Library Seats at UC Berkeley',
  description: 'Find available seats at UC Berkeley\'s Moffitt Library instantly. Real-time updates help students spend more time studying and less time searching.',
  keywords: 'Moffitt Library, UC Berkeley library seats, library availability, Berkeley study spaces',
  openGraph: {
    title: 'MoffittStatus - Find Library Seats at UC Berkeley',
    description: 'Real-time seat availability for UC Berkeley\'s Moffitt Library',
    url: 'https://moffittstatus.live',
    siteName: 'MoffittStatus',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoffittStatus - Find Library Seats at UC Berkeley',
    description: 'Real-time seat availability for UC Berkeley\'s Moffitt Library',
  },
  verification: {
    google: 'google-site-verification=1JihZ_4NBiE7mkLIRcrXesveFlSRAYMjzx14hnnU0qw', // Add your Google verification code
  },
  alternates: {
    canonical: 'https://moffittstatus.live',
  },
};

// Add the JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MoffittStatus',
  description: 'Real-time seat availability tracker for UC Berkeley Libraries',
  url: 'https://moffittstatus.live',
  applicationCategory: 'Education',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleTagManager gtmId="G-FR37LLHHMJ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FR37LLHHMJ');
            `,
          }}
        />
      </body>
    </html>
  );
}
