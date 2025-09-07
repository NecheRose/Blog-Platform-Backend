import express from "express";
import dotenv from "dotenv";
import { adminRouter, authRouter, categoryRouter, commentRouter, postRouter, userRouter } from "./Routes/barrel.js";
import { connectDB } from "./lib/mongodb.js";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000

// Connect database
connectDB();        

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/comments', commentRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));