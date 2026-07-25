import { useI18n } from "@/components/i18n-provider";
import { Link } from "wouter";
import { Book as BookIcon, Heart, Mail, Phone, MapPin, Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const { t, isRtl } = useI18n();
  const year = new Date().getFullYear();

  const links = [
    { href: "/books", label: t("nav.books") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/cart", label: t("nav.cart") },
    { href: "/wishlist", label: t("nav.wishlist") },
  ];

  const social = [
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Facebook, label: "Facebook" },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span>مكتبة نور</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isRtl
                ? "وجهتك المثالية للكتب العربية والعالمية. نؤمن بأن الكتاب هو أجمل هدية."
                : "Your perfect destination for Arabic and global books. We believe a book is the most beautiful gift."}
            </p>
            <div className="flex items-center gap-2">
              {social.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">{isRtl ? "روابط سريعة" : "Quick Links"}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">{isRtl ? "تواصل معنا" : "Contact Us"}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                hello@noorbookstore.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +966 50 000 0000
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {isRtl ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}
              </li>
            </ul>
          </div>

          {/* Newsletter mini */}
          <div>
            <h3 className="font-bold mb-4">{isRtl ? "النشرة البريدية" : "Newsletter"}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isRtl ? "احصل على آخر الأخبار والعروض." : "Get the latest news and offers."}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={isRtl ? "بريدك" : "Your email"}
                className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                {t("home.newsletter.button")}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            &copy; {year} {isRtl ? "مكتبة نور. جميع الحقوق محفوظة." : "Noor Bookstore. All rights reserved."}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{isRtl ? "صُنع بـ" : "Made with"}</span>
            <Heart className="w-4 h-4 text-destructive fill-current" />
            <span>{isRtl ? "للقراء" : "for readers"}</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">{t("footer.privacy")}</Link>
            <Link href="#" className="hover:text-primary">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
