import User from "../models/userSchema.js";
import Post from "../models/postSchema.js";
import Comment from "../models/commentSchema.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { sendMail, successfulAdminCreation } from "../services/emailService.js";


// superadmin only
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validations
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All input fields are required" })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format. Please check your input." });
    }
  
    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
  
    // Only superadmin can create admins
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    await newAdmin.save();

    // Success email to admin 
    await sendMail(successfulAdminCreation(email, username, password))

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    console.error("Error creating admin:", err)
    res.status(500).json({ message: "Admin creation failed", error: err.message });
  }
};


// upgrade roles of existing users (with restrictions)
export const manageUserRole = async (req, res) => {
  try {
    const { id } = req.params; // id of user being upgraded
    const { action, role } = req.body;

    // Update role of existing user (admin/superadmin)
    if (action === "update") {
      if (!id) {
        return res.status(400).json({ message: "User ID required for update" });
      }

      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only allow valid roles
      if (!["user", "editor", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Role-based restrictions
      if (req.user.role === "admin" && role === "admin") {
        return res.status(403).json({ message: "Admins cannot assign admin role" });
      }

      if (req.user.role === "editor" || req.user.role === "user") {
        return res.status(403).json({ message: "You do not have permission to update roles" });
      }

      targetUser.role = role;

      await targetUser.save();

      return res.status(200).json({
        message: "User role updated successfully",
        user: { id: targetUser._id, username: targetUser.username, role: targetUser.role },
      });
    }
  } catch (err) {
    console.error("Error managing role:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


// Get all users (with posts & comments)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean(); // exclude password

    // Attach posts and comments per user
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const posts = await Post.find({ author: user._id })
          .select("title slug status createdAt")
          .lean();

        const comments = await Comment.find({ author: user._id })
          .select("content post createdAt")
          .populate("post", "title slug") // show which post comment belongs to
          .lean();

        return {...user, posts, comments };
      })
    );

    return res.status(200).json({ message: "Users fetched successfully", users: usersWithDetails });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};


// Delete user (ban/remove account)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, delete posts & comments by user
    await Post.deleteMany({ author: id });
    await Comment.deleteMany({ author: id });

    res.status(200).json({ message: "User and related content deleted" });
  } catch (err) {
    console.error("Error deleting user:", err)
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();

    res.status(200).json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments
      }
    });
  } catch (err) {
    console.error("Error getting dashboard stats:", err)
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

