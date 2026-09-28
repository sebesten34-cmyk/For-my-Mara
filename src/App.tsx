/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';
import { SafeGate } from './components/SafeGate';
import { Header } from './components/Header';
import { LettersSection } from './components/LettersSection';
import { PhotoAlbumSection } from './components/PhotoAlbumSection';
import { MusicPlayerSection } from './components/MusicPlayerSection';
import { FutureTimelineSection } from './components/FutureTimelineSection';
import { MiniGamesSection } from './components/games/MiniGamesSection';
import { InteractiveHelloKittyCompanion, FloatingBackgroundDecor } from './components/InteractiveHelloKittyCompanion';
import { HelloKittyFace, HelloKittyBow } from './components/HelloKittyVector';
import { triggerHeartExplosion } from './utils/confetti';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('letters');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Clear any past session storage so reload always prompts for the romantic passcode
  useEffect(() => {
    try {
      sessionStorage.removeItem('dominik_mara_site_unlocked');
    } catch {
      // ignore
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleRelock = () => {
    setIsUnlocked(false);
  };

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll listener for back-to-top button and section spy
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['letters', 'photos', 'music', 'future', 'games'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isUnlocked) {
    return <SafeGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50/50 to-pink-100/70 text-slate-800 relative selection:bg-pink-200 selection:text-pink-900">
      {/* Floating Animated Background Items */}
      <FloatingBackgroundDecor />

      {/* Sticky Header with Navigation & Live Love Counter */}
      <Header
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onRelock={handleRelock}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 space-y-12 pb-24">
        {/* Welcome Hero Greeting Banner */}
        <section className="pt-8 sm:pt-12 px-4 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-2 border-pink-200 shadow-xl shadow-pink-100/80 relative"
          >
            {/* Top decorative bows */}
            <div className="flex justify-center -mt-12 sm:-mt-16 mb-3">
              <div
                className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                onClick={(e) => triggerHeartExplosion(e.clientX, e.clientY)}
                title="Apasă pe Hello Kitty pentru explozie de inimioare!"
              >
                <HelloKittyFace size={80} bowColor="#f43f5e" expression="love" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              22 Septembrie 2026 • 9 Luni de Relație
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 font-cute tracking-tight leading-tight">
              La Mulți Ani, Prințesa Mea Mara! 💕
            </h1>

            <p className="mt-3 font-handwriting text-2xl sm:text-3xl text-rose-600 max-w-2xl mx-auto leading-relaxed">
              „Astăzi se împlinesc 9 luni de când mi-ai luminat lumea și ai spus DA. Acest loc este doar pentru noi doi, plin de scrisori, amintiri, muzica noastră și promisiunea unui viitor minunat!”
            </p>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs font-bold text-pink-700">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                Dominik + Mara
              </span>
              <span>•</span>
              <span>22.12.2025</span>
              <span>•</span>
              <span>Infinit</span>
            </div>
          </motion.div>
        </section>

        {/* Section 1: Read when you miss me */}
        <LettersSection />

        {/* Section 2: Photo Album (9 months x 3 photos) */}
        <PhotoAlbumSection />

        {/* Section 3: Music Player */}
        <MusicPlayerSection />

        {/* Section 4: Future Timeline & Plans */}
        <FutureTimelineSection />

        {/* Section 5: Realtime Mini-Games (Flappy Pigeon & Love Catcher) */}
        <MiniGamesSection />
      </main>

      {/* Interactive Bottom Corner Hello Kitty Pet Companion */}
      <InteractiveHelloKittyCompanion />

      {/* Back to top floating button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-5 left-5 z-40 p-3 rounded-full bg-white/90 hover:bg-white text-rose-500 border-2 border-pink-300 shadow-lg transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
            title="Înapoi sus"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Romantic Footer */}
      <footer className="relative z-10 border-t border-pink-200 bg-white/80 backdrop-blur-md py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <HelloKittyBow size={24} color="#f43f5e" />
            <span className="font-display text-xl text-rose-600">Dominik & Mara</span>
            <HelloKittyBow size={24} color="#f43f5e" />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            Creat cu toată dragostea din lume de Dominik pentru prințesa lui, Mara.
          </p>
          <p className="text-[11px] text-pink-500 font-medium">
            22 Decembrie 2025 — O viață întreagă împreună • Până la adânci bătrâneți 👵👴❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
