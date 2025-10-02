const ProductsDao = require("../dao/products.dao");
const productsDao = new ProductsDao();

class ProductController {
    constructor() {
        this.productsDao = new ProductsDao();
    }
    getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, category, stock } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true,
        };
        if (sort === "asc") options.sort = { price: 1 };
        else if (sort === "desc") options.sort = { price: -1 };
        const query = {};
        if (category) query.category = category;
        if (stock === "true") query.stock = { $gt: 0 };
        const result = await productsDao.getProducts(query, options);
        return res.render("pages/home", {
            products: result.docs,
            currentPage: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit: options.limit,
            sort,
            category,
            stock,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
}

    getProductsSocketPage = async (req, res) => {
        try {
            const products = await this.productsDao.getAllProductsForRealtime();
            return res.render("pages/realTimeProducts", { products });
        } catch (error) {
            console.error("Error Controller getProductsSocketPage:", error);
            res.status(500).send("Error al renderizar la página");
        }
    }
    addProductSocket = async (newData) => {
        try {
            const newProduct = await this.productsDao.addProduct(newData);
            return newProduct;
        } catch (error) {
            console.error("Error Controller addProductSocket:", error);
            return null;
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
                res.status(404).json({ message: "No se pudo agregar el producto" }, data);
            } else if (Object.keys(newData).length < 9) {
                res.status(400).json({ error: "Faltan campos obligatorios del nuevo producto" });
            } else if (Object.keys(newData).length === 9) {
                res.status(201).json({ message: "Producto agregado con exito", data })
            }
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    addProductSocket = async (newData) => {
        try {
            const newProduct = await this.productsDao.addProduct(newData);
            return newProduct;
        } catch (error) {
            console.error("Error Controller addProductSocket:", error);
            return null;
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const id = req.params.pid;
            const product = await productsDao.softDeleteProduct(id);
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
            const deletedId = await productsDao.softDeleteProduct(productId);
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