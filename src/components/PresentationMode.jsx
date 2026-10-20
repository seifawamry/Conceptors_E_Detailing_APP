import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  SunMedium, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  Star, 
  Zap, 
  Sun, 
  Moon,
  BookOpen,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import ConceptorsLogo from './ConceptorsLogo.jsx';
import { clinicalDatabase } from '../data/clinicalData.js';
import { enterFullscreenLandscape, exitFullscreen } from '../utils/screenUtils.js';

export default function PresentationMode({
  product,
  allProductsMap = {},
  activeProtocol = null,
  allCallFlows = [],
  onClose,
  onSwitchProduct,
  onLaunchProtocolFlow,
  onOpenQuickJump,
  onRecordSlideView,
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Default to Clean Doctor Focus Mode: toolbars hidden on launch so the slide is 100% visible & huge
  const [showToolbars, setShowToolbars] = useState(false);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [pointerPos, setPointerPos] = useState({ x: -100, y: -100 });
  const [slideStartTime, setSlideStartTime] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Default to Clinic Bright Mode (High Visibility for Vets)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Active Slide-Over Drawer: null | 'references' | 'matrix'
  const [activeDrawer, setActiveDrawer] = useState(null);

  // Protocol Toast notification
  const [protocolToast, setProtocolToast] = useState(null);

  // Rapid Test Timer (for Flexy diagnostic slides)
  const [testTimerSeconds, setTestTimerSeconds] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const containerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwipingRef = useRef(false);
  const lastTouchTimeRef = useRef(0);

  const slides = product?.slides || [];
  const currentSlideUrl = slides[currentSlideIndex] || '';

  const clinicalData = product?.id ? clinicalDatabase[product.id] : null;
  const brandAccent = product?.brandAccent || '#0B431E';
  const categoryColor = clinicalData?.categoryColor || brandAccent;

  // =========================================================================
  // PROTOCOL MULTI-PRODUCT INTELLIGENCE & SEQUENCING
  // =========================================================================
  const isProtocolMode = !!(activeProtocol && activeProtocol.products && activeProtocol.products.length > 1);
  const protocolProducts = activeProtocol?.products || [];

  const currentProductInProtocolIndex = useMemo(() => {
    if (!isProtocolMode) return -1;
    const idx = protocolProducts.findIndex((p) => p.id === product?.id);
    return idx !== -1 ? idx : (activeProtocol.currentProductIndex || 0);
  }, [isProtocolMode, protocolProducts, product?.id, activeProtocol?.currentProductIndex]);

  const hasPrevProduct = isProtocolMode && currentProductInProtocolIndex > 0;
  const hasNextProduct = isProtocolMode && currentProductInProtocolIndex < protocolProducts.length - 1;
  const prevProduct = hasPrevProduct ? protocolProducts[currentProductInProtocolIndex - 1] : null;
  const nextProduct = hasNextProduct ? protocolProducts[currentProductInProtocolIndex + 1] : null;

  const currentStepInfo = isProtocolMode 
    ? (activeProtocol.steps?.[currentProductInProtocolIndex] || {
        step: currentProductInProtocolIndex + 1,
        role: 'Therapy',
        label: product?.shortName || product?.name
      })
    : null;

  const nextStepInfo = hasNextProduct 
    ? (activeProtocol.steps?.[currentProductInProtocolIndex + 1] || {
        step: currentProductInProtocolIndex + 2,
        role: 'Therapy',
        label: nextProduct?.shortName || nextProduct?.name
      })
    : null;

  // Viewport Lock (zero-scroll enforcement on body)
  useEffect(() => {
    document.body.classList.add('presentation-lock');
    return () => {
      document.body.classList.remove('presentation-lock');
    };
  }, []);

  // Auto-request full screen landscape mode on mount
  useEffect(() => {
    enterFullscreenLandscape();

    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset timers on product switch
  useEffect(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setSlideStartTime(Date.now());
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
        protocolId: activeProtocol?.id,
      });
    }
  }, [slideStartTime, product, currentSlideIndex, currentSlideUrl, onRecordSlideView, activeProtocol?.id]);

  // Slide navigation (maintains clean Doctor Focus mode)
  const goToSlide = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= slides.length) return;
    recordCurrentSlideDuration();
    setSlideStartTime(Date.now());
    setCurrentSlideIndex(newIndex);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setShowToolbars(false);
  }, [slides.length, recordCurrentSlideDuration]);

  // Protocol product switching (clean seamless transition with zero screen clutter)
  const switchToProtocolProduct = useCallback((targetIndex, initialSlide = 0) => {
    if (targetIndex < 0 || targetIndex >= protocolProducts.length) return;
    recordCurrentSlideDuration();
    const targetProduct = protocolProducts[targetIndex];
    if (targetProduct) {
      onSwitchProduct(targetProduct, targetIndex);
      setCurrentSlideIndex(initialSlide);
      setSlideStartTime(Date.now());
      setShowToolbars(false);
      setActiveDrawer(null);
      setProtocolToast(`Step ${targetIndex + 1} of ${protocolProducts.length}: ${targetProduct.shortName || targetProduct.name}`);
      setTimeout(() => setProtocolToast(null), 2500);
    }
  }, [protocolProducts, recordCurrentSlideDuration, onSwitchProduct]);

  // Continuous slide advancement across products in the protocol
  const advanceToNextProductInProtocol = useCallback(() => {
    if (hasNextProduct) {
      switchToProtocolProduct(currentProductInProtocolIndex + 1, 0);
    } else if (isProtocolMode) {
      setProtocolToast('Protocol Detail Complete! All protocol therapies reviewed.');
      setTimeout(() => setProtocolToast(null), 3500);
    }
  }, [hasNextProduct, isProtocolMode, switchToProtocolProduct, currentProductInProtocolIndex]);

  const returnToPrevProductInProtocol = useCallback(() => {
    if (hasPrevProduct && prevProduct) {
      const prevSlides = prevProduct.slides || [];
      const lastSlideIndex = Math.max(0, prevSlides.length - 1);
      switchToProtocolProduct(currentProductInProtocolIndex - 1, lastSlideIndex);
    }
  }, [hasPrevProduct, prevProduct, switchToProtocolProduct, currentProductInProtocolIndex]);

  const handleNextSlideOrProduct = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    } else if (hasNextProduct) {
      advanceToNextProductInProtocol();
    } else if (isProtocolMode) {
      setProtocolToast('Protocol Detail Complete! All protocol therapies reviewed.');
      setTimeout(() => setProtocolToast(null), 3500);
    }
  }, [currentSlideIndex, slides.length, hasNextProduct, isProtocolMode, goToSlide, advanceToNextProductInProtocol]);

  const handlePrevSlideOrProduct = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    } else if (hasPrevProduct) {
      returnToPrevProductInProtocol();
    }
  }, [currentSlideIndex, hasPrevProduct, goToSlide, returnToPrevProductInProtocol]);

  // =========================================================================
  // TOOLBAR CONTROL & AUTO-HIDE LOGIC (DOES NOT RE-APPEAR DURING SWIPING!)
  // =========================================================================
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    // Only schedule hide if toolbars are currently visible AND no drawer is active
    if (!activeDrawer && !isSpotlightActive && !isLaserActive) {
      inactivityTimerRef.current = setTimeout(() => {
        setShowToolbars(false);
      }, 5000);
    }
  }, [activeDrawer, isSpotlightActive, isLaserActive]);

  useEffect(() => {
    if (showToolbars) {
      resetInactivityTimer();
    }
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      recordCurrentSlideDuration();
    };
  }, [showToolbars, resetInactivityTimer, recordCurrentSlideDuration]);

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

  // Pointer movement tracking (Strictly isolated: touch swiping NEVER forces toolbars to appear!)
  const handlePointerMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointerPos({ x, y });

    // Laser or spotlight tracking
    if (isLaserActive || isSpotlightActive) return;

    // ONLY desktop mouse movements keep toolbars alive, NEVER touch/finger swipes!
    if (e.pointerType === 'mouse' && showToolbars) {
      resetInactivityTimer();
    }

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

  // =========================================================================
  // TOUCH SWIPE HANDLERS (CRUCIAL: SWIPING IS 100% SILENT & NEVER RE-OPENS TOOLBARS)
  // =========================================================================
  const handleTouchStart = (e) => {
    isSwipingRef.current = false;
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
    if (e.touches && e.touches[0]) {
      const diffX = e.touches[0].clientX - touchStartRef.current.x;
      const diffY = e.touches[0].clientY - touchStartRef.current.y;
      // Mark as swipe gesture so synthetic clicks and tap toggles are completely cancelled
      if (Math.abs(diffX) > 15 || Math.abs(diffY) > 15) {
        isSwipingRef.current = true;
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
    lastTouchTimeRef.current = Date.now();

    // Horizontal swipe: diffX > 35px (CLEAN SILENT SLIDE TRANSITION, TOOLBARS STAY EXACTLY AS THEY ARE!)
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.1 && elapsedTime < 800) {
      isSwipingRef.current = true;
      if (diffX < 0) {
        handleNextSlideOrProduct();
      } else {
        handlePrevSlideOrProduct();
      }
    } else if (Math.abs(diffX) < 15 && Math.abs(diffY) < 15 && elapsedTime < 350) {
      // Intentional stationary tap on the canvas toggles toolbars
      isSwipingRef.current = false;
      if (!isLaserActive && !isSpotlightActive && zoomLevel === 1 && !activeDrawer) {
        setShowToolbars((prev) => !prev);
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNextSlideOrProduct();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevSlideOrProduct();
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
      } else if (e.key === 'm' || e.key === 'M') {
        setActiveDrawer((prev) => prev === 'matrix' ? null : 'matrix');
      } else if (e.key === 'r' || e.key === 'R') {
        setActiveDrawer((prev) => prev === 'references' ? null : 'references');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSlideOrProduct, handlePrevSlideOrProduct, onClose, activeDrawer]);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      await enterFullscreenLandscape();
      setIsFullscreen(true);
    } else {
      await exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const relatedProducts = (product?.relatedProductIds || [])
    .map((id) => allProductsMap[id])
    .filter(Boolean);

  // Flows featuring the current product
  const relevantFlows = useMemo(() => {
    if (!allCallFlows || allCallFlows.length === 0 || !product) return [];
    return allCallFlows.filter((f) => f.productIds.includes(product.id));
  }, [allCallFlows, product]);

  // All 16 products list for Quick Switcher Dock and Omni-Matrix
  const allProductsList = useMemo(() => Object.values(allProductsMap), [allProductsMap]);

  // Filtered Products for Quick Switcher Dock
  // Story step labels for progress dots
  const getSlideStepLabel = (index, total) => {
    if (index === 0) return 'Overview & Positioning';
    if (index === 1) return 'Mechanism of Action (MOA)';
    if (index === 2) return 'Clinical Evidence & Trials';
    if (index === 3) return 'Posology & Weight Protocol';
    if (index === total - 1) return 'Summary & Formulations';
    return `Clinical Point ${index + 1}`;
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
      {/* 1. TOP HEADER TOOLBAR & ACTIVE PROTOCOL PIPELINE                          */}
      {/* ========================================================================= */}
      <div
        className={`absolute top-0 inset-x-0 z-40 transition-all duration-300 pointer-events-auto flex flex-col ${
          showToolbars
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        {/* Main Header Row */}
        <div className="p-3 sm:p-4 flex items-center justify-between gap-2">
          {/* Left: Exit & Product Details */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

            {/* Current Product Pill */}
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

            {/* 1.5s Omni-Matrix Header Shortcut Button */}
            <button
              onClick={() => setActiveDrawer('matrix')}
              className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Open 1.5-Second Omni-Matrix across all 16 products"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Omni-Matrix (16)</span>
            </button>

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

          {/* Right: Presentation Tools (Doctor Focus Hide, Laser, Spotlight, Zoom, Clinic/Cinema, Fullscreen) */}
          <div className="flex items-center gap-2">
            {/* 🎯 Doctor Focus Mode Button (Immediately hides all toolbars so doctor can concentrate) */}
            <button
              onClick={() => setShowToolbars(false)}
              title="Hide all controls for Doctor Concentration (Single tap or bottom pill restores controls)"
              className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black bg-[#0B431E] hover:bg-[#14632E] text-white border border-[#0B431E] transition-all active:scale-95 shadow-sm"
            >
              <EyeOff className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Doctor Focus</span>
            </button>

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
      </div>

      {/* Protocol Step Transition Toast */}
      {protocolToast && (
        <div className="absolute top-20 inset-x-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-black shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{protocolToast}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN PRESENTATION VIEWPORT (Full Screen Zero-Scroll Canvas)            */}
      {/* ========================================================================= */}
      <div 
        className="relative flex-1 flex items-center justify-center w-full h-full min-h-[100dvh] overflow-hidden select-none"
        onClick={(e) => {
          // Suppress synthetic clicks that immediately follow touch swipe or stationary tap
          if (Date.now() - lastTouchTimeRef.current < 450) {
            return;
          }
          if (isSwipingRef.current) {
            isSwipingRef.current = false;
            return;
          }
          if (!isLaserActive && !isSpotlightActive && zoomLevel === 1 && !activeDrawer) {
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
              className="max-h-[98dvh] max-w-[99vw] w-auto h-auto object-contain rounded-2xl border border-slate-900/10 shadow-2xl transition-all duration-200"
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

        {/* Touch-Friendly Side Paddle Arrows (Clean navigation, toolbars stay hidden!) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevSlideOrProduct();
          }}
          disabled={currentSlideIndex === 0 && !hasPrevProduct}
          title={
            currentSlideIndex === 0 && hasPrevProduct
              ? `Previous in Protocol: ${prevProduct?.shortName || prevProduct?.name}`
              : 'Previous Slide (Swipe Right / Left Arrow)'
          }
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full border transition-all flex items-center justify-center active:scale-95 shadow-md ${
            currentSlideIndex === 0 && !hasPrevProduct
              ? 'opacity-0 pointer-events-none' 
              : 'opacity-30 hover:opacity-90 bg-white/80 hover:bg-white text-slate-800'
          }`}
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNextSlideOrProduct();
          }}
          disabled={currentSlideIndex === slides.length - 1 && !hasNextProduct && !isProtocolMode}
          title={
            currentSlideIndex === slides.length - 1 && hasNextProduct
              ? `Next in Protocol: Step ${currentProductInProtocolIndex + 2} (${nextProduct?.shortName || nextProduct?.name})`
              : 'Next Slide (Swipe Left / Right Arrow)'
          }
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full border transition-all flex items-center justify-center active:scale-95 shadow-md ${
            currentSlideIndex === slides.length - 1 && !hasNextProduct && !isProtocolMode
              ? 'opacity-0 pointer-events-none' 
              : 'opacity-30 hover:opacity-90 bg-white/80 hover:bg-white text-slate-800'
          }`}
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DISCREET FLOATING PILL WHEN TOOLBARS ARE HIDDEN (DOCTOR FOCUS MODE)       */}
      {/* ========================================================================= */}
      {!showToolbars && !activeDrawer && (
        <div className="absolute bottom-3 right-3 z-40 animate-in fade-in duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowToolbars(true);
              resetInactivityTimer();
            }}
            className="px-3 py-1.5 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white/80 hover:text-white backdrop-blur-md border border-white/10 text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            title="Open Presentation Controls (or tap slide canvas / press H)"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Controls</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. THUMB-ZONE FLOATING HUD (Sleek Single-Row Minimal Control Dock)        */}
      {/* ========================================================================= */}
      <div
        className={`absolute bottom-3 inset-x-0 z-40 transition-all duration-300 pointer-events-auto px-4 flex justify-center ${
          showToolbars
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <div className={`p-2 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 ${
          isDarkMode ? 'glass-hud-dark' : 'glass-hud'
        }`}>
          {/* 1. 1.5s Omni-Matrix Button */}
          <button
            onClick={() => setActiveDrawer('matrix')}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300 shadow-sm active:scale-95"
            title="1.5s Omni-Matrix (Jump to any of 16 products)"
          >
            <Zap className="w-4 h-4 text-slate-950 fill-current" />
            <span>Omni-Matrix (16)</span>
          </button>

          <span className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* 2. Slide Progress Indicator & Dots */}
          <div className="flex items-center gap-2.5 px-2">
            <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
              Slide {currentSlideIndex + 1}/{slides.length}
            </span>

            {/* Interactive Progress Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
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
                          ? 'w-4 h-2 bg-[#0B431E] ring-2 ring-[#0B431E]/30'
                          : isVisited
                            ? 'w-2 h-2 bg-emerald-600'
                            : 'w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap text-[10px] font-bold px-2 py-1 rounded bg-slate-900 text-white shadow-lg pointer-events-none z-50">
                      {getSlideStepLabel(idx, slides.length)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <span className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* 3. Clinical References & Studies Button */}
          <button
            onClick={() => setActiveDrawer((prev) => prev === 'references' ? null : 'references')}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border shadow-sm active:scale-95 ${
              activeDrawer === 'references'
                ? 'bg-[#0B431E] text-white border-[#0B431E]'
                : isDarkMode
                  ? 'bg-slate-900/90 hover:bg-slate-800 text-purple-300 border-purple-500/30'
                  : 'bg-white hover:bg-purple-50 text-[#0B431E] border-slate-200'
            }`}
            title="Published Clinical Studies & Evidence"
          >
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span className="hidden sm:inline">Evidence</span>
          </button>

          {/* 4. Hide Controls (Doctor Focus) */}
          <button
            onClick={() => setShowToolbars(false)}
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Hide controls for doctor concentration"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Doctor Focus</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SLIDE-OVER DRAWER: 1.5-SECOND OMNI-MATRIX (ALWAYS WORKS 100% RELIABLY!) */}
      {/* ========================================================================= */}
      {activeDrawer === 'matrix' && (
        <div className="absolute inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-emerald-50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B431E]">1.5-Second Omni-Matrix</h3>
                <p className="text-[11px] text-slate-600 font-bold">1-Tap Instant Jump across all 16 Products</p>
              </div>
            </div>
            <button
              onClick={() => setActiveDrawer(null)}
              className="p-1.5 rounded-xl hover:bg-black/10 text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            {/* Top 10 Core Focus Flagships */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0B431E]">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>⭐ Top 10 Core Focus Flagships:</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">10 Products</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allProductsList.filter((p) => p.isTopTier).map((p) => {
                  const isCurrent = p.id === product?.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSwitchProduct(p);
                        setCurrentSlideIndex(0);
                        setActiveDrawer(null);
                        setProtocolToast(`Switched to ${p.name}`);
                        setTimeout(() => setProtocolToast(null), 2500);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all active:scale-95 shadow-sm flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-[#0B431E] text-white border-[#0B431E] shadow-md ring-2 ring-emerald-300'
                          : 'bg-[#F8FAFC] hover:bg-[#E8F4EC] border-slate-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            isCurrent ? 'bg-white/20 text-white' : 'bg-white text-[#0B431E] border border-slate-200'
                          }`}>
                            {p.company}
                          </span>
                          <Star className={`w-3 h-3 fill-current ${isCurrent ? 'text-amber-300' : 'text-amber-500'}`} />
                        </div>
                        <div className="text-xs font-black line-clamp-1">{p.name}</div>
                        <div className={`text-[10px] line-clamp-1 ${isCurrent ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {p.specialty}
                        </div>
                      </div>
                      <div className="mt-2 pt-1 border-t border-black/10 flex items-center justify-between text-[10px] font-mono">
                        <span>{p.slides?.length || 0} slides</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All 4 Portfolios */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2.5">
                All 4 Principal Companies (16 Products):
              </span>
              <div className="space-y-3">
                {['Catalysis', 'B.A.R.D', 'Vitasignia', 'Ringbio'].map((compName) => {
                  const compProducts = allProductsList.filter((p) => p.company === compName);
                  if (compProducts.length === 0) return null;
                  return (
                    <div key={compName} className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
                        <span className="text-xs font-black text-[#0B431E] uppercase tracking-wider">
                          {compName}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {compProducts.length} Products
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {compProducts.map((p) => {
                          const isCurrent = p.id === product?.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                onSwitchProduct(p);
                                setCurrentSlideIndex(0);
                                setActiveDrawer(null);
                                setProtocolToast(`Switched to ${p.name}`);
                                setTimeout(() => setProtocolToast(null), 2500);
                              }}
                              className={`p-2 rounded-xl text-left text-xs transition-all active:scale-95 flex items-center justify-between border ${
                                isCurrent
                                  ? 'bg-[#0B431E] text-white border-[#0B431E] font-black'
                                  : 'bg-white hover:bg-[#E8F4EC] text-slate-800 border-slate-200'
                              }`}
                            >
                              <span className="truncate">{p.shortName || p.name}</span>
                              <span className="text-[10px] font-mono opacity-60 ml-1">{p.slides?.length || 0}s</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Tap any product to jump immediately</span>
            <button
              onClick={() => {
                setActiveDrawer(null);
                if (onOpenQuickJump) onOpenQuickJump();
              }}
              className="text-[#0B431E] font-black hover:underline"
            >
              Open Full Modal →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SLIDE-OVER DRAWER: CLINICAL EVIDENCE & REFERENCES                       */}
      {/* ========================================================================= */}
      {activeDrawer === 'references' && (
        <div className="absolute inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
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

          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {clinicalData?.clinicalReferences && clinicalData.clinicalReferences.length > 0 ? (
              clinicalData.clinicalReferences.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
                      {ref.metric}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {ref.sample}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 leading-snug">
                    {ref.title}
                  </h4>

                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs font-bold text-purple-950 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>{ref.highlight}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {ref.summary}
                  </p>

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
    </div>
  );
}
