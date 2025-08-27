const fs = require('fs/promises')
const crypto = require('crypto')

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //getProducts
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            return JSON.parse(data);
        } catch (error) {
            //Ver que hacer con el error
        }
    }

    //getProductsById

    async getProductsById(id) {
        try {
            const data = await fs.readFile(this.path, "utf8");
            const products = JSON.parse(data);
            const product = products.find((prod) => String(prod.id) === String(id))
            if (product) {
                return product;
            } else {
                return ("Producto no encontrado");
            }

        } catch (error) {

        }

    }

    //addProduct
    async addProduct(newData) {
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = newData
            const newProduct = { id: crypto.randomUUID(), title, description, code, price, status, stock, category, thumbnails }
            const fileData = await fs.readFile(this.path, "utf8");
            let products = JSON.parse(fileData);
            products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
            return newProduct;
        } catch (error) {

        }
    }

    //updateProduct
    async updateProduct(id, newData){
        try {
            //const { title, description, code, price, status, stock, category, thumbnails } = data;
            const data = await fs.readFile(this.path, "utf8");
            const products = JSON.parse(data);
            const index = products.findIndex(prod => String (prod.id) === String(id));
            const product = products[index];
            Object.assign(product, newData);
            products[index]= product;
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        } catch (error) {
            
        }
    }

    //deleteFile
    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.path, "utf8");
            let products = JSON.parse(data);
            products = products.filter((prod) => String(prod.id) !== String(id))
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        } catch (error) {

        }
    }
}

module.exports = ProductManager;