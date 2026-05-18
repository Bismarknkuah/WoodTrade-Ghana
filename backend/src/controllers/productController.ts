import { Request, Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// GET /api/products - public catalog with filters
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category, species, minPrice, maxPrice, currency,
      laceyAct, flegtVerified, fscCertified, exportMarket,
      search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc',
    } = req.query;

    const filter: Record<string, any> = { status: 'active' };

    if (category) filter.category = category;
    if (species) filter.species = new RegExp(species as string, 'i');
    if (laceyAct === 'true') filter.laceyActCompliant = true;
    if (flegtVerified === 'true') filter.flegtVerified = true;
    if (fscCertified === 'true') filter.fscCertified = true;
    if (exportMarket) filter.exportMarkets = exportMarket;

    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    if (currency) filter.currency = currency;

    if (search) {
      filter.$text = { $search: search as string };
    }

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'fullName company region verificationBadge sustainabilityScore')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'fullName company region phone verificationBadge sustainabilityScore fscCertified pefcCertified')
      .populate('traceabilityLog.actor', 'fullName role');

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Increment view count
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/passport/:passportId
export const getByPassportId = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ productPassportId: req.params.passportId })
      .populate('seller', 'fullName company verificationBadge')
      .populate('traceabilityLog.actor', 'fullName role');

    if (!product) {
      res.status(404).json({ error: 'Product passport not found' });
      return;
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products - seller creates product
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productData = {
      ...req.body,
      seller: req.user!.id,
      status: 'pending_review',
    };

    // Auto-add first traceability entry
    productData.traceabilityLog = [
      {
        event: 'Product Listed',
        location: req.body.origin || 'Ghana',
        timestamp: new Date(),
        actor: req.user!.id,
        actorRole: req.user!.role,
        notes: 'Initial product listing on WoodTrade Ghana platform',
      },
    ];

    const product = await Product.create(productData);

    res.status(201).json({ message: 'Product submitted for review', product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/products/:id - seller updates their product
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    if (product.seller.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Not authorized to edit this product' });
      return;
    }

    const disallowedUpdates = ['seller', 'productPassportId', 'traceabilityLog'];
    disallowedUpdates.forEach((field) => delete req.body[field]);

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ message: 'Product updated', product: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products/:id/trace - add traceability event
export const addTraceabilityEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { event, location, coordinates, notes, documentUrl } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          traceabilityLog: {
            event,
            location,
            coordinates,
            notes,
            documentUrl,
            timestamp: new Date(),
            actor: req.user!.id,
            actorRole: req.user!.role,
          },
        },
      },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Traceability event added', traceabilityLog: product.traceabilityLog });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/seller/mine - get seller's own products
export const getMyProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = { seller: req.user!.id };
    if (status) filter.status = status;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
