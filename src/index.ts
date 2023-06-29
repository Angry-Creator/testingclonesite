import express, { Express, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userModel from './model/User';

dotenv.config();

const app: Express = express();
const PORT: number = 8000 || process.env.PORT;
app.use(express.static("public"));

//setting multer
//First set the storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function): void => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function): void => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

//Next is to create a multer instance with the defined storage configuration
const upload = multer({
    storage: storage
});

//Check a function that checks the file size of the document
function checkFileSize(req: Request, res: Response, next: NextFunction): void {
    const fileSizeLimit = 2 * 1024 * 1024; // 2MB
    if (req.headers['content-length']) {
        const contentLength = parseInt(req.headers['content-length']);
        if (contentLength > fileSizeLimit) {
            res.status(400).send('The file size is greater than 2MB');
        } else {
            next()
        }
    }
};

//Define express route and use the multer middleware to handle the file upload
app.post('/upload', checkFileSize, upload.single('file'), (req: Request, res: Response) => {
    res.send('File saved successfully!');
});

//Handling saving content to the database
async function saveUser(data: Promise<Record<string, string>>): Promise<void> {
    try {
        const myUser = new userModel(data);
        await myUser.save();
        console.log('Content saved successfully!');
    } catch (error) {
        console.error('Error saving content:', error);
    } finally {
        mongoose.disconnect();
    }
};

//Handling database
async function connectToDatabase(data: Record<string, string>): Promise<void> {
    try {
        const DB_USER: string | undefined = process.env.DB_USER;
        const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;
        const DB_DATABASE: string | undefined = process.env.DB_DATABASE;
        if (typeof (DB_PASSWORD) === "string" && typeof (DB_PASSWORD) === "string" && typeof (DB_DATABASE) === "string") {
            await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@mydb.jio0eir.mongodb.net/?retryWrites=true&w=majority${DB_DATABASE}`);

        }
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

//Running the index page
app.get("/", (req: Request, res: Response) => {
    res.render("index.html");
});

app.listen(PORT, () => {
    console.log(`Listening at PORT ${PORT}`);
});
