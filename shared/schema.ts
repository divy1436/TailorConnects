import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userTypeEnum = pgEnum('user_type', ['customer', 'tailor']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'confirmed', 'pickup_scheduled', 'in_progress', 'ready', 'out_for_delivery', 'delivered', 'cancelled']);
export const serviceTypeEnum = pgEnum('service_type', ['custom_stitching', 'alterations', 'repairs', 'uniforms']);
export const garmentTypeEnum = pgEnum('garment_type', ['shirt', 'pants', 'suit', 'dress', 'blouse', 'lehenga', 'saree', 'sherwani', 'kurta', 'other']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  userType: userTypeEnum("user_type").notNull().default('customer'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tailors = pgTable("tailors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessName: text("business_name"),
  specializations: text("specializations").array().default([]),
  location: text("location").notNull(),
  address: text("address"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0.00'),
  totalReviews: integer("total_reviews").default(0),
  isVerified: boolean("is_verified").default(false),
  avgDeliveryDays: integer("avg_delivery_days").default(3),
  startingPrice: decimal("starting_price", { precision: 10, scale: 2 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tailorId: varchar("tailor_id").notNull().references(() => tailors.id, { onDelete: 'cascade' }),
  serviceType: serviceTypeEnum("service_type").notNull(),
  garmentTypes: garmentTypeEnum("garment_type").array().default([]),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  deliveryDays: integer("delivery_days").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  tailorId: varchar("tailor_id").notNull().references(() => tailors.id, { onDelete: 'cascade' }),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  serviceType: serviceTypeEnum("service_type").notNull(),
  garmentType: garmentTypeEnum("garment_type").notNull(),
  status: orderStatusEnum("status").notNull().default('pending'),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  pickupAddress: text("pickup_address").notNull(),
  pickupDate: timestamp("pickup_date"),
  deliveryDate: timestamp("delivery_date"),
  specialInstructions: text("special_instructions"),
  measurements: text("measurements"), // JSON string
  referenceImages: text("reference_images").array().default([]),
  paymentMethod: text("payment_method").notNull(),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  customerId: varchar("customer_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  tailorId: varchar("tailor_id").notNull().references(() => tailors.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  tailor: one(tailors, {
    fields: [users.id],
    references: [tailors.userId],
  }),
  orders: many(orders),
  reviews: many(reviews),
}));

export const tailorsRelations = relations(tailors, ({ one, many }) => ({
  user: one(users, {
    fields: [tailors.userId],
    references: [users.id],
  }),
  services: many(services),
  orders: many(orders),
  reviews: many(reviews),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  tailor: one(tailors, {
    fields: [services.tailorId],
    references: [tailors.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  tailor: one(tailors, {
    fields: [orders.tailorId],
    references: [tailors.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  review: one(reviews, {
    fields: [orders.id],
    references: [reviews.orderId],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  customer: one(users, {
    fields: [reviews.customerId],
    references: [users.id],
  }),
  tailor: one(tailors, {
    fields: [reviews.tailorId],
    references: [tailors.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTailorSchema = createInsertSchema(tailors).omit({
  id: true,
  createdAt: true,
  rating: true,
  totalReviews: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTailor = z.infer<typeof insertTailorSchema>;
export type Tailor = typeof tailors.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Extended types with relations
export type TailorWithUser = Tailor & { user: User };
export type OrderWithDetails = Order & { 
  customer: User; 
  tailor: TailorWithUser; 
  service: Service;
  review?: Review;
};
