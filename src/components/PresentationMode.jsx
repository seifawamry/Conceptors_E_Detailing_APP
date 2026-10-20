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
  Moon
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
  const [slideStartTime, setSlideStartTime] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Default to Clinic Bright Mode (as requested by user for maximum data clarity)
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Auto-hide toolbar logic (3.8 seconds inactivity)
  const resetInactivityTimer = useCallback(() => {
    setShowToolbars(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      if (!showProtocolDrawer && !showInfoDrawer && !isSpotlightActive && !isLaserActive) {
        setShowToolbars(false);
      }
    }, 4000);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const brandAccent = product?.brandAccent || '#0B431E';
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
      className={`fixed inset-0 z-50 select-none overflow-hidden flex flex-col justify-between transition-colors duration-300 ${
        isDarkMode ? 'bg-[#090D16] text-white' : 'bg-[#F5F4F0] text-slate-900'
      }`}
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
            className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border backdrop-blur-md transition-colors flex items-center gap-2 text-xs font-extrabold active:scale-95 shadow-sm ${
              isDarkMode 
                ? 'bg-black/70 hover:bg-black/90 border-white/15 text-white' 
                : 'bg-white/95 hover:bg-white border-slate-200 text-slate-800'
            }`}
            title="Exit Cinema Mode (Esc)"
          >
            <X className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exit Presentation</span>
          </button>

          <div className={`min-h-[44px] px-3.5 py-2 rounded-xl border backdrop-blur-md flex items-center gap-2.5 shadow-sm ${
            isDarkMode 
              ? 'bg-black/70 border-white/15 text-white' 
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}>
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: brandAccent }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold truncate max-w-[160px] sm:max-w-none text-[#0B431E]">
                  {product?.name}
                </span>
                {product?.isTopTier && (
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-[10.5px] text-slate-500 line-clamp-1 hidden md:block font-medium">
                {product?.clusterName || product?.specialty}
              </div>
            </div>
          </div>

          {/* Virulys Special Twice Daily Badge */}
          {product?.id === 'virulys' && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>TWICE A DAY RECOMMENDED DOSING</span>
            </div>
          )}
        </div>

        {/* Right: Doctor Engagement Tools & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Clinic / Cinema Viewport Mode Toggle */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            title={isDarkMode ? "Switch to Clinic Light Mode (High Visibility)" : "Switch to Dark Cinema Mode"}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 border-slate-700'
                : 'bg-white/95 text-[#0B431E] border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0B431E]" />}
            <span className="hidden md:inline">{isDarkMode ? 'Cinema' : 'Clinic Light'}</span>
          </button>

          {/* Red Laser Pointer */}
          <button
            onClick={() => setIsLaserActive((prev) => !prev)}
            title="Toggle Red Laser Pointer (Key: L)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isLaserActive
                ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                : isDarkMode
                  ? 'bg-black/70 text-slate-300 border-white/15 hover:bg-white/10'
                  : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Crosshair className={`w-4 h-4 ${isLaserActive ? 'text-white' : 'text-rose-500'}`} />
            <span className="hidden sm:inline">Laser</span>
          </button>

          {/* 60% Spotlight Dimmer */}
          <button
            onClick={() => setIsSpotlightActive((prev) => !prev)}
            title="Toggle 60% Spotlight Dimmer (Key: S)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              isSpotlightActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : isDarkMode
                  ? 'bg-black/70 text-slate-300 border-white/15 hover:bg-white/10'
                  : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SunMedium className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Spotlight</span>
          </button>

          {/* 2x Interactive Zoom */}
          <button
            onClick={() => {
              setZoomLevel((prev) => (prev === 1 ? 2 : 1));
              setPanPosition({ x: 0, y: 0 });
            }}
            title="Toggle 2x Interactive Zoom (Key: Z)"
            className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
              zoomLevel > 1
                ? 'bg-[#0B431E] text-white border-[#0B431E]'
                : isDarkMode
                  ? 'bg-black/70 text-slate-300 border-white/15 hover:bg-white/10'
                  : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            <span className="hidden sm:inline">{zoomLevel}x</span>
          </button>

          {/* Recommended Protocols Drawer Button */}
          {relatedProducts.length > 0 && (
            <button
              onClick={() => setShowProtocolDrawer((prev) => !prev)}
              className={`min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all active:scale-95 shadow-sm ${
                showProtocolDrawer
                  ? 'bg-[#0B431E] text-white border-[#0B431E]'
                  : isDarkMode
                    ? 'bg-black/70 text-indigo-300 border-indigo-500/30'
                    : 'bg-white/95 text-[#0B431E] border-[#0B431E]/20 hover:bg-[#E8F4EC]'
              }`}
            >
              <Share2 className="w-4 h-4 text-[#0B431E]" />
              <span className="hidden md:inline">Protocols ({relatedProducts.length})</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border transition-colors flex items-center justify-center active:scale-95 shadow-sm ${
              isDarkMode 
                ? 'bg-black/70 hover:bg-black/90 border-white/15 text-slate-300' 
                : 'bg-white/95 hover:bg-white border-slate-200 text-slate-700'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#0B431E]" /> : <Maximize2 className="w-4 h-4" />}
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
              className="max-h-[85vh] max-w-[96vw] object-contain shadow-2xl rounded-2xl transition-all border border-slate-900/10"
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
              ? 'bg-black/70 hover:bg-black/90 border-white/20 text-white' 
              : 'bg-white/95 hover:bg-white border-slate-200 text-slate-800'
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
              ? 'bg-black/70 hover:bg-black/90 border-white/20 text-white' 
              : 'bg-white/95 hover:bg-white border-slate-200 text-slate-800'
          }`}
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* 3. BOTTOM SLIDE FILMSTRIP & CLUSTER QUICK SWITCHER DOCK */}
      <div
        className={`absolute bottom-0 inset-x-0 z-40 transition-all duration-300 pointer-events-auto p-3 sm:p-4 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-[#090D16] via-[#090D16]/95 to-transparent' 
            : 'bg-gradient-to-t from-[#F5F4F0] via-[#F5F4F0]/95 to-transparent'
        } ${
          showToolbars
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2.5">
          
          {/* A. CLUSTER QUICK SWITCHER DOCK (1-Tap Sibling Jumping) */}
          {clusterSiblings.length > 0 && (
            <div className={`w-full max-w-4xl p-2 rounded-2xl border backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2 ${
              isDarkMode 
                ? 'bg-black/80 border-white/15' 
                : 'bg-white/95 border-slate-200'
            }`}>
              
              {/* Cluster Name & Category Badge */}
              <div className="flex items-center gap-2 px-2 flex-shrink-0">
                <div className="w-7 h-7 rounded-lg bg-[#E8F4EC] border border-[#0B431E]/20 flex items-center justify-center text-[#0B431E]">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0B431E]">
                    Cluster Dock
                  </span>
                  <span className="text-xs font-bold truncate max-w-[180px] sm:max-w-[220px]">
                    {product?.clusterName || product?.specialty}
                  </span>
                </div>
              </div>

              {/* Sibling Product Pills (Thumb Zone 1-Tap Switching) */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 no-scrollbar px-1">
                {clusterSiblings.map((sibling) => {
                  const isCurrent = sibling.id === product?.id;
                  const siblingAccent = sibling.brandAccent || '#0B431E';
                  return (
                    <button
                      key={sibling.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCurrent) {
                          onSwitchProduct(sibling);
                        }
                      }}
                      className={`min-h-[38px] sm:min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 active:scale-95 shadow-sm ${
                        isCurrent
                          ? 'bg-[#0B431E] text-white border-[#0B431E] shadow scale-[1.03]'
                          : isDarkMode
                            ? 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                            : 'bg-[#F5F4F0] hover:bg-[#E8F4EC] text-slate-800 border-slate-200'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isCurrent ? '#FFFFFF' : siblingAccent }}
                      />
                      <span>{sibling.shortName || sibling.name}</span>
                      {sibling.isTopTier && (
                        <Star className={`w-3 h-3 flex-shrink-0 ${isCurrent ? 'fill-amber-300 text-amber-300' : 'fill-[#96916E] text-[#96916E]'}`} />
                      )}
                      {isCurrent && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/20 font-extrabold ml-0.5">
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
                  className="min-h-[38px] sm:min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap bg-[#96916E] hover:bg-[#7D7856] text-white border border-[#96916E] flex items-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>All (16)</span>
                </button>
              </div>
            </div>
          )}

          {/* B. SLIDE STATUS INDICATOR & CLINICAL SUMMARY BUTTON */}
          <div className={`flex items-center gap-3 text-xs font-semibold px-4 py-1.5 rounded-full border backdrop-blur-md shadow-sm ${
            isDarkMode 
              ? 'bg-black/70 border-white/15 text-slate-300' 
              : 'bg-white/95 border-slate-200 text-slate-700'
          }`}>
            <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
            <span className="opacity-40">•</span>
            <span className="text-[#0B431E] font-bold font-mono">1920×1080 2x HD</span>
            <span className="opacity-40">•</span>
            <button 
              onClick={() => setShowInfoDrawer((prev) => !prev)}
              className="text-[#0B431E] hover:underline flex items-center gap-1 font-extrabold transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-[#96916E]" />
              <span>Clinical Summary & Posology</span>
            </button>
          </div>

          {/* C. MINI THUMBNAILS FILMSTRIP */}
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
                  className={`relative flex-shrink-0 w-16 sm:w-20 md:w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 shadow-sm ${
                    isActive
                      ? 'border-[#0B431E] scale-105 shadow-md ring-2 ring-[#0B431E]/30'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400 bg-white'
                  }`}
                >
                  <img
                    src={slideUrl}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-0 right-0 bg-[#0B431E] text-[9px] font-bold px-1.5 py-0.5 rounded-tl text-white">
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
        <div className="absolute top-16 right-4 z-50 w-84 max-w-[92vw] bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#0B431E]" />
              <h4 className="text-sm font-extrabold text-[#0B431E]">Recommended Protocols</h4>
            </div>
            <button
              onClick={() => setShowProtocolDrawer(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-2.5 mb-3 leading-relaxed">
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
                className="p-3 rounded-2xl bg-[#F5F4F0] hover:bg-[#E8F4EC] border border-slate-200 hover:border-[#0B431E]/40 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rel.brandAccent || '#0B431E' }}
                    />
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#0B431E]">
                      {rel.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {rel.headline}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B431E] group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CLINICAL INFORMATION DRAWER (Brand Sheet High Legibility) */}
      {showInfoDrawer && (
        <div className="absolute top-16 left-4 z-50 w-96 max-w-[92vw] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-left-4 duration-200 text-slate-900">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#0B431E]" />
              <h4 className="text-base font-extrabold text-[#0B431E]">{product?.name} Summary</h4>
            </div>
            <button
              onClick={() => setShowInfoDrawer(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            <div>
              <span className="font-extrabold text-[#0B431E] uppercase tracking-wider text-[10px]">Posology & Protocol:</span>
              <p className="text-slate-800 mt-1 leading-relaxed bg-[#F5F4F0] p-3 rounded-xl border border-slate-200 font-medium">
                {product?.dosingProtocol}
              </p>
            </div>

            <div>
              <span className="font-extrabold text-[#0B431E] uppercase tracking-wider text-[10px]">Active Ingredients:</span>
              <p className="text-slate-700 mt-1 leading-relaxed font-medium">
                {product?.activeIngredients}
              </p>
            </div>

            <div>
              <span className="font-extrabold text-[#0B431E] uppercase tracking-wider text-[10px]">Key Clinical Indications:</span>
              <ul className="mt-1 space-y-1.5 text-slate-700">
                {product?.keyIndications?.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#0B431E] font-bold text-sm leading-none">•</span>
                    <span className="font-medium">{ind}</span>
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
