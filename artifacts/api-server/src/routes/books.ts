import { Router, type IRouter } from "express";
import { eq, ilike, and, gte, lte, or } from "drizzle-orm";
import { db, booksTable, categoriesTable } from "@workspace/db";
import {
  ListBooksQueryParams,
  GetBookParams,
  GetBookResponse,
  ListBooksResponse,
  ListFeaturedBooksResponse,
  GetBooksStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Build book response with category name
async function getBooksWithCategory(
  whereConditions?: Parameters<typeof db.select>[0] extends undefined ? undefined : any
) {
  const rows = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      titleAr: booksTable.titleAr,
      author: booksTable.author,
      authorAr: booksTable.authorAr,
      description: booksTable.description,
      descriptionAr: booksTable.descriptionAr,
      price: booksTable.price,
      coverImage: booksTable.coverImage,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      rating: booksTable.rating,
      reviewCount: booksTable.reviewCount,
      inStock: booksTable.inStock,
      featured: booksTable.featured,
      pages: booksTable.pages,
      publishedYear: booksTable.publishedYear,
      isbn: booksTable.isbn,
    })
    .from(booksTable)
    .innerJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id));
  return rows;
}

router.get("/books", async (req, res): Promise<void> => {
  const parsed = ListBooksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, categoryId, minPrice, maxPrice } = parsed.data;

  let rows = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      titleAr: booksTable.titleAr,
      author: booksTable.author,
      authorAr: booksTable.authorAr,
      description: booksTable.description,
      descriptionAr: booksTable.descriptionAr,
      price: booksTable.price,
      coverImage: booksTable.coverImage,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      rating: booksTable.rating,
      reviewCount: booksTable.reviewCount,
      inStock: booksTable.inStock,
      featured: booksTable.featured,
      pages: booksTable.pages,
      publishedYear: booksTable.publishedYear,
      isbn: booksTable.isbn,
    })
    .from(booksTable)
    .innerJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id));

  // Apply filters in JS since drizzle conditional wheres are complex
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.titleAr.includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.authorAr.includes(q)
    );
  }
  if (categoryId != null) {
    rows = rows.filter((b) => b.categoryId === categoryId);
  }
  if (minPrice != null) {
    rows = rows.filter((b) => b.price >= minPrice);
  }
  if (maxPrice != null) {
    rows = rows.filter((b) => b.price <= maxPrice);
  }

  res.json(ListBooksResponse.parse(rows));
});

router.get("/books/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      titleAr: booksTable.titleAr,
      author: booksTable.author,
      authorAr: booksTable.authorAr,
      description: booksTable.description,
      descriptionAr: booksTable.descriptionAr,
      price: booksTable.price,
      coverImage: booksTable.coverImage,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      rating: booksTable.rating,
      reviewCount: booksTable.reviewCount,
      inStock: booksTable.inStock,
      featured: booksTable.featured,
      pages: booksTable.pages,
      publishedYear: booksTable.publishedYear,
      isbn: booksTable.isbn,
    })
    .from(booksTable)
    .innerJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id))
    .where(eq(booksTable.featured, true));

  res.json(ListFeaturedBooksResponse.parse(rows));
});

router.get("/books/stats", async (_req, res): Promise<void> => {
  const books = await db.select().from(booksTable);
  const categories = await db.select().from(categoriesTable);

  const stats = {
    totalBooks: books.length,
    totalCategories: categories.length,
    featuredCount: books.filter((b) => b.featured).length,
    avgPrice: books.length > 0
      ? Math.round((books.reduce((s, b) => s + b.price, 0) / books.length) * 100) / 100
      : 0,
  };

  res.json(GetBooksStatsResponse.parse(stats));
});

router.get("/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBookParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select({
      id: booksTable.id,
      title: booksTable.title,
      titleAr: booksTable.titleAr,
      author: booksTable.author,
      authorAr: booksTable.authorAr,
      description: booksTable.description,
      descriptionAr: booksTable.descriptionAr,
      price: booksTable.price,
      coverImage: booksTable.coverImage,
      categoryId: booksTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      rating: booksTable.rating,
      reviewCount: booksTable.reviewCount,
      inStock: booksTable.inStock,
      featured: booksTable.featured,
      pages: booksTable.pages,
      publishedYear: booksTable.publishedYear,
      isbn: booksTable.isbn,
    })
    .from(booksTable)
    .innerJoin(categoriesTable, eq(booksTable.categoryId, categoriesTable.id))
    .where(eq(booksTable.id, params.data.id));

  if (!rows[0]) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.json(GetBookResponse.parse(rows[0]));
});

export default router;
