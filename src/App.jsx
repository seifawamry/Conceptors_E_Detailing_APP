import React, { useState, useEffect, useMemo, useCallback } from 'react';
import catalogData from './data/catalog.json';
import Header from './components/Header.jsx';
import ProductCard from './components/ProductCard.jsx';
import CallFlows from './components/CallFlows.jsx';
import PresentationMode from './components/PresentationMode.jsx';
import QuickJumpMatrix from './components/QuickJumpMatrix.jsx';
import CallLogsModal from './components/CallLogsModal.jsx';
import PlaylistDrawer from './components/PlaylistDrawer.jsx';
import { 
  Star, 
  Search, 
  Filter, 
  Sparkles, 
  Play, 
  Zap, 
  Layers, 
  ListPlus, 
  CheckCircle2, 
  Building2,
  Stethoscope
} from 'lucide-react';

export default function App() {
  // All products flattened
  const allProducts = useMemo(() => {
    const list = [];
    catalogData.companies.forEach((comp) => {
      comp.products.forEach((prod) => {
        list.push({
          ...prod,
          brandAccent: comp.brandAccent,
          brandAccentLight: comp.brandAccentLight,
        });
      });
    });
    return list;
  }, []);

  // Map for fast lookups
  const allProductsMap = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [allProducts]);

  // Top 10 Core Focus Flagships
  const topTierProducts = useMemo(() => {
    return allProducts.filter((p) => p.isTopTier);
  }, [allProducts]);

  // All slide URLs for offline pre-warming
  const allSlideUrls = useMemo(() => {
    const urls = [];
    allProducts.forEach((p) => {
      (p.slides || []).forEach((s) => {
        if (!urls.includes(s)) urls.push(s);
      });
    });
    return urls;
  }, [allProducts]);

  // State
  // Default active tab: "top-tier" (⭐ Top 10 Core Focus) as requested!
  const [activeTab, setActiveTab] = useState('top-tier');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Presentation & Playlist
  const [activePresentationProduct, setActivePresentationProduct] = useState(null);
  const [callPlaylist, setCallPlaylist] = useState([]);
  const [isPlaylistDrawerOpen, setIsPlaylistDrawerOpen] = useState(false);
  const [isQuickJumpOpen, setIsQuickJumpOpen] = useState(false);
  const [isCallLogsOpen, setIsCallLogsOpen] = useState(false);

  // Call Logs telemetry stored in localStorage
  const [callLogs, setCallLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('conceptors_call_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist call logs
  useEffect(() => {
    try {
      localStorage.setItem('conceptors_call_logs', JSON.stringify(callLogs));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [callLogs]);

  // Record slide view
  const handleRecordSlideView = useCallback((record) => {
    setCallLogs((prev) => [
      {
        ...record,
        timestamp: new Date().toISOString(),
      },
      ...prev.slice(0, 500),
    ]);
  }, []);

  // Clear call logs
  const handleClearLogs = () => {
    setCallLogs([]);
    localStorage.removeItem('conceptors_call_logs');
  };

  // Playlist management
  const togglePlaylist = (product) => {
    setCallPlaylist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromPlaylist = (productId) => {
    setCallPlaylist((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearPlaylist = () => setCallPlaylist([]);

  const loadTopTierCall = () => {
    setCallPlaylist([...topTierProducts]);
    setIsPlaylistDrawerOpen(true);
  };

  const startPlaylistCall = () => {
    if (callPlaylist.length > 0) {
      setActivePresentationProduct(callPlaylist[0]);
    }
  };

  // Launch a pre-built clinical flow
  const handleLaunchFlow = (flow) => {
    const flowProducts = flow.productIds
      .map((id) => allProductsMap[id])
      .filter(Boolean);

    if (flowProducts.length > 0) {
      setCallPlaylist(flowProducts);
      setActivePresentationProduct(flowProducts[0]);
    }
  };

  // Unique specialties (extracts from multi-specialty arrays such as Virulys)
  const specialties = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => {
      if (Array.isArray(p.specialties)) {
        p.specialties.forEach((s) => set.add(s));
      } else if (p.specialty) {
        set.add(p.specialty);
      }
    });
    return Array.from(set).sort();
  }, [allProducts]);

  // Filtered and Sorted Products: Top-Tier are sorted first automatically
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Tab Filter
        if (activeTab === 'top-tier') {
          if (!p.isTopTier) return false;
        } else if (activeTab === 'catalysis') {
          if (p.companyId !== 'catalysis') return false;
        } else if (activeTab === 'bard') {
          if (p.companyId !== 'bard') return false;
        } else if (activeTab === 'vitasignia') {
          if (p.companyId !== 'vitasignia') return false;
        } else if (activeTab === 'ringbio') {
          if (p.companyId !== 'ringbio') return false;
        }

        // Specialty Filter (Supports dual-specialties e.g. Virulys in both Respiratory & URI and Viral & Immunity)
        if (selectedSpecialty !== 'ALL') {
          const matchSpecialty = Array.isArray(p.specialties)
            ? p.specialties.includes(selectedSpecialty)
            : p.specialty === selectedSpecialty;
          if (!matchSpecialty) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCompany = p.company.toLowerCase().includes(q);
          const matchSpecialty = (p.specialty || '').toLowerCase().includes(q);
          const matchIngredients = (p.activeIngredients || '').toLowerCase().includes(q);
          const matchIndications = (p.keyIndications || []).some((ind) => ind.toLowerCase().includes(q));
          if (!matchName && !matchCompany && !matchSpecialty && !matchIngredients && !matchIndications) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort Top-Tier first automatically
        if (a.isTopTier && !b.isTopTier) return -1;
        if (!a.isTopTier && b.isTopTier) return 1;
        return 0;
      });
  }, [allProducts, activeTab, selectedSpecialty, searchQuery]);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white pb-20">
      
      {/* 1. APP HEADER */}
      <Header
        onOpenLogs={() => setIsCallLogsOpen(true)}
        onOpenPlaylist={() => setIsPlaylistDrawerOpen(true)}
        playlistCount={callPlaylist.length}
        allSlides={allSlideUrls}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* HERO BANNER & 1-TAP CALL BUILDER */}
        <div className="relative rounded-3xl p-6 sm:p-8 glass-panel mb-8 overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-r from-emerald-950/40 via-[#0D1322] to-amber-950/20">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Veterinary Omni-Detailing System</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Evidence-Based Veterinary Care & Rapid Diagnostics
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              16 clinical products across 4 principal portfolios. Equipped with cinema showroom detailing, laser pointers, and 100% offline clinic caching.
            </p>

            {/* 1-Tap Call Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={loadTopTierCall}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-glow-gold active:scale-[0.98]"
              >
                <Star className="w-4 h-4 fill-current" />
                <span>⭐ 1-Tap Load Top-Tier Call (10 Products)</span>
              </button>

              <button
                onClick={() => setIsQuickJumpOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Open 1.5s Omni-Matrix</span>
              </button>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />
        </div>

        {/* 3. 1-TAP PRE-BUILT CLINICAL CALL FLOWS */}
        <CallFlows
          callFlows={catalogData.callFlows}
          onLaunchFlow={handleLaunchFlow}
          allProductsMap={allProductsMap}
        />

        {/* 4. DASHBOARD FILTERS & SEARCH */}
        <div className="space-y-4 mb-6">
          
          {/* Top-Tier Focus and Company Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {/* ⭐ Top-Tier Focus (10) Default Active Tab */}
            <button
              onClick={() => setActiveTab('top-tier')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 border ${
                activeTab === 'top-tier'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-glow-gold scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-amber-300/90 border-amber-500/30 hover:border-amber-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'top-tier' ? 'fill-current text-slate-950' : 'fill-current text-amber-400'}`} />
              <span>⭐ Top-Tier Focus (10)</span>
            </button>

            {/* All Portfolio (16) */}
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Portfolio (16)</span>
            </button>

            {/* Catalysis */}
            <button
              onClick={() => setActiveTab('catalysis')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                activeTab === 'catalysis'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Catalysis (6)</span>
            </button>

            {/* B.A.R.D */}
            <button
              onClick={() => setActiveTab('bard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                activeTab === 'bard'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-glow-amber'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>B.A.R.D (5)</span>
            </button>

            {/* Vitasignia */}
            <button
              onClick={() => setActiveTab('vitasignia')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                activeTab === 'vitasignia'
                  ? 'bg-blue-500 text-white border-blue-400 shadow-glow-blue'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Vitasignia (1)</span>
            </button>

            {/* Ringbio */}
            <button
              onClick={() => setActiveTab('ringbio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                activeTab === 'ringbio'
                  ? 'bg-pink-500 text-white border-pink-400 shadow-glow-magenta'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              <span>Ringbio (4)</span>
            </button>
          </div>

          {/* Search Bar & Specialty Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, clinical indications, ingredients (e.g. 'parvo', 'arginine', 'stones')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Specialty Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedSpecialty('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSpecialty === 'ALL'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Specialties
              </button>
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSpecialty === spec
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. 16-PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/10 my-8">
            <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedSpecialty('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onStartPresentation={(p) => setActivePresentationProduct(p)}
                isInPlaylist={callPlaylist.some((item) => item.id === product.id)}
                onTogglePlaylist={togglePlaylist}
                onSelectRelated={(relatedId) => {
                  const target = allProductsMap[relatedId];
                  if (target) setActivePresentationProduct(target);
                }}
              />
            ))}
          </div>
        )}

      </main>

      {/* 6. PERSISTENT GLOBAL "QUICK-JUMP" COMMAND MATRIX (THUMB ZONE) */}
      <div className="fixed bottom-4 inset-x-0 z-40 flex items-center justify-center pointer-events-none">
        <button
          onClick={() => setIsQuickJumpOpen(true)}
          className="pointer-events-auto group flex items-center gap-2.5 px-5 py-3 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-amber-400/50 hover:border-amber-400 text-white shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-glow-gold/40"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-extrabold tracking-wide uppercase">
            1.5s Omni-Matrix
          </span>
          <span className="text-[10px] text-amber-300 font-mono bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
            Thumb Zone
          </span>
        </button>
      </div>

      {/* 7. CINEMA SHOWROOM PRESENTATION MODE */}
      {activePresentationProduct && (
        <PresentationMode
          product={activePresentationProduct}
          allProductsMap={allProductsMap}
          onClose={() => setActivePresentationProduct(null)}
          onSwitchProduct={(newProd) => setActivePresentationProduct(newProd)}
          onOpenQuickJump={() => setIsQuickJumpOpen(true)}
          onRecordSlideView={handleRecordSlideView}
        />
      )}

      {/* 8. QUICK-JUMP MATRIX MODAL */}
      <QuickJumpMatrix
        isOpen={isQuickJumpOpen}
        onClose={() => setIsQuickJumpOpen(false)}
        companies={catalogData.companies}
        topTierProducts={topTierProducts}
        onSelectProduct={(p) => {
          setActivePresentationProduct(p);
        }}
        activeProductId={activePresentationProduct?.id}
      />

      {/* 9. PLAYLIST DRAWER */}
      <PlaylistDrawer
        isOpen={isPlaylistDrawerOpen}
        onClose={() => setIsPlaylistDrawerOpen(false)}
        playlist={callPlaylist}
        onRemoveFromPlaylist={removeFromPlaylist}
        onClearPlaylist={clearPlaylist}
        onStartPlaylist={startPlaylistCall}
        onLoadTopTier={loadTopTierCall}
      />

      {/* 10. CALL LOGS & EXPORT MODAL */}
      <CallLogsModal
        isOpen={isCallLogsOpen}
        onClose={() => setIsCallLogsOpen(false)}
        callLogs={callLogs}
        onClearLogs={handleClearLogs}
      />

    </div>
  );
}
