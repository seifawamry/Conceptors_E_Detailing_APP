import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, HardDriveDownload, CheckCircle2, BarChart2, ListPlus } from 'lucide-react';

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
    const handleOffline = () => setIsOnline(false);

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#090D16]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center font-black text-white text-xl shadow-glow-emerald border border-white/20">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                THE CONCEPTORS <span className="text-xs font-normal text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10 hidden sm:inline-block">ANIMAL HEALTH</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">Veterinary E-Detailing Suite • 16-Product Master Portfolio</p>
          </div>
        </div>

        {/* Right Actions: Offline Badge + Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Offline Ready Live Status Badge */}
          <div 
            onClick={preCacheAllSlides}
            title="Click to verify or precache all slides for 100% offline clinic visits"
            className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:border-emerald-400 transition-all shadow-glow-emerald/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden md:inline font-semibold">Offline Ready</span>
            <span className="text-slate-400 text-[10px] hidden lg:inline">• All Slides Cached</span>
            {cacheProgress ? (
              <span className="text-[10px] text-amber-300 font-mono">
                {cacheProgress.current}/{cacheProgress.total}
              </span>
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
            )}
          </div>

          {/* Online/Offline status icon indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300">Offline Mode</span>
              </>
            )}
          </div>

          {/* Active Call Playlist Button */}
          <button
            onClick={onOpenPlaylist}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              playlistCount > 0 
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald' 
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Call Playlist</span>
            {playlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center justify-center">
                {playlistCount}
              </span>
            )}
          </button>

          {/* Call Logs & Analytics */}
          <button
            onClick={onOpenLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20 transition-all"
            title="View Call Session Logs & Analytics"
          >
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Call Logs</span>
          </button>

        </div>
      </div>
    </header>
  );
}
