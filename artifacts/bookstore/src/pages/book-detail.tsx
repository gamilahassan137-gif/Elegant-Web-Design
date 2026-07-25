import { useParams, Link } from "wouter";
import { useGetBook, useListBooks, getGetBookQueryKey, getListBooksQueryKey } from "@workspace/api-client-react";
import { useI18n } from "@/components/i18n-provider";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, Star, Heart, ArrowLeft, ArrowRight, BookOpen, Share2 } from "lucide-react";
import { useState } from "react";
import { BookCard } from "@/components/book-card";
import { cn } from "@/lib/utils";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, isRtl } = useI18n();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { data: book, isLoading } = useGetBook(Number(id), {
    query: { enabled: !!id, queryKey: getGetBookQueryKey(Number(id)) }
  });
  const inWishlist = book ? isInWishlist(book.id) : false;

  const { data: relatedBooks } = useListBooks(
    { categoryId: book?.categoryId },
    { query: { enabled: !!book?.categoryId, queryKey: getListBooksQueryKey({ categoryId: book?.categoryId }) } }
  );

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16 animate-pulse h-[600px] bg-muted rounded-xl" />;
  }

  if (!book) return <div className="container mx-auto px-4 py-16 text-center">{t("error.loading")}</div>;

  const title = isRtl && book.titleAr ? book.titleAr : book.title;
  const author = isRtl && book.authorAr ? book.authorAr : book.author;
  const description = isRtl && book.descriptionAr ? book.descriptionAr : book.description;
  const categoryName = isRtl && book.categoryNameAr ? book.categoryNameAr : book.categoryName;

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const filteredRelated = relatedBooks?.filter((b) => b.id !== book.id).slice(0, 4) || [];
  const truncatedDescription = description.length > 400 ? description.slice(0, 400) + "..." : description;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/books" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t("cart.continueShopping")}
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Cover */}
        <div className="w-full lg:w-1/3 xl:w-1/4 shrink-0">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-border/50 sticky top-28 group">
            {book.coverImage ? (
              <img src={book.coverImage} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary p-6 text-center text-xl font-serif italic">
                {title}
              </div>
            )}
            <button
              onClick={() => toggleWishlist(book)}
              className={cn(
                "absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg",
                inWishlist
                  ? "bg-destructive text-destructive-foreground scale-110"
                  : "bg-background/80 text-muted-foreground hover:text-destructive hover:bg-background"
              )}
            >
              <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 pt-2">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="secondary">{categoryName}</Badge>
            {book.featured && <Badge variant="glow">{t("home.featured")}</Badge>}
            <Badge variant={book.inStock ? "success" : "warning"}>
              {book.inStock ? t("book.inStock") : t("book.outOfStock")}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
          <p className="text-xl text-muted-foreground mb-6 font-medium">{author}</p>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex text-secondary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(book.rating || 5) ? 'fill-current' : 'opacity-30'}`} />
              ))}
            </div>
            <span className="font-semibold">{book.rating}</span>
            <span className="text-muted-foreground text-sm">({book.reviewCount} {t("book.reviews")})</span>
          </div>

          <div className="text-4xl font-bold text-primary mb-8">${book.price.toFixed(2)}</div>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <div className="flex items-center gap-3 bg-muted rounded-xl p-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-lg"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-8 text-center font-bold text-lg">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-lg"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>

            <Button
              size="xl"
              variant={added ? "secondary" : "gradient"}
              shape="pill"
              className="px-12"
              onClick={handleAddToCart}
              disabled={!book.inStock || added}
              leftIcon={added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            >
              {added ? t("book.added") : t("book.addToCart")}
            </Button>

            <Button size="xl" variant="threeD-secondary" shape="pill" disabled={!book.inStock}>
              {t("book.buyNow")}
            </Button>

            <Button variant="outline" size="icon" shape="pill" onClick={handleShare} title="Share">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
            <p className="text-lg leading-relaxed">
              {showFullDescription ? description : truncatedDescription}
            </p>
            {description.length > 400 && (
              <Button
                variant="link"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="p-0 h-auto"
              >
                {showFullDescription ? t("common.showMore") : t("common.readMore")}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-border">
            {book.pages && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("book.pages")}</p>
                  <p className="font-semibold">{book.pages}</p>
                </div>
              </div>
            )}
            {book.publishedYear && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="font-bold text-xs">Yr</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("book.published")}</p>
                  <p className="font-semibold">{book.publishedYear}</p>
                </div>
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="font-bold text-xs">#</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("book.isbn")}</p>
                  <p className="font-semibold text-sm">{book.isbn}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Books */}
      {filteredRelated.length > 0 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">{t("book.related")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredRelated.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
