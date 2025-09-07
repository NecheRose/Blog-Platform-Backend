import {Router} from "express";
import { createAdmin, manageUserRole, getAllUsers, deleteUser, getDashboardStats } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { superAdminOnly, adminOrSuperadminOnly } from "../middlewares/adminMiddleware.js";

const adminRouter = Router();

adminRouter
      .post("/create-admin", authMiddleware, superAdminOnly, createAdmin)   // SuperAdmin only
      .get("/users", authMiddleware, adminOrSuperadminOnly, getAllUsers)
      .delete("/users/:id", authMiddleware, adminOrSuperadminOnly, deleteUser)
      .patch("/users/:id/update-role", authMiddleware, adminOrSuperadminOnly, manageUserRole)
      .get("/stats", authMiddleware, adminOrSuperadminOnly, getDashboardStats)


export default adminRouter;







     