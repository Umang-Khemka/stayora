import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useListingStore } from "../store/listing.store.js";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function LandingPage() {
  const { listings, loading, error, fetchAllListings, toggleWishlist } = useListingStore();
  const [wishlistIds, setWishlistIds] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetchAllListings();
  }, [fetchAllListings]);

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery) ||
    listing.location.toLowerCase().includes(searchQuery)
  );

  const handleWishlist = async (id,e) => {
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
        <h1 className="text-3xl font-bold text-center mb-8">All Listings</h1>
        {listings.length === 0 ? (
          <p className="text-center text-gray-500">No Listings available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((listing) => {
              const isSaved = wishlistIds.includes(listing._id);
              return (
                <div
                  key={listing._id}
                  onClick={()=>navigate(`/listing/${listing._id}`)}
                  className="relative bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                >
                  <img
                    src={listing.image?.url || "https://via.placeholder.com/400x250"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlist(listing._id,e)}
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
      <Footer/>
    </div>
  );
}
