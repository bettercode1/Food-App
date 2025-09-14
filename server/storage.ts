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
  getMenuItem(id: string): Promise<MenuItem | undefined>;
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

    // Seed Demo Users
    const demoUsers = [
      {
        id: randomUUID(),
        username: "9876543210",
        password: "demo123",
        techPark: manyataPark.name,
        company: "TechCorp Solutions",
        designation: "Software Engineer",
        employeeName: "Arjun Kumar",
        mobile: "9876543210",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        username: "9876543211",
        password: "demo123",
        techPark: manyataPark.name,
        company: "DataFlow Systems",
        designation: "Product Manager",
        employeeName: "Priya Sharma",
        mobile: "9876543211",
        createdAt: new Date(),
      }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Seed Demo Managers and Restaurants
    const restaurantsData = [
      {
        managerInfo: {
          username: "manager@canteendelight.com",
          password: "password123",
          restaurantName: "Canteen Delight",
          email: "manager@canteendelight.com",
          techPark: manyataPark.name,
        },
        restaurantInfo: {
          name: "Canteen Delight",
          description: "Traditional Indian thali and comfort food",
          cuisine: "Indian, Regional",
          rating: 4.3,
          distance: 120,
          preparationTime: "10-15 min",
          priceRange: "₹",
          imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
          location: { lat: 13.0389, lng: 77.6245 },
        },
        categories: [
          { name: "Thali", displayOrder: 1 },
          { name: "Rice & Dal", displayOrder: 2 }
        ],
        menuItems: [
          { categoryIndex: 0, name: "Veg Thali", description: "Complete meal with rice, dal, sabji, roti, and pickle", price: 80, isVeg: true, preparationTime: 10, imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d" },
          { categoryIndex: 0, name: "Non-Veg Thali", description: "Complete meal with chicken curry, rice, dal, and roti", price: 120, isVeg: false, preparationTime: 15, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b" },
          { categoryIndex: 1, name: "Plain Rice", description: "Steamed basmati rice", price: 40, isVeg: true, preparationTime: 5, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c" },
          { categoryIndex: 1, name: "Dal Tadka", description: "Yellow lentils tempered with cumin and spices", price: 60, isVeg: true, preparationTime: 10, imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d" }
        ]
      },
      {
        managerInfo: {
          username: "manager@northspice.com",
          password: "password123",
          restaurantName: "North Spice Dhaba",
          email: "manager@northspice.com",
          techPark: manyataPark.name,
        },
        restaurantInfo: {
          name: "North Spice Dhaba",
          description: "Authentic North Indian cuisine and fresh rotis",
          cuisine: "North Indian, Punjabi",
          rating: 4.6,
          distance: 180,
          preparationTime: "15-20 min",
          priceRange: "₹₹",
          imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
          location: { lat: 13.0390, lng: 77.6243 },
        },
        categories: [
          { name: "Breads", displayOrder: 1 },
          { name: "Curries", displayOrder: 2 },
          { name: "Rice", displayOrder: 3 }
        ],
        menuItems: [
          { categoryIndex: 0, name: "Roti", description: "Fresh wheat bread cooked on tawa", price: 15, isVeg: true, preparationTime: 5, imageUrl: "https://images.unsplash.com/photo-1574653892320-2d3f7e1b8ceb" },
          { categoryIndex: 0, name: "Butter Naan", description: "Leavened bread with butter", price: 25, isVeg: true, preparationTime: 8, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b" },
          { categoryIndex: 1, name: "Paneer Butter Masala", description: "Cottage cheese in rich tomato gravy", price: 120, isVeg: true, preparationTime: 15, imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7" },
          { categoryIndex: 1, name: "Dal Tadka", description: "Yellow lentils with tempering", price: 100, isVeg: true, preparationTime: 12, imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d" },
          { categoryIndex: 1, name: "Chicken Curry", description: "Traditional North Indian chicken curry", price: 160, isVeg: false, preparationTime: 20, imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641" },
          { categoryIndex: 2, name: "Basmati Rice", description: "Aromatic long grain rice", price: 80, isVeg: true, preparationTime: 10, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c" }
        ]
      },
      {
        managerInfo: {
          username: "manager@southexpress.com",
          password: "password123",
          restaurantName: "South Express",
          email: "manager@southexpress.com",
          techPark: manyataPark.name,
        },
        restaurantInfo: {
          name: "South Express",
          description: "Authentic South Indian breakfast and meals",
          cuisine: "South Indian, Tamil, Karnataka",
          rating: 4.4,
          distance: 200,
          preparationTime: "12-18 min",
          priceRange: "₹",
          imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
          location: { lat: 13.0388, lng: 77.6246 },
        },
        categories: [
          { name: "Dosas", displayOrder: 1 },
          { name: "Idli & Vada", displayOrder: 2 },
          { name: "Rice Items", displayOrder: 3 }
        ],
        menuItems: [
          { categoryIndex: 0, name: "Masala Dosa", description: "Crispy crepe with spiced potato filling", price: 60, isVeg: true, preparationTime: 15, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8" },
          { categoryIndex: 0, name: "Plain Dosa", description: "Crispy rice and lentil crepe", price: 45, isVeg: true, preparationTime: 12, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8" },
          { categoryIndex: 0, name: "Rava Dosa", description: "Crispy semolina dosa with onions", price: 70, isVeg: true, preparationTime: 18, imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8" },
          { categoryIndex: 1, name: "Idli Sambar", description: "Steamed rice cakes with lentil curry", price: 50, isVeg: true, preparationTime: 10, imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc" },
          { categoryIndex: 1, name: "Medu Vada", description: "Crispy lentil donuts", price: 40, isVeg: true, preparationTime: 12, imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc" },
          { categoryIndex: 2, name: "Curd Rice", description: "Rice with yogurt and tempering", price: 55, isVeg: true, preparationTime: 8, imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c" }
        ]
      },
      {
        managerInfo: {
          username: "manager@quickbites.com",
          password: "password123",
          restaurantName: "Quick Bites Cafe",
          email: "manager@quickbites.com",
          techPark: manyataPark.name,
        },
        restaurantInfo: {
          name: "Quick Bites Cafe",
          description: "Fast food, sandwiches, burgers and refreshing drinks",
          cuisine: "Continental, Fast Food, Beverages",
          rating: 4.2,
          distance: 100,
          preparationTime: "8-15 min",
          priceRange: "₹₹",
          imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
          location: { lat: 13.0391, lng: 77.6242 },
        },
        categories: [
          { name: "Sandwiches", displayOrder: 1 },
          { name: "Burgers", displayOrder: 2 },
          { name: "Beverages", displayOrder: 3 }
        ],
        menuItems: [
          { categoryIndex: 0, name: "Club Sandwich", description: "Triple layer sandwich with chicken and vegetables", price: 85, isVeg: false, preparationTime: 12, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b" },
          { categoryIndex: 0, name: "Veg Grilled Sandwich", description: "Grilled sandwich with mixed vegetables", price: 70, isVeg: true, preparationTime: 10, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b" },
          { categoryIndex: 1, name: "Veg Burger", description: "Crispy veggie patty with fresh vegetables", price: 90, isVeg: true, preparationTime: 15, imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
          { categoryIndex: 1, name: "Chicken Burger", description: "Grilled chicken patty with cheese and lettuce", price: 120, isVeg: false, preparationTime: 18, imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add" },
          { categoryIndex: 2, name: "Cold Coffee", description: "Chilled coffee with ice cream", price: 70, isVeg: true, preparationTime: 5, imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735" },
          { categoryIndex: 2, name: "Fresh Lime Water", description: "Refreshing lime juice with mint", price: 40, isVeg: true, preparationTime: 3, imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e" },
          { categoryIndex: 2, name: "Mango Shake", description: "Thick mango milkshake", price: 80, isVeg: true, preparationTime: 5, imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e" }
        ]
      }
    ];

    // Create all restaurants with their managers and menu items
    restaurantsData.forEach(data => {
      // Create manager
      const managerId = randomUUID();
      const manager: Manager = {
        id: managerId,
        ...data.managerInfo,
        isActive: true,
        createdAt: new Date(),
      };
      this.managers.set(managerId, manager);

      // Create restaurant
      const restaurantId = randomUUID();
      const restaurant: Restaurant = {
        id: restaurantId,
        managerId: managerId,
        techParkId: manyataPark.id,
        ...data.restaurantInfo,
        isOpen: true,
        deliveryAvailable: true,
        takeawayAvailable: true,
        dineinAvailable: true,
        createdAt: new Date(),
      };
      this.restaurants.set(restaurantId, restaurant);

      // Create menu categories
      const categoryIds: string[] = [];
      data.categories.forEach(category => {
        const categoryId = randomUUID();
        const menuCategory: MenuCategory = {
          id: categoryId,
          restaurantId: restaurantId,
          name: category.name,
          displayOrder: category.displayOrder,
          isActive: true,
        };
        this.menuCategories.set(categoryId, menuCategory);
        categoryIds.push(categoryId);
      });

      // Create menu items
      data.menuItems.forEach(item => {
        const menuItemId = randomUUID();
        const menuItem: MenuItem = {
          id: menuItemId,
          restaurantId: restaurantId,
          categoryId: categoryIds[item.categoryIndex],
          name: item.name,
          description: item.description,
          price: item.price,
          isVeg: item.isVeg,
          isAvailable: true,
          preparationTime: item.preparationTime,
          imageUrl: item.imageUrl,
          createdAt: new Date(),
        };
        this.menuItems.set(menuItemId, menuItem);
      });
    });

    // Seed some demo orders for the demo flows
    const firstUser = demoUsers[0];
    const firstRestaurant = Array.from(this.restaurants.values())[0];
    const firstMenuItem = Array.from(this.menuItems.values()).find(item => item.restaurantId === firstRestaurant.id);

    if (firstUser && firstRestaurant && firstMenuItem) {
      // Create a demo order
      const demoOrderId = randomUUID();
      const demoOrder: Order = {
        id: demoOrderId,
        orderNumber: `ORD-2025-1001`,
        userId: firstUser.id,
        restaurantId: firstRestaurant.id,
        orderType: 'delivery',
        status: 'preparing',
        subtotal: 120,
        deliveryCharge: 20,
        gst: 14,
        total: 154,
        paymentMethod: 'upi',
        paymentStatus: 'completed',
        deliveryAddress: 'Block A, Office 204, Manyata Tech Park',
        estimatedTime: '15-20 min',
        actualDeliveryTime: null,
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        updatedAt: new Date(),
      };
      this.orders.set(demoOrderId, demoOrder);

      // Create order item
      const orderItemId = randomUUID();
      const orderItem: OrderItem = {
        id: orderItemId,
        orderId: demoOrderId,
        menuItemId: firstMenuItem.id,
        quantity: 1,
        price: firstMenuItem.price,
        total: firstMenuItem.price,
      };
      this.orderItems.set(orderItemId, orderItem);
    }
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
      dineinAvailable: insertRestaurant.dineinAvailable ?? true,
      preparationTime: insertRestaurant.preparationTime ?? null,
      priceRange: insertRestaurant.priceRange ?? null
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

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
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
