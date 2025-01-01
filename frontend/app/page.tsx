"use client"
import Navigation from "@/components/book/navigation";
import BookList from "@/components/book/bookList";
import GenreList from "@/components/book/genreList";
export default function Home() {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-7 py-3">
        <GenreList />
        <BookList />
      </div>
    </>
  );
}
