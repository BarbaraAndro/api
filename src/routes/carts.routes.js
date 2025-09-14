const { Router } = require("express");
const router = Router();

const CartController = require("../controllers/cart.controller");
const cartController = new CartController();

router.get('/:cid',cartController.getCartById)
router.post('/',cartController.addCart)
router.post('/:cid/product/:pid',cartController.addProductToCart)


module.exports = router;