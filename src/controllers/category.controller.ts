import { Category } from "../models/category.model.js";
import { Request , Response , NextFunction } from "express";
import { createCategorySchema , updateCategorySchema } from "../schemas/category.schema.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

export const createCategory = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const parsed = createCategorySchema.safeParse(req.body) ;
		if(!parsed.success){
			res.status(400).json({
				error : parsed.error.format()
			}) ;
			return ;
		}
		const {name} = parsed.data ;
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			})
			return ;
		}
		const existing = await Category.findOne({
			name : name ,
			userId : user._id 
		})
		if(existing){
			res.status(200).json({
				category : existing ,
				message : "Already exists"
			})
			return ;
		}
		const category = await Category.create({
			name : name ,
			userId : user._id 
		}) ;
		res.status(201).json({
			category : category
		})
	} catch (error) {
		res.status(500).json({
			message : "server error" ,
			error : error
		})
	}
}

export const updateCategoryName = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const parsed = updateCategorySchema.safeParse(req.body) ;
		if(!parsed.success){
			res.status(400).json({
				error : parsed.error.format()
			}) ;
			return ;
		}
		const {name} = parsed.data ;
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			})
			return ;
		}	
		const {categoryId} = req.params ;
		const category = await Category.findOneAndUpdate(
			{_id : categoryId , userId : user._id} ,
			{name : name} ,
			{new : true}
		) ;
		if(!category){
			res.status(404).json({
				message : "Category not found"
			}) ;
			return ;
		}
		res.status(200).json({
			category : category
		})
	} catch (error) {
		res.status(500).json({
			message : "Server error" ,
			error : error
		})
	}
}

export const deleteCategory = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const user = req.user ;
		const {categoryId} = req.params ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			})
			return ;
		}
		const deleted = await Category.findOneAndDelete({
			_id : categoryId ,
			userId : user._id
		}) ;
		if(!deleted){
			res.status(404).json({
				message : "category not found"
			})
			return ;
		}
		res.status(200).json({
			message : "category deleted"
		})
	} catch (error) {
		res.status(500).json({
			message : "server error" ,
			error : error
		})
	}
}

export const getUserCategories = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			})
			return ;
		}		
		const categories = await Category.find({
			userId : user._id 
		})
		res.status(200).json({
			categories : categories
		})
	} catch (error) {
		res.status(500).json({
			message : "server error" ,
			error : error
		})		
	}
}