import {
  useListFeaturedBooks,
  useGetBooksStats,
  useListCategories,
  useListBooks,
} from "@workspace/api-client-react";
import { useI18n } from "@/components/i18n-provider";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, BookOpen, Layers, Star, Users, Sparkles, Mail, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const { t, isRtl } = useI18n();
  const { data: featuredBooks, isLoading: featuredLoading } = useListFeaturedBooks();
  const { data: stats } = useGetBooksStats();
  const { data: categories } = useListCategories();
  const { data: allBooks } = useListBooks();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const newArrivals = allBooks?.slice(0, 4);
  const bestsellers = allBooks?.filter((b) => b.rating >= 4.7).slice(0, 4);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section with uploaded image as background */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/attached_assets/5127789681679469835_1784984437714.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90 dark:from-background/80 dark:via-background/60 dark:to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-sm font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>{isRtl ? "أكثر من 20 كتاباً منتقى بعناية" : "Over 20 carefully curated books"}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl leading-tight">
            {t("home.hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/books">
              <Button variant="gradient" size="xl" shape="pill" rightIcon={isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}>
                {t("home.hero.cta")}
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="glass" size="xl" shape="pill">
                {isRtl ? "استكشف التصنيفات" : "Explore Categories"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-10 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, value: stats.totalBooks, label: t("home.stats.books") },
                { icon: Layers, value: stats.totalCategories, label: t("home.stats.categories") },
                { icon: Star, value: stats.featuredCount, label: t("home.stats.featured") },
                { icon: Users, value: "2.5k+", label: t("home.stats.customers") },
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-6 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors">
                  <stat.icon className="h-8 w-8 text-secondary mb-3" />
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Books */}
      <section className="py-20 md:py-28 container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{isRtl ? "مختاراتنا" : "Editor's Picks"}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{t("home.featured")}</h2>
            <div className="w-20 h-1.5 bg-secondary rounded-full mt-3" />
          </div>
          <Link href="/books">
            <Button variant="soft" rightIcon={isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}>
              {t("home.viewAll")}
            </Button>
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredBooks?.map((book, idx) => (
              <div
                key={book.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{isRtl ? "تصنيفات" : "Categories"}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{t("categories.title")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories?.map((category) => (
              <Link key={category.id} href={`/books?categoryId=${category.id}`} className="block">
                <Card className="hover-elevate cursor-pointer border-border/50 hover:border-primary/40 hover:bg-card text-center transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{isRtl ? category.nameAr : category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.bookCount} {t("categories.books")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="py-20 md:py-28 container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">{isRtl ? "جديد المكتبة" : "Fresh on the Shelves"}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{t("home.newArrivals")}</h2>
              <div className="w-20 h-1.5 bg-secondary rounded-full mt-3" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers && bestsellers.length > 0 && (
        <section className="py-20 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">{isRtl ? "الأكثر تقييماً" : "Top Rated"}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{t("home.bestsellers")}</h2>
                <div className="w-20 h-1.5 bg-secondary rounded-full mt-3" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {bestsellers.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 md:py-28 container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">{isRtl ? "آراء" : "Reviews"}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{t("home.testimonials")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: isRtl ? "ليلى أ." : "Layla A.",
              text: isRtl
                ? "مكتبة رائعة! المجموعة العربية ممتازة والتصميم جميل جداً."
                : "A wonderful bookstore! The Arabic collection is excellent and the design is beautiful.",
            },
            {
              name: isRtl ? "أحمد ر." : "Ahmed R.",
              text: isRtl
                ? "أسعار مناسبة وتوصيل سريع. أحببت خاصية التوصيات من نور."
                : "Reasonable prices and fast delivery. I loved the recommendations from Noor.",
            },
            {
              name: isRtl ? "سارة م." : "Sarah M.",
              text: isRtl
                ? "أفضل مكان لشراء الكتب العربية. تجربة المستخدم رائعة!"
                : "The best place to buy Arabic books. Great user experience!",
            },
          ].map((testimonial, idx) => (
            <Card key={idx} className="border-border/50 bg-card/50">
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-secondary/50 mb-4" />
                <p className="text-foreground/90 mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <span className="font-semibold">{testimonial.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Mail className="w-12 h-12 mx-auto mb-6 text-secondary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("home.newsletter.title")}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">{t("home.newsletter.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("home.newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSubscribe}
              className="shrink-0"
            >
              {subscribed ? (isRtl ? "تم الاشتراك!" : "Subscribed!") : t("home.newsletter.button")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
