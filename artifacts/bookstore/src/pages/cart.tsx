import { useCart } from "@/components/cart-provider";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart, Gift, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { t, isRtl } = useI18n();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? totalPrice * 0.1 : 0;
  const finalTotal = totalPrice - discount;

  const applyCoupon = () => {
    if (coupon.toLowerCase() === "noor10") {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
          <ShoppingCart className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">{t("cart.empty")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {isRtl ? "ابدأ رحلتك المعرفية واكتشف كتباً رائعة بانتظارك." : "Start your knowledge journey and discover great books waiting for you."}
        </p>
        <Link href="/books">
          <Button variant="gradient" size="xl" shape="pill">
            {t("cart.continueShopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">{t("cart.title")}</h1>
        <Button variant="ghost" onClick={clearCart} leftIcon={<Trash2 className="w-4 h-4" />}>
          {isRtl ? "إفراغ السلة" : "Clear Cart"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {items.map(({ book, quantity }) => {
            const title = isRtl && book.titleAr ? book.titleAr : book.title;
            const author = isRtl && book.authorAr ? book.authorAr : book.author;

            return (
              <div key={book.id} className="flex gap-4 p-5 border border-border rounded-2xl bg-card hover:border-primary/30 transition-colors">
                <div className="w-24 md:w-28 aspect-[2/3] shrink-0 rounded-xl bg-muted overflow-hidden shadow-sm">
                  {book.coverImage && (
                    <img src={book.coverImage} alt={title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-1">{title}</h3>
                        <p className="text-muted-foreground text-sm">{author}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                        onClick={() => removeFromCart(book.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-muted rounded-full p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 rounded-full"
                        onClick={() => updateQuantity(book.id, quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-6 text-center font-bold">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-9 h-9 rounded-full"
                        onClick={() => updateQuantity(book.id, quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <span className="font-bold text-xl text-primary">${(book.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Truck, text: isRtl ? "توصيل مجاني" : "Free Shipping" },
              { icon: ShieldCheck, text: isRtl ? "دفع آمن" : "Secure Payment" },
              { icon: Gift, text: isRtl ? "تغليف هدايا" : "Gift Wrapping" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
                <item.icon className="w-6 h-6 text-primary" />
                <span className="font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="border border-border rounded-2xl p-6 bg-card sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-6">{t("cart.total")}</h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("cart.shipping")}</span>
                <BadgeFree t={t} isRtl={isRtl} />
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{isRtl ? "خصم NOOR10" : "NOOR10 Discount"}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span>{t("cart.total")}</span>
                <span className="text-primary">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Input
                placeholder={isRtl ? "كود الخصم NOOR10" : "Coupon code NOOR10"}
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="h-11"
              />
              <Button variant="outline" className="shrink-0" onClick={applyCoupon}>
                {t("cart.applyCoupon")}
              </Button>
            </div>

            <Button size="lg" variant="gradient" className="w-full py-6 text-lg" leftIcon={<CreditCard className="w-5 h-5" />}>
              {t("cart.checkout")}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {isRtl ? "الضريبة والشحن محسوبان في الخطوة التالية." : "Tax and shipping are calculated in the next step."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeFree({ t, isRtl }: { t: (key: string) => string; isRtl: boolean }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
      {t("cart.free")}
    </span>
  );
}
