import { Router } from "express";
import productRouter from "./product.route.js";
import brandRouter from "./brand.route.js";
import categoryRouter from "./category.route.js";
import authRouter from "./auth.route.js";
import cartRouter from "./Cart.route.js"; 
import variantRouter from "./variant.route.js";
import attributeRouter from "./attribute.route.js";
import attributeValueRoutes from "./attributeValue.route.js";
import orderRouter from "./order.route.js";
import checkoutRouter from "./checkoutOrder.route.js";
import dotenv from "dotenv";
dotenv.config();
const routes = Router();

routes.use("/products", productRouter);
routes.use("/brands", brandRouter);
routes.use("/categories", categoryRouter);
routes.use("/auth", authRouter);
routes.use("/cart", cartRouter); 
routes.use("/variant", variantRouter);
routes.use("/attributes", attributeRouter);
routes.use("/attributevalues", attributeValueRoutes);
routes.use("/orders", orderRouter);
routes.use("/checkout", checkoutRouter);

export default routes;