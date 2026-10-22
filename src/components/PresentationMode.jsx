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
  Sparkles,
  Box,
  Layers
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
  onBackToAnatomy = null,
  onSwitchProduct,
  onLaunchProtocolFlow,
  onOpenQuickJump,
  onRecordSlideView,
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Default to visible so reps always have immediate access to controls & exit
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
  const pinchStartDistRef = useRef(0);
  const initialZoomRef = useRef(1);
  const lastTapTimeRef = useRef(0);

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
  // TOUCH SWIPE & PINCH HANDLERS (TABLET / IPAD TOUCH OPTIMIZED)
  // =========================================================================
  const isTouchOnInteractiveControl = (target) => {
    if (!target || typeof target.closest !== 'function') return false;
    return Boolean(
      target.closest('button, a, input, select, textarea, [role="button"], [data-ui-control="true"]')
    );
  };

  const handleTouchStart = (e) => {
    if (isTouchOnInteractiveControl(e.target)) {
      return;
    }
    isSwipingRef.current = false;
    // 1. Two-Finger Pinch Zoom on iPad/Tablets
    if (e.touches && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      initialZoomRef.current = zoomLevel;
      return;
    }

    // 2. Single Touch Start
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
    if (isTouchOnInteractiveControl(e.target)) {
      return;
    }
    // 1. Pinch Zoom Processing
    if (e.touches && e.touches.length === 2 && pinchStartDistRef.current > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / pinchStartDistRef.current;
      const newZoom = Math.min(3, Math.max(1, initialZoomRef.current * factor));
      setZoomLevel(newZoom);
      return;
    }

    // 2. Single Finger Move
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
          x: Math.max(-400, Math.min(400, prev.x + dx * 0.8)),
          y: Math.max(-300, Math.min(300, prev.y + dy * 0.8)),
        }));
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isTouchOnInteractiveControl(e.target)) {
      return;
    }
    // Release pinch
    if (pinchStartDistRef.current > 0) {
      pinchStartDistRef.current = 0;
      if (zoomLevel < 1.15) {
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
      }
      return;
    }

    if (zoomLevel > 1) {
      isDraggingRef.current = false;
      return;
    }
    if (!e.changedTouches || !e.changedTouches[0]) return;

    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const elapsedTime = Date.now() - touchStartRef.current.time;
    const now = Date.now();
    lastTouchTimeRef.current = now;

    // Horizontal swipe: diffX > 35px (CLEAN SILENT SLIDE TRANSITION, TOOLBARS STAY EXACTLY AS THEY ARE!)
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.1 && elapsedTime < 800) {
      isSwipingRef.current = true;
      if (diffX < 0) {
        handleNextSlideOrProduct();
      } else {
        handlePrevSlideOrProduct();
      }
    } else if (Math.abs(diffX) < 18 && Math.abs(diffY) < 18 && elapsedTime < 320) {
      // Stationary tap: check for double tap zoom on tablets!
      isSwipingRef.current = false;
      if (now - lastTapTimeRef.current < 320) {
        // Double Tap Zoom!
        if (zoomLevel === 1) {
          setZoomLevel(2);
          const tapX = touchStartRef.current.x;
          const tapY = touchStartRef.current.y;
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          setPanPosition({
            x: Math.max(-250, Math.min(250, (cx - tapX) * 0.8)),
            y: Math.max(-200, Math.min(200, (cy - tapY) * 0.8)),
          });
        } else {
          setZoomLevel(1);
          setPanPosition({ x: 0, y: 0 });
        }
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
        // Single tap toggles the top header toolbar
        if (!isLaserActive && !isSpotlightActive && zoomLevel === 1 && !activeDrawer) {
          setShowToolbars((prev) => !prev);
        }
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
      {/* PERMANENTLY MOUNTED FLOATING "← Back to 3D Body Protocol" BUTTON (ZERO UNMOUNT DELAY ON TABLET TOUCH) */}
      {onBackToAnatomy && (
        <div
          data-ui-control="true"
          className="fixed top-0 left-0 z-[70] p-3 sm:p-4 pointer-events-auto"
          style={{
            paddingTop: 'max(10px, env(safe-area-inset-top, 10px))',
            paddingLeft: 'max(12px, env(safe-area-inset-left, 12px))',
          }}
        >
          <button
            type="button"
            data-ui-control="true"
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onBackToAnatomy();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onBackToAnatomy();
            }}
            className="min-h-[48px] px-4 sm:px-5 py-2.5 rounded-2xl bg-[#0B1120] hover:bg-slate-900 text-teal-300 border-2 border-teal-400/80 shadow-[0_10px_28px_rgba(20,184,166,0.45)] backdrop-blur-md transition-transform flex items-center gap-2 text-xs sm:text-sm font-black active:scale-95 cursor-pointer select-none"
            style={{ touchAction: 'manipulation' }}
            title="Return immediately to 3D Anatomical Clinical Protocol Explorer"
          >
            <ChevronLeft className="w-5 h-5 text-teal-300 stroke-[3]" />
            <span>Back to 3D Body Protocol</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER TOOLBAR & ACTIVE PROTOCOL PIPELINE                          */}
      {/* ========================================================================= */}
      <div
        data-ui-control="true"
        className={`absolute top-0 inset-x-0 z-40 transition-all duration-300 pointer-events-auto flex flex-col ${
          showToolbars
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
        style={{
          paddingTop: 'max(8px, env(safe-area-inset-top, 0px))',
          paddingLeft: 'max(12px, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(12px, env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Main Header Row */}
        <div className="p-3 sm:p-4 flex items-center justify-between gap-2">
          {/* Left: Exit / Back to 3D Body Protocol Spacer & Product Details */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {onBackToAnatomy ? (
              /* Invisible spacer matching the permanently mounted Back to 3D Body button */
              <div className="min-h-[48px] w-[210px] sm:w-[235px] flex-shrink-0 pointer-events-none" />
            ) : (
              <button
                type="button"
                data-ui-control="true"
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onClose();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className={`min-h-[48px] px-4 py-2.5 rounded-2xl border backdrop-blur-md transition-all flex items-center gap-2 text-xs sm:text-sm font-black active:scale-95 shadow-sm cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-900/90 hover:bg-slate-800 border-white/15 text-white' 
                    : 'bg-white/95 hover:bg-white border-slate-200/80 text-slate-800'
                }`}
                style={{ touchAction: 'manipulation' }}
                title="Exit Presentation Mode (Esc)"
              >
                <X className="w-4 h-4 text-red-500 stroke-[2.5]" />
                <span>Exit</span>
              </button>
            )}

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
        className="relative flex-1 flex items-center justify-center w-full h-full min-h-[100dvh] overflow-hidden select-none pb-20 pt-2"
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
              className="max-h-[85dvh] max-w-[96vw] w-auto h-auto object-contain rounded-2xl border border-slate-900/10 shadow-2xl transition-all duration-200"
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
          type="button"
          data-ui-control="true"
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handlePrevSlideOrProduct();
          }}
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
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-slate-300/80 transition-all flex items-center justify-center active:scale-90 shadow-lg cursor-pointer ${
            currentSlideIndex === 0 && !hasPrevProduct
              ? 'opacity-0 pointer-events-none' 
              : 'opacity-75 hover:opacity-100 bg-white/95 hover:bg-white text-slate-900'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <ChevronLeft className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.8]" />
        </button>

        <button
          type="button"
          data-ui-control="true"
          onTouchEnd={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleNextSlideOrProduct();
          }}
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
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-slate-300/80 transition-all flex items-center justify-center active:scale-90 shadow-lg cursor-pointer ${
            currentSlideIndex === slides.length - 1 && !hasNextProduct && !isProtocolMode
              ? 'opacity-0 pointer-events-none' 
              : 'opacity-75 hover:opacity-100 bg-white/95 hover:bg-white text-slate-900'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <ChevronRight className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.8]" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. ALWAYS-AVAILABLE FLOATING STEP DOCK (3D SPATIAL THUMB ZONE)           */}
      {/* ========================================================================= */}
      <div 
        data-ui-control="true"
        className="absolute bottom-3 sm:bottom-4 inset-x-0 z-40 px-2 sm:px-4 flex justify-center pointer-events-none select-none"
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'max(8px, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(8px, env(safe-area-inset-right, 0px))',
        }}
      >
        <div
          data-ui-control="true"
          className={`pointer-events-auto p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl flex items-center justify-between gap-2 max-w-full overflow-x-auto no-scrollbar ${
            isDarkMode 
              ? 'ui-3d-dock-dark text-white' 
              : 'ui-3d-dock text-slate-900'
          }`}
        >
          {/* 1. LEFT THUMB: PREVIOUS STEP / PREVIOUS SLIDE (3D TACTILE BUTTON) */}
          <button
            type="button"
            data-ui-control="true"
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (isProtocolMode && hasPrevProduct) {
                returnToPrevProductInProtocol();
              } else if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isProtocolMode && hasPrevProduct) {
                returnToPrevProductInProtocol();
              } else if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1);
              }
            }}
            disabled={!hasPrevProduct && currentSlideIndex === 0}
            className={`min-h-[48px] px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl flex items-center gap-2 text-left flex-shrink-0 ui-3d-btn-secondary cursor-pointer ${
              !hasPrevProduct && currentSlideIndex === 0
                ? 'opacity-30 border-transparent text-slate-400 cursor-not-allowed pointer-events-none'
                : ''
            }`}
            style={{ touchAction: 'manipulation' }}
            title={
              isProtocolMode && hasPrevProduct
                ? `Previous Step: ${prevProduct?.shortName || prevProduct?.name}`
                : 'Previous Slide (Swipe Right)'
            }
          >
            <ChevronLeft className="w-5 h-5 flex-shrink-0 text-[#0B431E] dark:text-emerald-400 stroke-[2.5]" />
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-black leading-tight text-slate-900 dark:text-white">
                {isProtocolMode ? 'Prev Step' : 'Prev Slide'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold truncate max-w-[80px] sm:max-w-[110px] leading-tight">
                {isProtocolMode && hasPrevProduct
                  ? `Step ${currentProductInProtocolIndex}: ${prevProduct?.shortName || prevProduct?.name}`
                  : `Slide ${Math.max(1, currentSlideIndex)}/${slides.length}`}
              </span>
            </div>
          </button>

          {/* 2. CENTER SECTION: STEP CHIPS, SLIDE DOTS, OMNI-MATRIX, AND TOOLS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar">
            {/* Protocol Step Chips (Instant 1-Tap Navigation across all steps in the protocol) */}
            {isProtocolMode && (
              <div className="flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-inner">
                {protocolProducts.map((p, idx) => {
                  const isCurrentStep = idx === currentProductInProtocolIndex;
                  const isDone = idx < currentProductInProtocolIndex;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        switchToProtocolProduct(idx, 0);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        switchToProtocolProduct(idx, 0);
                      }}
                      className={`min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isCurrentStep
                          ? 'ui-3d-pill-active ring-2 ring-emerald-400'
                          : isDone
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200 hover:bg-emerald-200'
                            : 'ui-3d-btn-secondary text-slate-700'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                      title={`Jump directly to Step ${idx + 1}: ${p.name}`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isCurrentStep ? 'bg-white text-[#0B431E]' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </span>
                      <span className="truncate max-w-[70px] sm:max-w-[110px]">{p.shortName || p.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Slide Progress Dots (Tablet-friendly larger touch pills) */}
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 shadow-inner">
              <span className="text-[11px] font-mono font-extrabold text-slate-600 dark:text-slate-300 mr-1 whitespace-nowrap">
                {currentSlideIndex + 1}/{slides.length}
              </span>
              {slides.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    goToSlide(idx);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  className="p-1.5 flex items-center justify-center cursor-pointer"
                  style={{ touchAction: 'manipulation' }}
                  title={getSlideStepLabel(idx, slides.length)}
                >
                  <span
                    className={`h-2.5 transition-all rounded-full block ${
                      idx === currentSlideIndex
                        ? 'w-5 bg-[#0B431E] ring-1 ring-emerald-400 shadow-sm'
                        : idx < currentSlideIndex
                          ? 'w-2.5 bg-emerald-600'
                          : 'w-2 bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* ⚡ 1.5s Omni-Matrix Button (3D Amber Physical Button) */}
            <button
              type="button"
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveDrawer('matrix');
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDrawer('matrix');
              }}
              className="min-h-[48px] px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl ui-3d-btn-amber text-xs font-black flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              style={{ touchAction: 'manipulation' }}
              title="1.5s Omni-Matrix (Jump to any of 16 products)"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-current flex-shrink-0" />
              <span>Omni-Matrix (16)</span>
            </button>

            {/* Clinical Evidence Drawer Button (3D Tactile Button) */}
            <button
              type="button"
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveDrawer((prev) => prev === 'references' ? null : 'references');
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveDrawer((prev) => prev === 'references' ? null : 'references');
              }}
              className={`min-h-[48px] px-3 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDrawer === 'references'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-2 ring-purple-300'
                  : 'ui-3d-btn-secondary text-[#0B431E]'
              }`}
              style={{ touchAction: 'manipulation' }}
              title="Published Clinical Studies & Trials"
            >
              <BookOpen className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="hidden xl:inline">Evidence</span>
            </button>

            {/* Toggle Full Top Toolbar (Doctor Focus / Tools) */}
            <button
              type="button"
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowToolbars((prev) => !prev);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowToolbars((prev) => !prev);
              }}
              className={`min-h-[48px] px-3 py-2 rounded-xl sm:rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                showToolbars
                  ? 'ui-3d-btn-primary'
                  : 'ui-3d-btn-secondary text-slate-700'
              }`}
              style={{ touchAction: 'manipulation' }}
              title="Toggle Top Controls (Laser, Spotlight, Zoom, Timer)"
            >
              {showToolbars ? <EyeOff className="w-4 h-4 text-emerald-300" /> : <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
              <span className="hidden 2xl:inline">{showToolbars ? 'Hide Top Tools' : 'Top Tools'}</span>
            </button>

            {/* Quick Exit / Back to 3D Body Button (Always Reachable in Thumb Zone) */}
            <button
              type="button"
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onBackToAnatomy) {
                  onBackToAnatomy();
                } else {
                  onClose();
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onBackToAnatomy) {
                  onBackToAnatomy();
                } else {
                  onClose();
                }
              }}
              className={`min-h-[48px] px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs font-black flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 shadow-sm ${
                onBackToAnatomy
                  ? 'bg-[#0B1120] text-teal-300 border-2 border-teal-400/70'
                  : 'ui-3d-btn-secondary text-slate-700 hover:text-red-700'
              }`}
              style={{ touchAction: 'manipulation' }}
              title={onBackToAnatomy ? 'Return to 3D Body Protocol' : 'Exit Detailing & Return to Portfolio (Esc)'}
            >
              {onBackToAnatomy ? (
                <>
                  <ChevronLeft className="w-4 h-4 text-teal-300 stroke-[3] flex-shrink-0" />
                  <span>3D Body</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Exit</span>
                </>
              )}
            </button>
          </div>

          {/* 3. RIGHT THUMB: NEXT STEP / NEXT SLIDE / COMPLETE (3D PRIMARY BUTTON) */}
          <button
            type="button"
            data-ui-control="true"
            onTouchEnd={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (isProtocolMode && hasNextProduct) {
                advanceToNextProductInProtocol();
              } else if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
              } else if (isProtocolMode) {
                setProtocolToast('Protocol Detail Complete! All protocol therapies reviewed.');
                setTimeout(() => setProtocolToast(null), 3500);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isProtocolMode && hasNextProduct) {
                advanceToNextProductInProtocol();
              } else if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
              } else if (isProtocolMode) {
                setProtocolToast('Protocol Detail Complete! All protocol therapies reviewed.');
                setTimeout(() => setProtocolToast(null), 3500);
              }
            }}
            className="min-h-[48px] px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl flex items-center gap-2 text-right flex-shrink-0 ui-3d-btn-primary cursor-pointer"
            style={{ touchAction: 'manipulation' }}
            title={
              isProtocolMode && hasNextProduct
                ? `Next Step: ${nextProduct?.shortName || nextProduct?.name}`
                : currentSlideIndex < slides.length - 1
                  ? 'Next Slide (Swipe Left)'
                  : 'Protocol Detailing Complete'
            }
          >
            <div className="flex flex-col items-end">
              <span className="text-[11px] sm:text-xs font-black leading-tight text-white">
                {isProtocolMode && hasNextProduct
                  ? 'Next Step'
                  : currentSlideIndex < slides.length - 1
                    ? 'Next Slide'
                    : 'Complete ✓'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-emerald-200 font-bold truncate max-w-[80px] sm:max-w-[110px] leading-tight">
                {isProtocolMode && hasNextProduct
                  ? `Step ${currentProductInProtocolIndex + 2}: ${nextProduct?.shortName || nextProduct?.name}`
                  : currentSlideIndex < slides.length - 1
                    ? `Slide ${currentSlideIndex + 2}/${slides.length}`
                    : 'All Reviewed'}
              </span>
            </div>
            {(!hasNextProduct && currentSlideIndex === slides.length - 1) ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-white stroke-[2.5]" />
            ) : (
              <ChevronRight className="w-5 h-5 flex-shrink-0 text-white stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SLIDE-OVER DRAWER: 1.5-SECOND OMNI-MATRIX (ALWAYS WORKS 100% RELIABLY!) */}
      {/* ========================================================================= */}
      {activeDrawer === 'matrix' && (
        <div 
          className="absolute inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300"
          style={{ 
            paddingTop: 'max(0px, env(safe-area-inset-top, 0px))', 
            paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))' 
          }}
        >
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
        <div 
          className="absolute inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300"
          style={{ 
            paddingTop: 'max(0px, env(safe-area-inset-top, 0px))', 
            paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))' 
          }}
        >
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
