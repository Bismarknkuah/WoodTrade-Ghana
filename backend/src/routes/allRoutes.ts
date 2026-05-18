// ============ orders.ts ============
import { Router as OrderRouter } from 'express';
import { createOrder, getMyOrders, getSellerOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const orderRouter = OrderRouter();
orderRouter.use(authenticate);
orderRouter.post('/', createOrder);
orderRouter.get('/my', getMyOrders);
orderRouter.get('/seller', authorize('seller', 'reseller', 'manufacturer', 'admin'), getSellerOrders);
orderRouter.get('/:id', getOrderById);
orderRouter.patch('/:id/status', authorize('seller', 'reseller', 'manufacturer', 'admin'), updateOrderStatus);

export { orderRouter };

// ============ export.ts ============
import { Router as ExportRouter } from 'express';
import { generateLaceyActDeclaration, generateCommercialInvoice, getComplianceStatus, updateComplianceItem } from '../controllers/exportController';

const exportRouter = ExportRouter();
exportRouter.use(authenticate);
exportRouter.get('/lacey-act/:orderId', generateLaceyActDeclaration);
exportRouter.get('/commercial-invoice/:orderId', generateCommercialInvoice);
exportRouter.get('/compliance-status/:orderId', getComplianceStatus);
exportRouter.patch('/compliance/:orderId/checklist', updateComplianceItem);

export { exportRouter };

// ============ licenses.ts ============
import { Router as LicenseRouter } from 'express';
import User from '../models/User';

const licenseRouter = LicenseRouter();
licenseRouter.use(authenticate);

// Upload / add a license
licenseRouter.post('/', async (req: any, res) => {
  try {
    const { type, number, issuedBy, issuedDate, expiryDate, documentUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { licenses: { type, number, issuedBy, issuedDate, expiryDate, documentUrl, status: 'pending' } } },
      { new: true }
    ).select('licenses');
    res.json({ message: 'License submitted for review', licenses: user?.licenses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get my licenses
licenseRouter.get('/mine', async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('licenses');
    res.json(user?.licenses || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { licenseRouter };

// ============ admin.ts ============
import { Router as AdminRouter } from 'express';
import { authorize as adminAuthorize } from '../middleware/auth';

const adminRouter = AdminRouter();
adminRouter.use(authenticate);
adminRouter.use(adminAuthorize('admin'));

// Approve or reject a user's license
adminRouter.patch('/users/:userId/licenses/:licenseId', async (req: any, res) => {
  try {
    const { status, reviewNote } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const license = (user.licenses as any).id(req.params.licenseId);
    if (!license) { res.status(404).json({ error: 'License not found' }); return; }

    license.status = status;
    license.reviewedBy = req.user.id;
    license.reviewNote = reviewNote;
    license.reviewedAt = new Date();

    // If at least one license approved, approve the user
    if (status === 'approved') user.isApproved = true;
    if (status === 'approved' && user.licenses.every(l => l.status === 'approved')) {
      user.verificationBadge = true;
    }

    await user.save();
    res.json({ message: `License ${status}`, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Suspend a user
adminRouter.patch('/users/:userId/suspend', async (req: any, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: true, suspensionReason: reason },
      { new: true }
    ).select('-password');
    res.json({ message: 'User suspended', user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Approve product listing
adminRouter.patch('/products/:productId/approve', async (req: any, res) => {
  try {
    const Product = (await import('../models/Product')).default;
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { status: 'active' },
      { new: true }
    );
    res.json({ message: 'Product approved and listed', product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
adminRouter.get('/stats', async (_req, res) => {
  try {
    const Product = (await import('../models/Product')).default;
    const Order = (await import('../models/Order')).default;

    const [totalUsers, pendingLicenses, totalProducts, pendingProducts, totalOrders, exportOrders] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ 'licenses.status': 'pending' }),
        Product.countDocuments(),
        Product.countDocuments({ status: 'pending_review' }),
        Order.countDocuments(),
        Order.countDocuments({ 'exportCompliance.isExport': true }),
      ]);

    res.json({ totalUsers, pendingLicenses, totalProducts, pendingProducts, totalOrders, exportOrders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { adminRouter };
