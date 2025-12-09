import express from "express";
import path from "path";

import fileUpload from "express-fileupload";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import khoRoutes from "./routes/kho.routes.js";

const app = express();
app.use("/api/products", productRoutes);

app.use(express.json());
app.use(fileUpload());
const __dirname = path.resolve();

// ------------------ API ROUTES ------------------

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/kho", khoRoutes);

// ------------------ STATIC FRONTEND ------------------
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/index.html"))
);

app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/login.html"))
);

app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/html/register.html"))
);

// Serve uploads
app.use("/Asset", express.static(path.join(__dirname, "../frontend/Asset")));

// ------------------ START SERVER ------------------
app.listen(3000, () => {
  console.log("🚀 Server chạy tại http://localhost:3000");
});
