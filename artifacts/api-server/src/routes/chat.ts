import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, booksTable, categoriesTable } from "@workspace/db";
import { SendChatMessageBody, SendChatMessageResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// Simple rule-based chatbot — no external AI needed
function generateReply(message: string, language: string): string {
  const isArabic = language === "ar";
  const lc = message.toLowerCase();

  if (lc.includes("hello") || lc.includes("hi") || lc.includes("مرحبا") || lc.includes("السلام")) {
    return isArabic
      ? "مرحباً! أنا نور، مساعدتك في مكتبة نور. كيف يمكنني مساعدتك في اختيار كتابك المثالي؟"
      : "Hello! I'm Noor, your assistant at Noor Bookstore. How can I help you find the perfect book?";
  }

  if (lc.includes("recommend") || lc.includes("suggest") || lc.includes("اقترح") || lc.includes("توصية")) {
    return isArabic
      ? "يسعدني أن أوصي لك بكتب! هل تفضل نوعاً معيناً؟ لدينا روايات، فلسفة، تاريخ، علوم، وأدب عربي رائع."
      : "I'd love to recommend books! Do you have a preferred genre? We have fiction, philosophy, history, science, and wonderful Arabic literature.";
  }

  if (lc.includes("price") || lc.includes("cost") || lc.includes("cheap") || lc.includes("سعر") || lc.includes("تكلفة")) {
    return isArabic
      ? "تتراوح أسعار كتبنا بين 25 و120 ريال. يمكنك استخدام فلتر السعر في صفحة الكتب للعثور على ما يناسب ميزانيتك."
      : "Our books range from 25 to 120 SAR. You can use the price filter on the books page to find what fits your budget.";
  }

  if (lc.includes("arabic") || lc.includes("عربي") || lc.includes("novel") || lc.includes("رواية")) {
    return isArabic
      ? "لدينا مجموعة رائعة من الروايات العربية! أنصحك بتجربة أعمال نجيب محفوظ ورضوى عاشور. تحقق من قسم الأدب العربي."
      : "We have a wonderful collection of Arabic novels! I recommend trying works by Naguib Mahfouz and Radwa Ashour. Check the Arabic Literature category.";
  }

  if (lc.includes("philosophy") || lc.includes("فلسفة")) {
    return isArabic
      ? "الفلسفة باب رائع! لدينا أعمال ابن رشد وابن خلدون من التراث العربي، إضافة إلى الفلسفة الغربية الحديثة."
      : "Philosophy is a wonderful gateway! We have works by Ibn Rushd and Ibn Khaldun from Arabic heritage, plus modern Western philosophy.";
  }

  if (lc.includes("history") || lc.includes("تاريخ")) {
    return isArabic
      ? "قسم التاريخ لدينا غني جداً! من تاريخ الحضارة الإسلامية إلى التاريخ الحديث. ما العصر الذي يثير اهتمامك؟"
      : "Our history section is very rich! From Islamic civilization history to modern history. Which era interests you?";
  }

  if (lc.includes("science") || lc.includes("علوم") || lc.includes("physics") || lc.includes("فيزياء")) {
    return isArabic
      ? "كتب العلوم رائعة لتوسيع الأفق! لدينا كتب عن الفيزياء والكيمياء والأحياء والعلوم بشكل عام."
      : "Science books are great for expanding horizons! We have books on physics, chemistry, biology, and general science.";
  }

  if (lc.includes("gift") || lc.includes("هدية")) {
    return isArabic
      ? "الكتاب هدية رائعة! أنصح بالكتب المميزة لدينا — هي من أجمل ما نقدمه وستكون هدية لا تُنسى."
      : "A book is a wonderful gift! I recommend our featured books — they are among our finest and would make an unforgettable gift.";
  }

  if (lc.includes("thank") || lc.includes("شكراً") || lc.includes("شكرا")) {
    return isArabic
      ? "بكل سرور! أتمنى أن تجد كتابك المثالي. أنا هنا إذا احتجت أي مساعدة أخرى."
      : "My pleasure! I hope you find your perfect book. I'm here if you need any more help.";
  }

  // Default
  return isArabic
    ? "سؤال رائع! يمكنني مساعدتك في العثور على الكتب المناسبة لاهتماماتك. جرب تصفح أقسامنا: الروايات، الفلسفة، التاريخ، العلوم، والأدب العربي."
    : "Great question! I can help you find books that match your interests. Try browsing our sections: Fiction, Philosophy, History, Science, and Arabic Literature.";
}

router.post("/chat", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, language = "en" } = parsed.data;
  const reply = generateReply(message, language);

  // Optionally attach suggested books based on keywords
  const lc = message.toLowerCase();
  let suggestedBooks: any[] = [];

  try {
    const allBooks = await db
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

    if (lc.includes("recommend") || lc.includes("اقترح") || lc.includes("gift") || lc.includes("هدية")) {
      suggestedBooks = allBooks.filter((b) => b.featured).slice(0, 3);
    } else if (lc.includes("novel") || lc.includes("رواية") || lc.includes("arabic") || lc.includes("عربي")) {
      suggestedBooks = allBooks.filter((b) => b.categoryName === "Arabic Literature").slice(0, 3);
    } else if (lc.includes("philosophy") || lc.includes("فلسفة")) {
      suggestedBooks = allBooks.filter((b) => b.categoryName === "Philosophy").slice(0, 3);
    } else if (lc.includes("history") || lc.includes("تاريخ")) {
      suggestedBooks = allBooks.filter((b) => b.categoryName === "History").slice(0, 3);
    } else if (lc.includes("science") || lc.includes("علوم")) {
      suggestedBooks = allBooks.filter((b) => b.categoryName === "Science").slice(0, 3);
    }
  } catch {
    suggestedBooks = [];
  }

  res.json(
    SendChatMessageResponse.parse({
      reply,
      suggestedBooks,
    })
  );
});

export default router;
