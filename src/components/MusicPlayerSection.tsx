import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Sparkles,
  Volume2,
  Volume1,
  VolumeX,
  Disc3,
  Repeat,
  Headphones,
} from 'lucide-react';
import { Song } from '../types';
import { SONGS_PLAYLIST } from '../data/anniversaryData';
import { HelloKittyFace, HelloKittyBow } from './HelloKittyVector';
import { musicBox } from '../utils/audio';
import { triggerHeartExplosion } from '../utils/confetti';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const MusicPlayerSection: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [lovedSongs, setLovedSongs] = useState<Record<string, boolean>>({});
  const [playbackMode, setPlaybackMode] = useState<'mp3' | 'box'>('mp3');
  const [waveStep, setWaveStep] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong: Song = SONGS_PLAYLIST[currentSongIndex] || SONGS_PLAYLIST[0];
  const activeAudioUrl = currentSong.audioUrl || '/audio/arctic_monkeys_i_wanna_be_yours.mp3';

  // Animation frame for waveform visualizer
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const loop = () => {
        setWaveStep((prev) => (prev + 1) % 100);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      musicBox.stop();
    };
  }, []);

  // Control playback when current song changes
  useEffect(() => {
    if (playbackMode === 'mp3' && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);

      if (isPlaying) {
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Playback notice:', err);
          });
        }
      }
    } else if (playbackMode === 'box') {
      if (isPlaying) {
        musicBox.play(currentSong.melodyType);
      }
    }
  }, [currentSongIndex, playbackMode]);

  const togglePlay = () => {
    if (isPlaying) {
      if (playbackMode === 'mp3' && audioRef.current) {
        audioRef.current.pause();
      } else {
        musicBox.stop();
      }
      setIsPlaying(false);
    } else {
      if (playbackMode === 'mp3' && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          triggerHeartExplosion();
        }).catch((err) => {
          console.warn('Audio play error, attempting load then play', err);
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              triggerHeartExplosion();
            }).catch((err2) => {
              console.warn('Audio retry play failed:', err2);
              musicBox.play(currentSong.melodyType);
              setIsPlaying(true);
            });
          }
        });
      } else {
        musicBox.play(currentSong.melodyType);
        setIsPlaying(true);
        triggerHeartExplosion();
      }
    }
  };

  const handleNext = () => {
    const nextIdx = (currentSongIndex + 1) % SONGS_PLAYLIST.length;
    setCurrentSongIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentSongIndex - 1 + SONGS_PLAYLIST.length) % SONGS_PLAYLIST.length;
    setCurrentSongIndex(prevIdx);
  };

  const selectSong = (index: number) => {
    if (index === currentSongIndex) {
      if (!isPlaying) {
        togglePlay();
      }
      return;
    }
    setCurrentSongIndex(index);
    setIsPlaying(true);
    triggerHeartExplosion();
    if (playbackMode === 'box') {
      musicBox.play(SONGS_PLAYLIST[index].melodyType);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleLove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHeartExplosion(e.clientX, e.clientY);
    setLovedSongs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="music" className="py-12 px-4 max-w-6xl mx-auto">
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={activeAudioUrl}
        preload="auto"
        loop={isLooping}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          if (!isLooping) {
            handleNext();
          }
        }}
        onError={(e) => {
          console.warn('Audio element error:', e);
        }}
      />

      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold tracking-wide uppercase mb-2">
          <Music className="w-3.5 h-3.5 text-pink-600" />
          Secțiunea 3 • Player Muzical MP3 Romantic
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 font-cute flex items-center justify-center gap-2">
          <span>Melodiile Care Ne Definesc</span>
          <HelloKittyBow size={28} color="#f43f5e" />
        </h2>
        <p className="text-sm sm:text-base text-pink-700/80 mt-1 max-w-xl mx-auto font-medium">
          Cele 8 piese alese special pentru povestea noastră de iubire. Dă play și ascultă melodiile noastre de suflet!
        </p>
      </div>

      {/* Main Music Player Card */}
      <div className="bg-gradient-to-br from-white via-pink-50/60 to-rose-50 rounded-3xl p-6 sm:p-10 border-2 border-pink-200 shadow-xl shadow-pink-100/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Rotating Vinyl Player */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Rotating Vinyl Disc */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
                className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 border-8 border-pink-200 shadow-2xl flex items-center justify-center relative overflow-hidden"
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-3 rounded-full border border-slate-700/50" />
                <div className="absolute inset-7 rounded-full border border-slate-700/60" />
                <div className="absolute inset-12 rounded-full border border-slate-700/70" />
                <div className="absolute inset-18 rounded-full border border-slate-700/80" />

                {/* Center Hello Kitty Label */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-4 border-white flex items-center justify-center shadow-md relative z-10">
                  <HelloKittyFace size={52} bowColor="#ffffff" expression={isPlaying ? 'love' : 'happy'} />
                </div>
              </motion.div>

              {/* Music Tonearm Needle */}
              <div
                className={`absolute -top-2 right-1 w-16 h-28 pointer-events-none transition-transform duration-500 origin-top-right ${
                  isPlaying ? 'rotate-[-5deg]' : 'rotate-[-35deg]'
                }`}
              >
                <div className="w-2 h-20 bg-slate-400 rounded-full shadow-sm ml-auto mr-4" />
                <div className="w-5 h-6 bg-pink-400 rounded-md ml-auto mr-2.5 shadow-md" />
              </div>
            </div>

            {/* Visualizer Wave Bars */}
            <div className="flex items-center gap-1.5 h-10 mt-6">
              {[...Array(16)].map((_, i) => {
                const height = isPlaying
                  ? Math.sin((waveStep * 0.25) + i * 0.45) * 14 + 18
                  : 5;

                return (
                  <motion.div
                    key={i}
                    animate={{ height: `${height}px` }}
                    transition={{ duration: 0.1 }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-pink-400 to-rose-500"
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column: Song Details, Timeline Scrubber & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  În redare • {currentSongIndex + 1} / {SONGS_PLAYLIST.length}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 animate-pulse">
                    <Headphones className="w-3 h-3" />
                    Audio Activ
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => toggleLove(currentSong.id, e)}
                className="p-2 rounded-full hover:bg-pink-100 transition-colors cursor-pointer"
                title="Melodie favorită"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    lovedSongs[currentSong.id]
                      ? 'fill-rose-500 text-rose-500 scale-110'
                      : 'text-pink-400 hover:text-rose-500'
                  }`}
                />
              </button>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 font-cute truncate">
              {currentSong.title}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-rose-500 mt-0.5">
              {currentSong.artist} • {currentSong.duration}
            </p>

            {/* Dedication Quote */}
            <div className="my-4 p-3.5 sm:p-4 rounded-2xl bg-white/85 border border-pink-200 shadow-xs relative">
              <span className="text-[11px] font-bold text-pink-500 uppercase tracking-wider block mb-1">
                De ce ne definește această piesă:
              </span>
              <p className="font-handwriting text-lg sm:text-xl text-slate-800 leading-snug">
                {currentSong.dedication}
              </p>
            </div>

            {/* Audio Progress Scrubber (Real MP3 Timeline) */}
            <div className="my-2 bg-pink-100/60 p-3 rounded-2xl border border-pink-200/80">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-pink-700 mb-1.5 px-1">
                <span>{formatTime(currentTime)}</span>
                <span className="text-pink-400 font-normal">
                  {duration > 0 ? formatTime(duration) : currentSong.duration}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Controls Bar: Prev, Play/Pause, Next, Volume & Loop */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 sm:p-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-transform active:scale-90 cursor-pointer"
                  title="Melodia precedentă"
                >
                  <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-200 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                  title={isPlaying ? 'Pauză' : 'Redă melodia'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 sm:p-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-transform active:scale-90 cursor-pointer"
                  title="Melodia următoare"
                >
                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                    isLooping ? 'bg-rose-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  }`}
                  title={isLooping ? 'Repetare activată' : 'Activează repetarea piesei'}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider & Mode Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1.5 rounded-xl border border-pink-200">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-pink-600 hover:text-pink-800 cursor-pointer"
                    title={isMuted ? 'Activează sunetul' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1.5 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    title="Volum MP3"
                  />
                </div>

                {/* Synth Box Switcher */}
                <button
                  type="button"
                  onClick={() => {
                    const newMode = playbackMode === 'mp3' ? 'box' : 'mp3';
                    setPlaybackMode(newMode);
                    if (isPlaying) {
                      if (newMode === 'box') {
                        audioRef.current?.pause();
                        musicBox.play(currentSong.melodyType);
                      } else {
                        musicBox.stop();
                        audioRef.current?.play().catch(console.warn);
                      }
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-pink-100/80 hover:bg-pink-200 text-[11px] font-bold text-pink-800 border border-pink-300 transition-all cursor-pointer"
                  title="Schimbă între Player MP3 și Cutiuță Muzicală"
                >
                  {playbackMode === 'mp3' ? '🎵 Mod MP3' : '🔔 Mod Cutiuță'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Tracks List */}
        <div className="mt-10 pt-6 border-t border-pink-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span>Toate melodiile noastre de cuplu</span>
              <span className="text-xs text-pink-500 font-normal">({SONGS_PLAYLIST.length} piese)</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {SONGS_PLAYLIST.map((song, idx) => {
              const isSelected = idx === currentSongIndex;
              return (
                <div
                  key={song.id}
                  onClick={() => selectSong(idx)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-200'
                      : 'bg-white hover:bg-pink-50/50 border-pink-100'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {isSelected && isPlaying ? (
                        <Disc3 className="w-5 h-5 animate-spin" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {song.title}
                      </p>
                      <p className="text-[11px] text-pink-600 truncate">{song.artist}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                    {song.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

