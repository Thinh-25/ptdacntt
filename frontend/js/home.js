document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const userMenu = document.getElementById("userMenu");
  const userAvatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const cartBtn = document.getElementById("cartBtn");
  const cartCount = document.getElementById("cartCount");
  const searchInput = document.getElementById("searchInput");

  let allProducts = []; // lưu toàn bộ sản phẩm để tìm kiếm

  // -----------------------------
  // CẬP NHẬT GIAO DIỆN THEO LOGIN
  // -----------------------------
  function updateUI() {
    if (user && token) {
      // Ẩn login/register
      loginBtn.style.display = "none";
      registerBtn.style.display = "none";

      // Hiện avatar + tên
      userMenu.style.display = "flex";
      userName.innerText = user.name || "User";

      // Hiện giỏ hàng
      cartBtn.style.display = "flex";
      cartCount.innerText = user.cart?.length || 0;
    } else {
      loginBtn.style.display = "inline-block";
      registerBtn.style.display = "inline-block";

      userMenu.style.display = "none";
      cartBtn.style.display = "none";
    }
  }

  updateUI();

  // -----------------------------
  // XỬ LÝ SỰ KIỆN
  // -----------------------------
  loginBtn?.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  registerBtn?.addEventListener("click", () => {
    window.location.href = "register.html";
  });

  // Click avatar → hiện/ẩn dropdown
  userMenu?.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  // Click ra ngoài → ẩn dropdown
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      dropdownMenu.classList.remove("show");
    }
  });

  // Đăng xuất
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  });

  // -----------------------------
  // LOAD PRODUCTS (GIỮ NGUYÊN)
  // -----------------------------
  async function loadProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      allProducts = data.products;
      renderProducts(allProducts);
    } catch (error) {
      console.error("❌ Lỗi:", error);
    }
  }

  // -----------------------------
  // HIỂN THỊ SẢN PHẨM
  // -----------------------------
  function renderProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = "<p>Không tìm thấy sản phẩm</p>";
      return;
    }

    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product-card";

      const img = p.image ? `/Asset/${p.image}` : "/Asset/no-image.jpg";

      div.innerHTML = `
        <img src="${img}" class="product-img" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.price.toLocaleString()} VND</p>
      `;
      productList.appendChild(div);
    });
  }

  // -----------------------------
  // TÌM KIẾM
  // -----------------------------
  searchInput?.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );
    renderProducts(filtered);
  });

  loadProducts();
});
