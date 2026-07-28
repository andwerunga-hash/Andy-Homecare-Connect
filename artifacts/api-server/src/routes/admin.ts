import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, paymentsTable } from "@workspace/db";
import {
  GetAdminDashboardQueryParams,
  AdminApproveUserParams,
  AdminApproveUserBody,
  AdminRejectUserParams,
  AdminRejectUserBody,
} from "@workspace/api-zod";
import {
  notifyUserApproved,
  notifyUserRejected,
} from "../lib/whatsapp";

const router: IRouter = Router();

function checkPin(pin: string): boolean {
  const adminPin = process.env.ADMIN_PIN;
  return !!adminPin && pin === adminPin;
}

// GET /admin/dashboard — all users joined with their payment info
router.get("/admin/dashboard", async (req, res): Promise<void> => {
  const parsed = GetAdminDashboardQueryParams.safeParse(req.query);
  if (!parsed.success || !checkPin(parsed.data.adminPin)) {
    res.status(401).json({ error: "Invalid admin PIN" });
    return;
  }

  const users = await db
    .select()
    .from(usersTable)
    .orderBy(usersTable.registeredAt);

  const payments = await db.select().from(paymentsTable);
  const paymentMap = new Map(payments.map((p) => [p.userId, p]));

  const result = users.map((u) => {
    const payment = paymentMap.get(u.id);
    return {
      ...u,
      paymentId: payment?.id ?? null,
      mpesaCode: payment?.mpesaCode ?? null,
      paymentAmount: payment?.amount ?? null,
      paymentStatus: payment?.status ?? null,
      paymentSubmittedAt: payment?.submittedAt?.toISOString() ?? null,
    };
  });

  res.json(result);
});

// POST /admin/approve/:userId
router.post("/admin/approve/:userId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.userId)
    ? req.params.userId[0]
    : req.params.userId;
  const params = AdminApproveUserParams.safeParse({ userId: parseInt(rawId, 10) });
  const body = AdminApproveUserBody.safeParse(req.body);

  if (!params.success || !body.success || !checkPin(body.data.adminPin)) {
    res.status(401).json({ error: "Invalid admin PIN" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ paymentVerified: true })
    .where(eq(usersTable.id, params.data.userId))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Mark payment as verified
  await db
    .update(paymentsTable)
    .set({ status: "verified" })
    .where(eq(paymentsTable.userId, params.data.userId));

  // Notify user via WhatsApp (fire & forget)
  notifyUserApproved(user.phone, user.fullName).catch(() => {});

  res.json(user);
});

// POST /admin/reject/:userId
router.post("/admin/reject/:userId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.userId)
    ? req.params.userId[0]
    : req.params.userId;
  const params = AdminRejectUserParams.safeParse({ userId: parseInt(rawId, 10) });
  const body = AdminRejectUserBody.safeParse(req.body);

  if (!params.success || !body.success || !checkPin(body.data.adminPin)) {
    res.status(401).json({ error: "Invalid admin PIN" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ paymentVerified: false })
    .where(eq(usersTable.id, params.data.userId))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Mark payment as rejected
  await db
    .update(paymentsTable)
    .set({ status: "rejected" })
    .where(eq(paymentsTable.userId, params.data.userId));

  // Notify user via WhatsApp (fire & forget)
  notifyUserRejected(user.phone, user.fullName).catch(() => {});

  res.json(user);
});

export default router;
