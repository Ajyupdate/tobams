"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./database/db");
dotenv_1.default.config();
const image_config_1 = require("./utils/image.config");
const image_1 = require("./controllers/image");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.post("/upload", image_config_1.upload.single('image'), image_1.uploadImage);
app.use("/get_image", image_1.getImage);
app.use;
(0, db_1.connectToDatabase)()
    .then(() => {
    app.listen(port, () => {
        console.log("app listening on port 3001");
    });
})
    .catch((err) => {
    console.error("Error connecting to the database:", err);
});
