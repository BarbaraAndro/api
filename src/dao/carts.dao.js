const Carts = require("../models/carts.models");
const mongoose = require("mongoose");

class CartsDao {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getCartById(id) {
        try {
            if (!id) throw new Error("ID no proporcionado");
            const cart = await Carts.findById(id).populate("products.product").lean();
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito", error)
        }
    }


    async addCart() {
        try {
            const newCart = new Carts();
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error agregando producto al carrito:", error);
            throw error;
        }
    }


    async addProductToCart(cid, pid) {
        try {
            const cart = await Carts.findById(cid).populate("products.product");
            if (!cart) throw new Error("Carrito no encontrado");
            const productInCart = cart.products.find((p) => String(p.product._id) === String(pid));
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
            await cart.save();
            return await cart.populate("products.product");
        } catch (error) {
            console.error("Error agregando producto al carrito:", error);
            throw error;
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Carts.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");
            cart.products = cart.products.filter(
                (p) => String(p.product) !== String(pid)
            );
            await cart.save();
            return await cart.populate("products.product");
        } catch (error) {
            console.error("Error eliminando producto del carrito:", error);
            throw error;
        }
    }

    async emptyCart(cid) {
        try {
            const cart = await Carts.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");
            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error vaciando el carrito:", error);
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await Carts.findById(cid).populate("products.product");
            if (!cart) throw new Error("Carrito no encontrado");
            const productInCart = cart.products.find(p => String(p.product._id) === String(pid));
            if (!productInCart) throw new Error("Producto no encontrado en el carrito");
            productInCart.quantity = quantity;
            await cart.save();
            return await cart.populate("products.product");
        } catch (error) {
            console.error("Error actualizando cantidad del producto en el carrito:", error);
            throw error;
        }
    }
    async replaceCartProducts(cid, newProducts) {
        try {
            const cart = await Carts.findById(cid);
            if (!cart) throw new Error("Carrito no encontrado");
            cart.products = newProducts.map(p => ({
                product: p.productId,
                quantity: p.quantity,
            }));
            await cart.save();
            const updatedCart = await Carts.findById(cid)
                .populate("products.product")
                .lean();
            return updatedCart;
        } catch (error) {
            console.error("Error reemplazando productos del carrito:", error);
            throw error;
        }
    }

}

module.exports = CartsDao;