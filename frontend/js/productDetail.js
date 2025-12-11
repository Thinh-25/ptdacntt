document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    console.error("❌ Không tìm thấy ID sản phẩm!");
    return;
  }

  const productName = document.getElementById("productName");
  const productImage = document.getElementById("productImage");
  const productPrice = document.getElementById("productPrice");
  const productDesc = document.getElementById("productDesc");
  const qtyInput = document.getElementById("quantity");
  const btnMinus = document.getElementById("btnMinus");
  const btnPlus = document.getElementById("btnPlus");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const buyNowBtn = document.getElementById("buyNowBtn");

  // ======================== LOAD PRODUCT ========================
  async function loadProduct() {
    try {
      const res = await fetch(
        `http://localhost:3000/api/products/${productId}`
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("❌ API lỗi:", data);
        return;
      }

      const p = data.product;

      // ⭐ Gán dữ liệu
      productName.textContent = p.tenSP;
      productPrice.textContent = Number(p.gia).toLocaleString() + " VND";
      productDesc.textContent = p.moTa || "Không có mô tả.";
      productImage.src = p.anhSP ? `/Asset/${p.anhSP}` : "/Asset/no-image.jpg";
    } catch (err) {
      console.error("❌ Lỗi load sản phẩm:", err);
    }
  }

  loadProduct();
  // ---------------- Logo click ----------------
  document.getElementById("logo")?.addEventListener("click", () => {
    window.location.href = "/html/index.html";
  });
  // ======================== QUANTITY CONTROL ========================
  btnMinus.addEventListener("click", () => {
    let qty = parseInt(qtyInput.value);
    if (qty > 1) qtyInput.value = qty - 1;
  });

  btnPlus.addEventListener("click", () => {
    let qty = parseInt(qtyInput.value);
    qtyInput.value = qty + 1;
  });

  // ======================== ADD TO CART ========================
  addToCartBtn.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.id === productId);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id: productId,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng!");
  });

  // ======================== BUY NOW ========================
  buyNowBtn.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);

    // Lưu tạm để chuyển sang trang thanh toán
    localStorage.setItem(
      "buyNow",
      JSON.stringify({
        id: productId,
        quantity: qty,
      })
    );

    window.location.href = "/html/checkout.html";
  });
});
