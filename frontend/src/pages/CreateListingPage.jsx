import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useListingStore } from "../store/listing.store.js";
import Footer from "../components/Footer.jsx";

export default function CreateListingPage() {
  const { createListing, loading } = useListingStore();

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
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("country", formData.country);
    data.append("category", formData.category);
    data.append("price", formData.price);
    if (formData.file) data.append("image", formData.file);

    const res = await createListing(data);
    if (res.success) {
      showNotification("Listing created successfully!", "success");
      setFormData({
        title: "",
        description: "",
        location: "",
        country: "",
        category: "",
        price: "",
        file: null,
      });
      setPreview(null);
    } else {
      showNotification(res.message || "Failed to create listing", "error");
    }
  };

  return (
    <div>
      <Navbar />
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Create New Listing</h1>
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

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mumbai, Delhi"
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
                placeholder="e.g., India"
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

            {/* File Upload */}
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
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}