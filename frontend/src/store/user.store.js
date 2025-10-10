import { create } from "zustand";
import userInstance from "../api/userInstance.js";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await userInstance.post("/register", {
        username,
        email,
        password,
      });

      set({ user: res.data.user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registeration Failed",
        loading: false,
      });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await userInstance.post("/login", {
        email,
        password,
      });

      set({ user: res.data.user, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await userInstance.post("/logout");
      set({ user: null });
    } catch (err) {
      set({ error: err.response?.data?.message || "Logout failed" });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await userInstance.get("/me");
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
    }
  },
}));