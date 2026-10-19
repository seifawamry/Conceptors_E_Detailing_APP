import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  SunMedium, 
  Layers, 
  Share2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Info,
  Pill,
  BookOpen,
  Star,
  Zap,
  Stethoscope,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

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
  const [zoomLevel, setZoomLevel] = useState(1); // 1 or 2
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [pointerPos, setPointerPos] = useState({ x: -100, y: -100 });
  const [showProtocolDrawer, setShowProtocolDrawer] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [showClusterDock, setShowClusterDock] = useState(true);
  const [slideStartTime, setSlideStartTime] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const slides = product?.slides || [];
  const currentSlideUrl = slides[currentSlideIndex] || '';

  // Auto-request full screen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        // Fallback for browsers that require explicit direct user gesture
        console.log('Fullscreen auto-request note:', err?.message || err);
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
  }, [product?.id]);

  // Log time spent on slide when switching slides or closing
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

  // Track slide transition
  const goToSlide = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= slides.length) return;
    recordCurrentSlideDuration();
    setSlideStartTime(Date.now());
    setCurrentSlideIndex(newIndex);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [slides.length, recordCurrentSlideDuration]);

  // Auto-hide toolbar logic (3.5 seconds inactivity)
  const resetInactivityTimer = useCallback(() => {
    setShowToolbars(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      // Don't auto hide if a drawer is open or interactive modes active
      if (!showProtocolDrawer && !showInfoDrawer && !isSpotlightActive && !isLaserActive) {
        setShowToolbars(false);
      }
    }, 3800);
  }, [showProtocolDrawer, showInfoDrawer, isSpotlightActive, isLaserActive]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      recordCurrentSlideDuration();
    };
  }, [resetInactivityTimer, recordCurrentSlideDuration]);

  // Pointer movement tracking for laser and spotlight
  const handlePointerMove = (e) => {
    resetInactivityTimer();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointerPos({ x, y });

    // Handle Pan when zoomed in
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
      // Pan when zoomed
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

    // Detect horizontal swipe on tablet: diffX > 40px, more horizontal than vertical, within 600ms
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.3 && elapsedTime < 650) {
      if (diffX < 0) {
        // Swiped Left -> Advance to next slide
        goToSlide(currentSlideIndex + 1);
      } else {
        // Swiped Right -> Go to previous slide
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
        onClose();
      } else if (e.key === 'l' || e.key === 'L') {
        setIsLaserActive((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        setIsSpotlightActive((prev) => !prev);
      } else if (e.key === 'z' || e.key === 'Z') {
        setZoomLevel((prev) => (prev === 1 ? 2 : 1));
        setPanPosition({ x: 0, y: 0 });
      } else if (e.key === 'h' || e.key === 'H') {
        setShowToolbars((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, resetInactivityTimer, onClose, goToSlide]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const brandAccent = product?.brandAccent || '#10B981';
  const relatedProducts = (product?.relatedProductIds || [])
    .map((id) => allProductsMap[id])
    .filter(Boolean);

  // Compute Therapeutic Cluster Siblings for 1-Tap Quick Switcher Dock
  const clusterSiblings = useMemo(() => {
    if (!product) return [];
    const currentClusterId = product.clusterId;
    const currentClusterIds = product.clusterIds || (currentClusterId ? [currentClusterId] : []);
    
    const all = Object.values(allProductsMap);
    const siblings = all.filter((p) => {
      const pClusters = p.clusterIds || (p.clusterId ? [p.clusterId] : []);
      const shareCluster = pClusters.some((c) => currentClusterIds.includes(c));
      const isRelated = (product.relatedProductIds || []).includes(p.id);
      return shareCluster || isRelated;
    });

    // Ensure current product is first in cluster dock or clearly positioned
    return siblings.sort((a, b) => {
      if (a.id === product.id) return -1;
      if (b.id === product.id) return 1;
      if (a.isTopTier && !b.isTopTier) return -1;
      if (!a.isTopTier && b.isTopTier) return 1;
      return 0;
    });
  }, [product, allProductsMap]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-[#090D16] select-none overflow-hidden flex flex-col justify-between"
      style={{ touchAction: zoomLevel > 1 ? 'none' : 'auto' }}
    >
      {/* 1. TOP HEADER TOOLBAR */}
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
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/15 text-white backdrop-blur-md transition-colors flex items-center gap-2 text-xs font-bold active:scale-95"
            title="Exit Cinema Mode (Esc)"
          >
            <X className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Exit Cinema</span>
          </button>

          <div className="min-h-[44px] px-3.5 py-2 rounded-xl bg-black/70 border border-white/15 backdrop-blur-md flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: brandAccent }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[160px] sm:max-w-none">
                  {product?.name}
                </span>
                {product?.isTopTier && (
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                )}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 hidden md:block">
                {product?.clusterName || product?.specialty}
              </div>
            </div>
          </div>

          {/* Virulys Special Twice Daily Badge */}
          {product?.id === 'virulys' && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/90 border border-blue-400/50 text-blue-200 text-xs font-bold shadow-glow-blue animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>TWICE A DAY RECOMMENDED DOSING</span>
            </div>
          )}
        </div>

        {/* Right: Doctor Engagement Tools & Fullscreen (Tablet 44px Touch Targets) */}
        <div className="flex items-center gap-2">
          {/* Red Laser Pointer */}
          <button
            onClick={() => setIsLaserActive((prev) => !prev)}
            title="Toggle Red Laser Pointer (Key: L)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 ${
              isLaserActive
                ? 'bg-rose-600 text-white border-rose-400 shadow-glow-magenta'
                : 'bg-black/70 text-slate-300 border-white/15 hover:bg-white/10'
            }`}
          >
            <Crosshair className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Laser</span>
          </button>

          {/* 60% Spotlight Dimmer */}
          <button
            onClick={() => setIsSpotlightActive((prev) => !prev)}
            title="Toggle 60% Spotlight Dimmer (Key: S)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 ${
              isSpotlightActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-glow-gold'
                : 'bg-black/70 text-slate-300 border-white/15 hover:bg-white/10'
            }`}
          >
            <SunMedium className="w-4 h-4" />
            <span className="hidden sm:inline">Spotlight</span>
          </button>

          {/* 2x Interactive Zoom */}
          <button
            onClick={() => {
              setZoomLevel((prev) => (prev === 1 ? 2 : 1));
              setPanPosition({ x: 0, y: 0 });
            }}
            title="Toggle 2x Interactive Zoom (Key: Z)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 ${
              zoomLevel > 1
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-glow-emerald'
                : 'bg-black/70 text-slate-300 border-white/15 hover:bg-white/10'
            }`}
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            <span className="hidden sm:inline">{zoomLevel}x</span>
          </button>

          {/* Recommended Protocols Drawer Button */}
          {relatedProducts.length > 0 && (
            <button
              onClick={() => setShowProtocolDrawer((prev) => !prev)}
              className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 ${
                showProtocolDrawer
                  ? 'bg-indigo-600 text-white border-indigo-400'
                  : 'bg-black/70 text-indigo-300 border-indigo-500/30 hover:bg-indigo-950/40'
              }`}
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Protocols ({relatedProducts.length})</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-black/70 hover:bg-black/90 border border-white/15 text-slate-300 transition-colors flex items-center justify-center active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN PRESENTATION VIEWPORT (16:9 Cinema Canvas with Touch Swipe) */}
      <div 
        className="relative flex-1 flex items-center justify-center w-full h-full overflow-hidden"
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
              className="max-h-[86vh] max-w-[96vw] object-contain shadow-2xl rounded-xl transition-all"
              draggable={false}
            />
          </div>
        ) : (
          <div className="text-slate-500 text-sm">No slide loaded</div>
        )}

        {/* 60% SPOTLIGHT DIMMER OVERLAY */}
        {isSpotlightActive && (
          <div
            className="spotlight-mask"
            style={{
              background: `radial-gradient(circle 170px at ${pointerPos.x}px ${pointerPos.y}px, rgba(0,0,0,0) 0%, rgba(9,13,22,0.85) 100%)`,
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

        {/* Touch-Friendly iPad Side Paddle Arrows (Min 52px Hit Area) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToSlide(currentSlideIndex - 1);
          }}
          disabled={currentSlideIndex === 0}
          title="Previous Slide (Swipe Right / Left Arrow)"
          className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all flex items-center justify-center active:scale-95 shadow-xl ${
            currentSlideIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
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
          className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-all flex items-center justify-center active:scale-95 shadow-xl ${
            currentSlideIndex === slides.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'
          }`}
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* 3. BOTTOM SLIDE FILMSTRIP & CLUSTER QUICK SWITCHER DOCK */}
      <div
        className={`absolute bottom-0 inset-x-0 z-40 transition-all duration-300 pointer-events-auto p-3 sm:p-4 bg-gradient-to-t from-[#090D16] via-[#090D16]/95 to-transparent ${
          showToolbars
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2.5">
          
          {/* A. CLUSTER QUICK SWITCHER DOCK (1-Tap Sibling Jumping) */}
          {clusterSiblings.length > 0 && (
            <div className="w-full max-w-4xl p-2 rounded-2xl bg-black/75 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-2">
              
              {/* Cluster Name & Category Badge */}
              <div className="flex items-center gap-2 px-2 flex-shrink-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Clinical Cluster Dock
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-[220px]">
                    {product?.clusterName || product?.specialty}
                  </span>
                </div>
              </div>

              {/* Sibling Product Pills (Thumb Zone 1-Tap Switching) */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 no-scrollbar px-1">
                {clusterSiblings.map((sibling) => {
                  const isCurrent = sibling.id === product?.id;
                  const siblingAccent = sibling.brandAccent || '#10B981';
                  return (
                    <button
                      key={sibling.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCurrent) {
                          onSwitchProduct(sibling);
                        }
                      }}
                      className={`min-h-[38px] sm:min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 active:scale-95 ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-glow-emerald scale-[1.03]'
                          : 'bg-white/10 hover:bg-white/20 text-white border-white/15 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isCurrent ? '#090D16' : siblingAccent }}
                      />
                      <span>{sibling.shortName || sibling.name}</span>
                      {sibling.isTopTier && (
                        <Star className={`w-3 h-3 flex-shrink-0 ${isCurrent ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-400'}`} />
                      )}
                      {isCurrent && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/30 font-extrabold ml-0.5">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Omni-Matrix Quick Jump Shortcut */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenQuickJump();
                  }}
                  title="Open Full 16-Product Matrix"
                  className="min-h-[38px] sm:min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>All (16)</span>
                </button>
              </div>
            </div>
          )}

          {/* B. SLIDE STATUS INDICATOR & CLINICAL SUMMARY BUTTON */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-300 bg-black/70 px-4 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
            <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
            <span className="text-white/20">•</span>
            <span className="text-emerald-400 font-mono">1920×1080 2x HD</span>
            <span className="text-white/20">•</span>
            <button 
              onClick={() => setShowInfoDrawer((prev) => !prev)}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Clinical Summary & Posology</span>
            </button>
          </div>

          {/* C. MINI THUMBNAILS FILMSTRIP (Tablet Touch Sizing) */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
            {slides.map((slideUrl, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  className={`relative flex-shrink-0 w-16 sm:w-20 md:w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'border-emerald-400 scale-105 shadow-glow-emerald'
                      : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <img
                    src={slideUrl}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 right-0 bg-black/85 text-[9px] font-bold px-1.5 py-0.5 rounded-tl text-white">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 4. RECOMMENDED PROTOCOLS / CROSS-SELL SIDE DRAWER */}
      {showProtocolDrawer && (
        <div className="absolute top-16 right-4 z-50 w-80 max-w-[90vw] glass-modal rounded-2xl p-4 shadow-2xl border border-indigo-500/30 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">Recommended Protocols</h4>
            </div>
            <button
              onClick={() => setShowProtocolDrawer(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-2 mb-3">
            Synergistic therapies recommended alongside <strong>{product?.name}</strong>:
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  setShowProtocolDrawer(false);
                  onSwitchProduct(rel);
                }}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-400/40 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rel.brandAccent || '#10B981' }}
                    />
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                      {rel.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {rel.headline}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CLINICAL INFORMATION DRAWER */}
      {showInfoDrawer && (
        <div className="absolute top-16 left-4 z-50 w-96 max-w-[90vw] glass-modal rounded-2xl p-5 shadow-2xl border border-white/15 animate-in fade-in slide-in-from-left-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">{product?.name} Summary</h4>
            </div>
            <button
              onClick={() => setShowInfoDrawer(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Posology & Protocol:</span>
              <p className="text-slate-200 mt-0.5 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                {product?.dosingProtocol}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Active Ingredients:</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                {product?.activeIngredients}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Key Clinical Indications:</span>
              <ul className="mt-1 space-y-1 text-slate-300">
                {product?.keyIndications?.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
