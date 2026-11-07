export interface NoteItem {
  id: string; // e.g. "c4"
  solfege: string; // "Do"
  letter: string; // "C"
  degree: number; // 1
  frequency: number; // 261.63
  color: string; // Tailwind background or hex
  gradient: string; // Attractive gradient for 3D look
  accentColor: string; // Glow & border
  labelColor: string;
  keyboardKey: string; // "1" or "C"
  heightPercent: number; // Height relative to longest bar (e.g. 100 down to 68)
}

export const NOTES: NoteItem[] = [
  {
    id: 'c4',
    solfege: 'Do',
    letter: 'C',
    degree: 1,
    frequency: 261.63,
    color: '#EF4444', // Red
    gradient: 'from-rose-500 via-red-500 to-rose-600',
    accentColor: '#DC2626',
    labelColor: 'text-white',
    keyboardKey: '1',
    heightPercent: 100,
  },
  {
    id: 'd4',
    solfege: 'Re',
    letter: 'D',
    degree: 2,
    frequency: 293.66,
    color: '#F97316', // Orange
    gradient: 'from-orange-400 via-orange-500 to-amber-600',
    accentColor: '#EA580C',
    labelColor: 'text-white',
    keyboardKey: '2',
    heightPercent: 95,
  },
  {
    id: 'e4',
    solfege: 'Mi',
    letter: 'E',
    degree: 3,
    frequency: 329.63,
    color: '#FACC15', // Yellow
    gradient: 'from-amber-300 via-yellow-400 to-amber-500',
    accentColor: '#CA8A04',
    labelColor: 'text-amber-950',
    keyboardKey: '3',
    heightPercent: 90,
  },
  {
    id: 'f4',
    solfege: 'Fa',
    letter: 'F',
    degree: 4,
    frequency: 349.23,
    color: '#22C55E', // Green
    gradient: 'from-emerald-400 via-green-500 to-emerald-600',
    accentColor: '#16A34A',
    labelColor: 'text-white',
    keyboardKey: '4',
    heightPercent: 85,
  },
  {
    id: 'g4',
    solfege: 'Sol',
    letter: 'G',
    degree: 5,
    frequency: 392.00,
    color: '#06B6D4', // Cyan / Teal
    gradient: 'from-cyan-400 via-teal-500 to-cyan-600',
    accentColor: '#0891B2',
    labelColor: 'text-white',
    keyboardKey: '5',
    heightPercent: 80,
  },
  {
    id: 'a4',
    solfege: 'La',
    letter: 'A',
    degree: 6,
    frequency: 440.00,
    color: '#3B82F6', // Blue
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    accentColor: '#2563EB',
    labelColor: 'text-white',
    keyboardKey: '6',
    heightPercent: 75,
  },
  {
    id: 'b4',
    solfege: 'Ti',
    letter: 'B',
    degree: 7,
    frequency: 493.88,
    color: '#8B5CF6', // Purple
    gradient: 'from-violet-400 via-purple-500 to-purple-600',
    accentColor: '#7C3AED',
    labelColor: 'text-white',
    keyboardKey: '7',
    heightPercent: 70,
  },
  {
    id: 'c5',
    solfege: 'Do',
    letter: 'C',
    degree: 8,
    frequency: 523.25,
    color: '#EC4899', // Pink
    gradient: 'from-pink-400 via-rose-500 to-fuchsia-600',
    accentColor: '#DB2777',
    labelColor: 'text-white',
    keyboardKey: '8',
    heightPercent: 65,
  },
];

export type NoteDisplayMode = 'solfege' | 'letters' | 'both' | 'numbers';
