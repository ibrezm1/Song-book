import React from 'react';
import { NoteItem, NoteDisplayMode } from '../../audio/noteFrequencies';
import { InstrumentType } from '../../audio/SoundEngine';

interface KeyBarProps {
  note: NoteItem;
  instrument: InstrumentType;
  displayMode: NoteDisplayMode;
  isActive: boolean;
  isHighlighted?: boolean;
  highlightLabel?: string;
  disabled?: boolean;
  onPress: (note: NoteItem) => void;
}

export const KeyBar: React.FC<KeyBarProps> = ({
  note,
  instrument,
  displayMode,
  isActive,
  isHighlighted,
  highlightLabel,
  disabled = false,
  onPress,
}) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!disabled) {
      onPress(note);
    }
  };

  // Label text according to display mode
  const getPrimaryLabel = () => {
    switch (displayMode) {
      case 'letters':
        return note.letter;
      case 'numbers':
        return `${note.degree}`;
      case 'solfege':
      case 'both':
      default:
        return note.solfege;
    }
  };

  const getSecondaryLabel = () => {
    if (displayMode === 'both') {
      return note.letter;
    }
    return null;
  };

  const isBells = instrument === 'bells';

  return (
    <div
      className="flex flex-col items-center justify-end h-full relative select-none flex-1 max-w-[85px] min-w-[36px]"
      style={{ height: '100%' }}
    >
      {/* Floating Guided indicator */}
      {isHighlighted && (
        <div className="absolute -top-11 z-20 animate-bounce flex flex-col items-center">
          <span className="text-xl filter drop-shadow">⭐</span>
          {highlightLabel && (
            <span className="bg-amber-400 text-amber-950 font-bold text-xs px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
              {highlightLabel}
            </span>
          )}
        </div>
      )}

      {/* The Key Bar */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        disabled={disabled}
        aria-label={`${note.solfege} key, note ${note.letter}`}
        style={{
          height: `${note.heightPercent}%`,
          boxShadow: isActive
            ? '0 2px 4px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.6)'
            : '0 8px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)',
        }}
        className={`
          w-full rounded-2xl relative flex flex-col items-center justify-between py-3
          transition-all duration-75 ease-out outline-none touch-manipulation cursor-pointer
          ${isActive ? 'scale-95 translate-y-1 brightness-110' : 'hover:-translate-y-0.5 hover:brightness-105 active:scale-95'}
          ${isHighlighted ? 'ring-4 ring-yellow-300 ring-offset-2 animate-pulse' : ''}
          ${isBells ? 'border-2 border-white/60' : 'border-t-2 border-white/40 border-b-4 border-black/30'}
          bg-gradient-to-b ${note.gradient}
        `}
      >
        {/* Top peg/screw for xylophone acoustic mount */}
        <div
          className={`w-3.5 h-3.5 rounded-full shadow-inner flex items-center justify-center ${
            isBells ? 'bg-amber-100 border border-amber-300' : 'bg-stone-300 border border-stone-500'
          }`}
        >
          <div className="w-1 h-1 bg-stone-600 rounded-full" />
        </div>

        {/* Note labels */}
        <div className="flex flex-col items-center my-auto px-0.5">
          <span
            className={`font-black text-lg sm:text-2xl tracking-wide drop-shadow-md ${note.labelColor}`}
          >
            {getPrimaryLabel()}
          </span>
          {getSecondaryLabel() && (
            <span className="text-xs sm:text-sm font-bold opacity-90 text-white/90 drop-shadow">
              ({getSecondaryLabel()})
            </span>
          )}
        </div>

        {/* Bottom peg & keyboard hint */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-white/75 bg-black/20 px-1.5 py-0.5 rounded-md hidden md:inline-block">
            {note.keyboardKey}
          </span>
          <div
            className={`w-3.5 h-3.5 rounded-full shadow-inner flex items-center justify-center ${
              isBells ? 'bg-amber-100 border border-amber-300' : 'bg-stone-300 border border-stone-500'
            }`}
          >
            <div className="w-1 h-1 bg-stone-600 rounded-full" />
          </div>
        </div>

        {/* Shimmer light reflection effect */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1/2 bg-white/35 rounded-full pointer-events-none blur-[0.5px]" />
      </button>
    </div>
  );
};
