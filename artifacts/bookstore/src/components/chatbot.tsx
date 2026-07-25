import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Book as BookIcon } from "lucide-react";
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

  const handleSend = () => {
    if (!inputValue.trim() || sendChat.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    sendChat.mutate(
      { data: { message: userMessage.content, language } },
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground z-50 animate-bounce"
        style={{ animationDuration: '3s' }}
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[60vh] bg-card border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-10">
          <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                {isRtl ? "ن" : "N"}
              </div>
              <span className="font-semibold">{isRtl ? "نور" : "Noor"}</span>
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
                  "flex flex-col max-w-[85%]",
                  msg.role === "user" ? "ml-auto" : "mr-auto"
                )}
                style={isRtl && msg.role === "user" ? { marginRight: "auto", marginLeft: "0" } : {}}
              >
                <div
                  className={cn(
                    "p-3 rounded-2xl text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-muted-foreground rounded-bl-sm"
                  )}
                  style={isRtl && msg.role === "user" ? { borderBottomRightRadius: "1rem", borderBottomLeftRadius: "0.125rem" } : {}}
                >
                  {msg.content}
                </div>
                
                {msg.suggestedBooks && msg.suggestedBooks.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.suggestedBooks.map((book: any) => (
                      <div key={book.id} className="w-48">
                         <BookCard book={book} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sendChat.isPending && (
              <div className={cn("mr-auto bg-muted text-muted-foreground p-3 rounded-2xl rounded-bl-sm text-sm inline-flex gap-1")}>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-background border-t border-border flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.placeholder")}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={sendChat.isPending || !inputValue.trim()}>
              <Send className={cn("h-4 w-4", isRtl ? "rotate-180" : "")} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
