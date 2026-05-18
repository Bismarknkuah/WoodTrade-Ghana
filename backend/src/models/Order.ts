import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_shipping'
  | 'shipped'
  | 'in_transit'
  | 'customs_clearance'
  | 'delivered'
  | 'cancelled'
  | 'disputed';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';
export type PaymentMethod = 'mobile_money' | 'stripe' | 'paypal' | 'bank_transfer' | 'cash';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  currency: 'GHS' | 'USD' | 'EUR';
  subtotal: number;
  species: string;
  category: string;
  origin: string;
}

export interface IShippingAddress {
  recipientName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IExportCompliance {
  isExport: boolean;
  destinationCountry?: string;
  laceyActDeclarationGenerated: boolean;
  laceyActDeclarationUrl?: string;
  commercialInvoiceUrl?: string;
  packingListUrl?: string;
  certificateOfOriginUrl?: string;
  phytosanitaryCertUrl?: string;
  flegtLicenseUrl?: string;
  billOfLadingUrl?: string;
  customsDeclarationNumber?: string;
  complianceChecklist: Array<{
    item: string;
    completed: boolean;
    completedAt?: Date;
  }>;
}

export interface ITrackingEvent {
  status: string;
  location: string;
  timestamp: Date;
  description: string;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface IOrder extends Document {
  orderNumber: string;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  items: IOrderItem[];

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;

  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  currency: 'GHS' | 'USD' | 'EUR';

  shippingAddress: IShippingAddress;
  shippingMethod?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  freightForwarder?: string;

  exportCompliance: IExportCompliance;
  trackingEvents: ITrackingEvent[];

  specialInstructions?: string;
  internalNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  currency: { type: String, enum: ['GHS', 'USD', 'EUR'], required: true },
  subtotal: { type: Number, required: true },
  species: String,
  category: String,
  origin: String,
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  recipientName: { type: String, required: true },
  company: String,
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: String,
  country: { type: String, required: true },
  phone: { type: String, required: true },
});

const ExportComplianceSchema = new Schema<IExportCompliance>({
  isExport: { type: Boolean, default: false },
  destinationCountry: String,
  laceyActDeclarationGenerated: { type: Boolean, default: false },
  laceyActDeclarationUrl: String,
  commercialInvoiceUrl: String,
  packingListUrl: String,
  certificateOfOriginUrl: String,
  phytosanitaryCertUrl: String,
  flegtLicenseUrl: String,
  billOfLadingUrl: String,
  customsDeclarationNumber: String,
  complianceChecklist: [
    {
      item: String,
      completed: { type: Boolean, default: false },
      completedAt: Date,
    },
  ],
});

const TrackingEventSchema = new Schema<ITrackingEvent>({
  status: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  description: String,
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],

    status: {
      type: String,
      enum: [
        'pending', 'confirmed', 'processing', 'ready_for_shipping',
        'shipped', 'in_transit', 'customs_clearance', 'delivered',
        'cancelled', 'disputed',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['mobile_money', 'stripe', 'paypal', 'bank_transfer', 'cash'],
    },
    paymentReference: String,

    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, enum: ['GHS', 'USD', 'EUR'], default: 'USD' },

    shippingAddress: ShippingAddressSchema,
    shippingMethod: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    trackingNumber: String,
    freightForwarder: String,

    exportCompliance: ExportComplianceSchema,
    trackingEvents: [TrackingEventSchema],

    specialInstructions: String,
    internalNotes: String,
  },
  { timestamps: true }
);

// Auto-generate order number
OrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const ts = Date.now().toString().slice(-8);
    this.orderNumber = `WTG-ORD-${ts}`;
  }
  next();
});

// Add tracking event when status changes
OrderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.trackingEvents.push({
      status: this.status,
      location: 'WoodTrade System',
      timestamp: new Date(),
      description: `Order status updated to: ${this.status.replace(/_/g, ' ')}`,
    });
  }
  next();
});

OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ seller: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
