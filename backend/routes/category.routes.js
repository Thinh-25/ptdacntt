import express from "express";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory, // thêm import delete
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.put("/:maDanhMuc", updateCategory);
router.delete("/:maDanhMuc", deleteCategory); // thêm route DELETE

export default router;
