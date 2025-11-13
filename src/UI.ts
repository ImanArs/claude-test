export class UIManager {
  private levelIndicator: HTMLElement;
  private restartButton: HTMLElement;
  private homeButton: HTMLElement;
  private victoryOverlay: HTMLElement;
  private nextLevelButton: HTMLElement;
  private loadingElement: HTMLElement;
  private confettiCanvas: HTMLCanvasElement;
  private confettiCtx: CanvasRenderingContext2D;
  private confettiParticles: Confetti[] = [];

  public onRestart?: () => void;
  public onHome?: () => void;
  public onNextLevel?: () => void;

  constructor() {
    this.levelIndicator = document.getElementById('level-indicator')!;
    this.restartButton = document.getElementById('restart-button')!;
    this.homeButton = document.getElementById('home-button')!;
    this.victoryOverlay = document.getElementById('victory-overlay')!;
    this.nextLevelButton = document.getElementById('next-level-button')!;
    this.loadingElement = document.getElementById('loading')!;
    this.confettiCanvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    this.confettiCtx = this.confettiCanvas.getContext('2d')!;

    this.setupEventListeners();
    this.resizeConfettiCanvas();
    window.addEventListener('resize', () => this.resizeConfettiCanvas());
  }

  private setupEventListeners(): void {
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
  }

  private resizeConfettiCanvas(): void {
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

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
