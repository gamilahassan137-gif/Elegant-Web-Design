import { useWishlist } from "@/components/wishlist-provider";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Trash2 } from "lucide-react";

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { t, isRtl } = useI18n();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-4">{t("wishlist.empty")}</h1>
        <Link href="/books">
          <Button variant="gradient" size="lg">
            {t("cart.continueShopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("wishlist.title")}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((book) => {
          const title = isRtl && book.titleAr ? book.titleAr : book.title;
          const author = isRtl && book.authorAr ? book.authorAr : book.author;

          return (
            <div key={book.id} className="group relative">
              <Link href={`/books/${book.id}`} className="block">
                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-muted mb-3">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center">{title}</div>
                  )}
                </div>
                <h3 className="font-bold line-clamp-2 mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{author}</p>
                <p className="font-bold text-primary">${book.price.toFixed(2)}</p>
              </Link>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromWishlist(book.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
