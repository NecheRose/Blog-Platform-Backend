import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  tags: { type: String },   // Hash tags
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  images: [{ type: String }],
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;