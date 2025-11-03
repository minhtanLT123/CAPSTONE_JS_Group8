
// import GioHang from "./gioHang";
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

const onHandleAddShoppingCart = (id) => {

  // Lấy danh sách giỏ hàng hiện có từ localStorage (nếu chưa có thì là mảng rỗng)
  let arrGioHang = JSON.parse(localStorage.getItem("gioHang")) || [];

  // Tìm sản phẩm theo id trong data đã render
  const product = window.productList.find((p) => p.id === id);

  if (!product) return;

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingProduct = arrGioHang.find((item) => item.id === id);
  if (existingProduct) {
    existingProduct.quantity += 1; // Tăng số lượng
  } else {
    arrGioHang.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  }

  // Lưu lại giỏ hàng
  localStorage.setItem("gioHang", JSON.stringify(arrGioHang));

  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
};
window.onHandleAddShoppingCart = onHandleAddShoppingCart;

const renderProducts = (data) => {
  window.productList = data; // 👈 Thêm dòng này
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    contentHTML += `
        <div class="products__item">
            <div class="card">
              <img src="./img/danhmuc/${product.type}/${product.image}" />
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
                    <h2 calss ="newPrice">${formatVnd(product.price * (1 - product.discount / 100))}</h2>
                    <h2 class = "oldPrice" >${formatVnd(product.price)}</h2>
                   
                  </div>
                </div>
                <div class="card__body-bottom justify-between">
                 
                  <div class="buy">
                    <button onclick = " onHandleAddShoppingCart('${product.id}')" >
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
