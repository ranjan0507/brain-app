import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route";
import categoryRoutes from './routes/category.route'
import contentRoutes from "./routes/content.route"
import linkRoutes from "./routes/link.route"
import { redirectByHash } from "./controllers/link.controller";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/category", categoryRoutes);

app.use("/api/content" , contentRoutes) ;

app.use("/api/links" , linkRoutes) ;

app.get("/link/:hash",redirectByHash) ;

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
