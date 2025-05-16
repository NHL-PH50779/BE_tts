import { Router } from "express";
import productRouter from "./product.route.js";
import brandRouter from "./brand.route.js";         // ✅ Thêm dòng này
import categoryRouter from "./category.route.js";   // ✅ Nếu có cả categories

const routes = Router();

routes.use("/products", productRouter);
routes.use("/brands", brandRouter);                 // ✅ Thêm dòng này
routes.use("/categories", categoryRouter);          // ✅ Nếu có categories

export default routes;
