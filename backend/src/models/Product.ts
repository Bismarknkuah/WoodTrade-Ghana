import mongoose, { Document, Schema } from 'mongoose';

export type WoodCategory = 'timber' | 'bamboo' | 'plywood' | 'engineered_wood' | 'lumber' | 'charcoal';
export type ProductStatus = 'draft' | 'active' | 'sold_out' | 'suspended' | 'pending_review';
export type MoistureContent = 'green' | 'air_dried' | 'kiln_dried';

export interface IDimension {
  length?: number;
  width?: number;
  thickness?: number;
  unit: 'mm' | 'cm' | 'm' | 'inches' | 'feet';
}

export interface ITraceabilityRecord {
  event: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  timestamp: Date;
  actor: mongoose.Types.ObjectId;
  actorRole: string;
  notes?: string;
  documentUrl?: string;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  category: WoodCategory;
  species: string;           // e.g. 'Odum (Iroko)', 'Wawa', 'Mahogany', 'Bamboo'
  grade: string;             // e.g. 'Grade A', 'Grade B', 'Structural'
  origin: string;            // Forest / region in Ghana
  harvestDate?: Date;
  forestConcession?: string; // License number of harvest area

  seller: mongoose.Types.ObjectId;

  // Pricing
  pricePerUnit: number;
  currency: 'GHS' | 'USD' | 'EUR';
  unit: 'm3' | 'board_feet' | 'pieces' | 'kg' | 'tons' | 'bundles';
  minimumOrder: number;
  bulkPricingTiers?: Array<{ minQty: number; pricePerUnit: number }>;

  // Stock
  availableQuantity: number;
  status: ProductStatus;

  // Physical Attributes
  dimensions?: IDimension;
  moistureContent?: MoistureContent;
  dryingMethod?: string;
  treatment?: string;        // e.g. 'Pressure treated', 'Untreated'

  // Certifications
  flegtVerified: boolean;
  flegtLicenseNumber?: string;
  fscCertified: boolean;
  pefcCertified: boolean;
  phytosanitaryCertAvailable: boolean;

  // Media
  images: string[];
  videoUrl?: string;
  specSheetUrl?: string;

  // Traceability (blockchain-style log)
  traceabilityLog: ITraceabilityRecord[];
  qrCode?: string;
  productPassportId: string;  // Unique ID for QR / NFC

  // Export Suitability
  laceyActCompliant: boolean;
  exportMarkets: string[];   // e.g. ['USA', 'EU', 'China']

  // Stats
  views: number;
  inquiries: number;
  sustainabilityScore: number;

  createdAt: Date;
  updatedAt: Date;
}

const DimensionSchema = new Schema<IDimension>({
  length: Number,
  width: Number,
  thickness: Number,
  unit: { type: String, enum: ['mm', 'cm', 'm', 'inches', 'feet'], default: 'm' },
});

const TraceabilitySchema = new Schema<ITraceabilityRecord>({
  event: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  timestamp: { type: Date, default: Date.now },
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  actorRole: String,
  notes: String,
  documentUrl: String,
});

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    description: { type: String, required: true, index: 'text' },
    category: {
      type: String,
      enum: ['timber', 'bamboo', 'plywood', 'engineered_wood', 'lumber', 'charcoal'],
      required: true,
    },
    species: { type: String, required: true },
    grade: { type: String, required: true },
    origin: { type: String, required: true },
    harvestDate: Date,
    forestConcession: String,

    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    pricePerUnit: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['GHS', 'USD', 'EUR'], default: 'GHS' },
    unit: { type: String, enum: ['m3', 'board_feet', 'pieces', 'kg', 'tons', 'bundles'], required: true },
    minimumOrder: { type: Number, required: true, min: 1 },
    bulkPricingTiers: [
      {
        minQty: Number,
        pricePerUnit: Number,
      },
    ],

    availableQuantity: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['draft', 'active', 'sold_out', 'suspended', 'pending_review'],
      default: 'pending_review',
    },

    dimensions: DimensionSchema,
    moistureContent: { type: String, enum: ['green', 'air_dried', 'kiln_dried'] },
    dryingMethod: String,
    treatment: String,

    flegtVerified: { type: Boolean, default: false },
    flegtLicenseNumber: String,
    fscCertified: { type: Boolean, default: false },
    pefcCertified: { type: Boolean, default: false },
    phytosanitaryCertAvailable: { type: Boolean, default: false },

    images: [String],
    videoUrl: String,
    specSheetUrl: String,

    traceabilityLog: [TraceabilitySchema],
    qrCode: String,
    productPassportId: { type: String, unique: true },

    laceyActCompliant: { type: Boolean, default: false },
    exportMarkets: [String],

    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    sustainabilityScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Generate unique product passport ID
ProductSchema.pre('save', function (next) {
  if (!this.productPassportId) {
    this.productPassportId = `WTG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

ProductSchema.index({ title: 'text', description: 'text', species: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ laceyActCompliant: 1, flegtVerified: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
