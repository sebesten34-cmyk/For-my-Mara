import React, { useState, useEffect } from 'react';
import { Heart, Volume2, VolumeX, Sparkles, Lock, Clock, CalendarHeart } from 'lucide-react';
import { HelloKittyFace, HelloKittyBow } from './HelloKittyVector';
import { triggerHeartExplosion } from '../utils/confetti';
import { setSoundEnabled, isSoundEnabled } from '../utils/audio';
import { RELATIONSHIP_START_DATE } from '../data/anniversaryData';

interface HeaderProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onRelock: () => void;
}

interface TimePassed {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  onRelock,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [timePassed, setTimePassed] = useState<TimePassed>({
    months: 9,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 274,
  });

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
  };

  useEffect(() => {
    setSoundOn(isSoundEnabled());

    const updateTimer = () => {
      const start = new Date(RELATIONSHIP_START_DATE).getTime();
      const now = new Date().getTime();
      const diffMs = Math.max(0, now - start);

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      // Calculate approximate months & remaining days accurately
      const startDate = new Date(RELATIONSHIP_START_DATE);
      const currentDate = new Date();
      let months = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
      let days = currentDate.getDate() - startDate.getDate();
      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += prevMonth.getDate();
      }

      setTimePassed({
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours,
        minutes,
        seconds,
        totalDays,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'letters', label: 'Read when you miss me', shortLabel: 'Scrisori', emoji: '💌' },
    { id: 'photos', label: 'Album Foto (9 Luni)', shortLabel: 'Album Foto', emoji: '📸' },
    { id: 'music', label: 'Melodiile Noastre', shortLabel: 'Muzică', emoji: '🎵' },
    { id: 'future', label: 'Planuri & Viitorul Nostru', shortLabel: 'Viitorul Nostru', emoji: '📅' },
    { id: 'games', label: 'Jocuri Live în Doi', shortLabel: 'Jocuri', emoji: '🎮' },
  ];

  return (
    <header className="w-full bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-pink-200/80 shadow-xs transition-all">
      {/* Compact Main Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2">
        {/* Left: Romantic couple brand */}
        <div className="flex items-center gap-2">
          <div
            className="cursor-pointer transition-transform hover:scale-110 active:scale-90 shrink-0"
            onClick={(e) => triggerHeartExplosion(e.clientX, e.clientY)}
            title="Apasă pe Hello Kitty pentru inimioare!"
          >
            <HelloKittyFace size={34} bowColor="#f43f5e" expression="blush" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <div className="flex items-center gap-1 font-display text-base sm:text-lg text-rose-600 font-bold tracking-wide">
              <span>Dominik</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse inline" />
              <span>Mara</span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] font-bold">
              9 Luni • 22.12.2025 💕
            </span>
          </div>
        </div>

        {/* Center: Live Love Counter (Compact Inline) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-pink-50/80 px-3 py-1 rounded-full border border-pink-200/70">
          <CalendarHeart className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-[11px] text-pink-800">Împreună de:</span>
          <span className="font-mono">{timePassed.months}l</span>
          <span>:</span>
          <span className="font-mono">{timePassed.days}z</span>
          <span>:</span>
          <span className="font-mono">{String(timePassed.hours).padStart(2, '0')}h</span>
          <span>:</span>
          <span className="font-mono">{String(timePassed.minutes).padStart(2, '0')}m</span>
          <span>:</span>
          <span className="font-mono text-rose-600">{String(timePassed.seconds).padStart(2, '0')}s</span>
        </div>

        {/* Right: Navigation pills + quick actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-xs scale-102'
                      : 'bg-pink-50/80 text-pink-700 hover:bg-pink-100 border border-pink-200/50'
                  }`}
                  title={item.label}
                >
                  <span className="text-xs">{item.emoji}</span>
                  <span className="hidden md:inline">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          <div className="h-4 w-px bg-pink-200 mx-0.5 hidden sm:block" />

          {/* Sound toggle & Lock */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center transition-all ${
              soundOn
                ? 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200'
                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
            }`}
            title={soundOn ? 'Sunet activat (click pentru mut)' : 'Sunet oprit (click pentru activare)'}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onRelock}
            className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-600 text-xs font-semibold flex items-center transition-all"
            title="Blochează seiful"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Small Screen Love Counter ticker (only on mobile) */}
      <div className="lg:hidden bg-pink-50/90 py-0.5 border-t border-pink-100 px-2 text-center">
        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-700">
          <CalendarHeart className="w-3 h-3 text-rose-500" />
          <span>{timePassed.months} luni, {timePassed.days} zile, {String(timePassed.hours).padStart(2, '0')}:{String(timePassed.minutes).padStart(2, '0')}:{String(timePassed.seconds).padStart(2, '0')}</span>
          <span className="text-rose-500">💕</span>
        </div>
      </div>
    </header>
  );
};
