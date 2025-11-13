import * as THREE from 'three';
import { Grid, GridPosition } from './Grid';

export interface CarData {
  id: string;
  gridX: number;
  gridZ: number;
  length: number;
  isHorizontal: boolean;
  color: string;
  isMain?: boolean;
}

export class Car {
  public mesh: THREE.Group;
  public data: CarData;
  public gridPosition: GridPosition;
  private grid: Grid;
  private targetPosition: THREE.Vector3;
  private isDragging: boolean = false;
  private highlightPlane?: THREE.Mesh;
  private originalY: number = 0.15;
  private hoverY: number = 0.25;

  constructor(data: CarData, grid: Grid) {
    this.data = data;
    this.grid = grid;
    this.gridPosition = { x: data.gridX, z: data.gridZ };

    this.mesh = new THREE.Group();
    this.createCarMesh();
    this.createHighlightPlane();

    const worldPos = grid.gridToWorld(data.gridX, data.gridZ);
    this.mesh.position.copy(worldPos);
    this.mesh.position.y = this.originalY;
    this.targetPosition = this.mesh.position.clone();

    // Occupy grid cells
    this.updateGridOccupancy(true);
  }

  private createCarMesh(): void {
    const width = this.data.isHorizontal ? this.data.length : 1;
    const depth = this.data.isHorizontal ? 1 : this.data.length;

    // Car body
    const bodyGeometry = new THREE.BoxGeometry(
      width * 0.85,
      0.25,
      depth * 0.85
    );
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: this.data.color,
      metalness: 0.6,
      roughness: 0.4,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // Car roof (slightly smaller)
    const roofGeometry = new THREE.BoxGeometry(
      width * 0.6,
      0.15,
      depth * 0.6
    );
    const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
    roof.position.y = 0.2;
    roof.castShadow = true;
    this.mesh.add(roof);

    // Windows (darker)
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const windowGeometry = new THREE.BoxGeometry(
      width * 0.55,
      0.12,
      depth * 0.55
    );
    const windows = new THREE.Mesh(windowGeometry, windowMaterial);
    windows.position.y = 0.22;
    this.mesh.add(windows);

    // Add a small indicator for the front
    const indicatorGeometry = new THREE.BoxGeometry(
      this.data.isHorizontal ? 0.1 : width * 0.3,
      0.05,
      this.data.isHorizontal ? depth * 0.3 : 0.1
    );
    const indicatorMaterial = new THREE.MeshStandardMaterial({
      color: this.data.isMain ? 0xffff00 : 0xffffff,
      emissive: this.data.isMain ? 0xffff00 : 0x000000,
      emissiveIntensity: this.data.isMain ? 0.3 : 0,
    });
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.y = 0.15;

    if (this.data.isHorizontal) {
      indicator.position.x = (width * 0.85) / 2 - 0.05;
    } else {
      indicator.position.z = (depth * 0.85) / 2 - 0.05;
    }

    this.mesh.add(indicator);
  }

  private createHighlightPlane(): void {
    const width = this.data.isHorizontal ? this.data.length : 1;
    const depth = this.data.isHorizontal ? 1 : this.data.length;

    const geometry = new THREE.PlaneGeometry(width * 0.95, depth * 0.95);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    this.highlightPlane = new THREE.Mesh(geometry, material);
    this.highlightPlane.rotation.x = -Math.PI / 2;
    this.highlightPlane.position.y = 0.02;
    this.highlightPlane.visible = false;
    this.mesh.add(this.highlightPlane);
  }

  public setSelected(selected: boolean): void {
    if (this.highlightPlane) {
      this.highlightPlane.visible = selected;
    }

    if (selected) {
      this.targetPosition.y = this.hoverY;
      this.mesh.scale.set(1.05, 1.05, 1.05);
    } else {
      this.targetPosition.y = this.originalY;
      this.mesh.scale.set(1, 1, 1);
    }
  }

  public startDrag(): void {
    this.isDragging = true;
    this.updateGridOccupancy(false);
  }

  public endDrag(): void {
    this.isDragging = false;
  }

  public canMoveTo(newGridX: number, newGridZ: number): boolean {
    // Check if movement is along the correct axis
    if (this.data.isHorizontal) {
      if (newGridZ !== this.gridPosition.z) return false;
    } else {
      if (newGridX !== this.gridPosition.x) return false;
    }

    // Check if new position is valid
    return this.grid.isAreaFree(newGridX, newGridZ, this.data.length, this.data.isHorizontal);
  }

  public moveTo(newGridX: number, newGridZ: number): boolean {
    if (!this.canMoveTo(newGridX, newGridZ)) {
      // Snap back to current position
      const worldPos = this.grid.gridToWorld(this.gridPosition.x, this.gridPosition.z);
      this.targetPosition.x = worldPos.x;
      this.targetPosition.z = worldPos.z;
      return false;
    }

    this.gridPosition.x = newGridX;
    this.gridPosition.z = newGridZ;

    const worldPos = this.grid.gridToWorld(newGridX, newGridZ);
    this.targetPosition.x = worldPos.x;
    this.targetPosition.z = worldPos.z;

    this.updateGridOccupancy(true);
    return true;
  }

  private updateGridOccupancy(occupy: boolean): void {
    this.grid.occupyArea(
      this.gridPosition.x,
      this.gridPosition.z,
      this.data.length,
      this.data.isHorizontal,
      occupy
    );
  }

  public update(deltaTime: number): void {
    // Smooth lerp to target position
    const lerpFactor = Math.min(1, deltaTime * 10);
    this.mesh.position.lerp(this.targetPosition, lerpFactor);
  }

  public getOccupiedCells(): GridPosition[] {
    const cells: GridPosition[] = [];
    for (let i = 0; i < this.data.length; i++) {
      cells.push({
        x: this.data.isHorizontal ? this.gridPosition.x + i : this.gridPosition.x,
        z: this.data.isHorizontal ? this.gridPosition.z : this.gridPosition.z + i,
      });
    }
    return cells;
  }

  public animateDriveAway(direction: THREE.Vector3, duration: number = 1): void {
    const startPos = this.mesh.position.clone();
    const endPos = startPos.clone().add(direction.multiplyScalar(15));
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeInQuad(progress);

      this.mesh.position.lerpVectors(startPos, endPos, eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  private easeInQuad(t: number): number {
    return t * t;
  }

  public dispose(): void {
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
