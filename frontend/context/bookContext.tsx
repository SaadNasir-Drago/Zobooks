"use client"
import React, { createContext, Dispatch, SetStateAction, useState, ReactNode } from 'react';

import { Book } from '../../backend/src/types';

// Define the shape of the SelectedBook context value
interface SelectedBookContextType {
  selectedBook: Book | null;
  setSelectedBook: Dispatch<SetStateAction<Book | null>>;
}

// Create the SelectedBook context with default values
export const SelectedBookContext = createContext<SelectedBookContextType>({
  selectedBook: null,
  setSelectedBook: () => {},
});

// SelectedBookProvider component
export const SelectedBookProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <SelectedBookContext.Provider value={{ selectedBook, setSelectedBook }}>
      {children}
    </SelectedBookContext.Provider>
  );
};

// Define the shape of the Books context value
interface BookContextType {
  books: Book[];
  setBooks: Dispatch<SetStateAction<Book[]>>;
}

// Create the Books context with default values
export const BookContext = createContext<BookContextType>({
  books: [],
  setBooks: () => {},
});

// BookProvider component
export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);

  return (
    <BookContext.Provider value={{ books, setBooks }}>
      {children}
    </BookContext.Provider>
  );
};
