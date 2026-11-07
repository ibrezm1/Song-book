import React from 'react';

export type MascotMood = 'happy' | 'listening' | 'thinking' | 'celebrating' | 'singing';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  message = "Tap any bell or key to hear its musical pitch!",
  className = '',
}) => {
  const getMascotFace = () => {
    switch (mood) {
      case 'listening':
        return { emoji: '🎧', eye: '👀', badge: 'Listening closely...' };
      case 'thinking':
        return { emoji: '🤔', eye: '💭', badge: 'Which note was that?' };
      case 'celebrating':
        return { emoji: '🎉', eye: '⭐', badge: 'Hooray! Great ear!' };
      case 'singing':
        return { emoji: '🎶', eye: '✨', badge: 'La la la!' };
      case 'happy':
      default:
        return { emoji: '🎵', eye: '😊', badge: 'Music Buddy' };
    }
  };

  const currentFace = getMascotFace();

  return (
    <div className={`flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-100 shadow-sm max-w-xl mx-auto ${className}`}>
      {/* Animated Character Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-pink-400 to-purple-500 flex items-center justify-center text-2xl shadow-md animate-bounce-subtle">
          <span>{currentFace.emoji}</span>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1 shadow text-xs">
          {currentFace.eye}
        </div>
      </div>

      {/* Speech bubble */}
      <div className="flex-1">
        <div className="text-[11px] font-black uppercase tracking-wider text-purple-600">
          {currentFace.badge}
        </div>
        <p className="text-sm sm:text-base font-bold text-slate-700 leading-snug">
          {message}
        </p>
      </div>
    </div>
  );
};

