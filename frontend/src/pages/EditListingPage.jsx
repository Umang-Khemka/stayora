import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useListingStore } from "../store/listing.store.js";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { singleListing, fetchListingById, updateListing, updateListingImage, loading } =
    useListingStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    category: "",
    price: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState(null);

  const categories = [
    "Rooms",
    "Iconic Cities",
    "Castles",
    "Mountain Views",
    "Camping",
    "Amazing Nature",
    "Farms",
    "Arctic",
    "Boats",
  ];

  useEffect(() => {
    if (id) fetchListingById(id);
  }, [id, fetchListingById]);

  useEffect(() => {
    if (singleListing) {
      setFormData({
        title: singleListing.title || "",
        description: singleListing.description || "",
        location: singleListing.location || "",
        country: singleListing.country || "",
        category: singleListing.category || "",
        price: singleListing.price || "",
        file: null,
      });
      setPreview(singleListing.image?.url || null);
    }
  }, [singleListing]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
    setPreview(file ? URL.createObjectURL(file) : singleListing.image?.url || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update listing text fields first
    const updatedData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      country: formData.country,
      category: formData.category,
      price: formData.price,
    };

    const res = await updateListing(id, updatedData);
    if (!res.success) {
      showNotification(res.message || "Failed to update listing", "error");
      return;
    }

    // If image changed, update image separately
    if (formData.file) {
      const imageData = new FormData();
      imageData.append("image", formData.file);
      const imageRes = await updateListingImage(id, imageData);
      if (!imageRes.success) {
        showNotification(imageRes.message || "Failed to update image", "error");
        return;
      }
    }

    showNotification("Listing updated successfully!", "success");
    navigate(`/listing/${id}`);
  };

  if (!singleListing) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading listing...
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Edit Listing</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  readOnly
                  value={formData.file ? formData.file.name : ""}
                  placeholder="No file chosen"
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-r-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-full h-48 object-cover rounded-lg border"
                />
              )}
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
