import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useListingStore } from "../store/listing.store.js";
import { useBookingStore } from "../store/booking.store.js";
import { useAuthStore } from "../store/user.store.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../components/Footer.jsx";
import emailjs from "@emailjs/browser";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { singleListing, fetchListingById, loading: listingLoading } = useListingStore();
  const { user, checkAuth } = useAuthStore();
  const { createBooking, loading: bookingLoading } = useBookingStore();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (id) fetchListingById(id);
    checkAuth();
  }, [id, fetchListingById, checkAuth]);
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-semibold">
          Please login to make a booking.
        </p>
      </div>
    );
  }

  
  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    if (startDate > endDate) {
      alert("Start date cannot be after end date.");
      return;
    }

    const res = await createBooking(id, startDate, endDate);

    if (res.success) {
      const templateParams = {
        name: user.username,
        email: user.email,
        listing_title: singleListing.title,
        start_date: startDate.toDateString(),
        end_date: endDate.toDateString(),
        total_price: totalPrice.toFixed(2),
      };

      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(
          (response) => {
            console.log("✅ Email sent:", response.status, response.text);
          },
          (error) => {
            console.error("❌ Email send failed:", error);
          }
        );

      alert("Booking confirmed! A confirmation email has been sent.");
      navigate("/");
    } else {
      alert(res.message);
    }
  };

  const getTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = endDate - startDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = getTotalDays();
  const pricePerNight = singleListing?.price || 0;
  const subtotal = totalDays * pricePerNight;
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const totalPrice = subtotal + taxAmount;

  if (listingLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading listing details...
      </div>
    );
  }

  if (!singleListing) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Listing not found.
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-6 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-3xl overflow-hidden">
          {/* Listing Image */}
          <img
            src={singleListing.image.url || "https://via.placeholder.com/800x400"}
            alt={singleListing.title}
            className="w-full h-80 object-cover rounded-t-3xl"
          />

          <div className="p-6 flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{singleListing.title}</h1>
            <p className="text-gray-700">{singleListing.description}</p>
            <p className="text-gray-600">
              <span className="font-semibold">Location:</span> {singleListing.location}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Country:</span> {singleListing.country}
            </p>
            <p className="text-blue-600 font-bold text-lg">
              ₹ {pricePerNight} / night
            </p>

            {/* Date Selection */}
            <div className="flex gap-4 flex-wrap mt-4">
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="font-semibold mb-1">Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Select start date"
                  className="border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition w-full text-gray-700"
                />
              </div>
              <div className="flex flex-col w-full sm:w-1/2">
                <label className="font-semibold mb-1">End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Select end date"
                  className="border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition w-full text-gray-700"
                />
              </div>
            </div>

            {/* Bill Summary */}
            {totalDays > 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Booking Summary</h2>
                <p>Total Nights: <span className="font-semibold">{totalDays}</span></p>
                <p>Price per Night: ₹ <span className="font-semibold">{pricePerNight}</span></p>
                <p>Subtotal: ₹ <span className="font-semibold">{subtotal}</span></p>
                <p>GST (18%): ₹ <span className="font-semibold">{taxAmount.toFixed(2)}</span></p>
                <p className="text-blue-600 font-bold">Total: ₹ {totalPrice.toFixed(2)}</p>
              </div>
            )}

            {/* Booking Button */}
            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
