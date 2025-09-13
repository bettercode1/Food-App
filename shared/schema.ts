import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for employees
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  techPark: text("tech_park").notNull(),
  company: text("company").notNull(),
  designation: text("designation").notNull(),
  employeeName: text("employee_name").notNull(),
  mobile: text("mobile").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Managers table for restaurant/mess managers
export const managers = pgTable("managers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  restaurantName: text("restaurant_name").notNull(),
  email: text("email").notNull().unique(),
  techPark: text("tech_park").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Tech Parks
export const techParks = pgTable("tech_parks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  totalOutlets: integer("total_outlets").default(0),
  isActive: boolean("is_active").default(true),
});

// Restaurants/Food Places
export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  managerId: varchar("manager_id").references(() => managers.id),
  techParkId: varchar("tech_park_id").references(() => techParks.id),
  name: text("name").notNull(),
  description: text("description"),
  cuisine: text("cuisine").notNull(),
  rating: real("rating").default(0),
  distance: real("distance"), // in meters
  preparationTime: text("preparation_time"), // e.g., "15-20 min"
  priceRange: text("price_range"), // ₹, ₹₹, ₹₹₹
  isOpen: boolean("is_open").default(true),
  deliveryAvailable: boolean("delivery_available").default(true),
  takeawayAvailable: boolean("takeaway_available").default(true),
  dineinAvailable: boolean("dinein_available").default(true),
  imageUrl: text("image_url"),
  location: jsonb("location"), // { lat, lng }
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Menu Categories
export const menuCategories = pgTable("menu_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  name: text("name").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
});

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  categoryId: varchar("category_id").references(() => menuCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  isVeg: boolean("is_veg").default(true),
  isAvailable: boolean("is_available").default(true),
  preparationTime: integer("preparation_time"), // in minutes
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  orderNumber: text("order_number").notNull().unique(),
  orderType: text("order_type").notNull(), // delivery, dine-in, takeaway
  status: text("status").default("placed"), // placed, confirmed, preparing, ready, dispatched, delivered, cancelled
  subtotal: real("subtotal").notNull(),
  deliveryCharge: real("delivery_charge").default(0),
  gst: real("gst").notNull(),
  total: real("total").notNull(),
  paymentMethod: text("payment_method"), // upi, card, cash
  paymentStatus: text("payment_status").default("pending"),
  deliveryAddress: text("delivery_address"),
  estimatedTime: text("estimated_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id),
  menuItemId: varchar("menu_item_id").references(() => menuItems.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  total: real("total").notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertManagerSchema = createInsertSchema(managers).omit({
  id: true,
  createdAt: true,
});

export const insertTechParkSchema = createInsertSchema(techParks).omit({
  id: true,
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertManager = z.infer<typeof insertManagerSchema>;
export type Manager = typeof managers.$inferSelect;

export type InsertTechPark = z.infer<typeof insertTechParkSchema>;
export type TechPark = typeof techParks.$inferSelect;

export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;

export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
