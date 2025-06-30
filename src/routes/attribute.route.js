import { Router } from "express";
import {
  getAttributes,
  getAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
} from "../controllers/AttributeController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const attributeRouter = Router();

attributeRouter.get("/", getAttributes);
attributeRouter.get("/:id", getAttributeById);

//  Chỉ admin mới được phép các thao tác dưới
attributeRouter.post("/", authenticate, isAdmin, createAttribute);
attributeRouter.patch("/:id", authenticate, isAdmin, updateAttribute);
attributeRouter.delete("/:id", authenticate, isAdmin, deleteAttribute);

export default attributeRouter;
