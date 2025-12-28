"use client";

import { useEffect, useState } from "react";

const targetDate = new Date("2026-03-15T00:00:00"); // CHANGE YOUR EVENT DATE

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="countdown-section flex-col items-center justify-center">
      <div
        className="text-center text-white text-[40px] md:text-7xl font-black mb-12 sm:mb-16 md:mb-20 tracking-wider"
        style={{ fontFamily: "Barlow Condensed, sans-serif" }}
      >
        EVENT STARTS IN
        <div className="h-[3px] w-[80%] bg-linear-to-t from-cyan-500 to-transparent my-3 sm:my-4 mx-auto opacity-50"></div>
      </div>

      <div className="container">
        <TimeBox value={timeLeft.days} label="DAYS" />
        <Divider />

        <TimeBox value={timeLeft.hours} label="HOURS" />
        <Divider />

        <TimeBox value={timeLeft.minutes} label="MINUTES" />
        <Divider />

        <TimeBox value={timeLeft.seconds} label="SECONDS" />
      </div>

      <style jsx>{`
        .countdown-section {
          background: black;
          padding: 60px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: "Inter", sans-serif;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          max-width: 1400px;
          padding: 0 8px;
        }

        @media (min-width: 640px) {
          .countdown-section {
            padding: 80px 16px;
          }
          .container {
            gap: 30px;
          }
        }

        @media (min-width: 768px) {
          .countdown-section {
            padding: 100px 0;
          }
          .container {
            gap: 60px;
            width: 80%;
          }
        }

        @media (min-width: 1024px) {
          .countdown-section {
            padding: 120px 0;
          }
        }
      `}</style>
    </section>
  );
};

const TimeBox = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="time-box">
      <span className="number">{value}</span>
      <span className="label">{label}</span>

      <style jsx>{`
        .time-box {
          text-align: center;
          flex: 1;
          min-width: 50px;
        }

        .number {
          font-size: clamp(28px, 14vw, 150px);
          font-weight: 500;
          letter-spacing: 2px;
          display: block;
          font-family: "Digital-7", "Space Grotesk", sans-serif;
          transform: scale(1, 1.3);
        }

        .label {
          display: block;
          margin-top: 6px;
          font-size: clamp(8px, 1.8vw, 18px);
          letter-spacing: 2px;
          opacity: 0.7;
          font-family: "Space Grotesk", sans-serif;
        }

        @media (min-width: 640px) {
          .time-box {
            min-width: 80px;
          }
          .number {
            letter-spacing: 4px;
          }
          .label {
            margin-top: 8px;
            letter-spacing: 3px;
          }
        }

        @media (min-width: 768px) {
          .time-box {
            min-width: 100px;
          }
          .number {
            letter-spacing: 6px;
          }
          .label {
            margin-top: 12px;
            letter-spacing: 4px;
          }
        }
      `}</style>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="divider">
      <div className="shine" />

      <style jsx>{`
        .divider {
          position: relative;
          width: 0.5px;
          height: 120px;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.25),
            rgba(255, 255, 255, 0.25) 1px,
            transparent 2px,
            transparent 6px
          );
          overflow: hidden;
        }

        .shine {
          position: absolute;
          top: -60%;
          left: -6px;
          width: 18px;
          height: 150px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 255, 255, 0.8),
            white,
            rgba(255, 255, 255, 0.8),
            transparent
          );
          filter: blur(4px);
          animation: shineMove 3.5s linear infinite;
        }

        @keyframes shineMove {
          from {
            top: -150px;
          }
          to {
            top: 150px;
          }
        }

        @media (min-width: 640px) {
          .divider {
            height: 200px;
          }
          @keyframes shineMove {
            from {
              top: -150px;
            }
            to {
              top: 200px;
            }
          }
        }

        @media (min-width: 768px) {
          .divider {
            height: 300px;
          }
          @keyframes shineMove {
            from {
              top: -150px;
            }
            to {
              top: 300px;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Countdown;
