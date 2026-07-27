import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import paymentsRouter from "./payments";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(paymentsRouter);
router.use(statsRouter);

export default router;
