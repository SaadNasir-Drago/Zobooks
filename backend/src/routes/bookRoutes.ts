import { Router } from "express";
const router = Router();
import * as bookController from '../controllers/bookController'
import { cookieJwtAuth } from "../middlewares/cookieJwtAuth";
// import * as elasticController from '../controllers/elasticController'
import { uploadSingle } from "../middlewares/localImageUpload";

router.get('/books', bookController.getBooks);
router.post('/addbook', uploadSingle, cookieJwtAuth,  bookController.createBook);
router.post('/likeDislike', cookieJwtAuth, bookController.likeDislikeBook)
router.get('/genres', bookController.getGenres)
router.put('/updateBook/:id', uploadSingle, bookController.updateBook);
router.delete('/book/:id', bookController.deleteBook);
router.post('/favorite', cookieJwtAuth, bookController.favoriteBook);


export default router;