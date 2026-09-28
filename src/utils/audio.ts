// Audio synthesizer for cute SFX and gentle romantic music-box tunes using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch {
      return null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Master sound toggle
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

// Keypad beep (cute marimba tone)
export function playKeypadBeep(num: string) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const baseFreqs: Record<string, number> = {
    '1': 523.25, // C5
    '2': 587.33, // D5
    '3': 659.25, // E5
    '4': 698.46, // F5
    '5': 783.99, // G5
    '6': 880.00, // A5
    '7': 987.77, // B5
    '8': 1046.50, // C6
    '9': 1174.66, // D6
    '0': 1318.51, // E6
    'del': 440.00,
    'clear': 392.00,
  };

  const freq = baseFreqs[num] || 523.25;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

// Unlocking the safe (magical glockenspiel arpeggio)
export function playUnlockSuccess() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
  });
}

// Incorrect code cute soft buzz
export function playErrorBuzz() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.28);
}

// Heart pop / Hello Kitty click
export function playHeartPop() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(700, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.16);
}

// Romantic music synthesizer engine for in-app music player
class MusicBoxEngine {
  private isPlaying = false;
  private timer: number | null = null;
  private currentStep = 0;
  private currentTheme: string = 'canon';
  private masterGain: GainNode | null = null;
  private onStepCallback: ((step: number) => void) | null = null;

  // Romantic chord progressions / melodies (frequencies in Hz)
  private melodies: Record<string, number[][]> = {
    canon: [
      [523.25, 659.25, 783.99], // C major
      [392.00, 493.88, 587.33], // G major
      [440.00, 523.25, 659.25], // A minor
      [329.63, 392.00, 493.88], // E minor
      [349.23, 440.00, 523.25], // F major
      [261.63, 329.63, 392.00], // C major
      [349.23, 440.00, 523.25], // F major
      [392.00, 493.88, 587.33], // G major
    ],
    romantic: [
      [587.33, 739.99, 880.00], // D major
      [493.88, 587.33, 739.99], // B minor
      [440.00, 554.37, 659.25], // A major
      [392.00, 493.88, 587.33], // G major
      [440.00, 554.37, 659.25], // A major
      [587.33, 739.99, 880.00], // D
    ],
    lullaby: [
      [523.25, 659.25, 1046.5],
      [440.00, 523.25, 880.00],
      [349.23, 440.00, 698.46],
      [392.00, 493.88, 783.99],
    ],
    dream: [
      [659.25, 830.61, 987.77],
      [587.33, 739.99, 880.00],
      [523.25, 659.25, 783.99],
      [440.00, 554.37, 659.25],
    ],
    waltz: [
      [523.25, 659.25],
      [783.99, 1046.5],
      [783.99, 1046.5],
      [440.00, 554.37],
      [659.25, 880.00],
      [659.25, 880.00],
    ],
  };

  public setStepCallback(cb: (step: number) => void) {
    this.onStepCallback = cb;
  }

  public play(theme: string = 'canon') {
    this.stop();
    const ctx = getAudioContext();
    if (!ctx) return;

    this.isPlaying = true;
    this.currentTheme = theme;
    this.currentStep = 0;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    const stepInterval = 650; // ms per chord/step

    const playNext = () => {
      if (!this.isPlaying) return;
      const themeProgression = this.melodies[this.currentTheme] || this.melodies.canon;
      const notes = themeProgression[this.currentStep % themeProgression.length];

      const now = ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Music-box bell/chime quality: sine wave with fast attack & gentle chime decay
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        noteGain.gain.setValueAtTime(0, now + i * 0.06);
        noteGain.gain.linearRampToValueAtTime(0.12, now + i * 0.06 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 1.2);

        osc.connect(noteGain);
        if (this.masterGain) {
          noteGain.connect(this.masterGain);
        }

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 1.3);
      });

      if (this.onStepCallback) {
        this.onStepCallback(this.currentStep);
      }

      this.currentStep++;
      this.timer = window.setTimeout(playNext, stepInterval);
    };

    playNext();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const musicBox = new MusicBoxEngine();
