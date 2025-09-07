import Category from "../models/categorySchema.js";
import Post from "../models/postSchema.js";
import slugify from "slugify";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ 
      name, 
      slug, 
      description 
    });

    await category.save();

    return res.status(201).json({ message: "Category created successfully", category });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) category.description = description;
    
    await category.save();
    res.json({ message: "Category updated successfully", category });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Check if category has posts before deleting
    const posts = await Post.find({ category: id });
    if (posts.length > 0) {
      return res.status(400).json({ message: "Cannot delete category with posts" });
    }

    await category.deleteOne();

    return res.status(201).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Categories (with post count)
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .lean()
      .populate("posts", "title status");

    // Add post count field
    const categoriesWithCount = categories.map((cat) => ({
      ...cat,
      postCount: cat.posts ? cat.posts.length : 0,
    }));

    return res.status(200).json(categoriesWithCount);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Single Category (with posts)
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate("posts", "title slug status author createdAt");

    if (!category) return res.status(404).json({ message: "Category not found" });

    return res.status(200).json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
