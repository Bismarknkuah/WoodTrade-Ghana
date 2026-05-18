// shared/types/index.ts

export type UserRole = 'buyer' | 'seller' | 'reseller' | 'manufacturer' | 'admin';
export type LicenseStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type WoodCategory = 'timber' | 'bamboo' | 'plywood' | 'engineered_wood' | 'lumber' | 'charcoal';
export type ProductStatus = 'draft' | 'active' | 'sold_out' | 'suspended' | 'pending_review';
export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'ready_for_shipping'
  | 'shipped' | 'in_transit' | 'customs_clearance' | 'delivered'
  | 'cancelled' | 'disputed';
export type Currency = 'GHS' | 'USD' | 'EUR';

export interface License {
  _id: string;
  type: string;
  number: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  documentUrl: string;
  status: LicenseStatus;
  reviewNote?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  company?: string;
  region: string;
  address: string;
  isApproved: boolean;
  verificationBadge: boolean;
  sustainabilityScore: number;
  fscCertified: boolean;
  pefcCertified: boolean;
  licenses: License[];
  exportLicenseNumber?: string;
  flegt?: string;
  createdAt: string;
}

export interface TraceabilityRecord {
  _id: string;
  event: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  timestamp: string;
  actor: { fullName: string; role: string };
  notes?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: WoodCategory;
  species: string;
  grade: string;
  origin: string;
  seller: User;
  pricePerUnit: number;
  currency: Currency;
  unit: string;
  minimumOrder: number;
  availableQuantity: number;
  status: ProductStatus;
  images: string[];
  flegtVerified: boolean;
  fscCertified: boolean;
  pefcCertified: boolean;
  laceyActCompliant: boolean;
  exportMarkets: string[];
  traceabilityLog: TraceabilityRecord[];
  productPassportId: string;
  sustainabilityScore: number;
  views: number;
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  currency: Currency;
  subtotal: number;
  species: string;
}

export interface ComplianceChecklistItem {
  item: string;
  completed: boolean;
  completedAt?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: User;
  seller: User;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
  totalAmount: number;
  currency: Currency;
  shippingAddress: {
    recipientName: string;
    country: string;
    city: string;
  };
  exportCompliance: {
    isExport: boolean;
    destinationCountry?: string;
    laceyActDeclarationGenerated: boolean;
    complianceChecklist: ComplianceChecklistItem[];
  };
  trackingEvents: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
  trackingNumber?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
