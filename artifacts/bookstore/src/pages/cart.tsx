import { useCart } from "@/components/cart-provider";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { t, isRtl } = useI18n();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-4">{t("cart.empty")}</h1>
        <Link href="/books" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8">
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("cart.title")}</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {items.map(({ book, quantity }) => {
            const title = isRtl && book.titleAr ? book.titleAr : book.title;
            const author = isRtl && book.authorAr ? book.authorAr : book.author;
            
            return (
              <div key={book.id} className="flex gap-4 p-4 border border-border rounded-xl bg-card">
                <div className="w-20 md:w-24 aspect-[2/3] shrink-0 rounded bg-muted overflow-hidden">
                  {book.coverImage && (
                    <img src={book.coverImage} alt={title} className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1">{title}</h3>
                    <p className="text-muted-foreground text-sm">{author}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-muted rounded-full p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 rounded-full"
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-4 text-center font-medium">{quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 rounded-full"
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">${(book.price * quantity).toFixed(2)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeFromCart(book.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="w-full lg:w-96 shrink-0">
          <div className="border border-border rounded-xl p-6 bg-card sticky top-24">
            <h2 className="text-xl font-bold mb-6">{t("cart.total")}</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span>{t("cart.total")}</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <Button size="lg" className="w-full py-6 text-lg">{t("cart.checkout")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
