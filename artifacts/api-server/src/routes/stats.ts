import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [totalHousekeepers] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "housekeeper"));

  const [totalEmployers] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "employer"));

  const [verifiedHousekeepers] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "housekeeper") && eq(usersTable.paymentVerified, true));

  const [verifiedEmployers] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "employer") && eq(usersTable.paymentVerified, true));

  const counties = await db
    .selectDistinct({ county: usersTable.county })
    .from(usersTable);

  res.json({
    totalHousekeepers: totalHousekeepers?.count ?? 0,
    totalEmployers: totalEmployers?.count ?? 0,
    verifiedHousekeepers: verifiedHousekeepers?.count ?? 0,
    verifiedEmployers: verifiedEmployers?.count ?? 0,
    countiesCovered: counties.length,
  });
});

export default router;
