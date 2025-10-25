class ApiServices {
    getListProductApi() {
        const promise = axios({
            url: "https://68e90f1df2707e6128cd5d01.mockapi.io/apo/VegeData",
            method: "GET",
        });

        return promise;
    }
    deleteProductApid = (id) => {
        const promise = axios({
            url: `https://68e90f1df2707e6128cd5d01.mockapi.io/apo/VegeData/${id}`,
            method: "DELETE",
        });
        return promise;
    }
    addProductApid = (product) => {
        const promise = axios({
            url: "https://68e90f1df2707e6128cd5d01.mockapi.io/apo/VegeData",
            method: "POST",
            data: product,
        });
        return promise;

    }
    getProductByIdApi = (id) => {
        const promise = axios({
            url: `https://68e90f1df2707e6128cd5d01.mockapi.io/apo/VegeData/${id}`,
            method: "GET",
        });
        return promise;
    }
    updateProductApi(product) {
        const promise = axios({
            url: `https://68e90f1df2707e6128cd5d01.mockapi.io/apo/VegeData/${product.id}`,
            method: "PUT",
            data: product,
        })
        return promise;
    }

};
export default ApiServices;