import {Router} from "express";
import { createPost, updatePost, deletePost, getPosts, getPostById, toggleLikePost } from "../controllers/barrel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multer.js"; 

const postRouter = Router();

postRouter
    .get("/", getPosts) // public
    .get("/:id", getPostById) // public

    .post("/", authMiddleware, upload.array("images"), createPost)
    .patch("/:id", authMiddleware, upload.array("images"), updatePost) // author/admin
    .delete("/:id", authMiddleware, deletePost) // author/admin

    .post("/:id/like", authMiddleware, toggleLikePost)

export default postRouter;
