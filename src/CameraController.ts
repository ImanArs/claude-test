import * as THREE from 'three';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  private basePosition: THREE.Vector3;
  private swayTime: number = 0;
  private swayEnabled: boolean = true;

  constructor(aspect: number) {
    // Wider FOV for better view of the parking lot
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);

    // Better isometric-style camera position - more top-down view
    // Position is higher and more centered for clear view of all cars
    this.basePosition = new THREE.Vector3(4, 10, 8);
    this.camera.position.copy(this.basePosition);
    this.camera.lookAt(0, 0, 0);
  }

  public update(deltaTime: number): void {
    if (!this.swayEnabled) return;

    this.swayTime += deltaTime * 0.5;

    // Subtle camera sway animation
    const swayAmount = 0.003;
    const swayX = Math.sin(this.swayTime) * swayAmount;
    const swayY = Math.cos(this.swayTime * 0.7) * swayAmount * 0.5;

    this.camera.position.x = this.basePosition.x + swayX;
    this.camera.position.y = this.basePosition.y + swayY;
    this.camera.lookAt(0, 0, 0);
  }

  public setSwayEnabled(enabled: boolean): void {
    this.swayEnabled = enabled;
    if (!enabled) {
      this.camera.position.copy(this.basePosition);
      this.camera.lookAt(0, 0, 0);
    }
  }

  public updateAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public adjustForGridSize(gridWidth: number, gridHeight: number): void {
    // Adjust camera distance based on grid size for optimal view
    const maxSize = Math.max(gridWidth, gridHeight);
    const distance = maxSize * 1.3 + 4;

    // Position: slightly to the side (x), high up (y), and back (z)
    // This gives a clear isometric view of the entire parking lot
    this.basePosition.set(distance * 0.5, distance * 1.1, distance * 0.9);
    this.camera.position.copy(this.basePosition);
    this.camera.lookAt(0, 0, 0);
  }
}
