import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not configured. Authentication tokens will not work.");
}

const TOKEN_COOKIE = "andy_homecare_token";

function createToken(userId: number) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user: typeof usersTable.$inferSelect) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password, role, county } = req.body ?? {};

    if (!fullName || !email || !phone || !password || !role || !county) {
      return res.status(400).json({
        message: "Full name, email, phone, password, role and county are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const allowedRoles = ["employer", "housekeeper"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Role must be employer or housekeeper.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(usersTable)
      .values({
        fullName: String(fullName).trim(),
        email: normalizedEmail,
        phone: String(phone).trim(),
        passwordHash,
        role,
        county: String(county).trim(),
      })
      .returning();

    const token = createToken(user.id);

    res.cookie(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Unable to create account.",
    });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);

    if (!user?.passwordHash) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (user.accountStatus !== "active") {
      return res.status(403).json({
        message: "This account is not active.",
      });
    }

    const validPassword = await bcrypt.compare(
      String(password),
      user.passwordHash,
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user.id);

    res.cookie(TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Unable to log in.",
    });
  }
});

router.post("/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie(TOKEN_COOKIE);
  return res.json({ message: "Logged out successfully." });
});

router.get("/auth/me", async (req: Request, res: Response) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication is not configured.",
      });
    }

    const token = req.cookies?.[TOKEN_COOKIE];

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated.",
      });
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId?: number };

    if (!payload.userId) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        message: "User account not found.",
      });
    }

    return res.json({
      user: publicUser(user),
    });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
});

export default router;
