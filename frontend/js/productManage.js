document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/html/login.html";
    return;
  }
 async function fetchData(endpoint) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.json();
}

 // ------------------- RENDER PRODUCTS -------------------
  async function renderProducts() {
    const data = await fetchData("products");
    const products = data.products || [];

    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";

    if (products.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5'>Chưa có sản phẩm nào</td></tr>";
      return;
    }

    products.forEach((p) => {
      const imgSrc = p.anhSP ? `/Asset/${p.anhSP}` : "/Asset/no-image.jpg";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.maSP}</td>
        <td>${p.tenSP}</td>
        <td>${Number(p.gia).toLocaleString()} VND</td>
        <td><img src="${imgSrc}" width="60" style="border-radius: 5px;"></td>
        <td>
          <button class="action-btn edit-btn" onclick="editProduct(${p.maSP})">Sửa</button>
          <button class="action-btn delete-btn" onclick="deleteProduct(${p.maSP})">Xóa</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }

  // ------------------- MODAL SẢN PHẨM -------------------
  const modal = document.getElementById("productModal");
  const addBtn = document.getElementById("addProductBtn");
  const closeBtn = modal.querySelector(".close");
  const form = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalTitle");

  // Mở modal thêm sản phẩm
  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
    modalTitle.innerText = "Thêm sản phẩm";
    form.reset();
    editingProductId = null;
    document.getElementById("currentImage").style.display = "none";
  });

  // Đóng modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    editingProductId = null;
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      form.reset();
      editingProductId = null;
    }
  });

  // ------------------- SUBMIT FORM (THÊM/SỬA) -------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tenSP = document.getElementById("productName").value.trim();
    const gia = document.getElementById("productPrice").value.trim();
    const moTa = document.getElementById("productDesc").value.trim();
    const soLuong = document.getElementById("productStock").value.trim();
    const anhSP = document.getElementById("productImage").files[0];

    if (!tenSP || !gia) {
      alert("Vui lòng nhập tên và giá sản phẩm!");
      return;
    }

    const formData = new FormData();
    formData.append("tenSP", tenSP);
    formData.append("gia", gia);
    formData.append("moTa", moTa);
    formData.append("soLuong", soLuong || 0);
    
    if (anhSP) {
      formData.append("anhSP", anhSP);
    }

    // Nếu đang sửa, gửi ảnh cũ
    if (editingProductId) {
      const oldImage = document.getElementById("currentImage").dataset.oldimage;
      formData.append("oldImage", oldImage || "");
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

  // ------------------- SỬA SẢN PHẨM -------------------
  window.editProduct = async (id) => {
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

    // Hiển thị ảnh hiện tại
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
  };

  // ------------------- XÓA SẢN PHẨM -------------------
  window.deleteProduct = async (id) => {
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
  };
    // ------------------- KHỞI TẠO -------------------
    renderProducts();
});