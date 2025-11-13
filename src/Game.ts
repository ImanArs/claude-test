import * as THREE from 'three';
import { Grid } from './Grid';
import { Car, CarData } from './Car';
import { CameraController } from './CameraController';
import { UIManager } from './UI';
import { AudioManager } from './AudioManager';
import { LEVELS, LevelConfig } from './LevelData';

export class Game {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private cameraController: CameraController;
  private grid: Grid;
  private cars: Car[] = [];
  private ui: UIManager;
  private audio: AudioManager;

  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedCar: Car | null = null;
  private dragPlane: THREE.Plane;
  private dragStartPos: THREE.Vector3;
  private dragOffset: THREE.Vector3;

  private currentLevel: number = 0;
  private mainCar: Car | null = null;
  private exitPosition: { x: number; z: number } = { x: 5, z: 2 };
  private isVictory: boolean = false;

  private clock: THREE.Clock;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent for CSS gradient

    // Initialize camera
    this.cameraController = new CameraController(window.innerWidth / window.innerHeight);

    // Initialize grid (will be updated per level)
    this.grid = new Grid(6, 6);

    // Initialize UI
    this.ui = new UIManager();
    this.ui.onRestart = () => this.restartLevel();
    this.ui.onHome = () => this.goToLevel(0);
    this.ui.onNextLevel = () => this.nextLevel();

    // Initialize audio
    this.audio = new AudioManager();

    // Input handling
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.dragStartPos = new THREE.Vector3();
    this.dragOffset = new THREE.Vector3();

    this.setupEventListeners();
    this.setupLighting();
    this.loadLevel(this.currentLevel);

    this.ui.hideLoading();
  }

  private setupLighting(): void {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Hemisphere light for sky simulation
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0xE0E0E0, 0.5);
    this.scene.add(hemisphereLight);

    // Directional light (sun) with shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;

    // Shadow camera setup
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.bias = -0.0001;

    this.scene.add(directionalLight);
  }

  private createEnvironment(levelConfig: LevelConfig): void {
    // Remove old environment
    const oldEnvironment = this.scene.getObjectByName('environment');
    if (oldEnvironment) {
      this.scene.remove(oldEnvironment);
    }

    const environmentGroup = new THREE.Group();
    environmentGroup.name = 'environment';

    // Ground/parking lot base
    const groundGeometry = new THREE.PlaneGeometry(
      this.grid.size.width * 1.2,
      this.grid.size.height * 1.2
    );
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x404040,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -0.01;
    environmentGroup.add(ground);

    // Grid lines
    const gridHelper = new THREE.GridHelper(
      Math.max(this.grid.size.width, this.grid.size.height),
      Math.max(this.grid.size.width, this.grid.size.height),
      0xffffff,
      0xffffff
    );
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    environmentGroup.add(gridHelper);

    // Exit gate
    this.createExitGate(environmentGroup, levelConfig);

    // Parking boundaries
    this.createBoundaries(environmentGroup);

    this.scene.add(environmentGroup);
  }

  private createExitGate(parent: THREE.Group, levelConfig: LevelConfig): void {
    const exitWorldPos = this.grid.gridToWorld(levelConfig.exitX, levelConfig.exitZ);

    // Exit marker (yellow striped)
    const exitGeometry = new THREE.PlaneGeometry(1.2, 1.2);
    const exitMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.3,
      roughness: 0.5,
    });
    const exitMarker = new THREE.Mesh(exitGeometry, exitMaterial);
    exitMarker.rotation.x = -Math.PI / 2;
    exitMarker.position.copy(exitWorldPos);
    exitMarker.position.y = 0.01;
    parent.add(exitMarker);

    // Exit arrow
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, -0.3);
    arrowShape.lineTo(0.2, 0);
    arrowShape.lineTo(0, 0.3);
    arrowShape.lineTo(0, 0.1);
    arrowShape.lineTo(-0.3, 0.1);
    arrowShape.lineTo(-0.3, -0.1);
    arrowShape.lineTo(0, -0.1);

    const arrowGeometry = new THREE.ShapeGeometry(arrowShape);
    const arrowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrow.rotation.x = -Math.PI / 2;
    arrow.rotation.z = 0;
    arrow.position.copy(exitWorldPos);
    arrow.position.y = 0.02;
    parent.add(arrow);
  }

  private createBoundaries(parent: THREE.Group): void {
    const boundaryMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.7,
      metalness: 0.3,
    });

    const width = this.grid.size.width;
    const height = this.grid.size.height;
    const thickness = 0.2;
    const boundaryHeight = 0.3;

    // Create boundary walls (except exit side)
    const boundaries = [
      // Left
      { w: thickness, h: height + thickness * 2, x: -width / 2 - thickness / 2, z: 0 },
      // Right (with gap for exit)
      { w: thickness, h: height + thickness * 2, x: width / 2 + thickness / 2, z: 0 },
      // Front
      { w: width, h: thickness, x: 0, z: -height / 2 - thickness / 2 },
      // Back
      { w: width, h: thickness, x: 0, z: height / 2 + thickness / 2 },
    ];

    boundaries.forEach(b => {
      const geometry = new THREE.BoxGeometry(b.w, boundaryHeight, b.h);
      const mesh = new THREE.Mesh(geometry, boundaryMaterial);
      mesh.position.set(b.x, boundaryHeight / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
    });
  }

  private loadLevel(levelIndex: number): void {
    if (levelIndex >= LEVELS.length) {
      levelIndex = 0; // Loop back to first level
    }

    const levelConfig = LEVELS[levelIndex];
    this.currentLevel = levelIndex;
    this.isVictory = false;

    // Clear existing cars
    this.cars.forEach(car => {
      this.scene.remove(car.mesh);
      car.dispose();
    });
    this.cars = [];
    this.mainCar = null;

    // Update grid size
    this.grid = new Grid(levelConfig.gridWidth, levelConfig.gridHeight);
    this.exitPosition = { x: levelConfig.exitX, z: levelConfig.exitZ };

    // Create environment
    this.createEnvironment(levelConfig);

    // Adjust camera for grid size
    this.cameraController.adjustForGridSize(levelConfig.gridWidth, levelConfig.gridHeight);

    // Create cars
    levelConfig.cars.forEach(carData => {
      const car = new Car(carData, this.grid);
      this.cars.push(car);
      this.scene.add(car.mesh);

      if (carData.isMain) {
        this.mainCar = car;
      }
    });

    // Update UI
    this.ui.setLevel(levelConfig.id);
  }

  private restartLevel(): void {
    this.loadLevel(this.currentLevel);
  }

  private nextLevel(): void {
    this.loadLevel(this.currentLevel + 1);
  }

  private goToLevel(levelIndex: number): void {
    this.loadLevel(levelIndex);
  }

  private setupEventListeners(): void {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.onPointerDown(e.clientX, e.clientY));
    this.canvas.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
    this.canvas.addEventListener('mouseup', () => this.onPointerUp());

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onPointerDown(touch.clientX, touch.clientY);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.onPointerMove(touch.clientX, touch.clientY);
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.onPointerUp();
    }, { passive: false });

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private onPointerDown(clientX: number, clientY: number): void {
    if (this.isVictory) return;

    this.updateMousePosition(clientX, clientY);
    this.raycaster.setFromCamera(this.mouse, this.cameraController.camera);

    // Check if we clicked on a car
    const carMeshes = this.cars.map(car => car.mesh);
    const intersects = this.raycaster.intersectObjects(carMeshes, true);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const car = this.cars.find(c => c.mesh === clickedMesh.parent || c.mesh.children.includes(clickedMesh));

      if (car) {
        this.selectedCar = car;
        this.selectedCar.setSelected(true);
        this.selectedCar.startDrag();

        this.audio.playSelect();

        // Calculate drag offset
        this.raycaster.ray.intersectPlane(this.dragPlane, this.dragStartPos);
        this.dragOffset.copy(this.selectedCar.mesh.position).sub(this.dragStartPos);

        this.cameraController.setSwayEnabled(false);
      }
    }
  }

  private onPointerMove(clientX: number, clientY: number): void {
    if (!this.selectedCar || this.isVictory) return;

    this.updateMousePosition(clientX, clientY);
    this.raycaster.setFromCamera(this.mouse, this.cameraController.camera);

    const intersectPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.dragPlane, intersectPoint);
    intersectPoint.add(this.dragOffset);

    // Constrain movement to car's axis
    const gridPos = this.grid.worldToGrid(intersectPoint);

    if (this.selectedCar.data.isHorizontal) {
      // Allow horizontal movement only
      const clampedX = Math.max(0, Math.min(this.grid.size.width - this.selectedCar.data.length, gridPos.x));
      const worldPos = this.grid.gridToWorld(clampedX, this.selectedCar.gridPosition.z);
      this.selectedCar.mesh.position.x = worldPos.x;
    } else {
      // Allow vertical movement only
      const clampedZ = Math.max(0, Math.min(this.grid.size.height - this.selectedCar.data.length, gridPos.z));
      const worldPos = this.grid.gridToWorld(this.selectedCar.gridPosition.x, clampedZ);
      this.selectedCar.mesh.position.z = worldPos.z;
    }
  }

  private onPointerUp(): void {
    if (!this.selectedCar || this.isVictory) return;

    const currentWorldPos = this.selectedCar.mesh.position;
    const gridPos = this.grid.worldToGrid(currentWorldPos);

    const moved = this.selectedCar.moveTo(gridPos.x, gridPos.z);

    if (moved) {
      this.audio.playSlide();
      this.checkWinCondition();
    } else {
      this.audio.playBlocked();
    }

    this.selectedCar.setSelected(false);
    this.selectedCar.endDrag();
    this.selectedCar = null;

    this.cameraController.setSwayEnabled(true);
  }

  private updateMousePosition(clientX: number, clientY: number): void {
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  }

  private checkWinCondition(): void {
    if (!this.mainCar || this.isVictory) return;

    // Check if main car reached exit
    const mainCarPos = this.mainCar.gridPosition;

    if (mainCarPos.x === this.exitPosition.x && mainCarPos.z === this.exitPosition.z) {
      this.triggerVictory();
    }
  }

  private triggerVictory(): void {
    this.isVictory = true;
    this.audio.playVictory();

    // Animate cars driving away
    this.cars.forEach(car => {
      const direction = new THREE.Vector3(
        Math.random() - 0.5,
        0,
        Math.random() - 0.5
      ).normalize();
      car.animateDriveAway(direction, 1.5);
    });

    // Show victory UI after animation
    setTimeout(() => {
      const isLastLevel = this.currentLevel >= LEVELS.length - 1;
      this.ui.showVictory(isLastLevel);
    }, 800);
  }

  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.cameraController.updateAspect(width / height);
    this.renderer.setSize(width, height);
  }

  public update(): void {
    const currentTime = performance.now() / 1000;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update camera
    this.cameraController.update(deltaTime);

    // Update cars
    this.cars.forEach(car => car.update(deltaTime));

    // Render
    this.renderer.render(this.scene, this.cameraController.camera);
  }

  public start(): void {
    this.lastTime = performance.now() / 1000;
    this.animate();
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.update();
  };
}
