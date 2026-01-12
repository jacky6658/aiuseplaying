
import React, { useState, useEffect, useRef } from 'react';
import { MediaPipeService } from './services/mediapipeService';
import HUDContainer from './components/HUDContainer';
import OverlayUI from './components/OverlayUI';

const App: React.FC = () => {
  const [fingerPos, setFingerPos] = useState({ x: 0.5, y: 0.5 });
  const [pinchDistance, setPinchDistance] = useState(0.1);
  const [handRotation, setHandRotation] = useState({ x: 0, y: 0, z: 0 }); // 新增旋轉狀態
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaPipeRef = useRef<MediaPipeService | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      mediaPipeRef.current = new MediaPipeService(videoRef.current, (results) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const hand = results.multiHandLandmarks[0];
          
          // 1. 基礎位置 (中心點)
          const thumb = hand[4];
          const index = hand[8];
          const centerX = (thumb.x + index.x) / 2;
          const centerY = (thumb.y + index.y) / 2;
          setFingerPos({ x: 1 - centerX, y: centerY });

          // 2. 縮放距離
          const dx = thumb.x - index.x;
          const dy = thumb.y - index.y;
          setPinchDistance(Math.sqrt(dx * dx + dy * dy));

          // 3. 旋轉計算 (使用向量)
          // 腕部(0) 到 中指根部(9) 決定主要的指向 (Pitch & Yaw)
          const wrist = hand[0];
          const middleBase = hand[9];
          const pitch = Math.atan2(middleBase.z - wrist.z, middleBase.y - wrist.y);
          const yaw = Math.atan2(middleBase.z - wrist.z, middleBase.x - wrist.x);
          
          // 食指根(5) 到 小指根(17) 決定手掌翻轉 (Roll)
          const indexBase = hand[5];
          const pinkyBase = hand[17];
          const roll = Math.atan2(pinkyBase.y - indexBase.y, pinkyBase.x - indexBase.x);

          setHandRotation({
            x: pitch,
            y: -yaw, // 反轉以符合視覺慣性
            z: roll
          });

          setIsHandDetected(true);
        } else {
          setIsHandDetected(false);
        }
      });

      mediaPipeRef.current.start()
        .then(() => setIsCameraReady(true))
        .catch(err => console.error("MediaPipe failed:", err));
    }

    return () => {
      mediaPipeRef.current?.stop();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-40 scale-x-[-1]"
        playsInline
        muted
      />

      <HUDContainer 
        targetPos={fingerPos} 
        pinchDistance={pinchDistance} 
        rotation={handRotation}
        active={isHandDetected} 
      />

      <OverlayUI isHandDetected={isHandDetected} isCameraReady={isCameraReady} />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-scan pointer-events-none" />
      
      <style>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan { animation: scan 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
