import db from "../config/db.js";

export default class Category {
  // Lấy tất cả danh mục
  static getAll(callback) {
    const sql = "SELECT maDanhMuc, tenDanhMuc FROM danhMuc";
    db.query(sql, callback);
  }

  // Thêm danh mục
  static create(tenDanhMuc, callback) {
    const sql = "INSERT INTO danhMuc (tenDanhMuc) VALUES (?)";
    db.query(sql, [tenDanhMuc], callback);
  }

  // Cập nhật danh mục
  static update(maDanhMuc, tenDanhMuc, callback) {
    const sql = "UPDATE danhMuc SET tenDanhMuc = ? WHERE maDanhMuc = ?";
    db.query(sql, [tenDanhMuc, maDanhMuc], callback);
  }

  // Xóa danh mục
  static delete(maDanhMuc, callback) {
    const sql = "DELETE FROM danhMuc WHERE maDanhMuc = ?";
    db.query(sql, [maDanhMuc], callback);
  }
}
