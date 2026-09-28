import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CalendarHeart,
  Sparkles,
  Heart,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Gem,
  GraduationCap,
  Home,
  Crown,
  Baby,
  Infinity as InfinityIcon,
  PartyPopper,
} from 'lucide-react';
import { FutureMilestone, BucketItem } from '../types';
import { FUTURE_MILESTONES, INITIAL_BUCKET_LIST, RELATIONSHIP_START_DATE } from '../data/anniversaryData';
import { HelloKittyFace, HelloKittyBow } from './HelloKittyVector';
import { triggerHeartExplosion, triggerGrandCelebration } from '../utils/confetti';
import { playHeartPop } from '../utils/audio';

const STORAGE_KEY_BUCKET = 'dominik_mara_bucket_list_v3';

export const FutureTimelineSection: React.FC = () => {
  const [bucketList, setBucketList] = useState<BucketItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUCKET);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BUCKET_LIST;
  });

  const [newDream, setNewDream] = useState('');
  const [countdown1Year, setCountdown1Year] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdownNYE, setCountdownNYE] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUCKET, JSON.stringify(bucketList));
    } catch (e) {
      console.warn('Could not save bucket list', e);
    }
  }, [bucketList]);

  // Countdowns to 1 Year (22 Dec 2026) and New Year's Eve (31 Dec 2026)
  useEffect(() => {
    const updateCountdowns = () => {
      const now = new Date().getTime();

      // 1 Year: 22 Decembrie 2026
      const oneYearDate = new Date('2026-12-22T00:00:00').getTime();
      const diff1 = Math.max(0, oneYearDate - now);
      setCountdown1Year({
        days: Math.floor(diff1 / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff1 / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff1 / (1000 * 60)) % 60),
        seconds: Math.floor((diff1 / 1000) % 60),
      });

      // NYE: 31 Decembrie 2026
      const nyeDate = new Date('2026-12-31T23:59:59').getTime();
      const diffNYE = Math.max(0, nyeDate - now);
      setCountdownNYE({
        days: Math.floor(diffNYE / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffNYE / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffNYE / (1000 * 60)) % 60),
        seconds: Math.floor((diffNYE / 1000) % 60),
      });
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleBucket = (id: string, e: React.MouseEvent) => {
    const item = bucketList.find((b) => b.id === id);
    if (!item?.isCompleted) {
      triggerHeartExplosion(e.clientX, e.clientY);
    } else {
      playHeartPop();
    }

    setBucketList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isCompleted: !b.isCompleted } : b))
    );
  };

  const handleAddHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHeartExplosion(e.clientX, e.clientY);
    setBucketList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, heartCount: b.heartCount + 1 } : b))
    );
  };

  const handleAddDream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDream.trim()) return;

    const newItem: BucketItem = {
      id: `dream-${Date.now()}`,
      text: newDream.trim(),
      dateAdded: 'Septembrie 2026',
      isCompleted: false,
      heartCount: 1,
    };

    setBucketList([...bucketList, newItem]);
    setNewDream('');
    triggerHeartExplosion();
  };

  const getMilestoneIcon = (icon: string) => {
    switch (icon) {
      case 'Gem':
        return <Gem className="w-5 h-5 text-rose-500" />;
      case 'GraduationCap':
      case 'BookOpen':
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-amber-500" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-pink-500" />;
      case 'Infinity':
        return <InfinityIcon className="w-5 h-5 text-rose-600" />;
      default:
        return <Heart className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <section id="future" className="py-12 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold tracking-wide uppercase mb-2">
          <CalendarHeart className="w-3.5 h-3.5 text-pink-600" />
          Secțiunea 4 • Calendarul & Visele Noastre
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 font-cute flex items-center justify-center gap-2">
          <span>Planuri Pentru Viitorul Nostru</span>
          <HelloKittyBow size={28} color="#f43f5e" />
        </h2>
        <p className="text-sm sm:text-base text-pink-700/80 mt-1 max-w-xl mx-auto font-medium">
          Fiecare pas pe care îl vom face împreună, de la 1 an de relație și până la adânci bătrâneți.
        </p>
      </div>

      {/* Countdown Cards to Next Immediate Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Countdown 1: 1 An de relație */}
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-200 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
            <Heart className="w-48 h-48 fill-white" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <PartyPopper className="w-3.5 h-3.5" />
              Marele Prag: 1 An
            </span>
            <span className="text-xs font-bold text-pink-100">22 Decembrie 2026</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-cute mb-1">
            Numărătoare inversă până la 1 An de Relație 💕
          </h3>
          <p className="text-xs sm:text-sm text-pink-100 mb-6 font-medium">
            Primul nostru an complet impreuna! O aniversare uriasa pentru noi, cu surprize si iubire neconditionata din partea amandurora, intradevar.
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono">{countdown1Year.days}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Zile</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono">{countdown1Year.hours}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Ore</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono">{countdown1Year.minutes}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Min</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-yellow-300">{countdown1Year.seconds}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Sec</span>
            </div>
          </div>
        </div>

        {/* Countdown 2: Revelionul Împreună */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-20 pointer-events-none">
            <Sparkles className="w-48 h-48 fill-white" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Revelionul Împreună
            </span>
            <span className="text-xs font-bold text-pink-100">31 Decembrie 2026</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-cute mb-1">
            Miezul nopții dintre ani în brațele tale ✨
          </h3>
          <p className="text-xs sm:text-sm text-pink-100 mb-6">
            Al doilea nostru Revelion împreună la miezul nopții!
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono">{countdownNYE.days}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Zile</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono">{countdownNYE.hours}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Ore</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono">{countdownNYE.minutes}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Min</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/20">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-yellow-300">{countdownNYE.seconds}</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-100">Sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 10 Future Milestone Stages Requested by Dominik */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border-2 border-pink-200 shadow-xl shadow-pink-100/60 mb-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onClick={(e) => triggerHeartExplosion(e.clientX, e.clientY)}
              title="Apasă pentru inimioare!"
            >
              <HelloKittyFace size={50} bowColor="#f43f5e" expression="love" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-cute">
                Călătoria Vieții Noastre: Pas cu Pas
              </h3>
              <p className="text-xs sm:text-sm text-pink-600 font-medium">
                Toate etapele frumoase promise de Dominik pentru Mara
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-pink-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {FUTURE_MILESTONES.map((item, idx) => {
            const isLast = idx === FUTURE_MILESTONES.length - 1;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative group"
              >
                {/* Node on Timeline */}
                <div className={`absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-115 ${
                  isLast
                    ? 'bg-rose-500 border-rose-600 text-white shadow-md shadow-rose-200 animate-pulse'
                    : 'bg-white border-pink-300 text-pink-600 shadow-xs'
                }`}>
                  {isLast ? <Heart className="w-4 h-4 fill-white" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>

                {/* Milestone Content Card */}
                <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isLast
                    ? 'bg-gradient-to-r from-rose-50 via-pink-50 to-pink-100 border-rose-300 shadow-md'
                    : 'bg-pink-50/50 hover:bg-pink-50 border-pink-200/80 hover:border-pink-300 shadow-2xs'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-pink-200">
                        {getMilestoneIcon(item.icon)}
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-800 font-cute">
                        {item.title}
                      </h4>
                    </div>

                    <span className="text-xs font-bold text-rose-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-pink-200 self-start sm:self-auto">
                      {item.timelineLabel}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">
                    {item.description}
                  </p>

                  {isLast && (
                    <div className="mt-4 pt-3 border-t border-rose-200 flex items-center gap-2 text-xs font-bold text-rose-600">
                      <Sparkles className="w-4 h-4" />
                      <span>Promisiunea noastră de suflet: Fericiți până la adânci bătrâneți! 👵👴❤️</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Bucket List / Notițe pentru viitor */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-xl shadow-pink-100/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-100">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-cute flex items-center gap-2">
              <span>Notițe & Bucket List Pentru Noi Doi</span>
              <HelloKittyBow size={24} color="#f43f5e" />
            </h3>
            <p className="text-xs sm:text-sm text-pink-600 font-medium">
              Lucruri mici și mari pe care vrem să le facem împreună. Bifează-le pe măsură ce le împlinim!
            </p>
          </div>
        </div>

        {/* Bucket List Items */}
        <div className="space-y-3 mb-6">
          {bucketList.map((item) => (
            <div
              key={item.id}
              onClick={(e) => handleToggleBucket(item.id, e)}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.isCompleted
                  ? 'bg-rose-50/60 border-rose-200 opacity-90'
                  : 'bg-white hover:bg-pink-50/60 border-pink-200 hover:border-pink-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="shrink-0 text-pink-500 hover:text-rose-600 transition-colors"
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-500 fill-pink-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-pink-400" />
                  )}
                </button>
                <span
                  className={`text-xs sm:text-sm font-semibold transition-all ${
                    item.isCompleted
                      ? 'line-through text-slate-400'
                      : 'text-slate-800'
                  }`}
                >
                  {item.text}
                </span>
              </div>

              {/* Heart counter button */}
              <button
                type="button"
                onClick={(e) => handleAddHeart(item.id, e)}
                className="px-2.5 py-1 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold flex items-center gap-1 shrink-0 transition-transform active:scale-90"
                title="Dă o inimioară acestui vis!"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{item.heartCount}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Add New Dream Input Form */}
        <form onSubmit={handleAddDream} className="flex gap-2">
          <input
            type="text"
            value={newDream}
            onChange={(e) => setNewDream(e.target.value)}
            placeholder="Adaugă un nou vis sau o dorință pentru noi doi..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-xs sm:text-sm bg-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adaugă vis</span>
          </button>
        </form>
      </div>
    </section>
  );
};
