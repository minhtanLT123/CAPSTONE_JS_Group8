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

const renderProducts = (data) => {
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
                   <div class="rating mt-3">${renderRating(product.rating)}</div>
                  </div>
                   
                  <div class="price mt-10 justify-between">
                    <h2>${formatVnd(product.price * (1 - product.discount / 100))}</h2>
                    <h2>${formatVnd(product.price)}</h2>
                   
                  </div>
                </div>
                <div class="card__body-bottom justify-between">
                 
                  <div class="buy">
                    <button>
                      <i class="fa-solid fa-cart-shopping"> </i>Thêm vào giỏ hàng
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
