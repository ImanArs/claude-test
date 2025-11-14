export enum GameState {
  MAIN_MENU = 'MAIN_MENU',
  PLAYING = 'PLAYING',
  SETTINGS = 'SETTINGS',
  SHOP = 'SHOP',
  PAUSED = 'PAUSED',
}

export interface GameSettings {
  soundEnabled: boolean;
  volume: number;
  shadowsEnabled: boolean;
  hapticEnabled: boolean;
  mainCarColor: string;
}

export class GameStateManager {
  private currentState: GameState;
  private settings: GameSettings;
  private onStateChange?: (newState: GameState, oldState: GameState) => void;

  constructor() {
    this.currentState = GameState.MAIN_MENU;

    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('parkingJamSettings');
    this.settings = savedSettings ? JSON.parse(savedSettings) : {
      soundEnabled: true,
      volume: 30,
      shadowsEnabled: true,
      hapticEnabled: false,
      mainCarColor: '#ff3333',
    };
  }

  public setState(newState: GameState): void {
    const oldState = this.currentState;
    this.currentState = newState;

    if (this.onStateChange) {
      this.onStateChange(newState, oldState);
    }
  }

  public getState(): GameState {
    return this.currentState;
  }

  public setOnStateChange(callback: (newState: GameState, oldState: GameState) => void): void {
    this.onStateChange = callback;
  }

  public getSettings(): GameSettings {
    return { ...this.settings };
  }

  public updateSetting<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
    this.settings[key] = value;
    this.saveSettings();
  }

  private saveSettings(): void {
    localStorage.setItem('parkingJamSettings', JSON.stringify(this.settings));
  }

  public isPlaying(): boolean {
    return this.currentState === GameState.PLAYING;
  }
}
