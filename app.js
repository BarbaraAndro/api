const express = require('express')
const path = require('path')
const ProductManager = require('./productManager');
const CartManager = require('./cartManager')

const app = express()
const port = 8080
app.use(express.json());

const routeProduct = path.join(__dirname, "data", "products.json")
const productManager = new ProductManager(routeProduct)

const routeCart = path.join(__dirname, "data", "carts.json")
const cartManager = new CartManager(routeCart)


//Metodos de products

app.get('/api/products', async (req, res) => {
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

app.get('/api/products/:pid', async (req, res) => {
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

app.post('/api/products', async (req, res) => {
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


app.delete('/api/products/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await productManager.deleteProduct(id);
        if (!product) {
            res.status(404).json({ message: "No se pudo eliminar el producto" });
        } else {
            res.status(200).json({ message: "Producto eliminado con exito", product })
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})

app.put('/api/products/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const newData = req.body;
        const product = await productManager.updateProduct(id, newData)
        if (!product) {
            res.status(404).json({ message: "No se pudo editar el producto" });
        } else {
            res.status(200).json({ message: "Producto actualizado con exito", product })
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})




//Metodos de carts

app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart)
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const cid = req.params.cid;
        const cart = await cartManager.addProductToCart(cid,pid);
        res.json(cart)
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})


app.get('/api/carts/:cid', async (req, res) => {
    try {
        const id = req.params.cid;
        const cart = await cartManager.getCartById(id);
        if (!cart) {
            res.status(404).json({ message: "Carrito no encontrado" });
        } else {
            res.status(200).json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})



// ----------------------------------------VER ESTO DE ABAJO-------------------------------------------
app.use((req, res) => {
    res.status(404).send('404 - Page not found');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
})