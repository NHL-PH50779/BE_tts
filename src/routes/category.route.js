import express from "express";
import CategoryController from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);
router.patch("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);
router.delete("/soft-delete/:id", CategoryController.softDelete);
router.patch("/restore/:id", CategoryController.restore);

export default router;
