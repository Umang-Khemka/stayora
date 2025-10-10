import { Listing } from "../models/listing.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js"; 

// ---------------- Create Listing ----------------
const createListing = async (req, res) => {
  try {
    const { title, description, category, price, location, country } = req.body;
    const ownerId = req.user._id;

    let imageUrl = "";
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "listings",
      });
      imageData = {
        url: uploadResponse.secure_url,
        filename: uploadResponse.public_id 
      }; 
    }

    const newListing = await Listing.create({
      title,
      description,
      category,
      price,
      location,
      country,
      image: imageData,
      owner: ownerId,
    });

    res.status(201).json({ message: "Listing created successfully", listing: newListing });
  } catch (err) {
    res.status(500).json({ message: "Error creating listing", error: err.message });
  }
};

// ---------------- Get All Listings ----------------
const getAllListing = async (req, res) => {
  try {
    const allListings = await Listing.find().populate("owner", "username email");
    res.status(200).json(allListings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching listings", error: err.message });
  }
};

// ---------------- Get Listing By ID ----------------
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("owner", "username email")
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username" },
      });

    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ message: "Error fetching listing", error: err.message });
  }
};

// ---------------- Update Listing (Except Image) ----------------
const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;
    const { title, description, category, price, location, country } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your listing" });
    }

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.category = category || listing.category;
    listing.price = price || listing.price;
    listing.location = location || listing.location;
    listing.country = country || listing.country;

    await listing.save();
    res.status(200).json({ message: "Listing updated successfully", listing });
  } catch (err) {
    res.status(500).json({ message: "Error updating listing", error: err.message });
  }
};

// ---------------- Update Listing Image ----------------
const updateListingImage = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your listing" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "listings",
    });

    listing.image = uploadResponse.secure_url;
    await listing.save();

    res.status(200).json({ message: "Listing image updated successfully", listing });
  } catch (err) {
    res.status(500).json({ message: "Error updating image", error: err.message });
  }
};

// ---------------- Delete Listing ----------------
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user._id;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your listing" });
    }

    await Listing.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting listing", error: err.message });
  }
};

// ---------------- Toggle Wishlist ----------------
const toggleWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.indexOf(listingId);
    if (index === -1) {
      user.wishlist.push(listingId);
      await user.save();
      return res.status(200).json({ message: "Added to wishlist" });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Removed from wishlist" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error updating wishlist", error: err.message });
  }
};

export {
  createListing,
  getAllListing,
  getListingById,
  updateListing,
  updateListingImage,
  deleteListing,
  toggleWishlist,
};
