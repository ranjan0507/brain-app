import { NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken" ;
import { User } from "../models/user.model";

export interface AuthenticatedRequest extends Request {
	user? : any
}

export const authenticate = async (req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	try {
		const authHeader = req.headers.authorization ;
		if(!authHeader || !authHeader.startsWith('Bearer ')){
			res.status(401).json({
				error : "Unauthorised"
			}) ;
			return ;
		}
		const token = authHeader?.split(' ')[1] ;
		const decoded = jwt.verify(token,process.env.JWT_SECRET!) as {id : string} ;
		const user = await User.findById(decoded.id).select("-password") ;
		if(!user){
			res.status(401).json({
				message : "user not found"
			}) ;
			return ;
		}
		req.user = user ;
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
}