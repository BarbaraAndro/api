const { Router } = require("express");
const router = Router();

const ProductController = require("../controllers/product.controller");
const productController = new ProductController();

router.get('/',productController.getProducts)
//router.get('/realtime', productController.getProductsSocketPage.bind(productController));
router.get('/realtime', productController.getProductsSocketPage);
router.get('/:pid',productController.getProductsById)
router.post('/',productController.addProduct)
router.delete('/:pid',productController.deleteProduct)
router.put('/:pid',productController.updateProduct)

module.exports = router;