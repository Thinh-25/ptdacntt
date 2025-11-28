import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

// Đăng ký
export const register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

  User.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (result.length > 0)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    User.create({ name, email, password: hashedPassword }, (err, result) => {
      if (err) return res.status(500).json({ message: "Lỗi server" });
      res.json({ message: "Đăng ký thành công" });
    });
  });
};

// Đăng nhập
export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

  User.findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (result.length === 0)
      return res.status(400).json({ message: "Email không tồn tại" });

    const user = result[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ id: user.id, role: user.role }, "SECRET_KEY_123", {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};
