import { Router, type IRouter } from "express";
import { eq, and, gte, lte } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  ListUsersQueryParams,
  CreateUserBody,
  GetUserParams,
  UpdateUserParams,
  UpdateUserBody,
  GetFeaturedUsersQueryParams,
} from "@workspace/api-zod";
import { notifyAdminNewUser } from "../lib/whatsapp";

const router: IRouter = Router();

router.get("/users/featured", async (req, res): Promise<void> => {
  const parsed = GetFeaturedUsersQueryParams.safeParse(req.query);
  const role = parsed.success ? parsed.data.role : undefined;

  let query = db.select().from(usersTable).$dynamic();
  if (role) {
    query = query.where(eq(usersTable.role, role));
  }

  const users = await query.limit(6).orderBy(usersTable.registeredAt);
  res.json(users);
});

router.get("/users", async (req, res): Promise<void> => {
  const parsed = ListUsersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { role, county, minSalary, maxSalary, skill } = parsed.data;

  const conditions = [];
  if (role) conditions.push(eq(usersTable.role, role));
  if (county) conditions.push(eq(usersTable.county, county));
  if (minSalary != null) conditions.push(gte(usersTable.salaryExpectation, minSalary));
  if (maxSalary != null) conditions.push(lte(usersTable.salaryExpectation, maxSalary));

  let users = await db
    .select()
    .from(usersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(usersTable.registeredAt);

  if (skill) {
    const s = skill.toLowerCase();
    users = users.filter((u) => u.skills?.toLowerCase().includes(s));
  }

  res.json(users);
});

router.post("/users", async (req, res): Promise<void> => {
  try {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db
    .insert(usersTable)
    .values({
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      county: parsed.data.county,
      phone: parsed.data.phone,
      email: parsed.data.email ?? null,
      bio: parsed.data.bio ?? null,
      photoUrl: parsed.data.photoUrl ?? null,
      salaryExpectation: parsed.data.salaryExpectation,
      skills: parsed.data.skills ?? null,
      experience: parsed.data.experience ?? null,
      languages: parsed.data.languages ?? null,
      availability: parsed.data.availability ?? null,
      paymentVerified: false,
    })
    .returning();

  // Notify admin via WhatsApp (fire & forget — never block the response)
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  if (adminPhone) {
    notifyAdminNewUser(adminPhone, user.fullName, user.role, user.county).catch(() => {});
  }

  res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Unable to create user." });
  }
});

router.get("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetUserParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

router.patch("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateUserParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.fullName != null) updates.fullName = parsed.data.fullName;
  if (parsed.data.county != null) updates.county = parsed.data.county;
  if (parsed.data.phone != null) updates.phone = parsed.data.phone;
  if (parsed.data.email != null) updates.email = parsed.data.email;
  if (parsed.data.bio != null) updates.bio = parsed.data.bio;
  if (parsed.data.photoUrl != null) updates.photoUrl = parsed.data.photoUrl;
  if (parsed.data.salaryExpectation != null) updates.salaryExpectation = parsed.data.salaryExpectation;
  if (parsed.data.skills != null) updates.skills = parsed.data.skills;
  if (parsed.data.experience != null) updates.experience = parsed.data.experience;
  if (parsed.data.languages != null) updates.languages = parsed.data.languages;
  if (parsed.data.availability != null) updates.availability = parsed.data.availability;

  const [user] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, params.data.id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

export default router;
