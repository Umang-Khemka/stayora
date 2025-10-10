import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useListingStore } from "../store/listing.store.js";
import { useAuthStore } from "../store/user.store.js";
import { useReviewStore } from "../store/review.store.js";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function ViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { singleListing, loading, error, fetchListingById, deleteListing } =
    useListingStore();
  const { user } = useAuthStore();

  const {
    reviews,
    fetchReviewsByListing,
    createReview,
    updateReview,
    deleteReview,
    loading: reviewsLoading,
  } = useReviewStore();

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingComment, setEditingComment] = useState("");
  const [editingRating, setEditingRating] = useState(0);

  useEffect(() => {
    if (id) {
      fetchListingById(id);
      fetchReviewsByListing(id);
    }
  }, [id, fetchListingById, fetchReviewsByListing]);

  const isOwner = user && singleListing?.owner?._id === user._id;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;

    const res = await deleteListing(id);
    if (res.success) {
      alert(res.message);
      navigate("/");
    } else {
      alert(res.message);
    }
  };

  const handleCreateReview = async () => {
    if (!newComment || newRating === 0) {
      alert("Please enter comment and rating.");
      return;
    }
    const res = await createReview(id, newComment, newRating);
    if (res.success) {
      setNewComment("");
      setNewRating(0);
    } else {
      alert(res.message);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editingComment || editingRating === 0) {
      alert("Please enter comment and rating.");
      return;
    }
    const res = await updateReview(reviewId, {
      comment: editingComment,
      rating: editingRating,
    });
    if (res.success) {
      setEditingReviewId(null);
      setEditingComment("");
      setEditingRating(0);
    } else {
      alert(res.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    const res = await deleteReview(reviewId);
    if (!res.success) alert(res.message);
  };

  if (loading || reviewsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading listing details...
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

  if (!singleListing) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Listing not found.
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6 flex flex-col items-center">
        {/* Listing Card */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
          <img
            src={singleListing.image?.url || "https://via.placeholder.com/800x400"}
            alt={singleListing.title}
            className="w-full h-80 object-cover"
          />

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{singleListing.title}</h1>
            <p className="text-gray-700 mb-4">{singleListing.description}</p>
            <div className="text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {singleListing.location}
              </p>
              <p>
                <span className="font-semibold">Country:</span>{" "}
                {singleListing.country}
              </p>
              <p className="text-blue-600 font-bold text-lg mt-2">
                ₹ {singleListing.price}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {isOwner && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/edit-listing/${singleListing._id}`)
                    }
                    className="bg-yellow-500 text-white px-5 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </>
              )}

              <button
                onClick={() => navigate(`/booking/${singleListing._id}`)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="w-full max-w-4xl mt-10 bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

          {/* New Review Form */}
          {user && (
            <div className="mb-6 border-b pb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a review..."
                className="w-full border rounded p-2 mb-2"
              />
              <div className="flex items-center mb-2">
                <span className="mr-2 font-semibold">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl cursor-pointer ${
                      star <= newRating ? "text-yellow-400 animate-pulse" : "text-gray-300"
                    }`}
                    onClick={() => setNewRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button
                onClick={handleCreateReview}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const isReviewOwner = user && rev.author?._id === user._id;
                const isEditing = editingReviewId === rev._id;
                return (
                  <div
                    key={rev._id}
                    className="border rounded-lg p-4 bg-gray-50 relative"
                  >
                    {/* Review stars */}
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            star <= (isEditing ? editingRating : rev.rating)
                              ? "text-yellow-400 animate-pulse"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-gray-600 font-semibold">
                        {rev.author?.username}
                      </span>
                    </div>

                    {isEditing ? (
                      <>
                        <textarea
                          value={editingComment}
                          onChange={(e) => setEditingComment(e.target.value)}
                          className="w-full border rounded p-2 mb-2"
                        />
                        <div className="flex items-center mb-2">
                          <span className="mr-2 font-semibold">Rating:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-2xl cursor-pointer ${
                                star <= editingRating
                                  ? "text-yellow-400 animate-pulse"
                                  : "text-gray-300"
                              }`}
                              onClick={() => setEditingRating(star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateReview(rev._id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 mb-2">{rev.comment}</p>
                        {isReviewOwner && (
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => {
                                setEditingReviewId(rev._id);
                                setEditingComment(rev.comment);
                                setEditingRating(rev.rating);
                              }}
                              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
