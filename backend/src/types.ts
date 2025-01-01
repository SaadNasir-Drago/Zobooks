//create a separate folder for types if in surpasses more than 5 entries

export type Book = {
  book_id: number;
  bookId?: string;
  title: string ;
  author: string | null;
  description: string | null;
  pages: number | null;
  publish_date: string | null;
  cover_img: string ;
  publisher: string | null;
  genres?: string[] | null;
  likes?: number;
  dislikes?: number;
  created_at?: Date;
  user_id?: number;
  favoritesCount?: number; 
};

export type Genre = {
  genre_id: number;
  genre_name: string | null;
};

export type GenreBook = {
  id?: number;
  genre_id: number;
  book_id: number;
};

export type Like = {
  like_id?: number;
  liked: boolean;
  user_id?: number; // Foreign key to User
  book_id?: number; // Foreign key to Book
};

export type User = {
  user_id: number ;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  role: string | null;
  created_at?: Date;
};

export type jsonBook = {
  bookId: string;
  title: string | null;
  series?: string; // Optional property (indicated by the question mark)
  rating: string | null; // Can be represented as a string for simplicity
  language: string;
  bookFormat: string;
  pages: string; // Can be represented as a string for simplicity
  publishDate: string;
  firstPublishDate?: string; // Optional property
  numRatings: string; // Can be represented as a string for simplicity
  likedPercent: string; // Can be represented as a string for simplicity
  coverImg: string;
  price: string; // Can be represented as a string for simplicity
  author: string;
  description: string;
  genre: string; // Consider using an array of strings if genre can have multiple values
  publisher: string;
}