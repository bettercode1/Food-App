import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertManagerSchema, insertOrderSchema, insertOrderItemSchema, insertMenuItemSchema } from "@shared/schema";
import { z } from "zod";
import { verifyManagerOwnsOrderRestaurant } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint
  app.head("/api/health", (_req, res) => {
    res.status(200).end();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth routes
  app.post("/api/auth/user/login", async (req, res) => {
    try {
      const { mobile, password } = req.body;
      
      // Check if user exists by mobile number
      const user = await storage.getUserByUsername(mobile);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // In a real app, you'd verify password here
      res.json({ success: true, user: { id: user.id, username: user.mobile, employeeName: user.employeeName } });
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/auth/user/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.mobile);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this mobile number" });
      }
      
      // Create new user
      const user = await storage.createUser(userData);
      
      res.json({ success: true, user: { id: user.id, username: user.mobile, employeeName: user.employeeName } });
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/auth/manager/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const manager = await storage.getManagerByUsername(username);
      if (!manager) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // In a real app, you'd verify password hash here
      if (manager.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ success: true, manager: { id: manager.id, username: manager.username, restaurantName: manager.restaurantName } });
    } catch (error) {
      res.status(400).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/manager/register", async (req, res) => {
    try {
      const managerData = insertManagerSchema.parse(req.body);
      
      // Check if manager already exists
      const existingManager = await storage.getManagerByUsername(managerData.email);
      if (existingManager) {
        return res.status(400).json({ error: "Manager already exists with this email" });
      }
      
      // Create new manager
      const manager = await storage.createManager(managerData);
      
      res.json({ success: true, manager: { id: manager.id, username: manager.username, restaurantName: manager.restaurantName } });
    } catch (error) {
      res.status(400).json({ error: "Invalid manager data" });
    }
  });

  // Tech parks
  app.get("/api/tech-parks", async (req, res) => {
    try {
      const techParks = await storage.getAllTechParks();
      res.json(techParks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tech parks" });
    }
  });

  // Restaurants
  app.get("/api/restaurants/tech-park/:techParkId", async (req, res) => {
    try {
      const { techParkId } = req.params;
      const restaurants = await storage.getRestaurantsByTechPark(techParkId);
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const restaurant = await storage.getRestaurant(id);
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurant" });
    }
  });

  // Menu
  app.get("/api/menu/restaurant/:restaurantId", async (req, res) => {
    try {
      const { restaurantId } = req.params;
      const categories = await storage.getMenuCategories(restaurantId);
      const items = await storage.getMenuItems(restaurantId);
      
      const menuData = categories.map(category => ({
        ...category,
        items: items.filter(item => item.categoryId === category.id)
      }));
      
      res.json(menuData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu" });
    }
  });

  app.post("/api/menu/items", async (req, res) => {
    try {
      if (!req.manager) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const itemData = insertMenuItemSchema.parse(req.body);
      
      // Verify manager owns the restaurant
      const restaurant = await storage.getRestaurantByManager(req.manager.id);
      if (!restaurant || restaurant.id !== itemData.restaurantId) {
        return res.status(403).json({ error: "Not authorized to manage this restaurant's menu" });
      }
      
      const newItem = await storage.createMenuItem(itemData);
      res.json(newItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to create menu item" });
    }
  });

  app.put("/api/menu/items/:id", async (req, res) => {
    try {
      if (!req.manager) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { id } = req.params;
      const updates = req.body;
      
      // Get the menu item to verify ownership
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      
      // Verify manager owns the restaurant
      const restaurant = await storage.getRestaurantByManager(req.manager.id);
      if (!restaurant || restaurant.id !== menuItem.restaurantId) {
        return res.status(403).json({ error: "Not authorized to manage this restaurant's menu" });
      }
      
      const updatedItem = await storage.updateMenuItem(id, updates);
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu/items/:id", async (req, res) => {
    try {
      if (!req.manager) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { id } = req.params;
      
      // Get the menu item to verify ownership
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      
      // Verify manager owns the restaurant
      const restaurant = await storage.getRestaurantByManager(req.manager.id);
      if (!restaurant || restaurant.id !== menuItem.restaurantId) {
        return res.status(403).json({ error: "Not authorized to manage this restaurant's menu" });
      }
      
      const deleted = await storage.deleteMenuItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete menu item" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      console.log("Received order request:", JSON.stringify(req.body, null, 2));
      
      const orderData = insertOrderSchema.parse(req.body.order);
      const orderItems = z.array(insertOrderItemSchema).parse(req.body.items);
      
      console.log("Parsed order data:", orderData);
      console.log("Parsed order items:", orderItems);
      
      // Create order
      const newOrder = await storage.createOrder(orderData);
      
      // Create order items
      for (const item of orderItems) {
        await storage.createOrderItem({ ...item, orderId: newOrder.id });
      }
      
      res.json(newOrder);
    } catch (error) {
      console.error("Order creation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        res.status(400).json({ error: "Failed to create order" });
      }
    }
  });

  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  app.get("/api/orders/restaurant/:restaurantId", async (req, res) => {
    try {
      if (!req.manager) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { restaurantId } = req.params;
      
      // Verify manager owns the restaurant
      const restaurant = await storage.getRestaurantByManager(req.manager.id);
      if (!restaurant || restaurant.id !== restaurantId) {
        return res.status(403).json({ error: "Not authorized to view this restaurant's orders" });
      }
      
      const orders = await storage.getRestaurantOrders(restaurantId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurant orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Verify manager authentication
      if (!req.manager) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Verify manager owns the restaurant for this order
      const ownsRestaurant = await verifyManagerOwnsOrderRestaurant(req.manager.id, id);
      if (!ownsRestaurant) {
        return res.status(403).json({ error: "Not authorized to update this order" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: "Failed to update order status" });
    }
  });

  // Manager restaurant info
  app.get("/api/manager/:managerId/restaurant", async (req, res) => {
    try {
      if (!req.manager) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { managerId } = req.params;
      
      // Verify manager can only access their own restaurant
      if (req.manager.id !== managerId) {
        return res.status(403).json({ error: "Not authorized to access this manager's restaurant" });
      }
      
      const restaurant = await storage.getRestaurantByManager(managerId);
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch restaurant" });
    }
  });

  // Notifications
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      // Mock notifications data
      const notifications = [
        {
          id: '1',
          userId: userId,
          title: 'Order Confirmed',
          message: 'Your order #12345 has been confirmed and is being prepared.',
          type: 'order',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ];
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Loyalty Program
  app.get("/api/loyalty/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userLoyalty = {
        id: '1',
        userId: userId,
        points: 150,
        tier: 'Silver',
        totalOrders: 5,
        nextTierPoints: 50
      };
      res.json(userLoyalty);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loyalty data" });
    }
  });

  app.get("/api/loyalty/rewards", async (req, res) => {
    try {
      const rewards = [
        {
          id: '1',
          name: 'Free Coffee',
          description: 'Get a free coffee with your next order',
          pointsRequired: 100,
          isActive: true
        }
      ];
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });

  app.get("/api/loyalty/tiers", async (req, res) => {
    try {
      const tiers = [
        { name: 'Bronze', minPoints: 0, maxPoints: 99 },
        { name: 'Silver', minPoints: 100, maxPoints: 299 },
        { name: 'Gold', minPoints: 300, maxPoints: 999 }
      ];
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loyalty tiers" });
    }
  });

  // Messaging System
  app.get("/api/messages/chatrooms/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const chatRooms = [
        {
          id: '1',
          name: 'Support Team',
          lastMessage: 'How can we help you today?',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0
        }
      ];
      res.json(chatRooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat rooms" });
    }
  });

  app.get("/api/messages/:chatId", async (req, res) => {
    try {
      const { chatId } = req.params;
      const messages = [
        {
          id: '1',
          chatId: chatId,
          senderId: 'support',
          content: 'Hello! How can we help you today?',
          timestamp: new Date().toISOString(),
          isRead: true
        }
      ];
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Recommendations
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const recommendations = {
        trending: [
          { id: '1', name: 'Masala Dosa', restaurant: 'South Express', rating: 4.6 }
        ],
        personalized: [
          { id: '2', name: 'Paneer Butter Masala', restaurant: 'Canteen Delight', rating: 4.5 }
        ],
        nearby: [
          { id: '3', name: 'Quick Bites Burger', restaurant: 'Quick Bites Cafe', rating: 4.2 }
        ]
      };
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
