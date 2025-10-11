import axios from "axios";

const reviewInstance = axios.create({
    baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/reviews"
      : "/api/v1/reviews",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default reviewInstance;