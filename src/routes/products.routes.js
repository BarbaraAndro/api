const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        if (!products) {
            res.status(404).json({ message: "Productos no encontrados" });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productManager.getProductsById(id);
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})

router.post('/', async (req, res) => {
    try {
        const newData = req.body;
        const data = await productManager.addProduct(newData);
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
})


router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productManager.deleteProduct(id);
        if (product) {
            res.status(200).json({ message: "Producto eliminado con exito"})
        } else {
            res.status(404).json({ message: "No se pudo eliminar el producto" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const newData = req.body;
        const product = await productManager.updateProduct(id, newData)
        res.status(200).json({ message: "Producto actualizado con exito", product })
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})


module.exports = router;