import { Router, type IRouter } from "express";
import healthRouter from "./health";
import booksRouter from "./books";
import categoriesRouter from "./categories";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(booksRouter);
router.use(categoriesRouter);
router.use(chatRouter);

export default router;
