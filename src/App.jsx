import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import catalogData from './data/catalog.json';
import Header from './components/Header.jsx';
import ProductCard from './components/ProductCard.jsx';
import CallFlows from './components/CallFlows.jsx';
import AnatomyExplorer from './components/AnatomyExplorer.jsx';
import PresentationMode from './components/PresentationMode.jsx';
import QuickJumpMatrix from './components/QuickJumpMatrix.jsx';
import CallLogsModal from './components/CallLogsModal.jsx';
import PlaylistDrawer from './components/PlaylistDrawer.jsx';
import ConceptorsLogo from './components/ConceptorsLogo.jsx';
import { enterFullscreenLandscape } from './utils/screenUtils.js';
import { 
  Star, 
  Search, 
  Sparkles, 
  Zap, 
  Layers, 
  Building2,
  Stethoscope,
  ShieldCheck,
  Crosshair
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
  // Default active tab: "top-tier" (⭐ Top 10 Core Focus)
  const [activeTab, setActiveTab] = useState('top-tier');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Presentation & Playlist
  const [activePresentationProduct, setActivePresentationProduct] = useState(null);
  const [activeProtocol, setActiveProtocol] = useState(null);
  const [openedFromAnatomy, setOpenedFromAnatomy] = useState(false);
  const [anatomyState, setAnatomyState] = useState({
    species: 'feline',
    zoneId: 'ocular-nasal-respiratory',
  });
  const anatomySectionRef = useRef(null);
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

  const launchTopTierCallNow = () => {
    enterFullscreenLandscape();
    setCallPlaylist([...topTierProducts]);
    const protocolObj = {
      id: 'top-tier-core-focus',
      title: '⭐ Top-Tier Core Focus Call (10 Products)',
      tagline: 'Flagship Veterinary Therapeutics & Diagnostics Across 3 Partner Portfolios',
      badge: 'Core Focus',
      accent: '#0B431E',
      category: 'Flagship Core Focus',
      clinicalRationale: 'Evidence-based multi-product detailing protocol covering Catalysis, B.A.R.D, and Vitasignia flagships.',
      steps: topTierProducts.map((p, idx) => ({
        step: idx + 1,
        role: p.specialty || 'Therapy',
        productId: p.id,
        label: p.shortName || p.name,
      })),
      productIds: topTierProducts.map((p) => p.id),
      products: topTierProducts,
      currentProductIndex: 0,
    };
    setActiveProtocol(protocolObj);
    setActivePresentationProduct(topTierProducts[0]);
  };

  const startPlaylistCall = () => {
    if (callPlaylist.length > 0) {
      enterFullscreenLandscape();
      const isTopTierCall = callPlaylist.length === 10 && callPlaylist.every((p) => p.isTopTier);
      const protocolObj = {
        id: isTopTierCall ? 'top-tier-core-focus' : 'custom-playlist',
        title: isTopTierCall ? '⭐ Top-Tier Core Focus Call (10 Products)' : 'Custom Call Playlist',
        tagline: isTopTierCall ? 'Evidence-Based Flagship Detail Journey' : `${callPlaylist.length} Prescribing Protocols`,
        badge: isTopTierCall ? 'Core Focus' : 'Playlist',
        accent: '#0B431E',
        category: 'Custom Clinical Playlist',
        clinicalRationale: isTopTierCall
          ? 'Comprehensive medical detailing of all 10 core focus flagship therapies across Catalysis, B.A.R.D, and Vitasignia.'
          : 'Curated custom presentation playlist for targeted veterinary clinical consultation.',
        steps: callPlaylist.map((p, idx) => ({
          step: idx + 1,
          role: p.specialty || 'Therapy',
          productId: p.id,
          label: p.shortName || p.name,
        })),
        productIds: callPlaylist.map((p) => p.id),
        products: callPlaylist,
        currentProductIndex: 0,
      };
      setActiveProtocol(protocolObj);
      setActivePresentationProduct(callPlaylist[0]);
      setIsPlaylistDrawerOpen(false);
    }
  };

  // Launch a pre-built clinical flow (optionally start directly at any step e.g. Step 2)
  const handleLaunchFlow = (flow, initialStepIndex = 0, fromAnatomy = true) => {
    enterFullscreenLandscape();
    const flowProducts = flow.productIds
      .map((id) => allProductsMap[id])
      .filter(Boolean);

    if (flowProducts.length > 0) {
      const safeIndex = Math.min(Math.max(0, initialStepIndex), flowProducts.length - 1);
      const protocolObj = {
        id: flow.id,
        title: flow.title,
        tagline: flow.tagline,
        category: flow.category,
        badge: flow.badge || 'Protocol',
        accent: flow.accent || '#0B431E',
        clinicalRationale: flow.clinicalRationale,
        targetIndications: flow.targetIndications,
        steps: flow.steps || flowProducts.map((p, idx) => ({
          step: idx + 1,
          role: 'Therapy',
          productId: p.id,
          label: p.shortName || p.name
        })),
        productIds: flow.productIds,
        products: flowProducts,
        currentProductIndex: safeIndex,
      };
      setOpenedFromAnatomy(fromAnatomy);
      setActiveProtocol(protocolObj);
      setCallPlaylist(flowProducts);
      setActivePresentationProduct(flowProducts[safeIndex]);
    }
  };

  // Scroll smoothly to 3D Anatomical Explorer
  const scrollToAnatomy = useCallback(() => {
    if (anatomySectionRef.current) {
      anatomySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Open a specific product from the 3D Anatomical Protocol Explorer
  const handleSelectProductFromAnatomy = useCallback((product, zone, species) => {
    enterFullscreenLandscape();
    setAnatomyState({
      species: species || 'feline',
      zoneId: zone.id,
    });
    const zoneProducts = zone.productIds
      .map((id) => allProductsMap[id])
      .filter(Boolean);
    const targetIdx = Math.max(0, zoneProducts.findIndex((p) => p.id === product.id));

    const protocolObj = {
      id: `anatomy-${zone.id}`,
      title: `3D Anatomy: ${zone.protocolTitle}`,
      tagline: `${zone.name} (${zone.anatomicalStructure || zone.organLabel || ''})`,
      category: zone.name,
      badge: `Zone ${zone.number} • 3D Protocol`,
      accent: '#14B8A6',
      clinicalRationale: zone.clinicalSummary,
      steps: zoneProducts.map((p, idx) => ({
        step: idx + 1,
        role: p.specialty || 'Therapy',
        productId: p.id,
        label: p.shortName || p.name,
      })),
      productIds: zone.productIds,
      products: zoneProducts,
      currentProductIndex: targetIdx,
    };

    setOpenedFromAnatomy(true);
    setActiveProtocol(protocolObj);
    setCallPlaylist(zoneProducts);
    setActivePresentationProduct(product);
  }, [allProductsMap]);

  // Launch full zone protocol sequentially from the 3D Anatomical Protocol Explorer
  const handleLaunchZoneProtocol = useCallback((zone, species) => {
    const firstProd = zone.productIds.map((id) => allProductsMap[id]).find(Boolean);
    if (firstProd) {
      handleSelectProductFromAnatomy(firstProd, zone, species);
    }
  }, [allProductsMap, handleSelectProductFromAnatomy]);

  // Return immediately from e-detailing slide deck back to 3D Body Protocol
  const handleBackToAnatomy = useCallback(() => {
    setActivePresentationProduct(null);
    setActiveProtocol(null);
    setOpenedFromAnatomy(false);
    setTimeout(() => {
      if (anatomySectionRef.current) {
        anatomySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  }, []);

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
    <div className="min-h-screen bg-[#FAF9F5] text-slate-900 flex flex-col justify-between selection:bg-[#0B431E] selection:text-white pb-24">
      
      {/* 1. APP HEADER */}
      <Header
        onOpenLogs={() => setIsCallLogsOpen(true)}
        onOpenPlaylist={() => setIsPlaylistDrawerOpen(true)}
        onToggleAnatomy={scrollToAnatomy}
        playlistCount={callPlaylist.length}
        allSlides={allSlideUrls}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* HERO BANNER & 1-TAP CALL BUILDER (Vet-Concept Clinical Aesthetic) */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#FAF9F5] to-[#E8F4EC] mb-8 overflow-hidden border border-slate-200/90 shadow-sm">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <ConceptorsLogo className="h-10 sm:h-12" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4EC] border border-[#0B431E]/20 text-[#0B431E] text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Veterinary Omni-Detailing System</span>
              </div>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B431E] tracking-tight leading-tight">
              Evidence-Based Veterinary Care & Rapid Diagnostics
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
              16 clinical products across 4 principal partner portfolios. Equipped with interactive 3D Anatomical Protocol Explorer, clinic light presentation mode, and 100% offline clinic caching.
            </p>

            {/* 1-Tap Call Actions (3D Spatial Tactile Buttons) */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={launchTopTierCallNow}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold ui-3d-btn-primary"
              >
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>⭐ 1-Tap Launch Top-Tier Call (10 Products)</span>
              </button>

              <button
                onClick={scrollToAnatomy}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold bg-[#0B1120] hover:bg-slate-900 text-teal-300 border border-teal-400/40 shadow-[0_6px_0_#020617,0_10px_20px_rgba(20,184,166,0.25)] active:translate-y-1 transition-all"
              >
                <Crosshair className="w-4 h-4 text-teal-400" />
                <span>🧬 3D Anatomy Protocol Explorer</span>
              </button>

              <button
                onClick={loadTopTierCall}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold ui-3d-btn-secondary"
              >
                <Layers className="w-4 h-4 text-[#0B431E]" />
                <span>Manage Playlist ({callPlaylist.length})</span>
              </button>

              <button
                onClick={() => setIsQuickJumpOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold ui-3d-btn-amber"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-current" />
                <span>Open 1.5s Omni-Matrix</span>
              </button>
            </div>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#0B431E]/5 to-transparent blur-2xl pointer-events-none" />
        </div>

        {/* 3. INTERACTIVE 3D ANATOMICAL CLINICAL PROTOCOL & EMBEDDED CALL FLOWS EXPLORER */}
        <div ref={anatomySectionRef} id="anatomy-explorer-section" className="scroll-mt-24">
          <AnatomyExplorer
            allProductsMap={allProductsMap}
            callFlows={catalogData.callFlows}
            onSelectProduct={handleSelectProductFromAnatomy}
            onLaunchZoneProtocol={handleLaunchZoneProtocol}
            onLaunchFlow={(flow, stepIdx) => handleLaunchFlow(flow, stepIdx, true)}
            initialSpecies={anatomyState.species}
            initialZoneId={anatomyState.zoneId}
          />
        </div>

        {/* 4. DASHBOARD FILTERS & SEARCH */}
        <div className="space-y-4 mb-6">
          
          {/* Top-Tier Focus and Company Tabs (3D Sunken Track) */}
          <div className="p-1 rounded-2xl ui-3d-track flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {/* ⭐ Top-Tier Focus (10) Default Active Tab */}
            <button
              onClick={() => setActiveTab('top-tier')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'top-tier'
                  ? 'ui-3d-pill-active scale-[1.01]'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'top-tier' ? 'fill-amber-300 text-amber-300' : 'fill-[#96916E] text-[#96916E]'}`} />
              <span>⭐ Top-Tier Focus (10)</span>
            </button>

            {/* All Portfolio (16) */}
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'all'
                  ? 'ui-3d-pill-active scale-[1.01]'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Portfolio (16)</span>
            </button>

            {/* Catalysis */}
            <button
              onClick={() => setActiveTab('catalysis')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'catalysis'
                  ? 'ui-3d-pill-active scale-[1.01]'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0B431E]"></span>
              <span>Catalysis (6)</span>
            </button>

            {/* B.A.R.D */}
            <button
              onClick={() => setActiveTab('bard')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'bard'
                  ? 'bg-gradient-to-b from-amber-600 to-amber-700 text-white shadow-md border-t border-white/30'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              <span>B.A.R.D (5)</span>
            </button>

            {/* Vitasignia */}
            <button
              onClick={() => setActiveTab('vitasignia')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'vitasignia'
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-md border-t border-white/30'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
              <span>Vitasignia (1)</span>
            </button>

            {/* Ringbio */}
            <button
              onClick={() => setActiveTab('ringbio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'ringbio'
                  ? 'bg-gradient-to-b from-pink-600 to-pink-700 text-white shadow-md border-t border-white/30'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
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
                placeholder="Search products, indications, ingredients (e.g. 'parvo', 'arginine', 'stones')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B431E] focus:ring-1 focus:ring-[#0B431E] transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Specialty Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => setSelectedSpecialty('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  selectedSpecialty === 'ALL'
                    ? 'bg-[#0B431E] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                All Specialties
              </button>
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                    selectedSpecialty === spec
                      ? 'bg-[#E8F4EC] text-[#0B431E] border border-[#0B431E]/30'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
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
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm my-8">
            <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedSpecialty('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B431E] hover:bg-[#14632E] text-white"
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
                onStartPresentation={(p) => {
                  enterFullscreenLandscape();
                  setOpenedFromAnatomy(false);
                  setActivePresentationProduct(p);
                }}
                isInPlaylist={callPlaylist.some((item) => item.id === product.id)}
                onTogglePlaylist={togglePlaylist}
                onSelectRelated={(relatedId) => {
                  enterFullscreenLandscape();
                  setOpenedFromAnatomy(false);
                  const target = allProductsMap[relatedId];
                  if (target) setActivePresentationProduct(target);
                }}
              />
            ))}
          </div>
        )}

      </main>

      {/* 6. PERSISTENT GLOBAL "QUICK-JUMP" COMMAND MATRIX (3D THUMB ZONE) */}
      {!activePresentationProduct && (
        <div 
          className="fixed bottom-5 inset-x-0 z-40 flex items-center justify-center pointer-events-none"
          style={{
            paddingBottom: 'max(0px, env(safe-area-inset-bottom, 0px))',
          }}
        >
          <button
            onClick={() => setIsQuickJumpOpen(true)}
            className="pointer-events-auto group flex items-center gap-2.5 px-6 py-3.5 rounded-full ui-3d-btn-primary border-t border-white/40 shadow-[0_16px_36px_rgba(11,67,30,0.4)] transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-extrabold tracking-wide uppercase">
              1.5s Omni-Matrix
            </span>
            <span className="text-[10px] text-white/95 font-mono bg-white/20 px-2 py-0.5 rounded-full border border-white/20 font-bold">
              Thumb Zone
            </span>
          </button>
        </div>
      )}

      {/* 7. CINEMA SHOWROOM PRESENTATION MODE */}
      {activePresentationProduct && (
        <PresentationMode
          product={activePresentationProduct}
          allProductsMap={allProductsMap}
          activeProtocol={activeProtocol}
          allCallFlows={catalogData.callFlows}
          onClose={() => {
            setActivePresentationProduct(null);
            setActiveProtocol(null);
            setOpenedFromAnatomy(false);
          }}
          onBackToAnatomy={openedFromAnatomy ? handleBackToAnatomy : null}
          onSwitchProduct={(newProd, newProtocolIdx) => {
            setActivePresentationProduct(newProd);
            if (activeProtocol && typeof newProtocolIdx === 'number') {
              setActiveProtocol((prev) => prev ? { ...prev, currentProductIndex: newProtocolIdx } : null);
            }
          }}
          onLaunchProtocolFlow={handleLaunchFlow}
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
          setIsQuickJumpOpen(false);
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
