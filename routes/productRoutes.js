const express = require('express');
const router = express.Router();

const {getAllProducts,getProductById,getProductsByStatus,getProductsByCategoryId,getProductsByColor,getProductsByGender,
  getProductsByPrice,getProductsBySearch,addProduct,updateProduct,deleteProduct,getProductsByQueries,deductInventory,
  add_Product_inventory,restore_inventory} = require('../controllers/productController');

const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// ✅ Any logged-in user can view/search/filter products
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/category/:id').get(getProductsByCategoryId);
router.route('/color/:color').post( getProductsByColor);
router.route('/gender/:gender').post( getProductsByGender);
router.route('/status/:status').get( getProductsByStatus);
router.route('/search/:search').get( getProductsBySearch);
router.route('/query/price').post( getProductsByPrice);
router.route('/query/full').post(getProductsByQueries);
router.route('/deduct-inventory').post(deductInventory);
router.post('/restore-inventory', restore_inventory);
// ✅ Admin-only routes
router.route('/').post(verifyTokenAndAdmin, addProduct);
router.route('/:id').put(verifyTokenAndAdmin, updateProduct);
router.route('/:id').delete(verifyTokenAndAdmin, deleteProduct);
router.route('/add_Product_inventory').post(verifyTokenAndAdmin, add_Product_inventory);

module.exports = router;
