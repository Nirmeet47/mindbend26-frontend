import HomeBg from "@/components/homepageComp/homebg";
import Hero from "@/components/homepageComp/Hero";
import About from "@/components/homepageComp/About";
import Testimonials from "@/components/homepageComp/Testimonials";
import { Grid } from "lucide-react";
import { Lecturers, Workshops } from "@/components/homepageComp/GridLists";
import Theme from "@/components/homepageComp/Theme";

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

        <Testimonials />

        <Theme />
        
        <Lecturers />



        <Workshops />
        
        {/* Additional sections */}
        <section className="relative h-screen w-full flex items-center justify-center">
          <h2 className="text-white text-4xl font-bold">More Content Coming Soon...</h2>
        </section>
      </div>
    </main>
  );
}