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
  const searchBtn = document.getElementById("searchBtn");

  let allProducts = [];

  // ================= LOAD SẢN PHẨM =================
  async function loadProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();

      if (!res.ok) return;

      allProducts = data.products;
      renderProducts(allProducts);
    } catch (err) {
      console.error("❌ Lỗi:", err);
    }
  }

  // ================= HIỂN THỊ SẢN PHẨM + CLICK CHI TIẾT =================
  function renderProducts(products) {
    const productList = document.getElementById("productList");
    if (!productList) return;

    productList.innerHTML = "";

    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product-card";

      const imgSrc = p.anhSP ? `/Asset/${p.anhSP}` : "/Asset/no-image.jpg";

      div.innerHTML = `
        <img src="${imgSrc}" class="product-img" alt="${p.tenSP}">
        <h3>${p.tenSP}</h3>
        <p>${Number(p.gia).toLocaleString()} VND</p>
      `;

      // ⭐ CLICK → TRANG CHI TIẾT
      div.addEventListener("click", () => {
        window.location.href = `/html/productDetail.html?id=${p.maSP}`;
      });

      productList.appendChild(div);
    });
  }
  // ---------------- Logo click ----------------
  document.getElementById("logo")?.addEventListener("click", () => {
    window.location.href = "/html/index.html";
  });

  // ================= TÌM KIẾM → TRANG KHÁC =================

  function goToSearch() {
    const keyword = searchInput.value.trim();
    if (keyword === "") return;

    window.location.href = `/html/search.html?keyword=${encodeURIComponent(
      keyword
    )}`;
  }

  // Nhấn nút Tìm
  searchBtn?.addEventListener("click", goToSearch);

  // Nhấn Enter trong ô tìm kiếm
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      goToSearch();
    }
  });

  // Load sản phẩm
  loadProducts();
});
