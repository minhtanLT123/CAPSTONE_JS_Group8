
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
      renderProducts(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

getListProducts();

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
  return JSON.parse(localStorage.getItem("gioHang")) || [];
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

  cart.forEach(item => {
    const totalPrice = item.price * item.quantity;
    const div = document.createElement("div");
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
  openCartPanel();
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
  }
}


const renderProducts = (data) => {
  window.productList = data; // 👈 Thêm dòng này
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
                   
                  <div class="price mt-10 justify-between">
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

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});


