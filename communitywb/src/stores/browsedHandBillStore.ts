import { create } from 'zustand';

/** Represents a browsed Handbill entry with pagination & scroll info. */
interface BrowsedHandbillEntry {
  id: number;
  timestamp: number;        // Time when the entry was created/updated
  lastSeenPage: number;     // Last page the user viewed
  scrollPosition: number;   // Scroll offset the user was at
}

interface BrowsedHandbillsState {
  browsedHandbills: BrowsedHandbillEntry[];
  addBrowsedHandbill: (id: number, lastSeenPage: number, scrollPosition: number) => void;
  getBrowsedHandbillEntry: (id: number) => BrowsedHandbillEntry | undefined;
}

export const useBrowsedHandbillsStore = create<BrowsedHandbillsState>((set, get) => {
  // Define the time period (3 days in milliseconds)
  const EXPIRY_DURATION = 24 * 60 * 60 * 1000;

  const storedData = localStorage.getItem('browsedHandbills');
  let initialBrowsedHandbills: BrowsedHandbillEntry[] = storedData ? JSON.parse(storedData) : [];

  // Filter out entries older than 3 days
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

        const updatedBrowsedHandbills = state.browsedHandbills.filter(
          (entry) => now - entry.timestamp < EXPIRY_DURATION && entry.id !== id
        );

        updatedBrowsedHandbills.push({
          id,
          timestamp: now,
          lastSeenPage,
          scrollPosition,
        });

        localStorage.setItem('browsedHandbills', JSON.stringify(updatedBrowsedHandbills));

        return { browsedHandbills: updatedBrowsedHandbills };
      }),

    getBrowsedHandbillEntry: (id) => {
      const state = get();
      return state.browsedHandbills.find((entry) => entry.id === id);
    },
  };
});
