import express from "express";
import BrandController from "../controllers/BrandController.js";


const router = express.Router();

router.get("/", BrandController.getAll);
router.get("/:id", BrandController.getById);
router.post("/", BrandController.create);
router.patch("/:id", BrandController.update);
router.delete("/:id", BrandController.delete);
router.delete("/soft-delete/:id", BrandController.softDelete);
router.patch("/restore/:id", BrandController.restore);

export default router;
