import { create } from 'zustand';

interface ChaosState {
  forceError500: boolean;
  artificialDelay: number; // en ms
  corruptSchema: boolean;
  isOpen: boolean;
  setForceError500: (value: boolean) => void;
  setArtificialDelay: (delay: number) => void;
  setCorruptSchema: (value: boolean) => void;
  toggleOpen: () => void;
  resetAll: () => void;
}

export const useChaosStore = create<ChaosState>((set) => ({
  forceError500: false,
  artificialDelay: 0,
  corruptSchema: false,
  isOpen: false,
  setForceError500: (forceError500) => set({ forceError500 }),
  setArtificialDelay: (artificialDelay) => set({ artificialDelay }),
  setCorruptSchema: (corruptSchema) => set({ corruptSchema }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  resetAll: () => set({ forceError500: false, artificialDelay: 0, corruptSchema: false }),
}));