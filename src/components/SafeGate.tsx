import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Delete, RotateCcw, Heart, Sparkles, KeyRound, HelpCircle } from 'lucide-react';
import { HelloKittyFace, HelloKittyBow } from './HelloKittyVector';
import { playKeypadBeep, playErrorBuzz } from '../utils/audio';
import { triggerGrandCelebration, triggerHeartExplosion } from '../utils/confetti';
import { CORRECT_SAFE_PIN } from '../data/anniversaryData';

interface SafeGateProps {
  onUnlock: () => void;
}

export const SafeGate: React.FC<SafeGateProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDigit = (digit: string) => {
    if (isUnlocking || pin.length >= 4) return;
    playKeypadBeep(digit);
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      validatePin(newPin);
    }
  };

  const handleDelete = () => {
    if (isUnlocking || pin.length === 0) return;
    playKeypadBeep('del');
    setPin(pin.slice(0, -1));
    setIsError(false);
  };

  const handleClear = () => {
    if (isUnlocking) return;
    playKeypadBeep('clear');
    setPin('');
    setIsError(false);
  };

  const validatePin = (code: string) => {
    if (code === CORRECT_SAFE_PIN) {
      setIsUnlocking(true);
      triggerGrandCelebration();
      setTimeout(() => {
        onUnlock();
      }, 1800);
    } else {
      setIsError(true);
      playErrorBuzz();
      setErrorMessage('Ooopsie, prințesa mea! Nu e acesta codul... Mai încearcă! 💕');
      setTimeout(() => {
        setPin('');
        setIsError(false);
      }, 1000);
    }
  };

  // Keyboard support for typing digits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocking) return;
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isUnlocking]);

  const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-pink-100 via-rose-50 to-pink-200 relative overflow-hidden">
      {/* Floating background decorative hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300/40 select-none animate-float"
            style={{
              top: `${(i * 19) % 95}%`,
              left: `${(i * 27 + 5) % 92}%`,
              fontSize: `${(i % 3) * 12 + 18}px`,
              animationDelay: `${(i % 5) * 0.8}s`,
            }}
          >
            {i % 2 === 0 ? '💖' : '🎀'}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Safe Outer Enclosure */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(244,114,182,0.25)] border-4 border-pink-200 text-center">
          {/* Top Hello Kitty Decor Header */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onClick={(e) => triggerHeartExplosion(e.clientX, e.clientY)}
              title="Apasă pe Hello Kitty pentru inimioare!"
            >
              <HelloKittyFace size={88} bowColor="#f43f5e" expression={isUnlocking ? 'love' : 'wink'} />
            </div>
          </div>

          <div className="mt-8 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              Surpriză Aniversară: 9 Luni
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight font-cute leading-tight">
              Care a fost data în care mi-ai spus DA? 💕
            </h1>
            <p className="text-xs sm:text-sm text-pink-600 mt-1 font-medium">
              Pentru prințesa mea Mara, cu toată dragostea de la Dominik
            </p>
          </div>

          {/* Digital Safe Display */}
          <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-2 border-pink-200 shadow-inner">
            {/* Animated Lock Icon */}
            <div className="flex justify-center mb-3">
              <AnimatePresence mode="wait">
                {isUnlocking ? (
                  <motion.div
                    key="unlocked"
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1.25, rotate: 0 }}
                    className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-300"
                  >
                    <Unlock className="w-7 h-7 text-white animate-bounce" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="locked"
                    animate={isError ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="w-12 h-12 rounded-full bg-pink-100 border-2 border-pink-300 text-pink-600 flex items-center justify-center shadow-sm"
                  >
                    <Lock className="w-6 h-6 text-pink-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4 Digit Slots */}
            <motion.div
              animate={isError ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.45 }}
              className="flex justify-center items-center gap-3 sm:gap-4 my-2"
            >
              {[0, 1, 2, 3].map((slotIdx) => {
                const hasValue = pin.length > slotIdx;
                const digit = pin[slotIdx];

                return (
                  <div
                    key={slotIdx}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-cute transition-all duration-200 border-2 ${
                      isUnlocking
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-105'
                        : isError
                        ? 'bg-red-50 text-red-600 border-red-300 shadow-inner'
                        : hasValue
                        ? 'bg-pink-100 text-pink-800 border-pink-400 shadow-sm scale-105'
                        : 'bg-white text-pink-300 border-dashed border-pink-200'
                    }`}
                  >
                    {hasValue ? (
                      isUnlocking ? (
                        <Heart className="w-6 h-6 fill-white text-white" />
                      ) : (
                        digit
                      )
                    ) : (
                      <span className="text-pink-300 text-xl font-light">♥</span>
                    )}
                  </div>
                );
              })}
            </motion.div>

            {/* Status / Error Message */}
            <div className="h-6 mt-2 flex items-center justify-center text-xs font-semibold">
              {isUnlocking ? (
                <span className="text-rose-600 animate-pulse flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4" /> Seif deschis! Bun venit în povestea noastră! 💕
                </span>
              ) : isError ? (
                <span className="text-red-500">{errorMessage}</span>
              ) : (
                <span className="text-pink-500/80">Introdu cele 4 cifre magice ale noastre</span>
              )}
            </div>
          </div>

          {/* Cute Pink Keypad */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 px-2 sm:px-4">
            {numpadKeys.map((digit) => (
              <button
                key={digit}
                type="button"
                id={`numpad-btn-${digit}`}
                disabled={isUnlocking}
                onClick={() => handleDigit(digit)}
                className="h-14 sm:h-16 rounded-2xl bg-pink-50/90 hover:bg-pink-100 active:bg-pink-200 text-pink-900 font-bold text-2xl font-cute border-2 border-pink-200/80 shadow-sm hover:shadow transition-all duration-150 active:scale-95 flex items-center justify-center disabled:opacity-50 cursor-pointer"
              >
                {digit}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              id="numpad-clear"
              disabled={isUnlocking}
              onClick={handleClear}
              className="h-14 sm:h-16 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs border-2 border-rose-200/80 shadow-sm transition-all duration-150 active:scale-95 flex flex-col items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
              title="Resetează"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px] tracking-wider uppercase font-bold">Șterge tot</span>
            </button>

            {/* Digit 0 */}
            <button
              type="button"
              id="numpad-btn-0"
              disabled={isUnlocking}
              onClick={() => handleDigit('0')}
              className="h-14 sm:h-16 rounded-2xl bg-pink-50/90 hover:bg-pink-100 active:bg-pink-200 text-pink-900 font-bold text-2xl font-cute border-2 border-pink-200/80 shadow-sm hover:shadow transition-all duration-150 active:scale-95 flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              0
            </button>

            {/* Backspace Delete Button */}
            <button
              type="button"
              id="numpad-delete"
              disabled={isUnlocking}
              onClick={handleDelete}
              className="h-14 sm:h-16 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs border-2 border-rose-200/80 shadow-sm transition-all duration-150 active:scale-95 flex flex-col items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
              title="Șterge ultima cifră"
            >
              <Delete className="w-5 h-5" />
              <span className="text-[10px] tracking-wider uppercase font-bold">Înapoi</span>
            </button>
          </div>

          {/* Hint Dropdown */}
          <div className="mt-5 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-800 font-semibold underline underline-offset-4 decoration-pink-300 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Ascunde indiciul' : 'Ai nevoie de un indiciu de la Dominik? 💌'}
            </button>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="p-3 bg-pink-100/70 border border-pink-300 rounded-xl text-xs text-pink-900 text-left">
                    <p className="font-bold flex items-center gap-1.5 text-pink-800 mb-1">
                      <KeyRound className="w-3.5 h-3.5 text-pink-600" />
                      Indiciu de la Dominik:
                    </p>
                    <p className="font-medium text-pink-950 italic">
                      "Ziua in care TU mi-ai spus, ca pana si Kota are iubita, numai eu nu, ia de acolo restul e istorie..."
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Hello Kitty Bow Accent */}
        <div className="flex justify-center mt-4">
          <HelloKittyBow size={36} color="#fb7185" />
        </div>
      </motion.div>
    </div>
  );
};
