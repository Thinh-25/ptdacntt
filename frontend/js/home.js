document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

async function fetchProducts() {
    try {
        // Giả sử API của bạn chạy ở port 3000
        const response = await fetch('http://localhost:3000/api/products'); 
        if (!response.ok) {
            throw new Error('Không thể tải sản phẩm');
        }
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Lỗi:", error);
        document.getElementById('product-list').innerHTML = '<p style="text-align:center; col-span: 4;">Lỗi kết nối server.</p>';
    }
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Xóa nội dung loading

    products.forEach(product => {
        // Format giá tiền VND
        const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIA);
        
        // Xử lý đường dẫn ảnh (fallback nếu ảnh lỗi)
        const imageUrl = product.HINHANH ? `../Asset/${product.HINHANH}` : '../Asset/sp-1765026943313.jpg';

        const productHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.TENSP}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.TENSP}</h3>
                    <p class="product-price">${price}</p>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.MASP}')">
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `;
        productList.innerHTML += productHTML;
    });
}

function addToCart(productId) {
    // Logic thêm vào giỏ hàng (bạn có thể phát triển thêm sau)
    alert('Đã thêm sản phẩm ' + productId + ' vào giỏ hàng!');
    
    // Demo cập nhật số lượng trên icon
    const countElement = document.querySelector('.cart-count');
    let count = parseInt(countElement.innerText);
    countElement.innerText = count + 1;
}