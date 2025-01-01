"use client";

import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookContext, SelectedBookContext } from "@/context/bookContext";
import Navigation from "@/components/book/navigation";
import {
  Book,
  Calendar,
  User,
  Building,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

export default function BookDetails() {
  const placeholder = "https://placehold.jp/150x150.png";

  const { selectedBook, setSelectedBook } = useContext(SelectedBookContext);
  const { setBooks } = useContext(BookContext);
  const [userLikes, setUserLikes] = useState<{
    [key: number]: boolean | null;
  }>();

  if (!selectedBook) {
    return <div>No book selected</div>;
  }
  const handleLikeDislike = async (book_id: number, isLike: boolean) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Authentication Required",
        description: `Please log in to ${isLike ? "like" : "dislike"} books.`,
        variant: "destructive",
      });
      return;
    }

    const currentUserLikeStatus = userLikes?.[book_id];
    const oppositeAction = isLike ? false : true;

    try {
      if (currentUserLikeStatus === oppositeAction) {
        await fetch(
          `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/likeDislike`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              book_id,
              liked: oppositeAction,
            }),
          }
        );

        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.book_id === book_id
              ? {
                  ...book,
                  likes: oppositeAction
                    ? Math.max((book.likes || 0) - 1, 0)
                    : book.likes,
                  dislikes: !oppositeAction
                    ? Math.max((book.dislikes || 0) - 1, 0)
                    : book.dislikes,
                }
              : book
          )
        );
      }

      const response = await fetch(
        `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/likeDislike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            book_id,
            liked: isLike,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUserLikes((prev) => ({
          ...prev,
          [book_id]: result.message.includes("removed") ? null : isLike,
        }));

        setBooks((prevBooks) => {
          const updatedBooks = prevBooks.map((book) =>
            book.book_id === book_id
              ? {
                  ...book,
                  likes: isLike
                    ? result.message === "Book liked successfully"
                      ? (book.likes || 0) + 1
                      : result.message === "Like removed"
                      ? Math.max((book.likes || 0) - 1, 0)
                      : book.likes
                    : book.likes,
                  dislikes: !isLike
                    ? result.message === "Book disliked successfully"
                      ? (book.dislikes || 0) + 1
                      : result.message === "Dislike removed"
                      ? Math.max((book.dislikes || 0) - 1, 0)
                      : book.dislikes
                    : book.dislikes,
                }
              : book
          );

          const updatedSelectedBook = updatedBooks.find(
            (b) => b.book_id === book_id
          );
          if (updatedSelectedBook) setSelectedBook(updatedSelectedBook);

          return updatedBooks;
        });

        toast({
          title: result.success ? "Success" : "Info",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || `Error processing your request`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Error in handleLikeDislike:`, error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getImageSrc = (cover_img: string) => {
    if (!cover_img) return placeholder;
    if (cover_img.startsWith("http://") || cover_img.startsWith("https://")) {
      return cover_img;
    }
    return `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/uploads/${cover_img}`;
  };

  return (
    <div className="container mx-auto px-8 py-7">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gray-200">
                <Image
                  src={getImageSrc(selectedBook.cover_img)}
                  alt={selectedBook.title}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <h1 className="text-4xl font-bold mb-4">
                  {selectedBook.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-6 text-xl">
                  <User className="mr-3 h-6 w-6" />
                  <span>{selectedBook.author}</span>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  {selectedBook.description}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center">
                    <Building className="mr-3 h-6 w-6 text-gray-500" />
                    <span className="text-base">
                      Publisher: {selectedBook.publisher}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-3 h-6 w-6 text-gray-500" />
                    <span className="text-base">
                      Published: {selectedBook.publish_date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Book className="mr-3 h-6 w-6 text-gray-500" />
                    <span className="text-base">
                      Pages: {selectedBook.pages}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <CardFooter className="flex p-2">
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeDislike(selectedBook.book_id, true);
                        }}
                      >
                        <ThumbsUpIcon className="w-6 h-6 text-green-500" />
                        <span className="sr-only">Like</span>
                      </Button>
                      <div className="text-gray-500">{selectedBook.likes}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeDislike(selectedBook.book_id, false);
                        }}
                      >
                        <ThumbsDownIcon className="w-6 h-6 text-red-500" />
                        <span className="sr-only">Dislike</span>
                      </Button>
                      <div className="text-gray-500">
                        {selectedBook.dislikes}
                      </div>
                    </div>
                  </CardFooter>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
