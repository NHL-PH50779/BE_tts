import { Router } from "express";
import productRouter from "./product.route.js";
import brandRouter from "./brand.route.js";
import categoryRouter from "./category.route.js";
import authRouter from "./auth.route.js";
import cartRouter from "./Cart.route.js"; 
import variantRouter from "./variant.route.js"; // Import variant routes

const routes = Router();

routes.use("/products", productRouter);
routes.use("/brands", brandRouter);
routes.use("/categories", categoryRouter);
routes.use("/auth", authRouter);
routes.use("/cart", cartRouter); 
routes.use("/variant", variantRouter); // Use variant routes

export default routes;