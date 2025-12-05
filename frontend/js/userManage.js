document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const tabs = document.querySelectorAll(".sidebar ul li");
  const tabContents = document.querySelectorAll(".tab-content");
  const logoutBtn = document.getElementById("logoutBtn");

  // ----- Chuyển tab -----
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

  // ----- Logout -----
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  // ----- Fetch API -----
  async function fetchData(endpoint) {
    const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  }

  // ----- Render Users -----
  async function renderUsers() {
    try {
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
    } catch (err) {
      console.error("Lỗi render users:", err);
    }
  }

  // ----- Render Orders -----
  async function renderOrders() {
    try {
      const data = await fetchData("orders");
      const orders = data.orders || [];
      const tbody = document.querySelector("#orderTable tbody");
      tbody.innerHTML = "";

      orders.forEach((o) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${o.id}</td>
          <td>${o.user}</td>
          <td>${o.status}</td>
          <td>${o.date}</td>
          <td>
            <button class="edit-btn" data-id="${o.id}">Cập nhật</button>
          </td>`;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error("Lỗi render orders:", err);
    }
  }

  // ----- Render Products -----
  async function renderProducts() {
    try {
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
          <td>${p.price.toLocaleString()}</td>
          <td><img src="${imgSrc}" width="60"></td>
          <td>
            <button class="edit-btn" data-id="${p.id}">Sửa</button>
            <button class="delete-btn" data-id="${p.id}">Xóa</button>
          </td>`;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error("Lỗi render products:", err);
    }
  }

  // ----- Modal thêm/sửa sản phẩm -----
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
      console.error(err);
      alert("Lỗi khi thêm sản phẩm");
    }
  });

  // ----- Khởi tạo -----
  renderUsers();
  renderOrders();
  renderProducts();
});
