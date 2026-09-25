import React, { useEffect } from 'react';
import { Star, Trash2, MapPin, X, Plus } from 'lucide-react';

export default function SavedLocations({
  isOpen,
  onClose,
  savedLocations = [],
  currentLocation,
  onSelectLocation,
  onRemoveLocation,
  onSaveCurrent,
  isCurrentSaved,
}) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-locations-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 id="saved-locations-title" className="text-lg font-bold text-white">
              Saved Locations
            </h3>
            <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full font-medium">
              {savedLocations.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved locations"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Location Quick Action if not saved */}
        {currentLocation && !isCurrentSaved && (
          <div className="mt-4 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
            <div className="text-xs text-sky-200">
              Save <span className="font-semibold text-white">{currentLocation.name}</span> for quick access?
            </div>
            <button
              type="button"
              onClick={onSaveCurrent}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        )}

        {/* Locations List */}
        <div className="mt-4 max-h-[340px] overflow-y-auto custom-scrollbar space-y-2">
          {savedLocations.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <Star className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="font-medium text-slate-300 text-sm">No saved locations yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">
                Save places you want to check quickly by tapping the star icon on the weather card.
              </p>
            </div>
          ) : (
            savedLocations.map((loc) => {
              const isActive =
                currentLocation?.latitude === loc.latitude &&
                currentLocation?.longitude === loc.longitude;

              return (
                <div
                  key={loc.id || `${loc.latitude}_${loc.longitude}`}
                  className={`p-3.5 rounded-2xl flex items-center justify-between transition-all group ${
                    isActive
                      ? 'bg-sky-500/20 border border-sky-500/40 text-white'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <MapPin className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-sky-400'}`} />
                    <div className="truncate">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        <span className="truncate">{loc.name}</span>
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 px-1.5 py-0.2 rounded border border-sky-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveLocation(loc);
                    }}
                    aria-label={`Remove ${loc.name} from saved locations`}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-2"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/5 text-center text-[11px] text-slate-500">
          Saved locally on this device • No account required
        </div>
      </div>
    </div>
  );
}
