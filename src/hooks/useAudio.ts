import { useState, useCallback, useEffect } from 'react';
import { soundEngine, InstrumentType } from '../audio/SoundEngine';
import { NOTES, NoteItem } from '../audio/noteFrequencies';

export function useAudio() {
  const [instrument, setInstrumentState] = useState<InstrumentType>('xylophone');
  const [isMuted, setIsMutedState] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  useEffect(() => {
    // Sync initial state
    setInstrumentState(soundEngine.getInstrument());
    setIsMutedState(soundEngine.getIsMuted());
    setVolumeState(soundEngine.getVolume());
  }, []);

  const changeInstrument = useCallback((inst: InstrumentType) => {
    soundEngine.setInstrument(inst);
    setInstrumentState(inst);
  }, []);

  const toggleMute = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setIsMutedState(muted);
  }, []);

  const changeVolume = useCallback((val: number) => {
    soundEngine.setVolume(val);
    setVolumeState(val);
  }, []);

  const playNote = useCallback((noteOrId: NoteItem | string, durMult = 1.0) => {
    let note: NoteItem | undefined;
    if (typeof noteOrId === 'string') {
      note = NOTES.find((n) => n.id.toLowerCase() === noteOrId.toLowerCase() || n.solfege.toLowerCase() === noteOrId.toLowerCase());
    } else {
      note = noteOrId;
    }

    if (!note) return;

    soundEngine.playNote(note.frequency, undefined, durMult);
    setActiveNoteId(note.id);

    // Reset visual flash
    setTimeout(() => {
      setActiveNoteId((curr) => (curr === note!.id ? null : curr));
    }, 250);
  }, []);

  const playFrequency = useCallback((freq: number, inst?: InstrumentType, durMult = 1.0) => {
    soundEngine.playNote(freq, inst, durMult);
  }, []);

  const playSuccess = useCallback(() => {
    soundEngine.playSuccessFanfare();
  }, []);

  const playTryAgain = useCallback(() => {
    soundEngine.playTryAgainJingle();
  }, []);

  return {
    instrument,
    setInstrument: changeInstrument,
    isMuted,
    toggleMute,
    volume,
    setVolume: changeVolume,
    playNote,
    playFrequency,
    playSuccess,
    playTryAgain,
    activeNoteId,
  };
}
