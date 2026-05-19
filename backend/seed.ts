/**
 * WoodTrade Ghana – Database Seed Script
 * Usage: ts-node scripts/seed.ts
 * Or:    npx ts-node scripts/seed.ts
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

// ─── Inline minimal models for seeding ────────────────────────────────────
// (avoids circular imports; use actual models in production)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/woodtrade';

const USERS = [
  {
    name: 'Admin User',
    email: 'admin@woodtrade.gh',
    password: 'Admin@1234',
    role: 'admin',
    isApproved: true,
    verificationBadge: true,
  },
  {
    name: 'Kofi Asante',
    email: 'kofi@ashantiforest.gh',
    password: 'Seller@1234',
    role: 'seller',
    isApproved: true,
    verificationBadge: true,
    companyName: 'Ashanti Forest Products Ltd.',
    region: 'Ashanti',
    sustainabilityScore: 92,
  },
  {
    name: 'Ama Owusu',
    email: 'ama@kumasaw.gh',
    password: 'Seller@1234',
    role: 'manufacturer',
    isApproved: true,
    verificationBadge: true,
    companyName: 'KumaSaw Processing Ltd.',
    region: 'Ashanti',
    sustainabilityScore: 85,
  },
  {
    name: 'John Smith',
    email: 'buyer@timberusa.com',
    password: 'Buyer@1234',
    role: 'buyer',
    isApproved: true,
    companyName: 'Timber USA Inc.',
    region: 'USA',
  },
  {
    name: 'Hans Mueller',
    email: 'hans@eurowood.de',
    password: 'Buyer@1234',
    role: 'buyer',
    isApproved: true,
    companyName: 'EuroWood GmbH',
    region: 'Germany',
  },
];

const PRODUCT_TEMPLATES = [
  {
    name: 'Premium Odum Timber (Iroko)',
    species: 'Milicia excelsa',
    scientificName: 'Milicia excelsa',
    category: 'timber',
    description: 'High-grade Odum timber from Ashanti Region. Known for exceptional durability and insect resistance.',
    price: 2800,
    currency: 'GHS',
    unit: 'per cubic metre',
    minOrderQuantity: 5,
    availableStock: 84,
    region: 'Ashanti',
    harvestingLocation: 'Offinso North, Ashanti Region',
    grading: 'Grade A (Select)',
    moistureContent: '12-15%',
    flegtVerified: true,
    fscCertified: true,
    laceyActCompliant: true,
    eudrCompliant: true,
    sustainabilityScore: 92,
    exportMarkets: ['USA', 'Europe', 'Asia'],
  },
  {
    name: 'Sapele Hardwood',
    species: 'Entandrophragma cylindricum',
    scientificName: 'Entandrophragma cylindricum',
    category: 'timber',
    description: 'Premium Sapele hardwood with distinctive interlocked grain. Excellent for high-end furniture.',
    price: 3200,
    currency: 'GHS',
    unit: 'per cubic metre',
    minOrderQuantity: 3,
    availableStock: 52,
    region: 'Eastern',
    flegtVerified: true,
    fscCertified: false,
    laceyActCompliant: true,
    eudrCompliant: true,
    sustainabilityScore: 88,
    exportMarkets: ['USA', 'Europe'],
  },
  {
    name: 'Ghana Teak Planks',
    species: 'Tectona grandis',
    scientificName: 'Tectona grandis',
    category: 'timber',
    description: 'FSC-certified Teak planks ideal for outdoor furniture, decking, and marine applications.',
    price: 4500,
    currency: 'GHS',
    unit: 'per cubic metre',
    minOrderQuantity: 2,
    availableStock: 38,
    region: 'Brong-Ahafo',
    flegtVerified: true,
    fscCertified: true,
    laceyActCompliant: true,
    eudrCompliant: true,
    sustainabilityScore: 95,
    exportMarkets: ['USA', 'Europe', 'Middle East'],
  },
  {
    name: 'Wawa Softwood Boards',
    species: 'Triplochiton scleroxylon',
    scientificName: 'Triplochiton scleroxylon',
    category: 'timber',
    description: 'Lightweight Wawa boards popular for interior applications, packing, and light construction.',
    price: 1400,
    currency: 'GHS',
    unit: 'per cubic metre',
    minOrderQuantity: 10,
    availableStock: 200,
    region: 'Western',
    flegtVerified: true,
    fscCertified: false,
    laceyActCompliant: true,
    sustainabilityScore: 78,
    exportMarkets: ['Europe', 'Asia'],
  },
  {
    name: 'Premium Bamboo Poles',
    species: 'Bambusa vulgaris',
    scientificName: 'Bambusa vulgaris',
    category: 'bamboo',
    description: 'Strong, treated bamboo poles from the Volta Region. Great for construction and scaffolding.',
    price: 45,
    currency: 'GHS',
    unit: 'per pole',
    minOrderQuantity: 100,
    availableStock: 5000,
    region: 'Volta',
    flegtVerified: false,
    fscCertified: false,
    laceyActCompliant: true,
    sustainabilityScore: 96,
    exportMarkets: ['Europe', 'Asia'],
  },
  {
    name: 'Marine Grade Plywood 18mm',
    species: 'Mixed Hardwood',
    scientificName: 'Mixed species',
    category: 'plywood',
    description: 'WBP-bonded marine plywood sheets. Ideal for boat building, outdoor, and moisture-prone areas.',
    price: 320,
    currency: 'GHS',
    unit: 'per sheet (2440×1220mm)',
    minOrderQuantity: 20,
    availableStock: 800,
    region: 'Greater Accra',
    flegtVerified: true,
    fscCertified: true,
    laceyActCompliant: true,
    eudrCompliant: true,
    sustainabilityScore: 82,
    exportMarkets: ['USA', 'Europe'],
  },
];

async function seed(): Promise<void> {
  console.log('🌱 Starting WoodTrade Ghana database seed...\n');

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Drop existing data
    const db = mongoose.connection.db;
    if (db) {
      await db.dropDatabase();
      console.log('🗑  Dropped existing database');
    }

    // Create collections manually since we're not importing full models
    const usersCollection = mongoose.connection.collection('users');
    const productsCollection = mongoose.connection.collection('products');

    // Seed Users
    const hashedUsers = await Promise.all(
      USERS.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
        createdAt: new Date(),
        updatedAt: new Date(),
        licenses: [],
        flegtLicenseNumber: u.role === 'seller' ? `FLEGT-GH-2024-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
      }))
    );

    const insertedUsers = await usersCollection.insertMany(hashedUsers);
    console.log(`👥 Seeded ${insertedUsers.insertedCount} users`);

    // Get seller IDs for product assignment
    const sellerUser = hashedUsers.find((u) => u.role === 'seller');
    const manufacturerUser = hashedUsers.find((u) => u.role === 'manufacturer');
    const sellerDocs = await usersCollection.find({ role: { $in: ['seller', 'manufacturer'] } }).toArray();

    // Seed Products
    const products = PRODUCT_TEMPLATES.map((p, i) => ({
      ...p,
      seller: sellerDocs[i % sellerDocs.length]?._id || sellerDocs[0]?._id,
      status: 'approved',
      productPassportId: `WTG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      images: [`https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800`],
      views: Math.floor(Math.random() * 500),
      inquiries: Math.floor(Math.random() * 50),
      traceabilityLog: [
        {
          event: 'Harvesting',
          location: `${p.region}, Ghana`,
          date: new Date('2024-10-01'),
          actor: sellerUser?.companyName || 'Unknown',
          hash: Math.random().toString(36).substring(2, 14) + '…',
          notes: 'Initial harvest recorded',
        },
        {
          event: 'FLEGT Verification',
          location: 'Ghana Forestry Commission',
          date: new Date('2024-10-15'),
          actor: 'Ghana Forestry Commission',
          hash: Math.random().toString(36).substring(2, 14) + '…',
          notes: 'Legal verification completed',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const insertedProducts = await productsCollection.insertMany(products);
    console.log(`🪵 Seeded ${insertedProducts.insertedCount} products`);

    console.log('\n✅ Seed complete!\n');
    console.log('─── Test Accounts ──────────────────────────────────');
    console.log('Admin:        admin@woodtrade.gh       / Admin@1234');
    console.log('Seller:       kofi@ashantiforest.gh    / Seller@1234');
    console.log('Manufacturer: ama@kumasaw.gh           / Seller@1234');
    console.log('Buyer (USA):  buyer@timberusa.com      / Buyer@1234');
    console.log('Buyer (DE):   hans@eurowood.de         / Buyer@1234');
    console.log('────────────────────────────────────────────────────\n');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
