document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/html/login.html";
    return;
  }

  const tabs = document.querySelectorAll(".sidebar ul li");
  const tabContents = document.querySelectorAll(".tab-content");
  const logoutBtn = document.getElementById("logoutBtn");

  let editingProductId = null; // Lưu ID sản phẩm đang sửa

  // ------------------- CHUYỂN TAB -------------------
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.dataset.tab;
      tabContents.forEach(
        (tc) => (tc.style.display = tc.id === target ? "block" : "none")
      );
    });
  });

  // ------------------- LOGOUT -------------------
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/html/index.html";
  });

  // ------------------- FETCH API (có token) -------------------
  async function fetchData(endpoint, options = {}) {
    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        alert("Bạn không có quyền truy cập!");
        localStorage.clear();
        window.location.href = "/html/login.html";
        return;
      }

      return await res.json();
    } catch (err) {
      console.error("Fetch Error:", err);
      return { error: true };
    }
  }

  // ------------------- RENDER USERS -------------------
  async function renderUsers() {
    const data = await fetchData("users");
    const users = data.users || [];

    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    users.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.ten}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button class="action-btn edit-btn" data-id="${u.id}">Sửa</button>
          <button class="action-btn delete-btn" data-id="${u.id}">Xóa</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------------------- RENDER ORDERS -------------------
  async function renderOrders() {
    const data = await fetchData("orders");
    const orders = data.orders || [];

    const tbody = document.querySelector("#orderTable tbody");
    tbody.innerHTML = "";

    if (orders.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>Chưa có đơn hàng nào</td></tr>";
      return;
    }

    orders.forEach((o) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.user_name}</td>
        <td>${o.status}</td>
        <td>${o.date}</td>
        <td><button class="action-btn edit-btn" data-id="${o.id}">Cập nhật</button></td>`;
      tbody.appendChild(tr);
    });
  }
  // ------------------- KHỞI TẠO -------------------
  renderUsers();
  renderOrders();
});