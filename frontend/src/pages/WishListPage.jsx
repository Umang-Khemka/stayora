import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useListingStore } from "../store/listing.store.js";
import { useAuthStore } from "../store/user.store.js";
import Footer from "../components/Footer.jsx";

export default function WishListPage() {
  const { listings, fetchAllListings, toggleWishlist, loading, error } = useListingStore();
  const { user, checkAuth } = useAuthStore();

  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    checkAuth();
    fetchAllListings();
  }, [checkAuth, fetchAllListings]);

  useEffect(() => {
    if (user) {
      setWishlistItems(listings.filter((listing) => user.wishlist.includes(listing._id)));
    }
  }, [listings, user]);

  const handleRemove = async (id) => {
    const res = await toggleWishlist(id);
    if (res.success) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== id));
    } else {
      alert(res.message);
    }
  };

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center text-gray-500 text-xl">
          Please login to see your wishlist.
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading wishlist...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-8">My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-500">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((listing) => (
              <div
                key={listing._id}
                className="relative bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <img
                  src={listing.image?.url || "https://via.placeholder.com/400x250"}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold truncate">{listing.title}</h2>
                  <p className="text-gray-600">{listing.country}</p>
                  <p className="text-blue-600 font-semibold mt-2">₹ {listing.price}</p>
                </div>
                <button
                  onClick={() => handleRemove(listing._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
