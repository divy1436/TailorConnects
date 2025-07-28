import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertTailorSchema, insertOrderSchema, insertReviewSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userType: string;
      };
    }
  }
}

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);

      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.id, userType: user.userType }, JWT_SECRET);

      res.json({ user: { ...user, password: undefined }, token });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  // Tailor routes
  app.post("/api/tailors", authenticateToken, async (req, res) => {
    try {
      const tailorData = insertTailorSchema.parse(req.body);
      const tailor = await storage.createTailor(tailorData);
      res.json(tailor);
    } catch (error) {
      res.status(400).json({ message: "Invalid tailor data", error });
    }
  });

  app.get("/api/tailors", async (req, res) => {
    try {
      const { location, serviceType, rating } = req.query;
      const tailors = await storage.searchTailors(
        location as string,
        serviceType as string,
        rating ? parseFloat(rating as string) : undefined
      );
      res.json(tailors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tailors", error });
    }
  });

  app.get("/api/tailors/:id", async (req, res) => {
    try {
      const tailor = await storage.getTailor(req.params.id);
      if (!tailor) {
        return res.status(404).json({ message: "Tailor not found" });
      }
      res.json(tailor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tailor", error });
    }
  });

  // Service routes
  app.get("/api/tailors/:tailorId/services", async (req, res) => {
    try {
      const services = await storage.getServicesByTailors(req.params.tailorId);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services", error });
    }
  });

  // Order routes
  app.post("/api/orders", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const orderData = insertOrderSchema.parse({
        ...req.body,
        customerId: req.user.userId,
      });
      
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error });
    }
  });

  app.get("/api/orders/customer", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const orders = await storage.getOrdersByCustomer(req.user.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error });
    }
  });

  app.get("/api/orders/tailor/:tailorId", authenticateToken, async (req, res) => {
    try {
      const orders = await storage.getOrdersByTailor(req.params.tailorId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error });
    }
  });

  app.get("/api/orders/:id", authenticateToken, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order", error });
    }
  });

  app.patch("/api/orders/:id/status", authenticateToken, async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateOrderStatus(req.params.id, status);
      res.json({ message: "Order status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status", error });
    }
  });

  // Review routes
  app.post("/api/reviews", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        customerId: req.user.userId,
      });
      
      const review = await storage.createReview(reviewData);
      
      // Update tailor rating
      const reviews = await storage.getReviewsByTailor(reviewData.tailorId);
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await storage.updateTailorRating(reviewData.tailorId, avgRating, reviews.length);
      
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data", error });
    }
  });

  app.get("/api/tailors/:tailorId/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByTailor(req.params.tailorId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error });
    }
  });

  // User profile routes
  app.get("/api/users/me", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let tailor = null;
      if (user.userType === 'tailor') {
        tailor = await storage.getTailorByUserId(user.id);
      }
      
      res.json({ user: { ...user, password: undefined }, tailor });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
