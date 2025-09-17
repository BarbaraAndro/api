const ProductsDao = require("../dao/products.dao");
const productsDao = new ProductsDao("./src/data/products.json");

class ProductController{

getProducts = async (req, res) => {
    try {
        const products = await productsDao.getProducts();
        if (!products) {
            res.status(404).json({ message: "Productos no encontrados" });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}
async getProductsSocket() {
    try {
        const products = await productsDao.getProducts();
        return products;
    } catch (error) {
        console.error("Error Controller getProductsSocket:", error);
        return [];
    }
}


getProductsById = async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productsDao.getProductsById(id);
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}

addProduct = async (req, res) => {
    try {
        const newData = req.body;
        const data = await productsDao.addProduct(newData);
        if (!data || Object.keys(newData).length === 0) {
            res.status(404).json({ message: "No se pudo agregar el producto" });
        } else if (Object.keys(newData).length < 8) {
            res.status(400).json({ error: "Faltan campos obligatorios del nuevo producto" });
        } else if (Object.keys(newData).length === 8) {
            res.status(201).json({ message: "Producto agregado con exito", data })
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}

async addProductSocket(newData) {
        try {
            const newProduct = await productsDao.addProduct(newData);
            return newProduct;
        } catch (error) {
            console.error("Error Controller addProductSocket:", error);
            return null;
        }
    }

deleteProduct = async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productsDao.deleteProduct(id);
        if (product) {
            res.status(200).json({ message: "Producto eliminado con exito" })
        } else {
            res.status(404).json({ message: "No se pudo eliminar el producto" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}

async deleteProductSocket(productId) {
        try {
            const deletedId = await productsDao.deleteProduct(productId);
            if (!deletedId) {
                console.warn("Producto no encontrado:", productId);
                return null;
            }
            return deletedId;
        } catch (error) {
            console.error("Error Controller deleteProductSocket:", error);
            return null;
        }
    }

updateProduct = async (req, res) => {
    try {
        const id = req.params.pid;
        const newData = req.body;
        const product = await productsDao.updateProduct(id, newData)
        res.status(200).json({ message: "Producto actualizado con exito", product })
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}

}

module.exports = ProductController;