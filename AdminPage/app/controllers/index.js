import ApiServices from "../services/apiServices.js";
import Product from "../models/product.js";

const api = new ApiServices();
const getEle = (id) => {
  return document.getElementById(id);

}

// clear form
const resetForm = () => {
  getEle("form-id").reset();
}

let productList = [];

const getListProduct = () => {
  const promise = api.getListProductApi();
  promise
    .then((result) => {
      productList = result.data; // ⚡ Gán dữ liệu vào biến toàn cục
      renderListProduct(productList);
    })
    .catch((error) => console.log(error));
};

document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.trim().toLowerCase();
  const selectedType = document.getElementById("filterType").value;

  const filtered = productList.filter((product) => {
    const matchType = selectedType === "" || product.type === selectedType;
    const matchName = product.name.toLowerCase().includes(keyword);
    return matchType && matchName;
  });

  renderListProduct(filtered);
});




getListProduct();

const renderListProduct = (data) => {
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    contentHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${product.name}</td>
            <td>${product.type}</td>
            <td>${product.price}</td>
            <td> ${product.discount}%</td>
            <td>
                <img src="../images/${product.type}/${product.image}" width="50" />
                
            </td>
            <td> ${product.description}</td>
           
            <td style="white-space: nowrap; text-align: center;">
              <button class="btn btn-info btn-sm me-2"
                data-toggle="modal"
                data-target="#myModal"
                onclick="handleEditProduct(${product.id})">
                Edit
              </button>
              <button class="btn btn-danger btn-sm"
                onclick="handleDeleteProduct(${product.id})">
                Delete
              </button>
            </td>

           
        </tr>
    `;
  }

  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
};

/**
 * Handle delete Product
 */
const handleDeleteProduct = (id) => {
  console.log(id);
  const promise = api.deleteProductApi(id);
  promise
    .then((result) => {
      console.log(result);
      // render lai list product
      getListProduct();

    })
    .catch((error) => {
      console.log(error);
    })
}
window.handleDeleteProduct = handleDeleteProduct;

/**
 * xu ly UI Add product
 */
getEle("btnThemSP").onclick = () => {
  document.getElementsByClassName("modal-title")[0].innerHTML = "Add Product";

  // Làm sạch toàn bộ form (xóa dữ liệu edit cũ)
  resetForm();

  // create "Add Product" button
  const addProductBtn = `<button class="btn btn-primary" onclick = "handleAddProduct()">Add Product </button>`;
  document.getElementsByClassName("modal-footer")[0].innerHTML = addProductBtn;

}


/**
 * Add product
 */

const handleAddProduct = () => {
  // Get data form user input
  const name = getEle("TenSP").value;
  const price = getEle("GiaSP").value;
  const type = getEle("LoaiSP").value;
  const discount = getEle("phantramKM").value;
  const image = getEle("HinhSP").value;
  const description = getEle("Mota").value;
  const rating = getEle("Rating").value;

  // create object product
  const product = new Product("", name, type, price, discount, image, description, rating);
  console.log(product);

  // add product to server
  const promise = api.addProductApi(product);
  promise
    .then((result) => {
      console.log(result.data);
      // re-render list product
      getListProduct();
      // close modal
      document.getElementsByClassName("close")[0].click();
    })
    .catch((error) => {
      console.log(error);

    })
  console.log("type:", product.type);
  console.log("image:", product.image);

}
window.handleAddProduct = handleAddProduct;

/**
 * Edit Product
 */
const handleEditProduct = (id) => {
  document.getElementsByClassName("modal-title")[0].innerHTML = "Update Product";
  const updateProductBtn = `<button class = "btn btn-primary" onclick ="handleUpdateProduct(${id})" >Update Product</button>`;
  document.getElementsByClassName("modal-footer")[0].innerHTML = updateProductBtn;
  // get product by id
  const promise = api.getProductByIdApi(id);
  promise
    .then((result) => {
      const product = result.data;
      // fill data
      getEle("TenSP").value = product.name;
      getEle("GiaSP").value = product.price;
      getEle("phantramKM").value = product.discount;
      getEle("HinhSP").value = product.image;
      getEle("Mota").value = product.description;
      getEle("Rating").value = product.rating;
      getEle("LoaiSP").value = product.type;
    })
    .catch((error) => {
      console.log(error);
    })
}
window.handleEditProduct = handleEditProduct;

/**
 * handle Update product
 */
const handleUpdateProduct = (id) => {
  const name = getEle("TenSP").value;
  const price = getEle("GiaSP").value;
  const type = getEle("LoaiSP").value;
  const discount = getEle("phantramKM").value;
  const image = getEle("HinhSP").value;
  const description = getEle("Mota").value;
  const rating = getEle("Rating").value;

  const product = new Product(id, name, type, price, discount, image, description, rating);
  const promise = api.updateProductApi(product);
  promise
    .then((result) => {
      const product = result.data;
      getListProduct();
      document.getElementsByClassName("close")[0].click();

    })
    .catch((error) => {

      console.log(error);
    })
}
window.handleUpdateProduct = handleUpdateProduct;

// Lắng nghe sự kiện thay đổi loại sản phẩm
document.getElementById("filterType").addEventListener("change", function () {
  const selectedType = this.value; // lấy giá trị được chọn
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase(); // lấy từ khóa hiện có trong ô search

  // Lọc danh sách
  const filtered = productList.filter((product) => {
    const matchType = selectedType === "" || product.type === selectedType;
    const matchName = product.name.toLowerCase().includes(keyword);
    return matchType && matchName;
  });

  renderListProduct(filtered);
});




