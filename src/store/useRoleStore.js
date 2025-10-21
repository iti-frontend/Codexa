import { create } from "zustand";

export const useRoleStore = create((set) => ({
  role: "",
  setRole: (newRole) => set({ role: newRole }),
}));
