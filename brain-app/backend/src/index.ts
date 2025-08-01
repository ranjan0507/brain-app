import './utils/config.js'
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from './routes/category.route.js'
import contentRoutes from "./routes/content.route.js"
import linkRoutes from "./routes/link.route.js"
import { connectDB } from './config/db.js';
import { redirectByHash } from "./controllers/link.controller.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/content" , contentRoutes) ;

app.use("/api/links" , linkRoutes) ;

app.get("/link/:hash",redirectByHash) ;

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
