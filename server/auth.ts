// Based on blueprint:javascript_auth_all_persistance
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { User as SelectUser, insertUserSchema, loginSchema } from "@shared/schema";
import { ZodError } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// ─── Role-check middleware ────────────────────────────────────────────────────

/** Any authenticated admin-side user (super_admin, company_admin, recruiter). */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  const user = req.user as SelectUser;
  if (!user.isActive) return res.status(403).json({ error: "Account disabled" });
  next();
}

/** Only super_admin. Used for website management and company onboarding. */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  const user = req.user as SelectUser;
  if (!user.isActive) return res.status(403).json({ error: "Account disabled" });
  if (user.role !== "super_admin") return res.status(403).json({ error: "Super admin access required" });
  next();
}

/** company_admin or super_admin. Used for team management within a company. */
export function requireCompanyAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "Not authenticated" });
  const user = req.user as SelectUser;
  if (!user.isActive) return res.status(403).json({ error: "Account disabled" });
  if (user.role !== "company_admin" && user.role !== "super_admin") {
    return res.status(403).json({ error: "Company admin access required" });
  }
  next();
}

export { hashPassword, comparePasswords };

// ─── Passport + session setup ────────────────────────────────────────────────

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
      const user = userResult[0];
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      if (!user.isActive) {
        return done(null, false);
      }
      return done(null, user);
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const userResult = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const user = userResult[0];
    done(null, user);
  });

  app.post("/api/register", async (_req, res) => {
    return res.status(403).json({
      error: "Registration disabled",
      message: "New account registration is not available. Please contact the administrator.",
    });
  });

  app.post("/api/login", (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      passport.authenticate("local", (err: any, user: SelectUser | false) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({
            error: "Authentication failed",
            message: "Invalid username or password. Please try again.",
          });
        }

        req.login(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          // Return full user object (including role) so client can redirect correctly
          res.status(200).json(user);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Please provide a valid username and password.",
          details: error.errors,
        });
      }
      next(error);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
