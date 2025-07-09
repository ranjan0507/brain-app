import { User } from "../models/user.model";
import { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken" ;
import bcrypt from "bcrypt"

const JWT_SECRET = process.env.JWT_SECRET!;
if(!JWT_SECRET) throw new Error("jwt secret not defined") ;

export const registerUser  = async (req : Request , res : Response , next : NextFunction) => {
	try {
		const {username , password} = req.body ;

		const existingUser = await User.findOne({
			username : username 
		})
		if(existingUser){
			return res.status(400).json({
				message : "username already taken"
			})
		}

		const hashedPass = await bcrypt.hash(password,10) ;

		const user = await User.create({
			username : username ,
			password : hashedPass
		}) ;

		const token = jwt.sign({
			id : user._id 
		} , JWT_SECRET , {expiresIn:"7d"}) ;

		res.status(201).json({
			user : {
				id : user._id ,
				username : user.username
			} ,
			token : token ,
			message : "signed in"
		})
	} catch (error) {
		res.status(500).json({ 
			error: "Registration failed",
			details: error 
		});
	}
}

export const loginUser = async (req : Request , res : Response , next : NextFunction) => {
	try {
		const {username , password} = req.body ;

		const existingUser = await User.findOne({
			username : username 
		})
		if(!existingUser){
			return res.status(401).json({
				message : "invalid username" 
			})
		}

		const match = await bcrypt.compare(password,existingUser.password) ;
		if(!match){
			res.status(401).json({
				message : "incorrect password"
			})
		}

		const token = jwt.sign({
			id : existingUser._id 
		} , JWT_SECRET , { expiresIn : "7d" }) ;

		res.status(201).json({
			user : {
				id : existingUser._id ,
				username : existingUser.username
			} ,
			token : token ,
			message : "logged in"
		})
	} catch (error) {
		res.status(500).json({ 
			error: "Login failed", 
			details: error 
		});
	}
}