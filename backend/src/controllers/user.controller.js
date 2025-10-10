import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register  = async(req,res)=> {
    try{
        const {username, email, password} = req.body;
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.cookie("jwt", token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "User resgistered successfully",
            user: {id: user._id, username: user.username, email: user.email},
        });

    } catch(e) {
        res.status(500).json({message: "Error in registering", error: e.message});
    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Store token in HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from "strict" to "lax" for better CORS support
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds (matches JWT expiry)
    });

    res.json({ 
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from "strict" to "lax"
    });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};

const me = async(req,res)=> {
    try{
      res.json({user: req.user});
    } catch(err){
      res.status(500).json({message: "Error fetching the user", error: err.message});
    }
};


export { register, login, logout, me};