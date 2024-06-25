import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute";

const app = express();

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

app.use(express.json());
app.use(cors());

// app.get("/", (req: Request, res: Response) => {
//   res.json({ message: "Welcome" });
// });

app.use("/api/my/user", userRoutes);

app.listen(7000, () => {
  console.log("Running on port 7000");
});
