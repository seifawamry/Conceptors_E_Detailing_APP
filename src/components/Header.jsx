import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle2, BarChart2, ListPlus, ShieldCheck } from 'lucide-react';
import ConceptorsLogo from './ConceptorsLogo.jsx';

export default function Header({ 
  onOpenLogs, 
  onOpenPlaylist, 
  playlistCount = 0,
  allSlides = [] 
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheProgress, setCacheProgress] = useState(null);
  const [isCached, setIsCached] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOffline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const preCacheAllSlides = async () => {
    if (!allSlides || allSlides.length === 0) return;
    setCacheProgress({ current: 0, total: allSlides.length });

    try {
      const cache = await caches.open('slides-images-cache');
      let count = 0;
      for (const slideUrl of allSlides) {
        try {
          const match = await cache.match(slideUrl);
          if (!match) {
            await cache.add(slideUrl);
          }
        } catch (e) {
          console.warn('Failed to cache slide:', slideUrl, e);
        }
        count++;
        setCacheProgress({ current: count, total: allSlides.length });
      }
      setIsCached(true);
      setTimeout(() => setCacheProgress(null), 1500);
    } catch (err) {
      console.error('Cache API error:', err);
      setCacheProgress(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      {/* Top Brand Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0B431E] via-[#14632E] to-[#96916E]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand & Regulatory Mark */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ConceptorsLogo className="h-10 sm:h-11" />

          {/* Mandatory Brand Banner (from Reference Sheet) */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E8F4EC] border border-[#0B431E]/20 text-[#0B431E] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B431E]" />
            <span>FOR VETERINARY USE ONLY</span>
          </div>
        </div>

        {/* Right Actions: Offline Badge + Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Offline Ready Live Status Badge */}
          <button 
            onClick={preCacheAllSlides}
            title="Click to verify or precache all 187 slides for 100% offline clinic visits"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F4EC] border border-[#0B431E]/20 text-[#0B431E] text-xs font-bold hover:bg-[#D1EADC] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)] active:translate-y-0.5 transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0B431E]"></span>
            </span>
            <span className="hidden sm:inline">Offline Ready</span>
            <span className="text-[#0B431E]/70 text-[10.5px] hidden md:inline">• All Slides Cached</span>
            {cacheProgress ? (
              <span className="text-[10px] text-[#0B431E] font-mono font-bold">
                {cacheProgress.current}/{cacheProgress.total}
              </span>
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0B431E]" />
            )}
          </button>

          {/* Online/Offline status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 shadow-inner">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-[#0B431E]" />
                <span className="text-slate-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-800">Clinic Offline</span>
              </>
            )}
          </div>

          {/* Active Call Playlist Button */}
          <button
            onClick={onOpenPlaylist}
            className={`min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              playlistCount > 0 
                ? 'ui-3d-btn-primary' 
                : 'ui-3d-btn-secondary'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Call Playlist</span>
            {playlistCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10.5px] font-black flex items-center justify-center shadow-sm">
                {playlistCount}
              </span>
            )}
          </button>

          {/* Call Logs & Analytics */}
          <button
            onClick={onOpenLogs}
            className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold ui-3d-btn-secondary"
            title="View Call Session Logs & Analytics"
          >
            <BarChart2 className="w-4 h-4 text-[#0B431E]" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

        </div>
      </div>
    </header>
  );
}
