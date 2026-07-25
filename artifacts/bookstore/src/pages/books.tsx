import { useState, useEffect } from "react";
import { useListBooks, useListCategories } from "@workspace/api-client-react";
import { useI18n } from "@/components/i18n-provider";
import { BookCard } from "@/components/book-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useSearch } from "wouter";

export default function Books() {
  const { t, isRtl } = useI18n();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryId, setCategoryId] = useState<number | null>(
    searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: books, isLoading } = useListBooks({
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
  });

  const { data: categories } = useListCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h2 className="text-lg font-bold mb-4">{t("books.search")}</h2>
            <div className="relative">
              <Input
                placeholder={t("books.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">{t("books.category")}</h2>
            <div className="space-y-2">
              <Button
                variant={categoryId === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCategoryId(null)}
              >
                {t("books.allCategories")}
              </Button>
              {categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoryId === cat.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCategoryId(cat.id)}
                >
                  {isRtl ? cat.nameAr : cat.name}
                  <span className="ml-auto bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground">
                    {cat.bookCount}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("books.title")}</h1>
            <div className="text-sm text-muted-foreground">
              {books?.length || 0} {t("categories.books")}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : books && books.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-muted-foreground border border-dashed border-border rounded-xl">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>{t("books.noResults")}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
