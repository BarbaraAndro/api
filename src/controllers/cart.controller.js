const CartsDao = require("../dao/carts.dao");
const cartsDao = new CartsDao("./src/data/carts.json");

class CartController {

    addCart = async (req, res) => {
        try {
            const newCart = await cartsDao.addCart();
            res.json(newCart);
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    addProductToCart = async (req, res) => {
        try {
            const pid = req.params.pid;
            const cid = req.params.cid;
            const cart = await cartsDao.addProductToCart(cid, pid);
            res.json(cart)
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }


    getCartById = async (req, res) => {
        try {
            const id = req.params.cid;
            const cart = await cartsDao.getCartById(id);
            if (!cart) {
                res.status(404).json({ message: "Carrito no encontrado" });
            } else {
                res.status(200).json(cart);
            }
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }
}


module.exports = CartController;