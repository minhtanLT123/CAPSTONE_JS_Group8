
let allProducts = []; // lưu toàn bộ dữ liệu từ API
let currentType = null; // theo dõi loại đang được chọn

const getListProducts = () => {
  /**
   * axios trả về đối tượng promise (lời hứa)
   *  - pending: Chờ
   *  - resolve: Lời hứa thực hiện
   *  - reject: Thất hứa
   */
  const promise = axios({
    url: "https://68f8f2a2deff18f212b82977.mockapi.io/VegeData",
    method: "GET",
  });

  promise
    .then((result) => {
      allProducts = result.data;
      renderProducts(allProducts);
    })
    .catch((error) => {
      console.log(error);
    });
};

getListProducts();

// Hàm lọc theo type
function findTypeItem(type) {
  // Nếu click lại cùng loại thì hiển thị toàn bộ
  if (currentType === type || !type || type === "khac") {
    currentType = null;
    renderProducts(allProducts);
    return;
  }
  currentType = type;
  const filtered = allProducts.filter((item) => item.type === type);
  renderProducts(filtered);
}
window.findTypeItem = findTypeItem;

// render rating
const renderRating = (rating) => {
  let contentRating = "";
  for (let i = 1; i <= rating; i++) {
    contentRating += `
            <i class="fa-solid fa-leaf"></i>
        `;
  }
  return contentRating;
};

// format VND
const formatVnd = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// --- LẤY GIỎ HÀNG TỪ LOCALSTORAGE ---
const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("gioHang")) || [];
  } catch {
    return [];
  }
};

// --- LƯU GIỎ HÀNG ---
const saveCart = (cart) => {
  localStorage.setItem("gioHang", JSON.stringify(cart));
};

// --- RENDER GIỎ HÀNG PANEL ---
const renderCart = () => {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cartItems");
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="text-center text-gray-500">Giỏ hàng trống</p>`;
    return;
  }
  let total = 0;
  cart.forEach(item => {
    const totalPrice = item.price * item.quantity * (1 - item.discount / 100);
    total += totalPrice;
    const div = document.createElement("div");

    total += item.price * item.quantity;
    div.className =
      "cart-item grid grid-cols-5 items-center gap-4 border-b border-gray-100 pb-3";

    div.innerHTML = `
      <!-- Hình ảnh -->
      <img src="./img/danhmuc/${item.type || "rau-cu"}/${item.image}" 
           class="w-16 h-16 rounded-xl object-cover" />

      <!-- Tên sản phẩm -->
      <div class="col-span-2">
        <h4 class="font-medium text-gray-700">${item.name}</h4>
      </div>

      <!-- Số lượng -->
      <div class="flex justify-center items-center gap-2">
        <button onclick="updateQuantity('${item.id}', -1)" 
                class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300">−</button>
        <p class="text-sm text-gray-700 font-medium">${item.quantity}</p>
        <button onclick="updateQuantity('${item.id}', 1)" 
                class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300">+</button>
      </div>

      <!-- Giá -->
      <div class="font-semibold text-blue-600 text-right">${formatVnd(totalPrice)}</div>
    `;

    cartItemsContainer.appendChild(div);
  });
  const totalDiv = document.createElement("div");
  totalDiv.className = "text-right font-semibold text-lg text-blue-700 mt-4";
  totalDiv.textContent = `Tổng cộng: ${formatVnd(total)}`;
  cartItemsContainer.appendChild(totalDiv);
};

//--- THÊM SẢN PHẨM VÀO GIỎ HÀNG ---
const onHandleAddShoppingCart = (id) => {
  const product = window.productList.find(p => p.id === id);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  renderCart();
  // openCartPanel();
  updateCartCount();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
};
window.onHandleAddShoppingCart = onHandleAddShoppingCart;

// --- MỞ GIỎ HÀNG ---
const openCartPanel = () => {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");

  panel.classList.remove("scale-0");  // panel hiện
  overlay.classList.remove("hidden"); // overlay hiện

  overlay.addEventListener("click", closeCartPanel);
};

// --- ĐÓNG GIỎ HÀNG ---
const closeCartPanel = () => {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");

  panel.classList.add("scale-0");  // panel ẩn
  overlay.classList.add("hidden"); // overlay ẩn
};

// --- NÚT ĐÓNG TRONG PANEL ---
document.querySelectorAll("#cartPanel .close-btn").forEach(btn => {
  btn.addEventListener("click", closeCartPanel);
});

// cập nhật số lượng
function updateQuantity(id, change) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    updateCartCount(); //Cập nhật số hiển thị
  }
}
window.updateQuantity = updateQuantity;

// Hàm render danh sách sản phẩm
const renderProducts = (data) => {
  window.productList = data;
  if (!data.length) {
    container.innerHTML = `<p>Không có sản phẩm phù hợp.</p>`;
    return;
  }
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    contentHTML += `
        <div class="products__item">
            <div class="card">
              <div class = "img-container" >
              <img src="./img/danhmuc/${product.type}/${product.image}" />
              </div>
              <div class="card__body mt-5">
                <div class="card__body-top ">
                  <div class="info">
                    <h2>${product.name}</h2>
                   <div 
                   class="rating mt-3">
                   <span>Yêu thích</span>
                   ${renderRating(product.rating)}
                   </div>
                  </div>
                   
                  <div class="price mt-2 justify-between">
                    <h2 class ="newPrice">${formatVnd(product.price * (1 - product.discount / 100))}</h2>
                    <h2 class = "oldPrice" >${formatVnd(product.price)}</h2>
                   
                  </div>
                </div>
                <div class="card__body-bottom justify-between">
                 
                  <div class="buy">
                    <button onclick = "onHandleAddShoppingCart('${product.id}')" >
                      <i   class="fa-solid fa-cart-shopping"> </i>Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    `;
  }

  document.getElementById("listProduct").innerHTML = contentHTML;
};


function showToast(message = "Đã thêm sản phẩm vào giỏ hàng!") {
  const container = document.getElementById("toast-container");

  // Tạo phần tử toast
  const toast = document.createElement("div");
  toast.className =
    "toast-item flex items-center w-full max-w-xs p-4 mb-2 text-gray-500 bg-white rounded-lg shadow-lg border-l-4 border-green-500 transition-all duration-500 transform translate-y-5 opacity-0";
  toast.innerHTML = `
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-full">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <div class="ml-3 text-sm font-semibold text-gray-700">${message}</div>
  `;

  container.appendChild(toast);

  // Kích hoạt animation (slide lên)
  setTimeout(() => {
    toast.classList.remove("translate-y-5", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  }, 50);

  // Ẩn sau 3s
  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-5", "opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
// cập nhật số lượng
function updateCartCount() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector(".cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
    // Ẩn nếu 0
    cartCountEl.style.display = totalCount > 0 ? "inline-block" : "none";
  }
}
document.addEventListener("DOMContentLoaded", updateCartCount);

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});


