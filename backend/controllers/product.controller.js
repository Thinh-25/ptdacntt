import Product from "../models/Product.js";
import path from "path";
import fs from "fs";

// Lấy tất cả sản phẩm
export const getProducts = (req, res) => {
  Product.getAll((err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });

    res.json({ products: result });
  });
};

// Lấy sản phẩm theo ID
export const getProductById = (req, res) => {
  const { maSP } = req.params;

  Product.getById(maSP, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    if (!result.length)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    res.json({ product: result[0] });
  });
};

// Thêm sản phẩm mới
export const addProduct = (req, res) => {
  const { tenSP, gia, moTa, soLuong } = req.body;
  let anhSP = null;

  if (req.file) {
    anhSP = req.file.filename; // tên file lưu trong folder uploads
  }

  if (!tenSP || !gia) {
    return res
      .status(400)
      .json({ message: "Tên và giá sản phẩm không được để trống" });
  }

  const newProduct = {
    tenSP,
    gia,
    moTa: moTa || "",
    anhSP,
    soLuong: soLuong || 0,
  };

  Product.create(newProduct, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });

    res.json({ message: "Thêm sản phẩm thành công", id: result.insertId });
  });
};

// Cập nhật sản phẩm
export const updateProduct = (req, res) => {
  const { maSP } = req.params;
  const { tenSP, gia, moTa, soLuong } = req.body;
  let anhSP = null;

  if (req.file) {
    anhSP = req.file.filename;
  }

  const updatedProduct = {
    tenSP,
    gia,
    moTa: moTa || "",
    anhSP,
    soLuong: soLuong || 0,
  };

  Product.update(maSP, updatedProduct, (err) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });

    res.json({ message: "Cập nhật sản phẩm thành công" });
  });
};

// Xóa sản phẩm
export const deleteProduct = (req, res) => {
  const { maSP } = req.params;

  Product.delete(maSP, (err) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });

    res.json({ message: "Xóa sản phẩm thành công" });
  });
};
