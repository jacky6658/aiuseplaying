
import React from 'react';

interface OverlayUIProps {
  isHandDetected: boolean;
  isCameraReady: boolean;
}

const OverlayUI: React.FC<OverlayUIProps> = ({ isHandDetected, isCameraReady }) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-20">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="border-l-2 border-t-2 border-cyan-500 p-4 bg-cyan-900/20 backdrop-blur-sm">
          <h1 className="text-cyan-400 text-xl font-bold tracking-widest">STARK INDUSTRIES</h1>
          <p className="text-cyan-600 text-xs">J.A.R.V.I.S. INTERFACE V4.2</p>
        </div>
        <div className="text-right">
          <div className="text-cyan-400 text-xs mb-1">SYSTEM STATUS</div>
          <div className="flex items-center justify-end gap-2">
            <span className={`w-2 h-2 rounded-full ${isCameraReady ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-cyan-500 text-[10px] uppercase">{isCameraReady ? 'CAM ONLINE' : 'INITIALIZING'}</span>
          </div>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isHandDetected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-cyan-500 text-[10px] uppercase">{isHandDetected ? 'HAND DETECTED' : 'SCANNING HANDS'}</span>
          </div>
        </div>
      </div>

      {/* Center Target Indicator (if hand not detected) */}
      {!isHandDetected && (
        <div className="self-center flex flex-col items-center">
            <div className="w-24 h-24 border-2 border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-1 h-1 bg-cyan-500" />
            </div>
            <p className="mt-4 text-cyan-500 text-[10px] tracking-[0.2em] uppercase">Show your hand to initialize</p>
        </div>
      )}

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        <div className="w-48 h-12 border-b-2 border-l-2 border-cyan-500/50 flex items-center px-4">
             <div className="flex gap-1">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className={`w-1 h-4 bg-cyan-500 ${isHandDetected ? 'animate-bounce' : 'opacity-20'}`} style={{animationDelay: `${i*0.1}s`}} />
                ))}
             </div>
             <span className="ml-4 text-cyan-500 text-[10px]">ANALYZING KINETICS</span>
        </div>
        <div className="text-cyan-500/60 text-[8px] max-w-[200px] text-right">
            SECURE PROTOCOL ENABLED // COORDINATE MAPPING ACTIVE // HOLOGRAPHIC PROJECTION SYNCHRONIZED
        </div>
      </div>
    </div>
  );
};

export default OverlayUI;
