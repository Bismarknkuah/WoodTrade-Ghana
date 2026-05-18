// frontend/src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('wt_token');
}

export function setToken(token: string): void {
  localStorage.setItem('wt_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('wt_token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ─── Core request ─────────────────────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Handle 401 – token expired
  if (res.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
    throw new Error('Session expired. Please log in again.');
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error('Invalid server response');
  }

  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  return data;
}

// ─── File upload (multipart) ──────────────────────────────────────────────────
async function uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || 'Upload failed');
  return data;
}

// ─── Query string builder ─────────────────────────────────────────────────────
function qs(params: Record<string, any> = {}): string {
  const clean = Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  );
  const str = new URLSearchParams(clean).toString();
  return str ? `?${str}` : '';
}

// ═════════════════════════════════════════════════════════════════════════════
// AUTH
// ═════════════════════════════════════════════════════════════════════════════
export const authAPI = {
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: Record<string, any>) =>
    request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<any>('/api/auth/me'),

  updateProfile: (data: Record<string, any>) =>
    request<any>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<any>('/api/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  logout: () => {
    removeToken();
    window.location.href = '/';
  },
};

// ═════════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ═════════════════════════════════════════════════════════════════════════════
export const productsAPI = {
  // Browse catalog with filters
  list: (params: {
    category?: string;
    region?: string;
    district?: string;
    species?: string;
    minPrice?: number;
    maxPrice?: number;
    flegtVerified?: boolean;
    fscCertified?: boolean;
    laceyActCompliant?: boolean;
    eudrCompliant?: boolean;
    exportMarket?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
  } = {}) => request<any>(`/api/products${qs(params)}`),

  getById: (id: string) => request<any>(`/api/products/${id}`),

  getByPassport: (passportId: string) =>
    request<any>(`/api/products/passport/${passportId}`),

  create: (data: Record<string, any>) =>
    request<any>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, any>) =>
    request<any>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<any>(`/api/products/${id}`, { method: 'DELETE' }),

  // Seller's own listings
  mine: (params: { page?: number; limit?: number; status?: string } = {}) =>
    request<any>(`/api/products/seller/mine${qs(params)}`),

  // Add a traceability event
  addTraceEvent: (id: string, event: {
    event: string;
    location: string;
    notes?: string;
  }) =>
    request<any>(`/api/products/${id}/trace`, {
      method: 'POST',
      body: JSON.stringify(event),
    }),

  // Upload product images
  uploadImages: (id: string, formData: FormData) =>
    uploadFile<any>(`/api/products/${id}/images`, formData),
};

// ═════════════════════════════════════════════════════════════════════════════
// ORDERS
// ═════════════════════════════════════════════════════════════════════════════
export const ordersAPI = {
  create: (data: {
    items: Array<{ product: string; quantity: number }>;
    shippingAddress: {
      street: string;
      city: string;
      country: string;
      state?: string;
      postalCode?: string;
    };
    currency?: 'GHS' | 'USD';
    notes?: string;
  }) =>
    request<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Buyer's orders
  myOrders: (params: { page?: number; limit?: number; status?: string } = {}) =>
    request<any>(`/api/orders/my${qs(params)}`),

  // Seller's incoming orders
  sellerOrders: (params: { page?: number; limit?: number; status?: string } = {}) =>
    request<any>(`/api/orders/seller${qs(params)}`),

  getById: (id: string) => request<any>(`/api/orders/${id}`),

  updateStatus: (id: string, data: {
    status: string;
    note?: string;
    trackingNumber?: string;
    carrier?: string;
  }) =>
    request<any>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  cancel: (id: string, reason: string) =>
    request<any>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled', note: reason }),
    }),
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT COMPLIANCE
// ═════════════════════════════════════════════════════════════════════════════
export const exportAPI = {
  // PDF download URLs (open directly in browser or use as anchor href)
  laceyActUrl: (orderId: string) =>
    `${BASE_URL}/api/export/lacey-act/${orderId}?token=${getToken()}`,

  commercialInvoiceUrl: (orderId: string) =>
    `${BASE_URL}/api/export/commercial-invoice/${orderId}?token=${getToken()}`,

  eudrStatementUrl: (orderId: string) =>
    `${BASE_URL}/api/export/eudr-statement/${orderId}?token=${getToken()}`,

  flegtCertificateUrl: (orderId: string) =>
    `${BASE_URL}/api/export/flegt-certificate/${orderId}?token=${getToken()}`,

  getComplianceStatus: (orderId: string) =>
    request<any>(`/api/export/compliance-status/${orderId}`),

  updateComplianceItem: (orderId: string, data: {
    item: string;
    completed: boolean;
    notes?: string;
  }) =>
    request<any>(`/api/export/compliance/${orderId}/checklist`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ═════════════════════════════════════════════════════════════════════════════
// LICENSES
// ═════════════════════════════════════════════════════════════════════════════
export const licensesAPI = {
  // Upload license metadata (document URL from Cloudinary)
  upload: (data: {
    type: string;
    licenseNumber: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate: string;
    documentUrl?: string;
  }) =>
    request<any>('/api/licenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Upload license document file
  uploadDocument: (formData: FormData) =>
    uploadFile<{ url: string; publicId: string }>('/api/licenses/upload', formData),

  mine: () => request<any>('/api/licenses/mine'),

  delete: (licenseId: string) =>
    request<any>(`/api/licenses/${licenseId}`, { method: 'DELETE' }),
};

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN
// ═════════════════════════════════════════════════════════════════════════════
export const adminAPI = {
  stats: () => request<any>('/api/admin/stats'),

  // License management
  pendingLicenses: () => request<any>('/api/admin/pending-licenses'),

  reviewLicense: (userId: string, licenseId: string, data: {
    action: 'approve' | 'reject';
    rejectionReason?: string;
  }) =>
    request<any>(`/api/admin/users/${userId}/licenses/${licenseId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Product management
  approveProduct: (productId: string) =>
    request<any>(`/api/admin/products/${productId}/approve`, {
      method: 'PATCH',
    }),

  rejectProduct: (productId: string, reason: string) =>
    request<any>(`/api/admin/products/${productId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  // User management
  getUsers: (params: { role?: string; status?: string; page?: number } = {}) =>
    request<any>(`/api/admin/users${qs(params)}`),

  suspendUser: (userId: string, reason: string) =>
    request<any>(`/api/admin/users/${userId}/suspend`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  reactivateUser: (userId: string) =>
    request<any>(`/api/admin/users/${userId}/reactivate`, {
      method: 'PATCH',
    }),

  // Orders overview
  allOrders: (params: { page?: number; status?: string; destination?: string } = {}) =>
    request<any>(`/api/admin/orders${qs(params)}`),

  // Platform compliance report
  complianceReport: () => request<any>('/api/admin/compliance-report'),
};

// ═════════════════════════════════════════════════════════════════════════════
// SEARCH
// ═════════════════════════════════════════════════════════════════════════════
export const searchAPI = {
  products: (query: string, filters: Record<string, any> = {}) =>
    request<any>(`/api/products${qs({ search: query, ...filters })}`),

  suggestions: (query: string) =>
    request<any>(`/api/products/suggestions${qs({ q: query })}`),
};

// ═════════════════════════════════════════════════════════════════════════════
// CURRENCY (client-side helper using live rate or fallback)
// ═════════════════════════════════════════════════════════════════════════════
export const currencyAPI = {
  // Fallback rate — replace with live API if needed
  GHS_TO_USD: 0.068,
  USD_TO_GHS: 14.7,

  convert: (amount: number, from: 'GHS' | 'USD', to: 'GHS' | 'USD'): number => {
    if (from === to) return amount;
    return from === 'GHS'
      ? parseFloat((amount * 0.068).toFixed(2))
      : parseFloat((amount * 14.7).toFixed(2));
  },

  format: (amount: number, currency: 'GHS' | 'USD'): string => {
    if (currency === 'GHS')
      return `₵${amount.toLocaleString('en-GH', { maximumFractionDigits: 0 })}`;
    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  },

  formatBoth: (ghsAmount: number): string => {
    const usd = parseFloat((ghsAmount * 0.068).toFixed(0));
    return `₵${ghsAmount.toLocaleString()} / $${usd.toLocaleString()}`;
  },
};
