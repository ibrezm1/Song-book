import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SONGS, Song, SongStep } from '../../audio/songs';
import { NOTES } from '../../audio/noteFrequencies';
import { SoundEngine } from '../../audio/SoundEngine';

interface SongBookProps {
  onHighlightNote: (noteId: string | null, label?: string) => void;
  onSongComplete?: () => void;
  lastPlayedNoteId: string | null;
  soundEngine: SoundEngine;
}

export const SongBook: React.FC<SongBookProps> = ({
  onHighlightNote,
  onSongComplete,
  lastPlayedNoteId,
  soundEngine,
}) => {
  const [selectedSong, setSelectedSong] = useState<Song>(SONGS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentStep: SongStep | undefined = selectedSong.notes[currentStepIndex];

  // Update highlighted note on xylophone
  useEffect(() => {
    if (isCompleted || isPlayingDemo) {
      onHighlightNote(null);
    } else if (currentStep) {
      onHighlightNote(currentStep.noteId, currentStep.noteName);
    }
  }, [currentStep, isCompleted, isPlayingDemo, onHighlightNote]);

  // Check if kid played the correct note
  useEffect(() => {
    if (isPlayingDemo || isCompleted || !lastPlayedNoteId || !currentStep) return;

    if (lastPlayedNoteId === currentStep.noteId) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex >= selectedSong.notes.length) {
        // Song finished!
        setIsCompleted(true);
        soundEngine.playSuccessFanfare();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onSongComplete) onSongComplete();
      } else {
        setCurrentStepIndex(nextIndex);
      }
    }
  }, [lastPlayedNoteId, currentStep, currentStepIndex, selectedSong, isPlayingDemo, isCompleted, soundEngine, onSongComplete]);

  // Auto-play demo so child can hear the song
  const handlePlayDemo = async () => {
    if (isPlayingDemo) return;
    setIsPlayingDemo(true);
    setIsCompleted(false);

    for (let i = 0; i < selectedSong.notes.length; i++) {
      const step = selectedSong.notes[i];
      const noteMeta = NOTES.find((n) => n.id === step.noteId);
      if (noteMeta) {
        onHighlightNote(step.noteId, step.noteName);
        soundEngine.playNote(noteMeta.frequency, undefined, 1.0);
      }
      await new Promise((resolve) => setTimeout(resolve, step.durationMs));
    }

    onHighlightNote(null);
    setIsPlayingDemo(false);
    setCurrentStepIndex(0);
  };

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsPlayingDemo(false);
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setIsPlayingDemo(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100 max-w-4xl mx-auto flex flex-col gap-4">
      {/* Song selection pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {SONGS.map((song) => {
          const isSelected = song.id === selectedSong.id;
          return (
            <button
              key={song.id}
              type="button"
              onClick={() => handleSelectSong(song)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl whitespace-nowrap font-bold text-xs sm:text-sm transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{song.emoji}</span>
              <span>{song.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Song Control Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedSong.emoji}</span>
            <h3 className="text-lg sm:text-xl font-black text-slate-800">{selectedSong.title}</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{selectedSong.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Listen first / Demo button */}
          <button
            type="button"
            onClick={handlePlayDemo}
            disabled={isPlayingDemo}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isPlayingDemo ? 'Playing...' : 'Listen Demo'}</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-all"
            title="Start from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Note Stream */}
      {isCompleted ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center flex flex-col items-center gap-2 animate-bounce-subtle">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <h4 className="text-xl font-black text-emerald-800">Spectacular! You played the whole song! 🌟</h4>
          <p className="text-sm font-bold text-emerald-600">You earned a golden music star!</p>
          <button
            type="button"
            onClick={handleRestart}
            className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-all"
          >
            Play Again 🔁
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>Note {currentStepIndex + 1} of {selectedSong.notes.length}</span>
            <span className="text-purple-600">
              Next note to tap: <strong className="text-sm text-pink-600">{currentStep?.noteName}</strong>
            </span>
          </div>

          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / selectedSong.notes.length) * 100}%`,
              }}
            />
          </div>

          {/* Interactive Note Stream */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 px-2 scrollbar-none">
            {selectedSong.notes.map((step, idx) => {
              const noteMeta = NOTES.find((n) => n.id === step.noteId);
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={`${step.noteId}-${idx}`}
                  style={{
                    backgroundColor: isCurrent ? noteMeta?.color : undefined,
                  }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-14 rounded-2xl font-black text-sm transition-all duration-200 ${
                    isCurrent
                      ? 'scale-110 text-white shadow-lg ring-4 ring-yellow-300 animate-pulse'
                      : isPast
                      ? 'bg-slate-200 text-slate-400 opacity-60'
                      : 'bg-white text-slate-700 border border-slate-200 shadow-sm'
                  }`}
                >
                  <span>{step.noteName}</span>
                  <span className="text-[10px] font-semibold opacity-80">{noteMeta?.letter}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
