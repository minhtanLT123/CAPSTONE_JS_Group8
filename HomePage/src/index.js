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


const renderRating = (rating) => {
  let contentRating = "";
  for (let i = 1; i <= rating; i++) {
    contentRating += `
            <i class="fa-solid fa-star"></i>
        `;
  }

  return contentRating;
};

const renderProducts = (data) => {
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    contentHTML += `
        <div class="products__item">
            <div class="card">
              <img src="./img/${product.image}" />
              <div class="card__body mt-5">
                <div class="card__body-top justify-between">
                  <div class="info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                  </div>
                  <div class="price">
                    <h2>$${product.price}</h2>
                  </div>
                </div>
                <div class="card__body-bottom justify-between">
                  <div class="rating">${renderRating(product.rating)}</div>
                  <div class="buy">
                    <button>
                      <i class="fa-solid fa-cart-shopping"> </i>Buy now
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
