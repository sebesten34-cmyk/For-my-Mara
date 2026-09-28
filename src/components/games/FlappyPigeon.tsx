import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Trophy, Heart } from 'lucide-react';
import { PlayerName } from '../../types/games';
import { realtimeScores } from '../../services/realtimeScores';
import { playFlapSound, playScoreSound, playBonusSound, playHitSound } from '../../utils/gameAudio';
import { triggerHeartExplosion } from '../../utils/confetti';

interface FlappyPigeonProps {
  player: PlayerName;
  onScoreSubmitted?: (score: number) => void;
  bestScore: number;
}

interface Pillar {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
  hasBonusHeart: boolean;
  bonusCollected: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  isHeart?: boolean;
}

export const FlappyPigeon: React.FC<FlappyPigeonProps> = ({ player, onScoreSubmitted, bestScore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Game internal state stored in refs to avoid closure stalls in requestAnimationFrame
  const pigeonRef = useRef({
    x: 90,
    y: 220,
    vy: 0,
    radius: 17,
    angle: 0,
    wingFlap: 0,
    wingDir: 1,
  });

  const pillarsRef = useRef<Pillar[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const frameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const stateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');

  stateRef.current = gameState;

  // Physics constants
  const GRAVITY = 0.36;
  const JUMP_STRENGTH = -6.6;
  const PILLAR_SPEED = 2.4;
  const PILLAR_GAP = 145; // Generous gap for joyful play
  const PILLAR_WIDTH = 58;
  const PILLAR_SPACING = 230;

  const flap = useCallback(() => {
    if (stateRef.current === 'idle') {
      stateRef.current = 'playing';
      setGameState('playing');
      pigeonRef.current.vy = JUMP_STRENGTH;
      if (soundEnabled) playFlapSound();
      return;
    }

    if (stateRef.current === 'playing') {
      pigeonRef.current.vy = JUMP_STRENGTH;
      pigeonRef.current.wingFlap = 1;
      if (soundEnabled) playFlapSound();

      // Emit small heart puff
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: pigeonRef.current.x - 14,
          y: pigeonRef.current.y + (Math.random() * 12 - 6),
          vx: -(Math.random() * 2 + 1),
          vy: Math.random() * 2 - 1,
          size: Math.random() * 6 + 4,
          color: '#fb7185',
          alpha: 1,
          isHeart: true,
        });
      }
    }
  }, [soundEnabled]);

  const restartGame = useCallback(() => {
    pigeonRef.current = {
      x: 90,
      y: 220,
      vy: 0,
      radius: 17,
      angle: 0,
      wingFlap: 0,
      wingDir: 1,
    };
    pillarsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    setCurrentScore(0);
    setIsNewRecord(false);
    stateRef.current = 'idle';
    setGameState('idle');
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

    // Submit score in real-time across all devices!
    realtimeScores.submitScore('flappy-pigeon', player, finalScore);
    onScoreSubmitted?.(finalScore);
  }, [bestScore, player, onScoreSubmitted, soundEnabled]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (stateRef.current === 'gameover') {
          restartGame();
        } else {
          flap();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap, restartGame]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cloudsX = 0;

    const render = (time: number) => {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 16.6, 2) : 1;
      lastTimeRef.current = time;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Romantic Gradient Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#fce7f3'); // soft baby pink
      skyGrad.addColorStop(0.6, '#ffe4e6'); // rose tint
      skyGrad.addColorStop(1, '#fed7aa'); // sunset peach
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds parallax
      cloudsX = (cloudsX + 0.3 * dt) % (width + 120);
      drawCloud(ctx, width - cloudsX + 60, 60, 48);
      drawCloud(ctx, (width * 1.5 - cloudsX) % (width + 140) - 40, 110, 36);

      // Distant rolling hills
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.moveTo(0, height - 30);
      for (let x = 0; x <= width; x += 40) {
        ctx.quadraticCurveTo(x + 20, height - 45, x + 40, height - 30);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Grass/Floral floor
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(0, height - 25, width, 25);
      ctx.fillStyle = '#db2777';
      ctx.fillRect(0, height - 25, width, 4);

      // Cute floor flowers
      for (let fx = 15; fx < width; fx += 35) {
        ctx.fillStyle = fx % 70 === 15 ? '#fbbf24' : '#fff';
        ctx.beginPath();
        ctx.arc(fx, height - 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Logic & Draw Pillars
      if (stateRef.current === 'playing') {
        // Spawn pillars
        const lastPillar = pillarsRef.current[pillarsRef.current.length - 1];
        if (!lastPillar || width - lastPillar.x >= PILLAR_SPACING) {
          const minHeight = 60;
          const maxHeight = height - PILLAR_GAP - minHeight - 35;
          const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
          const hasBonusHeart = Math.random() < 0.45; // 45% chance of bonus heart

          pillarsRef.current.push({
            x: width + 20,
            topHeight,
            bottomY: topHeight + PILLAR_GAP,
            passed: false,
            hasBonusHeart,
            bonusCollected: false,
          });
        }

        // Update pillars
        for (let i = pillarsRef.current.length - 1; i >= 0; i--) {
          const p = pillarsRef.current[i];
          p.x -= PILLAR_SPEED * dt;

          // Score when passed
          if (!p.passed && p.x + PILLAR_WIDTH < pigeonRef.current.x) {
            p.passed = true;
            scoreRef.current += 1;
            setCurrentScore(scoreRef.current);
            if (soundEnabled) playScoreSound();
          }

          // Bonus heart pickup check
          if (p.hasBonusHeart && !p.bonusCollected) {
            const heartX = p.x + PILLAR_WIDTH / 2;
            const heartY = p.topHeight + PILLAR_GAP / 2;
            const dist = Math.hypot(pigeonRef.current.x - heartX, pigeonRef.current.y - heartY);
            if (dist < pigeonRef.current.radius + 15) {
              p.bonusCollected = true;
              scoreRef.current += 2;
              setCurrentScore(scoreRef.current);
              if (soundEnabled) playBonusSound();

              // Heart pickup explosion
              for (let k = 0; k < 6; k++) {
                particlesRef.current.push({
                  x: heartX,
                  y: heartY,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  size: Math.random() * 8 + 4,
                  color: '#f43f5e',
                  alpha: 1,
                  isHeart: true,
                });
              }
            }
          }

          // Remove offscreen pillars
          if (p.x + PILLAR_WIDTH < -30) {
            pillarsRef.current.splice(i, 1);
          }
        }
      }

      // Draw pillars
      for (const p of pillarsRef.current) {
        drawCandyPillar(ctx, p.x, 0, PILLAR_WIDTH, p.topHeight, true);
        drawCandyPillar(ctx, p.x, p.bottomY, PILLAR_WIDTH, height - p.bottomY - 25, false);

        // Draw bonus heart if available
        if (p.hasBonusHeart && !p.bonusCollected) {
          const heartX = p.x + PILLAR_WIDTH / 2;
          const heartY = p.topHeight + PILLAR_GAP / 2 + Math.sin(time * 0.005 + p.x) * 6;
          drawHeart(ctx, heartX, heartY, 13, '#f43f5e');
        }
      }

      // 3. Logic & Draw Pigeon
      const pigeon = pigeonRef.current;

      if (stateRef.current === 'playing') {
        pigeon.vy += GRAVITY * dt;
        pigeon.y += pigeon.vy * dt;
        pigeon.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, (pigeon.vy * 0.06)));

        // Floor / ceiling collision
        if (pigeon.y + pigeon.radius >= height - 25) {
          pigeon.y = height - 25 - pigeon.radius;
          handleGameOver();
        }
        if (pigeon.y - pigeon.radius <= 0) {
          pigeon.y = pigeon.radius;
          pigeon.vy = 0;
        }

        // Pillar collision check (generous circular hitbox)
        for (const p of pillarsRef.current) {
          const testX = Math.max(p.x, Math.min(pigeon.x, p.x + PILLAR_WIDTH));

          // Top pillar
          if (pigeon.y - pigeon.radius < p.topHeight) {
            const distX = pigeon.x - testX;
            const distY = pigeon.y - Math.min(pigeon.y, p.topHeight);
            if (distX * distX + distY * distY < (pigeon.radius - 2) * (pigeon.radius - 2)) {
              handleGameOver();
              break;
            }
          }

          // Bottom pillar
          if (pigeon.y + pigeon.radius > p.bottomY) {
            const distX = pigeon.x - testX;
            const distY = pigeon.y - Math.max(pigeon.y, p.bottomY);
            if (distX * distX + distY * distY < (pigeon.radius - 2) * (pigeon.radius - 2)) {
              handleGameOver();
              break;
            }
          }
        }
      } else if (stateRef.current === 'idle') {
        // Gentle bobbing when waiting
        pigeon.y = 220 + Math.sin(time * 0.005) * 8;
        pigeon.angle = Math.sin(time * 0.004) * 0.08;
      }

      // Draw Pigeon
      drawPigeon(ctx, pigeon.x, pigeon.y, pigeon.angle, time);

      // 4. Particles (feathers & hearts)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= 0.025 * dt;

        if (pt.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        if (pt.isHeart) {
          drawHeart(ctx, pt.x, pt.y, pt.size, pt.color);
        } else {
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
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
      {/* Game Card Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 border-2 border-pink-200 shadow-xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕊️</span>
            <div>
              <h3 className="text-base font-bold text-slate-800 font-cute leading-none">
                Porumbelul Îndrăgostit
              </h3>
              <p className="text-[11px] text-pink-600 font-medium">
                Joci ca: <strong className="text-rose-600">{player}</strong> 💕
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        <div
          onClick={flap}
          className="relative aspect-4/5 w-full rounded-2xl overflow-hidden shadow-inner cursor-pointer border-2 border-pink-200 select-none touch-none"
        >
          <canvas
            ref={canvasRef}
            width={380}
            height={480}
            className="w-full h-full block"
          />

          {/* Live Score Counter in Center Top */}
          {gameState === 'playing' && (
            <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border-2 border-rose-300 text-rose-600 text-xl font-black font-cute shadow-md flex items-center gap-1.5 animate-bounce">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{currentScore}</span>
              </div>
            </div>
          )}

          {/* Idle Screen Overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-16 h-16 rounded-full bg-white/95 text-rose-500 flex items-center justify-center shadow-lg mb-3 animate-pulse">
                <Play className="w-8 h-8 fill-rose-500 translate-x-0.5" />
              </div>
              <h4 className="text-xl font-bold font-cute drop-shadow-md">
                Apasă pentru a zbura! 🕊️
              </h4>
              <p className="text-xs text-pink-100 max-w-xs mt-1 font-medium drop-shadow-xs">
                Atinge ecranul sau apasă <strong>SPACE</strong> ca să ajuți porumbelul să treacă prin coloanele dulci și să prindă inimioarele!
              </p>
              <div className="mt-4 px-3 py-1 rounded-full bg-white/85 text-pink-800 text-[11px] font-bold shadow-sm">
                Bonus: Inimioarele galbene dau +2 puncte! ✨
              </div>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl p-6 text-slate-800 max-w-xs w-full shadow-2xl border-4 border-pink-300">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2 text-2xl">
                  {isNewRecord ? '👑' : '💔'}
                </div>

                <h4 className="text-lg font-bold font-cute text-slate-800">
                  {isNewRecord ? 'RECORD NOU! 🎉' : 'Joc Încheiat!'}
                </h4>

                <div className="my-3 p-3 rounded-2xl bg-pink-50 border border-pink-200 flex justify-around items-center">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Scor</span>
                    <p className="text-2xl font-black text-rose-600 font-cute">{currentScore}</p>
                  </div>
                  <div className="w-px h-8 bg-pink-200" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Recordul tău</span>
                    <p className="text-2xl font-black text-amber-500 font-cute">
                      {Math.max(currentScore, bestScore)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-pink-700 font-medium mb-4">
                  Scorul tău a fost transmis în timp real pe dispozitivul iubitei/iubitului tău! 💕
                </p>

                <button
                  type="button"
                  onClick={restartGame}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Joacă din nou!</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Tap Touch Helper Button */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={gameState === 'gameover' ? restartGame : flap}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>{gameState === 'idle' ? 'Start Joc' : gameState === 'gameover' ? 'Joacă din nou' : 'Apasă ca să sari! 🪶'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Canvas Vector Drawing Functions
function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.7, y - r * 0.2, r * 0.75, 0, Math.PI * 2);
  ctx.arc(x + r * 1.4, y, r * 0.85, 0, Math.PI * 2);
  ctx.arc(x + r * 0.7, y + r * 0.2, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCandyPillar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isTop: boolean
) {
  if (height <= 0) return;
  ctx.save();

  // Pillar Body Gradient
  const grad = ctx.createLinearGradient(x, 0, x + width, 0);
  grad.addColorStop(0, '#f472b6'); // light pink
  grad.addColorStop(0.5, '#fb7185'); // rose
  grad.addColorStop(1, '#e11d48'); // deep rose
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, width, height);

  // Candy Stripes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  const stripeW = 12;
  for (let sy = y - width; sy < y + height; sy += stripeW * 2) {
    ctx.beginPath();
    ctx.moveTo(x, Math.max(y, sy));
    ctx.lineTo(x + width, Math.max(y, sy + width));
    ctx.lineTo(x + width, Math.min(y + height, sy + width + stripeW));
    ctx.lineTo(x, Math.min(y + height, sy + stripeW));
    ctx.closePath();
    ctx.fill();
  }

  // Pillar Cap / Rim
  const capH = 18;
  const capW = width + 10;
  const capX = x - 5;
  const capY = isTop ? y + height - capH : y;

  ctx.fillStyle = '#be123c';
  ctx.fillRect(capX, capY, capW, capH);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(capX, capY, capW, capH);

  // Little heart on cap
  drawHeart(ctx, capX + capW / 2, capY + capH / 2, 6, '#ffe4e6');

  ctx.restore();
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  // bottom left curve
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.2, x, y + size);
  // bottom right curve
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  // top right curve
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPigeon(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, time: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // 1. Plump Body (Soft White Dove with gentle shadow)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gentle light grey shadow under body
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 2. Tail feathers
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.lineTo(-26, -5);
  ctx.lineTo(-24, 0);
  ctx.lineTo(-26, 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Flapping Wing
  const wingOffset = Math.sin(time * 0.02) * 6;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-2, -2 + wingOffset * 0.5, 11, 7, -0.2 + wingOffset * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.stroke();

  // Wing feathers detail
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(-2, -2 + wingOffset * 0.5, 6, 0.2, Math.PI * 0.8);
  ctx.stroke();

  // 4. Head & Cheek Blush
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(10, -5, 10, 0, Math.PI * 2);
  ctx.fill();

  // Sweet Pink Cheek Blush
  ctx.fillStyle = 'rgba(251, 113, 133, 0.6)';
  ctx.beginPath();
  ctx.ellipse(9, -2, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute Eye (black pupil + white shine)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(12, -7, 2.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(12.8, -7.8, 1, 0, Math.PI * 2);
  ctx.fill();

  // 5. Beak (Golden Orange)
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(17, -6);
  ctx.lineTo(24, -4);
  ctx.lineTo(17, -2);
  ctx.closePath();
  ctx.fill();

  // 6. Cute Little Red Bow / Ribbon on Head (Adopt Me style!)
  ctx.fillStyle = '#f43f5e';
  // Left knot
  ctx.beginPath();
  ctx.ellipse(4, -13, 3.5, 2, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // Right knot
  ctx.beginPath();
  ctx.ellipse(9, -13, 3.5, 2, 0.4, 0, Math.PI * 2);
  ctx.fill();
  // Center gem
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(6.5, -13, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
