const { Router } = require("express");
const router = Router();

const CartController = require("../controllers/cart.controller");
const cartController = new CartController();

router.get('/:cid',cartController.getCartById)
router.post('/',cartController.addCart)
router.post('/:cid/product/:pid',cartController.addProductToCart)
router.delete('/:cid/product/:pid', cartController.removeProductFromCart);
router.delete('/:cid', cartController.emptyCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity)
router.put('/:cid', cartController.replaceCartProducts)

module.exports = router;