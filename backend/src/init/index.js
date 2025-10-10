import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.config.js";
import { Listing } from "../models/listing.model.js";
import { sampleListings } from "./data.js";

dotenv.config({path: "../../.env"});

const ownerId = "68e78c438b3156e9628773a1";

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    for (let listing of sampleListings) {
      let imageData = {
        url: "",
        filename: ""
      };

      // Upload image to Cloudinary
      if (listing.image && listing.image.url) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(listing.image.url, {
            folder: "listings",
          });
          
          imageData.url = uploadResponse.secure_url;
          imageData.filename = uploadResponse.public_id;
          
          console.log(`📸 Uploaded: ${listing.title}`);
        } catch (error) {
          console.error(`❌ Upload failed for ${listing.title}:`, error.message);
        }
      }

      // Create listing with proper image structure
      const newListing = await Listing.create({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        image: imageData,
        price: listing.price,
        location: listing.location,
        country: listing.country,
        owner: ownerId,
      });

      console.log(`✅ Created: ${newListing.title} | Image: ${newListing.image.url}`);
    }

    console.log("🎉 All listings uploaded successfully!");
    mongoose.connection.close();
  })
  .catch(err => console.error(err));