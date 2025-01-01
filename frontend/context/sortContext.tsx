import React, { createContext, useContext, useState, ReactNode } from "react";

interface SortContextType {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export const SortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sortBy, setSortBy] = useState(""); // Default sort

  return (
    <SortContext.Provider value={{ sortBy, setSortBy }}>
      {children}
    </SortContext.Provider>
  );
};

export const useSort = () => {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSort must be used within a SortProvider");
  }
  return context;
};
