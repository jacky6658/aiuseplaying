
# Iron Man HUD Demo

This is a minimum viable demo of a high-tech "Iron Man" style HUD using **MediaPipe** for hand tracking and **Three.js** for the holographic particle effects.

## Features
- ✅ **Webcam Background**: Live video stream integrated as the base layer.
- ✅ **MediaPipe Hand Tracking**: Real-time detection of index finger coordinates.
- ✅ **Three.js HUD**: A wall of 5,000 particles and circular rings that move and tilt based on your finger's position.
- ✅ **High-Tech Aesthetic**: Cyber blue/cyan color palette with additive blending and scanning effects.

## How to Run
1. Ensure you are in a web environment (not just opening the file directly from the filesystem, as MediaPipe requires a secure or local server context).
2. Use a local development server:
   - `npx serve .`
   - or `python -m http.server`
   - or any VS Code "Live Server" extension.
3. Grant camera permissions when prompted.
4. Show your hand to the camera. The HUD will lock onto your index finger.

## Coordinate Mapping
The MediaPipe normalized coordinates (0 to 1) are transformed into Three.js world space using:
- `x: (x - 0.5) * 10`
- `y: -(y - 0.5) * 6`

## Technical Stack
- **React 18**: Application structure.
- **Three.js**: 3D Rendering.
- **MediaPipe Hands**: Computer Vision.
- **Tailwind CSS**: UI Overlay styling.
- **TypeScript**: Type safety.

## Next Steps
- **Gesture Recognition**: Trigger events (like clicking buttons) when performing a "pinch" or "fist".
- **Dynamic Particles**: Make particles explode or swarm when the hand moves fast.
- **Gemini Integration**: Add a voice-enabled AI assistant that responds to gestures.
