import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IUser extends Document {
	username : string ;
	password : string ;
}

const userSchema = new mongoose.Schema<IUser>({
	username : {
		required : true ,
		type : String ,
		unique : true
	} ,
	password : {
		required : true ,
		type : String
	}
} , {
	timestamps : true
})

export const User = mongoose.model<IUser>('users',userSchema) ;