import { Document, Schema, Model, model } from 'mongoose';

//Define the schema
interface MyUser extends Document {
    
}

const userSchema: Schema = new Schema({

});


const userModel: Model<MyUser> = model<MyUser>('User', userSchema);
export default userModel;