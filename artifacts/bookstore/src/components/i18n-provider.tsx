import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

type Dictionary = { [key: string]: string };

const translations: Record<Language, Dictionary> = {
  en: {
    "nav.home": "Home",
    "nav.books": "Books",
    "nav.categories": "Categories",
    "nav.cart": "Cart",
    "nav.wishlist": "Wishlist",
    "nav.search": "Search books...",
    "home.hero.title": "Discover the richness of literature",
    "home.hero.subtitle": "A curated collection of Arabic and English books for the discerning reader.",
    "home.hero.cta": "Browse Collection",
    "home.stats.books": "Books",
    "home.stats.categories": "Categories",
    "home.stats.featured": "Featured",
    "home.stats.customers": "Readers",
    "home.featured": "Featured Books",
    "home.newArrivals": "New Arrivals",
    "home.viewAll": "View All",
    "home.bestsellers": "Bestsellers",
    "home.explore": "Explore Our World",
    "home.testimonials": "What Readers Say",
    "home.newsletter.title": "Stay in the Story",
    "home.newsletter.subtitle": "Get weekly book recommendations and exclusive offers.",
    "home.newsletter.placeholder": "Enter your email",
    "home.newsletter.button": "Subscribe",
    "books.title": "All Books",
    "books.search": "Search by title or author...",
    "books.category": "Category",
    "books.price": "Price Range",
    "books.allCategories": "All Categories",
    "books.filter": "Filter",
    "books.sort": "Sort by",
    "books.sort.newest": "Newest",
    "books.sort.priceLow": "Price: Low to High",
    "books.sort.priceHigh": "Price: High to Low",
    "books.sort.rating": "Top Rated",
    "books.noResults": "No books found matching your criteria.",
    "books.results": "books found",
    "book.addToCart": "Add to Cart",
    "book.added": "Added!",
    "book.buyNow": "Buy Now",
    "book.inStock": "In Stock",
    "book.outOfStock": "Out of Stock",
    "book.pages": "Pages",
    "book.published": "Published",
    "book.isbn": "ISBN",
    "book.related": "You might also like",
    "book.reviews": "reviews",
    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.remove": "Remove",
    "cart.continueShopping": "Continue Shopping",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "Free",
    "cart.applyCoupon": "Apply Coupon",
    "categories.title": "Browse Categories",
    "categories.books": "books",
    "chat.placeholder": "Ask Noor a question...",
    "chat.send": "Send",
    "chat.greeting": "Hello! I'm Noor. How can I help you find a book today?",
    "error.loading": "Failed to load data.",
    "loading": "Loading...",
    "wishlist.title": "Your Wishlist",
    "wishlist.empty": "Your wishlist is empty",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.seeMore": "See More",
    "common.showMore": "Show More",
    "common.readMore": "Read More",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.books": "الكتب",
    "nav.categories": "التصنيفات",
    "nav.cart": "السلة",
    "nav.wishlist": "المفضلة",
    "nav.search": "ابحث عن الكتب...",
    "home.hero.title": "اكتشف ثراء المعرفة",
    "home.hero.subtitle": "مجموعة منتقاة بعناية من الكتب العربية والإنجليزية للقارئ المتميز.",
    "home.hero.cta": "تصفح المجموعة",
    "home.stats.books": "كتاب",
    "home.stats.categories": "تصنيف",
    "home.stats.featured": "مختار",
    "home.stats.customers": "قارئ",
    "home.featured": "كتب مختارة",
    "home.newArrivals": "وصول جديد",
    "home.viewAll": "عرض الكل",
    "home.bestsellers": "الأكثر مبيعاً",
    "home.explore": "استكشف عالمنا",
    "home.testimonials": "ما يقوله القراء",
    "home.newsletter.title": "ابقَ ضمن القصة",
    "home.newsletter.subtitle": "احصل على توصيات أسبوعية وعروض حصرية.",
    "home.newsletter.placeholder": "أدخل بريدك الإلكتروني",
    "home.newsletter.button": "اشترك",
    "books.title": "جميع الكتب",
    "books.search": "البحث بالعنوان أو المؤلف...",
    "books.category": "التصنيف",
    "books.price": "نطاق السعر",
    "books.allCategories": "جميع التصنيفات",
    "books.filter": "تصفية",
    "books.sort": "ترتيب حسب",
    "books.sort.newest": "الأحدث",
    "books.sort.priceLow": "السعر: من الأقل إلى الأعلى",
    "books.sort.priceHigh": "السعر: من الأعلى إلى الأقل",
    "books.sort.rating": "الأعلى تقييماً",
    "books.noResults": "لم يتم العثور على كتب تطابق بحثك.",
    "books.results": "كتاب",
    "book.addToCart": "أضف إلى السلة",
    "book.added": "تمت الإضافة!",
    "book.buyNow": "اشتري الآن",
    "book.inStock": "متوفر",
    "book.outOfStock": "نفذت الكمية",
    "book.pages": "الصفحات",
    "book.published": "سنة النشر",
    "book.isbn": "الرقم الدولي",
    "book.related": "قد يعجبك أيضاً",
    "book.reviews": "تقييم",
    "cart.title": "سلة المشتريات",
    "cart.empty": "السلة فارغة",
    "cart.total": "المجموع",
    "cart.checkout": "الدفع",
    "cart.remove": "إزالة",
    "cart.continueShopping": "متابعة التسوق",
    "cart.subtotal": "المجموع الفرعي",
    "cart.shipping": "التوصيل",
    "cart.free": "مجاني",
    "cart.applyCoupon": "تطبيق كوبون",
    "categories.title": "تصفح التصنيفات",
    "categories.books": "كتب",
    "chat.placeholder": "اسأل نور...",
    "chat.send": "إرسال",
    "chat.greeting": "مرحباً! أنا نور. كيف يمكنني مساعدتك في العثور على كتاب اليوم؟",
    "error.loading": "فشل تحميل البيانات.",
    "loading": "جاري التحميل...",
    "wishlist.title": "قائمة المفضلة",
    "wishlist.empty": "قائمة المفضلة فارغة",
    "footer.about": "عنّا",
    "footer.contact": "تواصل",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.close": "إغلاق",
    "common.seeMore": "المزيد",
    "common.showMore": "عرض المزيد",
    "common.readMore": "قراءة المزيد",
  }
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("app-language") as Language;
      return stored && (stored === "en" || stored === "ar") ? stored : "en";
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRtl: language === "ar" }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
