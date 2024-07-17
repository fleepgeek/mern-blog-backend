import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/userRoute";
import articleRoutes from "./routes/articleRoute";
// import { seedCategories } from "./scripts/seeds";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

mongoose
  .connect(process.env.MONGODB_CONNECTION_URI as string)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

// app.get("/", (req: Request, res: Response) => {
//   res.json({ message: "Welcome" });
// });

app.use("/api/my/user", userRoutes);
app.use("/api/article", articleRoutes);

// Call only once to seed categories with some data
// seedCategories();

app.listen(7000, () => {
  console.log("Running on port 7000");
});
