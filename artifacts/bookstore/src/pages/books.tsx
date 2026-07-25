import { useState, useEffect, useMemo } from "react";
import { useListBooks, useListCategories } from "@workspace/api-client-react";
import { useI18n } from "@/components/i18n-provider";
import { BookCard } from "@/components/book-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, ArrowUpDown, X } from "lucide-react";
import { useSearch } from "wouter";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "priceLow" | "priceHigh" | "rating";

export default function Books() {
  const { t, isRtl } = useI18n();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryId, setCategoryId] = useState<number | null>(
    searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null
  );
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: books, isLoading } = useListBooks({
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
  });
  const { data: categories } = useListCategories();

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    let result = [...books];
    if (minPrice != null) result = result.filter((b) => b.price >= minPrice);
    if (maxPrice != null) result = result.filter((b) => b.price <= maxPrice);

    switch (sortBy) {
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [books, minPrice, maxPrice, sortBy]);

  const clearFilters = () => {
    setCategoryId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSearch("");
    setSortBy("newest");
  };

  const activeFiltersCount =
    (categoryId ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Filters */}
        <aside
          className={cn(
            "w-full md:w-72 shrink-0 space-y-6 transition-all duration-300",
            showFilters ? "block" : "hidden md:block"
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              {t("books.filter")}
            </h2>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X className="w-4 h-4" />}>
                {isRtl ? "مسح" : "Clear"}
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t("books.search")}</h3>
            <div className="relative">
              <Input
                placeholder={t("books.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn("pl-10", isRtl && "pr-10 pl-4")}
              />
              <Search
                className={cn(
                  "absolute top-2.5 h-4 w-4 text-muted-foreground",
                  isRtl ? "right-3" : "left-3"
                )}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t("books.category")}</h3>
            <div className="space-y-1">
              <Button
                variant={categoryId === null ? "default" : "ghost"}
                className="w-full justify-start"
                size="sm"
                onClick={() => setCategoryId(null)}
              >
                {t("books.allCategories")}
              </Button>
              {categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoryId === cat.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  size="sm"
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

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t("books.price")}</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={isRtl ? "من" : "Min"}
                value={minPrice ?? ""}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                className="h-10"
              />
              <Input
                type="number"
                placeholder={isRtl ? "إلى" : "Max"}
                value={maxPrice ?? ""}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                className="h-10"
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{t("books.title")}</h1>
              <p className="text-sm text-muted-foreground">
                {filteredBooks.length} {t("books.results")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              >
                {t("books.filter")}
                {activeFiltersCount > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-1 border border-input rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="newest">{t("books.sort.newest")}</option>
                <option value="priceLow">{t("books.sort.priceLow")}</option>
                <option value="priceHigh">{t("books.sort.priceHigh")}</option>
                <option value="rating">{t("books.sort.rating")}</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div
              className={cn(
                "gap-6",
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "flex flex-col"
              )}
            >
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/30">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">{t("books.noResults")}</p>
              <Button variant="soft" className="mt-4" onClick={clearFilters}>
                {isRtl ? "مسح الفلاتر" : "Clear Filters"}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
