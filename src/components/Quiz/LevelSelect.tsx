import React from 'react';
import { QUIZ_LEVELS, QuizLevel } from './types';
import { Play, Lock } from 'lucide-react';

interface LevelSelectProps {
  levelStars: Record<number, number>; // levelId -> stars
  onSelectLevel: (level: QuizLevel) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  levelStars,
  onSelectLevel,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto px-2">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ear Training Quests
        </h2>
        <p className="text-sm font-bold text-slate-500 mt-1">
          Pick a quest to train your musical ear and collect golden stars!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {QUIZ_LEVELS.map((level, idx) => {
          const stars = levelStars[level.id] || 0;
          // Unlocked if first level or if previous level has >= 1 star
          const isUnlocked = idx === 0 || (levelStars[QUIZ_LEVELS[idx - 1].id] || 0) >= 1;

          return (
            <div
              key={level.id}
              onClick={() => {
                if (isUnlocked) onSelectLevel(level);
              }}
              className={`relative rounded-3xl p-5 border-2 transition-all flex flex-col justify-between gap-4 cursor-pointer select-none ${
                isUnlocked
                  ? 'bg-white hover:-translate-y-1 hover:shadow-xl border-purple-200 shadow-md'
                  : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Header row with emoji & stars */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-200 to-pink-200 flex items-center justify-center text-2xl shadow-inner">
                    {level.emoji}
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <span
                        key={s}
                        className={`text-lg ${s <= stars ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] font-black uppercase text-purple-600 tracking-wider">
                    {level.subtitle}
                  </span>
                  <h3 className="text-lg font-black text-slate-800">{level.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    {level.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {isUnlocked ? (
                  <>
                    <span className="text-xs font-bold text-indigo-600">
                      {stars > 0 ? `${stars}/3 Stars Earned` : 'Ready to Play!'}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Complete Level {idx} to unlock</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
