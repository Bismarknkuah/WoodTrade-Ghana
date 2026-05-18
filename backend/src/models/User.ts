import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'buyer' | 'seller' | 'reseller' | 'manufacturer' | 'admin';
export type LicenseStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface ILicense {
  type: string;             // e.g. 'TIDD', 'Forestry Commission', 'Business Registration'
  number: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate: Date;
  documentUrl: string;
  status: LicenseStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNote?: string;
  reviewedAt?: Date;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  company?: string;
  region: string;           // Ghanaian region
  address: string;
  profileImageUrl?: string;

  // Business Details
  businessRegNumber?: string;
  taxIdNumber?: string;
  website?: string;

  // Verification
  isEmailVerified: boolean;
  isApproved: boolean;      // Admin approval for sellers/manufacturers
  verificationBadge: boolean;
  suspensionReason?: string;
  isSuspended: boolean;

  // Licenses (for sellers, manufacturers, resellers)
  licenses: ILicense[];

  // Sustainability
  sustainabilityScore: number;  // 0-100
  fscCertified: boolean;
  pefcCertified: boolean;

  // Export Credentials
  exportLicenseNumber?: string;
  flegt?: string;           // Forest Law Enforcement, Governance and Trade license

  // Timestamps
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  getActiveLicenses(): ILicense[];
  hasExpiredLicenses(): boolean;
}

const LicenseSchema = new Schema<ILicense>({
  type: { type: String, required: true },
  number: { type: String, required: true },
  issuedBy: { type: String, required: true },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  documentUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'expired'], default: 'pending' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewNote: String,
  reviewedAt: Date,
});

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'reseller', 'manufacturer', 'admin'],
      default: 'buyer',
    },
    company: { type: String, trim: true },
    region: { type: String, required: true },
    address: { type: String, required: true },
    profileImageUrl: String,

    businessRegNumber: String,
    taxIdNumber: String,
    website: String,

    isEmailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    verificationBadge: { type: Boolean, default: false },
    suspensionReason: String,
    isSuspended: { type: Boolean, default: false },

    licenses: [LicenseSchema],

    sustainabilityScore: { type: Number, default: 0, min: 0, max: 100 },
    fscCertified: { type: Boolean, default: false },
    pefcCertified: { type: Boolean, default: false },

    exportLicenseNumber: String,
    flegt: String,

    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get active (approved + not expired) licenses
UserSchema.methods.getActiveLicenses = function (): ILicense[] {
  const now = new Date();
  return this.licenses.filter(
    (l: ILicense) => l.status === 'approved' && new Date(l.expiryDate) > now
  );
};

// Check if any license has expired
UserSchema.methods.hasExpiredLicenses = function (): boolean {
  const now = new Date();
  return this.licenses.some(
    (l: ILicense) => l.status === 'approved' && new Date(l.expiryDate) <= now
  );
};

// Auto-expire licenses
UserSchema.pre('save', function (next) {
  const now = new Date();
  this.licenses.forEach((license) => {
    if (license.status === 'approved' && new Date(license.expiryDate) <= now) {
      license.status = 'expired';
    }
  });
  next();
});

// Index
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, isApproved: 1 });
UserSchema.index({ region: 1 });

export default mongoose.model<IUser>('User', UserSchema);
