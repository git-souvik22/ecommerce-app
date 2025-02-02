import express from "express";
import "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";

//configure dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//DB connection call
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoute);

// rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`.bgGreen.white);
});
