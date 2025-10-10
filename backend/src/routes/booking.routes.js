import express from "express";
import {
  createBooking,
  cancelBooking,
  getBookingHistory,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:listingId", authMiddleware, createBooking);
router.delete("/:id", authMiddleware, cancelBooking);
router.get("/history", authMiddleware, getBookingHistory);

export default router;
