import mongoose from "mongoose";



const profileSchema = new mongoose.Schema({
  image: { type: String, default: null }, // URL to profile picture
  bio: { type: String, maxlength: 300, default: "" }
}, { _id: false });


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "editor", "admin", "superadmin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  profile: { type: profileSchema, default: {}},
  action: {type: String, default: "action"}, // Updating user role
  verificationToken: String, 
  verificationTokenExpiry: Date,
  passwordResetToken: String,  
  passwordResetExpiry: Date,
  isActive: { type: Boolean, default: true }
  },{ timestamps: true }
);


const User = mongoose.model("User", userSchema);

 export default User;