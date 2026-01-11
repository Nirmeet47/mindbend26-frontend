/**
 * SEO and Performance Optimization Utilities
 * 
 * This file contains utilities for improving SEO and site performance
 */

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical images
  const criticalImages = [
    '/images/mb_logo.png',
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Generate structured data for events
export const generateEventStructuredData = (eventData: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  category: string;
  prizePool?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventData.name,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    location: {
      "@type": "Place",
      name: eventData.location,
      address: "SVNIT Surat, Gujarat, India"
    },
    organizer: {
      "@type": "EducationalOrganization",
      name: "SVNIT Surat"
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    category: eventData.category,
    offers: eventData.prizePool ? {
      "@type": "Offer",
      name: "Prize Pool",
      price: eventData.prizePool,
      priceCurrency: "INR"
    } : undefined
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
};

// Image optimization utilities
export const generateImageSrcSet = (baseSrc: string, sizes: number[]) => {
  return sizes.map(size => `${baseSrc}?w=${size} ${size}w`).join(', ');
};

// Performance monitoring
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Measure Core Web Vitals (web-vitals v3+ compatibility)
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    onCLS(console.log);
    onINP(console.log); // FID is replaced by INP in web-vitals v3
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  }).catch(() => {
    // Fallback if web-vitals fails to load
    console.log('Web Vitals measurement unavailable');
  });
};

// SEO meta tags generator for dynamic pages
export const generatePageMetadata = (page: {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  type?: string;
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindbend-svnit.org';
  
  return {
    title: `${page.title} | Mindbend 2026 - SVNIT Surat`,
    description: page.description,
    keywords: [...page.keywords, 'Mindbend 2026', 'SVNIT Surat', 'Gujarat techfest'].join(', '),
    openGraph: {
      title: page.title,
      description: page.description,
      type: page.type || 'website',
      url: siteUrl,
      images: page.image ? [
        {
          url: page.image,
          width: 1200,
          height: 630,
          alt: page.title
        }
      ] : undefined,
      siteName: 'Mindbend 2026'
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: page.image ? [page.image] : undefined
    }
  };
};