'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, Calendar } from 'lucide-react';
import { useState } from 'react';
import { EventContact } from '@/types';
import Link from 'next/link';

type TabType = 'about' | 'structure' | 'rules' | 'contact';

interface EventTabsProps {
  aboutEvent: string;
  isTeamEvent?: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  rules?: string[];
  contact?: EventContact[];
  whatsappGrpLink?: string;
}

const EventTabs: React.FC<EventTabsProps> = ({
  aboutEvent,
  isTeamEvent,
  minTeamSize,
  maxTeamSize,
  rules,
  contact,
  whatsappGrpLink
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="border-b border-white/10 mb-8 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />
        <div className="flex flex-wrap gap-2 md:gap-8 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: 'about', label: 'About' },
            ...((isTeamEvent != null || isTeamEvent != undefined) ? [{ id: 'structure', label: 'Structure' }] : []),
            ...(rules && rules.length > 0 ? [{ id: 'rules', label: 'Protocol' }] : []),
            ...(contact && contact.length > 0 ? [{ id: 'contact', label: 'Contact' }] : []),
            ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-4 px-4 font-orbitron font-bold tracking-wider text-sm relative transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#00F0FF]' : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              <span className="relative z-10 px-2">
                {activeTab === tab.id && <span className="text-[#00F0FF] mr-2">&gt;</span>}
                {tab.label}
              </span>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.7)]"
                  transition={{ duration: 0.3 }}
                />
              )}
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-[#00F0FF]/5 transform -skew-x-12 z-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.3 }}
        className="min-h-[300px]"
      >
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-xl md:text-2xl font-rajdhani font-medium leading-relaxed text-gray-300 tracking-wide text-justify">
                {aboutEvent || 'Details about this event will be updated soon.'}
              </p>
            </div>

            {/* Important Note - Hologram Style */}
            <div className="bg-[#00F0FF]/5 border-l-2 border-[#00F0FF] p-6 relative overflow-hidden backdrop-blur-sm">
              {/* Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-[#00F0FF] animate-pulse" />
                  <p className="font-bold text-[#00F0FF] font-orbitron tracking-wider">NOTE</p>
                </div>
                <p className="text-gray-300 font-rajdhani text-lg">SVNTians must use their institute email for registration access.</p>
              </div>
            </div>
          </div>
        )}

        {/* Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-8">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 relative group">
                  <div className="absolute top-0 right-0 p-2 opacity-50">
                    <Users className="w-8 h-8 text-white/20" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 font-orbitron text-[#00F0FF]">Event Format</h4>
                  <p className="text-gray-400 font-rajdhani text-lg">
                    This is a <span className="text-white font-bold">{isTeamEvent ? 'SQUAD-BASED' : 'SOLO_OPERATIVE'}</span> task.
                    {isTeamEvent && ` Squad size parameters: ${minTeamSize}-${maxTeamSize} units.`}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 relative group">
                  <div className="absolute top-0 right-0 p-2 opacity-50">
                    <Calendar className="w-8 h-8 text-white/20" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 font-orbitron text-[#00F0FF]">Timeline_Sequence</h4>
                  <p className="text-gray-400 font-rajdhani text-lg">
                    Temporal coordinates and execution schedule will be transmitted to registered operatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            {rules && rules.length > 0 ? (
              <div className="grid gap-3">
                {rules.map((rule, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 border-l-4 border-cyan-500/30 p-4 pl-6 hover:bg-white/10 hover:border-cyan-400 transition-all group flex items-start gap-4"
                  >
                    <span className="font-share-tech-mono text-[#00F0FF] opacity-50 text-sm mt-1">
                      {String(i + 1).padStart(2, '0')} //
                    </span>
                    <p className="text-lg font-rajdhani font-medium leading-tight group-hover:text-white text-gray-300">{rule}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 p-8 rounded-lg text-center border-dashed">
                <p className="text-gray-400 font-share-tech-mono">Protocols encrypting... Standby.</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp Contacts */}
              {contact && contact.length > 0 ? (
                contact.map((contactPerson, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all flex items-center justify-between group">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-5 h-5 text-green-400" />
                        <h4 className="font-bold text-lg font-orbitron">{contactPerson.name}</h4>
                      </div>
                      <p className="text-gray-400 font-share-tech-mono text-xs">{contactPerson.whatsappNo}</p>
                    </div>
                    <Link
                      href={`https://wa.me/${contactPerson.whatsappNo.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-black font-bold uppercase tracking-wider text-xs transition-all"
                    >
                      Contact
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-white/5 border border-white/10 p-8 rounded-lg text-center border-dashed col-span-full">
                  <p className="text-gray-400 font-share-tech-mono">No contacts available</p>
                </div>
              )}

            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default EventTabs;
