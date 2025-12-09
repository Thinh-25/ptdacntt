document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    handleMenuSidebar(); // Xử lý menu trái
    handleCartSidebar(); // Xử lý giỏ hàng phải
});

// 1. Xử lý Menu bên trái (Giữ nguyên)
function handleMenuSidebar() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    const toggleMenu = (isOpen) => {
        if (isOpen) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            // Chỉ đóng overlay nếu cart cũng đang đóng
            if (!document.getElementById('cart-sidebar').classList.contains('active')) {
                overlay.classList.remove('active');
            }
        }
    };

    hamburgerBtn.addEventListener('click', () => toggleMenu(true));
    closeSidebarBtn.addEventListener('click', () => toggleMenu(false));
    overlay.addEventListener('click', () => {
        toggleMenu(false); // Đóng menu
        document.getElementById('cart-sidebar').classList.remove('active'); // Đóng luôn cart
        overlay.classList.remove('active');
    });
}

// 2. Xử lý Giỏ hàng bên phải (Mới thêm)
function handleCartSidebar() {
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    const toggleCart = (isOpen) => {
        if (isOpen) {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        } else {
            cartSidebar.classList.remove('active');
            // Chỉ đóng overlay nếu menu cũng đang đóng
            if (!document.getElementById('sidebar').classList.contains('active')) {
                overlay.classList.remove('active');
            }
        }
    };

    openCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart(true);
    });
    closeCartBtn.addEventListener('click', () => toggleCart(false));
}

// 3. Logic sản phẩm & Giỏ hàng
let cart = []; // Mảng chứa sản phẩm trong giỏ

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products'); 
        if (!response.ok) throw new Error('Failed');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Lỗi:", error);
        document.getElementById('product-list').innerHTML = '<p style="text-align:center;">Lỗi kết nối server.</p>';
    }
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    products.forEach(product => {
        const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GIA);
        const imageUrl = product.HINHANH ? `../Asset/${product.HINHANH}` : '../Asset/sp-1765026943313.jpg';

        // Lưu thông tin sản phẩm vào dataset để dễ lấy khi bấm nút thêm
        const productHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.TENSP}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.TENSP}</h3>
                    <p class="product-price" style="color:#ff6b6b; font-weight:bold;">${price}</p>
                    <button class="add-to-cart-btn" 
                        onclick="addToCart('${product.MASP}', '${product.TENSP}', ${product.GIA}, '${imageUrl}')">
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `;
        productList.innerHTML += productHTML;
    });
}

// Hàm thêm vào giỏ (Cập nhật giao diện ngay lập tức)
function addToCart(id, name, price, img) {
    // 1. Thêm vào mảng cart
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, img, quantity: 1 });
    }

    // 2. Cập nhật số lượng trên icon
    updateCartCount();

    // 3. Render lại danh sách trong sidebar
    renderCartItems();

    // 4. Mở sidebar giỏ hàng để user thấy ngay (tùy chọn)
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    if (!cartSidebar.classList.contains('active')) {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').innerText = count;
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Chưa có sản phẩm nào</p>';
        totalElement.innerText = '0đ';
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const priceStr = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);
        
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="img">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${priceStr} x ${item.quantity}</span>
                </div>
                <button class="cart-item-remove" onclick="removeCartItem(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    totalElement.innerText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
}

function removeCartItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCartItems();
}