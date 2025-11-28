import express from "express";
import { getProducts } from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getProducts);

export default router;
