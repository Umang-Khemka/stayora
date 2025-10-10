import { Booking } from "../models/booking.model.js";
import { Listing } from "../models/listing.model.js";

// ---------------- Do Booking ----------------
const createBooking = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { startDate, endDate } = req.body;
    const userId = req.user._id;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const overlappingBooking = await Booking.findOne({
      listing: listingId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "These dates are already booked" });
    }

    const newBooking = await Booking.create({
      listing: listingId,
      user: userId,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
};

// ---------------- Cancel Booking ----------------
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your booking" });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking", error: err.message });
  }
};

// ---------------- Booking History ----------------
const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate("listing", "title location price image")
      .sort({ startDate: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking history", error: err.message });
  }
};

export { createBooking, cancelBooking, getBookingHistory };
