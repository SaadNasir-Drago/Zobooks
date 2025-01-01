import { Router } from "express";
const router = Router();
import { verifyUser } from "../controllers/authController";

router.post('/user', verifyUser);

export default router;