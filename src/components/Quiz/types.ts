export interface QuizLevel {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  targetNotes: string[]; // Note IDs included in this level (e.g. ['c4', 'd4', 'e4'])
  type: 'high-low' | 'single-note' | 'melody-echo';
}

export const QUIZ_LEVELS: QuizLevel[] = [
  {
    id: 1,
    title: 'Level 1: High or Low?',
    subtitle: 'Ear Foundation',
    emoji: '🎈',
    description: 'Listen to 2 notes. Which one flew higher into the sky?',
    targetNotes: ['c4', 'g4', 'c5'],
    type: 'high-low',
  },
  {
    id: 2,
    title: 'Level 2: Do, Re, Mi',
    subtitle: '3-Note Master',
    emoji: '🐣',
    description: 'Can you recognize Do, Re, and Mi by their unique pitch?',
    targetNotes: ['c4', 'd4', 'e4'],
    type: 'single-note',
  },
  {
    id: 3,
    title: 'Level 3: Pentatonic Detective',
    subtitle: '5 Musical Notes',
    emoji: '🔍',
    description: 'Listen for Do, Re, Mi, Sol, and La!',
    targetNotes: ['c4', 'd4', 'e4', 'g4', 'a4'],
    type: 'single-note',
  },
  {
    id: 4,
    title: 'Level 4: Full Octave Rainbow',
    subtitle: 'All 8 Notes',
    emoji: '🌈',
    description: 'The master ear challenge! Identify all 8 notes from Do to High Do.',
    targetNotes: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'],
    type: 'single-note',
  },
  {
    id: 5,
    title: 'Level 5: Echo Melody',
    subtitle: 'Sequence Memory',
    emoji: '🦜',
    description: 'Listen to the secret melody, then echo it back note by note!',
    targetNotes: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'],
    type: 'melody-echo',
  },
];
