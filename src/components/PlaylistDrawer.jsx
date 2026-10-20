import React from 'react';
import { X, Play, Trash2, Star, GripVertical, Check, ArrowRight, ListPlus } from 'lucide-react';

export default function PlaylistDrawer({
  isOpen,
  onClose,
  playlist = [],
  onRemoveFromPlaylist,
  onClearPlaylist,
  onStartPlaylist,
  onLoadTopTier,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md h-full bg-white p-6 shadow-2xl border-l border-slate-200 flex flex-col justify-between"
        style={{
          paddingTop: 'max(24px, env(safe-area-inset-top, 24px))',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
          paddingRight: 'max(24px, env(safe-area-inset-right, 24px))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-[#0B431E] flex items-center gap-2">
              Call Playlist <span className="text-xs bg-[#E8F4EC] text-[#0B431E] px-2.5 py-0.5 rounded-full border border-[#0B431E]/20">{playlist.length} Products</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Custom queue for your veterinary consultation</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
          {/* Quick-Action: 1-Tap Load 10 Top-Tier Products */}
          <button
            onClick={onLoadTopTier}
            className="w-full p-3.5 rounded-2xl bg-[#F5F4F0] border border-[#96916E]/30 hover:border-[#0B431E]/40 text-left transition-all flex items-center justify-between group shadow-sm active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-5 h-5 fill-[#96916E] text-[#96916E]" />
              <div>
                <div className="text-xs font-black text-[#0B431E] group-hover:text-[#14632E]">
                  ⭐ 1-Tap Load Top-Tier Call (10 Products)
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Queue all flagship products instantly
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#0B431E] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Playlist Items */}
          {playlist.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ListPlus className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#0B431E]" />
              <p className="text-sm font-bold text-slate-600">Your playlist is empty</p>
              <p className="text-xs text-slate-400 mt-1">Tap the "+" icon on any product card or load the 10 Top-Tier call above.</p>
            </div>
          ) : (
            playlist.map((item, index) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-[#FAF9F5] border border-slate-200 flex items-center justify-between group hover:border-[#0B431E]/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E8F4EC] text-[#0B431E] text-xs font-black flex items-center justify-center font-mono">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.isTopTier && (
                        <Star className="w-3 h-3 fill-[#96916E] text-[#96916E]" />
                      )}
                    </div>
                    <div className="text-[10.5px] text-slate-500 font-medium">
                      {item.company} • {item.slides?.length || 0} slides
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFromPlaylist(item.id)}
                  title="Remove from playlist"
                  className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
          <button
            onClick={() => {
              onStartPlaylist();
              onClose();
            }}
            disabled={playlist.length === 0}
            className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm ${
              playlist.length > 0
                ? 'bg-[#0B431E] hover:bg-[#14632E] text-white active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current text-white" />
            <span>Launch Playlist Call ({playlist.length} Products)</span>
          </button>

          {playlist.length > 0 && (
            <button
              onClick={onClearPlaylist}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 py-1.5 transition-colors"
            >
              Clear Entire Playlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
