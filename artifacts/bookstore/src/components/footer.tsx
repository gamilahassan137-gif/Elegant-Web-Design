import { useI18n } from "@/components/i18n-provider";

export function Footer() {
  const { t, isRtl } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
            <span>مكتبة نور</span>
            <span className="text-muted-foreground text-sm font-normal">| Noor Bookstore</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {year} {isRtl ? "مكتبة نور. جميع الحقوق محفوظة." : "Noor Bookstore. All rights reserved."}
          </div>
        </div>
      </div>
    </footer>
  );
}
