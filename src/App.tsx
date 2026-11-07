import { useState } from 'react';
import { Header, AppMode } from './components/Header';
import { FreePlayView } from './components/FreePlay/FreePlayView';
import { PitchLadderView } from './components/Learn/PitchLadderView';
import { LevelSelect } from './components/Quiz/LevelSelect';
import { QuizGameView } from './components/Quiz/QuizGameView';
import { QUIZ_LEVELS, QuizLevel } from './components/Quiz/types';
import { NoteDisplayMode } from './audio/noteFrequencies';
import { soundEngine } from './audio/SoundEngine';
import { useAudio } from './hooks/useAudio';

const STORAGE_KEY = 'doremi_kids_progress_v1';

export function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('free-play');
  const [displayMode, setDisplayMode] = useState<NoteDisplayMode>('solfege');
  const [activeQuizLevel, setActiveQuizLevel] = useState<QuizLevel | null>(null);

  // Audio Hook
  const {
    instrument,
    setInstrument,
    isMuted,
    toggleMute,
    playNote,
    activeNoteId,
  } = useAudio();

  // Progress state (levelId -> stars)
  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Total stars calculated
  const totalStars = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  // Save progress
  const handleLevelComplete = (levelId: number, stars: number) => {
    setLevelStars((prev) => {
      const currentBest = prev[levelId] || 0;
      const updated = {
        ...prev,
        [levelId]: Math.max(currentBest, stars),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const handleNextLevel = () => {
    if (!activeQuizLevel) return;
    const currentIndex = QUIZ_LEVELS.findIndex((l) => l.id === activeQuizLevel.id);
    if (currentIndex >= 0 && currentIndex + 1 < QUIZ_LEVELS.length) {
      setActiveQuizLevel(QUIZ_LEVELS[currentIndex + 1]);
    }
  };

  const hasNextLevel = activeQuizLevel
    ? QUIZ_LEVELS.findIndex((l) => l.id === activeQuizLevel.id) < QUIZ_LEVELS.length - 1
    : false;

  return (
    <div className="min-h-screen flex flex-col justify-between py-2 sm:py-4 px-2 sm:px-4">
      {/* Top Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setActiveQuizLevel(null);
        }}
        instrument={instrument}
        onChangeInstrument={setInstrument}
        displayMode={displayMode}
        onChangeDisplayMode={setDisplayMode}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        totalStars={totalStars}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center my-4">
        {currentMode === 'free-play' && (
          <FreePlayView
            instrument={instrument}
            displayMode={displayMode}
            activeNoteId={activeNoteId}
            onPlayNote={playNote}
            soundEngine={soundEngine}
            onSongComplete={() => handleLevelComplete(101, 1)}
          />
        )}

        {currentMode === 'pitch-ladder' && (
          <PitchLadderView
            displayMode={displayMode}
            activeNoteId={activeNoteId}
            onPlayNote={playNote}
          />
        )}

        {currentMode === 'quiz' && (
          <>
            {!activeQuizLevel ? (
              <LevelSelect
                levelStars={levelStars}
                onSelectLevel={(level) => setActiveQuizLevel(level)}
              />
            ) : (
              <QuizGameView
                level={activeQuizLevel}
                instrument={instrument}
                displayMode={displayMode}
                soundEngine={soundEngine}
                onBackToLevels={() => setActiveQuizLevel(null)}
                onLevelComplete={handleLevelComplete}
                hasNextLevel={hasNextLevel}
                onNextLevel={handleNextLevel}
              />
            )}
          </>
        )}
      </main>

      {/* Playful Footer */}
      <footer className="text-center text-xs font-bold text-slate-400 py-3">
        <span>Do-Re-Mi Kids Music Ear Trainer • Made for joyful learning 🎈</span>
      </footer>
    </div>
  );
}

export default App;
