import confetti from 'canvas-confetti';
import { playHeartPop, playUnlockSuccess } from './audio';

export function triggerHeartExplosion(clientX?: number, clientY?: number) {
  playHeartPop();

  // Normalize origin if coordinates provided
  let originX = 0.5;
  let originY = 0.5;

  if (typeof clientX === 'number' && typeof clientY === 'number') {
    originX = clientX / window.innerWidth;
    originY = clientY / window.innerHeight;
  }

  // Heart shaped and pink palette confetti
  const pinkColors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#ffffff'];

  // Blast 1: Quick sharp burst of small hearts
  confetti({
    particleCount: 35,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: pinkColors,
    scalar: 1.2,
    shapes: ['circle'],
    ticks: 120,
    gravity: 0.8,
  });

  // Blast 2: Wider sparkles
  confetti({
    particleCount: 25,
    spread: 100,
    origin: { x: originX, y: originY },
    colors: ['#fbcfe8', '#f43f5e', '#fef08a'],
    scalar: 0.8,
    ticks: 100,
    gravity: 0.6,
  });
}

export function triggerGrandCelebration() {
  playUnlockSuccess();
  const pinkColors = ['#e11d48', '#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fef08a'];

  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: pinkColors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: pinkColors,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
