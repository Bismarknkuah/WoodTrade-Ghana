import { Router } from 'express';
import {
  getProducts, getProductById, getByPassportId,
  createProduct, updateProduct, addTraceabilityEvent, getMyProducts
} from '../controllers/productController';
import { authenticate, authorize, requireApproved } from '../middleware/auth';

const router = Router();

// Public
router.get('/', getProducts);
router.get('/passport/:passportId', getByPassportId);
router.get('/:id', getProductById);

// Protected
router.get('/seller/mine', authenticate, authorize('seller', 'reseller', 'manufacturer', 'admin'), getMyProducts);
router.post('/', authenticate, authorize('seller', 'reseller', 'manufacturer'), requireApproved, createProduct);
router.put('/:id', authenticate, authorize('seller', 'reseller', 'manufacturer', 'admin'), updateProduct);
router.post('/:id/trace', authenticate, addTraceabilityEvent);

export default router;
