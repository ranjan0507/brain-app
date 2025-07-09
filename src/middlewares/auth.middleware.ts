import jwt from "jsonwebtoken" ;
import { Request , Response , NextFunction } from "express";

export interface AuthenticatedRequest extends Request{
	user?: {
		id : string ;
	}
}

export const authenticate = ( req : AuthenticatedRequest , res : Response , next : NextFunction) => {
	const authHeader = req.headers.authorization ;
	if(!authHeader?.startsWith('Bearer ')){
		return res.status(401).json({
			message : "token missing"
		})
	}
	const token = authHeader.split(' ')[1] ;
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) ;
	} catch (error) {
		
	}
}