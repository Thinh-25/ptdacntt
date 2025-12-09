import express from "express";
import db from "../config/db.js";
const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM danhMuc", (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ danhMuc: data });
  });
});

export default router;
