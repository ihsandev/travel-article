import { apiCall } from "@/lib/axios";
import { create } from "zustand";

interface StoreState {
  data: any;
  isLoading: boolean;
  error: Error | null;
  fetchData: () => Promise<any>;
}

/**
 * A Zustand store that provides user data and loading/error states.
 *
 * @typedef {Object} StoreState
 * @property {any} data - The user data.
 * @property {boolean} isLoading - Indicates if data is currently being fetched.
 * @property {Error | null} error - Holds any error that occurs during fetching.
 * @property {Function} fetchData - Function to fetch user data.
 */

export const useMe = create<StoreState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  /**
   * Fetches the current user data.
   *
   * @returns {Promise<any>} The fetched user data.
   */
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const response = await apiCall.get("/users/me");

      set({ data: response.data });
      return response.data;
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
