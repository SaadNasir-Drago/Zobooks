"use client";
import React, { useEffect, useState } from "react";
import { Genre } from "../../../backend/src/types";
import { useGenre } from "@/context/genreContext";

function GenreList() {
  const { selectedGenre, setSelectedGenre } = useGenre();
  const [genres, setGenres] = useState<Genre[]>([
    { genre_id: 0, genre_name: "All" },
  ]);

  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch(
        `https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/genres`
      );

      if (response.ok) {
        const data = await response.json();
        // Set genres state to include the "All" genre along with fetched genres
        setGenres([{ genre_id: 0, genre_name: "All" }, ...data]);
      } else {
        console.error("Failed to fetch genres");
      }
    }
    fetchGenres();
  }, []);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre.genre_id}
            className={`px-4 py-2 text-sm rounded-full border-gray-300 border transition-colors ${
              selectedGenre?.genre_id === genre.genre_id
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-secondary"
            }`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre.genre_name === "All" ? "All" : genre.genre_name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GenreList;
