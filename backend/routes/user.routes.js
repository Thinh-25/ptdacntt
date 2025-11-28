import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/users -> chỉ admin mới truy cập
router.get("/", verifyToken, verifyAdmin, getAllUsers);

export default router;
