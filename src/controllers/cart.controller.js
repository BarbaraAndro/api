const CartsDao = require("../dao/carts.dao");
const cartsDao = new CartsDao();

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
            //return res.render("pages/cart", { cart });
            return res.json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }


    getCartById = async (req, res) => {
        try {
            const id = req.params.cid;
            const cart = await cartsDao.getCartById(id);
            return res.render("pages/cart", { cart });
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    removeProductFromCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            let cart = await cartsDao.removeProductFromCart(cid, pid);
            cart = cart.toObject();
            return res.render("pages/cart", { cart });
        } catch (error) {
            res.status(500).json({ error: "Error en el servidor" });
        }
    }

    emptyCart = async (req, res) => {
        try {
            const cid = req.params.cid;
            const cart = await cartsDao.emptyCart(cid);
            return res.render("pages/cart", { cart });
        } catch (error) {
            res.status(500).json({ error: "Error vaciando carrito" });
        }
    }

    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            if (!quantity || quantity < 1) {
                return res.status(400).json({ error: "Cantidad inválida" });
            }
            const updatedCart = await cartsDao.updateProductQuantity(cid, pid, quantity);
            return res.render("pages/cart", { cart: updatedCart });

        } catch (error) {
            console.error("Error actualizando cantidad:", error);
            res.status(500).json({ error: "Error actualizando cantidad" });
        }
    }
    replaceCartProducts = async (req, res) => {
        try {
            const cid = req.params.cid;
            const newProducts = req.body.products; // esperamos array en el body
            if (!Array.isArray(newProducts)) {
                return res.status(400).json({ error: "Se espera un array de productos" });
            }
            const cart = await cartsDao.replaceCartProducts(cid, newProducts);
            return res.render("pages/cart", { cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error reemplazando productos del carrito" });
        }
    }

}

module.exports = CartController;