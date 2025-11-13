import * as THREE from 'three';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  private basePosition: THREE.Vector3;
  private swayTime: number = 0;
  private swayEnabled: boolean = true;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);

    // Isometric-style camera position
    this.basePosition = new THREE.Vector3(6, 8, 6);
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
    // Adjust camera distance based on grid size
    const maxSize = Math.max(gridWidth, gridHeight);
    const distance = maxSize * 1.5 + 3;

    this.basePosition.set(distance * 0.7, distance * 0.9, distance * 0.7);
    this.camera.position.copy(this.basePosition);
    this.camera.lookAt(0, 0, 0);
  }
}
