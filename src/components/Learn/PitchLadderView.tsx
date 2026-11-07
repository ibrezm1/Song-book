import React, { useState } from 'react';
import { NOTES, NoteItem, NoteDisplayMode } from '../../audio/noteFrequencies';
import { Mascot } from '../common/Mascot';
import { ArrowUp, ArrowDown, Scale } from 'lucide-react';

interface PitchLadderViewProps {
  displayMode: NoteDisplayMode;
  activeNoteId: string | null;
  onPlayNote: (note: NoteItem) => void;
}

export const PitchLadderView: React.FC<PitchLadderViewProps> = ({
  displayMode,
  activeNoteId,
  onPlayNote,
}) => {
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);

  const getNoteName = (note: NoteItem) => {
    switch (displayMode) {
      case 'letters':
        return note.letter;
      case 'numbers':
        return `${note.degree}`;
      case 'both':
        return `${note.solfege} (${note.letter})`;
      case 'solfege':
      default:
        return note.solfege;
    }
  };

  // Play ascending ladder
  const handlePlayAscending = async () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    for (let i = 0; i < NOTES.length; i++) {
      const note = NOTES[i];
      setCurrentStepId(note.id);
      onPlayNote(note);
      await new Promise((r) => setTimeout(r, 600));
    }

    setCurrentStepId(null);
    setIsPlayingSequence(false);
  };

  // Play descending ladder
  const handlePlayDescending = async () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    for (let i = NOTES.length - 1; i >= 0; i--) {
      const note = NOTES[i];
      setCurrentStepId(note.id);
      onPlayNote(note);
      await new Promise((r) => setTimeout(r, 600));
    }

    setCurrentStepId(null);
    setIsPlayingSequence(false);
  };

  // Compare Low Do vs High Do
  const handleCompareExtreme = async () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);

    // Low Do
    setCurrentStepId('c4');
    onPlayNote(NOTES[0]);
    await new Promise((r) => setTimeout(r, 1000));

    // High Do
    setCurrentStepId('c5');
    onPlayNote(NOTES[7]);
    await new Promise((r) => setTimeout(r, 1000));

    setCurrentStepId(null);
    setIsPlayingSequence(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto px-2">
      <Mascot
        mood="thinking"
        message="Pitches are like stairs! Each step up makes a higher, brighter musical sound. Can you hear the difference?"
      />

      {/* Action Buttons: Ascend / Descend / Compare */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePlayAscending}
          disabled={isPlayingSequence}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Climb Up (Low ➔ High)</span>
        </button>

        <button
          type="button"
          onClick={handlePlayDescending}
          disabled={isPlayingSequence}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <ArrowDown className="w-4 h-4" />
          <span>Slide Down (High ➔ Low)</span>
        </button>

        <button
          type="button"
          onClick={handleCompareExtreme}
          disabled={isPlayingSequence}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          <Scale className="w-4 h-4" />
          <span>Compare Low Do vs High Do</span>
        </button>
      </div>

      {/* The Visual Pitch Stairs */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100 max-w-4xl mx-auto w-full">
        <div className="flex items-end justify-center gap-2 sm:gap-4 h-72 sm:h-88 relative px-2">
          {NOTES.map((note, idx) => {
            const stepHeightPercent = 20 + idx * 11; // 20% up to 97%
            const isCurrent = (activeNoteId === note.id) || (currentStepId === note.id);

            return (
              <div
                key={note.id}
                className="flex-1 flex flex-col items-center justify-end h-full relative"
              >
                {/* Stepping Character on top of the active step */}
                {isCurrent && (
                  <div className="absolute z-20 animate-bounce -top-10 flex flex-col items-center">
                    <span className="text-2xl filter drop-shadow">🐥</span>
                    <span className="text-[10px] font-black text-purple-700 bg-white/90 px-1.5 py-0.5 rounded-full shadow">
                      Pitch: {Math.round(note.frequency)}Hz
                    </span>
                  </div>
                )}

                {/* Stair step button */}
                <button
                  type="button"
                  onClick={() => onPlayNote(note)}
                  style={{
                    height: `${stepHeightPercent}%`,
                    boxShadow: isCurrent
                      ? '0 0 20px rgba(236,72,153,0.6)'
                      : '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                  className={`
                    w-full rounded-2xl relative flex flex-col items-center justify-between py-2 sm:py-3
                    transition-all duration-150 cursor-pointer outline-none touch-manipulation
                    ${isCurrent ? 'scale-105 ring-4 ring-yellow-400' : 'hover:-translate-y-1 hover:brightness-105 active:scale-95'}
                    bg-gradient-to-t ${note.gradient}
                  `}
                >
                  <span className="text-white text-[11px] sm:text-xs font-bold bg-black/20 px-2 py-0.5 rounded-full">
                    Step {note.degree}
                  </span>

                  <div className="flex flex-col items-center">
                    <span className="text-white font-black text-base sm:text-xl drop-shadow">
                      {getNoteName(note)}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-white/80">
                    {idx === 0 ? 'Lowest' : idx === NOTES.length - 1 ? 'Highest' : ''}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6 text-xs sm:text-sm font-bold text-slate-500">
          💡 Click any stair step to hear that note rise or fall in pitch!
        </div>
      </div>
    </div>
  );
};
