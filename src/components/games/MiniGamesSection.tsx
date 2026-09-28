import React, { useState, useEffect } from 'react';
import { Gamepad2, Sparkles, Heart, Bell } from 'lucide-react';
import { GameType, PlayerName, ScoreState } from '../../types/games';
import { realtimeScores } from '../../services/realtimeScores';
import { FlappyPigeon } from './FlappyPigeon';
import { LoveCatcher } from './LoveCatcher';
import { GameLeaderboard } from './GameLeaderboard';
import { triggerHeartExplosion } from '../../utils/confetti';
import { playScoreSound } from '../../utils/gameAudio';

export const MiniGamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('flappy-pigeon');
  const [player, setPlayer] = useState<PlayerName>('Dominik');
  const [scoreState, setScoreState] = useState<ScoreState>({
    highScores: {
      'flappy-pigeon': { dominik: 0, mara: 0 },
      'love-catcher': { dominik: 0, mara: 0 },
    },
    recentActivity: [],
  });

  const [liveToast, setLiveToast] = useState<{
    show: boolean;
    message: string;
    sender?: string;
  }>({ show: false, message: '' });

  // Load player from persistent storage on mount
  useEffect(() => {
    const savedPlayer = realtimeScores.getPlayer();
    setPlayer(savedPlayer);

    // Subscribe to real-time score updates across all devices
    const unsubscribeScores = realtimeScores.subscribe((newState, latestEvent) => {
      setScoreState({ ...newState });

      // If a score was submitted by the other person, show live celebration toast!
      if (latestEvent?.type === 'new_score' && latestEvent.payload?.record) {
        const record = latestEvent.payload.record;
        const otherPlayer = savedPlayer === 'Dominik' ? 'Mara' : 'Dominik';
        if (record.player === otherPlayer) {
          playScoreSound();
          triggerHeartExplosion(window.innerWidth / 2, 100);
          const gameTitle = record.game === 'flappy-pigeon' ? 'Porumbelul Îndrăgostit' : 'Prinde Dragostea';
          setLiveToast({
            show: true,
            message: `🎉 ${record.player} tocmai a făcut scorul ${record.score} la ${gameTitle}!`,
            sender: record.player,
          });
          setTimeout(() => setLiveToast({ show: false, message: '' }), 5000);
        }
      }
    });

    // Subscribe to real-time cheers sent from the other person
    const unsubscribeCheers = realtimeScores.subscribeCheers((from) => {
      if (from !== savedPlayer) {
        triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
        playScoreSound();
        setLiveToast({
          show: true,
          message: `💖 ${from} ți-a trimis o îmbrățișare cu inimioare live!`,
          sender: from,
        });
        setTimeout(() => setLiveToast({ show: false, message: '' }), 4000);
      }
    });

    return () => {
      unsubscribeScores();
      unsubscribeCheers();
    };
  }, []);

  const handlePlayerChange = (newPlayer: PlayerName) => {
    setPlayer(newPlayer);
    realtimeScores.setPlayer(newPlayer);
  };

  const handleSendCheer = () => {
    realtimeScores.sendLiveCheer(player);
  };

  const bestScoreForCurrentPlayer =
    player === 'Dominik'
      ? scoreState.highScores[activeGame].dominik
      : scoreState.highScores[activeGame].mara;

  return (
    <section id="games" className="py-14 px-4 max-w-6xl mx-auto border-t-2 border-pink-100 mt-12">
      {/* Live Toast Notification */}
      {liveToast.show && (
        <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top duration-300">
          <div className="bg-white/95 backdrop-blur-md border-2 border-rose-300 text-rose-700 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm pointer-events-auto">
            <span className="text-xl">💌</span>
            <span>{liveToast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold tracking-wide uppercase mb-2">
          <Gamepad2 className="w-3.5 h-3.5 text-pink-600" />
          Mini-Game-uri în Timp Real
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 font-cute flex items-center justify-center gap-2">
          <span>Jocuri Îndrăgostite: Dominik vs Mara</span>
          <span className="text-2xl">🎮💕</span>
        </h2>
        <p className="text-sm sm:text-base text-pink-700/80 mt-1 max-w-xl mx-auto font-medium">
          Scorurile se sincronizează instantaneu între telefoane și calculatoare! Dacă faci scor nou, iubita ta îl vede pe loc! 🚀
        </p>

        {/* Game Tabs */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setActiveGame('flappy-pigeon')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeGame === 'flappy-pigeon'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                : 'bg-white hover:bg-pink-100 text-pink-800 border border-pink-200'
            }`}
          >
            <span>🕊️</span>
            <span>Porumbelul Îndrăgostit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveGame('love-catcher')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeGame === 'love-catcher'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                : 'bg-white hover:bg-pink-100 text-pink-800 border border-pink-200'
            }`}
          >
            <span>🧺</span>
            <span>Prinde Dragostea</span>
          </button>
        </div>
      </div>

      {/* Main Game Layout Grid (Game on left, Duel board on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
        {/* Active Game Canvas */}
        <div className="w-full flex justify-center">
          {activeGame === 'flappy-pigeon' ? (
            <FlappyPigeon
              player={player}
              bestScore={bestScoreForCurrentPlayer}
            />
          ) : (
            <LoveCatcher
              player={player}
              bestScore={bestScoreForCurrentPlayer}
            />
          )}
        </div>

        {/* Real-time Duel Leaderboard */}
        <div className="w-full flex justify-center">
          <GameLeaderboard
            player={player}
            onPlayerChange={handlePlayerChange}
            highScores={scoreState.highScores}
            recentActivity={scoreState.recentActivity}
            onSendCheer={handleSendCheer}
          />
        </div>
      </div>
    </section>
  );
};
