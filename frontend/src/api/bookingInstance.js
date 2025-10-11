import axios from "axios";

const bookingInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/bookings"
      : "/api/v1/bookings",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default bookingInstance;