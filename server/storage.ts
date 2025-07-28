import { 
  users, tailors, services, orders, reviews,
  type User, type InsertUser,
  type Tailor, type InsertTailor, type TailorWithUser,
  type Service, type InsertService,
  type Order, type InsertOrder, type OrderWithDetails,
  type Review, type InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, ilike, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tailor operations
  getTailor(id: string): Promise<TailorWithUser | undefined>;
  getTailorByUserId(userId: string): Promise<TailorWithUser | undefined>;
  createTailor(tailor: InsertTailor): Promise<Tailor>;
  searchTailors(location?: string, serviceType?: string, rating?: number): Promise<TailorWithUser[]>;
  updateTailorRating(tailorId: string, newRating: number, totalReviews: number): Promise<void>;
  
  // Service operations
  getServicesByTailors(tailorId: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  getService(id: string): Promise<Service | undefined>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<OrderWithDetails | undefined>;
  getOrdersByCustomer(customerId: string): Promise<OrderWithDetails[]>;
  getOrdersByTailor(tailorId: string): Promise<OrderWithDetails[]>;
  updateOrderStatus(id: string, status: Order['status']): Promise<void>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByTailor(tailorId: string): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTailor(id: string): Promise<TailorWithUser | undefined> {
    const [tailor] = await db
      .select()
      .from(tailors)
      .leftJoin(users, eq(tailors.userId, users.id))
      .where(eq(tailors.id, id));
    
    if (!tailor.tailors || !tailor.users) return undefined;
    
    return { ...tailor.tailors, user: tailor.users };
  }

  async getTailorByUserId(userId: string): Promise<TailorWithUser | undefined> {
    const [tailor] = await db
      .select()
      .from(tailors)
      .leftJoin(users, eq(tailors.userId, users.id))
      .where(eq(tailors.userId, userId));
    
    if (!tailor.tailors || !tailor.users) return undefined;
    
    return { ...tailor.tailors, user: tailor.users };
  }

  async createTailor(insertTailor: InsertTailor): Promise<Tailor> {
    const [tailor] = await db
      .insert(tailors)
      .values(insertTailor)
      .returning();
    return tailor;
  }

  async searchTailors(location?: string, serviceType?: string, rating?: number): Promise<TailorWithUser[]> {
    let query = db
      .select()
      .from(tailors)
      .leftJoin(users, eq(tailors.userId, users.id))
      .where(eq(tailors.isVerified, true));

    if (location) {
      query = query.where(ilike(tailors.location, `%${location}%`));
    }

    if (rating) {
      query = query.where(sql`${tailors.rating} >= ${rating}`);
    }

    const results = await query.orderBy(desc(tailors.rating));
    
    return results
      .filter(result => result.tailors && result.users)
      .map(result => ({ ...result.tailors!, user: result.users! }));
  }

  async updateTailorRating(tailorId: string, newRating: number, totalReviews: number): Promise<void> {
    await db
      .update(tailors)
      .set({ rating: newRating.toString(), totalReviews })
      .where(eq(tailors.id, tailorId));
  }

  async getServicesByTailors(tailorId: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(and(eq(services.tailorId, tailorId), eq(services.isActive, true)));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values(insertService)
      .returning();
    return service;
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({
        ...insertOrder,
        updatedAt: new Date(),
      })
      .returning();
    return order;
  }

  async getOrder(id: string): Promise<OrderWithDetails | undefined> {
    const [result] = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.customerId, users.id))
      .leftJoin(tailors, eq(orders.tailorId, tailors.id))
      .leftJoin(services, eq(orders.serviceId, services.id))
      .leftJoin(reviews, eq(orders.id, reviews.orderId))
      .where(eq(orders.id, id));

    if (!result.orders || !result.users || !result.tailors || !result.services) {
      return undefined;
    }

    const tailorUser = await this.getUser(result.tailors.userId);
    if (!tailorUser) return undefined;

    return {
      ...result.orders,
      customer: result.users,
      tailor: { ...result.tailors, user: tailorUser },
      service: result.services,
      review: result.reviews || undefined,
    };
  }

  async getOrdersByCustomer(customerId: string): Promise<OrderWithDetails[]> {
    const results = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.customerId, users.id))
      .leftJoin(tailors, eq(orders.tailorId, tailors.id))
      .leftJoin(services, eq(orders.serviceId, services.id))
      .leftJoin(reviews, eq(orders.id, reviews.orderId))
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt));

    const ordersWithDetails: OrderWithDetails[] = [];
    
    for (const result of results) {
      if (result.orders && result.users && result.tailors && result.services) {
        const tailorUser = await this.getUser(result.tailors.userId);
        if (tailorUser) {
          ordersWithDetails.push({
            ...result.orders,
            customer: result.users,
            tailor: { ...result.tailors, user: tailorUser },
            service: result.services,
            review: result.reviews || undefined,
          });
        }
      }
    }

    return ordersWithDetails;
  }

  async getOrdersByTailor(tailorId: string): Promise<OrderWithDetails[]> {
    const results = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.customerId, users.id))
      .leftJoin(tailors, eq(orders.tailorId, tailors.id))
      .leftJoin(services, eq(orders.serviceId, services.id))
      .leftJoin(reviews, eq(orders.id, reviews.orderId))
      .where(eq(orders.tailorId, tailorId))
      .orderBy(desc(orders.createdAt));

    const ordersWithDetails: OrderWithDetails[] = [];
    
    for (const result of results) {
      if (result.orders && result.users && result.tailors && result.services) {
        const tailorUser = await this.getUser(result.tailors.userId);
        if (tailorUser) {
          ordersWithDetails.push({
            ...result.orders,
            customer: result.users,
            tailor: { ...result.tailors, user: tailorUser },
            service: result.services,
            review: result.reviews || undefined,
          });
        }
      }
    }

    return ordersWithDetails;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async getReviewsByTailor(tailorId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.tailorId, tailorId))
      .orderBy(desc(reviews.createdAt));
  }
}

export const storage = new DatabaseStorage();
