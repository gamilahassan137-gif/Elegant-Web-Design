import { useListFeaturedBooks, useGetBooksStats, useListCategories } from "@workspace/api-client-react";
import { useI18n } from "@/components/i18n-provider";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, BookOpen, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { t, isRtl } = useI18n();
  const { data: featuredBooks, isLoading: featuredLoading } = useListFeaturedBooks();
  const { data: stats } = useGetBooksStats();
  const { data: categories } = useListCategories();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl leading-tight">
            {t("home.hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl">
            {t("home.hero.subtitle")}
          </p>
          <Link href="/books" className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 h-14 rounded-full">
              {t("home.hero.cta")}
              {isRtl ? <ArrowLeft className="mr-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-8 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-border rtl:divide-x-reverse">
              <div className="flex flex-col items-center justify-center p-4">
                <BookOpen className="h-8 w-8 text-secondary mb-2" />
                <span className="text-3xl font-bold text-foreground">{stats.totalBooks}</span>
                <span className="text-sm text-muted-foreground">{t("home.stats.books")}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <Layers className="h-8 w-8 text-secondary mb-2" />
                <span className="text-3xl font-bold text-foreground">{stats.totalCategories}</span>
                <span className="text-sm text-muted-foreground">{t("home.stats.categories")}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Books */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{t("home.featured")}</h2>
            <div className="w-16 h-1 bg-secondary rounded-full" />
          </div>
          <Link href="/books" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 px-4 py-2 text-primary hover:text-primary hover:bg-primary/10">
              {t("home.viewAll")}
              {isRtl ? <ArrowLeft className="mr-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
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
            {featuredBooks?.map((book) => (
              <div key={book.id} className="animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${book.id * 100}ms` }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("categories.title")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/books?categoryId=${category.id}`} className="block">
                <Card className="hover-elevate cursor-pointer border-transparent bg-muted/50 hover:bg-muted text-center transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-1">{isRtl ? category.nameAr : category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.bookCount} {t("categories.books")}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
