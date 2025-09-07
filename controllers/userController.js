import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";



// Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error getting profile", err)
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If image uploaded, push to cloudinary
    if (req.file) {
      // Convert buffer to base64
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: "Blog-api/images",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });

      user.profile.image = result.secure_url;
    }

    // Update text fields
    if (bio !== undefined) user.profile.bio = bio;
   
    await user.save();

    res.json({
      message: "Profile updated successfully",
      profile: user.profile,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Change password while logged in
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error getting profile", err)
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error getting profile", err)
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
