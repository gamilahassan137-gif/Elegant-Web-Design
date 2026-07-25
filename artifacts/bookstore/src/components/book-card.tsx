import { useI18n } from "./i18n-provider";
import { Book } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function BookCard({ book }: { book: Book }) {
  const { isRtl, t } = useI18n();

  const title = isRtl && book.titleAr ? book.titleAr : book.title;
  const author = isRtl && book.authorAr ? book.authorAr : book.author;
  const categoryName = isRtl && book.categoryNameAr ? book.categoryNameAr : book.categoryName;

  return (
    <Link href={`/books/${book.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden hover-elevate transition-all border-border/50 hover:border-primary/30 cursor-pointer bg-card/50">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-serif italic p-6 text-center">
                {title}
              </div>
            )}
            {book.featured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-secondary text-secondary-foreground">{t("home.featured")}</Badge>
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <p className="text-xs text-muted-foreground mb-1 font-medium">{categoryName}</p>
            <h3 className="font-bold text-lg mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{author}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-primary">${book.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
