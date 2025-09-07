import {Router} from "express";
import { createComment, updateComment, deleteComment, getCommentsByPost, toggleLikeComment } from "../controllers/barrel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const commentRouter = Router();

commentRouter
    .get("/:postId", getCommentsByPost) // public
    .post("/:postId", authMiddleware, createComment) 
    .put("/:id", authMiddleware, updateComment)
    .delete("/:id", authMiddleware, deleteComment) // author/admin
    .post("/:id/like", authMiddleware, toggleLikeComment)

export default commentRouter;
