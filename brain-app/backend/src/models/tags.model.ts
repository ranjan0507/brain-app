import mongoose from "mongoose";
import { Document,Schema } from "mongoose";

export interface ITag extends Document{
	title : string ;
}

const tagSchema = new Schema<ITag>({
	title : {
		type : String ,
		required : true ,
		unique : true 
	}
})

export const Tag = mongoose.model<ITag>('tags',tagSchema) ;