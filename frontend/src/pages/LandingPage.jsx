import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useListingStore } from "../store/listing.store.js";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { FaBed, FaCity, FaMountain, FaCampground, FaTree, FaTractor, FaSnowflake, FaShip, FaLandmark } from "react-icons/fa";

export default function LandingPage() {
  const { listings, loading, error, fetchAllListings, toggleWishlist } = useListingStore();
  const [wishlistIds, setWishlistIds] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  const categories = [
    { name: "Rooms", icon: <FaBed size={30} /> },
    { name: "Iconic Cities", icon: <FaCity size={30} /> },
    { name: "Castles", icon: <FaLandmark size={30} /> },
    { name: "Mountain Views", icon: <FaMountain size={30} /> },
    { name: "Camping", icon: <FaCampground size={30} /> },
    { name: "Amazing Nature", icon: <FaTree size={30} /> },
    { name: "Farms", icon: <FaTractor size={30} /> },
    { name: "Arctic", icon: <FaSnowflake size={30} /> },
    { name: "Boats", icon: <FaShip size={30} /> },
  ];

  useEffect(() => {
    fetchAllListings();
  }, [fetchAllListings]);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery) ||
      listing.location.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory ? listing.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleWishlist = async (id, e) => {
    e.stopPropagation();
    const res = await toggleWishlist(id);
    if (res.success) {
      setWishlistIds((prev) =>
        prev.includes(id) ? prev.filter((wId) => wId !== id) : [...prev, id]
      );
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading listings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-gray-100 py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-6">All Listings</h1>

        {/* Category Icons directly below heading */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.name ? "" : cat.name)
              }
            >
              <div
                className={`p-4 rounded-full border-2 transition-all ${
                  selectedCategory === cat.name
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300 bg-white"
                }`}
              >
                {cat.icon}
              </div>
              <span className="mt-2 text-gray-700 font-medium">{cat.name}</span>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 ? (
          <p className="text-center text-gray-500">No Listings available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing) => {
              const isSaved = wishlistIds.includes(listing._id);
              return (
                <div
                  key={listing._id}
                  onClick={() => navigate(`/listing/${listing._id}`)}
                  className="relative bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                >
                  <img
                    src={listing.image?.url || "https://via.placeholder.com/400x250"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlist(listing._id, e)}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${
                      isSaved ? "bg-red-500 text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    {isSaved ? "♥" : "♡"}
                  </button>

                  <div className="p-4">
                    <h2 className="text-xl font-semibold truncate">{listing.title}</h2>
                    <p className="text-gray-600">{listing.location}</p>
                    <p className="text-blue-600 font-semibold mt-2">₹ {listing.price} / Night</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
