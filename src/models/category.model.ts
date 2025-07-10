import mongoose from "mongoose";
import { Document , Schema } from "mongoose";

export interface ICategory extends Document{
	title : string ;
	userId : mongoose.Types.ObjectId ;
}

const categorySchema = new Schema<ICategory>({
	title : {
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