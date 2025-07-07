import { Router } from "express";
import {
  createComment,
  getCommentsByProduct,
  deleteComment,
} from "../controllers/CommentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const commentRouter = Router();

commentRouter.post("/", authenticate, createComment);
commentRouter.get("/:productId", getCommentsByProduct);
commentRouter.delete("/:id", authenticate, deleteComment);

export default commentRouter;
