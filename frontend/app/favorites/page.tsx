"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/book/navigation";
import { Book as BookType } from "../../../backend/src/types";
import { User } from "lucide-react";

export default function FavoriteBooks() {
  const placeholder = "https://placehold.jp/150x150.png";

  const [profileBooks, setProfileBooks] = useState<BookType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavoriteBooks();
  }, []);

  const fetchFavoriteBooks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/profileFavorites",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch books");

      const booksData = await response.json();
      setProfileBooks(booksData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load books. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = profileBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(profileBooks.length / booksPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Removed the handleUpdateBook and "Update" button/link

  const getImageSrc = (cover_img: string) => {
    if (!cover_img) return placeholder;
    if (cover_img.startsWith("http://") || cover_img.startsWith("https://")) {
      return cover_img;
    }
    return `https://your-backend-api.com/uploads/${cover_img}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-3">
      {/* Top navigation (if any) */}
      <Navigation />

      {/* Favorite Books List */}
      {currentBooks.map((book) => (
        <Card key={book.book_id} className="mb-4 shadow-sm">
          {/* Card Header */}
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{book.title}</CardTitle>
          </CardHeader>

          {/* Card Content */}
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/6">
                <Image
                  src={getImageSrc(book.cover_img)}
                  alt={`Cover of ${book.title}`}
                  width={200}
                  height={300}
                  className="object-cover rounded-md"
                />
              </div>
              <div className="md:w-2/3">
                <div className="flex items-center text-gray-600 mb-4 text-xl">
                  <User className="mr-2 h-5 w-5" />
                  <span>{book.author}</span>
                </div>
                <p className="text-gray-700">{book.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
