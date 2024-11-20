import { create } from 'zustand';

interface BrowsedHandbillEntry {
  id: number;
  timestamp: number;
  lastSeenPage: number;
  scrollPosition: number;
}

interface BrowsedHandbillsState {
  browsedHandbills: BrowsedHandbillEntry[];
  addBrowsedHandbill: (id: number, lastSeenPage: number, scrollPosition: number) => void;
  getBrowsedHandbillEntry: (id: number) => BrowsedHandbillEntry | undefined;
}

export const useBrowsedHandbillsStore = create<BrowsedHandbillsState>((set, get) => {
  const EXPIRY_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

  // Load and clean up initial data from localStorage
  const storedData = localStorage.getItem('browsedHandbills');
  let initialBrowsedHandbills: BrowsedHandbillEntry[] = storedData ? JSON.parse(storedData) : [];

  const now = Date.now();
  initialBrowsedHandbills = initialBrowsedHandbills.filter(
    (entry) => now - entry.timestamp < EXPIRY_DURATION
  );

  localStorage.setItem('browsedHandbills', JSON.stringify(initialBrowsedHandbills));

  return {
    browsedHandbills: initialBrowsedHandbills,
    addBrowsedHandbill: (id, lastSeenPage, scrollPosition) =>
      set((state) => {
        const now = Date.now();

        let updatedBrowsedHandbills = state.browsedHandbills.filter(
          (entry) => now - entry.timestamp < EXPIRY_DURATION && entry.id !== id
        );

        updatedBrowsedHandbills.push({ id, timestamp: now, lastSeenPage, scrollPosition });

        localStorage.setItem('browsedHandbills', JSON.stringify(updatedBrowsedHandbills));

        return { browsedHandbills: updatedBrowsedHandbills };
      }),
    getBrowsedHandbillEntry: (id) => {
      const state = get();
      return state.browsedHandbills.find((entry) => entry.id === id);
    },
  };
});