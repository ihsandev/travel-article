import { apiCall } from "@/lib/axios";
import { create } from "zustand";

interface StoreState {
  data: any;
  isLoading: boolean;
  error: Error | null;
  fetchData: () => Promise<any>;
}

export const useMe = create<StoreState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
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
