const Products = require("../models/products.models");
const mongoose = require("mongoose");

class ProductsDao {

async getProducts(query = {}, options = {}) {
    try {
        const finalFilter = { deleted: false, ...query };
        const products = await Products.paginate(finalFilter, options);
        return products;
    } catch (error) {
        console.error("Error al obtener los productos", error);
        throw error;
    }
}
async getAllProductsForRealtime() {
    try {
        return await Products.find({ deleted: false }).lean();
    } catch (error) {
        console.error("Error al obtener productos para Realtime:", error);
        return [];
    }
}

    async getProductsById(id) {
        try {
            if (!id) throw new Error("ID no proporcionado");
            const products = await Products.findById(id);
            return products;
        } catch (error) {
            console.error("Error al obtener el producto", error)
        }
    }

    async addProduct(data) {
        try {
            const newProduct = new Products(data);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error("Error agregando un producto", error)
            throw error;
        }
    }

    async updateProduct(id, data) {
        try {
            const productsUpdated = await Products.findByIdAndUpdate(id, data, { new: true });
            return productsUpdated;
        } catch (error) {
            console.error("Error actualizando el producto", error)
        }
    }

    async softDeleteProduct(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("ID no válido");
            }
            const productSoftDeleted = await Products.findByIdAndUpdate(id, { deleted: true }, { new: true });
            return productSoftDeleted;
        } catch (error) {
            console.error("Error borrando el producto", error)
        }
    }
}

module.exports = ProductsDao;