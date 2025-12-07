import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// --- Cấu hình đường dẫn tuyệt đối ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Cấu hình multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../frontend/Asset"));
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, gif, webp)"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// --- Routes sản phẩm ---

// Lấy tất cả sản phẩm
router.get("/", verifyToken, (req, res) => {
  Product.getAll((err, products) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json({ products });
  });
});

// Lấy sản phẩm theo ID
router.get("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  Product.getById(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (!result.length)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(result[0]);
  });
});

// Thêm sản phẩm
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  (req, res) => {
    const { tenSP, gia, moTa, soLuong } = req.body;
    const anhSP = req.file ? req.file.filename : null;

    const newProduct = { tenSP, gia, moTa, anhSP, soLuong };
    Product.create(newProduct, (err, result) => {
      if (err)
        return res.status(500).json({ message: "Lỗi server", error: err });
      res.json({
        message: "Thêm sản phẩm thành công",
        productId: result.insertId,
      });
    });
  }
);

// Cập nhật sản phẩm
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  (req, res) => {
    const id = req.params.id;
    const { tenSP, gia, moTa, soLuong } = req.body;
    const anhSP = req.file ? req.file.filename : null;

    const updatedProduct = { tenSP, gia, moTa, anhSP, soLuong };
    Product.update(id, updatedProduct, (err) => {
      if (err)
        return res.status(500).json({ message: "Lỗi server", error: err });
      res.json({ message: "Cập nhật sản phẩm thành công" });
    });
  }
);

// Xóa sản phẩm
router.delete("/:id", verifyToken, verifyAdmin, (req, res) => {
  const id = req.params.id;
  Product.delete(id, (err) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Xóa sản phẩm thành công" });
  });
});

export default router;
