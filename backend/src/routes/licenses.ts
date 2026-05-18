import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import User from '../models/User';

const router = Router();
router.use(authenticate);

router.post('/', async (req: any, res) => {
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

router.get('/mine', async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('licenses');
    res.json(user?.licenses || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
