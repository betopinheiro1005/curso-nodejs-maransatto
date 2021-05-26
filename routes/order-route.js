const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const orderController = require('../controllers/order-controller');

router.get('/', orderController.getOrders);
router.post('/', orderController.postOrder);
router.get('/:orderId', orderController.getOrderDetail);
router.delete('/:orderId', login, orderController.deleteOrder);

module.exports = router;