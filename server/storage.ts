import { 
  type User, type InsertUser, type Manager, type InsertManager,
  type TechPark, type InsertTechPark, type Restaurant, type InsertRestaurant,
  type MenuCategory, type InsertMenuCategory, type MenuItem, type InsertMenuItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Manager operations
  getManager(id: string): Promise<Manager | undefined>;
  getManagerByUsername(username: string): Promise<Manager | undefined>;
  createManager(manager: InsertManager): Promise<Manager>;

  // Tech Park operations
  getAllTechParks(): Promise<TechPark[]>;
  getTechPark(id: string): Promise<TechPark | undefined>;
  createTechPark(techPark: InsertTechPark): Promise<TechPark>;

  // Restaurant operations
  getRestaurantsByTechPark(techParkId: string): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getRestaurantByManager(managerId: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;

  // Menu operations
  getMenuCategories(restaurantId: string): Promise<MenuCategory[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  getMenuItems(restaurantId: string): Promise<MenuItem[]>;
  getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  getRestaurantOrders(restaurantId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private managers: Map<string, Manager> = new Map();
  private techParks: Map<string, TechPark> = new Map();
  private restaurants: Map<string, Restaurant> = new Map();
  private menuCategories: Map<string, MenuCategory> = new Map();
  private menuItems: Map<string, MenuItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed Tech Parks
    const manyataPark: TechPark = {
      id: randomUUID(),
      name: "Manyata Tech Park",
      location: "Nagawara, Bangalore",
      description: "Premium tech park with multiple food courts and restaurants",
      totalOutlets: 45,
      isActive: true,
    };
    this.techParks.set(manyataPark.id, manyataPark);

    // Seed sample manager
    const managerId = randomUUID();
    const sampleManager: Manager = {
      id: managerId,
      username: "manager@spicegarden.com",
      password: "password123", // In production, this should be hashed
      restaurantName: "Spice Garden",
      email: "manager@spicegarden.com",
      techPark: manyataPark.name,
      isActive: true,
      createdAt: new Date(),
    };
    this.managers.set(managerId, sampleManager);

    // Seed restaurants
    const restaurantId = randomUUID();
    const spiceGarden: Restaurant = {
      id: restaurantId,
      managerId: managerId,
      techParkId: manyataPark.id,
      name: "Spice Garden",
      description: "North Indian • Chinese • Continental",
      cuisine: "North Indian, Chinese, Continental",
      rating: 4.5,
      distance: 150,
      preparationTime: "15-20 min",
      priceRange: "₹₹",
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      location: { lat: 13.0389, lng: 77.6244 },
      createdAt: new Date(),
    };
    this.restaurants.set(restaurantId, spiceGarden);

    // Seed menu categories
    const mainCourseId = randomUUID();
    const mainCourse: MenuCategory = {
      id: mainCourseId,
      restaurantId: restaurantId,
      name: "Main Course",
      displayOrder: 1,
      isActive: true,
    };
    this.menuCategories.set(mainCourseId, mainCourse);

    // Seed menu items
    const menuItemsData = [
      {
        id: randomUUID(),
        name: "Butter Chicken",
        description: "Creamy tomato-based chicken curry with aromatic spices",
        price: 285,
        isVeg: false,
        preparationTime: 20,
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641"
      },
      {
        id: randomUUID(),
        name: "Paneer Tikka Masala",
        description: "Grilled cottage cheese in rich tomato gravy",
        price: 245,
        isVeg: true,
        preparationTime: 18,
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7"
      }
    ];

    menuItemsData.forEach(item => {
      const menuItem: MenuItem = {
        ...item,
        restaurantId: restaurantId,
        categoryId: mainCourseId,
        isAvailable: true,
        createdAt: new Date(),
      };
      this.menuItems.set(item.id, menuItem);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Manager operations
  async getManager(id: string): Promise<Manager | undefined> {
    return this.managers.get(id);
  }

  async getManagerByUsername(username: string): Promise<Manager | undefined> {
    return Array.from(this.managers.values()).find(manager => manager.username === username);
  }

  async createManager(insertManager: InsertManager): Promise<Manager> {
    const id = randomUUID();
    const manager: Manager = { 
      ...insertManager, 
      id, 
      createdAt: new Date(),
      isActive: insertManager.isActive ?? true
    };
    this.managers.set(id, manager);
    return manager;
  }

  // Tech Park operations
  async getAllTechParks(): Promise<TechPark[]> {
    return Array.from(this.techParks.values()).filter(park => park.isActive);
  }

  async getTechPark(id: string): Promise<TechPark | undefined> {
    return this.techParks.get(id);
  }

  async createTechPark(insertTechPark: InsertTechPark): Promise<TechPark> {
    const id = randomUUID();
    const techPark: TechPark = { 
      ...insertTechPark, 
      id,
      description: insertTechPark.description ?? null,
      isActive: insertTechPark.isActive ?? true,
      totalOutlets: insertTechPark.totalOutlets ?? 0
    };
    this.techParks.set(id, techPark);
    return techPark;
  }

  // Restaurant operations
  async getRestaurantsByTechPark(techParkId: string): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(
      restaurant => restaurant.techParkId === techParkId && restaurant.isOpen
    );
  }

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async getRestaurantByManager(managerId: string): Promise<Restaurant | undefined> {
    return Array.from(this.restaurants.values()).find(
      restaurant => restaurant.managerId === managerId
    );
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = randomUUID();
    const restaurant: Restaurant = { 
      ...insertRestaurant, 
      id, 
      createdAt: new Date(),
      description: insertRestaurant.description ?? null,
      techParkId: insertRestaurant.techParkId ?? null,
      managerId: insertRestaurant.managerId ?? null,
      rating: insertRestaurant.rating ?? 0,
      distance: insertRestaurant.distance ?? null,
      imageUrl: insertRestaurant.imageUrl ?? null,
      location: insertRestaurant.location ?? null,
      isOpen: insertRestaurant.isOpen ?? true,
      deliveryAvailable: insertRestaurant.deliveryAvailable ?? true,
      takeawayAvailable: insertRestaurant.takeawayAvailable ?? true,
      dineinAvailable: insertRestaurant.dineinAvailable ?? true
    };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  // Menu operations
  async getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
    return Array.from(this.menuCategories.values())
      .filter(category => category.restaurantId === restaurantId && category.isActive)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  async createMenuCategory(insertCategory: InsertMenuCategory): Promise<MenuCategory> {
    const id = randomUUID();
    const category: MenuCategory = { 
      ...insertCategory, 
      id,
      restaurantId: insertCategory.restaurantId ?? null,
      displayOrder: insertCategory.displayOrder ?? 0,
      isActive: insertCategory.isActive ?? true
    };
    this.menuCategories.set(id, category);
    return category;
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.restaurantId === restaurantId
    );
  }

  async getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.categoryId === categoryId
    );
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = { 
      ...insertItem, 
      id, 
      createdAt: new Date(),
      description: insertItem.description ?? null,
      restaurantId: insertItem.restaurantId ?? null,
      categoryId: insertItem.categoryId ?? null,
      isVeg: insertItem.isVeg ?? true,
      isAvailable: insertItem.isAvailable ?? true,
      preparationTime: insertItem.preparationTime ?? null,
      imageUrl: insertItem.imageUrl ?? null
    };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const order: Order = { 
      ...insertOrder, 
      id, 
      orderNumber,
      status: insertOrder.status ?? 'placed',
      userId: insertOrder.userId ?? null,
      restaurantId: insertOrder.restaurantId ?? null,
      deliveryCharge: insertOrder.deliveryCharge ?? 0,
      paymentMethod: insertOrder.paymentMethod ?? null,
      paymentStatus: insertOrder.paymentStatus ?? 'pending',
      deliveryAddress: insertOrder.deliveryAddress ?? null,
      estimatedTime: insertOrder.estimatedTime ?? null,
      actualDeliveryTime: insertOrder.actualDeliveryTime ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getRestaurantOrders(restaurantId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.restaurantId === restaurantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      orderId: insertOrderItem.orderId ?? null,
      menuItemId: insertOrderItem.menuItemId ?? null
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }
}

export const storage = new MemStorage();
