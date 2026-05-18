import { Router } from 'express';
import { createOrder, getMyOrders, getSellerOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
router.use(authenticate);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/seller', authorize('seller', 'reseller', 'manufacturer', 'admin'), getSellerOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', authorize('seller', 'reseller', 'manufacturer', 'admin'), updateOrderStatus);

export default router;
