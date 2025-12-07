import Category from "../models/Category.js";

// Lấy danh sách danh mục
export const getCategories = (req, res) => {
  Category.getAll((err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ categories: result });
  });
};

// Thêm danh mục mới
export const addCategory = (req, res) => {
  const { tenDanhMuc } = req.body;
  if (!tenDanhMuc)
    return res
      .status(400)
      .json({ message: "Tên danh mục không được để trống" });

  Category.create(tenDanhMuc, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Thêm danh mục thành công", id: result.insertId });
  });
};

// Cập nhật danh mục
export const updateCategory = (req, res) => {
  const { maDanhMuc } = req.params;
  const { tenDanhMuc } = req.body;

  if (!tenDanhMuc)
    return res
      .status(400)
      .json({ message: "Tên danh mục không được để trống" });

  Category.update(maDanhMuc, tenDanhMuc, (err) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    res.json({ message: "Cập nhật danh mục thành công" });
  });
};

// Xóa danh mục
export const deleteCategory = (req, res) => {
  const { maDanhMuc } = req.params;

  Category.delete(maDanhMuc, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server", error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    res.json({ message: "Xóa danh mục thành công" });
  });
};
