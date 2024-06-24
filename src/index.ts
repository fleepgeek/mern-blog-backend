import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome" });
});

app.listen(7000, () => {
  console.log("Running on port 7000");
});
