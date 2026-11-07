import React, { useState } from 'react';
import { Xylophone } from '../Xylophone/Xylophone';
import { SongBook } from './SongBook';
import { Mascot } from '../common/Mascot';
import { NoteItem, NoteDisplayMode } from '../../audio/noteFrequencies';
import { InstrumentType, SoundEngine } from '../../audio/SoundEngine';
import { Music, BookOpen } from 'lucide-react';

interface FreePlayViewProps {
  instrument: InstrumentType;
  displayMode: NoteDisplayMode;
  activeNoteId: string | null;
  onPlayNote: (note: NoteItem) => void;
  soundEngine: SoundEngine;
  onSongComplete: () => void;
}

export const FreePlayView: React.FC<FreePlayViewProps> = ({
  instrument,
  displayMode,
  activeNoteId,
  onPlayNote,
  soundEngine,
  onSongComplete,
}) => {
  const [subTab, setSubTab] = useState<'jam' | 'songs'>('jam');
  const [highlightedNoteId, setHighlightedNoteId] = useState<string | null>(null);
  const [highlightLabel, setHighlightLabel] = useState<string | undefined>(undefined);

  const handleHighlight = (noteId: string | null, label?: string) => {
    setHighlightedNoteId(noteId);
    setHighlightLabel(label);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto px-2">
      {/* Subtab selection: Free Jam vs Song Book */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSubTab('jam');
            handleHighlight(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm sm:text-base transition-all ${
            subTab === 'jam'
              ? 'bg-pink-500 text-white shadow-lg scale-105'
              : 'bg-white/80 text-slate-700 hover:bg-white shadow-sm'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Free Jam</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('songs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm sm:text-base transition-all ${
            subTab === 'songs'
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-white/80 text-slate-700 hover:bg-white shadow-sm'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Song Book</span>
        </button>
      </div>

      {/* Mascot guidance */}
      <Mascot
        mood={subTab === 'jam' ? 'singing' : 'happy'}
        message={
          subTab === 'jam'
            ? 'Tap any key to play! Hear how the low notes sound deep and high notes chime bright.'
            : 'Follow the star on the keys to play your favorite nursery rhyme!'
        }
      />

      {/* If in Song Book mode, show the Song Book follower banner */}
      {subTab === 'songs' && (
        <SongBook
          onHighlightNote={handleHighlight}
          lastPlayedNoteId={activeNoteId}
          soundEngine={soundEngine}
          onSongComplete={onSongComplete}
        />
      )}

      {/* The Musical Xylophone / Bells */}
      <Xylophone
        instrument={instrument}
        displayMode={displayMode}
        activeNoteId={activeNoteId}
        onPlayNote={onPlayNote}
        highlightedNoteId={highlightedNoteId || undefined}
        highlightLabel={highlightLabel}
      />
    </div>
  );
};
