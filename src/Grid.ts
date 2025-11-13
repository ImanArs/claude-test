import * as THREE from 'three';

export interface GridPosition {
  x: number;
  z: number;
}

export class Grid {
  public size: { width: number; height: number };
  public cellSize: number = 1;
  private occupancy: Map<string, boolean>;

  constructor(width: number, height: number) {
    this.size = { width, height };
    this.occupancy = new Map();
  }

  /**
   * Convert grid coordinates to world position
   */
  gridToWorld(gridX: number, gridZ: number): THREE.Vector3 {
    const offsetX = -(this.size.width * this.cellSize) / 2 + this.cellSize / 2;
    const offsetZ = -(this.size.height * this.cellSize) / 2 + this.cellSize / 2;

    return new THREE.Vector3(
      gridX * this.cellSize + offsetX,
      0,
      gridZ * this.cellSize + offsetZ
    );
  }

  /**
   * Convert world position to grid coordinates
   */
  worldToGrid(worldPos: THREE.Vector3): GridPosition {
    const offsetX = (this.size.width * this.cellSize) / 2 - this.cellSize / 2;
    const offsetZ = (this.size.height * this.cellSize) / 2 - this.cellSize / 2;

    const gridX = Math.round((worldPos.x + offsetX) / this.cellSize);
    const gridZ = Math.round((worldPos.z + offsetZ) / this.cellSize);

    return { x: gridX, z: gridZ };
  }

  /**
   * Get cell key for occupancy map
   */
  private getCellKey(x: number, z: number): string {
    return `${x},${z}`;
  }

  /**
   * Check if a cell is occupied
   */
  isOccupied(x: number, z: number): boolean {
    return this.occupancy.get(this.getCellKey(x, z)) || false;
  }

  /**
   * Set cell occupancy
   */
  setOccupied(x: number, z: number, occupied: boolean): void {
    const key = this.getCellKey(x, z);
    if (occupied) {
      this.occupancy.set(key, true);
    } else {
      this.occupancy.delete(key);
    }
  }

  /**
   * Check if position is within grid bounds
   */
  isInBounds(x: number, z: number): boolean {
    return x >= 0 && x < this.size.width && z >= 0 && z < this.size.height;
  }

  /**
   * Check if a rectangular area is free (for car placement)
   */
  isAreaFree(x: number, z: number, length: number, isHorizontal: boolean, excludeCells?: GridPosition[]): boolean {
    const excludeSet = new Set(excludeCells?.map(c => this.getCellKey(c.x, c.z)));

    for (let i = 0; i < length; i++) {
      const checkX = isHorizontal ? x + i : x;
      const checkZ = isHorizontal ? z : z + i;

      if (!this.isInBounds(checkX, checkZ)) {
        return false;
      }

      const cellKey = this.getCellKey(checkX, checkZ);
      if (!excludeSet.has(cellKey) && this.isOccupied(checkX, checkZ)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Occupy a rectangular area
   */
  occupyArea(x: number, z: number, length: number, isHorizontal: boolean, occupy: boolean): void {
    for (let i = 0; i < length; i++) {
      const occupyX = isHorizontal ? x + i : x;
      const occupyZ = isHorizontal ? z : z + i;
      this.setOccupied(occupyX, occupyZ, occupy);
    }
  }

  /**
   * Clear all occupancy
   */
  clear(): void {
    this.occupancy.clear();
  }
}
