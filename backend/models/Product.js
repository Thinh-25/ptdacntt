import db from "../config/db.js";

const Product = {
  getAll: (callback) => {
    const sql = "SELECT * FROM sanPham";
    db.query(sql, callback);
  },
};

export default Product;
