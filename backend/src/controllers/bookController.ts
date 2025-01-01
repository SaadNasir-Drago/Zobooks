import { Request, Response } from "express";
import * as bookModel from "../models/bookModel";
// import { getElasticGenres } from "../elasticmodels/elasticBook";
// import { esClient } from "../server";
// import { getBooks as elasticBook } from "../config/elasticSearch";
export const getBooks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 16;
  const search = (req.query.search as string) || "";
  
  const offset = (page - 1) * limit;
  const sort = req.query.sort as string;
  const genre = parseInt(req.query.genre as string);
  
  try {
    
    // const  {books, totalBooks} = await getElasticBook( limit, offset, search, sort, genre);

    // res.json({
    //   books,
    //   totalPages,
    // });
  
    const {books, totalBooks} = await bookModel.getBooks(
      limit,
      offset,
      search,
      sort,
      genre
    );

    const totalPages = Math.ceil(totalBooks / limit);

    res.json({
      books,
      totalPages,
    });
    
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
  
    const imageFile = req.file; // Get the uploaded file from multer

    // If an image was uploaded, store its filename in bookData
    if (imageFile) {
      req.body.cover_img = imageFile.filename; // Save the image filename to bookData
    }

    await bookModel.createBook(req.body);
    res.status(201).json({message: "Book added successfully"});
  } catch (error) {
    res.status(500).send("Error adding books");
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookModel.updateBook(parseInt(id, 10), req.body);
    res.status(200).json({message: "Book updated successfully"});
  } catch (error) {
    res.status(500).send("Error updating books");
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    await bookModel.deleteBook(parseInt(id, 10));
    res.status(200).send("Book deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting books");
  }
};

export const likeDislikeBook = async (req: Request, res: Response) => {
  try {
    const result = await bookModel.likeDislikeBook(req.body);

    if (result.success) {
      // If successful, return 200 OK instead of 201 Created, 
      // as we're not always creating a new resource
      res.status(200).json({ 
        success: result.success, 
        message: result.message 
      });
    } else {
      // If not successful, it's not necessarily a bad request,
      // so we'll use 200 OK here as well
      res.status(200).json({ 
        success: result.success, 
        message: result.message 
      });
    }
  } catch (error) {
    console.error("Error in likeDislikeBook controller:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request"
    });
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await bookModel.getGenres();

    // const genres = await getElasticGenres();

    if (genres) {
      res.status(200).json(genres);
    } else {
      res.status(404).send("Genres not found");
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).send("Error fetching genres");
  }
};


export const favoriteBook = async (req: Request, res: Response) => {
  try {
    const result = await bookModel.favoriteBook(req.body);

    if (result.success) {
      res.status(200).json({ 
        success: result.success, 
        message: result.message 
      });
    } else {
      res.status(200).json({ 
        success: result.success, 
        message: result.message 
      });
    }
  } catch (error) {
    console.error("Error in favoriteBook controller:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request"
    });
  }
};