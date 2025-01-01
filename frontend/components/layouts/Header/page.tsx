"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthModal from "@/components/common/Modal/AuthModal";
import Button from "@/components/common/Button/page";
import Cookies from "js-cookie";
import axios from "axios";
import { useSearchParams, usePathname } from "next/navigation";

const Header: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Check login status
    const hasToken = !!Cookies.get("token");
    setLoggedIn(hasToken);

    // Check for showAuth parameter
    const showAuth = searchParams.get("showAuth");
    if (showAuth === "true" && !hasToken) {
      setShowAuthModal(true);
    }
  }, [searchParams, pathname]); // Added pathname as dependency

  const handleSignOut = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    delete axios.defaults.headers.common["Authorization"];
    setLoggedIn(false);
    // Clear URL parameters after signing out
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleAuthClick = () => {
    if (loggedIn) {
      handleSignOut();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
    setLoggedIn(!!Cookies.get("token"));
    // Clear URL parameters when closing modal without logging in
    if (!Cookies.get("token")) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  if (loggedIn === null) {
    return null;
  }

  return (
    <>
      <nav className="w-full bg-white px-4 py-3 border-b">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          {/* Left side (Buy, Rent, Sell, etc.) */}
          <div className="flex space-x-6">
            <Link href="/second_app/buy" className="text-gray-700 hover:text-gray-900">
              Buy
            </Link>
            <Link href="/second_app/rent" className="text-gray-700 hover:text-gray-900">
              Rent
            </Link>
            <Link href="/second_app/create-listing" className="text-gray-700 hover:text-gray-900">
              Sell
            </Link>
            <Link href="/second_app/properties" className="text-gray-700 hover:text-gray-900">
              Manage Properties
            </Link>
          </div>

          {/* Center (Logo) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/second_app/">
              <img
                src="/uploads/Logo/zolo-high-resolution-logo-transparent.png"
                alt="Zolo Logo"
                className="h-12"
              />
            </Link>
          </div>

          {/* Right side (Sign In/Out, Instabooks) */}
          <div className="flex space-x-6">
            {/* Instabooks Button (redirects to /) */}
            <Link href="/">
              <Button variant="default" className="bg-blue-600 text-white">
                Instabooks
              </Button>
            </Link>

            {/* Sign In/Out Button */}
            <Button
              variant={loggedIn ? "primary" : "outline"}
              onClick={handleAuthClick}
              className={loggedIn ? "text-white bg-red-600 border-red-600" : ""}
            >
              {loggedIn ? "Sign Out" : "Sign In"}
            </Button>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={handleModalClose} />
    </>
  );
};

export default Header;
