import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight } from 'lucide-react';

interface RewardModalProps {
  score: number;
  totalQuestions: number;
  starsEarned: number;
  onRestart: () => void;
  onNextLevel?: () => void;
  hasNextLevel: boolean;
  onBackToLevels: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  score,
  totalQuestions,
  starsEarned,
  onRestart,
  onNextLevel,
  hasNextLevel,
  onBackToLevels,
}) => {
  useEffect(() => {
    if (starsEarned > 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [starsEarned]);

  const getCheerTitle = () => {
    if (starsEarned === 3) return 'Super Ear Champion! 🏆';
    if (starsEarned === 2) return 'Awesome Job! 🌟';
    if (starsEarned === 1) return 'Good Effort! 🎵';
    return 'Keep Practicing! 💪';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center gap-4">
        {/* Big star row */}
        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3].map((starNum) => (
            <div
              key={starNum}
              className={`text-5xl sm:text-6xl transition-all duration-500 transform ${
                starNum <= starsEarned
                  ? 'scale-110 drop-shadow-lg animate-bounce'
                  : 'opacity-30 grayscale'
              }`}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* Title & Score */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            {getCheerTitle()}
          </h3>
          <p className="text-sm sm:text-base font-bold text-slate-500 mt-1">
            You scored {score} out of {totalQuestions} correct!
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          {hasNextLevel && starsEarned >= 1 && onNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-all active:scale-95"
            >
              <span>Next Level</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl shadow flex items-center justify-center gap-2 text-sm transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again to Earn 3 Stars</span>
          </button>

          <button
            type="button"
            onClick={onBackToLevels}
            className="w-full py-2.5 px-4 text-slate-600 hover:text-slate-900 font-bold text-sm"
          >
            Back to All Levels
          </button>
        </div>
      </div>
    </div>
  );
};
