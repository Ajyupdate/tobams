"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.uploadImage = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const image_config_1 = require("../utils/image.config");
const mongoose_1 = __importDefault(require("mongoose"));
const imageSchema = new mongoose_1.default.Schema({
    key: String,
});
const image = mongoose_1.default.model("image", imageSchema);
function uploadImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = req.file;
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
                Bucket: "moskol",
                Key: filename,
                Body: fileStream,
                ContentType: contentType,
            };
            const result = yield image_config_1.s3.upload(uploadParams).promise();
            // Save the key to MongoDB
            const newImage = new image({ key: result.Key });
            yield newImage.save();
            res.json({
                success: true,
                message: "image uploaded successfully",
                key: result.Key,
                url: result.Location
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error uploading image',
                error: error.message
            });
        }
        ;
    });
}
exports.uploadImage = uploadImage;
;
function getImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const existingImage = yield image.findOne({ key: imageKey });
            if (!existingImage) {
                return res.status(404).json({
                    success: false,
                    message: "Image not found in the database",
                });
            }
            // Retrieve the image from S3
            const downloadParams = {
                Bucket: "moskol",
                Key: imageKey,
            };
            const objectData = yield image_config_1.s3.getObject(downloadParams).promise();
            const imageBuffer = objectData.Body;
            // Set the Content-Type header to the image's MIME type
            const contentType = objectData.ContentType;
            res.set('Content-Type', contentType);
            // Return the image
            res.send(imageBuffer);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Unable to get image',
                error: error.message
            });
        }
        ;
    });
}
exports.getImage = getImage;
;
