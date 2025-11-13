# 🚗 Parking Jam 3D

A complete, mobile-optimized browser game inspired by **Parking Jam 3D**, built with **TypeScript** and **Three.js**.

![Game Screenshot](https://img.shields.io/badge/status-playable-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.160-orange)

## 🎮 How to Play

**Objective:** Clear the parking lot by moving cars to free the red car and let it exit through the yellow gate.

**Controls:**
- **Desktop:** Click and drag cars with your mouse
- **Mobile:** Touch and drag cars with your finger

**Rules:**
- Each car can only move along its orientation (horizontal or vertical)
- Cars cannot overlap or move through each other
- Get the red car (main car) to the yellow exit to win the level
- Complete all 5 levels with increasing difficulty

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## ✨ Features

### Gameplay
- 🎯 **5 Progressive Levels** - Increasing challenge with more cars and complex puzzles
- 🚘 **Smooth Car Movement** - Drag-and-drop controls with smooth lerp animations
- 🏁 **Victory System** - Confetti celebration and level progression
- 🔄 **Restart & Navigation** - Easy level restart and home navigation

### Graphics & Visuals
- 🎨 **Modern 3D Graphics** - Built with Three.js WebGL renderer
- 🌅 **Isometric Camera** - Beautiful angled view like Crossy Road
- 💡 **Dynamic Lighting** - Ambient, hemisphere, and directional lights with shadows
- 🎭 **Shadow Mapping** - Realistic soft shadows for depth
- ✨ **Visual Effects** - Hover highlights, exit gate indicators, confetti particles
- 🌈 **Colorful Cars** - Red, blue, orange, yellow, purple, green vehicles

### Technical
- 📱 **Mobile Optimized** - Touch controls with responsive design (portrait 9:16)
- 🎯 **Grid-Based Logic** - Collision detection and movement validation
- 🎵 **Audio Feedback** - Synthesized sound effects for actions
- ⚡ **60 FPS Performance** - Optimized rendering and animations
- 🏗️ **Modular Architecture** - Clean separation of concerns

## 📁 Project Structure

```
parking-jam-3d/
├── src/
│   ├── Game.ts              # Main game orchestrator
│   ├── Grid.ts              # Grid system and spatial logic
│   ├── Car.ts               # Car entity with 3D model
│   ├── CameraController.ts  # Camera management and movement
│   ├── LevelData.ts         # Level configurations (5 levels)
│   ├── UI.ts                # UI management and confetti system
│   ├── AudioManager.ts      # Sound effects synthesis
│   ├── main.ts              # Entry point
│   └── style.css            # Additional styles
├── index.html               # Main HTML with embedded styles
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## 🎨 Game Components

### Grid System (`Grid.ts`)
- 6×6 logical grid mapped to 3D world coordinates
- Cell occupancy tracking for collision detection
- Helper methods for grid-to-world coordinate conversion
- Area validation for car placement

### Car System (`Car.ts`)
- 3D car models with body, roof, windows, and indicators
- Metallic materials with PBR shading
- Length variations (2-3 cells)
- Horizontal/vertical orientation
- Smooth movement with lerp interpolation
- Highlight plane for selection feedback
- Drive-away animations for victory

### Camera (`CameraController.ts`)
- Isometric perspective camera
- Subtle idle sway animation (0.3° oscillation)
- Auto-adjusts for different grid sizes
- Dynamic aspect ratio handling

### Levels (`LevelData.ts`)
- 5 handcrafted levels with increasing difficulty
- JSON-based configuration for easy expansion
- Each level defines:
  - Grid dimensions
  - Car positions, orientations, and colors
  - Exit position
  - Target (main) car

### UI (`UI.ts`)
- Clean, modern interface with rounded buttons
- Level indicator panel
- Victory overlay with confetti particles
- Restart and home navigation
- Responsive design for all screen sizes

### Audio (`AudioManager.ts`)
- Web Audio API synthesis
- Sound effects for:
  - Car selection
  - Car movement
  - Blocked movement
  - Victory jingle (4-note melody)

## 🎯 Game Mechanics

### Movement System
1. User selects a car by clicking/touching
2. Car lifts up slightly (scale 1.05) with highlight plane
3. Drag gesture constrained to car's orientation axis
4. On release, car snaps to nearest valid grid position
5. If blocked, car bounces back to original position
6. Grid occupancy updates in real-time

### Win Condition
- Main car (red) must reach the designated exit cell
- Exit marked with yellow ground plane and directional arrow
- On win:
  1. All cars animate driving away in random directions
  2. Victory sound plays (C5 → E5 → G5 → C6 progression)
  3. Confetti particles spawn and fall
  4. Victory overlay appears with "Next Level" button

### Level Progression
- 5 levels with progressively more cars (4 → 9 cars)
- Each level requires strategic planning
- Level 5 is the most challenging with 9 cars
- After Level 5, "Play Again" button loops back to Level 1

## 🔧 Technical Details

### Rendering
- **Renderer:** WebGL with antialiasing
- **Shadow Map:** PCF Soft shadows (2048×2048)
- **Tone Mapping:** ACES Filmic for realistic colors
- **Pixel Ratio:** Capped at 2 for performance

### Lighting Setup
```typescript
AmbientLight      - 0.6 intensity (base illumination)
HemisphereLight   - 0.5 intensity (sky/ground bounce)
DirectionalLight  - 0.8 intensity (sun, casts shadows)
```

### Materials
- **Cars:** MeshStandardMaterial (metalness: 0.6, roughness: 0.4)
- **Ground:** MeshStandardMaterial (dark gray with slight reflection)
- **Windows:** MeshStandardMaterial (dark with high metalness)
- **Exit Gate:** MeshStandardMaterial with emissive yellow

### Performance Optimizations
- Efficient raycasting for input detection
- Lerp-based animations (no frame-by-frame calculations)
- Minimal draw calls with grouped meshes
- Passive event listeners for touch events
- Capped pixel ratio for high-DPI displays

## 📱 Mobile Support

The game is fully optimized for mobile devices:
- ✅ Touch event handling with passive listeners
- ✅ Portrait orientation (9:16 aspect ratio)
- ✅ Responsive camera and UI scaling
- ✅ Smooth 60 FPS on modern mobile devices
- ✅ No pinch-zoom or text selection interference
- ✅ Large touch targets for buttons

## 🎓 Learning Resources

This project demonstrates:
- **Three.js 3D rendering** - Scene setup, meshes, materials, lighting
- **TypeScript** - Strong typing, interfaces, classes
- **Game architecture** - Modular design, separation of concerns
- **Input handling** - Unified mouse/touch event system
- **Grid-based games** - Spatial logic, collision detection
- **Animation** - Lerp interpolation, easing functions
- **Audio synthesis** - Web Audio API for game sounds

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the mobile game **Parking Jam 3D**
- Built with [Three.js](https://threejs.org/)
- Powered by [Vite](https://vitejs.dev/) for fast development

---

**Enjoy the game! 🎮🚗**
