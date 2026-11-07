export type InstrumentType = 'xylophone' | 'bells';

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentInstrument: InstrumentType = 'xylophone';
  private volume: number = 0.8;
  private isMuted: boolean = false;

  constructor() {
    // Lazily initialized on first user gesture
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setInstrument(type: InstrumentType) {
    this.currentInstrument = type;
  }

  public getInstrument(): InstrumentType {
    return this.currentInstrument;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play a single note pitch with the active instrument
   */
  public playNote(frequency: number, instrumentOverride?: InstrumentType, durationMultiplier = 1.0) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const instrument = instrumentOverride || this.currentInstrument;
    const now = this.ctx.currentTime;

    if (instrument === 'xylophone') {
      this.synthesizeXylophone(frequency, now, durationMultiplier);
    } else {
      this.synthesizeBells(frequency, now, durationMultiplier);
    }
  }

  /**
   * Acoustic Xylophone Synthesis:
   * - Mallet strike pop (burst of high frequency)
   * - Warm fundamental sine with snappy initial impact
   * - 3rd harmonic overtone for wooden resonance
   */
  private synthesizeXylophone(freq: number, startTime: number, durMult: number) {
    if (!this.ctx || !this.masterGain) return;

    const mainGain = this.ctx.createGain();
    mainGain.connect(this.masterGain);

    // 1. Wooden Mallet Click (High impact transient, decaying in 0.03s)
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(freq * 4.5, startTime);
    clickOsc.frequency.exponentialRampToValueAtTime(100, startTime + 0.03);

    clickGain.gain.setValueAtTime(0.4, startTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

    clickOsc.connect(clickGain);
    clickGain.connect(mainGain);
    clickOsc.start(startTime);
    clickOsc.stop(startTime + 0.04);

    // 2. Fundamental pitch (warm sine wave with wooden bar characteristic)
    const fundOsc = this.ctx.createOscillator();
    const fundGain = this.ctx.createGain();
    fundOsc.type = 'sine';
    fundOsc.frequency.setValueAtTime(freq, startTime);

    const decayTime = 0.65 * durMult;
    fundGain.gain.setValueAtTime(0.001, startTime);
    fundGain.gain.linearRampToValueAtTime(0.9, startTime + 0.006); // quick attack
    fundGain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.15);
    fundGain.gain.exponentialRampToValueAtTime(0.0001, startTime + decayTime);

    fundOsc.connect(fundGain);
    fundGain.connect(mainGain);
    fundOsc.start(startTime);
    fundOsc.stop(startTime + decayTime + 0.05);

    // 3. Wooden Overtone (tuned ~3x fundamental frequency for xylophones)
    const overtoneOsc = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();
    overtoneOsc.type = 'triangle';
    overtoneOsc.frequency.setValueAtTime(freq * 3, startTime);

    const overtoneDecay = 0.25 * durMult;
    overtoneGain.gain.setValueAtTime(0.001, startTime);
    overtoneGain.gain.linearRampToValueAtTime(0.35, startTime + 0.004);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + overtoneDecay);

    overtoneOsc.connect(overtoneGain);
    overtoneGain.connect(mainGain);
    overtoneOsc.start(startTime);
    overtoneOsc.stop(startTime + overtoneDecay + 0.05);
  }

  /**
   * Magic Bell / Chime Synthesis:
   * - Shimmering bright strike
   * - Bell inharmonic ratios (1.0x, 2.76x, 5.4x)
   * - Long singing sustain with exponential ring
   */
  private synthesizeBells(freq: number, startTime: number, durMult: number) {
    if (!this.ctx || !this.masterGain) return;

    const bellGain = this.ctx.createGain();
    bellGain.connect(this.masterGain);

    const ringDuration = 1.8 * durMult;

    // Harmonic partial ratios typical of tuned glockenspiel / bells
    const partials = [
      { ratio: 1.0, gain: 0.8, decay: ringDuration },
      { ratio: 2.76, gain: 0.35, decay: ringDuration * 0.75 },
      { ratio: 5.4, gain: 0.18, decay: ringDuration * 0.5 },
      { ratio: 8.9, gain: 0.08, decay: ringDuration * 0.3 },
    ];

    partials.forEach(({ ratio, gain, decay }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * ratio, startTime);

      g.gain.setValueAtTime(0.001, startTime);
      g.gain.linearRampToValueAtTime(gain, startTime + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

      osc.connect(g);
      g.connect(bellGain);

      osc.start(startTime);
      osc.stop(startTime + decay + 0.05);
    });

    // Metallic chime sparkle attack
    const shimmerOsc = this.ctx.createOscillator();
    const shimmerGain = this.ctx.createGain();
    shimmerOsc.type = 'triangle';
    shimmerOsc.frequency.setValueAtTime(freq * 12, startTime);
    shimmerGain.gain.setValueAtTime(0.12, startTime);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

    shimmerOsc.connect(shimmerGain);
    shimmerGain.connect(bellGain);
    shimmerOsc.start(startTime);
    shimmerOsc.stop(startTime + 0.07);
  }

  /**
   * Cheerful victory fanfare for winning quiz rounds or completing a song
   */
  public playSuccessFanfare() {
    this.init();
    if (!this.ctx) return;

    const notes = [
      { freq: 261.63, delay: 0 },    // C4 (Do)
      { freq: 329.63, delay: 0.12 }, // E4 (Mi)
      { freq: 392.00, delay: 0.24 }, // G4 (Sol)
      { freq: 523.25, delay: 0.38 }, // C5 (High Do)
    ];

    notes.forEach((n) => {
      setTimeout(() => {
        this.playNote(n.freq, 'bells', 1.4);
      }, n.delay * 1000);
    });
  }

  /**
   * Gentle, encouraging sound when a wrong note is tapped (not jarring)
   */
  public playTryAgainJingle() {
    this.init();
    if (!this.ctx) return;

    const notes = [
      { freq: 349.23, delay: 0 },    // Fa
      { freq: 329.63, delay: 0.16 }, // Mi
    ];

    notes.forEach((n) => {
      setTimeout(() => {
        this.playNote(n.freq, 'xylophone', 0.8);
      }, n.delay * 1000);
    });
  }

  /**
   * Soft count-in tap
   */
  public playWoodblock() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    g.gain.setValueAtTime(0.3, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(g);
    g.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const soundEngine = new SoundEngine();

