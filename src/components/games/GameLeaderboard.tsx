import React, { useState } from 'react';
import { Trophy, Crown, Heart, Sparkles, Send, Flame, Zap, User } from 'lucide-react';
import { GameHighScores, PlayerName, ScoreRecord } from '../../types/games';
import { triggerHeartExplosion } from '../../utils/confetti';

interface GameLeaderboardProps {
  player: PlayerName;
  onPlayerChange: (player: PlayerName) => void;
  highScores: GameHighScores;
  recentActivity: ScoreRecord[];
  onSendCheer: () => void;
}

export const GameLeaderboard: React.FC<GameLeaderboardProps> = ({
  player,
  onPlayerChange,
  highScores,
  recentActivity,
  onSendCheer,
}) => {
  const [cheerSent, setCheerSent] = useState<boolean>(false);

  const flappyDominik = highScores['flappy-pigeon'].dominik;
  const flappyMara = highScores['flappy-pigeon'].mara;

  const catcherDominik = highScores['love-catcher'].dominik;
  const catcherMara = highScores['love-catcher'].mara;

  const handleCheerClick = (e: React.MouseEvent) => {
    triggerHeartExplosion(e.clientX, e.clientY);
    onSendCheer();
    setCheerSent(true);
    setTimeout(() => setCheerSent(false), 2500);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 border-2 border-pink-200 shadow-xl flex flex-col gap-5">
      {/* Player Switcher Card */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3.5 rounded-2xl border border-pink-200">
        <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider block mb-2 text-center">
          Alege cine joacă pe acest dispozitiv:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onPlayerChange('Dominik')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              player === 'Dominik'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-200 scale-102 ring-2 ring-blue-300'
                : 'bg-white hover:bg-pink-100 text-slate-700 border border-pink-200'
            }`}
          >
            <span className="text-base">👦🏻</span>
            <span>Dominik</span>
          </button>

          <button
            type="button"
            onClick={() => onPlayerChange('Mara')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              player === 'Mara'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-102 ring-2 ring-rose-300'
                : 'bg-white hover:bg-pink-100 text-slate-700 border border-pink-200'
            }`}
          >
            <span className="text-base">👧🏼</span>
            <span>Mara</span>
          </button>
        </div>
      </div>

      {/* Duel Scoreboard Card */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 font-cute">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Clasament Live: Dominik vs Mara</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>

        {/* Game 1: Porumbelul Indragostit */}
        <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>🕊️</span> Porumbelul Îndrăgostit
            </span>
            <span className="text-[10px] text-pink-600 font-semibold">
              {flappyDominik === flappyMara && flappyDominik > 0
                ? 'Egalitate perfectă! 🤝'
                : flappyDominik > flappyMara
                ? 'Dominik conduce! 👑'
                : flappyMara > flappyDominik
                ? 'Mara conduce! 👑'
                : 'Fără scor încă'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className={`p-2.5 rounded-xl border relative ${flappyDominik >= flappyMara && flappyDominik > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-pink-100'}`}>
              {flappyDominik > flappyMara && (
                <Crown className="w-4 h-4 text-amber-500 absolute -top-2 left-1/2 -translate-x-1/2" />
              )}
              <span className="text-[10px] font-bold text-slate-500 block">Dominik 👦🏻</span>
              <span className="text-xl font-black text-blue-600 font-cute">{flappyDominik}</span>
            </div>

            <div className={`p-2.5 rounded-xl border relative ${flappyMara >= flappyDominik && flappyMara > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-pink-100'}`}>
              {flappyMara > flappyDominik && (
                <Crown className="w-4 h-4 text-amber-500 absolute -top-2 left-1/2 -translate-x-1/2" />
              )}
              <span className="text-[10px] font-bold text-slate-500 block">Mara 👧🏼</span>
              <span className="text-xl font-black text-rose-600 font-cute">{flappyMara}</span>
            </div>
          </div>
        </div>

        {/* Game 2: Prinde Dragostea */}
        <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>🧺</span> Prinde Dragostea
            </span>
            <span className="text-[10px] text-pink-600 font-semibold">
              {catcherDominik === catcherMara && catcherDominik > 0
                ? 'Egalitate! 🤝'
                : catcherDominik > catcherMara
                ? 'Dominik conduce! 👑'
                : catcherMara > catcherDominik
                ? 'Mara conduce! 👑'
                : 'Fără scor încă'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className={`p-2.5 rounded-xl border relative ${catcherDominik >= catcherMara && catcherDominik > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-pink-100'}`}>
              {catcherDominik > catcherMara && (
                <Crown className="w-4 h-4 text-amber-500 absolute -top-2 left-1/2 -translate-x-1/2" />
              )}
              <span className="text-[10px] font-bold text-slate-500 block">Dominik 👦🏻</span>
              <span className="text-xl font-black text-blue-600 font-cute">{catcherDominik}</span>
            </div>

            <div className={`p-2.5 rounded-xl border relative ${catcherMara >= catcherDominik && catcherMara > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-pink-100'}`}>
              {catcherMara > catcherDominik && (
                <Crown className="w-4 h-4 text-amber-500 absolute -top-2 left-1/2 -translate-x-1/2" />
              )}
              <span className="text-[10px] font-bold text-slate-500 block">Mara 👧🏼</span>
              <span className="text-xl font-black text-rose-600 font-cute">{catcherMara}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Cheer Button */}
      <button
        type="button"
        onClick={handleCheerClick}
        className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
      >
        <Heart className="w-4 h-4 fill-white" />
        <span>
          {cheerSent
            ? `Inimioare trimise live către ${player === 'Dominik' ? 'Mara' : 'Dominik'}! 💕`
            : `Trimite o îmbrățișare live către ${player === 'Dominik' ? 'Mara' : 'Dominik'}! 💖`}
        </span>
      </button>

      {/* Live Recent Activity Feed */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-rose-500" />
          <span>Activitate Live pe ambele dispozitive</span>
        </h4>

        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {recentActivity.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">
              Niciun joc jucat încă. Începeți primul meci! 🚀
            </p>
          ) : (
            recentActivity.slice(0, 8).map((record) => {
              const isDominik = record.player === 'Dominik';
              const gameName =
                record.game === 'flappy-pigeon' ? 'Porumbelul Îndrăgostit 🕊️' : 'Prinde Dragostea 🧺';

              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-pink-50/50 border border-slate-100 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{isDominik ? '👦🏻' : '👧🏼'}</span>
                    <div>
                      <span className={`font-bold ${isDominik ? 'text-blue-600' : 'text-rose-600'}`}>
                        {record.player}
                      </span>
                      <span className="text-slate-600 ml-1">la {gameName}</span>
                    </div>
                  </div>
                  <span className="font-black text-slate-800 font-cute bg-white px-2 py-0.5 rounded-lg border border-pink-100 shadow-2xs">
                    {record.score} pct
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
