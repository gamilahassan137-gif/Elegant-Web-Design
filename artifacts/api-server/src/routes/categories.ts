import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, booksTable } from "@workspace/db";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable);
  const books = await db.select({ categoryId: booksTable.categoryId }).from(booksTable);

  const countMap: Record<number, number> = {};
  for (const b of books) {
    countMap[b.categoryId] = (countMap[b.categoryId] ?? 0) + 1;
  }

  const result = cats.map((c) => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr,
    bookCount: countMap[c.id] ?? 0,
  }));

  res.json(ListCategoriesResponse.parse(result));
});

export default router;
