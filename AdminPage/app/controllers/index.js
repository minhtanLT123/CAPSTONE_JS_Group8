import ApiServices from "./../services/apiServices.js";
import Product from "../models/product.js";

const api = new ApiServices();
const getEle = (id) => {
  return document.getElementById(id);

}

const getListProduct = () => {
  const promise = api.getListProductApi();

  promise
    .then((result) => {
      renderListProduct(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

getListProduct();

const renderListProduct = (data) => {
  let contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    contentHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
                <img src="./../../assets/img/${product.image}" width="50" />
            </td>
            <td>${product.description}</td>
           
            <td> 
              <button class = " btn btn-info " data-toggle="modal" data-target="#myModal" onclick = " handleEditProduct(${product.id})"> Edit </button> 
              <button class = " btn btn-danger " onclick = " handleDeleteProduct(${product.id})"> Delete </button> 
            <td/>
           
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
  const promise = api.deleteProductApid(id);
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
  const image = getEle("HinhSP").value;
  const description = getEle("Mota").value;
  const rating = getEle("Rating").value;

  // create object product
  const product = new Product("", name, price, description, image, rating);
  console.log(product);

  // add product to server
  const promise = api.addProductApid(product);
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

}
window.handleAddProduct = handleAddProduct;

/**
 * Edit Product
 */
const handleEditProduct = (id) => {
  document.getElementsByClassName("modal-title")[0].innerHTML = "Update Product";
  const updateProductBtn = `<button class = "btn btn-primary"  >Update Product</button>`;
  document.getElementsByClassName("modal-footer")[0].innerHTML = updateProductBtn;
  // get product by id
  const promise = api.getProductByIdApi(id);
  promise
    .then((result) => {
      const product = result.data;
      // fill data
      getEle("TenSP").value = product.name;
      getEle("GiaSP").value = product.price;
      getEle("HinhSP").value = product.image;
      getEle("Mota").value = product.description;
      getEle("Rating").value = product.rating;
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
  const image = getEle("HinhSP").value;
  const description = getEle("Mota").value;
  const rating = getEle("Rating").value;

  const product = new Product(id, name, price, description, image, rating);
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

