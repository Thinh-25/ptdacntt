import db from "../config/db.js";

class User {
  static findByEmail(email, callback) {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  }

  static create({ name, email, password }, callback) {
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      [name, email, password],
      callback
    );
  }
}

export default User;
