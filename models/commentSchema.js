import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({ 
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },// null means it's a top-level comment. Allows nested replies (threaded discussions)
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, default: 0 } // optimization
},{ 
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true } // enable virtual fields
  });

// Virtual field: replies (Lets you populate nested replies easily)
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;