const fs = require("fs").promises;
const crypto = require('crypto')

class ProductsDao {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, "utf8");
            return JSON.parse(data);
        } catch (error) {
        }
    }

    async getProductsById(id) {
        try {
            const data = await fs.readFile(this.filePath, "utf8");
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

    async addProduct(newData) {
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = newData
            const newProduct = { id: crypto.randomUUID(), title, description, code, price, status, stock, category, thumbnails }
            const fileData = await fs.readFile(this.filePath, "utf8");
            let products = JSON.parse(fileData);
            products.push(newProduct);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
            return newProduct;
        } catch (error) {

        }
    }


    async updateProduct(id, newData){
        try {
            const data = await fs.readFile(this.filePath, "utf8");
            const products = JSON.parse(data);
            const index = products.findIndex(prod => String (prod.id) === String(id));
            const product = products[index];
            Object.assign(product, newData);
            products[index]= product;
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
        } catch (error) {
            
        }
    }


    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.filePath, "utf8");
            let products = JSON.parse(data);
            const existe = products.some((prod) => String(prod.id) === String(id))
            if (existe){
                products = products.filter((prod) => String(prod.id) !== String(id))
                await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
                return true;
            }else{
                return false;
            }
        } catch (error) {

        }
    }
}
module.exports = ProductsDao;