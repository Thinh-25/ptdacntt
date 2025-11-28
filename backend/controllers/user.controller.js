import User from "../models/users.js";

export const getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json({ users });
  });
};
