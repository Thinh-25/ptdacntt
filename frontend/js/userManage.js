document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/login.html";
    return;
  }

  const tabs = document.querySelectorAll(".sidebar ul li");
  const tabContents = document.querySelectorAll(".tab-content");
  const logoutBtn = document.getElementById("logoutBtn");

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
  async function fetchData(endpoint) {
    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        alert("Token hết hạn, vui lòng đăng nhập lại!");
        localStorage.clear();
        window.location.href = "/login.html";
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
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>
          <button class="edit-btn" data-id="${u.id}">Sửa</button>
          <button class="delete-btn" data-id="${u.id}">Xóa</button>
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

    orders.forEach((o) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.id}</td>
        <td>${o.user_name}</td>
        <td>${o.status}</td>
        <td>${o.date}</td>
        <td><button class="edit-btn" data-id="${o.id}">Cập nhật</button></td>`;
      tbody.appendChild(tr);
    });
  }

  // ------------------- RENDER PRODUCTS -------------------
  async function renderProducts() {
    const data = await fetchData("products");
    const products = data.products || [];

    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";

    products.forEach((p) => {
      const imgSrc = p.image ? `/Asset/${p.image}` : "/Asset/no-image.jpg";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${Number(p.price).toLocaleString()}</td>
        <td><img src="${imgSrc}" width="60"></td>
        <td>
          <button class="edit-btn" data-id="${p.id}">Sửa</button>
          <button class="delete-btn" data-id="${p.id}">Xóa</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------------------- MODAL SẢN PHẨM -------------------
  const modal = document.getElementById("productModal");
  const addBtn = document.getElementById("addProductBtn");
  const closeBtn = modal.querySelector(".close");
  const form = document.getElementById("productForm");

  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
    document.getElementById("modalTitle").innerText = "Thêm sản phẩm";
    form.reset();
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // ------------------- SUBMIT THÊM SP -------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Thành công");
      modal.style.display = "none";
      renderProducts();
    } catch (err) {
      console.error("Add product lỗi:", err);
      alert("Lỗi khi thêm sản phẩm");
    }
  });

  // ------------------- KHỞI TẠO -------------------
  renderUsers();
  renderOrders();
  renderProducts();
});
