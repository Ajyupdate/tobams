import dotenv from 'dotenv';
import {Request, Response} from 'express';
dotenv.config();
import {s3} from '../utils/image.config'
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
        console.log(result)
        // await saveSellerImageUrlAndKey(req.seller.id, result.Key, result.Location)
        res.json({
            success: true, 
            message: "image uploaded", 
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
    // const imageKey = req.params.filename;
    const imageKey = "1705517068604-day 1.png"
    try {
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
        console.log(imageBuffer)
    } catch (error: any) {
        return res.status(500).json({ 
            success: false, 
            message: 'Unable to get image',
            error: error.message
        });
    };
};