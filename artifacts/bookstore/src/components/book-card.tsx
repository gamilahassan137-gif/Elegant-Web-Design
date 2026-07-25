import { useI18n } from "./i18n-provider";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";
import { Book } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

export function BookCard({ book }: { book: Book }) {
  const { isRtl, t } = useI18n();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(book.id);

  const title = isRtl && book.titleAr ? book.titleAr : book.title;
  const author = isRtl && book.authorAr ? book.authorAr : book.author;
  const categoryName = isRtl && book.categoryNameAr ? book.categoryNameAr : book.categoryName;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
  };

  return (
    <Card className="group h-full overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50">
      <CardContent className="p-0 flex flex-col h-full">
        <Link href={`/books/${book.id}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-muted">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-serif italic p-6 text-center">
              {title}
            </div>
          )}
          {book.featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="glow">{t("home.featured")}</Badge>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
            <Button
              size="sm"
              variant={added ? "secondary" : "default"}
              className="w-full"
              onClick={handleAddToCart}
              disabled={!book.inStock || added}
              leftIcon={added ? undefined : <ShoppingCart className="w-4 h-4" />}
            >
              {added ? t("book.added") : t("book.addToCart")}
            </Button>
          </div>
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-2 left-2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
              inWishlist
                ? "bg-destructive text-destructive-foreground scale-110"
                : "bg-background/80 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
            )}
          >
            <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
          </button>
        </Link>
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-muted-foreground mb-1 font-medium">{categoryName}</p>
          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-lg mb-1 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{author}</p>
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{book.rating}</span>
            <span className="text-xs text-muted-foreground">({book.reviewCount})</span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-lg text-primary">${book.price.toFixed(2)}</span>
            {!book.inStock && (
              <Badge variant="warning" className="text-xs">
                {t("book.outOfStock")}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
