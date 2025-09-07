import Comment from "../models/commentSchema.js";
import Post from "../models/postSchema.js";


// Create a comment (post reply)
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params; 
    const { content, parentComment } = req.body;

    // Ensure post exists
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      post: postId,
      author: req.user.id,
      content,
      parentComment: parentComment || null,
    });

    await comment.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params; // comment ID
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only author can update
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.content = content || comment.content;

    await comment.save();

    return res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only author or admin can delete
    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get comments for a post (with replies)
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate("author", "username profile.avatar")
      .populate({
        path: "replies",
        populate: { path: "author", select: "username profile.avatar" }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Like / Unlike comment
export const toggleLikeComment = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((uid) => uid.toString() !== userId);
      comment.likesCount -= 1;
    } else {
      comment.likes.push(userId);
      comment.likesCount += 1;
    }

    await comment.save();

    return res.status(200).json({ message: "Like status updated", likesCount: comment.likesCount });
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
