import express from "express";
import routes from "./src/routes/index.js";
import notFoundHandler from "./src/middlewares/notFoundHandler.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import successHandler from "./src/middlewares/successHandler.js";
import cors from "cors";
import { PORT } from "./src/configs/enviroments.js";
import jsonValid from "./src/middlewares/jsonInvalid.js";
import setupSwagger from "./src/configs/swaggerConfig.js";
import { connectDb } from "./src/configs/db.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json());
app.use(successHandler); // Gắn middleware custom res.success

connectDb();

app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:5174"],
		credentials: true,
	})
);

setupSwagger(app);

app.use("/api", routes);

// Middleware xử lý JSON không hợp lệ
app.use(jsonValid);

// Middleware xử lý route không tồn tại
app.use(notFoundHandler);

// Middleware xử lý lỗi chung
app.use(errorHandler);

const server = app.listen(PORT, () => {
	console.log(`Server is running on: http://localhost:${PORT}/api`);
	console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

// Middleware xử lý lỗi không xác định
process.on("unhandledRejection", (error, promise) => {
	console.error(`Error: ${error.message}`);
	server.close(() => process.exit(1));
});
