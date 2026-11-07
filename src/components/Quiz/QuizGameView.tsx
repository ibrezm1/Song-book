import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizLevel } from './types';
import { NOTES, NoteItem, NoteDisplayMode } from '../../audio/noteFrequencies';
import { InstrumentType, SoundEngine } from '../../audio/SoundEngine';
import { Xylophone } from '../Xylophone/Xylophone';
import { RewardModal } from './RewardModal';
import { Mascot, MascotMood } from '../common/Mascot';
import { Volume2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizGameViewProps {
  level: QuizLevel;
  instrument: InstrumentType;
  displayMode: NoteDisplayMode;
  soundEngine: SoundEngine;
  onBackToLevels: () => void;
  onLevelComplete: (levelId: number, stars: number) => void;
  hasNextLevel: boolean;
  onNextLevel: () => void;
}

const QUESTIONS_PER_ROUND = 5;

export const QuizGameView: React.FC<QuizGameViewProps> = ({
  level,
  instrument,
  displayMode,
  soundEngine,
  onBackToLevels,
  onLevelComplete,
  hasNextLevel,
  onNextLevel,
}) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);
  const [activeXyloNoteId, setActiveXyloNoteId] = useState<string | null>(null);

  // High-Low state
  const [highLowPair, setHighLowPair] = useState<[NoteItem, NoteItem] | null>(null);

  // Single-note state
  const [targetNote, setTargetNote] = useState<NoteItem | null>(null);

  // Melody-echo state
  const [targetMelody, setTargetMelody] = useState<NoteItem[]>([]);
  const [userMelodyInput, setUserMelodyInput] = useState<NoteItem[]>([]);

  // Sound ref to prevent overlapping plays
  const isPlayingRef = useRef(false);

  // Generate a new question for current level
  const generateQuestion = useCallback(() => {
    setFeedback('idle');
    setUserMelodyInput([]);

    const candidateNotes = NOTES.filter((n) => level.targetNotes.includes(n.id));

    if (level.type === 'high-low') {
      // Pick 2 distinct notes
      const idx1 = Math.floor(Math.random() * candidateNotes.length);
      let idx2 = Math.floor(Math.random() * candidateNotes.length);
      while (idx2 === idx1) {
        idx2 = Math.floor(Math.random() * candidateNotes.length);
      }
      const pair: [NoteItem, NoteItem] = [candidateNotes[idx1], candidateNotes[idx2]];
      setHighLowPair(pair);
    } else if (level.type === 'single-note') {
      const chosen = candidateNotes[Math.floor(Math.random() * candidateNotes.length)];
      setTargetNote(chosen);
    } else if (level.type === 'melody-echo') {
      // 2 notes for early questions, 3 notes for later
      const seqLength = questionIndex >= 2 ? 3 : 2;
      const melody: NoteItem[] = [];
      for (let i = 0; i < seqLength; i++) {
        const randNote = candidateNotes[Math.floor(Math.random() * candidateNotes.length)];
        melody.push(randNote);
      }
      setTargetMelody(melody);
    }
  }, [level, questionIndex]);

  // Initial question on mount or index change
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Audio play function for High-Low
  const playHighLowNotes = useCallback(async (pair: [NoteItem, NoteItem]) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);

    // Note 1
    soundEngine.playNote(pair[0].frequency, undefined, 1.2);
    await new Promise((r) => setTimeout(r, 800));

    // Note 2
    soundEngine.playNote(pair[1].frequency, undefined, 1.2);
    await new Promise((r) => setTimeout(r, 800));

    isPlayingRef.current = false;
    setIsPlayingAudio(false);
  }, [soundEngine]);

  // Audio play function for Single Note
  const playSingleNoteAudio = useCallback(async (note: NoteItem) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);

    soundEngine.playNote(note.frequency, undefined, 1.5);
    await new Promise((r) => setTimeout(r, 800));

    isPlayingRef.current = false;
    setIsPlayingAudio(false);
  }, [soundEngine]);

  // Audio play function for Melody Echo
  const playMelodyAudio = useCallback(async (melody: NoteItem[]) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);

    for (let i = 0; i < melody.length; i++) {
      soundEngine.playNote(melody[i].frequency, undefined, 1.0);
      await new Promise((r) => setTimeout(r, 650));
    }

    isPlayingRef.current = false;
    setIsPlayingAudio(false);
  }, [soundEngine]);

  // Automatically play audio when question is set
  useEffect(() => {
    const timer = setTimeout(() => {
      if (level.type === 'high-low' && highLowPair) {
        playHighLowNotes(highLowPair);
      } else if (level.type === 'single-note' && targetNote) {
        playSingleNoteAudio(targetNote);
      } else if (level.type === 'melody-echo' && targetMelody.length > 0) {
        playMelodyAudio(targetMelody);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [highLowPair, targetNote, targetMelody, level.type, playHighLowNotes, playSingleNoteAudio, playMelodyAudio]);

  // Move to next question or end round
  const advanceQuestion = (wasCorrect: boolean) => {
    const newScore = wasCorrect ? score + 1 : score;
    if (wasCorrect) setScore(newScore);

    setTimeout(() => {
      if (questionIndex + 1 >= QUESTIONS_PER_ROUND) {
        // Round Finished
        setIsRoundFinished(true);
        const finalScore = wasCorrect ? score + 1 : score;
        const stars = finalScore >= 5 ? 3 : finalScore >= 4 ? 2 : finalScore >= 3 ? 1 : 0;
        onLevelComplete(level.id, stars);
      } else {
        setQuestionIndex((prev) => prev + 1);
      }
    }, 1200);
  };

  // Handle High-Low answer
  const handleAnswerHighLow = (chosenOrder: 0 | 1) => {
    if (!highLowPair || isPlayingAudio || feedback === 'correct') return;

    const higherIndex = highLowPair[0].frequency < highLowPair[1].frequency ? 1 : 0;
    const isCorrect = chosenOrder === higherIndex;

    if (isCorrect) {
      setFeedback('correct');
      soundEngine.playSuccessFanfare();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      advanceQuestion(true);
    } else {
      setFeedback('wrong');
      soundEngine.playTryAgainJingle();
      setTimeout(() => setFeedback('idle'), 1200);
    }
  };

  // Handle Single Note answer (clicked key on xylophone)
  const handleAnswerSingleNote = (playedNote: NoteItem) => {
    if (!targetNote || isPlayingAudio || feedback === 'correct') return;

    // Play clicked note sound so child can compare
    soundEngine.playNote(playedNote.frequency, undefined, 1.0);
    setActiveXyloNoteId(playedNote.id);
    setTimeout(() => setActiveXyloNoteId(null), 250);

    if (playedNote.id === targetNote.id) {
      setFeedback('correct');
      soundEngine.playSuccessFanfare();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      advanceQuestion(true);
    } else {
      setFeedback('wrong');
      soundEngine.playTryAgainJingle();
      setTimeout(() => setFeedback('idle'), 1200);
    }
  };

  // Handle Melody Echo note tap
  const handleAnswerMelodyNote = (playedNote: NoteItem) => {
    if (targetMelody.length === 0 || isPlayingAudio || feedback === 'correct') return;

    soundEngine.playNote(playedNote.frequency, undefined, 1.0);
    setActiveXyloNoteId(playedNote.id);
    setTimeout(() => setActiveXyloNoteId(null), 250);

    const nextInput = [...userMelodyInput, playedNote];
    setUserMelodyInput(nextInput);

    // Check partial match
    const currentIndex = userMelodyInput.length;
    if (playedNote.id !== targetMelody[currentIndex].id) {
      // Wrong note
      setFeedback('wrong');
      soundEngine.playTryAgainJingle();
      setTimeout(() => {
        setFeedback('idle');
        setUserMelodyInput([]);
      }, 1000);
      return;
    }

    // If completed full melody
    if (nextInput.length === targetMelody.length) {
      setFeedback('correct');
      soundEngine.playSuccessFanfare();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      advanceQuestion(true);
    }
  };

  const handleReplayCurrentAudio = () => {
    if (level.type === 'high-low' && highLowPair) {
      playHighLowNotes(highLowPair);
    } else if (level.type === 'single-note' && targetNote) {
      playSingleNoteAudio(targetNote);
    } else if (level.type === 'melody-echo' && targetMelody.length > 0) {
      playMelodyAudio(targetMelody);
    }
  };

  const handleRestartRound = () => {
    setQuestionIndex(0);
    setScore(0);
    setIsRoundFinished(false);
    setFeedback('idle');
    generateQuestion();
  };

  // Mascot mood
  const getMascotMood = (): MascotMood => {
    if (feedback === 'correct') return 'celebrating';
    if (feedback === 'wrong') return 'thinking';
    if (isPlayingAudio) return 'listening';
    return 'happy';
  };

  const getMascotMessage = (): string => {
    if (feedback === 'correct') return 'Bingo! You got it right! 🎉';
    if (feedback === 'wrong') return 'Almost! Listen again, you can do it! 🎧';
    if (isPlayingAudio) return 'Shh... listen carefully to the pitch!';
    if (level.type === 'high-low') return 'Which of the two notes was HIGHER?';
    if (level.type === 'single-note') return 'Tap the key on the xylophone that matches the secret note!';
    if (level.type === 'melody-echo') return 'Play the notes back in the exact order you heard!';
    return 'Listen closely!';
  };

  const starsEarned = score >= 5 ? 3 : score >= 4 ? 2 : score >= 3 ? 1 : 0;

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto px-2">
      {/* Top Bar: Back button, Level Title & Question Tracker */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur rounded-2xl p-3 border border-purple-100 shadow-sm">
        <button
          type="button"
          onClick={onBackToLevels}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm px-2.5 py-1.5 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Levels</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xl">{level.emoji}</span>
          <span className="font-black text-slate-800 text-sm sm:text-base">{level.title}</span>
        </div>

        {/* Question Counter Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: QUESTIONS_PER_ROUND }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < questionIndex
                  ? 'bg-emerald-500 scale-100'
                  : i === questionIndex
                  ? 'bg-purple-600 ring-2 ring-purple-300 scale-125'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mascot Guidance */}
      <Mascot mood={getMascotMood()} message={getMascotMessage()} />

      {/* Question Prompt Center Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-purple-100 flex flex-col items-center gap-4 text-center">
        {/* Replay Sound Button */}
        <button
          type="button"
          onClick={handleReplayCurrentAudio}
          disabled={isPlayingAudio}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white font-black text-sm sm:text-base shadow-lg transition-transform active:scale-95 disabled:opacity-50"
        >
          <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          <span>{isPlayingAudio ? 'Listening...' : 'Hear Secret Sound Again 🔁'}</span>
        </button>

        {/* Feedback Alert */}
        {feedback === 'correct' && (
          <div className="flex items-center gap-2 text-emerald-600 font-black text-lg animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            <span>Splendid Ear! Correct! ⭐</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="text-amber-600 font-bold text-sm bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
            Keep trying! Tap 'Hear Secret Sound Again' to listen!
          </div>
        )}

        {/* LEVEL 1: High vs Low Option Buttons */}
        {level.type === 'high-low' && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mt-2">
            <button
              type="button"
              onClick={() => handleAnswerHighLow(0)}
              disabled={isPlayingAudio}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black text-lg shadow-lg transition-all active:scale-95 flex flex-col items-center gap-1"
            >
              <span className="text-2xl">1️⃣</span>
              <span>1st Note</span>
            </button>

            <button
              type="button"
              onClick={() => handleAnswerHighLow(1)}
              disabled={isPlayingAudio}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-black text-lg shadow-lg transition-all active:scale-95 flex flex-col items-center gap-1"
            >
              <span className="text-2xl">2️⃣</span>
              <span>2nd Note</span>
            </button>
          </div>
        )}

        {/* LEVEL 5: Melody Echo Slots */}
        {level.type === 'melody-echo' && targetMelody.length > 0 && (
          <div className="flex flex-col items-center gap-2 mt-2">
            <span className="text-xs font-bold text-slate-500">Echo the {targetMelody.length} notes:</span>
            <div className="flex items-center gap-3">
              {targetMelody.map((_, i) => {
                const filled = userMelodyInput[i];
                return (
                  <div
                    key={i}
                    className={`w-14 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-lg shadow-inner border-2 transition-all ${
                      filled
                        ? 'bg-purple-600 text-white border-purple-400 scale-105'
                        : 'bg-slate-100 text-slate-400 border-slate-300'
                    }`}
                  >
                    <span>{filled ? filled.solfege : '?'}</span>
                    <span className="text-[10px] opacity-75">{filled ? filled.letter : `${i + 1}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* For Single-Note and Melody-Echo, show the Xylophone with allowed notes */}
      {level.type !== 'high-low' && (
        <Xylophone
          instrument={instrument}
          displayMode={displayMode}
          activeNoteId={activeXyloNoteId}
          allowedNoteIds={level.targetNotes}
          onPlayNote={
            level.type === 'melody-echo' ? handleAnswerMelodyNote : handleAnswerSingleNote
          }
        />
      )}

      {/* Reward Modal when round completes */}
      {isRoundFinished && (
        <RewardModal
          score={score}
          totalQuestions={QUESTIONS_PER_ROUND}
          starsEarned={starsEarned}
          onRestart={handleRestartRound}
          onNextLevel={onNextLevel}
          hasNextLevel={hasNextLevel}
          onBackToLevels={onBackToLevels}
        />
      )}
    </div>
  );
};
