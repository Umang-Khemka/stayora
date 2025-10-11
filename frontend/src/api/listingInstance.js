import axios from "axios";

const listingInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/listings"
      : "/api/v1/listings",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default listingInstance;