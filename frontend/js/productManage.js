// ===============================
// PRODUCT MANAGEMENT - STANDALONE
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/html/login.html";
    return;
  }

  let editingProductId = null;

  // ------------------- FETCH API -------------------
  async function fetchData(endpoint) {
    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      return { error: true };
    }
  }

  // ------------------- LOAD CATEGORIES VÀO SELECT -------------------
  async function loadCategories(selectedCategoryIds = []) {
    const data = await fetchData("categories");
    const categories = data.categories || [];

    const categorySelect = document.getElementById("productCategories");
    if (!categorySelect) return;

    categorySelect.innerHTML = '';

    categories.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.maDanhMuc;
      option.textContent = c.tenDanhMuc;
      
      // Set selected nếu danh mục này trong danh sách đã chọn
      if (selectedCategoryIds.includes(c.maDanhMuc)) {
        option.selected = true;
      }
      
      categorySelect.appendChild(option);
    });
  }

  // ------------------- RENDER PRODUCTS -------------------
  async function renderProducts() {
    const data = await fetchData("products");
    const products = data.products || [];

    const tbody = document.querySelector("#productTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (products.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6'>Chưa có sản phẩm nào</td></tr>";
      return;
    }

    // Load categories để map tên
    const categoriesData = await fetchData("categories");
    const categories = categoriesData.categories || [];
    const categoryMap = {};
    categories.forEach(c => {
      categoryMap[c.maDanhMuc] = c.tenDanhMuc;
    });

    for (const p of products) {
      // Lấy danh mục của sản phẩm
      const productCategoriesData = await fetchData(`products/${p.maSP}/categories`);
      const productCategories = productCategoriesData.categories || [];
      
      // Tạo badges cho từng danh mục
      const categoryBadges = productCategories.length > 0
        ? productCategories
            .map(c => `<span style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 3px 8px; border-radius: 12px; font-size: 12px; margin: 2px;">${categoryMap[c.maDanhMuc] || c.maDanhMuc}</span>`)
            .join(" ")
        : '<span style="color: #999; font-style: italic;">Chưa phân loại</span>';

      const imgSrc = p.anhSP ? `/Asset/${p.anhSP}` : "/Asset/no-image.jpg";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.maSP}</td>
        <td>${p.tenSP}</td>
        <td>${Number(p.gia).toLocaleString()} VND</td>
        <td>${categoryBadges}</td>
        <td><img src="${imgSrc}" width="60" style="border-radius: 5px;" onerror="this.src='/Asset/no-image.jpg'"></td>
        <td>
          <button class="action-btn edit-btn" data-id="${p.maSP}">Sửa</button>
          <button class="action-btn delete-btn" data-id="${p.maSP}">Xóa</button>
        </td>`;
      tbody.appendChild(tr);
    }

    attachEventListeners();
  }

  // ------------------- GẮN SỰ KIỆN -------------------
  function attachEventListeners() {
    document.querySelectorAll("#productTable .edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        editProduct(id);
      });
    });

    document.querySelectorAll("#productTable .delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        deleteProduct(id);
      });
    });
  }

  // ------------------- MODAL SẢN PHẨM -------------------
  const modal = document.getElementById("productModal");
  const addBtn = document.getElementById("addProductBtn");
  const closeBtn = modal?.querySelector(".close");
  const form = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalTitle");

  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      modal.style.display = "block";
      modalTitle.innerText = "Thêm sản phẩm";
      form.reset();
      editingProductId = null;
      const currentImageDiv = document.getElementById("currentImage");
      if (currentImageDiv) currentImageDiv.style.display = "none";
      
      // Load categories vào select (không chọn gì)
      await loadCategories([]);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      form.reset();
      editingProductId = null;
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      form.reset();
      editingProductId = null;
    }
  });

  // ------------------- SUBMIT FORM (THÊM/SỬA) -------------------
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const tenSP = document.getElementById("productName").value.trim();
      const gia = document.getElementById("productPrice").value.trim();
      const moTa = document.getElementById("productDesc").value.trim();
      const soLuong = document.getElementById("productStock").value.trim();
      const anhSP = document.getElementById("productImage").files[0];

      // Lấy NHIỀU danh mục đã chọn
      const categorySelect = document.getElementById("productCategories");
      const selectedCategories = Array.from(categorySelect.selectedOptions)
        .map(option => option.value)
        .filter(val => val !== "");

      // DEBUG: Kiểm tra danh mục đã chọn
      console.log("Selected categories:", selectedCategories);

      if (!tenSP || !gia) {
        alert("Vui lòng nhập tên và giá sản phẩm!");
        return;
      }

      const formData = new FormData();
      formData.append("tenSP", tenSP);
      formData.append("gia", gia);
      formData.append("moTa", moTa);
      formData.append("soLuong", soLuong || 0);
      
      // Gửi danh mục dưới dạng JSON string
      formData.append("categories", JSON.stringify(selectedCategories));
      
      // DEBUG: Kiểm tra FormData
      console.log("FormData categories:", formData.get("categories"));
      
      if (anhSP) {
        formData.append("anhSP", anhSP);
      }

      if (editingProductId) {
        const currentImageDiv = document.getElementById("currentImage");
        const oldImage = currentImageDiv?.dataset.oldimage || "";
        formData.append("oldImage", oldImage);
      }

      try {
        const url = editingProductId
          ? `http://localhost:3000/api/products/${editingProductId}`
          : "http://localhost:3000/api/products";

        const method = editingProductId ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();

        console.log("Server response:", data); // DEBUG

        if (!res.ok) {
          alert(data.message || "Có lỗi xảy ra");
          return;
        }

        alert(data.message || "Thành công");
        modal.style.display = "none";
        form.reset();
        editingProductId = null;
        renderProducts();
      } catch (err) {
        console.error("Submit product error:", err);
        alert("Lỗi khi lưu sản phẩm");
      }
    });
  }

  // ------------------- SỬA SẢN PHẨM -------------------
  async function editProduct(id) {
    editingProductId = id;

    const data = await fetchData(`products/${id}`);
    if (data.error || !data.product) {
      alert("Không tìm thấy sản phẩm");
      return;
    }

    const product = data.product;

    document.getElementById("productName").value = product.tenSP;
    document.getElementById("productPrice").value = product.gia;
    document.getElementById("productDesc").value = product.moTa || "";
    document.getElementById("productStock").value = product.soLuong || 0;

    // Lấy danh mục hiện tại của sản phẩm
    const productCategoriesData = await fetchData(`products/${id}/categories`);
    const productCategories = productCategoriesData.categories || [];
    
    // Lấy danh sách ID danh mục
    const selectedCategoryIds = productCategories.map(c => c.maDanhMuc);
    
    // Load categories và auto-select các danh mục hiện tại
    await loadCategories(selectedCategoryIds);

    const currentImageDiv = document.getElementById("currentImage");
    if (product.anhSP) {
      currentImageDiv.innerHTML = `<img src="/Asset/${product.anhSP}" width="100" style="border-radius: 5px; margin-top: 10px;">`;
      currentImageDiv.dataset.oldimage = product.anhSP;
      currentImageDiv.style.display = "block";
    } else {
      currentImageDiv.style.display = "none";
    }

    modalTitle.innerText = "Sửa sản phẩm";
    modal.style.display = "block";
  }

  // ------------------- XÓA SẢN PHẨM -------------------
  async function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Xóa thất bại");
        return;
      }

      alert(data.message || "Xóa thành công");
      renderProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Lỗi khi xóa sản phẩm");
    }
  }

  // ------------------- LẮNG NGHE CHUYỂN TAB -------------------
  const productTab = document.querySelector('[data-tab="products"]');
  if (productTab) {
    productTab.addEventListener("click", () => {
      setTimeout(() => {
        renderProducts();
      }, 100);
    });
  }

  // ------------------- KHỞI TẠO -------------------
  const productsContent = document.getElementById("products");
  if (productsContent && productsContent.style.display !== "none") {
    renderProducts();
  }
});