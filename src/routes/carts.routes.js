const { Router } = require("express");
const CartsManager = require("../managers/cartManager");

const router = Router();
const cartManager = new CartsManager("./src/data/carts.json");


router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json(newCart)
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const cid = req.params.cid;
        const cart = await cartManager.addProductToCart(cid,pid);
        res.json(cart)
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
})


router.get('/:cid', async (req, res) => {
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


module.exports = router;