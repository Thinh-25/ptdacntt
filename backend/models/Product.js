import db from "../config/db.js";

const Product = {
  getAll: (callback) => {
    const sql = "SELECT * FROM products";
    db.query(sql, callback);
  },
};

export default Product;
