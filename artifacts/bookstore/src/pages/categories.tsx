import { useListCategories } from "@workspace/api-client-react";
import { useI18n } from "@/components/i18n-provider";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function Categories() {
  const { t, isRtl } = useI18n();
  const { data: categories, isLoading } = useListCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">{t("categories.title")}</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((cat) => (
            <Link key={cat.id} href={`/books?categoryId=${cat.id}`} className="block h-full">
              <Card className="hover-elevate cursor-pointer h-full border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1">
                      {isRtl ? cat.nameAr : cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cat.bookCount} {t("categories.books")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
