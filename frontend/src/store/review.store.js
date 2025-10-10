import { create } from "zustand";
import reviewInstance from "../api/reviewInstance.js";

export const useReviewStore = create((set) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviewsByListing: async (listingId) => {
    set({ loading: true, error: null });
    try {
      const res = await reviewInstance.get(`/listing/${listingId}`);
      set({ reviews: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  createReview: async (listingId, comment, rating) => {
    set({ loading: true, error: null });
    try {
      const res = await reviewInstance.post(`/${listingId}`, { comment, rating });
      set((state) => ({
        reviews: [...state.reviews, res.data.review],
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  updateReview: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await reviewInstance.put(`/${id}`, updatedData);
      set((state) => ({
        reviews: state.reviews.map((rev) => (rev._id === id ? res.data.review : rev)),
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },

  deleteReview: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await reviewInstance.delete(`/${id}`);
      set((state) => ({
        reviews: state.reviews.filter((rev) => rev._id !== id),
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },
}));
