// GenreContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Genre } from './../../backend/src/types'; // Adjust the import based on your structure

export interface GenreContextType {
  selectedGenre: Genre | {genre_id: 0, genre_name: "All"};
  setSelectedGenre: (genre: Genre | {genre_id: 0, genre_name: "All"}) => void;
}

const GenreContext = createContext<GenreContextType | undefined>(undefined);

export const GenreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGenre, setSelectedGenre] = useState<Genre | {genre_id: 0, genre_name: "All"}>({genre_id: 0, genre_name: "All"});

  return (
    <GenreContext.Provider value={{ selectedGenre, setSelectedGenre }}>
      {children}
    </GenreContext.Provider>
  );
};

export const useGenre = (): GenreContextType => {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error('useGenre must be used within a GenreProvider');
  }
  return context;
};
