import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import Analytics from '@/components/Analytics';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import localFont from 'next/font/local';
const circuitForem = localFont({
  src: "../public/fonts/CircuitForemRegular.otf",
  variable: "--font-circuit-forem",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mindbend-svnit.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mindbend 2026 - SVNIT Surat",
    template: "%s | Mindbend 2026 - SVNIT Surat",
  },
  description:
    "Gujarat's largest Techno-Managerial fest at SVNIT Surat. Join 15,000+ participants, compete for ₹7 lakh+ prize pool in technical events, workshops, hackathons, MUN, esports & guest lectures. Feb 27-Mar 1, 2026.",
  keywords: [
    "Mindbend 2026",
    "SVNIT Surat",
    "Gujarat largest techno managerial fest",
    "technical festival Gujarat",
    "engineering fest India",
    "hackathon Gujarat",
    "technical competitions",
    "managerial events",
    "workshops SVNIT",
    "MUN Gujarat",
    "esports tournament",
    "guest lectures",
    "NIT Surat",
    "February March 2026 fest",
    "college festival Gujarat",
    "coding competition",
    "robotics events",
    "innovation fest",
    "startup competition",
    "tech fest India 2026",
    "Ecogenesis theme",
    "Bharat roots revolution",
    "15000 participants",
    "7 lakh prize pool",
    "student competition",
    "engineering students",
    "technology innovation",
    "sustainability tech",
  ],
  authors: [
    { name: "Mindbend Team SVNIT", url: siteUrl },
    { name: "SVNIT Surat", url: "https://www.svnit.ac.in" },
  ],
  creator: "Mindbend 2026 Organizing Committee",
  publisher: "Sardar Vallabhbhai National Institute of Technology, Surat",
  applicationName: "Mindbend 2026",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Technology",

  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Mindbend 2026",
    title: "Mindbend 2026 - Gujarat's Largest Techno-Managerial Fest | SVNIT Surat",
    description:
      "Join Gujarat's biggest tech fest! 15,000+ participants, ₹7L+ prizes. Technical competitions, hackathons, workshops, MUN, esports & celebrity guest lectures. Feb 27-Mar 1, 2026 at SVNIT Surat.",
    images: [
      {
        url: `${siteUrl}/images/mb_logo.png`,
        width: 1200,
        height: 630,
        alt: "Mindbend 2026 - Gujarat's Largest Techno-Managerial Fest at SVNIT Surat",
        type: "image/png",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Mindbend 2026 - Gujarat's Largest Techno-Managerial Fest",
    description:
      "15,000+ participants | ₹7L+ prizes | Technical & Managerial competitions | Hackathons | Workshops | Feb 27-Mar 1, 2026 | SVNIT Surat",
    images: [`${siteUrl}/images/mb_logo.png`],
    creator: "@mindbend_nitsurat",
    site: "@mindbend_nitsurat",
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons - Next.js automatically serves favicon.ico from public folder
  icons: {
    icon: "/favicon.ico",
    apple: "/images/mb_logo.png",
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Alternate languages (if applicable)
  alternates: {
    canonical: siteUrl,
  },

  // Verification for search engines
  verification: {
    // google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, // Add if you get HTML tag from Google
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_ID || "",
      "google-analytics": process.env.NEXT_PUBLIC_GA_ID || "",
    },
  },

  // Other metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Mindbend 2026",
    "format-detection": "telephone=no",
    "theme-color": "#000000",
    "event-date": "2026-02-27",
    "event-location": "SVNIT Surat, Gujarat, India",
    "event-type": "Technology Festival",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Mindbend 2026",
    description:
      "Gujarat's largest Techno-Managerial fest at SVNIT Surat with 15,000+ participants competing for ₹7 lakh+ prize pool in technical events, workshops, hackathons, MUN, esports, and guest lectures.",
    startDate: "2026-02-27",
    endDate: "2026-03-01",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "SVNIT Surat",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ichchhanath",
        addressLocality: "Surat",
        addressRegion: "Gujarat",
        postalCode: "395007",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "21.1672",
        longitude: "72.7853",
      },
    },
    image: ["/images/mb_logo.png"],
    organizer: {
      "@type": "EducationalOrganization",
      name: "Sardar Vallabhbhai National Institute of Technology, Surat",
      url: "https://www.svnit.ac.in",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ichchhanath",
        addressLocality: "Surat",
        addressRegion: "Gujarat",
        postalCode: "395007",
        addressCountry: "IN",
      },
    },
    performer: {
      "@type": "Organization",
      name: "Mindbend 2026 Organizing Committee",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Student Registration",
        availability: "https://schema.org/InStock",
        price: "500",
        priceCurrency: "INR",
        validFrom: "2024-12-01",
        url: `${siteUrl}/register`,
      },
      {
        "@type": "Offer",
        name: "Workshop Registration",
        availability: "https://schema.org/InStock",
        price: "200",
        priceCurrency: "INR",
        validFrom: "2024-12-01",
        url: `${siteUrl}/workshops`,
      },
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Engineering Students, Technology Enthusiasts, Professionals",
    },
    typicalAgeRange: "18-25",
    inLanguage: "en-IN",
    keywords: "techno-managerial fest, hackathon, workshops, technical competition, engineering, Gujarat",
    sponsor: {
      "@type": "Organization",
      name: "Various Corporate Sponsors",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Mindbend",
    alternateName: "Mindbend SVNIT Surat",
    description: "Gujarat's largest Techno-Managerial festival organized by SVNIT Surat",
    url: siteUrl,
    logo: `${siteUrl}/images/mb_logo.png`,
    foundingDate: "2010",
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "SVNIT Surat",
      url: "https://www.svnit.ac.in",
    },
    sameAs: [
      "https://www.instagram.com/mindbend_nitsurat/",
      "https://www.linkedin.com/company/mindbend-svnit-surat/",
      "https://www.facebook.com/Mindbend20/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "mindbend@svnit.ac.in",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ichchhanath, SVNIT Campus",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395007",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en" dir="ltr">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${circuitForem.variable} antialiased`}
      ><Analytics />

        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            }
          }}
        />
      </body>
    </html>
  );
}
