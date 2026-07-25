import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "./i18n-provider";
import { useSendChatMessage } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { BookCard } from "./book-card";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  suggestedBooks?: any[];
};

const quickQuestions = {
  en: [
    "Recommend a book",
    "Show me Arabic novels",
    "What are the prices?",
  ],
  ar: [
    "اقترح علي كتاباً",
    "أريد روايات عربية",
    "ما هي الأسعار؟",
  ],
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { t, language, isRtl } = useI18n();
  const sendChat = useSendChatMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          content: t("chat.greeting"),
        },
      ]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const message = text ?? inputValue;
    if (!message.trim() || sendChat.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!text) setInputValue("");

    sendChat.mutate(
      { data: { message, language } },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "bot",
              content: data.reply,
              suggestedBooks: data.suggestedBooks,
            },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "bot",
              content: isRtl ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى." : "Sorry, an error occurred. Please try again.",
            },
          ]);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl shadow-primary/30 bg-gradient-to-br from-primary to-secondary text-primary-foreground z-50 hover:scale-110 transition-transform duration-300"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-secondary" />
        </span>
      </Button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[70vh] bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-10">
          <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background/20 backdrop-blur flex items-center justify-center text-primary-foreground font-bold text-lg">
                {isRtl ? "ن" : "N"}
              </div>
              <div>
                <span className="font-semibold block">{isRtl ? "نور" : "Noor"}</span>
                <span className="text-xs text-primary-foreground/80">{isRtl ? "مساعدك في مكتبة نور" : "Your Noor assistant"}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[88%]",
                  msg.role === "user" ? "ml-auto" : "mr-auto"
                )}
                style={isRtl && msg.role === "user" ? { marginRight: "auto", marginLeft: "0" } : {}}
              >
                <div
                  className={cn(
                    "p-3.5 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}
                  style={isRtl && msg.role === "user" ? { borderBottomRightRadius: "1rem", borderBottomLeftRadius: "0.125rem" } : {}}
                >
                  {msg.content}
                </div>

                {msg.suggestedBooks && msg.suggestedBooks.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {msg.suggestedBooks.map((book: any) => (
                      <div key={book.id} className="w-52">
                        <BookCard book={book} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sendChat.isPending && (
              <div className={cn("mr-auto bg-muted text-muted-foreground p-3.5 rounded-2xl rounded-bl-sm text-sm inline-flex gap-1")}>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="px-3 py-2 border-t border-border bg-muted/30">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quickQuestions[language].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-background border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-background border-t border-border flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.placeholder")}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={sendChat.isPending || !inputValue.trim()}
              className="shrink-0"
            >
              <Send className={cn("h-4 w-4", isRtl ? "rotate-180" : "")} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
