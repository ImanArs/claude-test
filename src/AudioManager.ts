export class AudioManager {
  private audioContext?: AudioContext;
  private masterVolume: number = 0.3;
  private enabled: boolean = true;

  constructor() {
    // Initialize audio context on first user interaction
    document.addEventListener('click', () => this.initAudioContext(), { once: true });
    document.addEventListener('touchstart', () => this.initAudioContext(), { once: true });
  }

  private initAudioContext(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 1): void {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(this.masterVolume * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  public playSlide(): void {
    this.playTone(200, 0.1, 'sine', 0.3);
  }

  public playBlocked(): void {
    this.playTone(100, 0.15, 'square', 0.4);
  }

  public playVictory(): void {
    if (!this.enabled || !this.audioContext) return;

    const notes = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.15 },  // E5
      { freq: 783.99, time: 0.3 },   // G5
      { freq: 1046.50, time: 0.45 }, // C6
    ];

    notes.forEach(note => {
      setTimeout(() => this.playTone(note.freq, 0.2, 'sine', 0.5), note.time * 1000);
    });
  }

  public playSelect(): void {
    this.playTone(400, 0.05, 'sine', 0.2);
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}
