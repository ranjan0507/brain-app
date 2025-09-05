import mongoose from "mongoose";
import { Document , Schema } from "mongoose";

export interface ICategory extends Document{
	name : string ;
	userId : mongoose.Types.ObjectId ;
}

const categorySchema = new Schema<ICategory>({
	name : {
		type : String ,
		required : true 
	} , 
	userId : {
		type : Schema.Types.ObjectId ,
		ref : "users" ,
		required : true 
	}
},{
	timestamps : true 
})

export const Category = mongoose.model<ICategory>("categories",categorySchema)