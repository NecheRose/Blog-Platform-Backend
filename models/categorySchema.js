import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, default: "" }
},{ 
    timestamps: true,
    toJSON: { virtuals: true }, // enable virtuals
    toObject: { virtuals: true }
  }
);


// Virtual: fetch all posts under a category
categorySchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "category",
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
