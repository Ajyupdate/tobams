import multer from 'multer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv'
dotenv.config()

const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// Set up multer to handle file uploads
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type.'));
      }
    },
  });

//Amazon S3 client
export const s3 = new AWS.S3({
    accessKeyId: accessKey!,
    secretAccessKey: secretAccessKey!,
  });
