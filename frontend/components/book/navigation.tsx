"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearch } from "@/context/searchContext";
import { useSort } from "@/context/sortContext";
import { User, ChevronDown, Star } from "lucide-react";
import Image from "next/image";

function Navigation() {
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useSearch();
  const { sortBy, setSortBy } = useSort();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(searchTerm); // Local state for input value

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue); // Update searchTerm after debounce delay
    }, 1700); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler); // Cleanup timeout on component unmount or input change
    };
  }, [inputValue, setSearchTerm]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    setIsLoggedIn(false);
  };

  // New function to handle Zolo button click
  const handleZolo = () => {
    // Navigate to the second_app root
    router.push("/second_app");
  };

  return (
    <div className="sticky flex justify-between flex-wrap items-center mb-0 p-4 px-8">
      <Link href="/">
        <Image
          src="/instabooks-high-resolution-logo-transparent.svg"
          alt="Instabooks Logo"
          width={250}
          height={50}
          className="cursor-pointer"
          style={{ width: 250, height: 50 }}
        />
      </Link>
       {/* Zolo Button (Redirects to second_app) */}
       <Button variant="default" className="bg-green-600" onClick={handleZolo}>
          Zolo
        </Button>
      <div className="flex items-center flex-wrap gap-4">
        {/* Search Input */}
        <Input
          placeholder="Search books..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-64"
        />

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              {sortBy === "trending"
                ? "Trending"
                : sortBy === "recent"
                ? "Recent"
                : "Sort By"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("trending")}>
              Trending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("recent")}>
              Recent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Register Button */}
        <Link href="/createUser">
          <Button variant="default" className="bg-blue-600">
            Register
          </Button>
        </Link>

       

        {isLoggedIn ? (
          <>
            {/* Add Book Button */}
            <Link href="/addBook">
              <Button variant="default" className="bg-purple-600">
                Add Book
              </Button>
            </Link>

            {/* Favorites Button (yellow) */}
            <Link href="/favorites">
              <Button
                variant="default"
                className="bg-yellow-500 text-black flex items-center gap-2"
              >
                <Star className="h-5 w-5" />
                Favorites
              </Button>
            </Link>

            {/* Profile Button */}
            <Link href="/profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Logout Button */}
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          /* Login Button */
          <Link href="/login">
            <Button variant="default" onClick={handleLogin}>
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navigation;
