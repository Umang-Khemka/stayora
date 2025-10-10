import { create } from "zustand";
import listingInstance from "../api/listingInstance.js";

export const useListingStore = create((set) => ({
  listings: [],
  singleListing: null,
  loading: false,
  error: null,

  fetchAllListings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await listingInstance.get("/");
      set({ listings: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  fetchListingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await listingInstance.get(`/${id}`);
      set({ singleListing: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  createListing: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await listingInstance.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        listings: [...state.listings, res.data.listing],
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  updateListing: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await listingInstance.put(`/${id}`, updatedData);
      set((state) => ({
        listings: state.listings.map((item) =>
          item._id === id ? res.data.listing : item
        ),
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  updateListingImage: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const res = await listingInstance.put(`/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        listings: state.listings.map((item) =>
          item._id === id ? res.data.listing : item
        ),
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  deleteListing: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await listingInstance.delete(`/${id}`);
      set((state) => ({
        listings: state.listings.filter((item) => item._id !== id),
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  toggleWishlist: async (listingId) => {
    try {
      const res = await listingInstance.put(`/wishlist/${listingId}`);
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  
}));
