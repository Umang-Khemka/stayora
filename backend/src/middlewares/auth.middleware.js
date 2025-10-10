import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { authMiddleware };