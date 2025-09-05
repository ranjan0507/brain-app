import mongoose from "mongoose";
import crypto from "crypto" ;
import { Link } from "../models/link.model.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { Response , NextFunction } from "express";
import { Content } from "../models/content.model.js";
import { User } from "../models/user.model.js";

const generateHash = () : string => crypto.randomBytes(4).toString("hex") ;

const BASE_URL = process.env.BASE_URL || "http://localhost:3000" ;

export const generateLink = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			})
			return ;
		}
		let hash : string ;
		let exists : boolean ;
		do{
			hash = generateHash() ;
			exists = !!(await Link.findOne({
				hash : hash
			})) ;
		}while(exists) ;

		const link = await Link.create({
			hash : hash , 
			userId : user._id , 
		}) ;
		res.status(201).json({
			link : {
				hash : link.hash ,
				url : `${BASE_URL}/link/${hash}`
			}
		}) ;

	} catch (error) {
		res.status(500).json({
			error : error
		})
	}
}

export const redirectByHash = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const {hash} = req.params ;
		const link = await Link.findOne({
			hash : hash
		})
		if(!link){
			res.status(404).json({
				message : "Link not found"
			})
			return ;
		}

		const user = await User.findOne({
			_id : link.userId
		})
		if(!user){
			res.status(411).json({
				message : "user not found!"
			}) ;
			return ;
		}

		const content = await Content.find({
			userId : link.userId 
		}) ;
		if(!content){
			res.status(400).json({
				message : "No content for this link"
			})
			return ;
		}
		
		res.json({
			username : user.username ,
			content : content
		})
	} catch (error) {
		res.status(500).json({
			error : error
		})
	}
}