document.addEventListener("DOMContentLoaded", () => {
  const productTable = document.querySelector("#productTable tbody");
  const modal = document.getElementById("productModal");
  const addBtn = document.getElementById("addProductBtn");
  const closeBtn = modal.querySelector(".close");
  const form = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalTitle");

  let editId = null;

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    renderProducts(data.products);
  }

  function renderProducts(products) {
    productTable.innerHTML = "";
    products.forEach((p) => {
      const imgSrc = p.anhSP ? `/Asset/${p.anhSP}` : "/Asset/no-image.jpg";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.maSP}</td>
        <td>${p.tenSP}</td>
        <td>${Number(p.gia).toLocaleString()}</td>
        <td><img src="${imgSrc}" width="60"></td>
        <td>${p.danhMuc || ""}</td>
        <td>
          <button class="edit-btn" data-id="${p.maSP}">Sửa</button>
          <button class="delete-btn" data-id="${p.maSP}">Xóa</button>
        </td>
      `;
      productTable.appendChild(tr);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.id));
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
    });
  }

  function openModal(id = null) {
    editId = id;
    modal.style.display = "block";
    modalTitle.textContent = id ? "Sửa sản phẩm" : "Thêm sản phẩm";
    form.reset();
  }

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tenSP = document.getElementById("productName").value;
    const gia = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").files[0];

    const formData = new FormData();
    formData.append("tenSP", tenSP);
    formData.append("gia", gia);
    if (image) formData.append("image", image);

    const url = editId ? `/api/products/${editId}` : "/api/products";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();
    alert(data.message || "Thành công");
    modal.style.display = "none";
    fetchProducts();
  });

  async function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message || "Đã xóa");
    fetchProducts();
  }

  addBtn.addEventListener("click", () => openModal());
  fetchProducts();
});
