class ProManager {
    constructor() {
        this.arr = [];
    }
    addProduct(Product) {
        this.arr.push(Product)

    }
    findIndexProduct(id) {
        let index = -1;
        for (let i = 0; i < this.arr.length; i++) {
            const Product = this.arr[i];
            if (Product.id === id) {
                index = i;
                break;

            }
        }
        return index;

    }


}

export default ProManager;