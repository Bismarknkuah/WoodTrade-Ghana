import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';

const router = Router();
router.use(authenticate);
router.use(authorize('admin'));

// Review license
router.patch('/users/:userId/licenses/:licenseId', async (req: any, res) => {
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

    if (status === 'approved') {
      user.isApproved = true;
      if (user.licenses.every((l) => l.status === 'approved')) user.verificationBadge = true;
    }

    await user.save();
    res.json({ message: `License ${status}`, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all pending licenses
router.get('/pending-licenses', async (_req, res) => {
  try {
    const users = await User.find({ 'licenses.status': 'pending' })
      .select('fullName email company role licenses createdAt');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Suspend user
router.patch('/users/:userId/suspend', async (req: any, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isSuspended: true, suspensionReason: req.body.reason },
      { new: true }
    ).select('-password');
    res.json({ message: 'User suspended', user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Approve product
router.patch('/products/:productId/approve', async (_req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      _req.params.productId,
      { status: 'active' },
      { new: true }
    );
    res.json({ message: 'Product approved', product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Platform stats
router.get('/stats', async (_req, res) => {
  try {
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

export default router;
