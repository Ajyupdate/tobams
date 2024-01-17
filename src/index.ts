import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./database/db";
import imageRoute from "./routes/image"
dotenv.config();
import { upload } from "./utils/image.config";
import { getImage, uploadImage } from "./controllers/image";
const app: Express = express();
const port = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
app.get("/", (req: Request, res: Response) => {
  console.log(bucketName, bucketRegion, accessKey, secretAccessKey)
  res.send("Express + TypeScript Server");
});

app.post("/i", upload.single('image'), uploadImage)
app.get("/i", getImage)
app.use("/image", imageRoute)
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log("app listening on port 3001");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });