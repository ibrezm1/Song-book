import React, { useEffect } from 'react';
import { KeyBar } from './KeyBar';
import { NOTES, NoteItem, NoteDisplayMode } from '../../audio/noteFrequencies';
import { InstrumentType } from '../../audio/SoundEngine';

interface XylophoneProps {
  instrument: InstrumentType;
  displayMode: NoteDisplayMode;
  activeNoteId: string | null;
  onPlayNote: (note: NoteItem) => void;
  allowedNoteIds?: string[]; // If defined, only these notes are enabled/shown
  highlightedNoteId?: string;
  highlightLabel?: string;
  className?: string;
}

export const Xylophone: React.FC<XylophoneProps> = ({
  instrument,
  displayMode,
  activeNoteId,
  onPlayNote,
  allowedNoteIds,
  highlightedNoteId,
  highlightLabel,
  className = '',
}) => {
  // Physical keyboard support (1 to 8 keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const note = NOTES.find(
        (n) => n.keyboardKey === e.key || n.letter.toLowerCase() === e.key.toLowerCase()
      );

      if (note) {
        if (!allowedNoteIds || allowedNoteIds.includes(note.id)) {
          onPlayNote(note);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allowedNoteIds, onPlayNote]);

  const displayNotes = allowedNoteIds
    ? NOTES.filter((n) => allowedNoteIds.includes(n.id))
    : NOTES;

  const isBells = instrument === 'bells';

  return (
    <div className={`relative max-w-4xl mx-auto w-full px-2 py-4 select-none ${className}`}>
      {/* Background Frame / Rails */}
      <div
        className={`
          relative rounded-3xl p-4 sm:p-6 shadow-2xl transition-colors duration-500
          ${
            isBells
              ? 'bg-gradient-to-r from-sky-200 via-indigo-100 to-purple-200 border-4 border-indigo-300'
              : 'bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 border-4 border-amber-950'
          }
        `}
      >
        {/* Felt Insulator Rails inside frame */}
        <div className="absolute inset-x-6 top-8 h-3 rounded-full bg-stone-900/40 pointer-events-none" />
        <div className="absolute inset-x-6 bottom-10 h-3 rounded-full bg-stone-900/40 pointer-events-none" />

        {/* Keys Rack */}
        <div className="relative z-10 flex items-end justify-center gap-1.5 sm:gap-3 h-64 sm:h-80 md:h-96">
          {displayNotes.map((note) => (
            <KeyBar
              key={note.id}
              note={note}
              instrument={instrument}
              displayMode={displayMode}
              isActive={activeNoteId === note.id}
              isHighlighted={highlightedNoteId === note.id}
              highlightLabel={highlightLabel}
              onPress={onPlayNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

