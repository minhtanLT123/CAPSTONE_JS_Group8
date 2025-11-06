

// Render sản phẩm trong giỏ
const renderCart = () => {
  const cart = JSON.parse(localStorage.getItem("gioHang")) || [];
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center">Giỏ hàng trống</p>`;
    cartTotal.textContent = "0₫";
    return;
  }

  let total = 0;
  let html = cart
    .map(
      (item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
          <div class="cart-item">
            <img src="./img/danhmuc/rau/${item.image}" alt="${item.name}" />
            <div class="info">
              <h4>${item.name}</h4>
              <p>${item.quantity} x ${formatVnd(item.price)}</p>
            </div>
            <span class="price">${formatVnd(itemTotal)}</span>
          </div>
        `;
      }
    )
    .join("");

  cartItemsContainer.innerHTML = html;
  cartTotal.textContent = formatVnd(total);
};
