import dotenv from 'dotenv';
import {Request, Response} from 'express';
dotenv.config();
import {s3} from '../utils/image.config'
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    key: String,
})
const image = mongoose.model("image", imageSchema)


export async function uploadImage (req: Request, res: Response) {
    const file: any = req.file;
    if (!file) {
        res.status(400).json({ error: 'Please select a file' });
        return;
    }
    
    try {
        // Save the image to S3
        const filename = `${Date.now()}-${file.originalname}`;
        const fileStream = file.buffer;
        const contentType = file.mimetype;
        const uploadParams = {
        Bucket: "moskol"!,
        Key: filename,
        Body: fileStream,
        ContentType: contentType,
        };

        const result: any = await s3.upload(uploadParams).promise();
        
        // Save the key to MongoDB
        const newImage = new image({ key: result.Key });
        await newImage.save();
    
        res.json({
            success: true, 
            message: "image uploaded successfully", 
            key: result.Key,
            url: result.Location
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Error uploading image', 
            error: error.message
        });
    };
};


export async function getImage (req: Request, res: Response) {
     const imageKey = req.body.filename;


     if (imageKey === undefined) {
        // Return an error response and stop further execution
        return res.status(400).json({
            success: false,
            message: "Filename not passed in the request. Check the documentation for available image names",
        });
    }
     
     
    try {
        // Check if the imageKey is in the database
        const existingImage = await image.findOne({ key: imageKey });
        if (!existingImage) {
           
            return res.status(404).json({
                success: false,
                message: "Image not found in the database",
            });
        }



        // Retrieve the image from S3
        const downloadParams = {
        Bucket: "moskol"!,
        Key: imageKey,
        };
        
        const objectData = await s3.getObject(downloadParams).promise();
        const imageBuffer = objectData.Body;

        // Set the Content-Type header to the image's MIME type
        const contentType = objectData.ContentType;
        res.set('Content-Type', contentType);

       
        // Return the image
        res.send(imageBuffer);
       
        
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Unable to get image',
            error: error.message
        });
    };
};