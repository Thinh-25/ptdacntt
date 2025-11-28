document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const messageEl = document.getElementById("message");
  const loginBtn = document.getElementById("loginBtn");

  // Xử lý submit register
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (!name || !email || !password || !confirmPassword) {
      messageEl.textContent = "Vui lòng nhập đầy đủ thông tin";
      return;
    }

    if (password !== confirmPassword) {
      messageEl.textContent = "Mật khẩu và xác nhận mật khẩu không khớp";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        messageEl.textContent = data.message || "Đăng ký thất bại";
        return;
      }

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      messageEl.textContent = "Lỗi server. Vui lòng thử lại";
    }
  });

  // Xử lý nút đăng nhập
  loginBtn?.addEventListener("click", () => {
    window.location.href = "/login";
  });
});
