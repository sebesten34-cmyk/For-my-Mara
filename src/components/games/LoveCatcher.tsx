import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Trophy, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { PlayerName } from '../../types/games';
import { realtimeScores } from '../../services/realtimeScores';
import { playCatchItemSound, playBonusSound, playHitSound } from '../../utils/gameAudio';
import { triggerHeartExplosion } from '../../utils/confetti';

interface LoveCatcherProps {
  player: PlayerName;
  onScoreSubmitted?: (score: number) => void;
  bestScore: number;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'strawberry' | 'letter' | 'coffee' | 'ring' | 'paw' | 'cloud';
  points: number;
  emoji: string;
  size: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
}

export const LoveCatcher: React.FC<LoveCatcherProps> = ({ player, onScoreSubmitted, bestScore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Basket & item state in refs
  const basketRef = useRef({
    x: 190,
    width: 72,
    height: 28,
    speed: 6.5,
  });

  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const itemsRef = useRef<FallingItem[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const frameIdRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const stateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const comboRef = useRef<number>(0);

  stateRef.current = gameState;

  const startGame = useCallback(() => {
    basketRef.current.x = 190;
    itemsRef.current = [];
    floatingTextsRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    comboRef.current = 0;
    lastSpawnRef.current = 0;
    setScore(0);
    setLives(3);
    setCombo(0);
    setIsNewRecord(false);
    stateRef.current = 'playing';
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback(() => {
    stateRef.current = 'gameover';
    setGameState('gameover');
    if (soundEnabled) playHitSound();

    const finalScore = scoreRef.current;
    const isNew = finalScore > bestScore;
    setIsNewRecord(isNew);

    if (isNew && finalScore > 0) {
      triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
    }

    realtimeScores.submitScore('love-catcher', player, finalScore);
    onScoreSubmitted?.(finalScore);
  }, [bestScore, player, onScoreSubmitted, soundEnabled]);

  // Touch and Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
      }
      if (e.code === 'Space' && stateRef.current !== 'playing') {
        startGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startGame]);

  // Mouse / Touch drag on canvas to steer basket
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (stateRef.current !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = e.clientX - rect.left;
    const canvasX = clientX * scaleX;
    basketRef.current.x = Math.max(36, Math.min(canvas.width - 36, canvasX));
  };

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nextSpawnTime = 80;

    const render = (time: number) => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#fdf2f8');
      bgGrad.addColorStop(0.5, '#fce7f3');
      bgGrad.addColorStop(1, '#fed7aa');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Floor
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(0, height - 20, width, 20);
      ctx.fillStyle = '#be185d';
      ctx.fillRect(0, height - 20, width, 3);

      if (stateRef.current === 'playing') {
        // Handle keyboard movement
        if (keysRef.current.left) {
          basketRef.current.x = Math.max(36, basketRef.current.x - basketRef.current.speed);
        }
        if (keysRef.current.right) {
          basketRef.current.x = Math.min(width - 36, basketRef.current.x + basketRef.current.speed);
        }

        // Spawn items
        lastSpawnRef.current += 1;
        if (lastSpawnRef.current >= nextSpawnTime) {
          lastSpawnRef.current = 0;
          nextSpawnTime = Math.max(45, 80 - Math.floor(scoreRef.current / 80));

          const isCloud = Math.random() < 0.22; // 22% hazard
          let type: FallingItem['type'] = 'strawberry';
          let points = 10;
          let emoji = '🍓';

          if (isCloud) {
            type = 'cloud';
            points = 0;
            emoji = '⛈️';
          } else {
            const roll = Math.random();
            if (roll < 0.35) {
              type = 'strawberry';
              points = 10;
              emoji = '🍓';
            } else if (roll < 0.6) {
              type = 'letter';
              points = 20;
              emoji = '💌';
            } else if (roll < 0.8) {
              type = 'coffee';
              points = 30;
              emoji = '☕';
            } else if (roll < 0.92) {
              type = 'paw';
              points = 25;
              emoji = '🐾';
            } else {
              type = 'ring';
              points = 50;
              emoji = '💍';
            }
          }

          itemsRef.current.push({
            id: Date.now() + Math.random(),
            x: Math.random() * (width - 60) + 30,
            y: -20,
            speed: Math.random() * 1.5 + 2.2 + Math.min(scoreRef.current * 0.015, 2.5),
            type,
            points,
            emoji,
            size: 26,
          });
        }

        // Update items
        const basket = basketRef.current;
        const basketY = height - 45;

        for (let i = itemsRef.current.length - 1; i >= 0; i--) {
          const item = itemsRef.current[i];
          item.y += item.speed;

          // Catch collision with basket
          if (
            item.y + item.size / 2 >= basketY &&
            item.y - item.size / 2 <= basketY + basket.height &&
            item.x >= basket.x - basket.width / 2 - 8 &&
            item.x <= basket.x + basket.width / 2 + 8
          ) {
            // Collision occurred!
            itemsRef.current.splice(i, 1);

            if (item.type === 'cloud') {
              // Hit hazard!
              livesRef.current -= 1;
              comboRef.current = 0;
              setLives(livesRef.current);
              setCombo(0);
              if (soundEnabled) playHitSound();

              floatingTextsRef.current.push({
                x: item.x,
                y: basketY - 10,
                text: '-1 ❤️',
                color: '#e11d48',
                alpha: 1,
              });

              if (livesRef.current <= 0) {
                handleGameOver();
                break;
              }
            } else {
              // Caught good gift!
              comboRef.current += 1;
              const multiplier = comboRef.current >= 10 ? 2 : comboRef.current >= 5 ? 1.5 : 1;
              const awarded = Math.round(item.points * multiplier);
              scoreRef.current += awarded;
              setScore(scoreRef.current);
              setCombo(comboRef.current);

              if (item.type === 'ring' || multiplier > 1) {
                if (soundEnabled) playBonusSound();
              } else {
                if (soundEnabled) playCatchItemSound();
              }

              floatingTextsRef.current.push({
                x: item.x,
                y: basketY - 10,
                text: `+${awarded}${multiplier > 1 ? ` (x${multiplier})` : ''}`,
                color: item.type === 'ring' ? '#f59e0b' : '#db2777',
                alpha: 1,
              });
            }
            continue;
          }

          // Off bottom screen
          if (item.y > height + 20) {
            itemsRef.current.splice(i, 1);
            if (item.type !== 'cloud') {
              // Missed good item resets combo
              comboRef.current = 0;
              setCombo(0);
            }
          }
        }
      }

      // 2. Draw Falling Items
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const item of itemsRef.current) {
        ctx.fillText(item.emoji, item.x, item.y);
      }

      // 3. Draw Cute Basket
      const b = basketRef.current;
      const bY = height - 42;

      // Basket body (woven pink/rose style)
      ctx.save();
      const bGrad = ctx.createLinearGradient(b.x - b.width / 2, 0, b.x + b.width / 2, 0);
      bGrad.addColorStop(0, '#f43f5e');
      bGrad.addColorStop(0.5, '#fb7185');
      bGrad.addColorStop(1, '#e11d48');
      ctx.fillStyle = bGrad;

      ctx.beginPath();
      ctx.roundRect(b.x - b.width / 2, bY, b.width, b.height, [4, 4, 14, 14]);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cute white ribbon / bow on front
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(b.x, bY + b.height / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(b.x - 7, bY + b.height / 2, 4, 0, Math.PI * 2);
      ctx.arc(b.x + 7, bY + b.height / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 4. Floating texts
      for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
        const ft = floatingTextsRef.current[i];
        ft.y -= 1.2;
        ft.alpha -= 0.03;

        if (ft.alpha <= 0) {
          floatingTextsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 15px "Quicksand", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      frameIdRef.current = requestAnimationFrame(render);
    };

    frameIdRef.current = requestAnimationFrame(render);
    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [handleGameOver, soundEnabled]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 border-2 border-pink-200 shadow-xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧺</span>
            <div>
              <h3 className="text-base font-bold text-slate-800 font-cute leading-none">
                Prinde Dragostea
              </h3>
              <p className="text-[11px] text-pink-600 font-medium">
                Joci ca: <strong className="text-rose-600">{player}</strong> 💕
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lives display */}
            <div className="flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-2 py-1 rounded-full">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-full text-xs font-bold text-pink-700">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Record: {bestScore}</span>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition-colors cursor-pointer"
              title={soundEnabled ? 'Oprește sunetul' : 'Pornește sunetul'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden shadow-inner border-2 border-pink-200 select-none touch-none">
          <canvas
            ref={canvasRef}
            width={380}
            height={480}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerMove}
            className="w-full h-full block cursor-ew-resize"
          />

          {/* Live Score & Combo Overlay */}
          {gameState === 'playing' && (
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
              <div className="px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-pink-200 shadow-sm text-sm font-bold text-slate-800">
                Puncte: <strong className="text-rose-600 font-cute text-lg">{score}</strong>
              </div>

              {combo >= 3 && (
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-white text-xs font-black shadow-md animate-pulse">
                  COMBO x{combo}! 🔥
                </div>
              )}
            </div>
          )}

          {/* Idle Screen Overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-16 h-16 rounded-full bg-white/95 text-rose-500 flex items-center justify-center shadow-lg mb-3 animate-pulse">
                <Play className="w-8 h-8 fill-rose-500 translate-x-0.5" />
              </div>
              <h4 className="text-xl font-bold font-cute drop-shadow-md">
                Prinde cadourile de iubire! 🍓
              </h4>
              <p className="text-xs text-pink-100 max-w-xs mt-1 font-medium drop-shadow-xs">
                Glisează pe ecran sau folosește <strong>SĂGEȚILE</strong> ca să prinzi căpșuni, scrisori, latte și inele! Ferește-te de norii cu furtună ⛈️!
              </p>
              <button
                type="button"
                onClick={startGame}
                className="mt-4 px-6 py-2 rounded-full bg-white text-rose-600 font-bold text-sm shadow-md hover:bg-pink-50 cursor-pointer active:scale-95 transition-transform"
              >
                Începe Jocul 🧺
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl p-6 text-slate-800 max-w-xs w-full shadow-2xl border-4 border-pink-300">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2 text-2xl">
                  {isNewRecord ? '👑' : '🍓'}
                </div>

                <h4 className="text-lg font-bold font-cute text-slate-800">
                  {isNewRecord ? 'RECORD NOU! 🎉' : 'Joc Încheiat!'}
                </h4>

                <div className="my-3 p-3 rounded-2xl bg-pink-50 border border-pink-200 flex justify-around items-center">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Scor</span>
                    <p className="text-2xl font-black text-rose-600 font-cute">{score}</p>
                  </div>
                  <div className="w-px h-8 bg-pink-200" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Recordul tău</span>
                    <p className="text-2xl font-black text-amber-500 font-cute">
                      {Math.max(score, bestScore)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-pink-700 font-medium mb-4">
                  Scorul tău a fost sincronizat în timp real pe ambele dispozitive! 💕
                </p>

                <button
                  type="button"
                  onClick={startGame}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Joacă din nou!</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Touch Buttons for Mobile Steer */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onPointerDown={() => {
              keysRef.current.left = true;
            }}
            onPointerUp={() => {
              keysRef.current.left = false;
            }}
            onPointerLeave={() => {
              keysRef.current.left = false;
            }}
            className="flex-1 py-3 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-sm flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Stânga</span>
          </button>

          <button
            type="button"
            onPointerDown={() => {
              keysRef.current.right = true;
            }}
            onPointerUp={() => {
              keysRef.current.right = false;
            }}
            onPointerLeave={() => {
              keysRef.current.right = false;
            }}
            className="flex-1 py-3 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-sm flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform"
          >
            <span>Dreapta</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
