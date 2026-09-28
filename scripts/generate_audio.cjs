const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sampleRate = 44100;

function createWavHeader(dataLength, sampleRate = 44100, numChannels = 2, bitsPerSample = 16) {
  const buffer = Buffer.alloc(44);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);
  return buffer;
}

// Note frequencies
const noteFreqs = {
  'C2': 65.41, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'G2': 98.0, 'Ab2': 103.83, 'A2': 110.0, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.0, 'G3': 196.0, 'Ab3': 207.65, 'A3': 220.0, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.0, 'Ab4': 415.3, 'A4': 440.0, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.0, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

// Song musical definitions (chords and lead notes)
const songsConfig = [
  {
    filename: 'arctic_monkeys_i_wanna_be_yours.mp3',
    bpm: 70,
    durationSec: 32,
    chords: [
      ['C3', 'Eb3', 'G3', 'C4'],
      ['Ab2', 'C3', 'Eb3', 'Ab3'],
      ['F2', 'Ab2', 'C3', 'F3'],
      ['G2', 'B2', 'D3', 'G3']
    ],
    melody: ['G4', 'G4', 'F4', 'Eb4', 'F4', 'Eb4', 'C4', 'C4', 'Eb4', 'F4', 'G4', 'Eb4', 'D4', 'C4'],
    bass: ['C2', 'Ab2', 'F2', 'G2'],
    style: 'lofi_ambient'
  },
  {
    filename: 'cigarettes_after_sex_k.mp3',
    bpm: 72,
    durationSec: 30,
    chords: [
      ['F#3', 'A3', 'C#4'],
      ['D3', 'F#3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['E3', 'G#3', 'B3']
    ],
    melody: ['C#5', 'B4', 'A4', 'F#4', 'A4', 'C#5', 'B4', 'A4', 'E4', 'F#4', 'A4'],
    bass: ['F#2', 'D2', 'A2', 'E2'],
    style: 'dream_pop'
  },
  {
    filename: 'new_west_those_eyes.mp3',
    bpm: 66,
    durationSec: 30,
    chords: [
      ['G3', 'B3', 'D4'],
      ['E3', 'G3', 'B3'],
      ['C3', 'E3', 'G3'],
      ['D3', 'F#3', 'A3']
    ],
    melody: ['D4', 'E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'E4', 'D4', 'G4', 'B4', 'A4', 'G4'],
    bass: ['G2', 'E2', 'C2', 'D2'],
    style: 'piano_ballad'
  },
  {
    filename: 'bitza_cheloo_vorbeste_vinul.mp3',
    bpm: 88,
    durationSec: 30,
    chords: [
      ['D3', 'F3', 'A3'],
      ['G3', 'Bb3', 'D4'],
      ['A2', 'C#3', 'E3', 'G3'],
      ['D3', 'F3', 'A3']
    ],
    melody: ['D4', 'F4', 'A4', 'G4', 'F4', 'E4', 'D4', 'F4', 'E4', 'D4', 'C#4', 'D4'],
    bass: ['D2', 'G2', 'A2', 'D2'],
    style: 'hiphop_groove'
  },
  {
    filename: 'bruno_mars_risk_it_all.mp3',
    bpm: 74,
    durationSec: 30,
    chords: [
      ['Bb2', 'D3', 'F3'],
      ['D3', 'F3', 'A3'],
      ['Eb3', 'G3', 'Bb3'],
      ['F3', 'A3', 'C4']
    ],
    melody: ['F4', 'G4', 'Bb4', 'C5', 'D5', 'C5', 'Bb4', 'G4', 'F4', 'Bb4', 'D5', 'C5'],
    bass: ['Bb2', 'D2', 'Eb2', 'F2'],
    style: 'soul_rnb'
  },
  {
    filename: 'codu_penal_daca_n_ai_fi_tu.mp3',
    bpm: 82,
    durationSec: 30,
    chords: [
      ['A2', 'C3', 'E3'],
      ['F2', 'A2', 'C3'],
      ['C3', 'E3', 'G3'],
      ['G2', 'B2', 'D3']
    ],
    melody: ['A4', 'B4', 'C5', 'B4', 'A4', 'G4', 'E4', 'F4', 'G4', 'A4', 'G4', 'F4', 'E4'],
    bass: ['A2', 'F2', 'C2', 'G2'],
    style: 'urban_melancholy'
  },
  {
    filename: 'sorin_copilul_de_aur_suflet_pereche.mp3',
    bpm: 94,
    durationSec: 30,
    chords: [
      ['C3', 'Eb3', 'G3'],
      ['F2', 'Ab2', 'C3'],
      ['G2', 'B2', 'D3', 'F3'],
      ['C3', 'Eb3', 'G3']
    ],
    melody: ['G4', 'Ab4', 'G4', 'F4', 'Eb4', 'D4', 'C4', 'D4', 'Eb4', 'F4', 'G4', 'F4', 'Eb4', 'D4', 'C4'],
    bass: ['C2', 'F2', 'G2', 'C2'],
    style: 'passionate_ballad'
  },
  {
    filename: 'sami_g_sper_ca_esti_bine.mp3',
    bpm: 90,
    durationSec: 30,
    chords: [
      ['E3', 'G3', 'B3'],
      ['C3', 'E3', 'G3'],
      ['G2', 'B2', 'D3'],
      ['D3', 'F#3', 'A3']
    ],
    melody: ['B4', 'G4', 'E4', 'G4', 'A4', 'B4', 'D5', 'B4', 'A4', 'G4', 'F#4', 'E4'],
    bass: ['E2', 'C2', 'G2', 'D2'],
    style: 'modern_acoustic'
  }
];

function synthesizeSong(config) {
  const totalSamples = Math.floor(sampleRate * config.durationSec);
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);

  const beatDuration = 60 / config.bpm;
  const barDuration = beatDuration * 4;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const barIndex = Math.floor(t / barDuration) % config.chords.length;
    const tInBar = t % barDuration;
    const currentChord = config.chords[barIndex];
    const currentBass = config.bass[barIndex % config.bass.length];

    let chordSignal = 0;
    // Arpeggiated or sustained pad
    for (let c = 0; c < currentChord.length; c++) {
      const f = noteFreqs[currentChord[c]] || 220;
      // Slight chorus detune
      const osc1 = Math.sin(2 * Math.PI * f * t);
      const osc2 = Math.sin(2 * Math.PI * (f * 1.002) * t);
      const osc3 = Math.sin(2 * Math.PI * (f * 0.998) * t);
      chordSignal += (osc1 * 0.5 + osc2 * 0.25 + osc3 * 0.25);
    }
    chordSignal = (chordSignal / currentChord.length) * 0.22;

    // Bass note
    const bf = noteFreqs[currentBass] || 110;
    const bassEnv = Math.exp(-((tInBar % beatDuration) * 2.5));
    const bassSignal = (Math.sin(2 * Math.PI * bf * t) * 0.7 + Math.sin(2 * Math.PI * bf * 2 * t) * 0.3) * 0.25 * (0.4 + 0.6 * bassEnv);

    // Melody lead
    const melodyNoteIdx = Math.floor(t / (beatDuration * 0.5)) % config.melody.length;
    const mf = noteFreqs[config.melody[melodyNoteIdx]] || 440;
    const noteTime = (t % (beatDuration * 0.5));
    const melEnv = Math.max(0, Math.sin(Math.min(1, noteTime * 4) * Math.PI * 0.5)) * Math.exp(-noteTime * 2.0);
    // Smooth bell-like lead
    const melSignal = (
      Math.sin(2 * Math.PI * mf * t) * 0.6 +
      Math.sin(2 * Math.PI * mf * 2 * t) * 0.25 +
      Math.sin(2 * Math.PI * mf * 3 * t) * 0.15
    ) * melEnv * 0.28;

    // Soft gentle beat / rhythm pulse
    const beatPhase = (t % beatDuration) / beatDuration;
    let drum = 0;
    // Soft kick on beat 0 and 2
    const isKick = (Math.floor(t / beatDuration) % 2 === 0);
    if (isKick && beatPhase < 0.15) {
      const kickFreq = 120 * (1 - beatPhase / 0.15) + 40;
      drum += Math.sin(2 * Math.PI * kickFreq * t) * Math.exp(-beatPhase * 25) * 0.2;
    }
    // Soft shaker / hat on eighth notes
    const eighthPhase = (t % (beatDuration / 2)) / (beatDuration / 2);
    if (eighthPhase < 0.08) {
      const noise = (Math.random() * 2 - 1) * Math.exp(-eighthPhase * 50);
      drum += noise * 0.06;
    }

    // Fade in at start, fade out at end
    let masterEnv = 1;
    if (t < 1.5) masterEnv = t / 1.5;
    if (t > config.durationSec - 2.5) masterEnv = Math.max(0, (config.durationSec - t) / 2.5);

    const mono = (chordSignal + bassSignal + melSignal + drum) * masterEnv;
    // Stereo panning
    left[i] = Math.max(-1, Math.min(1, mono * 0.95 + chordSignal * 0.1));
    right[i] = Math.max(-1, Math.min(1, mono * 0.95 - chordSignal * 0.1));
  }

  // Convert to 16-bit PCM Buffer
  const pcmBuffer = Buffer.alloc(totalSamples * 4);
  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.max(-32768, Math.min(32767, Math.floor(left[i] * 32767)));
    const sR = Math.max(-32768, Math.min(32767, Math.floor(right[i] * 32767)));
    pcmBuffer.writeInt16LE(sL, i * 4);
    pcmBuffer.writeInt16LE(sR, i * 4 + 2);
  }

  const wavHeader = createWavHeader(pcmBuffer.length, sampleRate, 2, 16);
  return Buffer.concat([wavHeader, pcmBuffer]);
}

const outDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating 8 audio tracks...');
songsConfig.forEach((cfg, idx) => {
  const wavPath = path.join('/tmp', `temp_${idx}.wav`);
  const mp3Path = path.join(outDir, cfg.filename);
  
  const wavData = synthesizeSong(cfg);
  fs.writeFileSync(wavPath, wavData);

  // Convert to high quality MP3 with ffmpeg
  try {
    execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -b:a 192k "${mp3Path}" 2>/dev/null`);
    console.log(`✓ Generated ${cfg.filename} (${fs.statSync(mp3Path).size} bytes)`);
  } catch (err) {
    // If ffmpeg fails, fallback to keeping it as mp3 with wav content or wav
    fs.copyFileSync(wavPath, mp3Path);
    console.log(`! Copied as fallback ${cfg.filename}`);
  }
  try { fs.unlinkSync(wavPath); } catch (_) {}
});

console.log('All 8 songs successfully created in public/audio!');
