import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { 
  X, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Maximize2, 
  Info,
  Play,
  Pause
} from 'lucide-react';

/**
 * Interactive 3D Biological & Molecular Studio for Doctors & Vets
 * Powered by Three.js with full multi-touch rotation, zoom, and biological animation modes.
 */
export default function ThreeDViewer({ product, onClose }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const objectGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [activeMode, setActiveMode] = useState('molecular'); // 'molecular' | 'biological' | 'surface'
  const [isRotating, setIsRotating] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Interaction tracking for touch & mouse
  const isDraggingRef = useRef(false);
  const prevPointerPosRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef(0);

  // Determine model type based on product
  const modelType = useMemo(() => {
    if (!product) return 'catalysis_molecular';
    const id = product.id?.toLowerCase() || '';
    const comp = product.companyId?.toLowerCase() || '';
    if (comp === 'bard' || id.includes('ecosin') || id.includes('dermasin') || id.includes('pythie')) {
      return 'bard_pythium';
    }
    if (id.includes('virulys')) {
      return 'vitasignia_lysine';
    }
    if (comp === 'ringbio' || id.includes('flexy')) {
      return 'ringbio_cassette';
    }
    return 'catalysis_molecular';
  }, [product]);

  // Model metadata & Hotspots for doctors
  const modelMeta = useMemo(() => {
    switch (modelType) {
      case 'bard_pythium':
        return {
          title: 'Pythium oligandrum Mycoparasite 3D Bio-Model',
          subtitle: 'Biological predator of fungal dermatophytes & Malassezia',
          accent: '#0D9488',
          tag: 'Biological Mycoparasite',
          description:
            'A living chromistan microorganism that produces predatory enzymatic hyphae. It penetrates dermatophyte hyphae (Microsporum, Trichophyton) and absorbs their cellular contents.',
          hotspots: [
            { id: 1, title: 'Central Oospore Core', text: 'Resistant resting structure with robust chitinous protective membrane.', pos: [0, 0, 0] },
            { id: 2, title: 'Predatory Hyphae Filaments', text: 'Emits lytic chitinases and glucanases that lyse fungal cell walls directly.', pos: [1.8, 1.2, 0.5] },
            { id: 3, title: 'Enzymatic Penetrators', text: 'Attachment points where Pythium penetrates and feeds on pathogen biomass.', pos: [-1.5, -1.2, 1.0] },
          ]
        };
      case 'vitasignia_lysine':
        return {
          title: 'L-Lysine Viral Inhibition 3D Helix',
          subtitle: 'Competitive antagonism against FHV-1 viral replication',
          accent: '#7C3AED',
          tag: 'Antiviral Posology Matrix',
          description:
            'Molecular representation of L-Lysine competitively displacing L-Arginine. This starves Feline Herpesvirus-1 of essential building blocks, stopping viral shedding.',
          hotspots: [
            { id: 1, title: 'L-Lysine Active Amine Site', text: 'NH3+ cationic charge binding to cellular transport channels.', pos: [0, 1.5, 0] },
            { id: 2, title: 'Arginine Competition Zone', text: 'Competitive receptor blockade preventing viral polyprotein assembly.', pos: [1.2, -1.0, 0.8] },
            { id: 3, title: 'Viral Capsid Inhibition Shield', text: 'Suppresses FHV-1 ocular and respiratory flare-ups.', pos: [-1.2, 0.5, -0.8] },
          ]
        };
      case 'ringbio_cassette':
        return {
          title: '3D Lateral Flow Diagnostic Cassette',
          subtitle: 'Nano-gold conjugated antibody chromatographic flow',
          accent: '#0284C7',
          tag: 'Rapid Immunoassay Immersion',
          description:
            'Precision diagnostic cassette showing capillary flow from sample well across colloidal gold antibodies toward Test (T) and Control (C) lines.',
          hotspots: [
            { id: 1, title: 'Sample Loading Well', text: 'Specimen buffer port calibrated for 3-5 drops of serum, plasma, or swab buffer.', pos: [-2.0, 0, 0.4] },
            { id: 2, title: 'Test Line (T) Capture Zone', text: 'Monoclonal capture antibodies producing sharp chromogenic signal within 10-15 min.', pos: [0.3, 0, 0.4] },
            { id: 3, title: 'Control Line (C) Quality Line', text: 'Internal validation band confirming reagent integrity and lateral flow validity.', pos: [1.3, 0, 0.4] },
          ]
        };
      default:
        return {
          title: `${product?.name || 'Molecular Activation'} 3D Complex`,
          subtitle: 'Energized Molecular Activation Technology (Catalysis SL)',
          accent: '#0B431E',
          tag: 'Molecular Activation Bio-Physics',
          description:
            'Proprietary electromagnetic activation increases molecular dipole moment and antioxidant power up to 40x without altering chemical formula, neutralizing pathogenic free radicals.',
          hotspots: [
            { id: 1, title: 'Activated Dipole Core', text: 'Polarized electronic cloud with amplified electron-donation capacity.', pos: [0, 0, 0] },
            { id: 2, title: 'Antioxidant Radical Trap', text: 'Neutralizes reactive oxygen species (ROS) in inflamed veterinary tissues.', pos: [1.6, 1.1, 0.4] },
            { id: 3, title: 'Target Receptor Ligand', text: 'Enhanced bioavailability allowing rapid intracellular mucosal uptake.', pos: [-1.4, -1.2, 0.6] },
          ]
        };
    }
  }, [modelType, product]);

  // Build 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Medical Studio Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    fillLight.position.set(-6, -4, -4);
    scene.add(fillLight);

    const accentLight = new THREE.PointLight(
      modelType === 'bard_pythium' ? 0x14b8a6 :
      modelType === 'vitasignia_lysine' ? 0x8b5cf6 :
      modelType === 'ringbio_cassette' ? 0x38bdf8 : 0x10b981,
      2,
      12
    );
    accentLight.position.set(0, 2, 4);
    scene.add(accentLight);

    // 3. Object Group
    const rootGroup = new THREE.Group();
    objectGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Construct specific 3D model
    if (modelType === 'bard_pythium') {
      // Biological Spore with Predatory Hyphae
      const coreGeo = new THREE.IcosahedronGeometry(1.2, 3);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0f766e,
        roughness: 0.35,
        metalness: 0.2,
        wireframe: wireframe,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      rootGroup.add(coreMesh);

      // Hyphae filaments branching outward
      const numHyphae = 16;
      for (let i = 0; i < numHyphae; i++) {
        const phi = Math.acos(-1 + (2 * i) / numHyphae);
        const theta = Math.sqrt(numHyphae * Math.PI) * phi;
        const dir = new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi),
          Math.sin(theta) * Math.sin(phi),
          Math.cos(phi)
        ).normalize();

        const length = 1.6 + Math.random() * 0.8;
        const filamentGeo = new THREE.CylinderGeometry(0.04, 0.08, length, 8);
        const filamentMat = new THREE.MeshStandardMaterial({
          color: 0x2dd4bf,
          roughness: 0.25,
          metalness: 0.1,
          wireframe: wireframe,
        });
        const filamentMesh = new THREE.Mesh(filamentGeo, filamentMat);

        filamentMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        filamentMesh.position.copy(dir.clone().multiplyScalar(1.2 + length / 2));
        rootGroup.add(filamentMesh);

        // Terminal enzymatic bulb
        const bulbGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: 0x5eead4,
          emissive: 0x14b8a6,
          emissiveIntensity: 0.6,
        });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.copy(dir.clone().multiplyScalar(1.2 + length));
        rootGroup.add(bulb);
      }
    } else if (modelType === 'vitasignia_lysine') {
      // 3D Double Helix / Peptide backbone
      const helixRadius = 1.0;
      const helixHeight = 3.5;
      const pointsCount = 40;

      for (let i = 0; i < pointsCount; i++) {
        const t = (i / pointsCount) * Math.PI * 4;
        const y = ((i / pointsCount) - 0.5) * helixHeight;
        const x1 = Math.cos(t) * helixRadius;
        const z1 = Math.sin(t) * helixRadius;

        // Backbone sphere
        const ballGeo = new THREE.SphereGeometry(0.14, 16, 16);
        const ballMat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x7c3aed : 0xec4899,
          roughness: 0.2,
          metalness: 0.4,
          wireframe: wireframe,
        });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.set(x1, y, z1);
        rootGroup.add(ball);

        // Strut to opposing strand
        if (i % 3 === 0) {
          const x2 = Math.cos(t + Math.PI) * helixRadius;
          const z2 = Math.sin(t + Math.PI) * helixRadius;

          const p1 = new THREE.Vector3(x1, y, z1);
          const p2 = new THREE.Vector3(x2, y, z2);
          const dist = p1.distanceTo(p2);

          const strutGeo = new THREE.CylinderGeometry(0.04, 0.04, dist, 8);
          const strutMat = new THREE.MeshStandardMaterial({ color: 0xc4b5fd, metalness: 0.5 });
          const strut = new THREE.Mesh(strutGeo, strutMat);

          const mid = p1.clone().add(p2).multiplyScalar(0.5);
          strut.position.copy(mid);
          strut.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            p2.clone().sub(p1).normalize()
          );
          rootGroup.add(strut);
        }
      }
    } else if (modelType === 'ringbio_cassette') {
      // 3D Diagnostic Test Cassette
      const bodyGeo = new THREE.BoxGeometry(4.8, 1.4, 0.45);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.2,
        metalness: 0.1,
        wireframe: wireframe,
      });
      const cassette = new THREE.Mesh(bodyGeo, bodyMat);
      rootGroup.add(cassette);

      // Sample well
      const wellGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 24);
      const wellMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
      const well = new THREE.Mesh(wellGeo, wellMat);
      well.rotation.x = Math.PI / 2;
      well.position.set(-1.6, 0, 0.23);
      rootGroup.add(well);

      // Membrane Window
      const winGeo = new THREE.BoxGeometry(1.8, 0.6, 0.05);
      const winMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const windowMesh = new THREE.Mesh(winGeo, winMat);
      windowMesh.position.set(0.6, 0, 0.23);
      rootGroup.add(windowMesh);

      // Test Line (T)
      const tLineGeo = new THREE.BoxGeometry(0.08, 0.45, 0.08);
      const tLineMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.5,
      });
      const tLine = new THREE.Mesh(tLineGeo, tLineMat);
      tLine.position.set(0.3, 0, 0.25);
      rootGroup.add(tLine);

      // Control Line (C)
      const cLineGeo = new THREE.BoxGeometry(0.08, 0.45, 0.08);
      const cLineMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x2563eb,
        emissiveIntensity: 0.5,
      });
      const cLine = new THREE.Mesh(cLineGeo, cLineMat);
      cLine.position.set(0.9, 0, 0.25);
      rootGroup.add(cLine);
    } else {
      // Catalysis Activated Molecular Ball & Stick Model
      const atoms = [
        { elem: 'C', pos: [0, 0, 0], color: 0x334155, r: 0.45 },
        { elem: 'O', pos: [1.1, 0.7, 0.2], color: 0xef4444, r: 0.38 },
        { elem: 'N', pos: [-1.1, 0.6, -0.3], color: 0x3b82f6, r: 0.4 },
        { elem: 'C', pos: [0.3, -1.2, 0.4], color: 0x334155, r: 0.42 },
        { elem: 'O', pos: [1.4, -1.1, -0.2], color: 0xef4444, r: 0.38 },
        { elem: 'H', pos: [-0.6, -1.8, 0.8], color: 0xf1f5f9, r: 0.28 },
        { elem: 'H', pos: [-1.7, 0.9, 0.4], color: 0xf1f5f9, r: 0.28 },
        { elem: 'Zn', pos: [0.1, 1.4, -0.5], color: 0x10b981, r: 0.5 }, // Activated Mineral Co-Factor
      ];

      const bonds = [
        [0, 1], [0, 2], [0, 3], [3, 4], [3, 5], [2, 6], [0, 7]
      ];

      // Render Atoms
      atoms.forEach((a) => {
        const atomGeo = new THREE.SphereGeometry(a.r, 24, 24);
        const atomMat = new THREE.MeshStandardMaterial({
          color: a.color,
          roughness: 0.25,
          metalness: 0.3,
          wireframe: wireframe,
        });
        const atomMesh = new THREE.Mesh(atomGeo, atomMat);
        atomMesh.position.set(...a.pos);
        rootGroup.add(atomMesh);
      });

      // Render Chemical Bonds
      bonds.forEach(([i1, i2]) => {
        const p1 = new THREE.Vector3(...atoms[i1].pos);
        const p2 = new THREE.Vector3(...atoms[i2].pos);
        const dist = p1.distanceTo(p2);

        const bondGeo = new THREE.CylinderGeometry(0.08, 0.08, dist, 12);
        const bondMat = new THREE.MeshStandardMaterial({
          color: 0xcbd5e1,
          roughness: 0.4,
          metalness: 0.2,
        });
        const bondMesh = new THREE.Mesh(bondGeo, bondMat);

        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        bondMesh.position.copy(mid);
        bondMesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          p2.clone().sub(p1).normalize()
        );
        rootGroup.add(bondMesh);
      });
    }

    // 4. Energetic Particle Cloud (Molecular Activation Aura)
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: modelType === 'bard_pythium' ? 0x2dd4bf : 0x10b981,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    rootGroup.add(particles);

    // 5. Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (isRotating && rootGroup) {
        rootGroup.rotation.y += 0.007;
        rootGroup.rotation.x += 0.003;
      }

      if (particles) {
        particles.rotation.y -= 0.004;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelType, wireframe, isRotating]);

  // Touch and Mouse interaction handlers for 360° rotation & zoom
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevPointerPosRef.current = { x: e.clientX || e.touches?.[0]?.clientX, y: e.clientY || e.touches?.[0]?.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !objectGroupRef.current) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    const deltaX = clientX - prevPointerPosRef.current.x;
    const deltaY = clientY - prevPointerPosRef.current.y;

    objectGroupRef.current.rotation.y += deltaX * 0.01;
    objectGroupRef.current.rotation.x += deltaY * 0.01;

    prevPointerPosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Pinch to Zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1) {
      handlePointerDown(e);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && cameraRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / (touchStartDistRef.current || dist);

      if (factor > 1.02 && cameraRef.current.position.z > 4) {
        cameraRef.current.position.z -= 0.15;
      } else if (factor < 0.98 && cameraRef.current.position.z < 14) {
        cameraRef.current.position.z += 0.15;
      }
      touchStartDistRef.current = dist;
    } else if (e.touches.length === 1) {
      handlePointerMove(e);
    }
  };

  const handleZoom = (direction) => {
    if (!cameraRef.current) return;
    if (direction === 'in' && cameraRef.current.position.z > 3.5) {
      cameraRef.current.position.z -= 1.0;
    } else if (direction === 'out' && cameraRef.current.position.z < 15) {
      cameraRef.current.position.z += 1.0;
    }
  };

  const resetRotation = () => {
    if (objectGroupRef.current) {
      objectGroupRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 8);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl h-[92dvh] rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0A101D] border border-white/15 shadow-2xl flex flex-col overflow-hidden text-white select-none">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: modelMeta.accent }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/10">
                  {modelMeta.tag}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold hidden sm:inline">
                  360° Real-Time WebGL
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {modelMeta.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Rotation Play/Pause */}
            <button
              onClick={() => setIsRotating((prev) => !prev)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-all active:scale-95"
              title={isRotating ? 'Pause 3D Auto-Rotation' : 'Resume 3D Auto-Rotation'}
            >
              {isRotating ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Wireframe Toggle */}
            <button
              onClick={() => setWireframe((prev) => !prev)}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                wireframe ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-300'
              }`}
              title="Toggle 3D Molecular Wireframe"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Reset View */}
            <button
              onClick={resetRotation}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 transition-all active:scale-95"
              title="Reset 3D Orientation"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Close Studio */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-all active:scale-95 ml-2"
              title="Close 3D Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central 3D Canvas Stage */}
        <div 
          ref={mountRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handlePointerUp}
          className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden touch-none"
        >
          {/* Subtle 3D Stage Light Pedestal Ring */}
          <div className="absolute inset-x-0 bottom-10 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-72 h-16 rounded-[100%] border border-emerald-400/40 bg-emerald-500/10 blur-[2px]" />
          </div>

          {/* Quick Doctor Touch Guidance Overlay */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 font-bold flex items-center gap-2">
            <span>👆 Drag to rotate 360°</span>
            <span className="opacity-40">•</span>
            <span>👌 Pinch to zoom</span>
          </div>

          {/* On-Canvas Zoom Paddles for Tablets */}
          <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
            <button
              onClick={() => handleZoom('in')}
              className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 flex items-center justify-center active:scale-95 shadow-lg backdrop-blur-md"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-white/20 flex items-center justify-center active:scale-95 shadow-lg backdrop-blur-md"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Clinical Explanations & Biological Hotspots */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-950/90 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Veterinary Clinical Mechanism</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {selectedHotspot ? selectedHotspot.text : modelMeta.description}
            </p>
          </div>

          {/* Hotspot Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {modelMeta.hotspots.map((h) => {
              const isSelected = selectedHotspot?.id === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotspot(isSelected ? null : h)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-300/40'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/15'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{h.title}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
