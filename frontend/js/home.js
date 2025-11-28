document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const searchInput = document.getElementById("searchInput");

  let allProducts = []; // lưu toàn bộ sản phẩm để tìm kiếm

  // Ẩn/hiện nút
  if (user && token) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/index.html";
  });

  loginBtn?.addEventListener(
    "click",
    () => (window.location.href = "./html/login.html")
  );
  registerBtn?.addEventListener(
    "click",
    () => (window.location.href = "./html/register.html")
  );

  // ===== LOAD PRODUCTS =====
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

  // ===== HIỂN THỊ SẢN PHẨM =====
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

  // ===== TÌM KIẾM =====
  searchInput?.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();

    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );

    renderProducts(filtered);
  });

  loadProducts();
});
