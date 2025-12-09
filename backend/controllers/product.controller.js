import Product from "../models/Product.js";
import multer from "multer";
import path from "path";

// Lưu ảnh trực tiếp vào frontend/Asset
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/Asset");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    cb(null, "sp-" + Date.now() + "." + ext);
  },
});

export const upload = multer({ storage });

export const getProducts = (req, res) => {
  Product.getAll((err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ products: result });
  });
};

export const addProduct = (req, res) => {
  const { tenSP, gia } = req.body;
  const anhSP = req.file ? req.file.filename : null;

  Product.add({ tenSP, gia, anhSP }, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Thêm sản phẩm thành công!" });
  });
};

export const updateProduct = (req, res) => {
  const maSP = req.params.maSP;
  const { tenSP, gia } = req.body;
  const anhSP = req.file ? req.file.filename : null;

  Product.update(maSP, { tenSP, gia, anhSP }, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Cập nhật sản phẩm thành công!" });
  });
};

export const deleteProduct = (req, res) => {
  const maSP = req.params.maSP;
  Product.delete(maSP, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Xóa sản phẩm thành công!" });
  });
};
