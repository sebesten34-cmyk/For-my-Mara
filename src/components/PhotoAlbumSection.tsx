import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn, Upload, Check } from 'lucide-react';
import { MonthAlbum, PhotoItem } from '../types';
import { INITIAL_MONTHS } from '../data/anniversaryData';
import { loadSavedAlbums, saveAlbumsToStorage, readFileAsDataUrl } from '../utils/photoStorage';
import { crossDevicePhotos } from '../services/crossDevicePhotos';
import { HelloKittyFace, HelloKittyBow } from './HelloKittyVector';
import { triggerHeartExplosion } from '../utils/confetti';
import { playHeartPop } from '../utils/audio';

export const PhotoAlbumSection: React.FC = () => {
  const [months, setMonths] = useState<MonthAlbum[]>(() => crossDevicePhotos.mergeWithServerPhotos(INITIAL_MONTHS));
  const [activeMonthId, setActiveMonthId] = useState<number>(1); // Default to Month 1 (Decembrie 2025)
  const [selectedPhoto, setSelectedPhoto] = useState<{ photo: PhotoItem; monthName: string; monthId: number } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load persistent photos from server (synced across all devices) & IndexedDB
  useEffect(() => {
    // 1. Initial load from local IndexedDB cache
    loadSavedAlbums().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setMonths((prev) => crossDevicePhotos.mergeWithServerPhotos(loaded));
      }
    }).catch(console.error);

    // 2. Realtime listener for cross-device photo updates
    const unsubscribe = crossDevicePhotos.subscribe(() => {
      setMonths((prev) => crossDevicePhotos.mergeWithServerPhotos(prev));
    });

    return () => unsubscribe();
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPhoto) return;

    try {
      setIsUploading(true);
      const dataUrl = await readFileAsDataUrl(file);

      const updatedMonths = months.map((m) => {
        if (m.id !== selectedPhoto.monthId) return m;
        return {
          ...m,
          photos: m.photos.map((p) => {
            if (p.id !== selectedPhoto.photo.id) return p;
            return {
              ...p,
              url: dataUrl,
              isCustom: true,
            };
          }) as [PhotoItem, PhotoItem, PhotoItem],
        };
      });

      setMonths(updatedMonths);

      // Save locally to IndexedDB
      await saveAlbumsToStorage(updatedMonths);

      // Save cross-device to server so ALL devices (Mara's phone, Dominik's phone, etc.) see it instantly!
      await crossDevicePhotos.savePhoto(selectedPhoto.monthId, selectedPhoto.photo.id, dataUrl);

      setSelectedPhoto((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          photo: {
            ...prev.photo,
            url: dataUrl,
            isCustom: true,
          },
        };
      });

      setUploadSuccess(true);
      triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving uploaded photo:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const currentMonth = months.find((m) => m.id === activeMonthId) || months[0];

  return (
    <section id="photos" className="py-12 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold tracking-wide uppercase mb-2">
          <Camera className="w-3.5 h-3.5 text-pink-600" />
          Secțiunea 2 • Amintiri în Imagini
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 font-cute flex items-center justify-center gap-2">
          <span>Album Foto: 9 Luni de Poveste</span>
          <HelloKittyBow size={28} color="#f43f5e" />
        </h2>
        <p className="text-sm sm:text-base text-pink-700/80 mt-1 max-w-xl mx-auto font-medium">
          9 capitole pline de iubire și amintiri de neuitat, păstrate pentru totdeauna în inima noastră! 💕
        </p>

        {/* Real-time sync badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mt-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sincronizare Live: Pozele încărcate apar instantaneu pe ambele telefoane (Mara & Dominik) 📱💕</span>
        </div>

        {/* 9 Months Navigation Selector */}
        <div className="flex items-center justify-start sm:justify-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {months.map((m) => {
            const isSelected = m.id === activeMonthId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  playHeartPop();
                  setActiveMonthId(m.id);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                    : 'bg-white hover:bg-pink-100 text-pink-800 border border-pink-200'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-85">Luna {m.id}</span>
                <span>{m.monthName.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Month Scrapbook Presentation */}
      <motion.div
        key={currentMonth.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-xl shadow-pink-100/60"
      >
        {/* Month Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-pink-100 pb-5 mb-8">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onClick={(e) => triggerHeartExplosion(e.clientX, e.clientY)}
              title="Apasă pentru inimioare!"
            >
              <HelloKittyFace size={52} bowColor="#f43f5e" expression={currentMonth.id === 9 ? 'love' : 'wink'} />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-cute">
                  {currentMonth.monthName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                  Luna {currentMonth.id} din 9
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-rose-500 mt-0.5">
                {currentMonth.tagline}
              </p>
            </div>
          </div>

          {/* Month Prev/Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeMonthId <= 1}
              onClick={() => {
                playHeartPop();
                setActiveMonthId((prev) => Math.max(1, prev - 1));
              }}
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 disabled:opacity-40 cursor-pointer"
              title="Luna anterioară"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={activeMonthId >= 9}
              onClick={() => {
                playHeartPop();
                setActiveMonthId((prev) => Math.min(9, prev + 1));
              }}
              className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 disabled:opacity-40 cursor-pointer"
              title="Luna următoare"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Memory Note Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200/80 mb-8 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-pink-900 font-medium italic">
            „{currentMonth.memoryNote}”
          </p>
        </div>

        {/* 3 Photos Grid for the Month */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {currentMonth.photos.map((photo, pIdx) => {
            return (
              <div
                key={photo.id}
                className="relative group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-pink-100 flex flex-col justify-between"
              >
                {/* Cute Washi Tape Decor on Top of Polaroid */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-pink-200/80 backdrop-blur-2xs rounded-xs rotate-[-2deg] border-t border-b border-pink-300/40 z-10 pointer-events-none" />

                {/* Photo Slot Container */}
                <div>
                  <div
                    onClick={() => setSelectedPhoto({ photo, monthName: currentMonth.monthName, monthId: currentMonth.id })}
                    className="relative aspect-4/3 rounded-xl overflow-hidden bg-pink-50 cursor-pointer border border-pink-200"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';
                      }}
                    />

                    {/* Hover Zoom Hint */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <ZoomIn className="w-3.5 h-3.5 text-rose-500" />
                        <span>Apasă pentru mărire</span>
                      </div>
                    </div>

                    {/* Badge showing slot number */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[10px] font-bold">
                      Foto {pIdx + 1} / 3
                    </div>
                  </div>

                  {/* Caption & Date */}
                  <div className="mt-3.5">
                    <span className="text-[11px] font-semibold text-rose-500 block mb-0.5">
                      {photo.dateText}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white rounded-3xl p-4 sm:p-6 border-4 border-pink-300 shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Închide fotografia"
                className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 hover:text-pink-950 border border-pink-300 flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer"
                title="Închide (sau apasă Esc)"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="aspect-16/10 rounded-2xl overflow-hidden bg-black/5 mb-4">
                <img
                  src={selectedPhoto.photo.url}
                  alt={selectedPhoto.photo.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
                <div>
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                    {selectedPhoto.monthName} • {selectedPhoto.photo.dateText}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-800 font-cute mt-0.5">
                    {selectedPhoto.photo.caption}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3.5 py-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-xs flex items-center gap-1.5 shadow-sm border border-pink-300 cursor-pointer transition-transform active:scale-95"
                    title="Încarcă fișierul PNG original de pe dispozitivul tău"
                  >
                    {uploadSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Poză salvată pentru totdeauna!</span>
                      </>
                    ) : isUploading ? (
                      <span>Se salvează...</span>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-pink-600" />
                        <span>Schimbă cu poza originală (PNG/JPG)</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadFile}
                  />

                  <button
                    type="button"
                    onClick={(e) => triggerHeartExplosion(e.clientX, e.clientY)}
                    className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-200 cursor-pointer transition-transform active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    Trimite dragoste! 💕
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    Închide
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
