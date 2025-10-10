import axios from "axios";

const reviewInstance = axios.create({
  baseURL:"http://localhost:5000/api/v1/reviews",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default reviewInstance;