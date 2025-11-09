class ApiServices {
    getListProductApi() {
        const promise = axios({
            url: "https://68f8f2a2deff18f212b82977.mockapi.io/VegeData",
            method: "GET",
        });

        return promise;
    }
    deleteProductApi = (id) => {
        const promise = axios({
            url: `https://68f8f2a2deff18f212b82977.mockapi.io/VegeData/${id}`,
            method: "DELETE",
        });
        return promise;
    }
    addProductApi = (product) => {
        const promise = axios({
            url: "https://68f8f2a2deff18f212b82977.mockapi.io/VegeData",
            method: "POST",
            data: product,
        });
        return promise;

    }
    getProductByIdApi = (id) => {
        const promise = axios({
            url: `https://68f8f2a2deff18f212b82977.mockapi.io/VegeData/${id}`,
            method: "GET",
        });
        return promise;
    }
    updateProductApi(product) {
        const promise = axios({
            url: `https://68f8f2a2deff18f212b82977.mockapi.io/VegeData/${product.id}`,
            method: "PUT",
            data: product,
        })
        return promise;
    }

};
export default ApiServices;