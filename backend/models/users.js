import db from "../config/db.js";

class User {
  static findByEmail(email, callback) {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  }

  static create({ ten, email, matKhau, role = "user" }, callback) {
    // role mặc định user
    db.query(
      "INSERT INTO users (ten, email, matKhau, role) VALUES (?, ?, ?, ?)",
      [ten, email, matKhau, role],
      callback
    );
  }

  static getAll(callback) {
    db.query("SELECT id, ten, email, role FROM users", callback);
  }

  static delete(id, callback) {
    db.query("DELETE FROM users WHERE id = ?", [id], callback);
  }

  static updateRole(id, role, callback) {
    db.query("UPDATE users SET role = ? WHERE id = ?", [role, id], callback);
  }
}

export default User;
