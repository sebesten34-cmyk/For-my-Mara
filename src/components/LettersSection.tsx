import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, Heart, X, Plus, Shuffle, Feather } from 'lucide-react';
import { Letter } from '../types';
import { INITIAL_LETTERS } from '../data/anniversaryData';
import { HelloKittyFace, HelloKittyBow } from './HelloKittyVector';
import { triggerHeartExplosion } from '../utils/confetti';
import { playHeartPop } from '../utils/audio';

const STORAGE_KEY = 'dominik_mara_letters_v3';

export const LettersSection: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_LETTERS;
  });

  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Toate');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form for new letter
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Dor');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
    } catch (e) {
      console.warn('Could not save letters to local storage', e);
    }
  }, [letters]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedLetter(null);
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = ['Toate', 'Mângâiere & Liniște', 'Nopți dulci', 'Valoare & Frumusețe', 'Dor & Dorință', 'Vise & Eternitate'];

  const filteredLetters = activeCategory === 'Toate'
    ? letters
    : letters.filter((l) => l.category.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4)));

  const handleOpenLetter = (letter: Letter, e?: React.MouseEvent) => {
    if (e) {
      triggerHeartExplosion(e.clientX, e.clientY);
    } else {
      playHeartPop();
    }
    setSelectedLetter(letter);
  };

  const handlePickRandom = (e: React.MouseEvent) => {
    triggerHeartExplosion(e.clientX, e.clientY);
    const randomIndex = Math.floor(Math.random() * letters.length);
    setSelectedLetter(letters[randomIndex]);
  };

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newLetterItem: Letter = {
      id: `custom-letter-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      subtitle: 'Scrisă din inimă pentru prințesa mea',
      content: newContent.trim(),
      envelopeColor: 'from-rose-100 to-pink-200',
      stampEmoji: '💌',
      dateAdded: new Date().toLocaleDateString('ro-RO'),
    };

    setLetters([newLetterItem, ...letters]);
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
    setSelectedLetter(newLetterItem);
  };

  return (
    <section id="letters" className="py-12 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold tracking-wide uppercase mb-2">
          <Mail className="w-3.5 h-3.5 text-pink-600" />
          Sectiunea 1 • Scrisori de Dragoste
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 font-cute flex items-center justify-center gap-2">
          <span>Read when you miss me</span>
          <HelloKittyBow size={28} color="#f43f5e" />
        </h2>
        <p className="text-sm sm:text-base text-pink-700/80 mt-1 max-w-xl mx-auto font-medium">
          Ori de câte ori suntem departe sau simți nevoia unei îmbrățișări, deschide o scrisoare de la mine.
        </p>

        {/* Action Buttons: Pick Random & Add New */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button
            type="button"
            onClick={handlePickRandom}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-200 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            Trage o scrisoare la întâmplare 🎲
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-pink-50 text-pink-700 font-bold text-xs sm:text-sm border-2 border-pink-300 shadow-sm flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-pink-500" />
            Adaugă o scrisoare nouă ✍️
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-pink-100/70 text-pink-700 hover:bg-pink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLetters.map((letter) => (
          <motion.div
            key={letter.id}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => handleOpenLetter(letter, e)}
            className="group cursor-pointer"
          >
            <div className={`relative bg-gradient-to-br ${letter.envelopeColor} rounded-3xl p-6 border-2 border-pink-300/80 shadow-md shadow-pink-100 overflow-hidden min-h-[220px] flex flex-col justify-between transition-shadow group-hover:shadow-xl group-hover:shadow-pink-200`}>
              {/* Envelope flap aesthetic styling */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-white/30 backdrop-blur-2xs border-b border-pink-300/50 [clip-path:polygon(0_0,50%_100%,100%_0)]" />

              {/* Hello Kitty Stamp in Top Right */}
              <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white border border-pink-300 flex items-center justify-center shadow-xs rotate-6 group-hover:rotate-12 transition-transform">
                <span className="text-lg">{letter.stampEmoji}</span>
              </div>

              {/* Tag / Category */}
              <div className="pt-6">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/80 text-pink-700 font-bold text-[11px] mb-2 border border-pink-200">
                  {letter.category}
                </span>
                <h3 className="text-lg font-bold text-slate-800 font-cute group-hover:text-rose-600 transition-colors leading-snug">
                  {letter.title}
                </h3>
                <p className="text-xs text-pink-800/80 mt-1 line-clamp-2 italic">
                  "{letter.subtitle}"
                </p>
              </div>

              {/* Bottom footer of envelope */}
              <div className="pt-4 border-t border-pink-300/50 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                  <Feather className="w-3.5 h-3.5" />
                  De la Dominik
                </span>
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Deschide plicul 💌
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Letter Reading Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedLetter(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[88vh] my-auto bg-[#fffaf5] rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-pink-300 overflow-y-auto flex flex-col justify-between"
            >
              {/* Close Button - Top Right */}
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                aria-label="Închide scrisoarea"
                className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 hover:text-pink-900 border border-pink-300 flex items-center justify-center transition-transform active:scale-95 shadow-sm cursor-pointer"
                title="Închide (sau apasă Esc)"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div>
                {/* Romantic Letter Header */}
                <div className="flex items-center justify-between border-b-2 border-pink-200 pb-4 mb-5 pr-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
                      onClick={(e) => triggerHeartExplosion(e.clientX, e.clientY)}
                      title="Apasă pentru inimioare!"
                    >
                      <HelloKittyFace size={46} bowColor="#f43f5e" expression="love" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                        {selectedLetter.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-cute">
                        {selectedLetter.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Letter Content Styled with romantic cursive handwriting font */}
                <div className="prose prose-pink max-w-none">
                  <p className="font-handwriting text-2xl sm:text-3xl text-slate-800 leading-relaxed whitespace-pre-line tracking-wide">
                    {selectedLetter.content}
                  </p>
                </div>
              </div>

              {/* Sweet Sign-off and Bottom Close / Action Bar */}
              <div className="mt-8 pt-5 border-t-2 border-dashed border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-rose-600 font-handwriting text-2xl">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>Pentru totdeauna al tău, Dominik</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      triggerHeartExplosion(e.clientX, e.clientY);
                    }}
                    className="px-3.5 py-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span>Pupic! 💋</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedLetter(null)}
                    className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-200 cursor-pointer transition-transform active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    <span>Închide scrisoarea</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Custom Letter Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pink-200"
            >
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <HelloKittyBow size={24} color="#f43f5e" />
                <h3 className="text-xl font-bold text-slate-800 font-cute">
                  Scrie o scrisoare nouă de dragoste
                </h3>
              </div>

              <form onSubmit={handleCreateLetter} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titlul scrisorii (ex: Când ai nevoie de un zâmbet):
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ex: Când ți-e dor să ne plimbăm de mână..."
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categorie:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm bg-white"
                  >
                    <option value="Dor & Dorință">Dor & Dorință</option>
                    <option value="Mângâiere & Liniște">Mângâiere & Liniște</option>
                    <option value="Nopți dulci">Nopți dulci</option>
                    <option value="Valoare & Frumusețe">Valoare & Frumusețe</option>
                    <option value="Vise & Eternitate">Vise & Eternitate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Conținutul scrisorii (cuvintele tale dulci):
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Draga mea Mara..."
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-handwriting text-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Renunță
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-200"
                  >
                    Salvează scrisoarea 💌
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
