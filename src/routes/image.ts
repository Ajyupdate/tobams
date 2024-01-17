import { Router } from "express";
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto'
import multer from 'multer'
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const router: Router = Router();


const randomImageName = (bytes = 16) =>
  crypto.randomBytes(bytes).toString("hex");

  const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client([
    {
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
        region: "us-east-1",
      },
      
    }
  ]);
  
  const storage = multer.memoryStorage()
  const upload = multer({storage: storage})

const imageSchema = new mongoose.Schema({
    image: String,
})

const image = mongoose.model("image", imageSchema)
router.get("", (req, res) =>{
    res.send({message: "goeeod"})
})
router.post("", upload.single("image"), async(req, res) => {
    console.log(bucketRegion, bucketName, bucketRegion, accessKey, secretAccessKey)
    
    const buffer = req.file?.buffer
    const imageName = randomImageName()

console.log(buffer)
    if(req.file != undefined){
        const params = {
        Bucket: bucketName,
        Key: imageName,
        Body: buffer,
        ContentType: req.file.mimetype,
      };
      console.log(params)
      const command = new PutObjectCommand(params);
     await s3.send(command);

     const imageData = new image({
        imageUrl: imageName,
     })

     imageData.save()
     .then(() => {
        console.log("Image saved successfully");
        return res.status(200).json({ message: "Image added successfully" });
      })
      .catch((saveError) => {
        console.error("Error saving Image:", saveError);
        return res
          .status(500)
          .json({ message: "Error adding Image to the database" });
      });

    }
    else{
        res.send({message: "file not defined"})
    }

})

export default router