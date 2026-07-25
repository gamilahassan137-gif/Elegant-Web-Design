import { useParams } from "wouter";
import { useGetBook, useListBooks } from "@workspace/api-client-react";
import { useI18n } from "@/components/i18n-provider";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, Star } from "lucide-react";
import { useState } from "react";
import { BookCard } from "@/components/book-card";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, isRtl } = useI18n();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const { data: book, isLoading } = useGetBook(Number(id), {
    query: { enabled: !!id }
  });

  const { data: relatedBooks } = useListBooks(
    { categoryId: book?.categoryId },
    { query: { enabled: !!book?.categoryId } }
  );

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16 animate-pulse h-[600px] bg-muted rounded-xl"></div>;
  }

  if (!book) return <div className="container mx-auto px-4 py-16 text-center">{t("error.loading")}</div>;

  const title = isRtl && book.titleAr ? book.titleAr : book.title;
  const author = isRtl && book.authorAr ? book.authorAr : book.author;
  const description = isRtl && book.descriptionAr ? book.descriptionAr : book.description;
  const categoryName = isRtl && book.categoryNameAr ? book.categoryNameAr : book.categoryName;

  const handleAddToCart = () => {
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const filteredRelated = relatedBooks?.filter(b => b.id !== book.id).slice(0, 4) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12 mb-24">
        {/* Cover */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-border/50 sticky top-24">
            {book.coverImage ? (
              <img src={book.coverImage} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary p-6 text-center text-xl font-serif italic">
                {title}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 pt-4">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="secondary">{categoryName}</Badge>
            {book.featured && <Badge className="bg-accent text-accent-foreground">{t("home.featured")}</Badge>}
            <Badge variant="outline" className={book.inStock ? "text-green-600 border-green-600" : "text-red-600 border-red-600"}>
              {book.inStock ? t("book.inStock") : t("book.outOfStock")}
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
          <p className="text-xl text-muted-foreground mb-6 font-medium">{author}</p>

          <div className="flex items-center gap-2 mb-8">
            <div className="flex text-secondary">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.floor(book.rating || 5) ? 'fill-current' : 'opacity-30'}`} />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">({book.reviewCount} reviews)</span>
          </div>

          <div className="text-3xl font-bold text-primary mb-8">${book.price.toFixed(2)}</div>

          <Button 
            size="lg" 
            className="w-full md:w-auto px-12 h-14 text-lg rounded-full mb-12 shadow-lg"
            onClick={handleAddToCart}
            disabled={!book.inStock || added}
          >
            {added ? <Check className="mr-2 h-5 w-5" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
            {added ? "Added!" : t("book.addToCart")}
          </Button>

          <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
            <p className="text-lg leading-relaxed">{description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-t border-b border-border">
            {book.pages && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("book.pages")}</p>
                <p className="font-semibold">{book.pages}</p>
              </div>
            )}
            {book.publishedYear && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("book.published")}</p>
                <p className="font-semibold">{book.publishedYear}</p>
              </div>
            )}
            {book.isbn && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("book.isbn")}</p>
                <p className="font-semibold text-sm">{book.isbn}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Books */}
      {filteredRelated.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">{t("book.related")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredRelated.map(b => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
