
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface HUDContainerProps {
  targetPos: { x: number; y: number };
  pinchDistance: number;
  rotation: { x: number; y: number; z: number };
  active: boolean;
}

const HUDContainer: React.FC<HUDContainerProps> = ({ targetPos, pinchDistance, rotation, active }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const ringRef = useRef<THREE.Group | null>(null);
  
  // Smoothing values for "mechanical" feel
  const smoothedPos = useRef({ x: 0.5, y: 0.5 });
  const smoothedScale = useRef(1.0);
  const smoothedRot = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 3D Geometric Core (Reverted to High-Tech Style) ---
    const coreGroup = new THREE.Group();
    
    // 1. Outer Wireframe Box
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const edges = new THREE.EdgesGeometry(boxGeo);
    const lineMat = new THREE.LineBasicMaterial({ 
        color: 0x00faff, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const wireframeBox = new THREE.LineSegments(edges, lineMat);
    coreGroup.add(wireframeBox);

    // 2. Inner "Crystal" Core
    const innerGeo = new THREE.IcosahedronGeometry(0.5, 0);
    const innerMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        transparent: true, 
        opacity: 0.3, 
        wireframe: true,
        blending: THREE.AdditiveBlending 
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3. Central Glow Point
    const pointGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pointMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    coreGroup.add(new THREE.Mesh(pointGeo, pointMat));

    scene.add(coreGroup);
    coreGroupRef.current = coreGroup;

    // --- HUD Outer Rings ---
    const ringGroup = new THREE.Group();
    const ringGeo = new THREE.RingGeometry(1.4, 1.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, 
        transparent: true, 
        opacity: 0.2, 
        side: THREE.DoubleSide 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ringGroup.add(ring);
    
    // Additional decorative ring
    const ringGeo2 = new THREE.RingGeometry(1.5, 1.52, 4, 1);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat.clone());
    ring2.material.opacity = 0.4;
    ringGroup.add(ring2);

    scene.add(ringGroup);
    ringRef.current = ringGroup;

    // --- Ambient Particles ---
    const pCount = 1500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount; i++) {
        pPos[i*3] = (Math.random() - 0.5) * 15;
        pPos[i*3+1] = (Math.random() - 0.5) * 10;
        pPos[i*3+2] = (Math.random() - 0.5) * 5;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.03, color: 0x00ffff, transparent: true, opacity: 0.3 });
    scene.add(new THREE.Points(pGeo, pMat));

    let frameId: number;
    const colorObj = new THREE.Color();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Lerp for smooth movements
      smoothedPos.current.x += (targetPos.x - smoothedPos.current.x) * 0.1;
      smoothedPos.current.y += (targetPos.y - smoothedPos.current.y) * 0.1;
      smoothedScale.current += (Math.max(0.2, pinchDistance * 8) - smoothedScale.current) * 0.1;
      
      smoothedRot.current.x += (rotation.x - smoothedRot.current.x) * 0.1;
      smoothedRot.current.y += (rotation.y - smoothedRot.current.y) * 0.1;
      smoothedRot.current.z += (rotation.z - smoothedRot.current.z) * 0.1;

      const tx = (smoothedPos.current.x - 0.5) * 10;
      const ty = -(smoothedPos.current.y - 0.5) * 6;

      if (coreGroupRef.current) {
        coreGroupRef.current.position.set(tx, ty, 0);
        coreGroupRef.current.scale.setScalar(smoothedScale.current);
        
        // Combine hand rotation with subtle auto-rotation
        coreGroupRef.current.rotation.set(
            smoothedRot.current.x,
            smoothedRot.current.y + Date.now() * 0.0005,
            smoothedRot.current.z
        );

        // --- Dynamic Color Logic ---
        // Mapping rotation to HSL Color
        const hue = (Math.abs(smoothedRot.current.y + smoothedRot.current.x) % (Math.PI * 2)) / (Math.PI * 2);
        colorObj.setHSL(hue, 0.8, 0.5);

        coreGroupRef.current.children.forEach((child: any) => {
            if (child.material) {
                child.material.color.lerp(colorObj, 0.05);
                child.material.opacity = active ? (child.material.opacity > 0.5 ? 0.8 : 0.4) : 0.1;
            }
        });
      }

      if (ringRef.current) {
        ringRef.current.position.set(tx, ty, 0);
        ringRef.current.scale.setScalar(smoothedScale.current * 1.2);
        ringRef.current.rotation.z -= 0.01;
        
        (ringRef.current.children[0] as any).material.color.lerp(colorObj, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, [targetPos, pinchDistance, rotation, active]);

  return <div ref={containerRef} className="absolute inset-0 z-10 pointer-events-none" />;
};

export default HUDContainer;
