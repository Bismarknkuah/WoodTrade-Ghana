import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

// ─── Authenticate JWT ─────────────────────────────────────────────────────────
export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Session expired. Please log in again.' });
      } else {
        res.status(401).json({ error: 'Invalid or tampered token.' });
      }
      return;
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ error: 'Account not found. Please register.' });
      return;
    }

    if ((user as any).isSuspended) {
      res.status(403).json({ error: 'Your account has been suspended. Contact support@woodtrade.gh' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication error' });
  }
}

// ─── Authorize by Role ────────────────────────────────────────────────────────
export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
      return;
    }
    next();
  };
}

// ─── Require Account Approval ─────────────────────────────────────────────────
export function requireApproved(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user?.isApproved) {
    res.status(403).json({
      error: 'Your account is pending admin approval. You will be notified via email once approved.'
    });
    return;
  }
  next();
}

// ─── Require Verified Seller ──────────────────────────────────────────────────
export function requireVerifiedSeller(req: AuthRequest, res: Response, next: NextFunction): void {
  const sellerRoles = ['seller', 'manufacturer', 'reseller', 'carpenter'];
  if (!sellerRoles.includes(req.user?.role)) {
    res.status(403).json({ error: 'Only verified sellers can perform this action.' });
    return;
  }
  if (!req.user?.isApproved) {
    res.status(403).json({ error: 'Your seller account is pending approval.' });
    return;
  }
  next();
}
