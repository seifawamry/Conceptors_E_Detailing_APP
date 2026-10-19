import React from 'react';
import { X, Play, Trash2, Star, Sparkles, GripVertical, Check, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md h-full glass-modal p-6 shadow-2xl border-l border-white/15 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Call Playlist <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">{playlist.length} Products</span>
            </h3>
            <p className="text-xs text-slate-400">Custom queue for your veterinary consultation</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
          {/* Quick-Action: 1-Tap Load 10 Top-Tier Products */}
          <button
            onClick={onLoadTopTier}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 hover:border-amber-300 text-left transition-all flex items-center justify-between group shadow-glow-gold/20"
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">
                  ⭐ 1-Tap Load Top-Tier Call (10 Products)
                </div>
                <div className="text-[11px] text-slate-400">
                  Queue all flagship products instantly
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Playlist Items */}
          {playlist.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl mt-6">
              Your call queue is empty. Click the <strong>+</strong> button on any product card or tap <strong>Load Top-Tier Call</strong> above.
            </div>
          ) : (
            playlist.map((product, idx) => (
              <div
                key={product.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 group hover:border-emerald-400/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500 font-bold w-4">
                    {idx + 1}
                  </span>
                  {product.slides && product.slides[0] && (
                    <img
                      src={product.slides[0]}
                      alt={product.name}
                      className="w-12 aspect-video object-cover rounded border border-white/10"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {product.name}
                      </span>
                      {product.isTopTier && (
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {product.company} • {product.slides.length} slides
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFromPlaylist(product.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove from Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          {playlist.length > 0 && (
            <button
              onClick={() => {
                onStartPlaylist();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-glow-emerald flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Call Presentation ({playlist.length} Products)</span>
            </button>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onClearPlaylist}
              disabled={playlist.length === 0}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Clear Entire Playlist
            </button>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
