import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/db";

dotenv.config();
import { upload } from "./utils/image.config";
import { getImage, uploadImage } from "./controllers/image";
const app: Express = express();
const port = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.post("/upload", upload.single('image'), uploadImage)

app.use("/get_image", getImage)
app.use
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log("app listening on port 3001");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });