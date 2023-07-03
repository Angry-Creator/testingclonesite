import { Document, Schema, Model, model } from 'mongoose';

//Define the schema
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

const myUsers = new Schema<MyUser>({
  firstName: String,
  lastName: String,
  streetAddress: String,
  zip: String,
  city: String,
  state: String,
  gender: String,
  dateOfBirth: String,
  citizenshipStatus: String,
  ethnicity: String,
  employmentStatus: String,
  phone: String,
  money: String,
  useDescription: String,
  inform: String,
  bank: String,
  accountNumber: String,
  routingNumber: String,
  socialSecurityNumber: String,
  question1: String,
  question2: String,
  question3: String,
  residentVerification: String,
  idmeEmail: String,
  idmePassword: String,
  email: String,
  password: String,
  nextOfKinFullName: String,
  nextOfKinAddress: String,
  nextOfKinDateOfBirth: String,
  nextOfKinSocialSecurityNumber: String,
  nextOfKinEmail: String,
  nextOfKinPassword: String,
  nextOfKinCardholderName: String,
  nextOfKinBillingAddress: String,
  nextOfKinBillingCity: String,
  nextOfKinBillingState: String,
  nextOfKinBillingZip: String,
  nextOfKinCreditCardNumber: String,
  nextOfKinCreditCardExpiryMonth: String,
  nextOfKinCreditCardExpiryYear: String,
  nextOfKinCreditCardCVV: String,
  cardholderName: String,
  billingAddress: String,
  billingCity: String,
  billingState: String,
  billingZip: String,
  creditCardNumber: String,
  creditCardExpiryMonth: String,
  creditCardExpiryYear: String,
  creditCardCVV: String,
})

const userModel: Model<MyUser> = model<MyUser>('User', myUsers);
export default userModel;