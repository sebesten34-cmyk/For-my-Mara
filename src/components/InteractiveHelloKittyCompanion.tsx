import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { HelloKittyFace, HelloKittyBow } from './HelloKittyVector';
import { triggerHeartExplosion } from '../utils/confetti';

const CUTE_QUOTES = [
  'Cere pe stele :)',
  'Semnat, unicul tau Brunet',
  'Daca pana si kota a putut...',
  'Scara din fata digului de revelion',
  'Esti blondina mea',
  'Te iubesc enorm, Mara mea! 💕',
  'Blondina mea superbă și unică 👑',
  'Dominik + Mara = Dragoste infinită! ✨',
  '9 luni pline de magie alături de tine 🎀',
  'Un pupic dulce de la brunetul tău 💋',
  'Inima mea îți aparține în totalitate! ❤️',
  'Până la adânci bătrâneți, prințesă! 👵👴',
  'Îți trimit un milion de îmbrățișări strânse! 🧸',
  'Pentru totdeauna doar noi doi! 🌸',
];

export const InteractiveHelloKittyCompanion: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent) => {
    triggerHeartExplosion(e.clientX, e.clientY);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600);

    setQuoteIndex((prev) => (prev + 1) % CUTE_QUOTES.length);
    setShowBubble(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-auto select-none">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-2 max-w-[240px] bg-white rounded-2xl p-2.5 px-3 shadow-lg border-2 border-pink-300 text-xs font-bold text-pink-700 text-center relative font-cute"
          >
            <span>{CUTE_QUOTES[quoteIndex]}</span>
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r-2 border-b-2 border-pink-300 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Interactive Kitty Button */}
      <motion.div
        animate={isRotating ? { rotate: [0, 360], scale: [1, 1.25, 1] } : { y: [0, -6, 0] }}
        transition={
          isRotating
            ? { duration: 0.5, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        }
        onClick={handleClick}
        className="cursor-pointer group relative"
        title="Apasă pe Hello Kitty pentru explozie de dragoste!"
      >
        <div className="p-2 rounded-full bg-white/90 backdrop-blur-xs border-2 border-pink-300 shadow-xl shadow-pink-200/80 hover:shadow-pink-300/90 transition-shadow">
          <HelloKittyFace size={58} bowColor="#f43f5e" expression="wink" />
        </div>

        {/* Pulsing Love Sparkle Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-pulse">
          <Heart className="w-3.5 h-3.5 fill-white" />
        </div>
      </motion.div>
    </div>
  );
};

export const FloatingBackgroundDecor: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="absolute text-pink-300/35 select-none animate-float"
          style={{
            top: `${(i * 17 + 8) % 95}%`,
            left: `${(i * 23 + 4) % 94}%`,
            fontSize: `${(i % 3) * 10 + 16}px`,
            animationDelay: `${(i % 6) * 0.7}s`,
            animationDuration: `${4 + (i % 4)}s`,
          }}
        >
          {i % 3 === 0 ? '💖' : i % 3 === 1 ? '🎀' : '✨'}
        </div>
      ))}
    </div>
  );
};
