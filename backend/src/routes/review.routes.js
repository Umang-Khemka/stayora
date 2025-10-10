import express from "express";
import {
  getReviewByListing,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:listingId", authMiddleware, createReview);
router.get("/listing/:listingId",getReviewByListing);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
