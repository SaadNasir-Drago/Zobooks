"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { SelectedBookContext } from "@/context/bookContext";

export default function UpdateBook() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState({
    book_id: 0,
    title: "",
    pages: 0,
    publish_date: "",
    cover_img: "",
    author: "",
    description: "",
    publisher: "",
    genres: [] as string[],
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { selectedBook } = useContext(SelectedBookContext);
  const placeholder = "https://placehold.jp/150x150.png";
  const genres = [
    "Drama",
    "Horror",
    "Thriller",
    "Comedy",
    "Action",
    "Animation",
    "Crime",
    "Romance",
    "Fantasy",
    "Sci-Fi",
    "Documentary",
    "Mystery",
    "Musical",
    "Children",
    "IMAX",
    "Adventure",
    "Western",
    "War",
    "Film-Noir",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: name === "pages" ? parseInt(value, 10) : value,
    }));
  };
  useEffect(() => {
    if (selectedBook) {
      setBookData({
        ...selectedBook,
        pages: selectedBook.pages || 0,
        publish_date: selectedBook.publish_date || "",
        author: selectedBook.author || "", // Default to empty string
        description: selectedBook.description || "", // Default to empty string
        publisher: selectedBook.publisher || "", // Default to empty string
        genres: selectedBook.genres || [], // Default to empty array for genres // If pages is null, set it to 0
      });
      setPreviewUrl(selectedBook.cover_img || null);
    }
  }, [selectedBook]);

  const handleGenreChange = (genre: string) => {
    setBookData((prev) => {
      const updatedGenres = prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres: updatedGenres };
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setBookData((prev) => ({
        ...prev,
        cover_img: file.name, // Store the filename, not the object URL
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(bookData).forEach(([key, value]) => {
        if (key === "genres") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "pages") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      });

      if (uploadedImage) {
        formData.append("cover_img", uploadedImage);
      }

      const response = await fetch(
        `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/updateBook/${bookData.book_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        await response.json();
        toast({
          title: "Success",
          description: "Book updated successfully",
        });
        router.push("/profile"); // Redirect to books list page
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImageSrc = (cover_img: string) => {
    if (!cover_img) return placeholder;
    if (cover_img.startsWith("http://") || cover_img.startsWith("https://")) {
      return cover_img;
    }
    return `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/uploads/${cover_img}`;
  };
  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center h-64 space-y-4">
      <div className="relative">
        {/* <div className="absolute inset-0 rounded-full border-4 border-primary opacity-50 animate-pulse"></div> */}
        <BookOpenIcon
          className="relative text-primary animate-bounce"
          style={{ width: "96px", height: "96px" }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold text-center">Update Book</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={bookData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  value={bookData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pages">Number of Pages</Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  min="1"
                  value={bookData.pages}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="publish_date">Publish Date</Label>
              <Input
                id="publish_date"
                name="publish_date"
                type="date"
                onChange={handleChange}
                value={bookData.publish_date}
                required
              />
            </div>
            <div>
              <Label>Upload Cover Image</Label>
              <div
                {...getRootProps()}
                className={`mt-2 border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                  isDragActive ? "border-primary" : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <p>
                    Drag &apos;n&apos; drop an image here, or click to select
                    one
                  </p>
                )}
              </div>
            </div>
            {previewUrl && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 relative h-48 w-full">
                  <Image
                    src={getImageSrc(bookData.cover_img || previewUrl)}
                    alt="Cover preview"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            )}
            <div>
              <Label>Genres</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={bookData.genres.includes(genre)}
                      onCheckedChange={() => handleGenreChange(genre)}
                    />
                    <label
                      htmlFor={genre}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={bookData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                type="text"
                value={bookData.publisher}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Update Book
            </Button>
          </form>
          <Button
            variant="link"
            className="mt-4 w-full"
            onClick={() => router.push("/profile")}
          >
            Back to Profile Page
          </Button>
        </div>
      )}
    </div>
  );
}