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

### Complete Game Experience
- 🏠 **Main Menu** - Professional animated menu with logo and navigation
- ⚙️ **Settings Screen** - Customize audio, shadows, and haptic feedback
- 🛒 **Shop** - Choose from 6 colors for your main car
- 💾 **Save System** - Settings persist across sessions with localStorage
- 🎮 **Full Game Flow** - Professional navigation between all screens

### Gameplay
- 🎯 **5 Progressive Levels** - Increasing challenge with more cars and complex puzzles
- 🚘 **Smooth Car Movement** - Drag-and-drop controls with smooth lerp animations
- 🏁 **Victory System** - Confetti celebration and level progression
- 🔄 **Restart & Navigation** - Easy level restart and return to main menu
- 📱 **Haptic Feedback** - Vibration feedback for mobile devices (optional)

### Graphics & Visuals
- 🎨 **Modern 3D Graphics** - Built with Three.js WebGL renderer
- 📐 **Optimized Isometric Camera** - Perfect top-down view of the entire parking lot
- 💡 **Dynamic Lighting** - Ambient, hemisphere, and directional lights with shadows
- 🎭 **Shadow Mapping** - Realistic soft shadows for depth (can be toggled)
- ✨ **Visual Effects** - Hover highlights, exit gate indicators, confetti particles
- 🌈 **Customizable Cars** - Choose from 6 vibrant colors for your main car
- 🎪 **Smooth Animations** - Bouncing logo, screen transitions, victory effects

### Settings & Customization
- 🔊 **Audio Controls** - Toggle sound effects on/off
- 🎚️ **Volume Slider** - Adjust sound volume (0-100%)
- 💡 **Graphics Options** - Enable/disable shadows for performance
- 📳 **Haptic Feedback** - Optional vibration on mobile devices
- 🎨 **Car Colors** - Red, orange, pink, purple, blue, green options

### Technical
- 📱 **Mobile Optimized** - Touch controls with responsive design (portrait 9:16)
- 🎯 **Grid-Based Logic** - Collision detection and movement validation
- 🎵 **Audio Feedback** - Synthesized sound effects with volume control
- ⚡ **60 FPS Performance** - Optimized rendering and animations
- 🏗️ **Modular Architecture** - Clean separation of concerns
- 🔄 **State Management** - Robust game state system with persistence

## 📁 Project Structure

```
parking-jam-3d/
├── src/
│   ├── Game.ts              # Main game orchestrator with state integration
│   ├── GameStateManager.ts  # State management and settings persistence
│   ├── Grid.ts              # Grid system and spatial logic
│   ├── Car.ts               # Car entity with 3D model
│   ├── CameraController.ts  # Optimized camera with isometric view
│   ├── LevelData.ts         # Level configurations (5 levels)
│   ├── UI.ts                # UI management for all screens
│   ├── AudioManager.ts      # Sound effects synthesis
│   ├── main.ts              # Entry point
│   └── style.css            # Additional styles
├── index.html               # Main HTML with menu, settings, shop, game UI
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

### State Management (`GameStateManager.ts`)
- Centralized game state control (Menu, Playing, Settings, Shop)
- Settings persistence with localStorage
- Audio, graphics, and haptic settings management
- Main car color customization storage
- State change notifications for UI updates

### Camera (`CameraController.ts`)
- Optimized isometric perspective (45° FOV)
- Perfect top-down view with clear sight of all cars
- Improved positioning (higher elevation, better angle)
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
- **Main Menu** - Animated logo with gradient background
- **Settings Screen** - Toggle switches and sliders for preferences
- **Shop Screen** - Color picker grid for car customization
- **Game UI** - Level indicator, restart/home buttons
- **Victory Overlay** - Confetti particles and next level button
- Screen transition management
- Real-time settings application
- Responsive design for all screen sizes

### Audio (`AudioManager.ts`)
- Web Audio API synthesis
- Sound effects for:
  - Car selection
  - Car movement
  - Blocked movement
  - Victory jingle (4-note melody)

## 🎮 Complete Game Flow

### Main Menu
1. **Launch Game** - See animated main menu with bouncing logo
2. **Three Options:**
   - **▶️ PLAY** - Start/resume gameplay
   - **🛒 SHOP** - Customize your main car color
   - **⚙️ SETTINGS** - Adjust audio, graphics, and haptic options

### Settings
- Toggle sound effects on/off
- Adjust volume with slider (0-100%)
- Enable/disable realistic shadows
- Toggle haptic feedback for mobile
- Settings save automatically in localStorage

### Shop
- Choose from 6 vibrant colors for your main car
- Color applies immediately in gameplay
- Selection persists across sessions
- Colors: Red (default), Orange, Pink, Purple, Blue, Green

### Gameplay
- Clean game UI with level indicator at top
- Home button (🏠) returns to main menu
- Restart button (🔄) resets current level
- Drag cars to solve parking puzzles
- Complete all 5 levels with increasing difficulty

### Victory Flow
- Cars drive away animation
- Confetti celebration
- "Next Level" button to continue
- After Level 5: "Play Again" to restart from Level 1

## 🎯 Game Mechanics

### Movement System
1. User selects a car by clicking/touching
2. Car lifts up slightly (scale 1.05) with highlight plane
3. Drag gesture constrained to car's orientation axis
4. On release, car snaps to nearest valid grid position
5. If blocked, car bounces back to original position
6. Grid occupancy updates in real-time

### Win Condition
- Main car (customizable color) must reach the designated exit cell
- Exit marked with yellow ground plane and directional arrow
- On win:
  1. All cars animate driving away in random directions
  2. Victory sound plays (C5 → E5 → G5 → C6 progression)
  3. Haptic feedback vibrates (if enabled)
  4. Confetti particles spawn and fall
  5. Victory overlay appears with "Next Level" button

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
