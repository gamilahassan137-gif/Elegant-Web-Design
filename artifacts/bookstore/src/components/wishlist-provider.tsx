import React, { createContext, useContext, useState, useEffect } from "react";
import { Book } from "@workspace/api-client-react";

type WishlistContextType = {
  items: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: number) => void;
  isInWishlist: (bookId: number) => boolean;
  toggleWishlist: (book: Book) => void;
  clearWishlist: () => void;
  totalItems: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Book[]>(() => {
    try {
      const stored = localStorage.getItem("bookstore-wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bookstore-wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (book: Book) => {
    setItems((prev) => {
      if (prev.find((item) => item.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  const isInWishlist = (bookId: number) => items.some((item) => item.id === bookId);

  const toggleWishlist = (book: Book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
