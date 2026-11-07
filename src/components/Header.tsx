import React from 'react';
import { Volume2, VolumeX, Sparkles, Music, Award } from 'lucide-react';
import { InstrumentType } from '../audio/SoundEngine';
import { NoteDisplayMode } from '../audio/noteFrequencies';

export type AppMode = 'free-play' | 'pitch-ladder' | 'quiz';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  instrument: InstrumentType;
  onChangeInstrument: (inst: InstrumentType) => void;
  displayMode: NoteDisplayMode;
  onChangeDisplayMode: (mode: NoteDisplayMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  totalStars: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  instrument,
  onChangeInstrument,
  displayMode,
  onChangeDisplayMode,
  isMuted,
  onToggleMute,
  totalStars,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-3 py-3 flex flex-col gap-3">
      {/* Top Bar: Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-purple-100">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectMode('free-play')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md transform hover:rotate-6 transition-transform">
            <span className="text-2xl animate-wiggle">🎵</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              Do-Re-Mi Kids
            </h1>
            <p className="text-xs text-slate-500 font-bold hidden sm:block">Learn Pitch & Ear Training</p>
          </div>
        </div>

        {/* Global Controls: Instrument, Display Mode, Volume, Stars */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Instrument Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold border border-slate-200">
            <button
              type="button"
              onClick={() => onChangeInstrument('xylophone')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                instrument === 'xylophone'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🪵</span>
              <span className="hidden md:inline">Xylophone</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeInstrument('bells')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                instrument === 'bells'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔔</span>
              <span className="hidden md:inline">Magic Bells</span>
            </button>
          </div>

          {/* Note Label Selector */}
          <select
            value={displayMode}
            onChange={(e) => onChangeDisplayMode(e.target.value as NoteDisplayMode)}
            className="bg-slate-100 text-slate-700 text-xs font-bold rounded-xl px-2.5 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            <option value="solfege">Do Re Mi</option>
            <option value="letters">Letters (C D E)</option>
            <option value="both">Do + C</option>
            <option value="numbers">Numbers (1-8)</option>
          </select>

          {/* Stars badge */}
          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl font-black text-sm border border-amber-300 shadow-sm">
            <span className="text-base text-yellow-500">⭐</span>
            <span>{totalStars}</span>
          </div>

          {/* Mute button */}
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            className={`p-2 rounded-xl transition-all border ${
              isMuted
                ? 'bg-rose-100 text-rose-600 border-rose-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <nav className="flex items-center justify-center gap-2 sm:gap-4 bg-white/60 backdrop-blur p-1.5 rounded-2xl shadow-sm border border-white/60">
        <button
          type="button"
          onClick={() => onSelectMode('free-play')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl font-black text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all ${
            currentMode === 'free-play'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md transform -translate-y-0.5'
              : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Music className="w-4 h-4 sm:w-5 h-5" />
          <span>Play & Songs</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('pitch-ladder')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl font-black text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all ${
            currentMode === 'pitch-ladder'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md transform -translate-y-0.5'
              : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 h-5" />
          <span>Pitch Ladder</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('quiz')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl font-black text-xs sm:text-base flex items-center justify-center gap-1.5 transition-all ${
            currentMode === 'quiz'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform -translate-y-0.5'
              : 'text-slate-600 hover:bg-white/80'
          }`}
        >
          <Award className="w-4 h-4 sm:w-5 h-5" />
          <span>Ear Quiz Quest</span>
        </button>
      </nav>
    </header>
  );
};
