import { Router } from "express";
import productRouter from "./product.route.js";
import brandRouter from "./brand.route.js";
import categoryRouter from "./category.route.js";
import authRouter from "./auth.route.js"; // ✅ THÊM DÒNG NÀY

const routes = Router();

routes.use("/products", productRouter);
routes.use("/brands", brandRouter);
routes.use("/categories", categoryRouter);
routes.use("/auth", authRouter); // ✅ THÊM DÒNG NÀY

export default routes;
