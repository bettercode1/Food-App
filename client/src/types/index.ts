export interface User {
  id: string;
  username: string;
  employeeName: string;
  techPark: string;
  company: string;
  designation: string;
  mobile: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

export interface Manager {
  id: string;
  username: string;
  restaurantName: string;
  email: string;
  techPark: string;
  name?: string;
  role?: string;
  createdAt?: string;
}

export interface TechPark {
  id: string;
  name: string;
  location: string;
  description?: string;
  totalOutlets: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  distance: number;
  preparationTime: string;
  estimatedTime?: string;
  priceRange: string;
  isOpen: boolean;
  deliveryAvailable: boolean;
  takeawayAvailable: boolean;
  dineinAvailable: boolean;
  imageUrl?: string;
  location?: { lat: number; lng: number };
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime?: number;
  imageUrl?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  restaurantId: string;
  orderType: 'delivery' | 'dine-in' | 'takeaway';
  status: string;
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  total: number;
  totalAmount?: number;
  paymentMethod?: string;
  paymentStatus: string;
  deliveryAddress?: string;
  estimatedTime?: string;
  specialInstructions?: string;
  createdAt?: Date | string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  total: number;
  name?: string;
  image?: string;
}

export type AuthUser = User | Manager | null;

export type UserType = 'employee' | 'manager' | null;
