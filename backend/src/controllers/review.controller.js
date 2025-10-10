import { Review } from "../models/review.model.js";
import { Listing } from "../models/listing.model.js";

// ---------------- Create Review ----------------
const createReview = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { comment, rating } = req.body;
    const authorId = req.user._id;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const newReview = await Review.create({
      comment,
      rating,
      author: authorId,
    });

    listing.reviews.push(newReview._id);
    await listing.save();

    await newReview.populate("author", "username email");

    res.status(201).json({ message: "Review created successfully", review: newReview });
  } catch (err) {
    res.status(500).json({ message: "Error creating review", error: err.message });
  }
};

const getReviewByListing = async(req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate({
      path: "reviews",
      populate: { path: "author", select: "username email" },
    });

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.status(200).json(listing.reviews || []);
  } catch(err) {
    res.status(500).json({ message: "Error fetching listing reviews", error: err.message });
  }
}

// ---------------- Update Review ----------------
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your review" });
    }

    review.comment = comment || review.comment;
    review.rating = rating || review.rating;

    await review.save();
    
    await review.populate("author", "username email");
    
    res.status(200).json({ message: "Review updated successfully", review });
  } catch (err) {
    res.status(500).json({ message: "Error updating review", error: err.message });
  }
};

// ---------------- Delete Review ----------------
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your review" });
    }

    await Listing.updateMany(
      { reviews: id },
      { $pull: { reviews: id } }
    );

    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review", error: err.message });
  }
};

export {
  createReview,
  updateReview,
  deleteReview,
  getReviewByListing
};