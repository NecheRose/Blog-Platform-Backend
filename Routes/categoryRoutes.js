import {Router} from "express";
import { createCategory, updateCategory, deleteCategory, getCategories, getCategoryById } from "../controllers/barrel.js";
import { authMiddleware  } from "../middlewares/authMiddleware.js";
import { adminOrSuperadminOnly  } from "../middlewares/adminMiddleware.js";

const categoryRouter = Router();

categoryRouter
      // Public
      .get("/", getCategories)
      .get("/:id", getCategoryById)

      // Admin/Superadmin only
      .post("/create", authMiddleware, adminOrSuperadminOnly, createCategory)
      .patch("/:id", authMiddleware, adminOrSuperadminOnly, updateCategory)
      .delete("/:id", authMiddleware, adminOrSuperadminOnly, deleteCategory)

export default categoryRouter;
