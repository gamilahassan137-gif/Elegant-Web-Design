import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

type Dictionary = {
  [key: string]: string;
};

const translations: Record<Language, Dictionary> = {
  en: {
    "nav.home": "Home",
    "nav.books": "Books",
    "nav.categories": "Categories",
    "nav.cart": "Cart",
    "nav.search": "Search books...",
    "home.hero.title": "Discover the richness of literature",
    "home.hero.subtitle": "A curated collection of Arabic and English books for the discerning reader.",
    "home.hero.cta": "Browse Collection",
    "home.stats.books": "Books",
    "home.stats.categories": "Categories",
    "home.featured": "Featured Books",
    "home.viewAll": "View All",
    "books.title": "All Books",
    "books.search": "Search by title or author...",
    "books.category": "Category",
    "books.price": "Price Range",
    "books.allCategories": "All Categories",
    "books.filter": "Filter",
    "books.noResults": "No books found matching your criteria.",
    "book.addToCart": "Add to Cart",
    "book.inStock": "In Stock",
    "book.outOfStock": "Out of Stock",
    "book.pages": "Pages",
    "book.published": "Published",
    "book.isbn": "ISBN",
    "book.related": "You might also like",
    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.remove": "Remove",
    "cart.continueShopping": "Continue Shopping",
    "categories.title": "Categories",
    "categories.books": "books",
    "chat.placeholder": "Ask Noor a question...",
    "chat.send": "Send",
    "chat.greeting": "Hello! I'm Noor. How can I help you find a book today?",
    "error.loading": "Failed to load data.",
    "loading": "Loading...",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.books": "الكتب",
    "nav.categories": "التصنيفات",
    "nav.cart": "السلة",
    "nav.search": "ابحث عن الكتب...",
    "home.hero.title": "اكتشف ثراء المعرفة",
    "home.hero.subtitle": "مجموعة منتقاة بعناية من الكتب العربية والإنجليزية للقارئ المتميز.",
    "home.hero.cta": "تصفح المجموعة",
    "home.stats.books": "كتاب",
    "home.stats.categories": "تصنيف",
    "home.featured": "كتب مختارة",
    "home.viewAll": "عرض الكل",
    "books.title": "جميع الكتب",
    "books.search": "البحث بالعنوان أو المؤلف...",
    "books.category": "التصنيف",
    "books.price": "نطاق السعر",
    "books.allCategories": "جميع التصنيفات",
    "books.filter": "تصفية",
    "books.noResults": "لم يتم العثور على كتب تطابق بحثك.",
    "book.addToCart": "أضف إلى السلة",
    "book.inStock": "متوفر",
    "book.outOfStock": "نفذت الكمية",
    "book.pages": "الصفحات",
    "book.published": "سنة النشر",
    "book.isbn": "الرقم الدولي",
    "book.related": "قد يعجبك أيضاً",
    "cart.title": "سلة المشتريات",
    "cart.empty": "السلة فارغة",
    "cart.total": "المجموع",
    "cart.checkout": "الدفع",
    "cart.remove": "إزالة",
    "cart.continueShopping": "متابعة التسوق",
    "categories.title": "التصنيفات",
    "categories.books": "كتب",
    "chat.placeholder": "اسأل نور...",
    "chat.send": "إرسال",
    "chat.greeting": "مرحباً! أنا نور. كيف يمكنني مساعدتك في العثور على كتاب اليوم؟",
    "error.loading": "فشل تحميل البيانات.",
    "loading": "جاري التحميل...",
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
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("app-language") as Language;
    if (storedLang && (storedLang === "en" || storedLang === "ar")) {
      setLanguageState(storedLang);
    }
  }, []);

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
