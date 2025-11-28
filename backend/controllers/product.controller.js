import Product from "../models/Product.js";

export const getProducts = (req, res) => {
  Product.getAll((err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });

    res.json({ products: result });
  });
};
