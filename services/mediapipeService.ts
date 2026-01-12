
// We use scripts from CDN for MediaPipe to avoid heavy bundling issues in this environment
declare const Hands: any;
declare const Camera: any;

export class MediaPipeService {
  private videoElement: HTMLVideoElement;
  private hands: any;
  private camera: any;
  private onResults: (results: any) => void;

  constructor(videoElement: HTMLVideoElement, onResults: (results: any) => void) {
    this.videoElement = videoElement;
    this.onResults = onResults;
    this.init();
  }

  private async loadScript(src: string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private async init() {
    // Load MediaPipe scripts dynamically
    await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
    await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');

    this.hands = new Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults(this.onResults);

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await this.hands.send({ image: this.videoElement });
      },
      width: 1280,
      height: 720
    });
  }

  public async start() {
    if (this.camera) {
      return this.camera.start();
    }
    // If init isn't done, wait a bit
    await new Promise(r => setTimeout(r, 1000));
    return this.camera?.start();
  }

  public stop() {
    this.camera?.stop();
    this.hands?.close();
  }
}
