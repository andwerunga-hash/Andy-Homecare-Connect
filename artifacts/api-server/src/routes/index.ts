import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import paymentsRouter from "./payments";
import statsRouter from "./stats";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(paymentsRouter);
router.use(statsRouter);
router.use(adminRouter);

export default router;
