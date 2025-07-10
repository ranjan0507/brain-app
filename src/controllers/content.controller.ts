import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Response , NextFunction } from "express";
import { Content } from "../models/content.model";
import { Category } from "../models/category.model";
import { Tag } from "../models/tags.model";
import { createContentSchema, updateContentSchema } from "../schemas/content.schemas";
import mongoose from "mongoose";

export const createContent = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const parsed = createContentSchema.safeParse(req.body) ;
		if(!parsed.success){
			res.status(400).json({
				error : parsed.error.format()
			}) ;
			return ;
		}
		const {title , link , type , tags = [] ,categoryId , categoryName} = parsed.data ;
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			}) ;
			return ;
		}

		let finalCategoryId : mongoose.Types.ObjectId ;
		if(categoryId){
			if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    			res.status(400).json({ message: "Invalid categoryId format" });
				return ;
 			}
			const cat = await Category.findOne({
				_id : categoryId ,
				userId : user._id 
			}) ;
			if(!cat){
				res.status(400).json({
					message : "Invalid category"
				}) ;
				return ;
			}
			finalCategoryId = cat._id as mongoose.Types.ObjectId;
		}
		else if (categoryName){
			let cat = await Content.findOne({
				name : categoryName ,
				userId : user._id
			}) ;
			if(!cat){
				cat = await Content.create({
					name : categoryName ,
					userId : user._id 
				}) ;
			}
			finalCategoryId = cat._id as mongoose.Types.ObjectId ;
		}
		else{
			res.status(400).json({
				message : "Category ID or name is required"
			}) ;
			return ;
		}

		const tagIds : mongoose.Types.ObjectId[] = [] ;
		for (const t of tags){
			if(mongoose.Types.ObjectId.isValid(t)){
				const found = await Tag.findById(t) ;
				if(found) tagIds.push(found._id as mongoose.Types.ObjectId) ;
			}
		}

		const content = await Content.create({
			title : title ,
			link : link ,
			type : type ,
			tags : tagIds ,
			userId : user._id ,
			categoryId : finalCategoryId
		}) ;

		res.status(201).json({
			content : content
		})

	} catch (error) {
		res.status(500).json({
			message : "Failed to create content" ,
			error : error
		})
	}
}

export const getUserContent = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "Unauthorized"
			});
			return ;
		}

		const {categoryId , tagId , type} = req.query ;
		const filter : any = {userId : user._id} ;
		if(typeof categoryId === "string" && mongoose.Types.ObjectId.isValid(categoryId)){
			filter.categoryId = categoryId ;
		}
		if(typeof tagId === "string" && mongoose.Types.ObjectId.isValid(tagId)){
			filter.tags = tagId ;
		}
		if(typeof type === "string"){
			filter.type = type ;
		}

		const contents = await Content.find(filter)
			.populate("categoryId","name")
			.populate("tags","title")
			.sort({createdAt : -1}) ;
		res.status(200).json({
			contents : contents
		})
	} catch (error) {
		res.status(500).json({
			message : "Error fetching content" ,
			error : error
		})
	}
}

export const updateContent = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			}) ;
			return ;
		}
		const {contentId} = req.params ;
		const parsed = updateContentSchema.safeParse(req.body) ;
		if(!parsed.success){
			res.status(400).json({
				error : parsed.error.format() 
			})
			return ;
		}
		const {title,link,type,tags,categoryId} = parsed.data ;

		const content = await Content.findOne({
			userId : user._id ,
			_id : contentId
		})
		if(!content){
			res.status(404).json({
				message : "content not found"
			}) ;
			return ;
		}
		if(title) content.title = title ;
		if(link) content.link = link ;
		if(type) content.type = type ;
		if(Array.isArray(tags)){
			const tagIds : mongoose.Types.ObjectId[] = tags
				.filter(t => mongoose.Types.ObjectId.isValid(t))
				.map(t => new mongoose.Types.ObjectId(t)) ;
			content.tags = tagIds ;
		}
		if(categoryId && mongoose.Types.ObjectId.isValid(categoryId)){
			content.categoryId = new mongoose.Types.ObjectId(categoryId) ;
		}
		await content.save() ;
		res.status(200).json({
			content : content
		})
		return ;
	} catch (error) {
		res.status(500).json({
			message : "Failed to update content" ,
			error : error
		})
	}
}

export const deleteContent = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const {contentId} = req.params ;
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "Unauthorized"
			}) ;
			return ;
		}

		const deleted = await Content.findOneAndDelete({
			_id : contentId ,
			userId : user._id
		}) ;
		if(!deleted){
			res.status(404).json({
				message : "Content not found"
			}) ;
			return ;
		}
		res.status(200).json({
			message : "Content deleted"
		})
	} catch (error) {
		res.status(500).json({
			message : "Failed to update content" ,
			error : error
		})
	}
}