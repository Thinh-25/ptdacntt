document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const messageEl = document.getElementById("message");
  const registerBtn = document.getElementById("registerBtn");

  // Xử lý submit form login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      messageEl.textContent = "Vui lòng nhập đầy đủ thông tin";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        messageEl.textContent = data.message || "Đăng nhập thất bại";
        return;
      }

      // Lưu token và user vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect theo role
      if (data.user.role === "admin") {
        window.location.href = "/html/userManage.html";
      } else {
        window.location.href = "/html/index.html";
      }
    } catch (error) {
      console.error(error);
      messageEl.textContent = "Lỗi server. Vui lòng thử lại";
    }
  });

  // Xử lý nút đăng ký
  registerBtn?.addEventListener("click", () => {
    window.location.href = "/register"; // chuyển sang trang register
  });
});
