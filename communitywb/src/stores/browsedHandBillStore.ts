import { create } from 'zustand';

interface BrowsedHandbillEntry {
    id: number;
    timestamp: number;
}

interface BrowsedHandbillsState {
    browsedHandbills: BrowsedHandbillEntry[];
    addBrowsedHandbill: (id: number) => void;
}

export const useBrowsedHandbillsStore = create<BrowsedHandbillsState>((set) => {
  // Define the expiry duration (e.g., 7 days)
  const EXPIRY_DURATION = 3 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  // Load and clean up initial data from localStorage
    const storedData = localStorage.getItem('browsedHandbills');
    let initialBrowsedHandbills: BrowsedHandbillEntry[] = storedData ? JSON.parse(storedData) : [];

  // Clean up expired entries on initialization
    const now = Date.now();
    initialBrowsedHandbills = initialBrowsedHandbills.filter(
    (entry) => now - entry.timestamp < EXPIRY_DURATION
    );

  // Update localStorage after cleanup
    localStorage.setItem('browsedHandbills', JSON.stringify(initialBrowsedHandbills));

    return {
    browsedHandbills: initialBrowsedHandbills,
    addBrowsedHandbill: (id) =>
        set((state) => {
        const now = Date.now();

        // Clean up expired entries
        let updatedBrowsedHandbills = state.browsedHandbills.filter(
            (entry) => now - entry.timestamp < EXPIRY_DURATION
        );

        // Remove existing entry if it exists
        updatedBrowsedHandbills = updatedBrowsedHandbills.filter((entry) => entry.id !== id);

        // Add the new entry
        updatedBrowsedHandbills.push({ id, timestamp: now });

        // Update localStorage
        localStorage.setItem('browsedHandbills', JSON.stringify(updatedBrowsedHandbills));

        return { browsedHandbills: updatedBrowsedHandbills };
        }),
    };
});