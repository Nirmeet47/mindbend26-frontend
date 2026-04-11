"use client";
import Footer from "@/components/homepageComp/Footer";
import Navbar from "@/components/layoutComp/Navbar";
import {
  TechDecorationBottomLeft,
  TechDecorationBottomRight,
  TechDecorationTopLeft,
  TechDecorationTopRight,
} from "@/components/ui/TechDecorations";
import Image from "next/image";
import React from "react";

const sponsors = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
  "/assets/6.png",
  "/assets/7.png",
  "/assets/8.png",
  "/assets/9.png",
  "/assets/10.png",
];

function Page() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen px-4 pt-22 pb-16 sm:px-5 lg:px-8 bg-[#050505]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          fontFamily: "Space Grotesk, sans-serif",
        }}
      >
        <div
          className="fixed w-125 h-125 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"
          style={{ animation: "glowMove1 20s ease-in-out infinite" }}
        ></div>
        <div
          className="fixed w-100 h-100 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"
          style={{ animation: "glowMove2 25s ease-in-out infinite" }}
        ></div>
        <div
          className="fixed w-75 h-75 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"
          style={{ animation: "glowMove3 18s ease-in-out infinite" }}
        ></div>

        <section className="max-w-4xl mx-auto text-center text-[#f3f2ef]">
          <p className="m-0 tracking-[0.18em] uppercase text-xs text-[#33ABB9]">
            Mindbend 2026
          </p>
          <h1
            className="mt-2 mb-1 text-[clamp(2rem,6vw,3.8rem)] leading-[1.08] font-black text-white uppercase tracking-[0.06em]"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            Sponsors
          </h1>
          <p className="mx-auto max-w-3xl text-[clamp(0.95rem,2.3vw,1.1rem)] leading-relaxed text-[#c7d7db]">
            The brands powering innovation, ambition, and unforgettable moments.
          </p>
        </section>

        <section className="max-w-7xl mx-auto mt-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4.5">
            {sponsors.map((src, index) => (
              <article
                key={src}
                className="relative group min-h-min w-full sponsor-reveal"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div
                  className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-0 border-white/5 shadow-xl transition-all duration-300 group-hover:bg-[#184344]/35"
                  style={{
                    clipPath:
                      "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)",
                  }}
                />

                <TechDecorationTopLeft />
                <TechDecorationTopRight />
                <TechDecorationBottomRight />
                <TechDecorationBottomLeft />

                <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-linear-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
                <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-linear-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
                <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-linear-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
                <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-linear-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />

                <div className="relative z-10 p-4">
                  <div className="relative w-full aspect-4/3 overflow-hidden border border-white/10 bg-[#e9edf1] group-hover:border-[#33ABB9]/35 transition-colors">
                    <div className="absolute left-3 top-3 z-10 h-2 w-2 rounded-full bg-[#33ABB9] animate-pulse" />
                    <Image
                      src={src}
                      alt={`Sponsor logo ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className="object-contain p-4 opacity-88 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-black/65 to-transparent" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes glowMove1 {
          0%,
          100% {
            top: -10%;
            right: -5%;
          }
          25% {
            top: 20%;
            right: 60%;
          }
          50% {
            top: 60%;
            right: 70%;
          }
          75% {
            top: 80%;
            right: 20%;
          }
        }

        @keyframes glowMove2 {
          0%,
          100% {
            bottom: -5%;
            left: -5%;
          }
          25% {
            bottom: 50%;
            left: 70%;
          }
          50% {
            bottom: 80%;
            left: 50%;
          }
          75% {
            bottom: 30%;
            left: 10%;
          }
        }

        @keyframes glowMove3 {
          0%,
          100% {
            top: 50%;
            left: 25%;
          }
          33% {
            top: 10%;
            left: 60%;
          }
          66% {
            top: 70%;
            left: 80%;
          }
        }

        .sponsor-reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          animation: reveal 600ms ease forwards;
        }

        @keyframes reveal {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sponsor-reveal {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}

export default Page;
