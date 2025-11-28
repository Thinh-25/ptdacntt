// Kiểm tra token + role
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (!user || !token || user.role !== "admin") {
  alert("Bạn không có quyền admin");
  window.location.href = "../html/login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "../html/login.html";
});

// Lấy danh sách sản phẩm từ API
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Lỗi khi lấy sản phẩm");
      return;
    }

    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";
    data.products.forEach((p) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td><img src="http://localhost:3000/uploads/product-images/${p.image}" width="50"></td>
            `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("Lỗi server");
  }
}

loadProducts();
