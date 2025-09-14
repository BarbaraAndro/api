const fs = require("fs").promises;
const crypto = require('crypto')

class CartsDao {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getCartById(id) {
        try {
            const data = await fs.readFile(this.filePath, "utf8");
            const carts = JSON.parse(data);
            const cart = carts.find((prod) => String(prod.id) === String(id))
            if (cart) {
                return cart.products;
            } else {
                return ("Cart no encontrado");
            }

        } catch (error) {

        }
    }


    async addCart() {
        try {
            const fileData = await fs.readFile(this.filePath, "utf8");
            let carts = JSON.parse(fileData);
            const newCart = { id: crypto.randomUUID(), products: [] }
            carts.push(newCart);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2))
            return newCart;
        } catch (error) {

        }
    }


    async addProductToCart(cid, pid) {
        try {
            const fileData = await fs.readFile(this.filePath, "utf8");
            let carts = JSON.parse(fileData);
            const cart = carts.find((cart) => String(cart.id) === String(cid));
            const productInCart = cart.products.find((p) => String(p.product) === String(pid));
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2))
            return cart;
        } catch (error) {

        }
    }

}

module.exports = CartsDao;