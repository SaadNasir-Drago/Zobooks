// /context/UserLikesContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserLikesContextType {
  userLikes: { [key: number]: boolean | null };
  setUserLikes: React.Dispatch<React.SetStateAction<{ [key: number]: boolean | null }>>;
}

// Create the context
const UserLikesContext = createContext<UserLikesContextType | undefined>(undefined);

// Create a custom hook to use the UserLikesContext
export const useUserLikes = () => {
  const context = useContext(UserLikesContext);
  if (!context) {
    throw new Error('useUserLikes must be used within a UserLikesProvider');
  }
  return context;
};

// Create the provider component
export const UserLikesProvider = ({ children }: { children: ReactNode }) => {
  const [userLikes, setUserLikes] = useState<{ [key: number]: boolean | null }>({});

  return (
    <UserLikesContext.Provider value={{ userLikes, setUserLikes }}>
      {children}
    </UserLikesContext.Provider>
  );
};
