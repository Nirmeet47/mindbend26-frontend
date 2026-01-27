import HomeBg from "@/components/ui/ParticleBG";
import About from "@/components/homepageComp/About";
import Theme from "@/components/homepageComp/Theme";
import Countdown from "@/components/homepageComp/Countdown";
import EventsSection from "@/components/homepageComp/events";
import Sponsors from "@/components/homepageComp/Sponsors";
import Footer from "@/components/homepageComp/Footer";
import Navbar from "@/components/layoutComp/Navbar";
import Hero from "@/components/homepageComp/Hero";
import Timeline from "@/components/homepageComp/Timeline"

import { Metadata } from 'next';

// SEO-optimized metadata for homepage
export const metadata: Metadata = {
  title: "Mindbend 2026 - SVNIT Surat",
  description: "Gujarat's largest Techno-Managerial fest at SVNIT Surat. Join 15,000+ participants, compete for ₹7 lakh+ prize pool in technical events, workshops, hackathons, MUN, esports & guest lectures. Feb 27-Mar 1, 2026.",
  keywords: [
    "Mindbend 2026",
    "SVNIT Surat",
    "Gujarat largest techfest",
    "techno-managerial fest",
    "February March 2026 fest",
    "15000 participants",
    "7 lakh prize pool",
    "technical events",
    "hackathon",
    "workshops",
    "engineering fest",
    "college festival Gujarat",
    "NIT Surat",
    "Ecogenesis theme",
  ],
  openGraph: {
    title: "Mindbend 2026 - Gujarat's Largest Techno-Managerial Fest",
    description: "Join 15,000+ participants at SVNIT Surat's flagship festival. ₹7L+ prizes, technical competitions, hackathons, workshops, MUN, esports. Feb 27-Mar 1, 2026.",
    type: "website",
    locale: "en_IN",
    url: "https://mindbend.svnit.ac.in",
    images: [
      {
        url: "https://mindbend-svnit.org/images/mb_logo.png",
        width: 1200,
        height: 630,
        alt: "Mindbend 2026 Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindbend 2026 - Gujarat's Largest Techno-Managerial Fest",
    description: "15,000+ participants | ₹7L+ prizes | Technical & Managerial competitions | Feb 27-Mar 1, 2026 | SVNIT Surat",
    images: ["https://mindbend-svnit.org/images/mb_logo.png"],
  }
};

export default function Page() {
  return (
    <>
      {/* Structured data for homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Mindbend 2026 - Gujarat's Largest Techno-Managerial Fest",
            description: "Join Gujarat's biggest techfest at SVNIT Surat with 15,000+ participants competing for ₹7 lakh+ prize pool",
            url: "https://mindbend-svnit.org",
            mainEntity: {
              "@type": "Event",
              name: "Mindbend 2026",
              startDate: "2026-02-27",
              endDate: "2026-03-01",
              location: "SVNIT Surat, Gujarat, India",
              organizer: "SVNIT Surat",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://mindbend-svnit.org"
                }
              ]
            }
          })
        }}
      />

      <main className="relative min-h-[200vh]">
        {/* Fixed background with only particles */}
        <Navbar />

        <HomeBg />

        {/* Scrollable content with semantic HTML */}
        <div className="relative z-10">
          {/* Hero Section with model and text */}
          <header>
            <Hero />
          </header>

          {/* Main content sections */}
          <section aria-label="About Mindbend">
            <About />
          </section>

          <section aria-label="Event Countdown">
            <Countdown />
          </section>

          <section aria-label="Festival Theme">
            <Theme />
          </section>

          <section aria-label="Timeline of Theme">
            <Timeline />
          </section>


          <section aria-label="Events and Competitions">
            <EventsSection />
          </section>

          <section aria-label="Sponsors and Partners">
            <Sponsors />
          </section>

          <Footer />
        </div>
      </main>
    </>
  );
}
