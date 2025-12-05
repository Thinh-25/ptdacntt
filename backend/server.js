import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

import User from "./models/users.js";
import bcrypt from "bcryptjs";

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Phục vụ static folder frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Frontend routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/index.html"))
);

app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/login.html"))
);

app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/register.html"))
);

// Nếu muốn phục vụ ảnh upload
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../frontend/uploads"))
);

// Start server
app.listen(3000, () => {
  console.log("🚀 Server chạy tại http://localhost:3000");
});
