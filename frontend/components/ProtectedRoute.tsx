"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const isAuth = !!(token && user);
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      const currentPath = window.location.pathname;
      // Force a full page reload to ensure the URL parameters are properly handled
      window.location.href = `/?showAuth=true&redirect=${encodeURIComponent(currentPath)}`;
    }
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
