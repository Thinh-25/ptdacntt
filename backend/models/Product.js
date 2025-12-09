import db from "../config/db.js";

class Product {
  static getAll(callback) {
    const sql = `
      SELECT sp.maSP, sp.tenSP, sp.gia, sp.anhSP, GROUP_CONCAT(dm.tenDanhMuc) as danhMuc
      FROM sanPham sp
      LEFT JOIN sanPham_DanhMuc sd ON sp.maSP = sd.maSP
      LEFT JOIN danhMuc dm ON sd.maDanhMuc = dm.maDanhMuc
      GROUP BY sp.maSP
    `;
    db.query(sql, callback);
  }

  static add({ tenSP, gia, anhSP }, callback) {
    const sql = "INSERT INTO sanPham (tenSP, gia, anhSP) VALUES (?, ?, ?)";
    db.query(sql, [tenSP, gia, anhSP], callback);
  }

  static update(maSP, { tenSP, gia, anhSP }, callback) {
    const sql = "UPDATE sanPham SET tenSP=?, gia=?, anhSP=? WHERE maSP=?";
    db.query(sql, [tenSP, gia, anhSP, maSP], callback);
  }

  static delete(maSP, callback) {
    const sql = "DELETE FROM sanPham WHERE maSP=?";
    db.query(sql, [maSP], callback);
  }
}

export default Product;
