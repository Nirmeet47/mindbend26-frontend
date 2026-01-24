'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, Clock, AlertCircle, Home, Building2 } from 'lucide-react';
import ParticleBG from '@/components/ui/ParticleBG';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import Navbar from '@/components/layoutComp/Navbar';

export default function AccommodationPage() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <main className="relative min-h-screen">
      {/* Fixed Particle Background */}
      <ParticleBG />

      {/* Navbar */}
      <Navbar />

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="h-[40vh] min-h-[300px] flex items-center justify-center relative bg-gradient-to-b from-black/10 to-black/20 overflow-hidden">
          <div className="text-center z-[2]">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[clamp(3rem,10vw,8rem)] font-extrabold tracking-[0.15em] m-0 uppercase bg-gradient-to-br from-white to-cyan-400 bg-clip-text text-transparent"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                textShadow: '0 0 80px rgba(0, 243, 255, 0.6)',
                filter: 'drop-shadow(0 0 30px rgba(0, 243, 255, 0.4))'
              }}
            >
              ACCOMMODATION
            </motion.h1>
          </div>

          {/* Tech Decorations */}
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-cyan-400/30 border-r-0 border-b-0 z-[1]" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-cyan-400/30 border-l-0 border-t-0 z-[1]" />
        </section>

        {/* Details Section */}
        <section className="min-h-screen py-24 px-8 bg-gradient-to-b from-black/20 to-black/30 relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-[clamp(2rem,5vw,3.5rem)] font-bold mb-4 tracking-[0.15em] text-white"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              textShadow: '0 0 20px rgba(0, 243, 255, 0.3)'
            }}
          >
            ACCOMMODATION DETAILS
          </motion.h2>
          <div className="w-30 h-0.5 bg-cyan-400 mx-auto mb-16 opacity-50" />

          <div className="max-w-[1400px] mx-auto mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Option 1: Guest House */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="relative bg-gradient-to-br from-[#0a0f1c]/85 to-[#162033]/75 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,243,255,0.2)] hover:shadow-[0_20px_60px_rgba(0,243,255,0.3),0_0_80px_rgba(0,243,255,0.2),0_0_0_2px_rgba(0,243,255,0.5)] flex flex-col flex-1">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 rounded-xl opacity-50 hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-border-glow"
                  style={{
                    padding: '2px',
                    background: 'linear-gradient(45deg, #00f3ff, #0088cc, #00f3ff, #0088cc)',
                    backgroundSize: '300% 300%',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                />

                <div className="relative p-10 z-[1] flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-10 pb-6 border-b border-cyan-400/20 flex-wrap gap-6">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 rounded-xl border border-cyan-400/30 transition-all duration-300 hover:from-cyan-400/30 hover:to-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] flex-shrink-0">
                        <Home className="w-7 h-7 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 243, 255, 0.6))' }} />
                      </div>
                      <div>
                        <h3 className="text-[1.75rem] font-bold m-0 text-white leading-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.08em' }}>
                          OPTION 1: GUEST HOUSE
                        </h3>
                        <p className="text-xs text-cyan-400 mt-2 opacity-80 font-mono tracking-wider">[PREMIUM_TIER]</p>
                      </div>
                    </div>
                    <span className="bg-gradient-to-br from-cyan-400 to-blue-600 px-6 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase text-black shadow-[0_4px_12px_rgba(0,243,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,243,255,0.6)]">
                      PREMIUM
                    </span>
                  </div>

                  <div className="flex flex-col gap-8 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoItem
                        icon={Building2}
                        label="LOCATION"
                        value="Guest House opposite to SVNIT Main Gate named, SVP Bhavan"
                      />
                      <InfoItem
                        icon={DollarSign}
                        label="ROOM RENT"
                        value="INR 1600/- per day for one room (2 person capacity)"
                      />
                      <InfoItem
                        icon={Users}
                        label="ALLOCATION"
                        value="First come, first serve basis"
                      />
                      <InfoItem
                        icon={Clock}
                        label="INTIME"
                        value="11:30 PM"
                      />
                      <InfoItem
                        icon={Clock}
                        label="CHECK-IN/CHECK-OUT"
                        value="No specific time, charges are for 24 hours"
                      />
                    </div>

                    <div className="mt-2 p-6 bg-red-900/8 border border-red-600/30 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 to-transparent" />
                      <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-300" style={{ filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.6))' }} />
                        <h4 className="text-red-300 text-sm m-0 font-bold tracking-wider uppercase" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                          IMPORTANT POLICIES
                        </h4>
                      </div>
                      <ul className="m-0 pl-6 flex flex-col gap-3 list-disc">
                        <li className="text-red-200 leading-relaxed text-sm">Before intime everyone must be in the room</li>
                        <li className="text-red-200 leading-relaxed text-sm">No suspicious activity is promoted, strict actions will be taken by the college authorities if found</li>
                        <li className="text-red-200 leading-relaxed text-sm">Only two persons of the same gender are allowed per room</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Option 2: Common Halls */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="relative bg-gradient-to-br from-[#0a0f1c]/85 to-[#162033]/75 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,243,255,0.2)] hover:shadow-[0_20px_60px_rgba(0,243,255,0.3),0_0_80px_rgba(0,243,255,0.2),0_0_0_2px_rgba(0,243,255,0.5)] flex flex-col flex-1">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 rounded-xl opacity-50 hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-border-glow"
                  style={{
                    padding: '2px',
                    background: 'linear-gradient(45deg, #00f3ff, #0088cc, #00f3ff, #0088cc)',
                    backgroundSize: '300% 300%',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                />

                <div className="relative p-10 z-[1] flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-10 pb-6 border-b border-cyan-400/20 flex-wrap gap-6">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 rounded-xl border border-cyan-400/30 transition-all duration-300 hover:from-cyan-400/30 hover:to-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] flex-shrink-0">
                        <Users className="w-7 h-7 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 243, 255, 0.6))' }} />
                      </div>
                      <div>
                        <h3 className="text-[1.75rem] font-bold m-0 text-white leading-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.08em' }}>
                          OPTION 2: COMMON HALLS
                        </h3>
                        <p className="text-xs text-cyan-400 mt-2 opacity-80 font-mono tracking-wider">[STANDARD_TIER]</p>
                      </div>
                    </div>
                    <span className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-2.5 rounded-md text-xs font-bold tracking-wider uppercase text-white shadow-[0_4px_12px_rgba(0,136,204,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,136,204,0.6)]">
                      STANDARD
                    </span>
                  </div>

                  <div className="flex flex-col gap-8 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoItem
                        icon={Building2}
                        label="LOCATION"
                        value="Common Halls for Boys and Girls at respective Hostels"
                      />
                      <InfoItem
                        icon={DollarSign}
                        label="STAY"
                        value="INR 150/- per day"
                      />
                      <InfoItem
                        icon={Clock}
                        label="INTIME (GIRLS HOSTEL)"
                        value="10:30 PM"
                      />
                      <InfoItem
                        icon={Clock}
                        label="ENTRANCE GATE INTIME"
                        value="10:30 PM (For both boys and girls)"
                      />
                    </div>

                    <div className="mt-2 p-6 bg-red-900/8 border border-red-600/30 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 to-transparent" />
                      <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-300" style={{ filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.6))' }} />
                        <h4 className="text-red-300 text-sm m-0 font-bold tracking-wider uppercase" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                          IMPORTANT POLICIES
                        </h4>
                      </div>
                      <ul className="m-0 pl-6 flex flex-col gap-3 list-disc">
                        <li className="text-red-200 leading-relaxed text-sm">No boys will be allowed in girls hostel and no girls will be allowed in boys hostel</li>
                        <li className="text-red-200 leading-relaxed text-sm">Smoking or drinking are not allowed in the college premises, strict actions will be taken if found</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Registration Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="max-w-[900px] mx-auto text-center p-16 relative overflow-hidden bg-gradient-to-br from-[#0a0f1c]/80 to-[#162033]/60 rounded-xl border border-cyan-400/30 shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,243,255,0.1)]"
          >
            <div className="relative z-[1]">
              <h2 className="text-5xl font-bold mb-2 bg-gradient-to-br from-white to-cyan-400 bg-clip-text text-transparent"
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  letterSpacing: '0.1em',
                  filter: 'drop-shadow(0 0 20px rgba(0, 243, 255, 0.4))'
                }}
              >
                ACCOMMODATION REGISTRATION
              </h2>
              <p className="text-cyan-400 text-sm mb-8 font-medium font-mono opacity-80">[LOGIN_REQUIRED]</p>

              <div className="mb-12">
                <p className="text-lg leading-relaxed text-gray-300 max-w-[700px] mx-auto">
                  Please log in to book accommodation for Mindbend'26.
                  The rates are INR 150/- per day for accommodation. This helps us link your accommodation booking to your profile.
                </p>
              </div>

              <div className="flex gap-6 justify-center flex-wrap">
                {!isAuthenticated ? (
                  <Link href="/login" className="px-10 py-4 rounded-lg text-sm font-bold cursor-pointer transition-all duration-300 border-none tracking-wider uppercase relative bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-[0_4px_20px_rgba(0,243,255,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,243,255,0.6)] hover:from-cyan-300 hover:to-blue-500 flex items-center gap-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                    <span className="w-2 h-2 bg-black rounded-full" />
                    Login to Register
                  </Link>
                ) : (
                  <a
                    href="https://forms.google.com/your-form-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-4 rounded-lg text-sm font-bold cursor-pointer transition-all duration-300 border-none tracking-wider uppercase relative bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-[0_4px_20px_rgba(0,243,255,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,243,255,0.6)] hover:from-cyan-300 hover:to-blue-500 flex items-center gap-3"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
                  >
                    <span className="w-2 h-2 bg-black rounded-full" />
                    Register for Accommodation
                  </a>
                )}
                <Link href="/refresh-hub" className="px-10 py-4 rounded-lg text-sm font-bold cursor-pointer transition-all duration-300 tracking-wider uppercase bg-cyan-400/10 text-cyan-400 border border-cyan-400/40 shadow-[inset_0_0_10px_rgba(0,243,255,0.1)] hover:bg-cyan-400/20 hover:border-cyan-400 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,243,255,0.3),inset_0_0_15px_rgba(0,243,255,0.2)]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Refresh Hub
                </Link>
                <Link href="/dining-hub" className="px-10 py-4 rounded-lg text-sm font-bold cursor-pointer transition-all duration-300 tracking-wider uppercase bg-cyan-400/10 text-cyan-400 border border-cyan-400/40 shadow-[inset_0_0_10px_rgba(0,243,255,0.1)] hover:bg-cyan-400/20 hover:border-cyan-400 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,243,255,0.3),inset_0_0_15px_rgba(0,243,255,0.2)]" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Dining Hub
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

// Info Item Component
function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-5 bg-cyan-400/5 rounded-lg border border-cyan-400/15 transition-all duration-300 relative overflow-hidden hover:bg-cyan-400/10 hover:border-cyan-400/40 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,243,255,0.2)]">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3 font-mono">
        <Icon className="w-3.5 h-3.5" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 243, 255, 0.8))' }} />
        <span>{label}</span>
      </div>
      <p className="text-white text-base m-0 leading-relaxed font-normal">{value}</p>
    </div>
  );
}