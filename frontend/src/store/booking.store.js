// store/booking.store.js
import { create } from "zustand";
import bookingInstance from "../api/bookingInstance.js";

export const useBookingStore = create((set) => ({
  bookings: [],
  loading: false,
  error: null,

  createBooking: async (listingId, startDate, endDate) => {
    try {
      set({ loading: true, error: null });
      const res = await bookingInstance.post(`/${listingId}`, { startDate, endDate });
      set({ loading: false });
      return { success: true, message: res.data.message, booking: res.data.booking };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || err.message });
      return { success: false, message: err.response?.data?.message || "Booking failed" };
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      set({ loading: true, error: null });
      const res = await bookingInstance.delete(`/${bookingId}`);
      set((state) => ({
        bookings: state.bookings.filter((b) => b._id !== bookingId),
        loading: false,
      }));
      return { success: true, message: res.data.message };
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || err.message });
      return { success: false, message: err.response?.data?.message || "Cancellation failed" };
    }
  },

  fetchBookingHistory: async () => {
    try {
      set({ loading: true, error: null });
      const res = await bookingInstance.get("/history");
      set({ bookings: res.data.bookings, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || err.message });
    }
  },
}));
