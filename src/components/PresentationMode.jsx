import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  SunMedium, 
  Share2, 
  Sparkles, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  Info, 
  Pill, 
  Star, 
  Zap, 
  Stethoscope, 
  Sun, 
  Moon,
  Calculator,
  BookOpen,
  GitCompare,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import ConceptorsLogo from './ConceptorsLogo.jsx';
import { clinicalDatabase, therapeuticCategories } from '../data/clinicalData.js';

export default function PresentationMode({
  product,
  allProductsMap = {},
  onClose,
  onSwitchProduct,
  onOpenQuickJump,
  onRecordSlideView,
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showToolbars, setShowToolbars] = useState(true);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [pointerPos, setPointerPos] = useState({ x: -100, y: -100 });
  const [slideStartTime, setSlideStartTime] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Default to Clinic Bright Mode (High Visibility for Vets)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Active Slide-Over Drawer: null | 'calculator' | 'references' | 'compare' | 'protocols' | 'summary'
  const [activeDrawer, setActiveDrawer] = useState(null);

  // Dosing Calculator State
  const [patientWeightKg, setPatientWeightKg] = useState(10);
  const [patientSpecies, setPatientSpecies] = useState('canine'); // 'canine' | 'feline'
  const [catAgeGroup, setCatAgeGroup] = useState('adult'); // 'kitten' | 'adult' for Virulys
  const [isCopiedDose, setIsCopiedDose] = useState(false);

  // Rapid Test Timer (for Flexy diagnostic slides)
  const [testTimerSeconds, setTestTimerSeconds] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Quick Switcher Category Filter Tab inside HUD
  const [hudCategoryFilter, setHudCategoryFilter] = useState('ALL');

  const containerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const slides = product?.slides || [];
  const currentSlideUrl = slides[currentSlideIndex] || '';

  const clinicalData = product?.id ? clinicalDatabase[product.id] : null;
  const brandAccent = product?.brandAccent || '#0B431E';
  const categoryColor = clinicalData?.categoryColor || brandAccent;

  // Viewport Lock (zero-scroll enforcement on body)
  useEffect(() => {
    document.body.classList.add('presentation-lock');
    return () => {
      document.body.classList.remove('presentation-lock');
    };
  }, []);

  // Auto-request full screen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.log('Fullscreen note:', err?.message || err);
      }
    };
    enterFullscreen();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset slide index and timers on product switch
  useEffect(() => {
    setCurrentSlideIndex(0);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setSlideStartTime(Date.now());
    // Auto set default species for Virulys
    if (product?.id === 'virulys' || product?.companyId === 'vitasignia') {
      setPatientSpecies('feline');
    }
  }, [product?.id]);

  // Log time spent on slide
  const recordCurrentSlideDuration = useCallback(() => {
    const durationSec = Math.round((Date.now() - slideStartTime) / 1000);
    if (durationSec > 0 && onRecordSlideView) {
      onRecordSlideView({
        productId: product?.id,
        productName: product?.name,
        company: product?.company,
        slideNumber: currentSlideIndex + 1,
        slideUrl: currentSlideUrl,
        durationSeconds: durationSec,
      });
    }
  }, [slideStartTime, product, currentSlideIndex, currentSlideUrl, onRecordSlideView]);

  // Slide navigation
  const goToSlide = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= slides.length) return;
    recordCurrentSlideDuration();
    setSlideStartTime(Date.now());
    setCurrentSlideIndex(newIndex);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [slides.length, recordCurrentSlideDuration]);

  // Auto-hide toolbar logic (5 seconds inactivity unless a drawer is active)
  const resetInactivityTimer = useCallback(() => {
    setShowToolbars(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (!activeDrawer && !isSpotlightActive && !isLaserActive) {
        setShowToolbars(false);
      }
    }, 5000);
  }, [activeDrawer, isSpotlightActive, isLaserActive]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      recordCurrentSlideDuration();
    };
  }, [resetInactivityTimer, recordCurrentSlideDuration]);

  // Rapid Test Timer Interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && testTimerSeconds > 0) {
      interval = setInterval(() => {
        setTestTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (testTimerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, testTimerSeconds]);

  const startTestTimer = (minutes) => {
    setTestTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const stopTestTimer = () => {
    setIsTimerRunning(false);
    setTestTimerSeconds(null);
  };

  // Pointer movement tracking
  const handlePointerMove = (e) => {
    resetInactivityTimer();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointerPos({ x, y });

    if (zoomLevel > 1 && isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPanPosition((prev) => ({
        x: prev.x + dx * 0.8,
        y: prev.y + dy * 0.8,
      }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerDown = (e) => {
    if (zoomLevel > 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Touch Swipe Handlers for iPad & Tablet gesture navigation
  const handleTouchStart = (e) => {
    resetInactivityTimer();
    if (e.touches && e.touches[0]) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      if (zoomLevel > 1) {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  const handleTouchMove = (e) => {
    resetInactivityTimer();
    if (e.touches && e.touches[0]) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setPointerPos({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
      }
      if (zoomLevel > 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - dragStartRef.current.x;
        const dy = e.touches[0].clientY - dragStartRef.current.y;
        setPanPosition((prev) => ({
          x: prev.x + dx * 0.8,
          y: prev.y + dy * 0.8,
        }));
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (zoomLevel > 1) {
      isDraggingRef.current = false;
      return;
    }
    if (!e.changedTouches || !e.changedTouches[0]) return;

    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const elapsedTime = Date.now() - touchStartRef.current.time;

    // Detect horizontal swipe on tablet: diffX > 40px
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.3 && elapsedTime < 650) {
      if (diffX < 0) {
        goToSlide(currentSlideIndex + 1);
      } else {
        goToSlide(currentSlideIndex - 1);
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      resetInactivityTimer();
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        goToSlide(currentSlideIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToSlide(currentSlideIndex - 1);
      } else if (e.key === 'Escape') {
        if (activeDrawer) {
          setActiveDrawer(null);
        } else {
          onClose();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        setIsLaserActive((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        setIsSpotlightActive((prev) => !prev);
      } else if (e.key === 'z' || e.key === 'Z') {
        setZoomLevel((prev) => (prev === 1 ? 2 : 1));
        setPanPosition({ x: 0, y: 0 });
      } else if (e.key === 'h' || e.key === 'H') {
        setShowToolbars((prev) => !prev);
      } else if (e.key === 'c' || e.key === 'C') {
        setActiveDrawer((prev) => prev === 'calculator' ? null : 'calculator');
      } else if (e.key === 'r' || e.key === 'R') {
        setActiveDrawer((prev) => prev === 'references' ? null : 'references');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, resetInactivityTimer, onClose, goToSlide, activeDrawer]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const relatedProducts = (product?.relatedProductIds || [])
    .map((id) => allProductsMap[id])
    .filter(Boolean);

  // All 16 products list for Quick Switcher Dock
  const allProductsList = useMemo(() => Object.values(allProductsMap), [allProductsMap]);

  // Filtered Products for Quick Switcher Dock
  const hudProducts = useMemo(() => {
    if (hudCategoryFilter === 'ALL') {
      return allProductsList;
    }
    return allProductsList.filter((p) => {
      const pClinical = clinicalDatabase[p.id];
      if (pClinical && pClinical.categoryKey === hudCategoryFilter) return true;
      if (hudCategoryFilter === 'DERMATOLOGY' && p.companyId === 'bard') return true;
      if (hudCategoryFilter === 'IMMUNOLOGY' && (p.id === 'viusid' || p.id === 'virulys')) return true;
      if (hudCategoryFilter === 'HEPATIC' && (p.id === 'carminal' || p.id === 'viusid-detox')) return true;
      if (hudCategoryFilter === 'RENAL' && p.id === 'renalof') return true;
      if (hudCategoryFilter === 'RESPIRATORY' && (p.id === 'asprib' || p.id === 'virulys')) return true;
      if (hudCategoryFilter === 'DIAGNOSTICS' && p.companyId === 'ringbio') return true;
      return false;
    });
  }, [allProductsList, hudCategoryFilter]);

  // Story step labels for progress dots
  const getSlideStepLabel = (index, total) => {
    if (index === 0) return 'Overview & Positioning';
    if (index === 1) return 'Mechanism of Action (MOA)';
    if (index === 2) return 'Clinical Evidence & Trials';
    if (index === 3) return 'Posology & Weight Protocol';
    if (index === total - 1) return 'Summary & Formulations';
    return `Clinical Point ${index + 1}`;
  };

  // Dosing Calculation outputs
  const calculatedDosing = useMemo(() => {
    if (!clinicalData?.dosingConfig) {
      return {
        doseText: product?.dosingProtocol || 'Consult veterinary posology guidelines.',
        frequency: 'As indicated',
        bottleDurationText: 'N/A',
      };
    }

    const cfg = clinicalData.dosingConfig;

    if (cfg.type === 'weight_based') {
      const singleDoseMl = Math.max(cfg.minDose || 0.5, patientWeightKg * cfg.dosePerKg);
      const formattedSingle = singleDoseMl % 1 === 0 ? singleDoseMl.toFixed(0) : singleDoseMl.toFixed(1);
      const dailyMl = singleDoseMl * 2;
      const formattedDaily = dailyMl % 1 === 0 ? dailyMl.toFixed(0) : dailyMl.toFixed(1);
      const durationDays = Math.floor(150 / dailyMl);

      return {
        singleDose: `${formattedSingle} ml`,
        dailyTotal: `${formattedDaily} ml/day`,
        frequency: cfg.frequency,
        formula: cfg.formulaText,
        durationDays: `${durationDays} days supply (150 ml bottle)`,
        instructions: cfg.instructions,
        fullPrescription: `${product.name}: Administer ${formattedSingle} ml Twice Daily (BID) orally for ${patientSpecies === 'canine' ? 'Dog' : 'Cat'} (${patientWeightKg} kg). Total daily volume: ${formattedDaily} ml. A 150ml bottle will supply this patient for ${durationDays} days.`,
      };
    }

    if (product.id === 'virulys') {
      const isKitten = catAgeGroup === 'kitten';
      const dose = isKitten ? '1/2 scoop / 0.5 ml (250 mg L-Lysine)' : '1 scoop / 1.0 ml (500 mg L-Lysine)';
      const totalDaily = isKitten ? '500 mg/day L-Lysine' : '1,000 mg/day L-Lysine';
      const supplyDays = isKitten ? '100 days supply (100g container)' : '50 days supply (100g container)';
      return {
        singleDose: dose,
        dailyTotal: totalDaily,
        frequency: 'Twice Daily (BID) Strict Protocol',
        formula: cfg.formulaText,
        durationDays: supplyDays,
        instructions: cfg.instructions,
        fullPrescription: `Virulys: Administer ${dose} Twice Daily (BID) mixed in food for ${isKitten ? 'Kitten (< 6 mo)' : 'Adult Cat (> 6 mo)'}. Continuous 24h plasma lysine saturation inhibits FHV-1 viral replication.`,
      };
    }

    return {
      singleDose: cfg.unit || 'Standard Unit',
      frequency: cfg.frequency || 'Per Protocol',
      formula: cfg.formulaText || product.dosingProtocol,
      instructions: cfg.instructions || product.dosingProtocol,
      fullPrescription: `${product.name} Clinical Protocol: ${cfg.formulaText}. ${cfg.instructions || ''}`,
    };
  }, [clinicalData, patientWeightKg, patientSpecies, catAgeGroup, product]);

  const handleCopyPrescription = () => {
    if (calculatedDosing?.fullPrescription) {
      navigator.clipboard.writeText(calculatedDosing.fullPrescription);
      setIsCopiedDose(true);
      setTimeout(() => setIsCopiedDose(false), 2000);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`fixed inset-0 z-50 select-none overflow-hidden flex flex-col justify-between transition-colors duration-300 h-[100dvh] max-h-[100dvh] w-screen ${
        isDarkMode ? 'bg-[#0A0F1D] text-white' : 'bg-[#F8FAFC] text-slate-900'
      }`}
      style={{ touchAction: zoomLevel > 1 ? 'none' : 'auto' }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER TOOLBAR (Deep Clinical Navy & Medical Highlights)           */}
      {/* ========================================================================= */}
      <div
        className={`absolute top-0 inset-x-0 z-40 p-3 sm:p-4 transition-all duration-300 pointer-events-auto flex items-center justify-between ${
          showToolbars
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Left: Exit & Product Details */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className={`min-h-[44px] px-3.5 py-2.5 rounded-2xl border backdrop-blur-md transition-all flex items-center gap-2 text-xs font-black active:scale-95 shadow-sm ${
              isDarkMode 
                ? 'bg-slate-900/90 hover:bg-slate-800 border-white/15 text-white' 
                : 'bg-white/95 hover:bg-white border-slate-200/80 text-slate-800'
            }`}
            title="Exit Presentation Mode (Esc)"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <ConceptorsLogo className="h-8 hidden lg:block" light={isDarkMode} />

          {/* Product Pill */}
          <div className={`min-h-[44px] px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-3 shadow-sm ${
            isDarkMode 
              ? 'bg-slate-900/90 border-white/15 text-white' 
              : 'bg-white/95 border-slate-200/80 text-slate-900'
          }`}>
            <span
              className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white/50"
              style={{ backgroundColor: brandAccent }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold truncate max-w-[160px] sm:max-w-none text-[#0B431E]">
                  {product?.name}
                </span>
                {product?.isTopTier && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="hidden md:inline">Core Focus</span>
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold line-clamp-1 flex items-center gap-1.5">
                <span style={{ color: categoryColor }}>{clinicalData?.categoryName || product?.specialty}</span>
                <span>•</span>
                <span>{product?.company}</span>
              </div>
            </div>
          </div>

          {/* Virulys Special Twice Daily Badge */}
          {product?.id === 'virulys' && (
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>TWICE-DAILY PROTOCOL (50:1 LYSINE/ARGININE)</span>
            </div>
          )}

          {/* Rapid Test In-Clinic Timer Widget */}
          {testTimerSeconds !== null && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold border shadow-sm ${
              testTimerSeconds === 0 
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse' 
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {testTimerSeconds === 0 ? 'RESULT READY' : `${Math.floor(testTimerSeconds / 60)}:${(testTimerSeconds % 60).toString().padStart(2, '0')}`}
              </span>
              <button onClick={stopTestTimer} className="p-0.5 rounded hover:bg-black/10">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Presentation Tools (Laser, Spotlight, Zoom, Clinic/Cinema, Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Clinic / Cinema Viewport Mode Toggle */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            title={isDarkMode ? "Switch to Clinic Light (Vet-Approved High Legibility)" : "Switch to Cinema Dark"}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 border-slate-700'
                : 'bg-white/95 text-[#0B431E] border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0B431E]" />}
            <span className="hidden md:inline">{isDarkMode ? 'Cinema' : 'Clinic Light'}</span>
          </button>

          {/* Red Laser Pointer (Key: L) */}
          <button
            onClick={() => setIsLaserActive((prev) => !prev)}
            title="Toggle Red Laser Pointer (Key: L)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isLaserActive
                ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                : isDarkMode
                  ? 'bg-slate-900/90 text-slate-300 border-white/15 hover:bg-white/10'
                  : 'bg-white/95 text-slate-700 border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <Crosshair className={`w-4 h-4 ${isLaserActive ? 'text-white' : 'text-rose-500'}`} />
            <span className="hidden sm:inline">Laser</span>
          </button>

          {/* 60% Spotlight Dimmer (Key: S) */}
          <button
            onClick={() => setIsSpotlightActive((prev) => !prev)}
            title="Toggle 60% Spotlight Dimmer (Key: S)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isSpotlightActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : isDarkMode
                  ? 'bg-slate-900/90 text-slate-300 border-white/15 hover:bg-white/10'
                  : 'bg-white/95 text-slate-700 border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <SunMedium className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Spotlight</span>
          </button>

          {/* 2x Interactive Zoom (Key: Z) */}
          <button
            onClick={() => {
              setZoomLevel((prev) => (prev === 1 ? 2 : 1));
              setPanPosition({ x: 0, y: 0 });
            }}
            title="Toggle 2x Interactive Zoom (Key: Z)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              zoomLevel > 1
                ? 'bg-[#0B431E] text-white border-[#0B431E]'
                : isDarkMode
                  ? 'bg-slate-900/90 text-slate-300 border-white/15 hover:bg-white/10'
                  : 'bg-white/95 text-slate-700 border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            <span className="hidden sm:inline">{zoomLevel}x</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-2xl border transition-colors flex items-center justify-center active:scale-95 shadow-sm ${
              isDarkMode 
                ? 'bg-slate-900/90 hover:bg-slate-800 border-white/15 text-slate-300' 
                : 'bg-white/95 hover:bg-white border-slate-200/80 text-slate-700'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#0B431E]" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN PRESENTATION VIEWPORT (16:10 / 4:3 Zero-Scroll Canvas)            */}
      {/* ========================================================================= */}
      <div 
        className="relative flex-1 flex items-center justify-center w-full h-[calc(100dvh-140px)] overflow-hidden"
        onClick={() => {
          if (!isLaserActive && !isSpotlightActive && zoomLevel === 1) {
            setShowToolbars((prev) => !prev);
          }
        }}
      >
        {currentSlideUrl ? (
          <div
            className="relative transition-transform duration-100 ease-out max-w-full max-h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
            }}
          >
            <img
              src={currentSlideUrl}
              alt={`${product?.name} Slide ${currentSlideIndex + 1}`}
              className="max-h-[calc(100dvh-150px)] max-w-[96vw] object-contain packshot-studio rounded-2xl border border-slate-900/10"
              draggable={false}
            />
          </div>
        ) : (
          <div className="text-slate-500 text-sm font-semibold">No slide loaded</div>
        )}

        {/* 60% SPOTLIGHT DIMMER OVERLAY */}
        {isSpotlightActive && (
          <div
            className="spotlight-mask"
            style={{
              background: `radial-gradient(circle 170px at ${pointerPos.x}px ${pointerPos.y}px, rgba(0,0,0,0) 0%, rgba(15,23,42,0.85) 100%)`,
            }}
          />
        )}

        {/* RED LASER POINTER */}
        {isLaserActive && (
          <div
            className="laser-dot"
            style={{
              left: `${pointerPos.x}px`,
              top: `${pointerPos.y}px`,
            }}
          />
        )}

        {/* Touch-Friendly iPad Side Paddle Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToSlide(currentSlideIndex - 1);
          }}
          disabled={currentSlideIndex === 0}
          title="Previous Slide (Swipe Right / Left Arrow)"
          className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full border transition-all flex items-center justify-center active:scale-95 shadow-xl ${
            currentSlideIndex === 0 
              ? 'opacity-20 cursor-not-allowed' 
              : 'opacity-90 hover:opacity-100'
          } ${
            isDarkMode 
              ? 'bg-slate-900/90 hover:bg-slate-800 border-white/20 text-white' 
              : 'bg-white/95 hover:bg-white border-slate-200/90 text-slate-800'
          }`}
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            goToSlide(currentSlideIndex + 1);
          }}
          disabled={currentSlideIndex === slides.length - 1}
          title="Next Slide (Swipe Left / Right Arrow)"
          className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full border transition-all flex items-center justify-center active:scale-95 shadow-xl ${
            currentSlideIndex === slides.length - 1 
              ? 'opacity-20 cursor-not-allowed' 
              : 'opacity-90 hover:opacity-100'
          } ${
            isDarkMode 
              ? 'bg-slate-900/90 hover:bg-slate-800 border-white/20 text-white' 
              : 'bg-white/95 hover:bg-white border-slate-200/90 text-slate-800'
          }`}
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. THUMB-ZONE FLOATING HUD (Heads-Up Display Glassmorphic Dock)            */}
      {/* ========================================================================= */}
      <div
        className={`absolute bottom-0 inset-x-0 z-40 transition-all duration-300 pointer-events-auto p-3 sm:p-4 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/90 to-transparent' 
            : 'bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent'
        } ${
          showToolbars
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2">
          
          {/* A. 3 DEDICATED QUICK-ACTION SLIDE-OVER DRAWER TRIGGERS */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* 1. Dosing Calculator Button */}
            <button
              onClick={() => setActiveDrawer((prev) => prev === 'calculator' ? null : 'calculator')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm active:scale-95 ${
                activeDrawer === 'calculator'
                  ? 'bg-[#0B431E] text-white border-[#0B431E] ring-2 ring-[#0B431E]/30'
                  : isDarkMode
                    ? 'bg-slate-900/90 hover:bg-slate-800 text-teal-300 border-teal-500/30'
                    : 'bg-white/95 hover:bg-teal-50 text-[#0B431E] border-slate-200'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span>Dosing Calculator</span>
            </button>

            {/* 2. Clinical References & Studies Button */}
            <button
              onClick={() => setActiveDrawer((prev) => prev === 'references' ? null : 'references')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm active:scale-95 ${
                activeDrawer === 'references'
                  ? 'bg-[#0B431E] text-white border-[#0B431E] ring-2 ring-[#0B431E]/30'
                  : isDarkMode
                    ? 'bg-slate-900/90 hover:bg-slate-800 text-purple-300 border-purple-500/30'
                    : 'bg-white/95 hover:bg-purple-50 text-[#0B431E] border-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>Clinical Evidence</span>
              {clinicalData?.clinicalReferences?.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black flex items-center justify-center">
                  {clinicalData.clinicalReferences.length}
                </span>
              )}
            </button>

            {/* 3. Compare & Key Differentiators Button */}
            <button
              onClick={() => setActiveDrawer((prev) => prev === 'compare' ? null : 'compare')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm active:scale-95 ${
                activeDrawer === 'compare'
                  ? 'bg-[#0B431E] text-white border-[#0B431E] ring-2 ring-[#0B431E]/30'
                  : isDarkMode
                    ? 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-500/30'
                    : 'bg-white/95 hover:bg-amber-50 text-[#0B431E] border-slate-200'
              }`}
            >
              <GitCompare className="w-4 h-4 text-amber-500" />
              <span>Differentiators</span>
            </button>

            {/* 4. Protocols Drawer Button */}
            {relatedProducts.length > 0 && (
              <button
                onClick={() => setActiveDrawer((prev) => prev === 'protocols' ? null : 'protocols')}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-sm active:scale-95 ${
                  activeDrawer === 'protocols'
                    ? 'bg-[#0B431E] text-white border-[#0B431E]'
                    : isDarkMode
                      ? 'bg-slate-900/90 hover:bg-slate-800 text-sky-300 border-sky-500/30'
                      : 'bg-white/95 hover:bg-sky-50 text-[#0B431E] border-slate-200'
                }`}
              >
                <Share2 className="w-4 h-4 text-sky-500" />
                <span>Protocols ({relatedProducts.length})</span>
              </button>
            )}

            {/* 5. In-Clinic Test Timer Trigger (for Rapid Tests) */}
            {product?.companyId === 'ringbio' && (
              <button
                onClick={() => startTestTimer(10)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-black bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Clock className="w-4 h-4 text-pink-600" />
                <span>10m Test Timer</span>
              </button>
            )}
          </div>

          {/* B. SLIDE PROGRESS DOTS & STEPPER (Story progress indicator) */}
          <div className={`w-full max-w-xl p-2 rounded-2xl border backdrop-blur-xl shadow-hud flex items-center justify-between gap-3 ${
            isDarkMode ? 'glass-hud-dark' : 'glass-hud'
          }`}>
            <span className="text-[11px] font-mono font-bold text-slate-500 pl-2">
              Slide {currentSlideIndex + 1}/{slides.length}
            </span>

            {/* Interactive Progress Dots */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {slides.map((_, idx) => {
                const isActive = idx === currentSlideIndex;
                const isVisited = idx < currentSlideIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    title={getSlideStepLabel(idx, slides.length)}
                    className={`group relative flex items-center justify-center transition-all duration-200 ${
                      isActive ? 'scale-125' : 'hover:scale-110'
                    }`}
                  >
                    <span
                      className={`block rounded-full transition-all ${
                        isActive
                          ? 'w-5 h-2.5 bg-[#0B431E] ring-4 ring-[#0B431E]/20'
                          : isVisited
                            ? 'w-2.5 h-2.5 bg-emerald-600'
                            : 'w-2 h-2 bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    {/* Tooltip on hover */}
                    <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap text-[10px] font-bold px-2 py-1 rounded bg-slate-900 text-white shadow-lg pointer-events-none z-50">
                      {getSlideStepLabel(idx, slides.length)}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onOpenQuickJump()}
              className="text-[11px] font-extrabold text-[#0B431E] hover:underline pr-2 flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Matrix</span>
            </button>
          </div>

          {/* C. QUICK PRODUCT SWITCHER DOCK (1-Tap Sibling Jumping Across Categories) */}
          <div className={`w-full max-w-4xl p-2 rounded-2xl border backdrop-blur-xl shadow-hud flex items-center justify-between gap-2 overflow-hidden ${
            isDarkMode ? 'glass-hud-dark' : 'glass-hud'
          }`}>
            {/* Category Filter selector */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-0.5">
              {['ALL', 'DERMATOLOGY', 'IMMUNOLOGY', 'HEPATIC', 'RENAL', 'RESPIRATORY', 'DIAGNOSTICS'].map((catKey) => {
                const isSelected = hudCategoryFilter === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => setHudCategoryFilter(catKey)}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[#0B431E] text-white shadow-sm'
                        : isDarkMode
                          ? 'text-slate-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {catKey === 'ALL' ? 'All (16)' : catKey.slice(0, 5)}
                  </button>
                );
              })}

              <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0" />

              {/* Product Pills in Filtered Category */}
              {hudProducts.map((p) => {
                const isCurrent = p.id === product?.id;
                const pAccent = p.brandAccent || '#0B431E';
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (!isCurrent) {
                        onSwitchProduct(p);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border flex items-center gap-1.5 active:scale-95 shadow-sm ${
                      isCurrent
                        ? 'bg-[#0B431E] text-white border-[#0B431E] scale-105'
                        : isDarkMode
                          ? 'bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isCurrent ? '#FFFFFF' : pAccent }}
                    />
                    <span>{p.shortName || p.name}</span>
                    {p.isTopTier && (
                      <Star className={`w-3 h-3 flex-shrink-0 ${isCurrent ? 'fill-amber-300 text-amber-300' : 'fill-amber-500 text-amber-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SLIDE-OVER DRAWER: DOSING CALCULATOR & PROTOCOL                         */}
      {/* ========================================================================= */}
      {activeDrawer === 'calculator' && (
        <div className="absolute inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B431E]">Dosing Calculator</h3>
                <p className="text-[11px] text-slate-500 font-semibold">{product?.name} Posology Engine</p>
              </div>
            </div>
            <button
              onClick={() => setActiveDrawer(null)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Calculator Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            {/* Species Toggle */}
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                Patient Species
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPatientSpecies('canine')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-2 ${
                    patientSpecies === 'canine'
                      ? 'bg-[#0B431E] text-white border-[#0B431E] shadow-sm'
                      : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>🐕 Canine (Dog)</span>
                </button>
                <button
                  onClick={() => setPatientSpecies('feline')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-2 ${
                    patientSpecies === 'feline'
                      ? 'bg-[#0B431E] text-white border-[#0B431E] shadow-sm'
                      : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>🐈 Feline (Cat)</span>
                </button>
              </div>
            </div>

            {/* Virulys Kitten vs Adult Age Group */}
            {product?.id === 'virulys' && (
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-2">
                  Feline Life Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCatAgeGroup('kitten')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      catAgeGroup === 'kitten'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Kitten (&lt; 6 months)
                  </button>
                  <button
                    onClick={() => setCatAgeGroup('adult')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border ${
                      catAgeGroup === 'adult'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Adult Cat (&ge; 6 months)
                  </button>
                </div>
              </div>
            )}

            {/* Patient Weight Controls (for weight-based products) */}
            {clinicalData?.dosingConfig?.type === 'weight_based' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Patient Body Weight
                  </label>
                  <span className="text-base font-black font-mono text-[#0B431E]">
                    {patientWeightKg} kg <span className="text-xs text-slate-400">({(patientWeightKg * 2.20462).toFixed(1)} lbs)</span>
                  </span>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="0.5"
                  value={patientWeightKg}
                  onChange={(e) => setPatientWeightKg(parseFloat(e.target.value))}
                  className="w-full accent-[#0B431E] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                {/* Quick Weight Presets */}
                <div className="flex items-center justify-between gap-1.5 mt-3">
                  {[2.5, 5, 10, 20, 30, 45].map((w) => (
                    <button
                      key={w}
                      onClick={() => setPatientWeightKg(w)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        patientWeightKg === w
                          ? 'bg-[#0B431E] text-white border-[#0B431E]'
                          : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {w}k
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculated Dose Display Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E8F4EC] to-[#F7F5EE] border border-[#0B431E]/20 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#0B431E] mb-1">
                Calculated Posology
              </div>
              <div className="text-2xl font-black text-[#0B431E] font-mono">
                {calculatedDosing.singleDose}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Frequency: {calculatedDosing.frequency}</span>
              </div>
              {calculatedDosing.dailyTotal && (
                <div className="text-xs text-slate-600 mt-1">
                  Total Daily: <strong className="font-mono text-slate-800">{calculatedDosing.dailyTotal}</strong>
                </div>
              )}
              {calculatedDosing.durationDays && (
                <div className="text-xs text-slate-600 mt-1">
                  Bottle Yield: <strong className="text-slate-800">{calculatedDosing.durationDays}</strong>
                </div>
              )}
            </div>

            {/* Official Posology Protocol Rule */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-black text-[#0B431E] uppercase text-[10px] block mb-1">Standard Formula:</span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {calculatedDosing.formula}
              </p>
              {calculatedDosing.instructions && (
                <p className="text-slate-600 text-[11px] mt-2 italic">
                  💡 {calculatedDosing.instructions}
                </p>
              )}
            </div>
          </div>

          {/* Footer Action: Copy Prescription for Vet Records */}
          <div className="p-4 border-t border-slate-100 bg-[#F8FAFC]">
            <button
              onClick={handleCopyPrescription}
              className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-[#0B431E] hover:bg-[#14632E] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              {isCopiedDose ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Prescription Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Patient Posology & Notes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SLIDE-OVER DRAWER: CLINICAL EVIDENCE & REFERENCES                       */}
      {/* ========================================================================= */}
      {activeDrawer === 'references' && (
        <div className="absolute inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B431E]">Published Clinical Trials</h3>
                <p className="text-[11px] text-slate-500 font-semibold">{product?.name} Study Evidence</p>
              </div>
            </div>
            <button
              onClick={() => setActiveDrawer(null)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* References List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {clinicalData?.clinicalReferences && clinicalData.clinicalReferences.length > 0 ? (
              clinicalData.clinicalReferences.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-2.5"
                >
                  {/* Top Badge & Metric */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
                      {ref.metric}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ref.sample}
                    </span>
                  </div>

                  {/* Study Title */}
                  <h4 className="text-xs font-black text-slate-900 leading-snug">
                    {ref.title}
                  </h4>

                  {/* Highlight */}
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs font-bold text-purple-950 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>{ref.highlight}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {ref.summary}
                  </p>

                  {/* Citation */}
                  <div className="text-[10px] text-slate-400 italic font-mono pt-1 border-t border-slate-100">
                    Source: {ref.journal}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">
                Comprehensive multi-center clinical trials available in the medical archives.
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] text-[11px] text-slate-500 text-center font-medium">
            Clinical studies evaluated under Good Clinical Practice (GCP) guidelines.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SLIDE-OVER DRAWER: COMPARE & KEY DIFFERENTIATORS                        */}
      {/* ========================================================================= */}
      {activeDrawer === 'compare' && (
        <div className="absolute inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B431E]">Competitive Differentiators</h3>
                <p className="text-[11px] text-slate-500 font-semibold">{product?.name} vs Conventional Options</p>
              </div>
            </div>
            <button
              onClick={() => setActiveDrawer(null)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Differentiators Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {clinicalData?.differentiators && clinicalData.differentiators.length > 0 ? (
              clinicalData.differentiators.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 shadow-sm space-y-2.5"
                >
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0B431E]" />
                    <span>{diff.aspect}</span>
                  </h4>

                  {/* Conceptors Advantage */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="font-extrabold text-emerald-900 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>The Conceptors Clinical Advantage:</span>
                    </div>
                    <p className="text-emerald-950 font-medium leading-relaxed">
                      {diff.conceptors}
                    </p>
                  </div>

                  {/* Conventional Alternative */}
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>Conventional Market Alternatives:</span>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {diff.standard}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">
                Unique molecular activation and biological mechanisms offer superior safety and speed of action.
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] text-[11px] text-slate-500 text-center font-medium">
            Evidence-based head-to-head comparison for veterinary consultation.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SLIDE-OVER DRAWER: RECOMMENDED PROTOCOLS / CROSS-SELL                  */}
      {/* ========================================================================= */}
      {activeDrawer === 'protocols' && (
        <div className="absolute inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0B431E]">Synergistic Protocols</h3>
                <p className="text-[11px] text-slate-500 font-semibold">Related therapies for {product?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveDrawer(null)}
              className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              When treating primary indications with <strong>{product?.name}</strong>, veterinary best practice recommends co-prescribing these synergistic products:
            </p>

            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  setActiveDrawer(null);
                  onSwitchProduct(rel);
                }}
                className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#E8F4EC] border border-slate-200 hover:border-[#0B431E]/40 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98] shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: rel.brandAccent || '#0B431E' }}
                    />
                    <span className="text-xs font-black text-slate-900 group-hover:text-[#0B431E]">
                      {rel.name}
                    </span>
                    {rel.isTopTier && (
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">
                    {rel.headline}
                  </p>
                  <span className="text-[10px] font-bold text-[#0B431E] uppercase tracking-wider inline-block mt-1">
                    {rel.specialty}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B431E] group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] text-[11px] text-slate-500 text-center font-medium">
            Tap any protocol above to jump directly to its presentation.
          </div>
        </div>
      )}

    </div>
  );
}
