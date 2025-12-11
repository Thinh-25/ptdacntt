// cart.js
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/html/login.html";
    return;
  }

  const cartList = document.getElementById("cartList");
  const totalPriceEl = document.getElementById("totalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  async function loadCart() {
    try {
      const res = await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      cartList.innerHTML = "";
      let totalPrice = 0;

      data.cart.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        const imgSrc = item.anhSP
          ? `/Asset/${item.anhSP}`
          : "/Asset/no-image.jpg";
        totalPrice += item.soLuongMua * item.gia;

        div.innerHTML = `
          <img src="${imgSrc}" alt="${item.tenSP}">
          <div class="cart-item-details">
            <h3>${item.tenSP}</h3>
            <p>${Number(item.gia).toLocaleString()} VND</p>
            <div class="quantity-control">
              <button class="minus">-</button>
              <input type="number" value="${item.soLuongMua}" min="1" readonly>
              <button class="plus">+</button>
            </div>
          </div>
          <span class="remove-btn">Xóa</span>
        `;

        const qtyInput = div.querySelector("input");
        const btnMinus = div.querySelector(".minus");
        const btnPlus = div.querySelector(".plus");
        const removeBtn = div.querySelector(".remove-btn");

        btnMinus.addEventListener("click", async () => {
          if (item.soLuongMua > 1) {
            await fetch("http://localhost:3000/api/cart/update", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                maSP: item.maSP,
                soLuong: item.soLuongMua - 1,
              }),
            });
            loadCart();
            window.updateHeaderCartCount?.();
          }
        });

        btnPlus.addEventListener("click", async () => {
          await fetch("http://localhost:3000/api/cart/update", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              maSP: item.maSP,
              soLuong: item.soLuongMua + 1,
            }),
          });
          loadCart();
          window.updateHeaderCartCount?.();
        });

        removeBtn.addEventListener("click", async () => {
          await fetch(`http://localhost:3000/api/cart/remove/${item.maSP}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          loadCart();
          window.updateHeaderCartCount?.();
        });

        cartList.appendChild(div);
      });

      totalPriceEl.innerText = Number(totalPrice).toLocaleString();
    } catch (err) {
      console.error(err);
    }
  }

  checkoutBtn?.addEventListener("click", () => {
    window.location.href = "/html/checkout.html";
  });

  loadCart();
});
