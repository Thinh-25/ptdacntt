import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  upload,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.single("image"), addProduct);
router.put("/:maSP", upload.single("image"), updateProduct);
router.delete("/:maSP", deleteProduct);

export default router;
