document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/login.html";
    return;
  }

  const tableBody = document.querySelector("#categoryTable tbody");
  const addBtn = document.getElementById("addCategoryBtn");
  const modal = document.getElementById("categoryModal");
  const closeBtn = modal.querySelector(".close");
  const form = document.getElementById("categoryForm");
  const modalTitle = document.getElementById("categoryModalTitle");
  const categoryInput = document.getElementById("categoryName");

  let editId = null; // Lưu ID danh mục khi sửa

  // ------------------- FETCH API -------------------
  async function fetchData(endpoint = "", options = {}) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type":
        options.body instanceof FormData ? undefined : "application/json",
    };
    const res = await fetch(
      `http://localhost:3000/api/categories${endpoint}`,
      options
    );
    if (!res.ok) throw new Error("Lỗi khi gọi API");
    return await res.json();
  }

  // ------------------- RENDER DANH MỤC -------------------
  async function renderCategories() {
    try {
      const data = await fetchData();
      tableBody.innerHTML = "";
      (data.categories || []).forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.maDanhMuc}</td>
          <td>${c.tenDanhMuc}</td>
          <td>
            <button class="edit-btn" data-id="${c.maDanhMuc}" data-name="${c.tenDanhMuc}" 
              style="background:#2196f3;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">✏️ Sửa</button>
            <button class="delete-btn" data-id="${c.maDanhMuc}" 
              style="background:red;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">🗑️ Xóa</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
      initEditButtons();
      initDeleteButtons();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải danh mục");
    }
  }

  // ------------------- MỞ MODAL THÊM -------------------
  addBtn.addEventListener("click", () => {
    editId = null;
    modalTitle.innerText = "Thêm danh mục";
    form.reset();
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // ------------------- SUBMIT THÊM/SỬA -------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = categoryInput.value.trim();
    if (!name) return alert("Tên danh mục không được để trống");

    try {
      if (editId) {
        // Sửa
        await fetchData(`/${editId}`, {
          method: "PUT",
          body: JSON.stringify({ tenDanhMuc: name }),
        });
        alert("Cập nhật danh mục thành công");
      } else {
        // Thêm
        await fetchData("", {
          method: "POST",
          body: JSON.stringify({ tenDanhMuc: name }),
        });
        alert("Thêm danh mục thành công");
      }
      modal.style.display = "none";
      renderCategories();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu danh mục");
    }
  });

  // ------------------- SỬA DANH MỤC -------------------
  function initEditButtons() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        editId = btn.dataset.id;
        modalTitle.innerText = "Sửa danh mục";
        categoryInput.value = btn.dataset.name;
        modal.style.display = "block";
      });
    });
  }

  // ------------------- XÓA DANH MỤC -------------------
  function initDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        const id = btn.dataset.id;
        try {
          await fetchData(`/${id}`, { method: "DELETE" });
          alert("Xóa danh mục thành công");
          renderCategories();
        } catch (err) {
          console.error(err);
          alert("Lỗi khi xóa danh mục");
        }
      });
    });
  }

  // ------------------- KHỞI TẠO -------------------
  renderCategories();
});
