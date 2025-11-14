import { GameSettings } from './GameStateManager';

export class UIManager {
  // Game UI elements
  private topPanel: HTMLElement;
  private levelIndicator: HTMLElement;
  private restartButton: HTMLElement;
  private homeButton: HTMLElement;
  private victoryOverlay: HTMLElement;
  private nextLevelButton: HTMLElement;
  private loadingElement: HTMLElement;

  // Menu screens
  private mainMenu: HTMLElement;
  private settingsScreen: HTMLElement;
  private shopScreen: HTMLElement;

  // Confetti
  private confettiCanvas: HTMLCanvasElement;
  private confettiCtx: CanvasRenderingContext2D;
  private confettiParticles: Confetti[] = [];

  // Callbacks
  public onRestart?: () => void;
  public onHome?: () => void;
  public onNextLevel?: () => void;
  public onPlay?: () => void;
  public onSettingsChange?: (settings: Partial<GameSettings>) => void;
  public onColorChange?: (color: string) => void;

  constructor() {
    // Get all UI elements
    this.topPanel = document.getElementById('top-panel')!;
    this.levelIndicator = document.getElementById('level-indicator')!;
    this.restartButton = document.getElementById('restart-button')!;
    this.homeButton = document.getElementById('home-button')!;
    this.victoryOverlay = document.getElementById('victory-overlay')!;
    this.nextLevelButton = document.getElementById('next-level-button')!;
    this.loadingElement = document.getElementById('loading')!;

    this.mainMenu = document.getElementById('main-menu')!;
    this.settingsScreen = document.getElementById('settings-screen')!;
    this.shopScreen = document.getElementById('shop-screen')!;

    this.confettiCanvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    this.confettiCtx = this.confettiCanvas.getContext('2d')!;

    this.setupEventListeners();
    this.resizeConfettiCanvas();
    window.addEventListener('resize', () => this.resizeConfettiCanvas());
  }

  private setupEventListeners(): void {
    // Game UI listeners
    this.restartButton.addEventListener('click', () => {
      if (this.onRestart) this.onRestart();
    });

    this.homeButton.addEventListener('click', () => {
      if (this.onHome) this.onHome();
    });

    this.nextLevelButton.addEventListener('click', () => {
      this.hideVictory();
      if (this.onNextLevel) this.onNextLevel();
    });

    // Main menu listeners
    document.getElementById('play-button')!.addEventListener('click', () => {
      if (this.onPlay) this.onPlay();
    });

    document.getElementById('settings-button')!.addEventListener('click', () => {
      this.showSettings();
    });

    document.getElementById('shop-button')!.addEventListener('click', () => {
      this.showShop();
    });

    // Settings listeners
    document.getElementById('settings-back')!.addEventListener('click', () => {
      this.hideSettings();
    });

    this.setupSettingsListeners();

    // Shop listeners
    document.getElementById('shop-back')!.addEventListener('click', () => {
      this.hideShop();
    });

    this.setupShopListeners();
  }

  private setupSettingsListeners(): void {
    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle')!;
    soundToggle.addEventListener('click', () => {
      soundToggle.classList.toggle('active');
      if (this.onSettingsChange) {
        this.onSettingsChange({ soundEnabled: soundToggle.classList.contains('active') });
      }
    });

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    const volumeValue = document.getElementById('volume-value')!;
    volumeSlider.addEventListener('input', () => {
      const value = parseInt(volumeSlider.value);
      volumeValue.textContent = `${value}%`;
      if (this.onSettingsChange) {
        this.onSettingsChange({ volume: value });
      }
    });

    // Shadows toggle
    const shadowsToggle = document.getElementById('shadows-toggle')!;
    shadowsToggle.addEventListener('click', () => {
      shadowsToggle.classList.toggle('active');
      if (this.onSettingsChange) {
        this.onSettingsChange({ shadowsEnabled: shadowsToggle.classList.contains('active') });
      }
    });

    // Haptic toggle
    const hapticToggle = document.getElementById('haptic-toggle')!;
    hapticToggle.addEventListener('click', () => {
      hapticToggle.classList.toggle('active');
      if (this.onSettingsChange) {
        this.onSettingsChange({ hapticEnabled: hapticToggle.classList.contains('active') });
      }
    });
  }

  private setupShopListeners(): void {
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove selected from all
        colorItems.forEach(i => {
          i.classList.remove('selected');
          i.textContent = '';
        });

        // Add selected to clicked
        item.classList.add('selected');
        item.textContent = '✓';

        const color = item.getAttribute('data-color');
        if (color && this.onColorChange) {
          this.onColorChange(color);
        }
      });
    });
  }

  private resizeConfettiCanvas(): void {
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  // Screen management
  public showMainMenu(): void {
    this.mainMenu.classList.remove('hidden');
    this.settingsScreen.classList.remove('show');
    this.shopScreen.classList.remove('show');
    this.topPanel.style.display = 'none';
    this.hideVictory();
  }

  public hideMainMenu(): void {
    this.mainMenu.classList.add('hidden');
  }

  public showSettings(): void {
    this.mainMenu.classList.add('hidden');
    this.settingsScreen.classList.add('show');
  }

  public hideSettings(): void {
    this.settingsScreen.classList.remove('show');
    this.mainMenu.classList.remove('hidden');
  }

  public showShop(): void {
    this.mainMenu.classList.add('hidden');
    this.shopScreen.classList.add('show');
  }

  public hideShop(): void {
    this.shopScreen.classList.remove('show');
    this.mainMenu.classList.remove('hidden');
  }

  public showGameUI(): void {
    this.topPanel.style.display = 'flex';
    this.hideMainMenu();
  }

  public hideGameUI(): void {
    this.topPanel.style.display = 'none';
  }

  // Settings management
  public applySettings(settings: GameSettings): void {
    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle')!;
    if (settings.soundEnabled) {
      soundToggle.classList.add('active');
    } else {
      soundToggle.classList.remove('active');
    }

    // Volume
    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    const volumeValue = document.getElementById('volume-value')!;
    volumeSlider.value = settings.volume.toString();
    volumeValue.textContent = `${settings.volume}%`;

    // Shadows
    const shadowsToggle = document.getElementById('shadows-toggle')!;
    if (settings.shadowsEnabled) {
      shadowsToggle.classList.add('active');
    } else {
      shadowsToggle.classList.remove('active');
    }

    // Haptic
    const hapticToggle = document.getElementById('haptic-toggle')!;
    if (settings.hapticEnabled) {
      hapticToggle.classList.add('active');
    } else {
      hapticToggle.classList.remove('active');
    }

    // Main car color
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach(item => {
      const color = item.getAttribute('data-color');
      if (color === settings.mainCarColor) {
        item.classList.add('selected');
        item.textContent = '✓';
      } else {
        item.classList.remove('selected');
        item.textContent = '';
      }
    });
  }

  // Game UI methods
  public setLevel(level: number): void {
    this.levelIndicator.textContent = `LEVEL ${level}`;
  }

  public hideLoading(): void {
    this.loadingElement.style.display = 'none';
  }

  public showVictory(isLastLevel: boolean = false): void {
    this.victoryOverlay.classList.add('show');
    this.createConfetti();

    if (isLastLevel) {
      this.nextLevelButton.textContent = 'Play Again';
      document.getElementById('victory-message')!.textContent = 'You completed all levels!';
    } else {
      this.nextLevelButton.textContent = 'Next Level';
      document.getElementById('victory-message')!.textContent = 'You cleared the jam!';
    }
  }

  public hideVictory(): void {
    this.victoryOverlay.classList.remove('show');
    this.confettiParticles = [];
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
  }

  private createConfetti(): void {
    const colors = ['#ff3333', '#3366ff', '#ffaa00', '#9933ff', '#00cc66', '#ff6699', '#ffcc00'];

    for (let i = 0; i < 150; i++) {
      this.confettiParticles.push(new Confetti(
        Math.random() * this.confettiCanvas.width,
        -20 - Math.random() * 100,
        colors[Math.floor(Math.random() * colors.length)]
      ));
    }

    this.animateConfetti();
  }

  private animateConfetti(): void {
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const particle = this.confettiParticles[i];
      particle.update();
      particle.draw(this.confettiCtx);

      if (particle.y > this.confettiCanvas.height) {
        this.confettiParticles.splice(i, 1);
      }
    }

    if (this.confettiParticles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    }
  }
}

class Confetti {
  public x: number;
  public y: number;
  private color: string;
  private size: number;
  private speedY: number;
  private speedX: number;
  private rotation: number;
  private rotationSpeed: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() * 0.1 - 0.05;
  }

  public update(): void {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
    this.speedY += 0.1; // Gravity
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}
