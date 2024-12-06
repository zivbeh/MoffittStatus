import localFont from "next/font/local";
import { GoogleTagManager } from "@next/third-parties/google";
import "../globals.css"; // Adjust the path based on your folder structure

// Define custom fonts
const geistSans = localFont({
  src: "../fonts/GeistVF.woff", // Adjust the path
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff", // Adjust the path
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the page
const metadata = {
  title: "MoffittStatus - Library Hours | UC Berkeley Libraries",
  description:
    "Current operating hours for UC Berkeley Libraries. Check when Moffitt Library and other campus libraries are open.",
  keywords: "UC Berkeley library hours, Moffitt Library schedule, Berkeley libraries timing",
  openGraph: {
    title: "MoffittStatus - Library Hours",
    description: "Current operating hours for UC Berkeley Libraries",
    url: "https://moffittstatus.live/info",
    siteName: "MoffittStatus",
    type: "website",
  },
  alternates: {
    canonical: "https://moffittstatus.live/info",
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Library Hours - MoffittStatus",
  description:
    "Find current operating hours for UC Berkeley Libraries, including Moffitt Library.",
  url: "https://moffittstatus.live/info",
};

export default function InfoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta tags */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <link rel="canonical" href={metadata.alternates.canonical} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Render children */}
        {children}
        {/* Google Tag Manager */}
        <GoogleTagManager gtmId="G-FR37LLHHMJ" />
        {/* Google Analytics */}
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
