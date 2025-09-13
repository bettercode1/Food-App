import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import type { Manager } from '@shared/schema';

// Extend Request interface to include auth user
declare global {
  namespace Express {
    interface Request {
      manager?: Manager;
    }
  }
}

// Routes that require authentication
const protectedRoutes = [
  '/api/orders/:id/status',
  '/api/menu/items',
  '/api/manager/:managerId/restaurant'
];

// Check if route needs authentication
function isProtectedRoute(path: string, method: string): boolean {
  if (method === 'PUT' && path.match(/^\/api\/orders\/[^\/]+\/status$/)) {
    return true;
  }
  if (method === 'POST' && path === '/api/menu/items') {
    return true;
  }
  if (method === 'PUT' && path.match(/^\/api\/menu\/items\/[^\/]+$/)) {
    return true;
  }
  if (method === 'DELETE' && path.match(/^\/api\/menu\/items\/[^\/]+$/)) {
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/manager\/[^\/]+\/restaurant$/)) {
    return true;
  }
  if (method === 'GET' && path.match(/^\/api\/orders\/restaurant\/[^\/]+$/)) {
    return true;
  }
  return false;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip auth for non-protected routes
  if (!isProtectedRoute(req.path, req.method)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Parse the manager data from the token
    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    const managerData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Verify manager exists and is active
    const manager = await storage.getManager(managerData.id);
    if (!manager || !manager.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive manager' });
    }

    // Verify the manager data matches
    if (manager.username !== managerData.username) {
      return res.status(401).json({ error: 'Invalid manager credentials' });
    }

    req.manager = manager;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

// Helper function to verify manager owns restaurant for order
export async function verifyManagerOwnsOrderRestaurant(managerId: string, orderId: string): Promise<boolean> {
  try {
    const order = await storage.getOrder(orderId);
    if (!order) return false;
    
    const restaurant = await storage.getRestaurantByManager(managerId);
    if (!restaurant) return false;
    
    return order.restaurantId === restaurant.id;
  } catch (error) {
    return false;
  }
}