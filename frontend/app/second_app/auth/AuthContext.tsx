"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60, // 30 days
  secure: process.env.NODE_ENV === "production",
  sameSite: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved token and user data in cookies on mount
    const savedToken = getCookie("accessToken");
    const savedUser = getCookie("user");
    if (savedToken && savedUser) {
      setAccessToken(savedToken as string);
      setUser(JSON.parse(savedUser as string));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        "https://zolo-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setUser(data.user);
      setAccessToken(data.accessToken);

      // Store in cookies
      setCookie("accessToken", data.accessToken, COOKIE_OPTIONS);
      setCookie("user", JSON.stringify(data.user), COOKIE_OPTIONS);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    deleteCookie("accessToken");
    deleteCookie("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
