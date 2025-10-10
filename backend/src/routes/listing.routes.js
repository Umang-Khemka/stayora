import express from "express";
import {
  createListing,
  getAllListing,
  getListingById,
  updateListing,
  updateListingImage,
  deleteListing,
  toggleWishlist,
} from "../controllers/listing.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createListing);
router.get("/", getAllListing);
router.get("/:id", getListingById);
router.put("/:id", authMiddleware, updateListing);
router.put("/:id/image", authMiddleware, upload.single("image"), updateListingImage);
router.delete("/:id", authMiddleware, deleteListing);
router.put("/wishlist/:listingId", authMiddleware, toggleWishlist);

export default router;
