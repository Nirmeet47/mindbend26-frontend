import HomeBg from "@/components/homepageComp/homebg";
import Hero from "@/components/homepageComp/Hero";
import About from "@/components/homepageComp/About";
import Theme from "@/components/homepageComp/Theme";
import Countdown from "@/components/homepageComp/Countdown";
import EventsSection from "@/components/homepageComp/events";
import Sponsors from "@/components/homepageComp/Sponsors";
import Footer from "@/components/homepageComp/Footer";

export default function Page() {
  return (
    <main className="relative min-h-[200vh]">
      {/* Fixed background with only particles */}
      <HomeBg />

      {/* Scrollable content */}
      <div className="relative z-10">
        {/* Hero Section with model and text */}
        <Hero />

        {/* About Section */}
        <About />

        <Countdown />

        {/* <Testimonials /> */}

        <Theme />

        <EventsSection />

        <Sponsors />

        <Footer />
      </div>
    </main>
  );
}
