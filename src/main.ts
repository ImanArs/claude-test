import { Game } from './Game';
import './style.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  // Initialize and start the game
  const game = new Game(canvas);
  game.start();

  console.log('🚗 Parking Jam 3D - Game Started!');
  console.log('📱 Touch or click and drag cars to move them');
  console.log('🎯 Get the red car to the yellow exit!');
});
