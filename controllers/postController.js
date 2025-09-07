import Post from "../models/postSchema.js";
import cloudinary from "../lib/cloudinary.js"; 
import slugify from "slugify"


// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    //  Handle image uploads
    let images = [];

    if (req.file) {
      // Convert buffer to base64
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: "todo-api/avatars",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });

      images = result.secure_url;
    }

    const slug = slugify(String(title), { lower: true, strict: true });

    const post = new Post({
      title,
      slug,
      content,
      author: req.user.id,
      category,
      tags: tags || null,
      status,
      images,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Edit Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, status } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author or admin can update
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (title) {
      post.title = title;
      post.slug = title.slugify(title, { lower: true, strict: true });
    }
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (status) post.status = status;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "blog_posts" })
        )
      );
      post.images.push(...uploads.map((upload) => upload.secure_url));
    }

    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author or admin can delete
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts (public, readers only)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profile.avatar")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single post (increment views)
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "username profile.avatar")
      .populate("category", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Like / Unlike post
export const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((uid) => uid.toString() !== userId);
      post.likesCount -= 1;
    } else {
      post.likes.push(userId);
      post.likesCount += 1;
    }

    await post.save();

    return res.status(200).json({ message: "Like status updated", likesCount: post.likesCount });
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};