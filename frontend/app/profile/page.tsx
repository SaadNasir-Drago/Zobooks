"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/book/navigation";
import { Book, Building, Calendar, User } from "lucide-react";
import { Book as BookType } from "../../../backend/src/types";
import Link from "next/link";
import { SelectedBookContext } from "@/context/bookContext";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export default function ProfilePage() {
  const placeholder = "https://placehold.jp/150x150.png";

  const [user, setUser] = useState<User | null>({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [profileBooks, setProfileBooks] = useState<BookType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { setSelectedBook } = useContext(SelectedBookContext);

  useEffect(() => {
    fetchUserData();
    fetchBooksById();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/profileUser",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch user data");
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchBooksById = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/profileBooks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch books");
      else if (response.status === 401) {
        toast({
          title: "Error",
          description: "Unauthorized",
          variant: "destructive",
        });
      }
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
  const handleUpdateBook = async (book: BookType) => {
    setSelectedBook(book);
  };

  const handleDeleteBook = async (book_id: number) => {
    setBookToDelete(book_id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteBook = async () => {
    if (bookToDelete) {
      try {
        const response = await fetch(
          `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/book/${bookToDelete}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete book");
        }
        setProfileBooks(
          profileBooks.filter((book) => book.book_id !== bookToDelete)
        );
        toast({
          title: "Success",
          description: "Book deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete book. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setBookToDelete(null);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        User not found
      </div>
    );

  const getImageSrc = (cover_img: string) => {
    if (!cover_img) return placeholder;
    if (cover_img.startsWith("http://") || cover_img.startsWith("https://")) {
      return cover_img;
    }
    return `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/uploads/${cover_img}`;
  };

  return (
    <div className="container mx-auto px-8 py-3">
      <Navigation />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" value={user.first_name} readOnly />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" value={user.last_name} readOnly />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} readOnly />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={user.password}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {currentBooks.map((book) => (
        <Card key={book.book_id} className="mb-4">
          <CardHeader></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/6">
                <Image
                  src={getImageSrc(book.cover_img)}
                  alt={`Cover of ${book.title}`}
                  width={200}
                  height={300}
                  className="object-cover rounded-md"
                  style={{ width: "200px", height: "300px" }}
                />
              </div>
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
                <div className="flex items-center text-gray-600 mb-4 text-xl">
                  <User className="mr-2 h-5 w-5 text-lg" />
                  <span>{book.author}</span>
                </div>
                <p className="text-gray-700 mb-6 text-base leading-relaxed ">
                  {book.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6 ">
                  <div className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-gray-500" />
                    <span className="text-lg">Publisher: {book.publisher}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                    <span className="text-lg">
                      Published: {book.publish_date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Book className="mr-2 h-5 w-5 text-gray-500" />
                    <span className="text-lg">Pages: {book.pages}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={"/updateBook"}>
              <Button onClick={() => handleUpdateBook(book)}>Update</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => handleDeleteBook(book.book_id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteBook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
