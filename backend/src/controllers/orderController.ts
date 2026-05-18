import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// POST /api/orders - create order
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod, specialInstructions, isExport, destinationCountry } = req.body;

    // Validate products and compute totals
    let subtotal = 0;
    const enrichedItems = [];
    let sellerId: string | null = null;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== 'active') {
        res.status(400).json({ error: `Product ${item.productId} not available` });
        return;
      }
      if (product.availableQuantity < item.quantity) {
        res.status(400).json({ error: `Insufficient stock for ${product.title}` });
        return;
      }

      // All items must be from same seller
      if (!sellerId) sellerId = product.seller.toString();
      else if (product.seller.toString() !== sellerId) {
        res.status(400).json({ error: 'All items must be from the same seller' });
        return;
      }

      const itemSubtotal = product.pricePerUnit * item.quantity;
      subtotal += itemSubtotal;

      enrichedItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.pricePerUnit,
        currency: product.currency,
        subtotal: itemSubtotal,
        species: product.species,
        category: product.category,
        origin: product.origin,
      });
    }

    const taxAmount = subtotal * 0.125; // 12.5% Ghana VAT
    const shippingCost = isExport ? 500 : 50; // Simplified; integrate real freight API
    const totalAmount = subtotal + taxAmount + shippingCost;

    // Export compliance checklist
    const complianceChecklist = isExport
      ? [
          { item: 'Commercial Invoice', completed: false },
          { item: 'Packing List', completed: false },
          { item: 'Certificate of Origin (Form A)', completed: false },
          { item: 'Phytosanitary Certificate', completed: false },
          { item: 'FLEGT License (if applicable)', completed: false },
          ...(destinationCountry === 'USA'
            ? [{ item: 'Lacey Act Declaration', completed: false }]
            : []),
          ...(destinationCountry && ['DE', 'FR', 'GB', 'NL', 'BE', 'EU'].includes(destinationCountry)
            ? [{ item: 'EUDR Due Diligence Statement', completed: false }]
            : []),
          { item: 'Bill of Lading', completed: false },
          { item: 'Fumigation Certificate', completed: false },
        ]
      : [];

    const order = await Order.create({
      buyer: req.user!.id,
      seller: sellerId,
      items: enrichedItems,
      paymentMethod,
      subtotal,
      taxAmount,
      shippingCost,
      totalAmount,
      currency: 'USD',
      shippingAddress,
      specialInstructions,
      exportCompliance: {
        isExport: !!isExport,
        destinationCountry,
        laceyActDeclarationGenerated: false,
        complianceChecklist,
      },
    });

    // Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableQuantity: -item.quantity },
      });
    }

    await order.populate(['buyer', 'seller', 'items.product']);

    res.status(201).json({ message: 'Order created', order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/my - buyer's orders
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter: Record<string, any> = { buyer: req.user!.id };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('seller', 'fullName company')
        .populate('items.product', 'title images')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/seller - seller's received orders
export const getSellerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter: Record<string, any> = { seller: req.user!.id };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('buyer', 'fullName company email phone')
        .populate('items.product', 'title images')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'fullName company email phone')
      .populate('seller', 'fullName company email phone')
      .populate('items.product', 'title images species category');

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Only buyer, seller, or admin can view
    const userId = req.user!.id;
    if (
      order.buyer._id.toString() !== userId &&
      order.seller._id.toString() !== userId &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/orders/:id/status - update status (seller or admin)
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, location, description, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.seller.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.actualDelivery = new Date();

    // Manual tracking event
    order.trackingEvents.push({
      status,
      location: location || 'WoodTrade System',
      timestamp: new Date(),
      description: description || `Status updated to ${status}`,
      updatedBy: req.user!.id as any,
    });

    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
