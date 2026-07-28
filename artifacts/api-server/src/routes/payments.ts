import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, paymentsTable, usersTable } from "@workspace/db";
import {
  CreatePaymentBody,
  GetUserPaymentParams,
} from "@workspace/api-zod";
import { notifyAdminPayment } from "../lib/whatsapp";

const router: IRouter = Router();

router.get("/payments", async (_req, res): Promise<void> => {
  const payments = await db.select().from(paymentsTable).orderBy(paymentsTable.submittedAt);
  res.json(payments);
});

router.post("/payments", async (req, res): Promise<void> => {
  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Check if user already has a payment
  const [existing] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, parsed.data.userId));

  if (existing) {
    res.status(400).json({ error: "Payment already submitted for this user" });
    return;
  }

  const [payment] = await db
    .insert(paymentsTable)
    .values({
      userId: parsed.data.userId,
      mpesaCode: parsed.data.mpesaCode,
      amount: parsed.data.amount,
      status: "pending",
    })
    .returning();

  // Notify admin via WhatsApp — look up user name for the message
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  if (adminPhone) {
    const [user] = await db
      .select({ fullName: usersTable.fullName })
      .from(usersTable)
      .where(eq(usersTable.id, parsed.data.userId));

    if (user) {
      notifyAdminPayment(
        adminPhone,
        user.fullName,
        parsed.data.mpesaCode,
        parsed.data.amount
      ).catch(() => {});
    }
  }

  res.status(201).json(payment);
});

router.get("/payments/:userId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const params = GetUserPaymentParams.safeParse({ userId: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, params.data.userId));

  if (!payment) {
    res.status(404).json({ error: "No payment found for this user" });
    return;
  }

  res.json(payment);
});

export default router;
