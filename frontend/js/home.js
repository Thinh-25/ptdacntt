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

  let allProducts = [];
  let cartCountFromDB = 0;

  // --- CẬP NHẬT GIAO DIỆN THEO LOGIN ---
  function updateUI() {
    if (user && token) {
      loginBtn.style.display = "none";
      registerBtn.style.display = "none";

      userMenu.style.display = "flex";
      userName.innerText = user.ten || "User";

      cartBtn.style.display = "flex";
      cartCount.innerText = cartCountFromDB || 0;
    } else {
      loginBtn.style.display = "inline-block";
      registerBtn.style.display = "inline-block";

      userMenu.style.display = "none";
      cartBtn.style.display = "none";
    }
  }

  updateUI();

  // --- SỰ KIỆN CLICK LOGIN/REGISTER ---
  loginBtn?.addEventListener("click", () => {
    window.location.href = "/html/login.html";
  });

  registerBtn?.addEventListener("click", () => {
    window.location.href = "/html/register.html";
  });

  // --- CLICK AVATAR/TÊN HIỆN DROPDOWN ---
  userMenu?.addEventListener("click", (e) => {
    dropdownMenu.classList.toggle("show");
    e.stopPropagation();
  });

  // --- CLICK RA NGOÀI ẨN DROPDOWN ---
  document.addEventListener("click", () => {
    dropdownMenu.classList.remove("show");
  });

  // --- LOGOUT ---
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  });

  // --- LOAD PRODUCTS ---
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

  // --- HIỂN THỊ SẢN PHẨM ---
  function renderProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = "<p style='text-align: center; color: #999;'>Không tìm thấy sản phẩm</p>";
      return;
    }

    products.forEach((p) => {
      const div = document.createElement("div");
      div.className = "product-card";

      // Sử dụng đúng tên cột từ DB: anhSP, tenSP, gia
      const img = p.anhSP ? `/Asset/${p.anhSP}` : "/Asset/no-image.jpg";

      div.innerHTML = `
        <img src="${img}" class="product-img" alt="${p.tenSP}" onerror="this.src='/Asset/no-image.jpg'">
        <h3>${p.tenSP}</h3>
        <p>${Number(p.gia).toLocaleString()} VND</p>
      `;
      productList.appendChild(div);
    });
  }

  // --- TÌM KIẾM ---
  searchInput?.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();
    const filtered = allProducts.filter((p) =>
      p.tenSP.toLowerCase().includes(keyword)
    );
    renderProducts(filtered);
  });

  loadProducts();
});