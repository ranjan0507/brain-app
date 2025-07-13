import mongoose from "mongoose";
import crypto from "crypto" ;
import { Link } from "../models/link.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Response , NextFunction } from "express";
import { createLinkSchema } from "../schemas/link.schema";
import { Content } from "../models/content.model";

const generateHash = () : string => crypto.randomBytes(4).toString("hex") ;

const BASE_URL = process.env.BASE_URL || "http://localhost:3000" ;

export const generateLink = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const parsed = createLinkSchema.safeParse(req.body) ;
		if(!parsed.success){
			res.status(400).json({
				error : parsed.error.format()
			})
			return ;
		}
		const {contentId} = parsed.data ;
		const user = req.user ;
		if(!user){
			res.status(401).json({
				message : "unauthorized"
			})
			return ;
		}
		if(!mongoose.Types.ObjectId.isValid(contentId)){
			res.status(400).json({
				message : "Invalid contentId format"
			})
			return ;
		}
		const content = await Content.findOne({
			userId : user._id , 
			_id : contentId
		}) ;
		if(!content){
			res.status(404).json({
				message : "Content not found"
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
			contentId : contentId
		}) ;
		res.status(201).json({
			link : {
				hash : link.hash ,
				contentId : link.contentId ,
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
		}).populate<{ contentId: { link?: string } }>("contentId")
		if(!link || !link.contentId){
			res.status(404).json({
				message : "Link not found"
			})
			return ;
		}
		const target = link.contentId.link ;
		if(!target){
			res.status(400).json({
				message : "No content for this link"
			})
			return ;
		}
		res.redirect(target) ;
	} catch (error) {
		res.status(500).json({
			error : error
		})
	}
}